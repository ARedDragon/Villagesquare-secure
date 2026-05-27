const joinScreen = document.getElementById("join-screen");
const appEl = document.getElementById("app");
const usernameInput = document.getElementById("username");
const displayNameInput = document.getElementById("display-name-input");
const pinInput = document.getElementById("pin-input");
const joinBtn = document.getElementById("join-btn");
const joinError = document.getElementById("join-error");
const signOutBtn = document.getElementById("sign-out-btn");
const myNameLabel = document.getElementById("my-name-label");
const myHandleLabel = document.getElementById("my-handle-label");
const changeNameBtn = document.getElementById("change-name-btn");
const changeNameModal = document.getElementById("change-name-modal");
const closeChangeNameBtn = document.getElementById("close-change-name-btn");
const changeNameHandleLabel = document.getElementById("change-name-handle-label");
const changeNameInput = document.getElementById("change-name-input");
const changeNameError = document.getElementById("change-name-error");
const changeNameSaveBtn = document.getElementById("change-name-save-btn");
const groupsBtn = document.getElementById("groups-btn");
const chatListEl = document.getElementById("chat-list");
const chatListEmpty = document.getElementById("chat-list-empty");
const onlineListEl = document.getElementById("online-list");
const onlineEmpty = document.getElementById("online-empty");
const blockedListEl = document.getElementById("blocked-list");
const blockedEmpty = document.getElementById("blocked-empty");
const noChatEl = document.getElementById("no-chat");
const chatPanel = document.getElementById("chat-panel");
const chatTitle = document.getElementById("chat-title");
const chatSubtitle = document.getElementById("chat-subtitle");
const deleteChatBtn = document.getElementById("delete-chat-btn");
const blockChatBtn = document.getElementById("block-chat-btn");
const gamesBtn = document.getElementById("games-btn");
const gamesMenu = document.getElementById("games-menu");
const gamesDropdown = document.getElementById("games-dropdown");
const messagesEl = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
const groupsModal = document.getElementById("groups-modal");
const closeGroupsBtn = document.getElementById("close-groups-btn");
const groupsListEl = document.getElementById("groups-list");
const groupsListEmpty = document.getElementById("groups-list-empty");
const joinGroupInput = document.getElementById("join-group-input");
const joinGroupBtn = document.getElementById("join-group-btn");
const createGroupInput = document.getElementById("create-group-input");
const createGroupPasscodeInput = document.getElementById("create-group-passcode");
const createGroupBtn = document.getElementById("create-group-btn");
const groupError = document.getElementById("group-error");
const passcodeModal = document.getElementById("passcode-modal");
const closePasscodeBtn = document.getElementById("close-passcode-btn");
const passcodeGroupNameEl = document.getElementById("passcode-group-name");
const passcodeInput = document.getElementById("passcode-input");
const passcodeError = document.getElementById("passcode-error");
const passcodeSubmitBtn = document.getElementById("passcode-submit-btn");
const rpsModal = document.getElementById("rps-modal");
const rpsOpponentLabel = document.getElementById("rps-opponent-label");
const rpsStatus = document.getElementById("rps-status");
const numduelModal = document.getElementById("numduel-modal");
const numduelOpponentLabel = document.getElementById("numduel-opponent-label");
const numduelStatus = document.getElementById("numduel-status");
const eightballModal = document.getElementById("eightball-modal");
const eightballQuestionInput = document.getElementById("eightball-question-input");
const eightballSubmitBtn = document.getElementById("eightball-submit-btn");
const closeEightballBtn = document.getElementById("close-eightball-btn");
const groupSettingsBtn = document.getElementById("group-settings-btn");
const groupSettingsModal = document.getElementById("group-settings-modal");
const closeGsBtn = document.getElementById("close-gs-btn");
const gsGroupNameEl = document.getElementById("gs-group-name");
const gsMembersListEl = document.getElementById("gs-members-list");
const gsMembersEmpty = document.getElementById("gs-members-empty");
const gsWhitelistListEl = document.getElementById("gs-whitelist-list");
const gsWhitelistEmpty = document.getElementById("gs-whitelist-empty");
const gsWhitelistInput = document.getElementById("gs-whitelist-input");
const gsWhitelistAddBtn = document.getElementById("gs-whitelist-add-btn");
const gsBlacklistListEl = document.getElementById("gs-blacklist-list");
const gsBlacklistEmpty = document.getElementById("gs-blacklist-empty");
const gsBlacklistInput = document.getElementById("gs-blacklist-input");
const gsBlacklistAddBtn = document.getElementById("gs-blacklist-add-btn");
const gsError = document.getElementById("gs-error");
const themeBtn = document.getElementById("theme-btn");
const tokenDisplay = document.getElementById("token-display");
const tokenCount = document.getElementById("token-count");
const claimTokenBtn = document.getElementById("claim-token-btn");
const tokenTimerEl = document.getElementById("token-timer");
const tokenTimerLabel = document.getElementById("token-timer-label");
const friendsListEl = document.getElementById("friends-list");
const friendsEmpty = document.getElementById("friends-empty");
const friendReqBadge = document.getElementById("friend-req-badge");
const nicknameModal = document.getElementById("nickname-modal");
const nicknameTargetLabel = document.getElementById("nickname-target-label");
const nicknameInput = document.getElementById("nickname-input");
const nicknameSaveBtn = document.getElementById("nickname-save-btn");
const closeNicknameBtn = document.getElementById("close-nickname-btn");
const nicknameBtn = document.getElementById("nickname-btn");
const donateTokenDmBtn = document.getElementById("donate-token-dm-btn");
const wagerAmountInput = document.getElementById("wager-amount-input");
const gsPasscodeRow = document.getElementById("gs-passcode-row");
const gsPasscodeDisplay = document.getElementById("gs-passcode-display");
const reactionModal = document.getElementById("reaction-modal");
const reactionOpponentLabel = document.getElementById("reaction-opponent-label");
const reactionStatus = document.getElementById("reaction-status");
const reactionTapBtn = document.getElementById("reaction-tap-btn");
const mathduelModal = document.getElementById("mathduel-modal");
const mathduelOpponentLabel = document.getElementById("mathduel-opponent-label");
const mathduelProblem = document.getElementById("mathduel-problem");
const mathduelInput = document.getElementById("mathduel-input");
const mathduelSubmitBtn = document.getElementById("mathduel-submit-btn");
const mathduelStatus = document.getElementById("mathduel-status");
const triviaModal = document.getElementById("trivia-modal");
const triviaOpponentLabel = document.getElementById("trivia-opponent-label");
const triviaStatus = document.getElementById("trivia-status");
const triviaQuestion = document.getElementById("trivia-question");
const triviaOptBtns = () => document.querySelectorAll(".trivia-opt-btn");
const typeraceModal = document.getElementById("typerace-modal");
const typeraceOpponentLabel = document.getElementById("typerace-opponent-label");
const typeraceStatus = document.getElementById("typerace-status");
const typeracePhrase = document.getElementById("typerace-phrase");
const typeraceInput = document.getElementById("typerace-input");
const typeraceSubmitBtn = document.getElementById("typerace-submit-btn");
const typeraceFeedback = document.getElementById("typerace-feedback");

// ── Mentions banner ───────────────────────────────────────────────
const mentionsBanner = document.getElementById("mentions-banner");
const mentionsBannerText = document.getElementById("mentions-banner-text");
const mentionsDismissBtn = document.getElementById("mentions-dismiss-btn");

let socket = null;
let myName = ""; // permanent @handle
let myDisplayName = ""; // changeable display name
let isAdmin = false;
let activeChannelId = null;
let chats = [];
let messageCache = {};
let onlineUsers = [];
let knownGroups = [];
let syncTimer = null;
let blockedUsers = new Set();
let ignoredUsers = new Set(JSON.parse(localStorage.getItem("villagesquare-ignored") || "[]"));
let userTitles = {}; // handle.lower() -> title string
let filterEnabled = localStorage.getItem("villagesquare-filter") !== "off"; // on by default
let activeGameId = null;
let pendingPasscodeGroupName = null;
let gsCurrentGroup = null;
let gsCurrentWhitelist = [];
let gsCurrentBlacklist = [];
let pendingGameChannel = null;
let myFriends = [];
let friendRequests = [];
let sentFriendRequests = [];
let friendDisplayNames = {}; // handle.lower() -> displayName for offline friends
let myTokens = 0;
let nextTokenAt = 0;
let tokenTimerInterval = null;
let _connectFallback = null;
const _pageLoadTime = Date.now(); // used to ensure loading animation finishes before app is shown
let wagerAmount = 0;
let pendingNicknameTarget = null;
let nicknames = JSON.parse(localStorage.getItem("villagesquare-nicknames") || "{}");
let adminJoinWhitelist = [];

// ── Join Whitelist ─────────────────────────────────────────────────────────────
// Handles in this array can never be removed via the admin panel.
const _WHITELIST_PERMANENT = ["jaydenlian"];
let joinWhitelist = [];

function normalizeWhitelist(list) {
  const out = [];
  const seen = new Set();
  for (const item of list || []) {
    const handle = String(item || "").trim();
    if (!handle) continue;
    const key = handle.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(handle);
  }
  return out;
}

function loadWhitelist(opts) {
  const persist = !opts || opts.persist !== false;
  try {
    const raw  = localStorage.getItem("villagesquare-whitelist");
    const saved = raw ? JSON.parse(raw) : null;
    // Use the saved array if it's a valid array, otherwise start fresh.
    joinWhitelist = Array.isArray(saved) ? normalizeWhitelist(saved) : [];
  } catch (e) {
    joinWhitelist = [];
  }
  // Always guarantee permanent handles are present in memory.
  for (const h of _WHITELIST_PERMANENT) {
    if (!joinWhitelist.some((x) => x.toLowerCase() === h.toLowerCase())) {
      joinWhitelist.push(h);
    }
  }
  // Write the merged result back so localStorage is always initialised
  // (covers first-ever load and post-clear-storage recovery).
  if (persist) saveWhitelist();
}
function saveWhitelist() {
  try { localStorage.setItem("villagesquare-whitelist", JSON.stringify(joinWhitelist)); } catch (_) {}
}
function isWhitelisted(handle) {
  return joinWhitelist.some((h) => h.toLowerCase() === handle.toLowerCase());
}
function whitelistAdd(handle) {
  const trimmed = handle.trim();
  if (!trimmed || isWhitelisted(trimmed)) return false;
  joinWhitelist.push(trimmed);
  saveWhitelist();
  return true;
}
function whitelistRemove(handle) {
  if (_WHITELIST_PERMANENT.some((h) => h.toLowerCase() === handle.toLowerCase())) return false;
  joinWhitelist = joinWhitelist.filter((h) => h.toLowerCase() !== handle.toLowerCase());
  saveWhitelist();
  return true;
}
loadWhitelist({ persist: true });
// Keep in-memory list in sync if another tab/window changes the whitelist.
window.addEventListener("storage", (e) => {
  if (e.key === "villagesquare-whitelist") loadWhitelist({ persist: false });
});
// ──────────────────────────────────────────────────────────────────────────────

function roomChannelId(room) {
  const r = (room || "general").trim().slice(0, 32) || "general";
  return "room:" + r;
}

function dmChannelId(other) {
  const [x, y] = [myName, other].sort();
  return "dm:" + x + "|" + y;
}

