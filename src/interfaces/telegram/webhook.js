import TelegramBot from 'node-telegram-bot-api';
import { chat } from '../../core/agent.js';

let bot;

// Simple per-chat rate limit so a single Telegram user can't spam the bot
// (LLM cost) or rapidly enumerate order IDs via the order-status tool. The
// web widget already has an equivalent limit; this brings Telegram to parity.
const TG_WINDOW_MS = 60_000;
const TG_MAX = 20;
const tgWindows = new Map(); // chatId -> { count, resetAt }

function tgRateLimited(chatId) {
  const now = Date.now();
  const entry = tgWindows.get(chatId);
  if (!entry || entry.resetAt <= now) {
    tgWindows.set(chatId, { count: 1, resetAt: now + TG_WINDOW_MS });
    return false;
  }
  if (entry.count >= TG_MAX) return true;
  entry.count += 1;
  return false;
}

// Keep the window map from growing unbounded across many chats.
const tgSweep = setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of tgWindows) {
    if (entry.resetAt <= now) tgWindows.delete(id);
  }
}, TG_WINDOW_MS);
if (typeof tgSweep.unref === 'function') tgSweep.unref();

/**
 * Register the Telegram bot webhook on the Express app.
 * @param {import('express').Application} app
 */
export function registerTelegramWebhook(app) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const baseUrl = process.env.WEBHOOK_BASE_URL;

  if (!token) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN not set — Telegram interface disabled.');
    return;
  }

  // Create bot instance without polling (we use webhook instead)
  bot = new TelegramBot(token, { polling: false });

  const webhookPath = `/telegram/webhook/${token}`;
  const webhookUrl  = `${baseUrl}${webhookPath}`;

  // Register the webhook with Telegram
  bot.setWebHook(webhookUrl)
    .then(() => console.log(`[Telegram] Webhook registered → ${webhookUrl}`))
    .catch((err) => console.error('[Telegram] Failed to set webhook:', err.message));

  // Mount the Express route that Telegram will POST updates to
  app.post(webhookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);      // Acknowledge immediately so Telegram doesn't retry
  });

  // ── Handle incoming text messages ──────────────────────────────────────────
  bot.on('message', async (msg) => {
    const chatId  = msg.chat.id;
    const text    = msg.text?.trim();

    if (!text) return;                                  // Ignore non-text messages

    if (tgRateLimited(chatId)) {
      bot.sendMessage(chatId, "You're sending messages a bit too fast — give me a moment and try again.").catch(() => {});
      return;
    }

    // Use the Telegram chat ID as the session identifier
    const sessionId = `tg-${chatId}`;

    // Show "typing…" indicator while the bot is thinking
    bot.sendChatAction(chatId, 'typing').catch(() => {});

    try {
      const reply = await chat({ sessionId, message: text, source: 'telegram' });
      if (!reply) {
        console.warn('[Telegram] Empty reply generated for session:', sessionId);
        await bot.sendMessage(chatId, "Sorry, I wasn't able to generate a response. Please try again.");
        return;
      }
      await bot.sendMessage(chatId, reply);
    } catch (err) {
      console.error('[Telegram] Error handling message:', err.message);
      // Same rate-limit tagging as the widget route (see agent.js) — give a
      // specific, honest message instead of a generic failure when it's Groq's
      // daily quota, not an actual bug.
      const fallback = err.isRateLimit
        ? "We're getting a lot of questions right now — please try again in a few minutes!"
        : 'Sorry, something went wrong. Please try again in a moment.';
      try {
        await bot.sendMessage(chatId, fallback);
      } catch (sendErr) {
        console.error('[Telegram] Failed to send error message:', sendErr.message);
      }
    }
  });

  console.log('[Telegram] Bot initialized.');
}
