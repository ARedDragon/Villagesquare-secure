// @ts-nocheck
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const DEFAULT_GROUPS = ["general", "lounge", "school"];

const DEFAULT_DATA = {
  messages: {},
  groups: [...DEFAULT_GROUPS],
  users: {},
  groupMeta: {},
  bans: {},
  pinnedInfo: null,
  inventory: {},
  market: {},
  rap: {},
  trades: {},
  missedMentions: {},
  titles: {},
};

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
let saveTimer = null;

// Normalize all user-data keys to lowercase to prevent case-sensitivity bugs
function uk(username) {
  return (username || "").toLowerCase();
}

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw);
      // Migrate: normalize all user keys to lowercase, backfill displayName
      const normalizedUsers = {};
      for (const [key, val] of Object.entries(parsed.users || {})) {
        const lKey = key.toLowerCase();
        if (!normalizedUsers[lKey]) {
          normalizedUsers[lKey] = val;
          // Backfill displayName for existing accounts
          if (!normalizedUsers[lKey].displayName) {
            normalizedUsers[lKey].displayName = val.displayName || lKey;
          }
        }
      }
      data = {
        messages: parsed.messages || {},
        groups: parsed.groups?.length ? parsed.groups : [...DEFAULT_GROUPS],
        users: normalizedUsers,
        groupMeta: parsed.groupMeta || {},
        bans: parsed.bans || {},
        pinnedInfo: parsed.pinnedInfo || null,
        inventory: parsed.inventory || {},
        market: parsed.market || {},
        rap: parsed.rap || {},
        trades: parsed.trades || {},
        missedMentions: parsed.missedMentions || {},
        titles: parsed.titles || {},
      };
      // Ensure built-in groups always exist (migration for older installs)
      for (const g of DEFAULT_GROUPS) {
        if (!data.groups.includes(g)) data.groups.push(g);
      }
      data.groups.sort((a, b) => a.localeCompare(b));
    }
  } catch (err) {
    console.error("Could not load store, starting fresh:", err.message);
    data = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
      saveTimer = null;
    } catch (err) {
      console.error("Failed to save store:", err.message);
    }
  }, 250);
}

function flushSaveNow() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
  } catch (err) {
    console.error("Failed to flush store:", err.message);
  }
}

function getMessages(channelId) {
  return data.messages[channelId] || [];
}

function setMessages(channelId, list) {
  data.messages[channelId] = list;
  scheduleSave();
}

function addMessage(channelId, msg) {
  if (!data.messages[channelId]) data.messages[channelId] = [];
  data.messages[channelId].push(msg);
  scheduleSave();
}

function deleteChannelMessages(channelId) {
  delete data.messages[channelId];
  scheduleSave();
}

function getGroups() {
  return [...data.groups].sort((a, b) => a.localeCompare(b));
}

function addGroup(name) {
  const n = name.trim().slice(0, 32);
  if (!n || data.groups.includes(n)) return n;
  data.groups.push(n);
  data.groups.sort((a, b) => a.localeCompare(b));
  scheduleSave();
  return n;
}

function getGroupMeta(name) {
  return data.groupMeta[name] || {};
}

function setGroupMeta(name, meta) {
  if (!data.groupMeta[name]) data.groupMeta[name] = {};
  Object.assign(data.groupMeta[name], meta);
  scheduleSave();
}

function getGroupsWithMeta() {
  return [...data.groups].sort((a, b) => a.localeCompare(b)).map((name) => ({
    name,
    locked: !!(data.groupMeta[name] && data.groupMeta[name].passcode),
    creator: (data.groupMeta[name] && data.groupMeta[name].creator) || null,
  }));
}

function getUserChats(username) {
  return data.users[uk(username)]?.chats || [];
}

function setUserChats(username, chats) {
  if (!data.users[uk(username)]) data.users[uk(username)] = {};
  data.users[uk(username)].chats = chats;
  scheduleSave();
}

function removeUserChat(username, channelId) {
  const chats = getUserChats(username).filter((c) => c.channelId !== channelId);
  setUserChats(username, chats);
}