// --- Friends localStorage cache ---
function saveFriendsCache() {
  if (!myName) return;
  try { localStorage.setItem("villagesquare-friends-" + myName, JSON.stringify(myFriends)); } catch (e) {}
}
function loadFriendsCache() {
  if (!myName) return [];
  try { return JSON.parse(localStorage.getItem("villagesquare-friends-" + myName) || "[]"); } catch (e) { return []; }
}
function clearFriendsCache() {
  if (!myName) return;
  try { localStorage.removeItem("villagesquare-friends-" + myName); } catch (e) {}
}

function channelLabel(channelId) {
  if (channelId.startsWith("room:")) return "#" + channelId.slice(5);
  if (channelId.startsWith("dm:")) {
    const other = dmOtherUser(channelId);
    return displayName(other) || "Direct message";
  }
  return channelId;
}

function displayName(handle) {
  // Local nickname override first
  if (nicknames[handle]) return nicknames[handle];
  // Check live online-users list (objects with handle+displayName)
  const found = onlineUsers.find((u) => (u.handle || u) === handle);
  if (found && found.displayName) return found.displayName;
  // Cached display name for offline friends
  if (friendDisplayNames[handle.toLowerCase()]) return friendDisplayNames[handle.toLowerCase()];
  return handle;
}

function dmOtherUser(channelId) {
  const parts = channelId.slice(3).split("|");
  return parts.find((n) => n !== myName) || "";
}

function showToast(html, duration) {
  const toast = document.createElement("div");
  toast.className = "token-toast";
  toast.innerHTML = html;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 350);
  }, duration || 3500);
}

function channelKind(channelId) {
  return channelId.startsWith("dm:") ? "dm" : "group";
}

// Hash a string with SHA-256 via Web Crypto API (keeps plaintext off the wire)
async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function showJoinError(msg) {
  joinError.textContent = msg;
  joinError.classList.toggle("hidden", !msg);
}

function showGroupError(msg) {
  groupError.textContent = msg;
  groupError.classList.toggle("hidden", !msg);
}

function chatsForSync() {
  return chats.map(({ channelId, kind, label, preview, lastAt }) => ({
    channelId,
    kind,
    label,
    preview,
    lastAt: lastAt || 0,
  }));
}

function scheduleSync() {
  if (!socket || !myName) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    socket.emit("sync-chats", { chats: chatsForSync() });
  }, 400);
}

function ensureChat(channelId) {
  let c = chats.find((x) => x.channelId === channelId);
  if (!c) {
    c = {
      channelId,
      kind: channelKind(channelId),
      label: channelLabel(channelId),
      preview: "",
      unread: 0,
      lastAt: 0,
    };
    chats.unshift(c);
    scheduleSync();
  }
  return c;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Safe for use inside HTML attribute values (e.g. data-*, title)
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function updatePageTitle() {
  const total = chats.reduce((n, c) => n + (c.unread || 0), 0);
  document.title = total > 0 ? `(${total}) VillageSquare` : "VillageSquare";
}

// ── Title badge ────────────────────────────────────────────────────────────────
const TITLE_META = {
  new:     { label: "NEW",     cls: "title-new" },
  verified:{ label: "✓",       cls: "title-verified" },
  dev:     { label: "DEV",     cls: "title-dev" },
  mod:     { label: "MOD",     cls: "title-mod" },
  staff:   { label: "STAFF",   cls: "title-staff" },
  pro:     { label: "PRO",     cls: "title-pro" },
  vip:     { label: "VIP",     cls: "title-vip" },
  og:      { label: "OG",      cls: "title-og" },
  elite:   { label: "ELITE",   cls: "title-elite" },
  founder: { label: "FOUNDER", cls: "title-founder" },
  legend:  { label: "LEGEND",  cls: "title-legend" },
  admin:   { label: "ADMIN",   cls: "title-admin" },
  creator: { label: "★",       cls: "title-creator" },
};
function titleBadgeHtml(title) {
  const m = title && TITLE_META[title];
  if (!m) return "";
  return `<span class="title-badge ${m.cls}">${m.label}</span>`;
}

function renderChatList() {
  chatListEl.innerHTML = "";
  const sorted = [...chats].sort((a, b) => {
    if (a.unread !== b.unread) return b.unread - a.unread;
    return (b.lastAt || 0) - (a.lastAt || 0);
  });

  chatListEmpty.classList.toggle("hidden", sorted.length > 0);

  for (const c of sorted) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "chat-item kind-" + c.kind + (c.channelId === activeChannelId ? " active" : "");
    const initial = c.label.replace("#", "").charAt(0).toUpperCase();
    btn.innerHTML =
      `<span class="avatar">${escapeHtml(initial)}</span>` +
      `<span class="info"><span class="name">${escapeHtml(c.label)}</span>` +
      `<span class="preview">${escapeHtml(c.preview || (c.kind === "dm" ? "Direct message" : "Group chat"))}</span></span>` +
      (c.unread ? `<span class="unread-badge">${c.unread > 9 ? "9+" : c.unread}</span>` : "");
    btn.addEventListener("click", () => openChat(c.channelId));
    li.appendChild(btn);
    chatListEl.appendChild(li);
  }
  updatePageTitle();
}

function renderGroupsList() {
  groupsListEl.innerHTML = "";
  const list = knownGroups.length ? knownGroups : [{ name: "general", locked: false }];
  groupsListEmpty.classList.toggle("hidden", list.length > 0);

  for (const item of list) {
    const name = typeof item === "string" ? item : item.name;
    const locked = typeof item === "object" && item.locked;
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "groups-pick-item";
    btn.innerHTML = `${locked ? "🔒 " : ""}#${escapeHtml(name)}`;
    btn.addEventListener("click", () => {
      if (locked) {
        pendingPasscodeGroupName = name;
        passcodeGroupNameEl.textContent = "#" + name;
        passcodeInput.value = "";
        passcodeError.classList.add("hidden");
        closeGroupsModal();
        passcodeModal.classList.remove("hidden");
        setTimeout(() => passcodeInput.focus(), 50);
      } else {
        joinGroupByName(name);
      }
    });
    li.appendChild(btn);
    groupsListEl.appendChild(li);
  }
}

function renderOnlineList() {
  onlineListEl.innerHTML = "";
  // onlineUsers may be [{ handle, displayName }] or legacy string[]
  const others = onlineUsers.filter((u) => (u.handle || u) !== myName);
  onlineEmpty.classList.toggle("hidden", others.length > 0);

  for (const u of others) {
    const handle = u.handle || u;
    const isBlocked = blockedUsers.has(handle);
    const isIgnored = ignoredUsers.has(handle.toLowerCase());
    const isFriend = myFriends.some((n2) => n2.toLowerCase() === handle.toLowerCase());
    const isPending = sentFriendRequests.some((n2) => n2.toLowerCase() === handle.toLowerCase());
    const hasIncoming = friendRequests.some((n2) => n2.toLowerCase() === handle.toLowerCase());
    const uTitle = u.title || userTitles[handle.toLowerCase()] || null;

    const li = document.createElement("li");
    li.className = "online-item-row";

    const msgBtn = document.createElement("button");
    msgBtn.type = "button";
    msgBtn.className = "online-item" + (isBlocked ? " is-blocked" : "") + (isIgnored ? " is-ignored" : "");
    msgBtn.innerHTML =
      (isBlocked ? `<span class="dot"></span><span>🚫 ${escapeHtml(displayName(handle))}</span>` :
       isIgnored ? `<span class="dot"></span><span>🔕 ${escapeHtml(displayName(handle))}</span>` :
       `<span class="dot"></span>${titleBadgeHtml(uTitle)}<span>${escapeHtml(displayName(handle))}</span>`);
    // Double-click to ignore (single click = DM as usual for non-blocked/ignored)
    if (!isBlocked && !isIgnored) {
      let _clickCount = 0, _clickTimer = null;
      msgBtn.addEventListener("click", () => {
        _clickCount++;
        if (_clickCount === 1) {
          _clickTimer = setTimeout(() => { _clickCount = 0; startDm(handle); }, 350);
        } else {
          clearTimeout(_clickTimer); _clickCount = 0;
          if (confirm(`Ignore ${handle}? Their messages will be hidden. You can unignore from the online list.`)) {
            ignoreUser(handle);
          }
        }
      });
    }
    li.appendChild(msgBtn);

    if (!isBlocked) {
      const friendBtn = document.createElement("button");
      friendBtn.type = "button";
      if (isFriend) {
        friendBtn.className = "add-friend-btn is-friend";
        friendBtn.textContent = "✓";
        friendBtn.title = "Friends";
        friendBtn.disabled = true;
      } else if (isPending) {
        friendBtn.className = "add-friend-btn";
        friendBtn.textContent = "⏳";
        friendBtn.title = "Request sent";
        friendBtn.disabled = true;
      } else if (hasIncoming) {
        friendBtn.className = "add-friend-btn";
        friendBtn.textContent = "↩ Accept";
        friendBtn.title = `Accept ${handle}'s friend request`;
        friendBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!socket) return;
          socket.emit("friend-accept", { fromName: handle });
        });
      } else {
        friendBtn.className = "add-friend-btn";
        friendBtn.textContent = "+";
        friendBtn.title = `Add ${handle} as friend`;
        friendBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!socket) return;
          socket.emit("friend-request", { targetName: handle });
        });
      }
      li.appendChild(friendBtn);
    }

    const blockBtn = document.createElement("button");
    blockBtn.type = "button";
    blockBtn.className = "block-user-btn" + (isBlocked ? " unblock" : "");
    blockBtn.title = isBlocked ? "Unblock " + handle : "Block " + handle;
    blockBtn.textContent = isBlocked ? "↩" : "✕";
    blockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isBlocked) unblockUser(handle);
      else blockUser(handle);
    });
    li.appendChild(blockBtn);

    if (isIgnored) {
      const unignoreBtn = document.createElement("button");
      unignoreBtn.type = "button";
      unignoreBtn.className = "block-user-btn unblock";
      unignoreBtn.title = "Unignore " + handle;
      unignoreBtn.textContent = "🔔";
      unignoreBtn.addEventListener("click", (e) => { e.stopPropagation(); unignoreUser(handle); });
      li.appendChild(unignoreBtn);
    }

    onlineListEl.appendChild(li);
  }
}

function renderBlockedList() {
  blockedListEl.innerHTML = "";
  const all = [...blockedUsers];
  blockedEmpty.classList.toggle("hidden", all.length > 0);
  for (const name of all) {
    const li = document.createElement("li");
    li.className = "online-item-row";
    const label = document.createElement("span");
    label.className = "online-item static";
    label.innerHTML = `<span class="dot blocked-dot"></span><span>${escapeHtml(name)}</span>`;
    const unblockBtn = document.createElement("button");
    unblockBtn.type = "button";
    unblockBtn.className = "block-user-btn unblock";
    unblockBtn.title = "Unblock " + name;
    unblockBtn.textContent = "\u21a9";
    unblockBtn.addEventListener("click", () => unblockUser(name));
    li.appendChild(label);
    li.appendChild(unblockBtn);
    blockedListEl.appendChild(li);
  }
}

function updateTokenDisplay() {
  if (!tokenDisplay) return;
  tokenDisplay.classList.toggle("hidden", !myName);
  if (tokenCount) tokenCount.textContent = myTokens;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  if (!claimTokenBtn || !tokenTimerEl || !tokenTimerLabel) return;
  if (!myName || nextTokenAt === 0) return;
  const now = Date.now();
  const remaining = nextTokenAt - now;
  if (remaining <= 0) {
    claimTokenBtn.classList.remove("hidden");
    tokenTimerEl.classList.add("hidden");
  } else {
    claimTokenBtn.classList.add("hidden");
    tokenTimerEl.classList.remove("hidden");
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    tokenTimerLabel.textContent = h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  }
}

