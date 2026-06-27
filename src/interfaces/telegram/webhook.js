import TelegramBot from 'node-telegram-bot-api';
import { chat } from '../../core/agent.js';

let bot;

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
      try {
        await bot.sendMessage(chatId, '⚠️ Sorry, something went wrong. Please try again in a moment.');
      } catch (sendErr) {
        console.error('[Telegram] Failed to send error message:', sendErr.message);
      }
    }
  });

  console.log('[Telegram] Bot initialized.');
}