function getUserBlocked(username) {
  return data.users[uk(username)]?.blocked || [];
}

function addUserBlocked(username, targetName) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  if (!data.users[key].blocked) data.users[key].blocked = [];
  if (!data.users[key].blocked.some((n) => n.toLowerCase() === targetName.toLowerCase())) {
    data.users[key].blocked.push(targetName);
    scheduleSave();
  }
}

function removeUserBlocked(username, targetName) {
  const key = uk(username);
  if (!data.users[key]?.blocked) return;
  data.users[key].blocked = data.users[key].blocked.filter((n) => n.toLowerCase() !== targetName.toLowerCase());
  scheduleSave();
}

function getGroupWhitelist(name) {
  return data.groupMeta[name]?.whitelist || [];
}

function setGroupWhitelist(name, list) {
  if (!data.groupMeta[name]) data.groupMeta[name] = {};
  data.groupMeta[name].whitelist = list.slice(0, 100);
  scheduleSave();
}

function getGroupBlacklist(name) {
  return data.groupMeta[name]?.blacklist || [];
}

function setGroupBlacklist(name, list) {
  if (!data.groupMeta[name]) data.groupMeta[name] = {};
  data.groupMeta[name].blacklist = list.slice(0, 100);
  scheduleSave();
}

// ── Friends system ──────────────────────────────────────────────────────────
function getFriends(username) {
  return data.users[uk(username)]?.friends || [];
}

function addFriend(username, targetName) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  if (!data.users[key].friends) data.users[key].friends = [];
  if (!data.users[key].friends.some((n) => n.toLowerCase() === targetName.toLowerCase())) {
    data.users[key].friends.push(targetName);
    scheduleSave();
  }
}

function removeFriend(username, targetName) {
  const key = uk(username);
  if (!data.users[key]?.friends) return;
  data.users[key].friends = data.users[key].friends.filter((n) => n.toLowerCase() !== targetName.toLowerCase());
  scheduleSave();
}

function getFriendRequests(username) {
  return data.users[uk(username)]?.friendRequests || [];
}

function addFriendRequest(username, fromName) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  if (!data.users[key].friendRequests) data.users[key].friendRequests = [];
  if (!data.users[key].friendRequests.some((n) => n.toLowerCase() === fromName.toLowerCase())) {
    data.users[key].friendRequests.push(fromName);
    scheduleSave();
  }
}

function removeFriendRequest(username, fromName) {
  const key = uk(username);
  if (!data.users[key]?.friendRequests) return;
  data.users[key].friendRequests = data.users[key].friendRequests.filter((n) => n.toLowerCase() !== fromName.toLowerCase());
  scheduleSave();
}

function getSentFriendRequests(username) {
  return data.users[uk(username)]?.sentRequests || [];
}

function addSentFriendRequest(username, toName) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  if (!data.users[key].sentRequests) data.users[key].sentRequests = [];
  if (!data.users[key].sentRequests.some((n) => n.toLowerCase() === toName.toLowerCase())) {
    data.users[key].sentRequests.push(toName);
    scheduleSave();
  }
}

function removeSentFriendRequest(username, toName) {
  const key = uk(username);
  if (!data.users[key]?.sentRequests) return;
  data.users[key].sentRequests = data.users[key].sentRequests.filter((n) => n.toLowerCase() !== toName.toLowerCase());
  scheduleSave();
}

// ── Display name (changeable) ────────────────────────────────────────────────
function getDisplayName(handle) {
  return data.users[uk(handle)]?.displayName || handle;
}

function setDisplayName(handle, name) {
  const key = uk(handle);
  if (!data.users[key]) data.users[key] = {};
  data.users[key].displayName = String(name).trim().slice(0, 20) || handle;
  scheduleSave();
}

function getAllUsers() {
  return Object.entries(data.users).map(([handle, u]) => ({
    handle,
    displayName: u.displayName || handle,
    tokens: u.tokens || 0,
  }));
}

// ── Account PIN ─────────────────────────────────────────────────────────────
function getPin(username) {
  return data.users[uk(username)]?.pin || null;
}