function startTokenTimer(nextAt) {
  nextTokenAt = nextAt || 0;
  if (tokenTimerInterval) clearInterval(tokenTimerInterval);
  updateTimerDisplay();
  tokenTimerInterval = setInterval(updateTimerDisplay, 1000);
}

function renderFriendsList() {
  if (!friendsListEl) return;
  friendsListEl.innerHTML = "";
  const reqs = friendRequests || [];
  const friends = myFriends || [];
  const total = reqs.length + friends.length;
  if (friendsEmpty) friendsEmpty.classList.toggle("hidden", total > 0);
  if (friendReqBadge) {
    if (reqs.length > 0) {
      friendReqBadge.textContent = reqs.length;
      friendReqBadge.classList.remove("hidden");
    } else {
      friendReqBadge.classList.add("hidden");
    }
  }
  // Friend requests
  for (const name of reqs) {
    const li = document.createElement("li");
    li.className = "online-item-row";
    const label = document.createElement("span");
    label.className = "online-item static";
    label.innerHTML = `<span class="dot"></span><span>${escapeHtml(displayName(name))} wants to be friends</span>`;
    const acceptBtn = document.createElement("button");
    acceptBtn.type = "button";
    acceptBtn.className = "gs-btn accept";
    acceptBtn.textContent = "\u2713 Accept";
    acceptBtn.addEventListener("click", () => socket && socket.emit("friend-accept", { fromName: name }));
    const rejectBtn = document.createElement("button");
    rejectBtn.type = "button";
    rejectBtn.className = "gs-btn";
    rejectBtn.textContent = "\u2715";
    rejectBtn.addEventListener("click", () => socket && socket.emit("friend-reject", { fromName: name }));
    li.appendChild(label);
    li.appendChild(acceptBtn);
    li.appendChild(rejectBtn);
    friendsListEl.appendChild(li);
  }
  // Confirmed friends
  for (const name of friends) {
    const li = document.createElement("li");
    li.className = "online-item-row";
    const isOnline = onlineUsers.some((u) => (u.handle || u) === name);

    const nameBtn = document.createElement("button");
    nameBtn.type = "button";
    nameBtn.className = "online-item friend-row-name";
    nameBtn.innerHTML =
      `<span class="dot${isOnline ? "" : " offline-dot"}"></span>` +
      `<span class="friend-label-wrap">` +
        `<span class="friend-name-text">${escapeHtml(displayName(name))}</span>` +
        `<span class="friend-status-text">${isOnline ? "Online" : "Offline"}</span>` +
      `</span>`;
    nameBtn.addEventListener("click", () => startDm(name));

    const dmBtn = document.createElement("button");
    dmBtn.type = "button";
    dmBtn.className = "friend-dm-btn";
    dmBtn.textContent = "Message";
    dmBtn.title = `Message ${displayName(name)}`;
    dmBtn.addEventListener("click", () => startDm(name));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "block-user-btn";
    removeBtn.title = "Remove friend";
    removeBtn.textContent = "\u2715";
    removeBtn.addEventListener("click", (e) => { e.stopPropagation(); socket && socket.emit("friend-remove", { targetName: name }); });

    li.appendChild(nameBtn);
    li.appendChild(dmBtn);
    li.appendChild(removeBtn);
    friendsListEl.appendChild(li);
  }
}

function openNicknameModal(targetUser) {
  if (!nicknameModal) return;
  pendingNicknameTarget = targetUser;
  if (nicknameTargetLabel) nicknameTargetLabel.textContent = targetUser;
  if (nicknameInput) nicknameInput.value = nicknames[targetUser] || "";
  nicknameModal.classList.remove("hidden");
  setTimeout(() => nicknameInput && nicknameInput.focus(), 50);
}

function closeNicknameModal() {
  if (nicknameModal) nicknameModal.classList.add("hidden");
  pendingNicknameTarget = null;
}

function saveNickname() {
  if (!pendingNicknameTarget) return;
  const val = nicknameInput ? nicknameInput.value.trim().slice(0, 24) : "";
  if (val) {
    nicknames[pendingNicknameTarget] = val;
  } else {
    delete nicknames[pendingNicknameTarget];
  }
  localStorage.setItem("villagesquare-nicknames", JSON.stringify(nicknames));
  // Refresh labels
  renderOnlineList();
  renderFriendsList();
  renderChatList();
  if (activeChannelId && activeChannelId.startsWith("dm:")) {
    const other = dmOtherUser(activeChannelId);
    if (other === pendingNicknameTarget) chatTitle.textContent = displayName(other);
  }
  closeNicknameModal();
}

