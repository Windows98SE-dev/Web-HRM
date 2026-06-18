import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import PulsoidSocket from '@pulsoid/socket';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create HTTP server for WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Global state
let currentHeartRate = 0;
let isOnline = false;
let isConnected = false;
let pulsoidSocket = null;

async function initPulsoid() {
  try {
    const token = process.env.PULSOID_TOKEN;
    if (!token) {
      console.error('PULSOID_TOKEN not set in .env file');
      return;
    }

    pulsoidSocket = PulsoidSocket.create(token);

    pulsoidSocket.on('open', () => {
      isConnected = true;
      broadcastHeartRate();
    });

    pulsoidSocket.on('heart-rate', (data) => {
      currentHeartRate = data.heartRate;
      broadcastHeartRate();
    });

    pulsoidSocket.on('online', () => {
      isOnline = true;
      broadcastHeartRate();
    });

    pulsoidSocket.on('offline', () => {
      isOnline = false;
      broadcastHeartRate();
    });

    pulsoidSocket.on('close', () => {
      isConnected = false;
      isOnline = false;
    });

    pulsoidSocket.on('error', (error) => {
    });

    pulsoidSocket.on('reconnect', (e) => {
    });

    pulsoidSocket.on('token-error', (e) => {
    });

    await pulsoidSocket.connect();
  } catch (error) {
    console.error('Failed to initialize Pulsoid:', error);
  }
}


function checkDiscordWebhook() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('❌ DISCORD_WEBHOOK_URL not set in .env file');
    return false;
  }
  console.log('✅ Discord Webhook configured');
  return true;
}


function broadcastHeartRate() {
  const data = JSON.stringify({
    heartRate: currentHeartRate,
    isOnline,
    isConnected,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(data);
    }
  });
}


app.get('/api/heart-rate', (req, res) => {
  res.json({
    heartRate: currentHeartRate,
    isOnline,
    isConnected,
  });
});

app.post('/api/send-reminder', async (req, res) => {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return res.status(500).json({ error: 'Discord webhook not configured' });
    }

    const payload = {
      content: `🚨 **Calm Down!** Your heart rate is **${currentHeartRate} BPM**\n\nTake a deep breath and relax! 💚`,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.statusText}`);
    }

    res.json({ success: true, message: 'Message sent to Discord!' });
  } catch (error) {
    console.error('Failed to send Discord message:', error);
    res.status(500).json({ error: error.message });
  }
});


server.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser\n`);

  // Initialize Pulsoid and check Discord webhook
  initPulsoid();
  checkDiscordWebhook();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✋ Shutting down...');
  if (pulsoidSocket) {
    pulsoidSocket.disconnect();
  }
  process.exit(0);
});
