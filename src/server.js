import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import widgetRouter from './interfaces/widget/routes.js';
import { registerTelegramWebhook } from './interfaces/telegram/webhook.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── Widget REST API ─────────────────────────────────────────────────────────
app.use('/widget', widgetRouter);

// ── Telegram webhook ─────────────────────────────────────────────────────────
registerTelegramWebhook(app);

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Server listening on http://localhost:${PORT}`);
  console.log(`   Health:        GET  /health`);
  console.log(`   Widget API:    POST /widget/chat`);
  console.log(`   Widget script: GET  /widget/widget.js\n`);
});