function renderMessages(channelId) {
  messagesEl.innerHTML = "";
  const list = messageCache[channelId] || [];
  const isDm = channelId.startsWith("dm:");
  for (const msg of list) {
    if (msg.type === "chat" && blockedUsers.has(msg.user)) continue;
    if (msg.type === "chat" && ignoredUsers.has(msg.user.toLowerCase())) continue;

    const li = document.createElement("li");

    if (msg.type === "game-challenge") {
      li.className = "msg game-challenge";
      const isChallenger = msg.user === myName;
      li.innerHTML =
        `<span class="meta">${formatTime(msg.time)}</span>` +
        `<span class="game-challenge-text">🎮 <strong>${escapeHtml(msg.user)}</strong> challenged to <strong>${escapeHtml(msg.gameName || msg.game)}</strong></span>` +
        (!isChallenger
          ? `<button type="button" class="accept-game-btn" data-gameid="${escapeAttr(msg.gameId)}">Accept</button>`
          : `<span class="muted-small">Waiting for someone to accept…</span>`);
    } else if (msg.type === "game-result") {
      li.className = "msg game-result";
      li.innerHTML =
        `<span class="meta">${formatTime(msg.time)}</span>` +
        `<span>${escapeHtml(msg.text)}</span>`;
    } else {
      const isMine = msg.user === myName;
      const msgTitle = msg.title || userTitles[msg.user.toLowerCase()] || null;
      li.className = "msg chat" + (isMine ? " mine" : "") + (isDm ? " dm" : "") + (isMine && msgTitle ? ` mine-${msgTitle}` : "");
      const senderLabel = msg.displayName || displayName(msg.user);
      const initial = senderLabel.charAt(0).toUpperCase();
      const filteredText = applyFilter(msg.text);
      li.innerHTML =
        `<div class="msg-author-row">` +
          `<span class="msg-avatar-sm${msgTitle ? ` avatar-${msgTitle}` : ""}">${escapeHtml(initial)}</span>` +
          titleBadgeHtml(msgTitle) +
          `<span class="msg-author-name">${escapeHtml(senderLabel)}</span>` +
          `<span class="meta">${formatTime(msg.time)}</span>` +
        `</div>` +
        `<span class="msg-text">${escapeHtml(filteredText)}</span>` +
        (isMine || isAdmin
          ? `<button type="button" class="delete-msg-btn" data-msgid="${escapeAttr(msg.id)}" title="Delete message">×</button>`
          : "");
    }
    messagesEl.appendChild(li);
  }

  messagesEl.querySelectorAll(".accept-game-btn").forEach((btn) => {
    btn.addEventListener("click", () => acceptGame(btn.dataset.gameid));
  });
  messagesEl.querySelectorAll(".delete-msg-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteMessage(btn.dataset.msgid));
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function closeSidebarMobile() {
  sidebar.classList.remove("open");
  sidebarBackdrop.classList.add("hidden");
}

function openSidebarMobile() {
  sidebar.classList.add("open");
  sidebarBackdrop.classList.remove("hidden");
}

function showNoChatPanel() {
  activeChannelId = null;
  noChatEl.classList.remove("hidden");
  chatPanel.classList.add("hidden");
}

function watchChannel(channelId) {
  if (socket) socket.emit("join-channel", { channelId, withHistory: false });
}

function openChat(channelId) {
  if (!socket) return;
  activeChannelId = channelId;
  // Persist so user returns to same channel after close/reopen
  try { localStorage.setItem("villagesquare-active-channel", channelId); } catch (_) {}
  const c = ensureChat(channelId);
  c.unread = 0;
  scheduleSync();
  renderChatList();

  noChatEl.classList.add("hidden");
  chatPanel.classList.remove("hidden");
  chatTitle.textContent = c.label;
  if (c.kind === "dm") {
    const otherUser = dmOtherUser(channelId);
    const isOnline = onlineUsers.some((u) => (u.handle || u) === otherUser);
    chatSubtitle.textContent = isOnline ? "● Online" : "○ Offline — messages saved for when they return";
    chatSubtitle.style.color = isOnline ? "var(--online)" : "";
  } else {
    chatSubtitle.textContent = "Square — messages stay saved for everyone";
    chatSubtitle.style.color = "";
  }

  // Block button + DM-specific buttons
  const isDm = channelId.startsWith("dm:");
  if (isDm) {
    const otherUser = dmOtherUser(channelId);
    blockChatBtn.classList.remove("hidden");
    updateBlockChatBtn(otherUser);
    if (nicknameBtn) {
      nicknameBtn.classList.remove("hidden");
      nicknameBtn.dataset.target = otherUser;
    }
    if (donateTokenDmBtn) {
      const isFriend = myFriends.some((n) => n.toLowerCase() === otherUser.toLowerCase());
      donateTokenDmBtn.classList.toggle("hidden", !isFriend);
      donateTokenDmBtn.dataset.target = otherUser;
    }
  } else {
    blockChatBtn.classList.add("hidden");
    if (nicknameBtn) nicknameBtn.classList.add("hidden");
    if (donateTokenDmBtn) donateTokenDmBtn.classList.add("hidden");
  }

  // Group settings button: visible only when you're the creator
  if (!isDm) {
    const groupName = channelId.slice(5);
    const gMeta = knownGroups.find((g) => g.name === groupName);
    if (gMeta && gMeta.creator === myName) {
      groupSettingsBtn.classList.remove("hidden");
      groupSettingsBtn.dataset.group = groupName;
    } else {
      groupSettingsBtn.classList.add("hidden");
    }
  } else {
    groupSettingsBtn.classList.add("hidden");
  }

  renderMessages(channelId);
  socket.emit("join-channel", { channelId, withHistory: true });
  messageInput.focus();
  closeSidebarMobile();
}

function cacheMessage(msg) {
  if (!messageCache[msg.channelId]) messageCache[msg.channelId] = [];
  const list = messageCache[msg.channelId];
  if (!list.some((m) => m.id === msg.id)) list.push(msg);
}

function handleIncomingMessage(msg) {
  if (messageCache[msg.channelId]?.some((m) => m.id === msg.id)) return;
  if (!chats.some((c) => c.channelId === msg.channelId)) watchChannel(msg.channelId);
  cacheMessage(msg);
  const c = ensureChat(msg.channelId);
  c.preview =
    (msg.user === myName ? "You: " : msg.user + ": ") + msg.text;
  c.preview = c.preview.slice(0, 80);
  c.lastAt = Date.now();

  if (msg.channelId === activeChannelId) {
    renderMessages(msg.channelId);
  } else {
    c.unread = (c.unread || 0) + 1;
  }
  scheduleSync();
  renderChatList();
}

function startDm(name) {
  const id = dmChannelId(name);
  ensureChat(id);
  watchChannel(id);
  scheduleSync();
  renderChatList();
  openChat(id);
}

function joinGroupByName(name) {
  if (!socket) return;
  showGroupError("");
  socket.emit("join-group", { name });
}

function openGroupsModal() {
  showGroupError("");
  groupsModal.classList.remove("hidden");
  if (socket) socket.emit("list-groups");
  else renderGroupsList();
}

function closeGroupsModal() {
  groupsModal.classList.add("hidden");
  showGroupError("");
}

function onGroupReady({ channelId, label }) {
  ensureChat(channelId);
  if (label) {
    const c = chats.find((x) => x.channelId === channelId);
    if (c) c.label = label;
  }
  watchChannel(channelId);
  scheduleSync();
  renderChatList();
  closeGroupsModal();
  closePasscodeModal();
  openChat(channelId);
}

function deleteActiveChat() {
  if (!activeChannelId || !socket) return;
  const label = channelLabel(activeChannelId);
  if (
    !confirm(
      `Remove "${label}" from your chat list?\n\nMessages stay on the server for groups. You can rejoin groups anytime.`
    )
  ) {
    return;
  }
  const id = activeChannelId;
  chats = chats.filter((c) => c.channelId !== id);
  delete messageCache[id];
  socket.emit("delete-chat", { channelId: id });
  scheduleSync();
  renderChatList();
  if (chats.length) openChat(chats[0].channelId);
  else showNoChatPanel();
}

function updateBlockChatBtn(otherName) {
  const isBlocked = blockedUsers.has(otherName);
  blockChatBtn.textContent = isBlocked ? "Unblock" : "Block";
  blockChatBtn.classList.toggle("active-block", isBlocked);
  blockChatBtn.dataset.target = otherName;
  blockChatBtn.dataset.blocked = isBlocked ? "1" : "0";
}

function blockUser(name) {
  if (!socket || !name) return;
  socket.emit("block-user", { targetName: name });
}

function unblockUser(name) {
  if (!socket || !name) return;
  socket.emit("unblock-user", { targetName: name });
}

function ignoreUser(name) {
  ignoredUsers.add(name.toLowerCase());
  try { localStorage.setItem("villagesquare-ignored", JSON.stringify([...ignoredUsers])); } catch (_) {}
  renderOnlineList();
  if (activeChannelId) renderMessages(activeChannelId);
}

function unignoreUser(name) {
  ignoredUsers.delete(name.toLowerCase());
  try { localStorage.setItem("villagesquare-ignored", JSON.stringify([...ignoredUsers])); } catch (_) {}
  renderOnlineList();
  if (activeChannelId) renderMessages(activeChannelId);
}

// ── Profanity filter ──────────────────────────────────────────────────────────
const _BAD_WORDS = [
  "fuck","shit","ass","bitch","cunt","dick","pussy","cock","whore","slut",
  "nigger","nigga","faggot","fag","retard","kike","spic","chink","wetback","cracker",
  "bastard","damn","hell","crap","piss","asshole","motherfucker","bullshit",
  "wanker","twat","prick","arse","bollocks","tosser",
];
const _FILTER_RE = new RegExp(
  "\\b(" + _BAD_WORDS.map((w) => w.split("").join("[^a-z0-9]*")).join("|") + ")\\b",
  "gi"
);
function applyFilter(text) {
  if (!filterEnabled) return text;
  return text.replace(_FILTER_RE, (m) => m[0] + "*".repeat(Math.max(1, m.length - 1)));
}

function deleteMessage(messageId) {
  if (!socket || !activeChannelId || !messageId) return;
  socket.emit("delete-message", { channelId: activeChannelId, messageId });
}

function acceptGame(gameId) {
  if (!socket || !gameId) return;
  socket.emit("game-accept", { gameId });
}

function submitPasscode() {
  const passcode = passcodeInput.value;
  if (!pendingPasscodeGroupName || !socket) return;
  passcodeError.classList.add("hidden");
  socket.emit("join-group", { name: pendingPasscodeGroupName, passcode });
}

function closePasscodeModal() {
  passcodeModal.classList.add("hidden");
  pendingPasscodeGroupName = null;
  passcodeInput.value = "";
  passcodeError.classList.add("hidden");
}

function closeRpsModal() {
  rpsModal.classList.add("hidden");
  activeGameId = null;
  document.querySelectorAll(".rps-pick-btn").forEach((b) => (b.disabled = false));
}

function closeNumduelModal() {
  numduelModal.classList.add("hidden");
  activeGameId = null;
  document.querySelectorAll(".num-pick-btn").forEach((b) => (b.disabled = false));
}

function closeReactionModal() {
  if (reactionModal) reactionModal.classList.add("hidden");
  reactionTapped = false;
  activeGameId = null;
}

function closeMathduelModal() {
  if (mathduelModal) mathduelModal.classList.add("hidden");
  if (mathduelInput) mathduelInput.value = "";
  if (mathduelStatus) mathduelStatus.textContent = "";
  activeGameId = null;
}

function closeTriviaModal() {
  if (triviaModal) triviaModal.classList.add("hidden");
  triviaOptBtns().forEach((b) => { b.disabled = false; b.classList.remove("wrong", "correct"); });
  activeGameId = null;
}

function closeTyperaceModal() {
  if (typeraceModal) typeraceModal.classList.add("hidden");
  if (typeraceInput) typeraceInput.value = "";
  if (typeraceFeedback) typeraceFeedback.textContent = "";
  activeGameId = null;
}

function closeEightballModal() {
  eightballModal.classList.add("hidden");
  pendingGameChannel = null;
  eightballQuestionInput.value = "";
}

// ── Group Settings ────────────────────────────────────────────

function openGroupSettings() {
  if (!socket || !activeChannelId || !activeChannelId.startsWith("room:")) return;
  const name = activeChannelId.slice(5);
  gsCurrentGroup = name;
  gsGroupNameEl.textContent = "#" + name;
  gsError.classList.add("hidden");
  gsMembersListEl.innerHTML = "";
  gsWhitelistListEl.innerHTML = "";
  gsBlacklistListEl.innerHTML = "";
  groupSettingsModal.classList.remove("hidden");
  socket.emit("group-get-settings", { name });
}

function closeGroupSettings() {
  groupSettingsModal.classList.add("hidden");
  gsCurrentGroup = null;
}

function renderGsAccessItem(name, onRemove) {
  const li = document.createElement("li");
  li.className = "gs-access-row";
  const span = document.createElement("span");
  span.className = "gs-member-name";
  span.textContent = name;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "gs-btn remove";
  btn.textContent = "Remove";
  btn.addEventListener("click", onRemove);
  li.appendChild(span);
  li.appendChild(btn);
  return li;
}

function renderGsSettings({ members, whitelist, blacklist, passcode }) {
  gsCurrentWhitelist = whitelist || [];
  gsCurrentBlacklist = blacklist || [];

  // Passcode display
  if (gsPasscodeDisplay) {
    gsPasscodeDisplay.textContent = passcode || "(none)";
  }
  if (gsPasscodeRow) gsPasscodeRow.classList.remove("hidden");

  // Members
  gsMembersListEl.innerHTML = "";
  gsMembersEmpty.classList.toggle("hidden", members.length > 0);
  for (const name of members) {
    const li = document.createElement("li");
    li.className = "gs-member-row";
    const span = document.createElement("span");
    span.className = "gs-member-name";
    span.textContent = name;
    const kickBtn = document.createElement("button");
    kickBtn.type = "button";
    kickBtn.className = "gs-btn kick";
    kickBtn.textContent = "Kick";
    kickBtn.addEventListener("click", () => {
      if (!socket || !gsCurrentGroup) return;
      socket.emit("group-kick", { name: gsCurrentGroup, targetName: name, addBlacklist: false });
    });
    const banBtn = document.createElement("button");
    banBtn.type = "button";
    banBtn.className = "gs-btn ban";
    banBtn.textContent = "Kick & Ban";
    banBtn.addEventListener("click", () => {
      if (!socket || !gsCurrentGroup) return;
      socket.emit("group-kick", { name: gsCurrentGroup, targetName: name, addBlacklist: true });
    });
    li.appendChild(span);
    li.appendChild(kickBtn);
    li.appendChild(banBtn);
    gsMembersListEl.appendChild(li);
  }

  // Whitelist
  gsWhitelistListEl.innerHTML = "";
  gsWhitelistEmpty.classList.toggle("hidden", whitelist.length > 0);
  for (const name of whitelist) {
    const li = renderGsAccessItem(name, () => {
      if (!socket || !gsCurrentGroup) return;
      socket.emit("group-set-access", {
        name: gsCurrentGroup,
        whitelist: gsCurrentWhitelist.filter((n) => n !== name),
      });
    });
    gsWhitelistListEl.appendChild(li);
  }

  // Blacklist
  gsBlacklistListEl.innerHTML = "";
  gsBlacklistEmpty.classList.toggle("hidden", blacklist.length > 0);
  for (const name of blacklist) {
    const li = renderGsAccessItem(name, () => {
      if (!socket || !gsCurrentGroup) return;
      socket.emit("group-set-access", {
        name: gsCurrentGroup,
        blacklist: gsCurrentBlacklist.filter((n) => n !== name),
      });
    });
    gsBlacklistListEl.appendChild(li);
  }

  // Show the delete-group button (only reachable by creator)
  const gsDeleteRow = document.getElementById("gs-delete-row");
  if (gsDeleteRow) gsDeleteRow.classList.remove("hidden");
}

function showApp() {
  if (_connectFallback) { clearTimeout(_connectFallback); _connectFallback = null; }
  const elapsed = Date.now() - _pageLoadTime;
  const minDelay = 3200; // match loading animation duration
  const remaining = Math.max(0, minDelay - elapsed);
  const loadingScreen = document.getElementById("loading-screen");
  const doShow = () => {
    if (loadingScreen) {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => loadingScreen.remove(), 600);
    }
    joinScreen.classList.add("hidden");
    appEl.classList.remove("hidden");
    myNameLabel.textContent = myDisplayName || myName;
    if (myHandleLabel) myHandleLabel.textContent = "@" + myName;
  };
  if (remaining > 0) setTimeout(doShow, remaining); else doShow();
}

function showJoin() {
  if (_connectFallback) { clearTimeout(_connectFallback); _connectFallback = null; }
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("fade-out");
    setTimeout(() => loadingScreen.remove(), 600);
  }
  appEl.classList.add("hidden");
  joinScreen.classList.remove("hidden");
  activeChannelId = null;
  if (tokenTimerInterval) { clearInterval(tokenTimerInterval); tokenTimerInterval = null; }
  nextTokenAt = 0;
  if (claimTokenBtn) claimTokenBtn.classList.add("hidden");
  if (tokenTimerEl) tokenTimerEl.classList.add("hidden");
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  // Re-apply handle lock state so the handle stays locked after sign-out too
  const lockedRow = document.getElementById("handle-locked-row");
  if (localStorage.getItem("villagesquare-name")) {
    usernameInput.value = localStorage.getItem("villagesquare-name");
    usernameInput.readOnly = true;
    usernameInput.classList.add("handle-locked");
    if (lockedRow) lockedRow.classList.remove("hidden");
  } else {
    usernameInput.readOnly = false;
    usernameInput.classList.remove("handle-locked");
    if (lockedRow) lockedRow.classList.add("hidden");
  }
}

