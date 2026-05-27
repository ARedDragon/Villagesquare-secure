// @ts-nocheck
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const store = require("./store");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const socketsByUser = new Map();
const gameState = new Map();
const sendRateLimits = new Map();   // socketId -> { count, resetAt }
const friendRateLimits = new Map(); // socketId -> { count, resetAt }

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

function sanitizeName(name) {
  // Handle: lowercase, trim, 2-20 chars; block "guest"
  const n = (name || "").trim().toLowerCase().slice(0, 20);
  if (n.length < 2) return null;
  if (n === "guest") return null;
  return n;
}

function sanitizeDisplayName(name) {
  const n = (name || "").trim().slice(0, 20);
  return n || null;
}

function nameKey(name) {
  return name.toLowerCase();
}

function isNameTaken(name, exceptSocketId) {
  const key = nameKey(name);
  for (const [id, n] of socketsByUser) {
    if (id !== exceptSocketId && nameKey(n) === key) return true;
  }
  return false;
}

function roomChannelId(room) {
  const r = (room || "general").trim().slice(0, 32) || "general";
  return `room:${r}`;
}

function channelLabel(channelId, myHandle) {
  if (channelId.startsWith("room:")) return "#" + channelId.slice(5);
  if (channelId.startsWith("dm:")) {
    const parts = channelId.slice(3).split("|");
    const otherHandle = parts.find((n) => n !== myHandle) || "";
    return otherHandle ? (store.getDisplayName(otherHandle) || otherHandle) : "Direct message";
  }
  return channelId;
}

function getOnlineUsers() {
  const handles = new Set();
  for (const handle of socketsByUser.values()) handles.add(handle);
  return [...handles]
    .sort((a, b) => a.localeCompare(b))
    .map((handle) => ({ handle, displayName: store.getDisplayName(handle) || handle, title: store.getTitle(handle) }));
}

function userRoom(name) {
  return `user:${name}`;
}

function dmParticipants(channelId) {
  if (!channelId.startsWith("dm:")) return [];
  return channelId.slice(3).split("|");
}

