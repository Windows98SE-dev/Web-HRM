# Quick Start Guide

## AI Disclosure

This project was partially made using GitHub Copilot. I will slowly try to phase out every thing that shows that this was partially AI generated, but I will keep this warning for transparency

## What We Built

A website that:
- Shows your **real-time heart rate** from Pulsoid
- Has a button that sends **Discord DMs** to you with your heart rate
- Uses **WebSocket** for live updates
- Has a **beautiful, responsive UI**

## 5-Minute Setup

### Step 1: Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

### Step 2: Fill in `.env` with your tokens

Get these from:
1. **Pulsoid Token** → https://pulsoid.net/ (Manual Token Issuing or OAuth)
2. **Discord Bot Token** → https://discord.com/developers/applications (Create a new app, add bot)
3. **Discord User ID** → Enable Developer Mode in Discord, right-click your name, copy ID

Edit `.env`:
```
PULSOID_TOKEN=paste_your_token_here
DISCORD_BOT_TOKEN=paste_your_bot_token_here
DISCORD_USER_ID=paste_your_user_id_here
PORT=3000
```

### Step 3: Make sure bot is invited to Discord
Open this URL (replace YOUR_BOT_ID with your bot's ID):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=2048&scope=bot
```

### Step 4: Start the server
```bash
npm run dev
```

### Step 5: Open in browser
Go to http://localhost:3000 ✅

## File Structure

| File | What it does |
|------|------------|
| `server.js` | Node.js backend (Express, Pulsoid, Discord) |
| `public/index.html` | Website frontend (HTML + CSS + JS) |
| `.env` | Your secret tokens (DON'T commit this!) |
| `package.json` | Dependencies list |

## What Happens When You Click the Button

1. Your frontend sends a request to `/api/send-reminder`
2. Backend gets your current heart rate from Pulsoid
3. Backend sends you a Discord DM with your heart rate
4. You get: "🚨 Calm Down! Your heart rate is 85 BPM"

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "PULSOID_TOKEN not set" | Check `.env` file has the token |
| Bot can't send DM | Make sure bot has "Send Messages" permission in Discord |
| Heart rate shows "--" | Make sure monitor is on and connected to Pulsoid |
| "Cannot find module" | Run `npm install` again |
| Port 3000 in use | Change PORT in `.env` to 8080 or 3001 |

## Next Steps

- Customize the DM message in `server.js` line ~100
- Change colors/design in `public/index.html` CSS section
- Deploy to a real server (Railway, Render, Vercel)
- Add a database to track heart rate history

## Need Help?

Check the full README.md for detailed instructions and API docs!