function showLoginInfo(handle, rawPassword) {
  const panel = document.getElementById("login-info-panel");
  if (!panel) return;
  const hEl = document.getElementById("login-info-handle");
  const pEl = document.getElementById("login-info-password");
  const togBtn = document.getElementById("login-info-pw-toggle");
  if (hEl) hEl.textContent = "@" + handle;
  if (pEl) { pEl.value = rawPassword || ""; pEl.type = "password"; }
  if (togBtn) togBtn.textContent = "Show";
  panel.classList.remove("hidden");
}

async function connect() {
  showJoinError("");
  const name = usernameInput.value.trim();
  if (!name) {
    showJoinError("Enter a handle.");
    return;
  }

  // Show login info (handle + password preview) for the user
  const rawPwForDisplay = pinInput ? pinInput.value : "";
  showLoginInfo(name, rawPwForDisplay);

  myName = name;
  localStorage.setItem("villagesquare-name", myName);
  // Lock the handle input so the user can’t swap to a different one
  usernameInput.readOnly = true;
  usernameInput.classList.add("handle-locked");
  const lockedRowEl = document.getElementById("handle-locked-row");
  if (lockedRowEl) lockedRowEl.classList.remove("hidden");

  // Hash the password client-side so plaintext never leaves the browser
  const rawPw = pinInput ? pinInput.value.trim() : "";
  const password = rawPw ? await sha256hex(rawPw) : "";

  // If socket is already open waiting for PIN, just re-emit register
  if (socket && socket.connected) {
    socket.emit("register", { handle: myName, displayName: "", password });
    return;
  }

  if (typeof io === "undefined") {
    showJoinError("Cannot connect — the page may not have loaded fully. Try refreshing.");
    myName = "";
    return;
  }

  socket = io();

  socket.on("connect", () => {
    socket.emit("register", {
      handle: myName,
      displayName: displayNameInput ? displayNameInput.value.trim() : "",
      password,
    });
  });

  socket.on("register-error", ({ message }) => {
    showJoinError(message);
    socket.disconnect();
    socket = null;
  });

  socket.on("connect_error", () => {
    showJoin();
    showJoinError("Could not reach the server. Check your connection and try again.");
    socket = null;
  });

  socket.on("register-pin-required", ({ message }) => {
    showJoinError(message);
    if (pinInput) pinInput.focus();
    // Don't disconnect — let user re-submit with their PIN
  });

  socket.on("registered", ({ handle, username, displayName: dn, chats: serverChats, groups, blocked, friends, friendRequests: friendReqs, sentRequests, friendsWithNames, tokens, nextTokenAt: nat, isAdmin: adminFlag, missedMentions, title }) => {
    myName = handle || username;
    myDisplayName = dn || myName;
    isAdmin = !!adminFlag;
    myNameLabel.textContent = myDisplayName;
    if (myHandleLabel) myHandleLabel.textContent = "@" + myName;
    if (title) userTitles[myName.toLowerCase()] = title;
    knownGroups = groups || [];
    blockedUsers = new Set(blocked || []);
    myFriends = friends || [];
    // If server lost friends (e.g. restart), restore from localStorage cache
    if (!myFriends.length) {
      myFriends = loadFriendsCache();
    } else {
      saveFriendsCache();
    }
    friendRequests = friendReqs || [];
    sentFriendRequests = sentRequests || [];
    if (friendsWithNames) {
      for (const f of friendsWithNames) friendDisplayNames[f.handle.toLowerCase()] = f.displayName;
    }
    myTokens = tokens || 0;
    chats = (serverChats || []).map((c) => ({ ...c, unread: 0 }));
    if (!chats.length) {
      ensureChat(roomChannelId("general"));
    }
    for (const c of chats) watchChannel(c.channelId);
    showApp();
    startTokenTimer(nat || 0);
    updateTokenDisplay();
    renderChatList();
    renderGroupsList();
    renderBlockedList();
    renderFriendsList();
    // Restore last-opened channel from localStorage, or open first chat
    const savedChannel = localStorage.getItem("villagesquare-active-channel");
    if (savedChannel && chats.some((c) => c.channelId === savedChannel)) {
      openChat(savedChannel);
    } else if (chats.length) {
      openChat(chats[0].channelId);
    } else {
      showNoChatPanel();
    }
    // Show admin panel if this is the admin account
    const adminSection = document.getElementById("admin-section");
    if (adminSection) adminSection.classList.toggle("hidden", !isAdmin);
    // Show missed mentions banner
    if (missedMentions && missedMentions.length) {
      showMissedMentionsBanner(missedMentions);
    }
  });

  socket.on("online-users", (users) => {
    onlineUsers = users; // [{ handle, displayName, title? }] or legacy string[]
    // Update title map from online users
    for (const u of users) {
      const h = (u.handle || u).toLowerCase();
      if (u.title) userTitles[h] = u.title;
      else if (userTitles[h] && !u.title) delete userTitles[h];
    }
    renderOnlineList();
    renderFriendsList();
    // Keep DM subtitle in sync as friends go on/offline
    if (activeChannelId && activeChannelId.startsWith("dm:")) {
      const otherUser = dmOtherUser(activeChannelId);
      const isOnline = onlineUsers.some((u) => (u.handle || u) === otherUser);
      chatSubtitle.textContent = isOnline ? "● Online" : "○ Offline — messages saved for when they return";
      chatSubtitle.style.color = isOnline ? "var(--online)" : "";
    }
  });

  socket.on("display-name-changed", ({ displayName: dn }) => {
    myDisplayName = dn;
    if (myNameLabel) myNameLabel.textContent = myDisplayName;
    showToast(`Display name changed to "${escapeHtml(dn)}" ✓`);
  });

  socket.on("change-name-error", ({ message }) => {
    if (changeNameError) { changeNameError.textContent = message; changeNameError.classList.remove("hidden"); }
  });

  socket.on("groups-list", (groups) => {
    knownGroups = groups;
    renderGroupsList();
  });

  socket.on("group-ready", onGroupReady);
  socket.on("group-error", ({ message, needsPasscode, groupName }) => {
    if (needsPasscode && groupName) {
      pendingPasscodeGroupName = groupName;
      passcodeGroupNameEl.textContent = "#" + groupName;
      passcodeError.textContent = message;
      passcodeError.classList.remove("hidden");
      passcodeModal.classList.remove("hidden");
      setTimeout(() => passcodeInput.focus(), 50);
    } else {
      showGroupError(message);
    }
  });

  socket.on("channel-history", ({ channelId, messages, label }) => {
    // Merge server history with any locally-cached messages to prevent
    // race-condition message loss when history arrives after a fresh send.
    const existing = messageCache[channelId] || [];
    const serverIds = new Set((messages || []).map((m) => m.id));
    const localOnly = existing.filter((m) => !serverIds.has(m.id));
    messageCache[channelId] = [...(messages || []), ...localOnly]
      .sort((a, b) => new Date(a.time) - new Date(b.time));
    if (channelId === activeChannelId) {
      if (label && chatTitle) chatTitle.textContent = label;
      renderMessages(channelId);
    }
  });

  socket.on("message", handleIncomingMessage);

  socket.on("message-deleted", ({ channelId, messageId }) => {
    if (messageCache[channelId]) {
      messageCache[channelId] = messageCache[channelId].filter((m) => m.id !== messageId);
    }
    if (channelId === activeChannelId) renderMessages(channelId);
  });

  socket.on("blocked-updated", ({ blocked }) => {
    blockedUsers = new Set(blocked || []);
    renderOnlineList();
    renderBlockedList();
    // Update block button in current DM header
    if (activeChannelId && activeChannelId.startsWith("dm:")) {
      updateBlockChatBtn(dmOtherUser(activeChannelId));
    }
    // Re-render messages to hide/show blocked content
    if (activeChannelId) renderMessages(activeChannelId);
  });

  socket.on("game-started", ({ gameId, game, opponent, problem, question, options, phrase }) => {
    activeGameId = gameId;
    if (game === "numberduel") {
      numduelOpponentLabel.textContent = "vs " + opponent;
      numduelStatus.textContent = "Pick a number 1–10!";
      document.querySelectorAll(".num-pick-btn").forEach((b) => (b.disabled = false));
      numduelModal.classList.remove("hidden");
    } else if (game === "reaction") {
      if (reactionOpponentLabel) reactionOpponentLabel.textContent = "vs " + opponent;
      if (reactionStatus) reactionStatus.textContent = "Get ready… tap the instant you see GO!";
      if (reactionTapBtn) { reactionTapBtn.classList.add("hidden"); reactionTapBtn.disabled = false; }
      reactionTapped = false;
      if (reactionModal) reactionModal.classList.remove("hidden");
    } else if (game === "mathduel") {
      if (mathduelOpponentLabel) mathduelOpponentLabel.textContent = "vs " + opponent;
      if (mathduelProblem) mathduelProblem.textContent = problem || "?";
      if (mathduelInput) mathduelInput.value = "";
      if (mathduelStatus) mathduelStatus.textContent = "First correct answer wins!";
      if (mathduelModal) mathduelModal.classList.remove("hidden");
      setTimeout(() => mathduelInput && mathduelInput.focus(), 50);
    } else {
      rpsOpponentLabel.textContent = "vs " + opponent;
      rpsStatus.textContent = "Pick your move!";
      document.querySelectorAll(".rps-pick-btn").forEach((b) => (b.disabled = false));
      rpsModal.classList.remove("hidden");
    }
  });

  socket.on("game-waiting", () => {
    if (reactionModal && !reactionModal.classList.contains("hidden")) {
      if (reactionStatus) reactionStatus.textContent = "Tapped! Waiting for opponent…";
      if (reactionTapBtn) reactionTapBtn.disabled = true;
    } else if (!numduelModal.classList.contains("hidden")) {
      numduelStatus.textContent = "Number submitted! Waiting for opponent…";
      document.querySelectorAll(".num-pick-btn").forEach((b) => (b.disabled = true));
    } else {
      rpsStatus.textContent = "Move submitted! Waiting for opponent…";
      document.querySelectorAll(".rps-pick-btn").forEach((b) => (b.disabled = true));
    }
  });

  socket.on("game-result", ({ gameId }) => {
    if (activeGameId === gameId) {
      closeRpsModal();
      closeNumduelModal();
      closeReactionModal();
      closeMathduelModal();
      closeTriviaModal();
      closeTyperaceModal();
    }
  });

  socket.on("game-error", ({ message }) => {
    alert(message);
  });

  socket.on("game-go", ({ gameId }) => {
    if (activeGameId !== gameId) return;
    if (reactionStatus) reactionStatus.textContent = "TAP NOW! ⚡";
    if (reactionTapBtn) { reactionTapBtn.classList.remove("hidden"); reactionTapBtn.disabled = false; }
  });

  socket.on("game-wrong-answer", ({ gameId, message }) => {
    if (mathduelModal && !mathduelModal.classList.contains("hidden")) {
      if (mathduelStatus) mathduelStatus.textContent = "❌ " + message;
      if (mathduelInput) { mathduelInput.value = ""; mathduelInput.focus(); }
    } else if (triviaModal && !triviaModal.classList.contains("hidden")) {
      if (triviaStatus) triviaStatus.textContent = "❌ " + message;
      triviaOptBtns().forEach((b) => (b.disabled = true));
    } else if (typeraceModal && !typeraceModal.classList.contains("hidden")) {
      if (typeraceFeedback) typeraceFeedback.textContent = "❌ " + message;
      if (typeraceInput) { typeraceInput.value = ""; typeraceInput.focus(); }
    }
  });

  socket.on("group-settings", (data) => {
    if (!groupSettingsModal.classList.contains("hidden")) renderGsSettings(data);
  });

  socket.on("group-settings-error", ({ message }) => {
    gsError.textContent = message;
    gsError.classList.remove("hidden");
  });

  socket.on("kicked-from-group", ({ channelId, name, message }) => {
    chats = chats.filter((c) => c.channelId !== channelId);
    delete messageCache[channelId];
    scheduleSync();
    renderChatList();
    if (activeChannelId === channelId) {
      if (chats.length) openChat(chats[0].channelId);
      else showNoChatPanel();
    }
    alert(message || `You were removed from #${name}.`);
  });

  socket.on("chat-deleted", ({ channelId }) => {
    chats = chats.filter((c) => c.channelId !== channelId);
    renderChatList();
  });

  socket.on("group-deleted", ({ name }) => {
    const channelId = roomChannelId(name);
    chats = chats.filter((c) => c.channelId !== channelId);
    delete messageCache[channelId];
    scheduleSync();
    renderChatList();
    closeGroupSettings();
    if (activeChannelId === channelId) {
      if (chats.length) openChat(chats[0].channelId);
      else showNoChatPanel();
    }
    showToast(`#${escapeHtml(name)} was deleted.`);
  });

  socket.on("friends-updated", ({ friends, friendRequests: reqs, sentRequests, friendsWithNames }) => {
    myFriends = friends || [];
    saveFriendsCache(); // persist so friends survive server restarts
    friendRequests = reqs || [];
    sentFriendRequests = sentRequests || [];
    if (friendsWithNames) {
      for (const f of friendsWithNames) friendDisplayNames[f.handle.toLowerCase()] = f.displayName;
    }
    renderFriendsList();
    renderOnlineList();
    if (activeChannelId && activeChannelId.startsWith("dm:") && donateTokenDmBtn) {
      const otherUser = dmOtherUser(activeChannelId);
      const isFriend = myFriends.some((n) => n.toLowerCase() === otherUser.toLowerCase());
      donateTokenDmBtn.classList.toggle("hidden", !isFriend);
    }
  });

  socket.on("friend-accepted", ({ by }) => {
    showToast(`${escapeHtml(by)} accepted your friend request! 🤝`);
  });

  socket.on("token-updated", ({ tokens, nextTokenAt: nat, message }) => {
    myTokens = tokens;
    if (nat) startTokenTimer(nat);
    updateTokenDisplay();
    if (message) showToast(escapeHtml(message));
  });

  socket.on("rate-limited", ({ message, cooldownMs }) => {
    showToast("⏳ " + escapeHtml(message || "Slow down!"));
    messageInput.disabled = true;
    setTimeout(() => { messageInput.disabled = false; messageInput.focus(); }, cooldownMs || 3000);
  });

  socket.on("title-updated", ({ title }) => {
    if (myName) userTitles[myName.toLowerCase()] = title || null;
    if (activeChannelId) renderMessages(activeChannelId);
  });

  socket.on("token-error", ({ message }) => {
    alert(message);
  });

  socket.on("game-info", ({ message }) => {
    showToast(escapeHtml(message));
  });

  socket.on("admin-action-result", ({ ok, message }) => {
    showAdminResult(message, ok);
    // Refresh ban list if bans panel might be visible
    if (ok && socket) socket.emit("admin-get-bans");
  });

  socket.on("admin-bans-list", (bans) => {
    if (!adminBansList) return;
    if (!bans || bans.length === 0) {
      adminBansList.innerHTML = '<li class="empty-hint">No active bans.</li>';
      return;
    }
    adminBansList.innerHTML = bans.map((b) => {
      const until = b.type === "temp" && b.until ? ` until ${new Date(b.until).toLocaleString()}` : "";
      const reason = b.reason ? ` — ${escapeHtml(b.reason)}` : "";
      return `<li><strong>@${escapeHtml(b.handle)}</strong> [${b.type}${until}]${reason}</li>`;
    }).join("");
  });

  socket.on("admin-all-users", (users) => {
    const list = document.getElementById("admin-users-list");
    if (!list) return;
    if (!users || !users.length) { list.innerHTML = '<li class="empty-hint">No users found.</li>'; return; }
    list.innerHTML = users.map((u) =>
      `<li><strong>@${escapeHtml(u.handle || u.username)}</strong>${u.displayName ? ` (${escapeHtml(u.displayName)})` : ""} — ${u.tokens ?? 0} 🪙${u.banned ? " <span style='color:var(--danger)'>BANNED</span>" : ""}</li>`
    ).join("");
  });

  socket.on("admin-join-whitelist", (list) => {
    adminJoinWhitelist = Array.isArray(list) ? list : [];
    renderAdminWhitelist();
  });

  // ── Collection / Market / Trade socket handlers ──────────────────────────

  socket.on("force-disconnect", ({ message }) => {
    alert(message || "You have been disconnected.");
    if (socket) socket.disconnect();
    showJoin();
  });
}