function setPin(username, hashed) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  data.users[key].pin = hashed;
  scheduleSave();
}

// ── Group membership / activity ──────────────────────────────────────────────
function getGroupMembers(name) {
  return data.groupMeta[name]?.members || [];
}

function addGroupMember(name, username) {
  if (!data.groupMeta[name]) data.groupMeta[name] = {};
  if (!data.groupMeta[name].members) data.groupMeta[name].members = [];
  const lk = (username || "").toLowerCase();
  if (!data.groupMeta[name].members.some((m) => m.toLowerCase() === lk)) {
    data.groupMeta[name].members.push(username);
    scheduleSave();
  }
}

function removeGroupMember(name, username) {
  if (!data.groupMeta[name]?.members) return;
  const lk = (username || "").toLowerCase();
  data.groupMeta[name].members = data.groupMeta[name].members.filter(
    (m) => m.toLowerCase() !== lk
  );
  scheduleSave();
}

function getGroupLastActivity(name) {
  return data.groupMeta[name]?.lastActivity || 0;
}

function setGroupLastActivity(name, ts) {
  if (!data.groupMeta[name]) data.groupMeta[name] = {};
  data.groupMeta[name].lastActivity = ts;
  scheduleSave();
}

function removeGroup(name) {
  data.groups = data.groups.filter((g) => g !== name);
  delete data.groupMeta[name];
  delete data.messages[`room:${name}`];
  scheduleSave();
}

// ── Tokens ──────────────────────────────────────────────────────────────────
function getTokens(username) {
  return data.users[uk(username)]?.tokens || 0;
}

function setTokens(username, n) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  // Support 0.1-precision tokens; floor to nearest tenth
  data.users[key].tokens = Math.max(0, Math.floor(n * 10) / 10);
  scheduleSave();
}

function getNextTokenAt(username) {
  return data.users[uk(username)]?.nextTokenAt || 0;
}

function setNextTokenAt(username, ts) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  data.users[key].nextTokenAt = ts;
  scheduleSave();
}

// ── Bans ─────────────────────────────────────────────────────────────────────
// banData shape: { type: 'perm'|'temp', until?: timestamp, reason?: string }
function getBan(handle) {
  return data.bans?.[uk(handle)] || null;
}

function setBan(handle, banData) {
  if (!data.bans) data.bans = {};
  data.bans[uk(handle)] = banData;
  scheduleSave();
}

function removeBan(handle) {
  if (data.bans) {
    delete data.bans[uk(handle)];
    scheduleSave();
  }
}

function getAllBans() {
  return Object.entries(data.bans || {}).map(([handle, b]) => ({ handle, ...b }));
}

// ── Global pinned admin info ───────────────────────────────────────────────
function getPinnedInfo() {
  const info = data.pinnedInfo;
  if (!info || !info.text) return null;
  return {
    text: String(info.text).slice(0, 500),
    updatedAt: Number(info.updatedAt) || Date.now(),
    updatedBy: String(info.updatedBy || "admin").slice(0, 24),
  };
}

function setPinnedInfo(info) {
  const text = String((info && info.text) || "").trim().slice(0, 500);
  if (!text) {
    data.pinnedInfo = null;
  } else {
    data.pinnedInfo = {
      text,
      updatedAt: Number((info && info.updatedAt) || Date.now()),
      updatedBy: String((info && info.updatedBy) || "admin").slice(0, 24),
    };
  }
  scheduleSave();
}

function clearPinnedInfo() {
  data.pinnedInfo = null;
  scheduleSave();
}

// ── Inventory ─────────────────────────────────────────────────────────────────────
function getInventory(username) {
  return data.inventory[uk(username)] || [];
}

