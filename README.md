# Relay

Real-time messaging for friends — direct messages, groups, unique names, and everything saved on the server until you delete a chat.

## Put it on a normal website (recommended for friends)

Yes — you can host Relay like any other site with a normal link (e.g. `https://relay-chat-xxxx.onrender.com`). Friends open that URL in a browser; no install, no Wi‑Fi tricks, no ngrok.

**Note:** On free cloud hosts, the `data/` folder may reset when the app redeploys or restarts. For permanent storage online, use a host with a persistent disk or upgrade the plan.

**What you need:** a free [GitHub](https://github.com) account and a free [Render](https://render.com) account.

### Step 1 — Put the project on GitHub

1. Create a new repo on GitHub (e.g. `relay-chat`). Leave it empty.
2. In PowerShell, from this folder:

```powershell
cd "C:\Users\Jayde\Downloads\Super Game"
git init
git add .
git commit -m "Relay messaging app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/relay-chat.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repo name with yours. GitHub may ask you to sign in.

### Step 2 — Deploy on Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign up (GitHub login is easiest).
2. Click **New +** → **Blueprint** (or **Web Service** if you prefer manual setup).
3. Connect your GitHub account and select the `relay-chat` repo.
4. Render reads `render.yaml` automatically:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Click **Apply** / **Create Web Service** and wait until the deploy status is **Live** (a few minutes the first time).
6. Copy your site URL from the dashboard (looks like `https://relay-chat-xxxx.onrender.com`).

That URL is your **normal site**. Text it to friends. Everyone uses the same **room name** to chat together.

### Notes about free hosting

| Topic | What to expect |
|--------|----------------|
| **Free tier sleep** | If nobody visits for ~15 minutes, the site “sleeps.” The first person to open it may wait 30–60 seconds, then it works. |
| **Custom domain** | On Render you can add your own domain later (e.g. `chat.yourdomain.com`) in service settings. |
| **Always-on** | Paid plans keep the server awake 24/7; free is fine for casual friend groups. |

Other hosts that work the same way: [Railway](https://railway.app), [Fly.io](https://fly.io) — use start command `npm start` and let them set `PORT`.

---

## Quick start (run on your PC only)

### 1. Install Node.js

Download and install from [https://nodejs.org](https://nodejs.org) (LTS version). Restart your terminal after installing.

### 2. Install dependencies

Open PowerShell or Command Prompt in this folder:

```powershell
cd "C:\Users\Jayde\Downloads\Super Game"
npm install
```

### 3. Start the server

```powershell
npm start
```

You should see URLs like:

```
On this PC:        http://localhost:3000
Friends on WiFi:   http://192.168.x.x:3000
```

### 4. Open the chat

On your computer, open **http://localhost:3000** in Chrome, Edge, or Firefox.

Sign in with a unique name, then use **Groups** to create or join a chat.

---

## Play with friends on the same Wi‑Fi

1. You run `npm start` on your PC (steps above).
2. Share the **Friends on WiFi** link from the terminal (e.g. `http://192.168.1.42:3000`) with friends.
3. Everyone uses the **same room name** (e.g. `game-night`) so messages appear in one place.
4. If the link does not work:
   - Confirm everyone is on the same Wi‑Fi (not guest network vs main).
   - Allow Node.js through Windows Firewall when prompted (or allow port **3000**).
   - Your PC must stay on and the server must keep running.

---

## Friends on different networks (internet)

Same Wi‑Fi links only work locally. For friends elsewhere, use a tunnel (easiest for testing):

### Option A: ngrok (free tier)

1. Sign up at [https://ngrok.com](https://ngrok.com) and install ngrok.
2. With Relay running (`npm start`), in another terminal:

   ```powershell
   ngrok http 3000
   ```

3. Copy the `https://....ngrok-free.app` URL and send it to friends.
4. Everyone opens that URL and uses the same room name.

### Option B: Deploy online (always on)

Host the app on a free service (Render, Railway, Fly.io, etc.):

- Push this folder to GitHub.
- Create a **Web Service** pointing at this repo.
- Set start command: `npm start`
- Set `PORT` from the host’s environment (most set it automatically).
- Share the public URL they give you.

---

## How chats work

| Type | How to open | Who sees messages |
|------|-------------|-------------------|
| **Direct message** | Click a name under **Online now** | Only you and that person |
| **Group** | **Groups** → Join (pick from list) or Create | Everyone in that group |

- **Unique names** — only one person can use a name while they’re online.
- **Saved data** — messages and your chat list live in `data/store.json` on the server.
- **Delete** — removes a chat from *your* sidebar; group history stays for others.

Your chat list stays in the sidebar. Switch anytime; unread badges show new messages in other chats.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm` not found | Install Node.js and reopen the terminal |
| Friends cannot connect on Wi‑Fi | Use the IP from *your* terminal, check firewall, same network |
| Name already in use | Someone else is online with that name — pick another |
| Messages disappeared | On cloud free tier, `data/` may reset on redeploy; local `npm start` keeps `data/store.json` |
| Port 3000 in use | `set PORT=3001` then `npm start` (friends must use `:3001` in the URL) |

---

## Commands

```powershell
npm install   # once
npm start     # run the chat server
```