groupsBtn.addEventListener("click", openGroupsModal);
closeGroupsBtn.addEventListener("click", closeGroupsModal);
groupsModal.addEventListener("click", (e) => {
  if (e.target === groupsModal) closeGroupsModal();
});

const adminRefreshUsersBtn = document.getElementById("admin-refresh-users-btn");
if (adminRefreshUsersBtn) {
  adminRefreshUsersBtn.addEventListener("click", () => {
    if (!socket) return;
    socket.emit("admin-get-all-users");
  });
}

// Hook into admin tab switching to populate card select and auto-fetch users
document.querySelectorAll(".tab[data-admintab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.admintab === "users" && socket) socket.emit("admin-get-all-users");
  });
});

document.querySelectorAll(".modal-tabs .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".modal-tabs .tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-join").classList.toggle("hidden", tab.dataset.tab !== "join");
    document.getElementById("tab-create").classList.toggle("hidden", tab.dataset.tab !== "create");
    showGroupError("");
  });
});

joinGroupBtn.addEventListener("click", () => {
  joinGroupByName(joinGroupInput.value.trim());
});
createGroupBtn.addEventListener("click", () => {
  if (!socket) return;
  showGroupError("");
  socket.emit("create-group", {
    name: createGroupInput.value.trim(),
    passcode: createGroupPasscodeInput.value.trim(),
  });
  createGroupPasscodeInput.value = "";
});
joinGroupInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") joinGroupBtn.click();
});
createGroupInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") createGroupBtn.click();
});

joinBtn.addEventListener("click", connect);
usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") connect();
});
if (displayNameInput) displayNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") connect();
});
signOutBtn.addEventListener("click", () => {
  if (socket && myName) socket.emit("sync-chats", { chats: chatsForSync() });
  showJoin();
});
deleteChatBtn.addEventListener("click", deleteActiveChat);

// Block button in DM header
blockChatBtn.addEventListener("click", () => {
  const target = blockChatBtn.dataset.target;
  if (!target) return;
  if (blockChatBtn.dataset.blocked === "1") unblockUser(target);
  else blockUser(target);
});

// Games dropdown
gamesBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  gamesMenu.classList.toggle("hidden");
});
document.addEventListener("click", () => gamesMenu.classList.add("hidden"));
gamesDropdown.addEventListener("click", (e) => e.stopPropagation());
document.querySelectorAll(".dropdown-item[data-game]").forEach((item) => {
  item.addEventListener("click", () => {
    if (!socket || !activeChannelId) return;
    gamesMenu.classList.add("hidden");
    if (item.dataset.game === "8ball") {
      pendingGameChannel = activeChannelId;
      eightballQuestionInput.value = "";
      eightballModal.classList.remove("hidden");
      setTimeout(() => eightballQuestionInput.focus(), 50);
    } else {
      socket.emit("game-challenge", { channelId: activeChannelId, game: item.dataset.game, wager: wagerAmount });
    }
  });
});

// RPS pick buttons
document.querySelectorAll(".rps-pick-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!activeGameId || !socket) return;
    socket.emit("game-move", { gameId: activeGameId, move: btn.dataset.move });
  });
});

// Number Duel pick buttons
document.querySelectorAll(".num-pick-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!activeGameId || !socket) return;
    socket.emit("game-move", { gameId: activeGameId, move: btn.dataset.num });
  });
});

// Reaction Race — tap button
let reactionTapped = false;
if (reactionTapBtn) {
  reactionTapBtn.addEventListener("click", () => {
    if (!activeGameId || !socket || reactionTapped) return;
    reactionTapped = true;
    reactionTapBtn.disabled = true;
    socket.emit("game-move", { gameId: activeGameId, move: "react" });
  });
}

// Math Duel — answer submission
function submitMathduel() {
  const answer = mathduelInput ? mathduelInput.value.trim() : "";
  if (!answer || !activeGameId || !socket) return;
  socket.emit("game-move", { gameId: activeGameId, move: answer });
}
if (mathduelSubmitBtn) mathduelSubmitBtn.addEventListener("click", submitMathduel);
if (mathduelInput) mathduelInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submitMathduel(); });

// Close buttons for new game modals
const closeReactionBtn = document.getElementById("close-reaction-btn");
if (closeReactionBtn) closeReactionBtn.addEventListener("click", closeReactionModal);
if (reactionModal) reactionModal.addEventListener("click", (e) => { if (e.target === reactionModal) closeReactionModal(); });
const closeMathduelBtn = document.getElementById("close-mathduel-btn");
if (closeMathduelBtn) closeMathduelBtn.addEventListener("click", closeMathduelModal);
if (mathduelModal) mathduelModal.addEventListener("click", (e) => { if (e.target === mathduelModal) closeMathduelModal(); });
if (triviaModal) triviaModal.addEventListener("click", (e) => { if (e.target === triviaModal) closeTriviaModal(); });
if (typeraceModal) typeraceModal.addEventListener("click", (e) => { if (e.target === typeraceModal) closeTyperaceModal(); });

// Trivia Duel — answer buttons
triviaOptBtns().forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!activeGameId || !socket || btn.disabled) return;
    const choice = btn.dataset.choice;
    triviaOptBtns().forEach((b) => (b.disabled = true));
    socket.emit("game-move", { gameId: activeGameId, move: choice });
  });
});

// Type Race — submit
function submitTyperace() {
  const typed = typeraceInput ? typeraceInput.value : "";
  if (!typed || !activeGameId || !socket) return;
  if (typeraceFeedback) typeraceFeedback.textContent = "";
  socket.emit("game-move", { gameId: activeGameId, move: typed });
}
if (typeraceSubmitBtn) typeraceSubmitBtn.addEventListener("click", submitTyperace);
if (typeraceInput) typeraceInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submitTyperace(); });

// Magic 8-Ball question modal
eightballSubmitBtn.addEventListener("click", () => {
  const q = eightballQuestionInput.value.trim();
  if (!q || !socket || !pendingGameChannel) return;
  socket.emit("game-challenge", { channelId: pendingGameChannel, game: "8ball", question: q });
  closeEightballModal();
});
eightballQuestionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") eightballSubmitBtn.click();
});
closeEightballBtn.addEventListener("click", closeEightballModal);
eightballModal.addEventListener("click", (e) => {
  if (e.target === eightballModal) closeEightballModal();
});

