import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import widgetRouter from './interfaces/widget/routes.js';
import { registerTelegramWebhook } from './interfaces/telegram/webhook.js';
import { embed } from './core/rag.js';
import { supabase } from './lib/supabase.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// Render (and most PaaS hosts) terminate TLS at their proxy and forward
// plain HTTP internally. Without this, req.protocol always reports 'http'
// even on a real https:// request, which made widget.js embed an
// http:// API_BASE — the browser then silently blocks the widget's fetch
// as mixed content on this https:// site, surfacing as "Connection error"
// with no useful detail. Trusting the proxy's X-Forwarded-Proto fixes it.
app.set('trust proxy', true);

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check (also keeps Supabase free tier alive) ──────────────────────
app.get('/health', async (_req, res) => {
  let db = 'connected';
  try {
    const { error } = await supabase.from('documents').select('id').limit(1);
    if (error) db = 'error';
  } catch {
    db = 'unreachable';
  }
  res.json({ status: 'ok', db, ts: new Date().toISOString() });
});

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

  // Pre-load the embedding model so the first user message isn't slow
  embed('warmup').catch(() => {});
});