function getLocalIPs() {
  const ips = [];
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets) {
      if (net.family === "IPv4" && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

// Permanently privileged handle — can see all groups and peek any channel history
const ADMIN_HANDLE = "jaydenlian";

function makeGameId() {
  return `game-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function hashPin(pin) {
  return crypto.createHash("sha256").update(String(pin)).digest("hex");
}

// ── Collectables: physical item definitions ──────────────────────────────────────
const CARDS = [];

const CARD_MAP = Object.fromEntries(CARDS.map((c) => [c.id, c]));

// RARITY_BASE_RAP is tuned so that pack EV at buyback (75% of base) ≈ pack cost (10 tokens)
// EV check: 0.60×5 + 0.25×12 + 0.10×26 + 0.04×70 + 0.01×230 = 13.7; ×0.75 ≈ 10.3 ✓
const RARITY_BASE_RAP = { Common: 5, Uncommon: 12, Rare: 26, Epic: 70, Legendary: 230 };

const GACHA_POOL = [];
const RARITY_WEIGHTS = { Common: 60, Uncommon: 25, Rare: 10, Epic: 4, Legendary: 1 };
for (const card of CARDS) {
  const w = RARITY_WEIGHTS[card.rarity] || 1;
  for (let i = 0; i < w; i++) GACHA_POOL.push(card.id);
}

// 10% fee, floored to nearest 0.1
function calcFee(price) { return Math.floor(price * 10) / 100; }
function roundTokens(n) { return Math.floor(n * 10) / 10; }

function getCardRap(cardId) {
  const card = CARD_MAP[cardId];
  const base = card ? (RARITY_BASE_RAP[card.rarity] || 10) : 10;
  const sales = store.getRapSales(cardId);
  if (!sales.length) return base;
  const avg = sales.reduce((s, x) => s + x.price, 0) / sales.length;
  return Math.floor(avg * 10) / 10;
}

function listingWithCard(l) {
  return { ...l, card: CARD_MAP[l.cardId] || null, rap: getCardRap(l.cardId) };
}

// Returns only groups visible to a given user:
// – no creator (built-in groups) → always visible
// – user already has it in their chat list → visible
// – creator is the user's friend → visible
// – any persisted member is the user's friend → visible
function getFilteredGroupsForUser(username) {
  const myFriends = new Set(store.getFriends(username).map((n) => nameKey(n)));
  const myChats = new Set(store.getUserChats(username).map((c) => c.channelId));
  return store.getGroupsWithMeta().filter((g) => {
    if (!g.creator) return true;
    if (myChats.has(roomChannelId(g.name))) return true;
    if (myFriends.has(nameKey(g.creator))) return true;
    const members = store.getGroupMembers(g.name);
    return members.some((m) => myFriends.has(nameKey(m)));
  });
}

// Push each connected socket their own filtered groups list
function broadcastGroupsListToAll() {
  for (const [sid, uname] of socketsByUser) {
    const sock = io.sockets.sockets.get(sid);
    if (sock) sock.emit("groups-list", getFilteredGroupsForUser(uname));
  }
}

// Remove groups inactive for over 30 days
function purgeInactiveGroups() {
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const name of store.getGroups()) {
    if (name === "general") continue;
    const lastActivity = store.getGroupLastActivity(name);
    if (lastActivity > 0 && now - lastActivity > ONE_MONTH) {
      console.log(`[purge] Removing inactive group: ${name}`);
      store.removeGroup(name);
    }
  }
}

function rpsWinner(a, b) {
  if (a === b) return "tie";
  if (
    (a === "rock" && b === "scissors") ||
    (a === "scissors" && b === "paper") ||
    (a === "paper" && b === "rock")
  ) return "a";
  return "b";
}

const TRIVIA_QUESTIONS = [
  { q: "What does CPU stand for?", opts: ["A. Central Processing Unit", "B. Core Processing Utility", "C. Computer Power Unit", "D. Central Program Uplink"], ans: "A" },
  { q: "Which language is known as 'the language of the web'?", opts: ["A. Python", "B. Java", "C. JavaScript", "D. C++"], ans: "C" },
  { q: "What is 2 to the power of 10?", opts: ["A. 512", "B. 1000", "C. 1024", "D. 2048"], ans: "C" },
  { q: "What does HTTP stand for?", opts: ["A. HyperText Transfer Protocol", "B. High Transfer Tech Process", "C. Hyperlink Transfer Protocol", "D. HyperText Transport Path"], ans: "A" },
  { q: "Which data structure uses LIFO order?", opts: ["A. Queue", "B. Stack", "C. Heap", "D. Linked List"], ans: "B" },
  { q: "What symbol starts a comment in Python?", opts: ["A. //", "B. ##", "C. #", "D. /*"], ans: "C" },
  { q: "What is the binary for the decimal number 10?", opts: ["A. 1000", "B. 1010", "C. 1001", "D. 0110"], ans: "B" },
  { q: "Which company created JavaScript?", opts: ["A. Microsoft", "B. Google", "C. Netscape", "D. Apple"], ans: "C" },
  { q: "What does RAM stand for?", opts: ["A. Read-Access Memory", "B. Random-Access Memory", "C. Run-time Allocation Module", "D. Rapid Access Mechanism"], ans: "B" },
  { q: "What is the default port for HTTPS?", opts: ["A. 80", "B. 8080", "C. 443", "D. 22"], ans: "C" },
  { q: "Which sort has O(n log n) worst-case time?", opts: ["A. Bubble Sort", "B. Insertion Sort", "C. Quick Sort", "D. Merge Sort"], ans: "D" },
  { q: "What does 'git pull' do?", opts: ["A. Push local changes to remote", "B. Fetch and merge remote changes", "C. Delete a remote branch", "D. Clone a repository"], ans: "B" },
  { q: "Which HTML tag makes the largest heading?", opts: ["A. <h2>", "B. <h6>", "C. <h1>", "D. <head>"], ans: "C" },
  { q: "What is 'null' in JavaScript?", opts: ["A. A runtime error type", "B. An intentionally empty value", "C. An undeclared variable", "D. The number zero"], ans: "B" },
  { q: "What port does SSH use by default?", opts: ["A. TCP 21", "B. UDP 22", "C. TCP 22", "D. TCP 80"], ans: "C" },
  { q: "What does DNS stand for?", opts: ["A. Data Network Service", "B. Dynamic Name Server", "C. Domain Name System", "D. Distributed Node Socket"], ans: "C" },
  { q: "Which of these is NOT a JavaScript framework?", opts: ["A. React", "B. Vue", "C. Django", "D. Angular"], ans: "C" },
  { q: "What does 'var' vs 'let' differ in (JS)?", opts: ["A. Data type", "B. Scope", "C. Speed", "D. Nothing"], ans: "B" },
  { q: "How many bits are in a byte?", opts: ["A. 4", "B. 16", "C. 8", "D. 32"], ans: "C" },
  { q: "Which symbol is the logical AND in most languages?", opts: ["A. ||", "B. &&", "C. !", "D. ^^"], ans: "B" },
];

const TYPERACE_PHRASES = [
  "the quick brown fox jumps over the lazy dog",
  "code never lies comments sometimes do",
  "first solve the problem then write the code",
  "make it work make it right make it fast",
  "talk is cheap show me the code",
  "any sufficiently advanced technology is indistinguishable from magic",
  "the best error message is the one that never shows up",
  "with great power comes great responsibility",
  "simplicity is the soul of efficiency",
  "always code as if the person maintaining it is a maniac who knows where you live",
  "programs must be written for people to read not machines to execute",
  "debugging is twice as hard as writing the code in the first place",
];

function broadcastToChannel(channelId, event, payload) {
  const dmParts = dmParticipants(channelId);
  if (dmParts.length) {
    for (const p of dmParts) io.to(userRoom(p)).emit(event, payload);
  } else {
    io.to(channelId).emit(event, payload);
  }
}

function emitTokenUpdate(username, message) {
  io.to(userRoom(username)).emit("token-updated", {
    tokens: store.getTokens(username),
    nextTokenAt: store.getNextTokenAt(username),
    message: message || null,
  });
}

function awardGameTokens(gs, winnerName) {
  if (!gs || gs.tokensPot < 1) return;
  if (winnerName) {
    store.setTokens(winnerName, store.getTokens(winnerName) + gs.tokensPot);
    emitTokenUpdate(winnerName, `+${gs.tokensPot} token${gs.tokensPot > 1 ? "s" : ""} (wager win!) 🪙`);
  } else {
    // Tie — refund wagerAmount each
    const refund = Math.floor(gs.tokensPot / 2);
    if (gs.challenger && refund > 0) {
      store.setTokens(gs.challenger, store.getTokens(gs.challenger) + refund);
      emitTokenUpdate(gs.challenger, `+${refund} token${refund > 1 ? "s" : ""} (wager tie) 🪙`);
    }
    if (gs.opponent && refund > 0) {
      store.setTokens(gs.opponent, store.getTokens(gs.opponent) + refund);
      emitTokenUpdate(gs.opponent, `+${refund} token${refund > 1 ? "s" : ""} (wager tie) 🪙`);
    }
  }
}

function emitFriendsUpdate(username) {
  const friends = store.getFriends(username);
  io.to(userRoom(username)).emit("friends-updated", {
    friends,
    friendRequests: store.getFriendRequests(username),
    sentRequests: store.getSentFriendRequests(username),
    friendsWithNames: friends.map((h) => ({ handle: h, displayName: store.getDisplayName(h) || h })),
  });
}

// Rate limiter: max 15 messages per 3-second window
function checkRateLimit(socketId) {
  const now = Date.now();
  let rl = sendRateLimits.get(socketId);
  if (!rl || now > rl.resetAt) {
    rl = { count: 0, resetAt: now + 3000 };
    sendRateLimits.set(socketId, rl);
  }
  rl.count++;
  return rl.count <= 15;
}

// Rate limiter: max 10 friend/token actions per 60-second window
function checkFriendRateLimit(socketId) {
  const now = Date.now();
  let rl = friendRateLimits.get(socketId);
  if (!rl || now > rl.resetAt) {
    rl = { count: 0, resetAt: now + 60000 };
    friendRateLimits.set(socketId, rl);
  }
  rl.count++;
  return rl.count <= 10;
}

io.on("connection", (socket) => {
  socket.on("register", ({ handle, displayName, password, username, pin }) => {
    // Support legacy field names from older clients
    const rawHandle = handle || username;
    const rawPassword = password || pin;

    const name = sanitizeName(rawHandle);
    if (!name) {
      socket.emit("register-error", {
        message: "Enter a handle (2-20 chars, not 'Guest').",
      });
      return;
    }

    // Global login whitelist check (admin handle is always allowed)
    if (name !== ADMIN_HANDLE && !store.isJoinWhitelisted(name)) {
      socket.emit("register-error", {
        message: `@${name} is not whitelisted yet. Ask an admin to approve your handle.`,
      });
      return;
    }

    if (isNameTaken(name, socket.id)) {
      socket.emit("register-error", {
        message: `"${name}" is already online. Pick another handle.`,
      });
      return;
    }

    // Ban check
    const banEntry = store.getBan(name);
    if (banEntry) {
      if (banEntry.type === "perm") {
        socket.emit("register-error", { message: `@${name} is permanently banned.${banEntry.reason ? " Reason: " + banEntry.reason : ""}` });
        return;
      } else if (banEntry.type === "temp" && Date.now() < banEntry.until) {
        const until = new Date(banEntry.until).toLocaleString();
        socket.emit("register-error", { message: `@${name} is temporarily banned until ${until}.${banEntry.reason ? " Reason: " + banEntry.reason : ""}` });
        return;
      } else {
        store.removeBan(name); // expired
      }
    }

    // Password/PIN protection
    // Client pre-hashes with SHA-256 before sending — plaintext never leaves the browser.
    // We store and compare the received hash directly (no server-side re-hash).
    const existingPin = store.getPin(name);
    const pwStr = String(rawPassword || "").trim();
    if (existingPin) {
      if (!pwStr || pwStr !== existingPin) {
        socket.emit("register-pin-required", {
          message: pwStr
            ? `Wrong password for "@${name}". Try again.`
            : `"@${name}" is password-protected. Enter your password or PIN to sign in.`,
        });
        return;
      }
    } else if (pwStr) {
      // Store the client-side hash directly (already SHA-256)
      store.setPin(name, pwStr);
    }

    const prev = socketsByUser.get(socket.id);
    if (prev) socket.leave(userRoom(prev));

    socket.username = name;
    socketsByUser.set(socket.id, name);
    socket.join(userRoom(name));

    // Set display name: use provided on first join, then always use stored value
    if (!store.getDisplayName(name) || store.getDisplayName(name) === name) {
      const dn = sanitizeDisplayName(displayName) || name;
      store.setDisplayName(name, dn);
    }
    socket.displayName = store.getDisplayName(name);

    // Token system: set nextTokenAt on first ever login (5-min interval)
    if (!store.getNextTokenAt(name)) {
      store.setNextTokenAt(name, Date.now() + 5 * 60 * 1000);
    }
    const chats = store.getUserChats(name);
    const blocked = store.getUserBlocked(name);
    const adminUser = name === ADMIN_HANDLE;
    const friendHandles = store.getFriends(name);
    socket.emit("registered", {
      handle: name,
      username: name,
      displayName: socket.displayName,
      chats,
      groups: adminUser ? store.getGroupsWithMeta() : getFilteredGroupsForUser(name),
      blocked,
      friends: friendHandles,
      friendRequests: store.getFriendRequests(name),
      sentRequests: store.getSentFriendRequests(name),
      friendsWithNames: friendHandles.map((h) => ({ handle: h, displayName: store.getDisplayName(h) || h })),
      tokens: store.getTokens(name),
      nextTokenAt: store.getNextTokenAt(name),
      isAdmin: adminUser,
      missedMentions: store.getMissedMentions(name),
      title: store.getTitle(name),
    });
    store.clearMissedMentions(name);
    io.emit("online-users", getOnlineUsers());
  });

  // Admin-only: fetch full history of any channel without joining it
  socket.on("admin-view-channel", ({ channelId }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    if (!channelId) return;
    socket.emit("channel-history", {
      channelId,
      messages: store.getMessages(channelId),
      label: channelLabel(channelId, socket.username),
    });
  });

  // Admin: manage global join whitelist
  socket.on("admin-get-join-whitelist", () => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    socket.emit("admin-join-whitelist", store.getJoinWhitelist());
  });

  socket.on("admin-add-join-whitelist", ({ handle }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = sanitizeName(handle);
    if (!target) {
      socket.emit("admin-action-result", { ok: false, message: "Invalid handle (2-20 chars)." });
      return;
    }
    if (!store.addJoinWhitelist(target)) {
      socket.emit("admin-action-result", { ok: false, message: `@${target} is already whitelisted.` });
      return;
    }
    socket.emit("admin-action-result", { ok: true, message: `@${target} added to whitelist.` });
    socket.emit("admin-join-whitelist", store.getJoinWhitelist());
  });

  socket.on("admin-remove-join-whitelist", ({ handle }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = sanitizeName(handle);
    if (!target) {
      socket.emit("admin-action-result", { ok: false, message: "Invalid handle." });
      return;
    }
    if (target === ADMIN_HANDLE) {
      socket.emit("admin-action-result", { ok: false, message: "Cannot remove the admin handle." });
      socket.emit("admin-join-whitelist", store.getJoinWhitelist());
      return;
    }
    if (!store.removeJoinWhitelist(target)) {
      socket.emit("admin-action-result", { ok: false, message: `@${target} is not in whitelist.` });
      return;
    }
    socket.emit("admin-action-result", { ok: true, message: `@${target} removed from whitelist.` });
    socket.emit("admin-join-whitelist", store.getJoinWhitelist());
  });

  // Admin: give tokens to any user (from thin air, not admin’s balance)
  socket.on("admin-give-tokens", ({ targetHandle, amount }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = String(targetHandle || "").trim().toLowerCase();
    const amt = Math.max(1, Math.min(100000, parseInt(amount) || 0));
    if (!target || amt <= 0) return;
    const newBal = store.getTokens(target) + amt;
    store.setTokens(target, newBal);
    io.to(userRoom(target)).emit("token-updated", { tokens: newBal, message: `Admin gave you ${amt} 🪙!` });
    socket.emit("admin-action-result", { ok: true, message: `Gave ${amt} token(s) to @${target} (now ${newBal}).` });
  });

  // Admin: take tokens from any user
  socket.on("admin-take-tokens", ({ targetHandle, amount }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = String(targetHandle || "").trim().toLowerCase();
    const amt = Math.max(1, Math.min(100000, parseInt(amount) || 0));
    if (!target || amt <= 0) return;
    const current = store.getTokens(target);
    const taken = Math.min(current, amt);
    const newBal = current - taken;
    store.setTokens(target, newBal);
    io.to(userRoom(target)).emit("token-updated", { tokens: newBal, message: `Admin removed ${taken} token(s).` });
    socket.emit("admin-action-result", { ok: true, message: `Took ${taken} token(s) from @${target} (had ${current}, now ${newBal}).` });
  });

  // Admin: ban a user (perm or temp)
  socket.on("admin-ban", ({ targetHandle, type, duration, unit, reason }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = String(targetHandle || "").trim().toLowerCase();
    if (!target || target === ADMIN_HANDLE) { socket.emit("admin-action-result", { ok: false, message: "Invalid target." }); return; }
    let banData;
    if (type === "temp") {
      const dur = Math.max(1, parseInt(duration) || 1);
      const units = { m: 60 * 1000, h: 3600 * 1000, d: 86400 * 1000 };
      const until = Date.now() + dur * (units[unit] || units.h);
      banData = { type: "temp", until, reason: String(reason || "").slice(0, 200) };
    } else {
      banData = { type: "perm", reason: String(reason || "").slice(0, 200) };
    }
    store.setBan(target, banData);
    // Kick if currently online
    for (const [sid, uname] of socketsByUser) {
      if (uname.toLowerCase() === target) {
        const sock = io.sockets.sockets.get(sid);
        if (sock) {
          sock.emit("force-disconnect", { message: `You have been ${type === "temp" ? "temporarily" : "permanently"} banned.${reason ? " Reason: " + reason : ""}` });
          sock.disconnect(true);
        }
      }
    }
    const label = type === "temp" ? `temporarily banned for ${duration}${unit}` : "permanently banned";
    socket.emit("admin-action-result", { ok: true, message: `@${target} has been ${label}.` });
  });

  // Admin: unban
  socket.on("admin-unban", ({ targetHandle }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = String(targetHandle || "").trim().toLowerCase();
    if (!target) return;
    store.removeBan(target);
    socket.emit("admin-action-result", { ok: true, message: `@${target} has been unbanned.` });
  });

  // Admin: get ban list
  socket.on("admin-get-bans", () => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    socket.emit("admin-bans-list", store.getAllBans());
  });

  // Admin: set user title
  socket.on("admin-set-title", ({ targetHandle, title }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const handle = String(targetHandle || "").trim().toLowerCase();
    if (!handle) { socket.emit("admin-action-result", { ok: false, message: "No handle specified." }); return; }
    const t = title === "none" ? null : String(title || "").trim().toLowerCase();
    if (t !== null && !store.VALID_TITLES.includes(t)) {
      socket.emit("admin-action-result", { ok: false, message: "Invalid title." }); return;
    }
    store.setTitle(handle, t);
    // Notify the target user if online
    const targetSockets = [...io.sockets.sockets.values()].filter((s) => s.username === handle);
    for (const ts of targetSockets) ts.emit("title-updated", { title: t });
    io.emit("online-users", getOnlineUsers()); // refresh online list with new title
    socket.emit("admin-action-result", { ok: true, message: `Title ${t ? `"${t}"` : "removed"} for ${handle}.` });
  });

  // Admin: get all users list
  socket.on("admin-get-users", () => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const allUsers = store.getAllUsers();
    socket.emit("admin-users-list", allUsers.map((u) => ({
      handle: u.handle || u.username || u,
      displayName: store.getDisplayName(u.handle || u.username || u),
      tokens: store.getTokens(u.handle || u.username || u),
      title: store.getTitle(u.handle || u.username || u),
    })));
  });

  // Admin: delete any group
  socket.on("admin-delete-group", ({ groupName }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const gName = String(groupName || "").trim();
    if (!gName || gName === "general") { socket.emit("admin-action-result", { ok: false, message: "Cannot delete that group." }); return; }
    const channelId = roomChannelId(gName);
    store.removeGroup(gName);
    store.deleteChannelMessages(channelId);
    io.to(channelId).emit("chat-deleted", { channelId });
    io.socketsLeave(channelId);
    broadcastGroupsListToAll();
    socket.emit("admin-action-result", { ok: true, message: `Group #${gName} deleted.` });
  });

  socket.on("sync-chats", ({ chats }) => {
    if (!socket.username || !Array.isArray(chats)) return;
    const cleaned = chats
      .slice(0, 100)
      .map((c) => ({
        channelId: String(c.channelId || "").slice(0, 80),
        kind: c.kind === "dm" ? "dm" : "group",
        label: String(c.label || "").slice(0, 40),
        preview: String(c.preview || "").slice(0, 80),
        lastAt: c.lastAt || 0,
      }))
      .filter((c) => c.channelId);
    store.setUserChats(socket.username, cleaned);
  });

  socket.on("delete-chat", ({ channelId }) => {
    if (!socket.username || !channelId) return;
    store.removeUserChat(socket.username, channelId);
    if (channelId.startsWith("room:")) {
      store.removeGroupMember(channelId.slice(5), socket.username);
    }
    socket.emit("chat-deleted", { channelId });
  });

  socket.on("list-groups", () => {
    socket.emit("groups-list", getFilteredGroupsForUser(socket.username || ""));
  });

  socket.on("create-group", ({ name, passcode }) => {
    const roomName = (name || "").trim().slice(0, 32);
    if (!roomName) {
      socket.emit("group-error", { message: "Enter a group name." });
      return;
    }
    // Max 5 created groups per user
    const allMeta = store.getGroupsWithMeta();
    const createdCount = allMeta.filter((g) => g.creator && nameKey(g.creator) === nameKey(socket.username)).length;
    if (createdCount >= 5) {
      socket.emit("group-error", { message: "You can only create up to 5 groups." });
      return;
    }
    if (store.getGroups().includes(roomName)) {
      socket.emit("group-error", { message: `A group named "${roomName}" already exists. Join it instead.` });
      return;
    }
    const room = store.addGroup(roomName);
    if (!room) {
      socket.emit("group-error", { message: "Enter a group name." });
      return;
    }
    const meta = { creator: socket.username };
    if (passcode) {
      const p = String(passcode).trim().slice(0, 64);
      if (p) meta.passcode = p;
    }
    store.setGroupMeta(room, meta);
    store.addGroupMember(room, socket.username);
    store.setGroupLastActivity(room, Date.now());
    const channelId = roomChannelId(room);
    broadcastGroupsListToAll();
    socket.emit("group-ready", { channelId, name: room, label: "#" + room });
  });

  socket.on("join-group", ({ name, passcode }) => {
    const room = (name || "").trim().slice(0, 32);
    if (!room) {
      socket.emit("group-error", { message: "Enter a group name." });
      return;
    }
    const meta = store.getGroupMeta(room);
    if (meta.passcode) {
      const provided = String(passcode || "").trim();
      if (provided !== meta.passcode) {
        socket.emit("group-error", {
          message: "Wrong passcode.",
          needsPasscode: true,
          groupName: room,
        });
        return;
      }
    }
    // Blacklist check — applies to everyone including creator
    const blacklist = store.getGroupBlacklist(room);
    if (blacklist.map((n) => nameKey(n)).includes(nameKey(socket.username))) {
      socket.emit("group-error", { message: "You are not allowed to join this group." });
      return;
    }
    // Whitelist check — creator always bypasses
    const whitelist = store.getGroupWhitelist(room);
    if (
      whitelist.length > 0 &&
      meta.creator !== socket.username &&
      !whitelist.map((n) => nameKey(n)).includes(nameKey(socket.username))
    ) {
      socket.emit("group-error", { message: "This group is invite-only." });
      return;
    }
    store.addGroup(room);
    // Max 25 joined groups per user
    const allGroupMeta = store.getGroupsWithMeta();
    const joinedCount = allGroupMeta.filter((g) => store.getGroupMembers(g.name).some((m) => m.toLowerCase() === socket.username.toLowerCase())).length;
    if (joinedCount >= 25) {
      socket.emit("group-error", { message: "You can only be in up to 25 groups." });
      return;
    }
    store.addGroupMember(room, socket.username);
    store.setGroupLastActivity(room, Date.now());
    const channelId = roomChannelId(room);
    socket.emit("group-ready", { channelId, name: room, label: "#" + room });
  });

  // ── Group access management (creator only) ─────────────────────────────────

  function getGroupMemberNames(name) {
    const channelId = roomChannelId(name);
    const roomSockets = io.sockets.adapter.rooms.get(channelId) || new Set();
    const members = new Set();
    for (const sid of roomSockets) {
      const uname = socketsByUser.get(sid);
      if (uname && uname !== socket.username) members.add(uname);
    }
    return [...members].sort();
  }

  socket.on("group-get-settings", ({ name }) => {
    if (!socket.username || !name) return;
    const meta = store.getGroupMeta(name);
    if (meta.creator !== socket.username) {
      socket.emit("group-settings-error", { message: "Only the creator can manage this group." });
      return;
    }
    socket.emit("group-settings", {
      name,
      passcode: meta.passcode || null,
      whitelist: store.getGroupWhitelist(name),
      blacklist: store.getGroupBlacklist(name),
      members: getGroupMemberNames(name),
    });
  });

  socket.on("group-set-access", ({ name, whitelist, blacklist }) => {
    if (!socket.username || !name) return;
    const meta = store.getGroupMeta(name);
    if (meta.creator !== socket.username) return;
    if (Array.isArray(whitelist)) {
      store.setGroupWhitelist(name, whitelist.map((s) => String(s).trim().slice(0, 24)).filter(Boolean));
    }
    if (Array.isArray(blacklist)) {
      store.setGroupBlacklist(name, blacklist.map((s) => String(s).trim().slice(0, 24)).filter(Boolean));
    }
    socket.emit("group-settings", {
      name,
      passcode: store.getGroupMeta(name).passcode || null,
      whitelist: store.getGroupWhitelist(name),
      blacklist: store.getGroupBlacklist(name),
      members: getGroupMemberNames(name),
    });
  });

  socket.on("group-kick", ({ name, targetName, addBlacklist }) => {
    if (!socket.username || !name || !targetName) return;
    const meta = store.getGroupMeta(name);
    if (meta.creator !== socket.username) return;
    const target = String(targetName).trim().slice(0, 24);
    if (!target || nameKey(target) === nameKey(socket.username)) return;
    const channelId = roomChannelId(name);
    for (const [sid, uname] of socketsByUser) {
      if (nameKey(uname) === nameKey(target)) {
        const sock = io.sockets.sockets.get(sid);
        if (sock) sock.leave(channelId);
      }
    }
    if (addBlacklist) {
      const bl = store.getGroupBlacklist(name);
      if (!bl.map((n) => nameKey(n)).includes(nameKey(target))) {
        store.setGroupBlacklist(name, [...bl, target]);
      }
    }
    io.to(userRoom(target)).emit("kicked-from-group", {
      channelId,
      name,
      message: `You were removed from #${name} by the creator.`,
    });
    socket.emit("group-settings", {
      name,
      passcode: store.getGroupMeta(name).passcode || null,
      whitelist: store.getGroupWhitelist(name),
      blacklist: store.getGroupBlacklist(name),
      members: getGroupMemberNames(name),
    });
  });

  // ── Creator: delete own group ──────────────────────────────────────────────
  socket.on("creator-delete-group", ({ name }) => {
    if (!socket.username || !name) return;
    const gName = String(name).trim();
    if (!gName) return;
    const meta = store.getGroupMeta(gName);
    if (!meta.creator) {
      socket.emit("group-settings-error", { message: "Built-in groups cannot be deleted." });
      return;
    }
    if (nameKey(meta.creator) !== nameKey(socket.username)) {
      socket.emit("group-settings-error", { message: "Only the creator can delete this group." });
      return;
    }
    const channelId = roomChannelId(gName);
    store.removeGroup(gName);
    store.deleteChannelMessages(channelId);
    io.to(channelId).emit("chat-deleted", { channelId });
    io.socketsLeave(channelId);
    broadcastGroupsListToAll();
    socket.emit("group-deleted", { name: gName });
  });

  socket.on("join-channel", ({ channelId, withHistory }) => {
    if (!socket.username || !channelId) return;
    if (channelId.startsWith("room:")) {
      const gName = channelId.slice(5);
      store.addGroup(gName);
      store.addGroupMember(gName, socket.username);
    }
    socket.join(channelId);
    if (withHistory) {
      socket.emit("channel-history", {
        channelId,
        messages: store.getMessages(channelId),
        label: channelLabel(channelId, socket.username),
      });
    }
  });

  socket.on("send-message", ({ channelId, text }) => {
    if (!socket.username || !channelId) return;
    if (!checkRateLimit(socket.id)) {
      socket.emit("rate-limited", { message: "Slow down! Wait a moment before sending more.", cooldownMs: 3000 });
      return;
    }
    const body = String(text || "").trim().slice(0, 2000);
    if (!body) return;

    if (channelId.startsWith("room:")) {
      const gName = channelId.slice(5);
      store.addGroup(gName);
      store.setGroupLastActivity(gName, Date.now());
    }

    const msg = {
      id: `${Date.now()}-${socket.id}`,
      type: "chat",
      channelId,
      user: socket.username,
      displayName: socket.displayName || socket.username,
      title: store.getTitle(socket.username),
      text: body,
      time: new Date().toISOString(),
    };
    store.addMessage(channelId, msg);

    // Detect @mentions and notify offline users
    const mentionMatches = body.match(/@([a-z0-9_]{1,24})/gi) || [];
    for (const raw of mentionMatches) {
      const mentioned = raw.slice(1).toLowerCase();
      if (mentioned === socket.username) continue; // don't self-notify
      // Only notify if the user is registered and currently offline
      const allUsers = store.getAllUsers();
      const isRegistered = allUsers.some((u) => (u.handle || u.username) === mentioned);
      if (!isRegistered) continue;
      const isOnline = [...socketsByUser.values()].some((u) => u === mentioned);
      if (!isOnline) {
        store.addMissedMention(mentioned, {
          from: socket.displayName || socket.username,
          channelId,
          text: body.slice(0, 120),
          time: msg.time,
        });
      }
    }

    const dmParts = dmParticipants(channelId);
    if (dmParts.length) {
      // Persist the DM channel in both participants' stored chat lists so
      // offline recipients see the conversation when they reconnect.
      const previewSender = (socket.displayName || socket.username) + ": " + body.slice(0, 80);
      const previewSelf   = "You: " + body.slice(0, 80);
      for (const p of dmParts) {
        const otherP  = dmParts.find((x) => x !== p) || p;
        const preview = p === socket.username ? previewSelf : previewSender;
        const label   = store.getDisplayName(otherP) || otherP;
        const saved   = store.getUserChats(p);
        if (!saved.some((c) => c.channelId === channelId)) {
          store.setUserChats(p, [{ channelId, kind: "dm", label, preview, lastAt: Date.now() }, ...saved].slice(0, 100));
        } else {
          store.setUserChats(p, saved.map((c) =>
            c.channelId === channelId ? { ...c, preview, lastAt: Date.now() } : c
          ));
        }
        const blocked = store.getUserBlocked(p);
        if (!blocked.includes(socket.username)) {
          io.to(userRoom(p)).emit("message", msg);
        }
      }
    } else {
      io.to(channelId).emit("message", msg);
    }
  });

  socket.on("delete-message", ({ channelId, messageId }) => {
    if (!socket.username || !channelId || !messageId) return;
    const msgs = store.getMessages(channelId);
    const msg = msgs.find((m) => m.id === messageId);
    if (!msg) return;
    // Own message or admin can delete
    if (msg.user !== socket.username && socket.username !== ADMIN_HANDLE) return;
    store.setMessages(channelId, msgs.filter((m) => m.id !== messageId));
    broadcastToChannel(channelId, "message-deleted", { channelId, messageId });
  });

  socket.on("block-user", ({ targetName }) => {
    if (!socket.username || !targetName) return;
    const target = String(targetName).trim().slice(0, 24);
    if (!target || target === socket.username) return;
    store.addUserBlocked(socket.username, target);
    socket.emit("blocked-updated", { blocked: store.getUserBlocked(socket.username) });
  });

  socket.on("unblock-user", ({ targetName }) => {
    if (!socket.username || !targetName) return;
    store.removeUserBlocked(socket.username, String(targetName).trim().slice(0, 24));
    socket.emit("blocked-updated", { blocked: store.getUserBlocked(socket.username) });
  });

  // ── Minigames ──────────────────────────────────────────────────────────────

  socket.on("game-challenge", ({ channelId, game, question, wager }) => {
    if (!socket.username || !channelId) return;
    const validGames = ["rps", "dice", "coinflip", "numberduel", "reaction", "mathduel", "trivia", "typerace"];
    const g = validGames.includes(game) ? game : "rps";
    // wager is a numeric token amount (0 = no wager)
    const wagerAmount = Math.max(0, Math.min(100, parseInt(wager) || 0));
    const gameId = makeGameId();
    const gs = {
      game: g,
      channelId,
      challenger: socket.username,
      opponent: null,
      moves: {},
      status: "waiting",
      wagerAmount,
      tokensPot: 0,
    };
    gameState.set(gameId, gs);
    setTimeout(() => {
      const expiredGs = gameState.get(gameId);
      if (expiredGs && expiredGs.tokensPot > 0) {
        const refund = Math.floor(expiredGs.tokensPot / 2);
        if (expiredGs.challenger && refund > 0) {
          store.setTokens(expiredGs.challenger, store.getTokens(expiredGs.challenger) + refund);
          emitTokenUpdate(expiredGs.challenger, `+${refund} token${refund > 1 ? "s" : ""} (game expired) 🪙`);
        }
        if (expiredGs.opponent && refund > 0) {
          store.setTokens(expiredGs.opponent, store.getTokens(expiredGs.opponent) + refund);
          emitTokenUpdate(expiredGs.opponent, `+${refund} token${refund > 1 ? "s" : ""} (game expired) 🪙`);
        }
      }
      gameState.delete(gameId);
    }, 5 * 60 * 1000);

    const gameNames = { rps: "Rock Paper Scissors", dice: "Dice Duel", coinflip: "Coin Flip", numberduel: "Number Duel", reaction: "Reaction Race", mathduel: "Math Duel", trivia: "Trivia Duel", typerace: "Type Race" };
    const wagerNote = wagerAmount > 0 ? ` 🪙 wager: ${wagerAmount}` : "";
    const challengeText = `${socket.username} challenged to ${gameNames[g]}!${wagerNote}`;
    const challengeMsg = {
      id: `${Date.now()}-${socket.id}-challenge`,
      type: "game-challenge",
      channelId,
      user: socket.username,
      game: g,
      gameName: gameNames[g],
      gameId,
      wager: wagerAmount > 0,
      wagerAmount,
      time: new Date().toISOString(),
      text: challengeText,
    };
    store.addMessage(channelId, challengeMsg);
    broadcastToChannel(channelId, "message", challengeMsg);
  });

  socket.on("game-accept", ({ gameId }) => {
    if (!socket.username || !gameId) return;
    const gs = gameState.get(gameId);
    if (!gs || gs.status !== "waiting") {
      socket.emit("game-error", { message: "This challenge is no longer available." });
      return;
    }
    if (gs.challenger === socket.username) {
      socket.emit("game-error", { message: "You can't accept your own challenge." });
      return;
    }

    // Token wager check — must have enough BEFORE the game starts
    if (gs.wagerAmount > 0) {
      const cT = store.getTokens(gs.challenger);
      const oT = store.getTokens(socket.username);
      if (cT < gs.wagerAmount || oT < gs.wagerAmount) {
        socket.emit("game-error", { message: `Both players need ≥${gs.wagerAmount} token${gs.wagerAmount > 1 ? "s" : ""} for this wager.` });
        return;
      }
      store.setTokens(gs.challenger, cT - gs.wagerAmount);
      store.setTokens(socket.username, oT - gs.wagerAmount);
      gs.tokensPot = gs.wagerAmount * 2;
      emitTokenUpdate(gs.challenger);
      emitTokenUpdate(socket.username);
    }

    gs.opponent = socket.username;
    gs.status = "playing";

    if (gs.game === "coinflip") {
      const flip = Math.random() < 0.5 ? "Heads" : "Tails";
      const winnerName = Math.random() < 0.5 ? gs.challenger : gs.opponent;
      const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
      const resultMsg = {
        id: `${Date.now()}-coinflip-result`,
        type: "game-result",
        channelId: gs.channelId,
        user: "Game",
        game: "coinflip",
        gameId,
        text: `🪙 Coin Flip — ${flip}! ${winnerName} wins!${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, resultMsg);
      broadcastToChannel(gs.channelId, "message", resultMsg);
      awardGameTokens(gs, winnerName);
      gameState.delete(gameId);
      return;
    }

    if (gs.game === "numberduel") {
      gs.secret = Math.floor(Math.random() * 10) + 1;
      io.to(userRoom(gs.challenger)).emit("game-started", {
        gameId, game: "numberduel", gameName: "Number Duel", opponent: gs.opponent,
      });
      io.to(userRoom(gs.opponent)).emit("game-started", {
        gameId, game: "numberduel", gameName: "Number Duel", opponent: gs.challenger,
      });
      return;
    }

    if (gs.game === "dice") {
      const cRoll = Math.floor(Math.random() * 6) + 1;
      const oRoll = Math.floor(Math.random() * 6) + 1;
      let winnerName = null;
      let outcome;
      if (cRoll > oRoll) { outcome = `${gs.challenger} wins! (${cRoll} vs ${oRoll})`; winnerName = gs.challenger; }
      else if (oRoll > cRoll) { outcome = `${gs.opponent} wins! (${oRoll} vs ${cRoll})`; winnerName = gs.opponent; }
      else outcome = `Tie! Both rolled ${cRoll}`;
      const tokenNote = gs.tokensPot > 0 ? (winnerName ? ` 🪙×${gs.tokensPot}` : " (tokens refunded)") : "";
      const resultMsg = {
        id: `${Date.now()}-dice-result`,
        type: "game-result",
        channelId: gs.channelId,
        user: "Game",
        game: "dice",
        gameId,
        text: `🎲 Dice Duel — ${gs.challenger} rolled ${cRoll}, ${gs.opponent} rolled ${oRoll}. ${outcome}${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, resultMsg);
      broadcastToChannel(gs.channelId, "message", resultMsg);
      awardGameTokens(gs, winnerName);
      gameState.delete(gameId);
      return;
    }

    if (gs.game === "reaction") {
      gs.goSentAt = 0;
      const delay = Math.floor(Math.random() * 3000) + 2000; // 2–5 s
      io.to(userRoom(gs.challenger)).emit("game-started", {
        gameId, game: "reaction", gameName: "Reaction Race", opponent: gs.opponent,
      });
      io.to(userRoom(gs.opponent)).emit("game-started", {
        gameId, game: "reaction", gameName: "Reaction Race", opponent: gs.challenger,
      });
      setTimeout(() => {
        const cur = gameState.get(gameId);
        if (!cur || cur.status !== "playing") return;
        cur.goSentAt = Date.now();
        io.to(userRoom(cur.challenger)).emit("game-go", { gameId });
        io.to(userRoom(cur.opponent)).emit("game-go", { gameId });
      }, delay);
      return;
    }

    if (gs.game === "mathduel") {
      const ri = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
      const probs = [
        () => { const a = ri(10, 50), b = ri(10, 50); return { q: `${a} + ${b}`, ans: a + b }; },
        () => { const a = ri(20, 99), b = ri(1, a - 1); return { q: `${a} - ${b}`, ans: a - b }; },
        () => { const a = ri(2, 12), b = ri(2, 12); return { q: `${a} * ${b}`, ans: a * b }; },
      ];
      const { q, ans } = probs[Math.floor(Math.random() * probs.length)]();
      gs.mathProblem = q;
      gs.mathAnswer = ans;
      io.to(userRoom(gs.challenger)).emit("game-started", {
        gameId, game: "mathduel", gameName: "Math Duel", problem: gs.mathProblem, opponent: gs.opponent,
      });
      io.to(userRoom(gs.opponent)).emit("game-started", {
        gameId, game: "mathduel", gameName: "Math Duel", problem: gs.mathProblem, opponent: gs.challenger,
      });
      return;
    }

    if (gs.game === "trivia") {
      const tq = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
      gs.triviaQuestion = tq.q;
      gs.triviaOptions = tq.opts;
      gs.triviaAnswer = tq.ans;
      io.to(userRoom(gs.challenger)).emit("game-started", {
        gameId, game: "trivia", gameName: "Trivia Duel",
        question: gs.triviaQuestion, options: gs.triviaOptions, opponent: gs.opponent,
      });
      io.to(userRoom(gs.opponent)).emit("game-started", {
        gameId, game: "trivia", gameName: "Trivia Duel",
        question: gs.triviaQuestion, options: gs.triviaOptions, opponent: gs.challenger,
      });
      return;
    }

    if (gs.game === "typerace") {
      gs.typePhrase = TYPERACE_PHRASES[Math.floor(Math.random() * TYPERACE_PHRASES.length)];
      io.to(userRoom(gs.challenger)).emit("game-started", {
        gameId, game: "typerace", gameName: "Type Race", phrase: gs.typePhrase, opponent: gs.opponent,
      });
      io.to(userRoom(gs.opponent)).emit("game-started", {
        gameId, game: "typerace", gameName: "Type Race", phrase: gs.typePhrase, opponent: gs.challenger,
      });
      return;
    }

    // RPS (default pick-based game)
    const gameNames = { rps: "Rock Paper Scissors" };
    io.to(userRoom(gs.challenger)).emit("game-started", {
      gameId, game: gs.game, gameName: gameNames[gs.game] || gs.game, opponent: gs.opponent,
    });
    io.to(userRoom(gs.opponent)).emit("game-started", {
      gameId, game: gs.game, gameName: gameNames[gs.game] || gs.game, opponent: gs.challenger,
    });
  });

  socket.on("game-move", ({ gameId, move }) => {
    if (!socket.username || !gameId) return;
    const gs = gameState.get(gameId);
    if (!gs || gs.status !== "playing") return;
    if (socket.username !== gs.challenger && socket.username !== gs.opponent) return;

    // ── Math Duel: allows multiple attempts; first correct answer wins ───────
    if (gs.game === "mathduel") {
      const ans = parseInt(String(move), 10);
      if (isNaN(ans)) return;
      if (ans !== gs.mathAnswer) {
        socket.emit("game-wrong-answer", { gameId, message: "Wrong! Try again." });
        return;
      }
      const winnerName = socket.username;
      const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
      const result = {
        id: `${Date.now()}-mathduel`,
        type: "game-result", channelId: gs.channelId, user: "Game", game: "mathduel", gameId,
        text: `🧮 Math Duel — ${gs.mathProblem} = ${gs.mathAnswer}. ${winnerName} answered first!${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, result);
      broadcastToChannel(gs.channelId, "message", result);
      awardGameTokens(gs, winnerName);
      io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
      io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
      gameState.delete(gameId);
      return;
    }

    // ── Trivia Duel: first correct A/B/C/D answer wins ────────────────────────
    if (gs.game === "trivia") {
      const choice = String(move).toUpperCase().trim();
      if (!["A", "B", "C", "D"].includes(choice)) return;
      if (gs.moves[socket.username]) return; // already answered
      if (choice !== gs.triviaAnswer) {
        gs.moves[socket.username] = "wrong";
        socket.emit("game-wrong-answer", { gameId, message: "Wrong answer! Waiting for opponent…" });
        // If both answered wrong, pick random winner
        if (gs.moves[gs.challenger] === "wrong" && gs.moves[gs.opponent] === "wrong") {
          const winnerName = Math.random() < 0.5 ? gs.challenger : gs.opponent;
          const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
          const result = {
            id: `${Date.now()}-trivia`,
            type: "game-result", channelId: gs.channelId, user: "Game", game: "trivia", gameId,
            text: `🧠 Trivia Duel — Both got it wrong! The answer was ${gs.triviaAnswer}. ${winnerName} wins by luck!${tokenNote}`,
            time: new Date().toISOString(),
          };
          store.addMessage(gs.channelId, result);
          broadcastToChannel(gs.channelId, "message", result);
          awardGameTokens(gs, winnerName);
          io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
          io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
          gameState.delete(gameId);
        }
        return;
      }
      const winnerName = socket.username;
      const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
      const result = {
        id: `${Date.now()}-trivia`,
        type: "game-result", channelId: gs.channelId, user: "Game", game: "trivia", gameId,
        text: `🧠 Trivia Duel — "${gs.triviaQuestion}" (Answer: ${gs.triviaAnswer}) — ${winnerName} got it first!${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, result);
      broadcastToChannel(gs.channelId, "message", result);
      awardGameTokens(gs, winnerName);
      io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
      io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
      gameState.delete(gameId);
      return;
    }

    // ── Type Race: first to type the phrase correctly wins ────────────────────
    if (gs.game === "typerace") {
      const typed = String(move).trim().toLowerCase();
      if (typed !== gs.typePhrase.trim().toLowerCase()) {
        socket.emit("game-wrong-answer", { gameId, message: "Not quite — check spelling and try again!" });
        return;
      }
      const winnerName = socket.username;
      const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
      const result = {
        id: `${Date.now()}-typerace`,
        type: "game-result", channelId: gs.channelId, user: "Game", game: "typerace", gameId,
        text: `⌨️ Type Race — "${gs.typePhrase}" — ${winnerName} typed it first!${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, result);
      broadcastToChannel(gs.channelId, "message", result);
      awardGameTokens(gs, winnerName);
      io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
      io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
      gameState.delete(gameId);
      return;
    }

    // ── Reaction Race: server-timed, one tap per player ──────────────────────
    if (gs.game === "reaction") {
      if (move !== "react") return;
      if (gs.moves[socket.username] != null) return;
      if (!gs.goSentAt) {
        // Tapped before the go signal — this player loses
        const winnerName = socket.username === gs.challenger ? gs.opponent : gs.challenger;
        const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
        const result = {
          id: `${Date.now()}-reaction`,
          type: "game-result", channelId: gs.channelId, user: "Game", game: "reaction", gameId,
          text: `⚡ Reaction Race — ${socket.username} tapped too early! ${winnerName} wins!${tokenNote}`,
          time: new Date().toISOString(),
        };
        store.addMessage(gs.channelId, result);
        broadcastToChannel(gs.channelId, "message", result);
        awardGameTokens(gs, winnerName);
        io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
        io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
        gameState.delete(gameId);
        return;
      }
      gs.moves[socket.username] = Date.now();
      if (gs.moves[gs.challenger] != null && gs.moves[gs.opponent] != null) {
        const cMs = gs.moves[gs.challenger] - gs.goSentAt;
        const oMs = gs.moves[gs.opponent] - gs.goSentAt;
        const winnerName = cMs <= oMs ? gs.challenger : gs.opponent;
        const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
        const result = {
          id: `${Date.now()}-reaction`,
          type: "game-result", channelId: gs.channelId, user: "Game", game: "reaction", gameId,
          text: `⚡ Reaction Race — ${gs.challenger}: ${cMs}ms, ${gs.opponent}: ${oMs}ms. ${winnerName} wins!${tokenNote}`,
          time: new Date().toISOString(),
        };
        store.addMessage(gs.channelId, result);
        broadcastToChannel(gs.channelId, "message", result);
        awardGameTokens(gs, winnerName);
        io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
        io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
        gameState.delete(gameId);
      } else {
        socket.emit("game-waiting", { gameId });
      }
      return;
    }

    // ── All other games (RPS, Number Duel): one move per player ─────────────
    if (gs.moves[socket.username] != null) return;

    if (gs.game === "rps") {
      if (!["rock", "paper", "scissors"].includes(move)) return;
      gs.moves[socket.username] = move;
    } else if (gs.game === "numberduel") {
      const num = parseInt(move, 10);
      if (isNaN(num) || num < 1 || num > 10) return;
      gs.moves[socket.username] = num;
    } else {
      return;
    }

    if (gs.moves[gs.challenger] == null || gs.moves[gs.opponent] == null) {
      socket.emit("game-waiting", { gameId });
      return;
    }

    // Both moves are in — resolve
    if (gs.game === "rps") {
      const cMove = gs.moves[gs.challenger];
      const oMove = gs.moves[gs.opponent];
      const outcome = rpsWinner(cMove, oMove);
      const em = { rock: "🪨", paper: "📄", scissors: "✂️" };
      let resultText;
      let winnerName = null;
      if (outcome === "tie") {
        resultText = `Tie! Both picked ${em[cMove]} ${cMove}`;
      } else if (outcome === "a") {
        resultText = `${gs.challenger} wins! ${em[cMove]} beats ${em[oMove]}`;
        winnerName = gs.challenger;
      } else {
        resultText = `${gs.opponent} wins! ${em[oMove]} beats ${em[cMove]}`;
        winnerName = gs.opponent;
      }
      const tokenNote = gs.tokensPot > 0 ? (winnerName ? ` 🪙×${gs.tokensPot}` : " (tokens refunded)") : "";
      const resultMsg = {
        id: `${Date.now()}-rps-result`,
        type: "game-result",
        channelId: gs.channelId,
        user: "Game",
        game: "rps",
        gameId,
        text: `✂️ RPS — ${gs.challenger} picked ${em[cMove]}, ${gs.opponent} picked ${em[oMove]}. ${resultText}${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, resultMsg);
      broadcastToChannel(gs.channelId, "message", resultMsg);
      awardGameTokens(gs, winnerName);
      io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
      io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
      gameState.delete(gameId);
    } else if (gs.game === "numberduel") {
      const secret = gs.secret;
      const cNum = gs.moves[gs.challenger];
      const oNum = gs.moves[gs.opponent];
      const cDiff = Math.abs(cNum - secret);
      const oDiff = Math.abs(oNum - secret);
      let winnerName;
      let outcomeText;
      if (cDiff < oDiff) {
        winnerName = gs.challenger;
        outcomeText = `${gs.challenger} wins!`;
      } else if (oDiff < cDiff) {
        winnerName = gs.opponent;
        outcomeText = `${gs.opponent} wins!`;
      } else {
        winnerName = Math.random() < 0.5 ? gs.challenger : gs.opponent;
        outcomeText = `${winnerName} wins (tiebreaker)!`;
      }
      const tokenNote = gs.tokensPot > 0 ? ` 🪙×${gs.tokensPot}` : "";
      const ndMsg = {
        id: `${Date.now()}-numberduel-result`,
        type: "game-result",
        channelId: gs.channelId,
        user: "Game",
        game: "numberduel",
        gameId,
        text: `🔢 Number Duel — Secret was ${secret}. ${gs.challenger} picked ${cNum}, ${gs.opponent} picked ${oNum}. ${outcomeText}${tokenNote}`,
        time: new Date().toISOString(),
      };
      store.addMessage(gs.channelId, ndMsg);
      broadcastToChannel(gs.channelId, "message", ndMsg);
      awardGameTokens(gs, winnerName);
      io.to(userRoom(gs.challenger)).emit("game-result", { gameId });
      io.to(userRoom(gs.opponent)).emit("game-result", { gameId });
      gameState.delete(gameId);
    }
  });

  // ── Hourly token claim ─────────────────────────────────────────────────────────────
  socket.on("claim-token", () => {
    if (!socket.username) return;
    if (!checkFriendRateLimit(socket.id)) return;
    const now = Date.now();
    const nextAt = store.getNextTokenAt(socket.username);
    if (nextAt === 0 || now < nextAt) {
      const remaining = Math.max(0, nextAt - now);
      const mins = Math.ceil(remaining / 60000);
      socket.emit("token-error", { message: `Token not ready yet. Try again in ${mins} min.` });
      return;
    }
    store.setTokens(socket.username, store.getTokens(socket.username) + 1);
    const newNextAt = now + 5 * 60 * 1000;
    store.setNextTokenAt(socket.username, newNextAt);
    socket.emit("token-updated", {
      tokens: store.getTokens(socket.username),
      nextTokenAt: newNextAt,
      message: "+1 token claimed! 🪙",
    });
  });

  // ── Friends system ──────────────────────────────────────────────────────────
  socket.on("friend-request", ({ targetName }) => {
    if (!socket.username || !targetName) return;
    if (!checkFriendRateLimit(socket.id)) return;
    const target = String(targetName).trim().slice(0, 24);
    if (!target || nameKey(target) === nameKey(socket.username)) return;
    if (store.getFriends(socket.username).some((n) => nameKey(n) === nameKey(target))) return;
    // If target already sent us a request → auto-accept
    const myReqs = store.getFriendRequests(socket.username);
    const fromTarget = myReqs.find((n) => nameKey(n) === nameKey(target));
    if (fromTarget) {
      store.removeFriendRequest(socket.username, fromTarget);
      store.removeSentFriendRequest(fromTarget, socket.username);
      store.addFriend(socket.username, fromTarget);
      store.addFriend(fromTarget, socket.username);
      emitFriendsUpdate(socket.username);
      emitFriendsUpdate(fromTarget);
      io.to(userRoom(fromTarget)).emit("friend-accepted", { by: socket.username });
      return;
    }
    // Already sent a request?
    if (store.getSentFriendRequests(socket.username).some((n) => nameKey(n) === nameKey(target))) return;
    store.addFriendRequest(target, socket.username);
    store.addSentFriendRequest(socket.username, target);
    emitFriendsUpdate(socket.username);
    emitFriendsUpdate(target);
  });

  socket.on("friend-accept", ({ fromName }) => {
    if (!socket.username || !fromName) return;
    if (!checkFriendRateLimit(socket.id)) return;
    const reqs = store.getFriendRequests(socket.username);
    const exactFrom = reqs.find((n) => nameKey(n) === nameKey(String(fromName).trim()));
    if (!exactFrom) return;
    store.removeFriendRequest(socket.username, exactFrom);
    store.removeSentFriendRequest(exactFrom, socket.username);
    store.addFriend(socket.username, exactFrom);
    store.addFriend(exactFrom, socket.username);
    emitFriendsUpdate(socket.username);
    emitFriendsUpdate(exactFrom);
    io.to(userRoom(exactFrom)).emit("friend-accepted", { by: socket.username });
  });

  socket.on("friend-reject", ({ fromName }) => {
    if (!socket.username || !fromName) return;
    if (!checkFriendRateLimit(socket.id)) return;
    const reqs = store.getFriendRequests(socket.username);
    const exactFrom = reqs.find((n) => nameKey(n) === nameKey(String(fromName).trim()));
    if (!exactFrom) return;
    store.removeFriendRequest(socket.username, exactFrom);
    store.removeSentFriendRequest(exactFrom, socket.username);
    emitFriendsUpdate(socket.username);
    emitFriendsUpdate(exactFrom);
  });

  socket.on("friend-remove", ({ targetName }) => {
    if (!socket.username || !targetName) return;
    if (!checkFriendRateLimit(socket.id)) return;
    const target = String(targetName).trim().slice(0, 24);
    store.removeFriend(socket.username, target);
    store.removeFriend(target, socket.username);
    emitFriendsUpdate(socket.username);
    emitFriendsUpdate(target);
  });

  socket.on("donate-token", ({ targetName, amount }) => {
    if (!socket.username || !targetName) return;
    const target = String(targetName).trim().slice(0, 24);
    if (!target || nameKey(target) === nameKey(socket.username)) return;
    const amt = Math.min(Math.max(Math.floor(Number(amount) || 1), 1), 9999);
    const myTok = store.getTokens(socket.username);
    if (myTok < amt) {
      socket.emit("token-error", { message: `You only have ${myTok} token${myTok !== 1 ? "s" : ""} to donate.` });
      return;
    }
    store.setTokens(socket.username, myTok - amt);
    store.setTokens(target, store.getTokens(target) + amt);
    emitTokenUpdate(socket.username, `Sent ${amt} token${amt !== 1 ? "s" : ""} to ${target} 🪙`);
    emitTokenUpdate(target, `${socket.username} gifted you ${amt} token${amt !== 1 ? "s" : ""}! 🪙`);
  });

  // ── Collectables ─────────────────────────────────────────────────────────────────

  // Buy a pack: 10 tokens → random card
  socket.on("buy-pack", () => {
    if (!socket.username) return;
    const cost = 10;
    const bal = store.getTokens(socket.username);
    if (bal < cost) {
      socket.emit("card-error", { message: `Need ${cost} tokens to open a pack. You have ${bal}.` });
      return;
    }
    store.setTokens(socket.username, roundTokens(bal - cost));
    const cardId = GACHA_POOL[Math.floor(Math.random() * GACHA_POOL.length)];
    const card = CARD_MAP[cardId];
    const item = store.addCardToInventory(socket.username, cardId);
    emitTokenUpdate(socket.username, `Opened a pack! Got: ${card.emoji} ${card.name} [${card.rarity}]`);
    socket.emit("card-pulled", { item, card });
  });

  socket.on("get-inventory", () => {
    if (!socket.username) return;
    socket.emit("inventory", {
      items: store.getInventory(socket.username).map((item) => ({
        ...item,
        card: CARD_MAP[item.cardId] || null,
      })),
    });
  });

  socket.on("get-market", () => {
    if (!socket.username) return;
    socket.emit("market-data", {
      listings: store.getMarketListings().map(listingWithCard),
      raps: Object.fromEntries(CARDS.map((c) => [c.id, getCardRap(c.id)])),
      cards: CARDS,
    });
  });

  // List a card on the market
  socket.on("list-card", ({ instanceId, price }) => {
    if (!socket.username || !instanceId) return;
    const priceNum = Math.round(parseFloat(price) * 10) / 10;
    if (!priceNum || priceNum < 0.1 || priceNum > 100000) {
      socket.emit("card-error", { message: "Price must be between 0.1 and 100,000." }); return;
    }
    const item = store.getCardInstance(socket.username, instanceId);
    if (!item) { socket.emit("card-error", { message: "You don't own this card." }); return; }
    if (Date.now() < (item.listCooldownUntil || 0)) {
      const hoursLeft = Math.ceil((item.listCooldownUntil - Date.now()) / 3600000);
      socket.emit("card-error", { message: `This card has a ${hoursLeft}h listing cooldown.` }); return;
    }
    const alreadyListed = store.getMarketListings().some((l) => l.instanceId === instanceId);
    if (alreadyListed) { socket.emit("card-error", { message: "Card is already listed." }); return; }
    // Remove from inventory, create listing
    store.removeCardFromInventory(socket.username, instanceId);
    const listingId = `lst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const listing = { listingId, seller: socket.username, cardId: item.cardId, instanceId, price: priceNum, listedAt: Date.now() };
    store.addMarketListing(listing);
    socket.emit("card-listed", { listing: listingWithCard(listing) });
    io.emit("market-updated");
  });

  // Delist own card from market
  socket.on("delist-card", ({ listingId }) => {
    if (!socket.username || !listingId) return;
    const listing = store.getMarketListing(listingId);
    if (!listing || listing.seller !== socket.username) {
      socket.emit("card-error", { message: "Listing not found or not yours." }); return;
    }
    store.removeMarketListing(listingId);
    // Return card to inventory with 24h relist cooldown
    const item = store.addCardToInventory(socket.username, listing.cardId);
    store.setCardCooldown(socket.username, item.instanceId, Date.now() + 24 * 3600 * 1000);
    socket.emit("card-delisted", { instanceId: item.instanceId });
    io.emit("market-updated");
  });

  // Buy a card from market
  socket.on("buy-listing", ({ listingId }) => {
    if (!socket.username || !listingId) return;
    const listing = store.getMarketListing(listingId);
    if (!listing) { socket.emit("card-error", { message: "Listing no longer available." }); return; }
    if (listing.seller === socket.username) { socket.emit("card-error", { message: "Cannot buy your own listing." }); return; }
    const price = listing.price;
    const fee = calcFee(price);
    const sellerGets = roundTokens(price - fee);
    const buyerBal = store.getTokens(socket.username);
    if (buyerBal < price) {
      socket.emit("card-error", { message: `Need ${price} 🪙 but you have ${buyerBal}.` }); return;
    }
    store.setTokens(socket.username, roundTokens(buyerBal - price));
    store.setTokens(listing.seller, roundTokens(store.getTokens(listing.seller) + sellerGets));
    store.removeMarketListing(listingId);
    store.addCardToInventory(socket.username, listing.cardId);
    store.addRapSale(listing.cardId, price);
    const cardName = CARD_MAP[listing.cardId]?.name || listing.cardId;
    emitTokenUpdate(socket.username, `-${price} 🪙 bought ${cardName}`);
    emitTokenUpdate(listing.seller, `+${sellerGets} 🪙 sold ${cardName} (fee: ${fee})`);
    socket.emit("listing-bought", { cardId: listing.cardId, card: CARD_MAP[listing.cardId] });
    io.emit("market-updated");
  });

  // Buyback: sell card to system at RAP (10% fee; does NOT affect RAP)
  socket.on("buyback-card", ({ instanceId }) => {
    if (!socket.username || !instanceId) return;
    const item = store.getCardInstance(socket.username, instanceId);
    if (!item) { socket.emit("card-error", { message: "You don't own this card." }); return; }
    const card = CARD_MAP[item.cardId];
    const baseRap = card ? (RARITY_BASE_RAP[card.rarity] || 5) : 5;
    // Buyback is 75% of base RAP — does NOT use market RAP, does NOT affect RAP
    const payout = roundTokens(baseRap * 0.75);
    store.removeCardFromInventory(socket.username, instanceId);
    store.setTokens(socket.username, roundTokens(store.getTokens(socket.username) + payout));
    const cardName = card?.name || item.cardId;
    emitTokenUpdate(socket.username, `+${payout} 🪙 buyback: ${cardName} (base ${baseRap} × 75%)`);
    socket.emit("card-sold", { instanceId, payout, baseRap });
  });

  // ── Trading ────────────────────────────────────────────────────────────────────

  socket.on("send-trade", ({ instanceId, toUser, requestCardId }) => {
    if (!socket.username || !instanceId || !toUser) return;
    const target = String(toUser).trim().toLowerCase();
    if (target === socket.username) { socket.emit("card-error", { message: "Can't trade with yourself." }); return; }
    const item = store.getCardInstance(socket.username, instanceId);
    if (!item) { socket.emit("card-error", { message: "You don't own this card." }); return; }
    const tradeId = `trade-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const trade = {
      tradeId,
      from: socket.username,
      to: target,
      offeredInstanceId: instanceId,
      offeredCardId: item.cardId,
      requestCardId: requestCardId ? String(requestCardId).trim() : null,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600 * 1000,
    };
    store.addTrade(trade);
    socket.emit("trade-sent", { tradeId });
    io.to(userRoom(target)).emit("trade-offer", {
      tradeId, from: socket.username,
      offeredCard: CARD_MAP[item.cardId],
      requestCard: requestCardId ? CARD_MAP[requestCardId] : null,
    });
  });

  socket.on("accept-trade", ({ tradeId, instanceId }) => {
    if (!socket.username || !tradeId) return;
    const trade = store.getTrade(tradeId);
    if (!trade || trade.to !== socket.username) { socket.emit("card-error", { message: "Trade not found." }); return; }
    if (Date.now() > trade.expiresAt) { store.removeTrade(tradeId); socket.emit("card-error", { message: "Trade offer expired." }); return; }
    const offeredItem = store.getCardInstance(trade.from, trade.offeredInstanceId);
    if (!offeredItem) { store.removeTrade(tradeId); socket.emit("card-error", { message: "The offered card is no longer available." }); return; }
    let receiverItem = null;
    if (instanceId) {
      receiverItem = store.getCardInstance(socket.username, instanceId);
      if (!receiverItem) { socket.emit("card-error", { message: "You don't own that card." }); return; }
    }
    // Swap: sender gets receiver's card (if any), receiver gets sender's card
    store.removeCardFromInventory(trade.from, trade.offeredInstanceId);
    store.addCardToInventory(socket.username, trade.offeredCardId);
    let toCardId = null;
    if (receiverItem) {
      toCardId = receiverItem.cardId;
      store.removeCardFromInventory(socket.username, instanceId);
      store.addCardToInventory(trade.from, toCardId);
    }
    store.removeTrade(tradeId);
    // Notify both — no RAP update
    io.to(userRoom(trade.from)).emit("trade-completed", {
      tradeId, withUser: socket.username,
      gotCard: toCardId ? CARD_MAP[toCardId] : null,
      sentCard: CARD_MAP[trade.offeredCardId],
    });
    socket.emit("trade-completed", {
      tradeId, withUser: trade.from,
      gotCard: CARD_MAP[trade.offeredCardId],
      sentCard: toCardId ? CARD_MAP[toCardId] : null,
    });
  });

  socket.on("reject-trade", ({ tradeId }) => {
    if (!socket.username || !tradeId) return;
    const trade = store.getTrade(tradeId);
    if (!trade || trade.to !== socket.username) return;
    store.removeTrade(tradeId);
    io.to(userRoom(trade.from)).emit("trade-rejected", { tradeId, by: socket.username });
  });

  socket.on("cancel-trade", ({ tradeId }) => {
    if (!socket.username || !tradeId) return;
    const trade = store.getTrade(tradeId);
    if (!trade || trade.from !== socket.username) return;
    store.removeTrade(tradeId);
    io.to(userRoom(trade.to)).emit("trade-cancelled", { tradeId, by: socket.username });
    socket.emit("trade-cancelled", { tradeId });
  });

  socket.on("get-trades", () => {
    if (!socket.username) return;
    const trades = store.getTradesForUser(socket.username);
    const now = Date.now();
    // Clean up expired trades on access
    const active = trades.filter((t) => {
      if (t.expiresAt && now > t.expiresAt) { store.removeTrade(t.tradeId); return false; }
      return true;
    });
    socket.emit("trades-data", {
      incoming: active.filter((t) => t.to === socket.username).map((t) => ({
        ...t, offeredCard: CARD_MAP[t.offeredCardId] || null,
        requestCard: t.requestCardId ? CARD_MAP[t.requestCardId] : null,
      })),
      outgoing: active.filter((t) => t.from === socket.username).map((t) => ({
        ...t, offeredCard: CARD_MAP[t.offeredCardId] || null,
        requestCard: t.requestCardId ? CARD_MAP[t.requestCardId] : null,
      })),
    });
  });

  // Admin: give card to user
  socket.on("admin-give-card", ({ targetHandle, cardId }) => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    const target = String(targetHandle || "").trim().toLowerCase();
    const cid = String(cardId || "").trim();
    if (!target || !cid || !CARD_MAP[cid]) { socket.emit("admin-action-result", { ok: false, message: "Invalid target or card ID." }); return; }
    const item = store.addCardToInventory(target, cid);
    io.to(userRoom(target)).emit("card-received", { item, card: CARD_MAP[cid], message: `Admin gave you a ${CARD_MAP[cid].name}!` });
    socket.emit("admin-action-result", { ok: true, message: `Gave ${CARD_MAP[cid].name} to @${target}.` });
  });

  // Admin: get all users
  socket.on("admin-get-all-users", () => {
    if (!socket.username || socket.username !== ADMIN_HANDLE) return;
    socket.emit("admin-all-users", store.getAllUsers());
  });

  socket.on("change-display-name", ({ newName }) => {
    if (!socket.username) return;
    const dn = sanitizeDisplayName(newName);
    if (!dn) {
      socket.emit("change-name-error", { message: "Display name must be 1-32 characters." });
      return;
    }
    store.setDisplayName(socket.username, dn);
    socket.displayName = dn;
    socket.emit("display-name-changed", { displayName: dn });
    io.emit("online-users", getOnlineUsers());
  });

  socket.on("disconnect", () => {
    sendRateLimits.delete(socket.id);
    friendRateLimits.delete(socket.id);
    const name = socketsByUser.get(socket.id);
    socketsByUser.delete(socket.id);
    if (name) {
      // Grace period before updating the online list — smooths over page reloads
      // so users don't visually flicker out and back in within seconds.
      setTimeout(() => {
        const stillOnline = [...socketsByUser.values()].some(
          (n) => nameKey(n) === nameKey(name)
        );
        if (!stillOnline) io.emit("online-users", getOnlineUsers());
      }, 3000);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const ips = getLocalIPs();
  console.log("\n  Relay is running!\n");
  console.log(`  On this PC:     http://localhost:${PORT}`);
  for (const ip of ips) {
    console.log(`  Friends on WiFi: http://${ip}:${PORT}`);
  }
  console.log("  Messages save to data/store.json\n");
  // Purge groups inactive for over 30 days, then check daily
  purgeInactiveGroups();
  setInterval(purgeInactiveGroups, 24 * 60 * 60 * 1000);
});