// Group Settings modal
groupSettingsBtn.addEventListener("click", openGroupSettings);
closeGsBtn.addEventListener("click", closeGroupSettings);
groupSettingsModal.addEventListener("click", (e) => {
  if (e.target === groupSettingsModal) closeGroupSettings();
});

const gsDeleteGroupBtn = document.getElementById("gs-delete-group-btn");
if (gsDeleteGroupBtn) {
  gsDeleteGroupBtn.addEventListener("click", () => {
    if (!gsCurrentGroup || !socket) return;
    if (!confirm(`Permanently delete #${gsCurrentGroup} and all its messages? This cannot be undone.`)) return;
    socket.emit("creator-delete-group", { name: gsCurrentGroup });
  });
}
document.querySelectorAll("[data-gstab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-gstab]").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("gstab-members").classList.toggle("hidden", tab.dataset.gstab !== "members");
    document.getElementById("gstab-whitelist").classList.toggle("hidden", tab.dataset.gstab !== "whitelist");
    document.getElementById("gstab-blacklist").classList.toggle("hidden", tab.dataset.gstab !== "blacklist");
  });
});
gsWhitelistAddBtn.addEventListener("click", () => {
  const name = gsWhitelistInput.value.trim();
  if (!name || !socket || !gsCurrentGroup) return;
  if (!gsCurrentWhitelist.includes(name)) {
    socket.emit("group-set-access", { name: gsCurrentGroup, whitelist: [...gsCurrentWhitelist, name] });
    gsWhitelistInput.value = "";
  }
});
gsBlacklistAddBtn.addEventListener("click", () => {
  const name = gsBlacklistInput.value.trim();
  if (!name || !socket || !gsCurrentGroup) return;
  if (!gsCurrentBlacklist.includes(name)) {
    socket.emit("group-set-access", { name: gsCurrentGroup, blacklist: [...gsCurrentBlacklist, name] });
    gsBlacklistInput.value = "";
  }
});
gsWhitelistInput.addEventListener("keydown", (e) => { if (e.key === "Enter") gsWhitelistAddBtn.click(); });
gsBlacklistInput.addEventListener("keydown", (e) => { if (e.key === "Enter") gsBlacklistAddBtn.click(); });

// ── Wager, Nickname, Donate Token ─────────────────────────────
if (wagerAmountInput) {
  wagerAmountInput.addEventListener("change", (e) => {
    wagerAmount = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
    wagerAmountInput.value = wagerAmount;
  });
  wagerAmountInput.addEventListener("click", (e) => e.stopPropagation());
}

if (claimTokenBtn) {
  claimTokenBtn.addEventListener("click", () => {
    if (socket) socket.emit("claim-token");
  });
}

if (nicknameBtn) {
  nicknameBtn.addEventListener("click", () => {
    const target = nicknameBtn.dataset.target;
    if (target) openNicknameModal(target);
  });
}

const donateModal = document.getElementById("donate-modal");
const donateModalTarget = document.getElementById("donate-modal-target");
const donateAmountInput = document.getElementById("donate-amount-input");
const donateConfirmBtn = document.getElementById("donate-confirm-btn");
const closeDonateModalBtn = document.getElementById("close-donate-modal-btn");

if (donateTokenDmBtn) {
  donateTokenDmBtn.addEventListener("click", () => {
    const target = donateTokenDmBtn.dataset.target;
    if (!socket || !target) return;
    if (myTokens < 1) { alert("You have no tokens to give."); return; }
    if (donateModalTarget) donateModalTarget.textContent = target;
    if (donateAmountInput) { donateAmountInput.value = 1; donateAmountInput.max = myTokens; }
    if (donateModal) donateModal.classList.remove("hidden");
    if (donateAmountInput) donateAmountInput.focus();
  });
}

if (closeDonateModalBtn) {
  closeDonateModalBtn.addEventListener("click", () => {
    if (donateModal) donateModal.classList.add("hidden");
  });
}
if (donateModal) {
  donateModal.addEventListener("click", (e) => { if (e.target === donateModal) donateModal.classList.add("hidden"); });
}

function submitDonate() {
  const target = donateTokenDmBtn && donateTokenDmBtn.dataset.target;
  if (!socket || !target) return;
  const amt = parseInt(donateAmountInput && donateAmountInput.value, 10);
  if (!amt || amt < 1) { alert("Enter a valid amount."); return; }
  if (amt > myTokens) { alert(`You only have ${myTokens} token${myTokens !== 1 ? "s" : ""}.`); return; }
  socket.emit("donate-token", { targetName: target, amount: amt });
  if (donateModal) donateModal.classList.add("hidden");
}

if (donateConfirmBtn) {
  donateConfirmBtn.addEventListener("click", submitDonate);
}
if (donateAmountInput) {
  donateAmountInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submitDonate(); });
}

if (nicknameSaveBtn) {
  nicknameSaveBtn.addEventListener("click", saveNickname);
}
if (nicknameInput) {
  nicknameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") saveNickname(); });
}
if (closeNicknameBtn) {
  closeNicknameBtn.addEventListener("click", closeNicknameModal);
}
if (nicknameModal) {
  nicknameModal.addEventListener("click", (e) => { if (e.target === nicknameModal) closeNicknameModal(); });
}

// Admin peek panel
const adminPeekBtn = document.getElementById("admin-peek-btn");
const adminChannelInput = document.getElementById("admin-channel-input");
if (adminPeekBtn && adminChannelInput) {
  const doPeek = () => {
    const cid = adminChannelInput.value.trim();
    if (!cid || !socket) return;
    // Open the channel in the chat panel so the admin can see and send messages
    activeChannelId = cid;
    const c = ensureChat(cid);
    // Derive a readable label from the channel ID
    if (cid.startsWith("room:")) c.label = "#" + cid.slice(5);
    else if (cid.startsWith("dm:")) c.label = cid.slice(3).split("|").join(" ↔ ");
    noChatEl.classList.add("hidden");
    chatPanel.classList.remove("hidden");
    chatTitle.textContent = c.label || cid;
    chatSubtitle.textContent = "Admin preview";
    chatSubtitle.style.color = "";
    blockChatBtn.classList.add("hidden");
    if (nicknameBtn) nicknameBtn.classList.add("hidden");
    if (donateTokenDmBtn) donateTokenDmBtn.classList.add("hidden");
    groupSettingsBtn.classList.add("hidden");
    renderMessages(cid);
    renderChatList();
    socket.emit("admin-view-channel", { channelId: cid });
  };
  adminPeekBtn.addEventListener("click", doPeek);
  adminChannelInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doPeek(); });
}

// ── Admin Panel Modal ──────────────────────────────────────────
const adminPanelModal    = document.getElementById("admin-panel-modal");
const openAdminPanelBtn  = document.getElementById("open-admin-panel-btn");
const closeAdminPanelBtn = document.getElementById("close-admin-panel-btn");
const adminResultMsg     = document.getElementById("admin-result-msg");
// Token controls
const adminTokenHandle = document.getElementById("admin-token-handle");
const adminTokenAmount = document.getElementById("admin-token-amount");
const adminGiveBtn     = document.getElementById("admin-give-btn");
const adminTakeBtn     = document.getElementById("admin-take-btn");
// Ban controls
const adminBanHandle   = document.getElementById("admin-ban-handle");
const adminBanType     = document.getElementById("admin-ban-type");
const adminTempRow     = document.getElementById("admin-temp-row");
const adminBanDuration = document.getElementById("admin-ban-duration");
const adminBanUnit     = document.getElementById("admin-ban-unit");
const adminBanReason   = document.getElementById("admin-ban-reason");
const adminBanBtn      = document.getElementById("admin-ban-btn");
const adminUnbanBtn    = document.getElementById("admin-unban-btn");
const adminBansList    = document.getElementById("admin-bans-list");
// Content controls
const adminDelGroupInput = document.getElementById("admin-del-group-input");
const adminDelGroupBtn   = document.getElementById("admin-del-group-btn");

function openAdminPanel() {
  if (!adminPanelModal) return;
  adminPanelModal.classList.remove("hidden");
  // Load ban list each open
  if (socket) socket.emit("admin-get-bans");
  if (socket) socket.emit("admin-get-join-whitelist");
  showAdminTab("tokens");
  renderAdminWhitelist();
}

function closeAdminPanel() {
  if (!adminPanelModal) return;
  adminPanelModal.classList.add("hidden");
}

function showAdminTab(tabName) {
  document.querySelectorAll(".tab[data-admintab]").forEach((t) => {
    t.classList.toggle("active", t.dataset.admintab === tabName);
  });
  ["tokens", "bans", "content", "titles", "users", "messages", "whitelist"].forEach((name) => {
    const el = document.getElementById("admintab-" + name);
    if (el) el.classList.toggle("hidden", name !== tabName);
  });
  if (tabName === "whitelist") renderAdminWhitelist();
}

function showAdminResult(msg, ok) {
  if (!adminResultMsg) return;
  adminResultMsg.textContent = msg;
  adminResultMsg.className = "admin-result-msg " + (ok ? "ok" : "error");
  adminResultMsg.classList.remove("hidden");
  clearTimeout(adminResultMsg._timer);
  adminResultMsg._timer = setTimeout(() => adminResultMsg.classList.add("hidden"), 5000);
}

if (openAdminPanelBtn) openAdminPanelBtn.addEventListener("click", openAdminPanel);
if (closeAdminPanelBtn) closeAdminPanelBtn.addEventListener("click", closeAdminPanel);
if (adminPanelModal) adminPanelModal.addEventListener("click", (e) => { if (e.target === adminPanelModal) closeAdminPanel(); });

document.querySelectorAll(".tab[data-admintab]").forEach((tab) => {
  tab.addEventListener("click", () => showAdminTab(tab.dataset.admintab));
});

// ── Admin: Whitelist tab ───────────────────────────────────────────────────────
function renderAdminWhitelist() {
  const listEl = document.getElementById("admin-whitelist-list");
  if (!listEl) return;
  listEl.innerHTML = "";
  const list = adminJoinWhitelist.length ? adminJoinWhitelist : [..._WHITELIST_PERMANENT];
  if (!list.length) {
    listEl.innerHTML = '<li class="empty-hint">No handles yet.</li>';
    return;
  }
  for (const handle of list) {
    const isPermanent = _WHITELIST_PERMANENT.some((h) => h.toLowerCase() === handle.toLowerCase());
    const li = document.createElement("li");
    li.className = "admin-whitelist-row";
    const nameSpan = document.createElement("span");
    nameSpan.className = "admin-whitelist-name";
    nameSpan.textContent = "@" + handle + (isPermanent ? " (permanent)" : "");
    li.appendChild(nameSpan);
    if (!isPermanent) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "gs-btn remove";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        if (!socket) return;
        socket.emit("admin-remove-join-whitelist", { handle });
      });
      li.appendChild(removeBtn);
    }
    listEl.appendChild(li);
  }
}

const adminWhitelistInput  = document.getElementById("admin-whitelist-input");
const adminWhitelistAddBtn = document.getElementById("admin-whitelist-add-btn");
if (adminWhitelistAddBtn) {
  const doWhitelistAdd = () => {
    const val = adminWhitelistInput ? adminWhitelistInput.value.trim() : "";
    if (!val) { showAdminResult("Enter a handle.", false); return; }
    if (!socket) return;
    socket.emit("admin-add-join-whitelist", { handle: val });
    if (adminWhitelistInput) adminWhitelistInput.value = "";
  };
  adminWhitelistAddBtn.addEventListener("click", doWhitelistAdd);
  if (adminWhitelistInput) adminWhitelistInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doWhitelistAdd(); });
}