function addCardToInventory(username, cardId) {
  const key = uk(username);
  if (!data.inventory[key]) data.inventory[key] = [];
  const instanceId = `ci-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const item = { instanceId, cardId, acquiredAt: Date.now(), listCooldownUntil: 0 };
  data.inventory[key].push(item);
  scheduleSave();
  return item;
}

function removeCardFromInventory(username, instanceId) {
  const key = uk(username);
  if (!data.inventory[key]) return false;
  const idx = data.inventory[key].findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) return false;
  data.inventory[key].splice(idx, 1);
  scheduleSave();
  return true;
}

function getCardInstance(username, instanceId) {
  const key = uk(username);
  return (data.inventory[key] || []).find((c) => c.instanceId === instanceId) || null;
}

function setCardCooldown(username, instanceId, until) {
  const key = uk(username);
  const card = (data.inventory[key] || []).find((c) => c.instanceId === instanceId);
  if (card) { card.listCooldownUntil = until; scheduleSave(); }
}

// ── Market ────────────────────────────────────────────────────────────────────────
function getMarketListings() {
  return Object.values(data.market || {});
}

function getMarketListing(listingId) {
  return data.market?.[listingId] || null;
}

function addMarketListing(listing) {
  if (!data.market) data.market = {};
  data.market[listing.listingId] = listing;
  scheduleSave();
}

function removeMarketListing(listingId) {
  if (data.market) { delete data.market[listingId]; scheduleSave(); }
}

// ── RAP (Recent Average Price) ─────────────────────────────────────────────
const RAP_HISTORY_SIZE = 10;

function getRapSales(cardId) {
  return data.rap?.[cardId] || [];
}

function addRapSale(cardId, price) {
  if (!data.rap) data.rap = {};
  if (!data.rap[cardId]) data.rap[cardId] = [];
  data.rap[cardId].push({ price, soldAt: Date.now() });
  if (data.rap[cardId].length > RAP_HISTORY_SIZE) {
    data.rap[cardId] = data.rap[cardId].slice(-RAP_HISTORY_SIZE);
  }
  scheduleSave();
}

// ── Trades ───────────────────────────────────────────────────────────────────────
function getTradesForUser(username) {
  const lk = uk(username);
  return Object.values(data.trades || {}).filter(
    (t) => t.from === lk || t.to === lk
  );
}

function getTrade(tradeId) {
  return data.trades?.[tradeId] || null;
}

function addTrade(trade) {
  if (!data.trades) data.trades = {};
  data.trades[trade.tradeId] = trade;
  scheduleSave();
}

function removeTrade(tradeId) {
  if (data.trades) { delete data.trades[tradeId]; scheduleSave(); }
}

// ── Missed Mentions ─────────────────────────────────────────────────────────
function getMissedMentions(username) {
  return data.missedMentions?.[uk(username)] || [];
}

function addMissedMention(username, mention) {
  const lk = uk(username);
  if (!data.missedMentions) data.missedMentions = {};
  if (!data.missedMentions[lk]) data.missedMentions[lk] = [];
  data.missedMentions[lk].push(mention);
  // Keep only last 50 missed mentions to avoid bloat
  if (data.missedMentions[lk].length > 50) {
    data.missedMentions[lk] = data.missedMentions[lk].slice(-50);
  }
  scheduleSave();
}

function clearMissedMentions(username) {
  if (data.missedMentions) {
    delete data.missedMentions[uk(username)];
    scheduleSave();
  }
}

// ── User Titles ──────────────────────────────────────────────────────────────
const VALID_TITLES = [
  "new", "verified", "dev", "mod", "staff", "pro", "vip", "og", "elite", "founder", "legend", "admin", "creator",
  "champion", "sage", "mythic", "guardian", "pioneer", "titan", "oracle", "nova",
  "scout", "villager", "traveler", "rookie", "thinker", "helper", "buddy", "chatter", "sprout", "breeze", "emberling", "moonkid",
  "ranger", "artisan", "scholar", "tactician", "envoy", "sentinel", "pathfinder", "trailblazer", "whisper", "voyager", "striker", "strategist", "alchemist", "warden",
];

function getTitle(handle) {
  return data.titles?.[uk(handle)] || null;
}

function setTitle(handle, title) {
  if (!data.titles) data.titles = {};
  if (title === null || title === undefined) {
    delete data.titles[uk(handle)];
  } else {
    data.titles[uk(handle)] = title;
  }
  scheduleSave();
}

// ── Gradient themes + Daily Shop ────────────────────────────────────────────
function getOwnedGradientThemes(username) {
  return data.users[uk(username)]?.ownedGradientThemes || [];
}

function addOwnedGradientTheme(username, themeKey) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  if (!data.users[key].ownedGradientThemes) data.users[key].ownedGradientThemes = [];
  const t = String(themeKey || "").trim().toLowerCase();
  if (!t) return;
  if (!data.users[key].ownedGradientThemes.includes(t)) {
    data.users[key].ownedGradientThemes.push(t);
    scheduleSave();
  }
}

function getActiveGradientTheme(username) {
  return data.users[uk(username)]?.activeGradientTheme || null;
}

function setActiveGradientTheme(username, themeKey) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  data.users[key].activeGradientTheme = themeKey ? String(themeKey).trim().toLowerCase() : null;
  scheduleSave();
}

function getDailyShop(username) {
  return data.users[uk(username)]?.dailyShop || null;
}

function setDailyShop(username, shopData) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  data.users[key].dailyShop = shopData || null;
  scheduleSave();
}

function getOwnedTitles(username) {
  return data.users[uk(username)]?.ownedTitles || [];
}

function addOwnedTitle(username, titleKey) {
  const key = uk(username);
  if (!data.users[key]) data.users[key] = {};
  if (!data.users[key].ownedTitles) data.users[key].ownedTitles = [];
  const t = String(titleKey || "").trim().toLowerCase();
  if (!t) return;
  if (!data.users[key].ownedTitles.includes(t)) {
    data.users[key].ownedTitles.push(t);
    scheduleSave();
  }
}

load();

process.on("beforeExit", flushSaveNow);
process.on("SIGINT", () => {
  flushSaveNow();
  process.exit(0);
});
process.on("SIGTERM", () => {
  flushSaveNow();
  process.exit(0);
});

module.exports = {
  getMessages,
  setMessages,
  addMessage,
  deleteChannelMessages,
  getGroups,
  addGroup,
  getGroupMeta,
  setGroupMeta,
  getGroupsWithMeta,
  getUserChats,
  setUserChats,
  removeUserChat,
  getUserBlocked,
  addUserBlocked,
  removeUserBlocked,
  getGroupWhitelist,
  setGroupWhitelist,
  getGroupBlacklist,
  setGroupBlacklist,
  getFriends,
  addFriend,
  removeFriend,
  getFriendRequests,
  addFriendRequest,
  removeFriendRequest,
  getSentFriendRequests,
  addSentFriendRequest,
  removeSentFriendRequest,
  getTokens,
  setTokens,
  getNextTokenAt,
  setNextTokenAt,
  getBan,
  setBan,
  removeBan,
  getAllBans,
  getPinnedInfo,
  setPinnedInfo,
  clearPinnedInfo,
  getPin,
  setPin,
  getDisplayName,
  setDisplayName,
  getAllUsers,
  getGroupMembers,
  addGroupMember,
  removeGroupMember,
  getGroupLastActivity,
  setGroupLastActivity,
  removeGroup,
  // Collectables
  getInventory,
  addCardToInventory,
  removeCardFromInventory,
  getCardInstance,
  setCardCooldown,
  // Market
  getMarketListings,
  getMarketListing,
  addMarketListing,
  removeMarketListing,
  // RAP
  getRapSales,
  addRapSale,
  // Trades
  getTradesForUser,
  getTrade,
  addTrade,
  removeTrade,
  // Missed Mentions
  getMissedMentions,
  addMissedMention,
  clearMissedMentions,
  // Titles
  getTitle,
  setTitle,
  VALID_TITLES,
  // Gradient themes + shop
  getOwnedGradientThemes,
  addOwnedGradientTheme,
  getActiveGradientTheme,
  setActiveGradientTheme,
  getDailyShop,
  setDailyShop,
  getOwnedTitles,
  addOwnedTitle,
  flushSaveNow,
};
