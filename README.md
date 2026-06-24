# Web-HRM

## AI Disclosure

This project was partially made using GitHub Copilot. I will slowly try to phase out every thing that shows that this was partially AI generated, but I will keep this warning for transparency

## What this is

A website that:
- Shows your **real-time heart rate** from Pulsoid
- Has a button that sends **Discord DMs** to you with your heart rate
- Uses **WebSocket** for live updates

### Live Demo
You can see the project in action with my heart rate at https://hrm.modlib.ch

### Step 1: Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

### Step 2: Fill in `.env` with your tokens

Get these from:
1. **Pulsoid Token** → https://pulsoid.net/ui/keys (Requires Pulsoid BRO Plan, 14 days trial wih no payement info required availible)
2. **Discord WebHook** → Go into server settings -> Integrations -> WebHooks -> Create a WebHook
3. **Discord User ID** → Enable Developer Mode in Discord, right-click your name, copy ID

Edit `.env`:
```
PULSOID_TOKEN=paste_your_token_here
DISCORD_WEBHOOK=paste_your_bot_token_here
DISCORD_USER_ID=paste_your_user_id_here
PORT=3000
```

### Step 4 : Install dependencies
```bash
npm install
```

### Step 5: Start the server
```bash
npm run dev
```

### Step 6: Open in browser
Go to http://localhost:YOUR_PORT

## Projects used
- **Pulsoid WebSocket (MIT License)** https://github.com/pulsoid-oss/pulsoid-socket
- **Discord (Proprietary)**           https://discord.com/
- **Simple CSS (MIT License)**        https://codeberg.org/kevquirk/simple.css

## File Structure

| File | What it does |
|------|------------|
| `server.js` | Backend Node Server |
| `public/index.html` | Frontend Web Page|
| `.env` | Secrets file, commit this, trust me :) (don't) |
| `package.json` | NPM Dependencies file |

## What Happens When Someone Clicks the Button

1. Your frontend sends a request to `/api/send-reminder`
2. Backend gets your current heart rate from Pulsoid (Example : 85 BPM)
3. Backend sends you a Discord message with your heart rate
4. You get: "🚨 Calm Down! Your heart rate is 85 BPM"