// Login info password toggle
const loginInfoPwToggle = document.getElementById("login-info-pw-toggle");
const loginInfoPwInput  = document.getElementById("login-info-password");
if (loginInfoPwToggle && loginInfoPwInput) {
  loginInfoPwToggle.addEventListener("click", () => {
    const isHidden = loginInfoPwInput.type === "password";
    loginInfoPwInput.type = isHidden ? "text" : "password";
    loginInfoPwToggle.textContent = isHidden ? "Hide" : "Show";
  });
}

if (adminBanType) {
  adminBanType.addEventListener("change", () => {
    if (!adminTempRow) return;
    adminTempRow.classList.toggle("hidden", adminBanType.value !== "temp");
    adminTempRow.style.display = adminBanType.value === "temp" ? "flex" : "none";
  });
}

if (adminGiveBtn) {
  adminGiveBtn.addEventListener("click", () => {
    const handle = adminTokenHandle ? adminTokenHandle.value.trim() : "";
    const amount = adminTokenAmount ? parseInt(adminTokenAmount.value) || 0 : 0;
    if (!handle || amount <= 0) { showAdminResult("Enter a handle and positive amount.", false); return; }
    if (!socket) return;
    socket.emit("admin-give-tokens", { targetHandle: handle, amount });
  });
}

if (adminTakeBtn) {
  adminTakeBtn.addEventListener("click", () => {
    const handle = adminTokenHandle ? adminTokenHandle.value.trim() : "";
    const amount = adminTokenAmount ? parseInt(adminTokenAmount.value) || 0 : 0;
    if (!handle || amount <= 0) { showAdminResult("Enter a handle and positive amount.", false); return; }
    if (!confirm(`Take ${amount} token(s) from @${handle}?`)) return;
    if (!socket) return;
    socket.emit("admin-take-tokens", { targetHandle: handle, amount });
  });
}

if (adminBanBtn) {
  adminBanBtn.addEventListener("click", () => {
    const handle = adminBanHandle ? adminBanHandle.value.trim() : "";
    const type   = adminBanType ? adminBanType.value : "perm";
    const dur    = adminBanDuration ? adminBanDuration.value : "1";
    const unit   = adminBanUnit ? adminBanUnit.value : "h";
    const reason = adminBanReason ? adminBanReason.value.trim() : "";
    if (!handle) { showAdminResult("Enter a target handle.", false); return; }
    const desc = type === "temp" ? `temporarily for ${dur}${unit}` : "permanently";
    if (!confirm(`Ban @${handle} ${desc}?`)) return;
    if (!socket) return;
    socket.emit("admin-ban", { targetHandle: handle, type, duration: dur, unit, reason });
  });
}

if (adminUnbanBtn) {
  adminUnbanBtn.addEventListener("click", () => {
    const handle = adminBanHandle ? adminBanHandle.value.trim() : "";
    if (!handle) { showAdminResult("Enter the handle to unban.", false); return; }
    if (!socket) return;
    socket.emit("admin-unban", { targetHandle: handle });
  });
}

if (adminDelGroupBtn) {
  adminDelGroupBtn.addEventListener("click", () => {
    const name = adminDelGroupInput ? adminDelGroupInput.value.trim() : "";
    if (!name) { showAdminResult("Enter a group name.", false); return; }
    if (!confirm(`Permanently delete the group #${name} and all its messages?`)) return;
    if (!socket) return;
    socket.emit("admin-delete-group", { groupName: name });
  });
}

// Passcode modal
closePasscodeBtn.addEventListener("click", closePasscodeModal);
passcodeModal.addEventListener("click", (e) => {
  if (e.target === passcodeModal) closePasscodeModal();
});
passcodeSubmitBtn.addEventListener("click", submitPasscode);
passcodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitPasscode();
});

// ── Change display name modal ──────────────────────────────────
function openChangeNameModal() {
  if (!changeNameModal) return;
  if (changeNameInput) changeNameInput.value = myDisplayName;
  if (changeNameHandleLabel) changeNameHandleLabel.textContent = "@" + myName;
  if (changeNameError) changeNameError.classList.add("hidden");
  changeNameModal.classList.remove("hidden");
  setTimeout(() => changeNameInput && changeNameInput.focus(), 50);
}
function closeChangeNameModal() {
  if (changeNameModal) changeNameModal.classList.add("hidden");
}
function saveDisplayName() {
  if (!socket || !changeNameInput) return;
  const newName = changeNameInput.value.trim();
  if (!newName) {
    if (changeNameError) { changeNameError.textContent = "Display name cannot be empty."; changeNameError.classList.remove("hidden"); }
    return;
  }
  socket.emit("change-display-name", { newName });
}
if (changeNameBtn) changeNameBtn.addEventListener("click", openChangeNameModal);
if (closeChangeNameBtn) closeChangeNameBtn.addEventListener("click", closeChangeNameModal);
if (changeNameModal) changeNameModal.addEventListener("click", (e) => { if (e.target === changeNameModal) closeChangeNameModal(); });
if (changeNameSaveBtn) changeNameSaveBtn.addEventListener("click", saveDisplayName);
if (changeNameInput) changeNameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") saveDisplayName(); });

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !socket || !activeChannelId) return;
  socket.emit("send-message", { channelId: activeChannelId, text });
  messageInput.value = "";
});

sidebarToggle.addEventListener("click", openSidebarMobile);
sidebarBackdrop.addEventListener("click", closeSidebarMobile);

// Desktop sidebar collapse toggle
const sidebarCollapseBtn = document.getElementById("sidebar-collapse-btn");
if (sidebarCollapseBtn) {
  sidebarCollapseBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    sidebarCollapseBtn.title = sidebar.classList.contains("collapsed") ? "Expand sidebar" : "Collapse sidebar";
  });
}

window.addEventListener("beforeunload", () => {
  if (socket && myName) socket.emit("sync-chats", { chats: chatsForSync() });
});

const savedName = localStorage.getItem("villagesquare-name");
if (savedName) {
  usernameInput.value = savedName;
  usernameInput.readOnly = true;
  usernameInput.classList.add("handle-locked");
  const lockedRow = document.getElementById("handle-locked-row");
  if (lockedRow) lockedRow.classList.remove("hidden");
  // Safety net: if the socket never registers within 10s, fall back to join screen
  _connectFallback = setTimeout(() => {
    if (document.getElementById("loading-screen")) {
      showJoin();
      showJoinError("Connection timed out. Check your network and try again.");
    }
  }, 10000);
  connect();
} else {
  // Let the loading animation play (~3.2s) before revealing the join screen
  setTimeout(() => showJoin(), 3200);
}

// Reset handle button — lets a user choose a fresh identity on this device
const resetHandleBtn = document.getElementById("reset-handle-btn");
if (resetHandleBtn) {
  resetHandleBtn.addEventListener("click", () => {
    if (!confirm("Remove this device’s saved handle? Your account (if password-protected) remains accessible from any device.")) return;
    localStorage.removeItem("villagesquare-name");
    usernameInput.readOnly = false;
    usernameInput.classList.remove("handle-locked");
    usernameInput.value = "";
    const lockedRow = document.getElementById("handle-locked-row");
    if (lockedRow) lockedRow.classList.add("hidden");
    showJoinError("");
    usernameInput.focus();
  });
}

// ── Theme cycling ─────────────────────────────────────────────
const THEMES = ["dark", "light", "midnight", "forest", "sunset", "rose", "ocean", "crimson", "neon", "nord"];
const THEME_LABELS = { dark: "🌑 Dark", light: "☀️ Light", midnight: "🌌 Midnight", forest: "🌲 Forest", sunset: "🌅 Sunset", rose: "🌸 Rose", ocean: "🌊 Ocean", crimson: "🔴 Crimson", neon: "⚡ Neon", nord: "❄️ Nord" };

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("villagesquare-theme", theme);
  if (themeBtn) themeBtn.title = "Theme: " + (THEME_LABELS[theme] || theme);
}

function cycleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  applyTheme(next);
}

if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

// ── Profanity filter toggle ────────────────────────────────────────────────────
const filterBtn = document.getElementById("filter-btn");
function updateFilterBtn() {
  if (!filterBtn) return;
  filterBtn.title = filterEnabled ? "Profanity filter: ON (click to disable)" : "Profanity filter: OFF (click to enable)";
  filterBtn.classList.toggle("filter-active", filterEnabled);
  filterBtn.classList.toggle("filter-off", !filterEnabled);
}
if (filterBtn) {
  filterBtn.addEventListener("click", () => {
    filterEnabled = !filterEnabled;
    try { localStorage.setItem("villagesquare-filter", filterEnabled ? "on" : "off"); } catch (_) {}
    updateFilterBtn();
    if (activeChannelId) renderMessages(activeChannelId);
  });
  updateFilterBtn();
}

// ── Admin: Titles tab ─────────────────────────────────────────────────────────
const adminTitleHandle = document.getElementById("admin-title-handle");
const adminTitleSelect = document.getElementById("admin-title-select");
const adminSetTitleBtn = document.getElementById("admin-set-title-btn");
if (adminSetTitleBtn) {
  adminSetTitleBtn.addEventListener("click", () => {
    const handle = adminTitleHandle ? adminTitleHandle.value.trim() : "";
    const title  = adminTitleSelect ? adminTitleSelect.value : "none";
    if (!handle || !socket) return;
    socket.emit("admin-set-title", { targetHandle: handle, title });
  });
}

// ── Admin: Messages tab ────────────────────────────────────────────────────────
const adminMsgChannelInput = document.getElementById("admin-msg-channel-input");
const adminMsgLoadBtn      = document.getElementById("admin-msg-load-btn");
const adminMsgPanel        = document.getElementById("admin-msg-panel");

function renderAdminMessages(channelId, messages) {
  if (!adminMsgPanel) return;
  if (!messages || !messages.length) {
    adminMsgPanel.innerHTML = "<p class='empty-hint'>No messages in this channel.</p>";
    return;
  }
  adminMsgPanel.innerHTML = messages.map((m) => {
    const t = m.title ? `<span class="title-badge ${TITLE_META[m.title]?.cls || ""}">${TITLE_META[m.title]?.label || m.title}</span>` : "";
    const safeUser = escapeHtml(m.displayName || m.user || "?");
    const safeText = escapeHtml(m.text || m.gameName || "");
    const time = m.time ? formatTime(m.time) : "";
    return `<div class="admin-msg-row">
      <span class="admin-msg-meta">${time} ${t}<strong>${safeUser}</strong></span>
      <span class="admin-msg-text">${safeText}</span>
    </div>`;
  }).join("");
  adminMsgPanel.scrollTop = adminMsgPanel.scrollHeight;
}

if (adminMsgLoadBtn && adminMsgChannelInput) {
  const doAdminLoad = () => {
    const cid = adminMsgChannelInput.value.trim();
    if (!cid || !socket) return;
    socket.emit("admin-view-channel", { channelId: cid });
    // Listen once for the response
    socket.once("channel-history", ({ channelId, messages }) => {
      if (channelId === cid) renderAdminMessages(channelId, messages);
    });
  };
  adminMsgLoadBtn.addEventListener("click", doAdminLoad);
  adminMsgChannelInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doAdminLoad(); });
}

// Extend showAdminTab to include new tabs — handled above in definition

// Restore saved theme on load
applyTheme(localStorage.getItem("villagesquare-theme") || "dark");

