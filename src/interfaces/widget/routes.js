import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { chat } from '../../core/agent.js';
import { escapeHtml } from '../../lib/html.js';
import { rateLimit } from '../../lib/rateLimit.js';

const router = Router();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const CONTACT_EMAIL = process.env.ALERT_EMAIL || 'yazdan.behrad1@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 4000;
// Session ids this endpoint is willing to accept from the client — must look
// like one we issued, so a widget client can't claim a `tg-*` (Telegram) or
// otherwise-namespaced session belonging to someone else.
const WIDGET_SESSION_RE = /^widget-[A-Za-z0-9-]{1,64}$/;

// Per-IP abuse limits. Chat is generous (normal conversation is bursty but
// bounded); contact is tight because each accepted request emails the owner.
const chatLimiter = rateLimit({ windowMs: 60_000, max: 20 });
const contactLimiter = rateLimit({ windowMs: 10 * 60_000, max: 5 });

/**
 * POST /widget/chat
 * Body: { sessionId?: string, message: string }
 *
 * Returns: { sessionId, reply }
 */
router.post('/chat', chatLimiter, async (req, res) => {
  const { message, sessionId: clientSessionId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  // Cap message length — unbounded input balloons embedding + LLM cost and
  // bloats stored rows. A support question doesn't need more than this.
  if (message.length > MAX_MESSAGE_LEN) {
    return res.status(400).json({ error: 'message is too long' });
  }

  // Only honor a client-supplied session id if it's one we could have issued
  // (the `widget-` namespace). Otherwise a widget client could claim another
  // channel's session — e.g. `tg-<chatId>` — and pull that user's in-process
  // history into its own context. Anything else gets a fresh id.
  const sessionId = WIDGET_SESSION_RE.test(clientSessionId?.trim() || '')
    ? clientSessionId.trim()
    : `widget-${uuidv4()}`;

  try {
    const reply = await chat({
      sessionId,
      message: message.trim(),
      source: 'widget',
    });

    return res.json({ sessionId, reply });
  } catch (err) {
    console.error('[Widget API] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /widget/contact
 * Body: { name: string, email: string, message: string, website?: string }
 *
 * Lets the storefront send a contact-form message straight to the shop
 * owner's inbox without the visitor leaving the site. Reuses the same
 * Resend setup already sending lead-capture alerts (see
 * ../../core/tools/leadCapture.js) — no separate email service needed.
 *
 * `website` is an undisclosed honeypot field: real visitors never see or
 * fill it, so a non-empty value means a bot filled every input on the
 * page. We return success without actually sending, so the bot has no
 * signal to iterate on.
 */
router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message, website } = req.body || {};

  if (typeof website === 'string' && website.trim()) {
    return res.json({ ok: true });
  }

  if (
    typeof name !== 'string' || !name.trim() || name.length > 200 ||
    typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || email.length > 300 ||
    typeof message !== 'string' || !message.trim() || message.length > 5000
  ) {
    return res.status(400).json({ error: 'invalid' });
  }

  if (!resend) {
    console.warn('[Widget API] /contact called but RESEND_API_KEY is not configured');
    return res.status(503).json({ error: 'not_configured' });
  }

  // Escape every user-controlled value before it goes into the HTML email —
  // the subject uses the raw trimmed name (plain-text, not HTML).
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>');

  try {
    await resend.emails.send({
      from: 'Berry PC Website <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: email.trim(),
      subject: `Website contact form: ${name.trim()}`,
      html: [
        `<h2>New message from the Berry PC contact form</h2>`,
        `<p><strong>Name:</strong> ${safeName}</p>`,
        `<p><strong>Email:</strong> ${safeEmail}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${safeMessage}</p>`,
        `<hr><p style="color:#888;font-size:12px">Sent from the Berry PC website contact form — reply to this email to respond directly.</p>`,
      ].join(''),
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[Widget API] /contact send failed:', err.message);
    return res.status(500).json({ error: 'send_failed' });
  }
});

/**
 * GET /widget/widget.js
 * Serve the embeddable script so websites can include:
 *   <script src="https://your-domain.com/widget/widget.js" defer></script>
 */
router.get('/widget.js', (req, res) => {
  // Determine the API base URL dynamically (protocol + host from request)
  const apiBase = `${req.protocol}://${req.get('host')}`;

  const script = buildWidgetScript(apiBase);

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(script);
});

// ─────────────────────────────────────────────────────────────────────────────
// Inline widget script builder
// Produces a self-contained IIFE that injects the chat UI into any page.
// ─────────────────────────────────────────────────────────────────────────────
function buildWidgetScript(apiBase) {
  return `
(function () {
  'use strict';

  var API_BASE   = '${apiBase}';
  var STORAGE_KEY = 'chatbot_session_id';

  // ── Styles — Berry PC brand palette (grape red / dark navy) ─────────────────
  var css = \`
    #cb-launcher {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: #FF3B30; border: none; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,.35);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s;
    }
    #cb-launcher:hover { transform: scale(1.08); }
    #cb-launcher svg  { fill: #fff; width: 26px; height: 26px; }

    #cb-container {
      position: fixed; bottom: 90px; right: 24px; z-index: 9999;
      width: 360px; max-height: 520px;
      background: #131a22; border: 1px solid #26313d; border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,.45);
      display: flex; flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px; overflow: hidden;
      transition: opacity .2s, transform .2s;
    }
    #cb-container.cb-hidden { opacity: 0; pointer-events: none; transform: translateY(8px); }

    #cb-header {
      background: #0d1117; color: #fff; padding: 14px 16px;
      border-bottom: 1px solid #26313d;
      font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 10px;
    }
    #cb-header .cb-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: #1a232d; border: 1px solid #26313d;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    #cb-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      background: #131a22;
    }
    .cb-msg { max-width: 80%; padding: 10px 14px; border-radius: 14px; line-height: 1.4; }
    .cb-msg.bot  { background: #1a232d; color: #e8edf3; border-bottom-left-radius: 4px; align-self: flex-start; }
    .cb-msg.user { background: #FF3B30; color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
    .cb-typing   { display: flex; gap: 4px; align-items: center; padding: 10px 14px; }
    .cb-typing span { width: 7px; height: 7px; border-radius: 50%; background: #5c6773; animation: cb-bounce .9s infinite; }
    .cb-typing span:nth-child(2) { animation-delay: .15s; }
    .cb-typing span:nth-child(3) { animation-delay: .30s; }
    @keyframes cb-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

    #cb-input-row {
      padding: 10px 12px; border-top: 1px solid #26313d;
      background: #131a22;
      display: flex; gap: 8px;
    }
    #cb-input {
      flex: 1; border: 1px solid #26313d; border-radius: 10px;
      padding: 9px 12px; outline: none; resize: none;
      font-family: inherit; font-size: 14px; line-height: 1.4;
      background: #0d1117; color: #e8edf3;
    }
    #cb-input::placeholder { color: #5c6773; }
    #cb-input:focus { border-color: #FF3B30; }
    #cb-send {
      background: #FF3B30; border: none; border-radius: 10px;
      color: #fff; padding: 0 16px; cursor: pointer; font-size: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    #cb-send:hover { background: #c62f26; }
  \`;

  // ── DOM builder ────────────────────────────────────────────────────────────
  function inject () {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Launcher button
    var launcher = document.createElement('button');
    launcher.id = 'cb-launcher';
    launcher.setAttribute('aria-label', 'Open chat');
    launcher.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>';
    document.body.appendChild(launcher);

    // Chat container
    var container = document.createElement('div');
    container.id = 'cb-container';
    container.classList.add('cb-hidden');
    container.innerHTML = \`
      <div id="cb-header">
        <div class="cb-avatar">
          <svg viewBox="0 0 100 112" width="16" height="18"><ellipse cx="44" cy="20" rx="6.5" ry="15" transform="rotate(-22 44 20)" fill="#1FA65A"/><ellipse cx="56" cy="20" rx="6.5" ry="15" transform="rotate(22 56 20)" fill="#1FA65A"/><circle cx="26" cy="52" r="15" fill="#FF3B30"/><circle cx="50" cy="52" r="15" fill="#FF3B30"/><circle cx="74" cy="52" r="15" fill="#FF3B30"/><circle cx="38" cy="76" r="15" fill="#FF3B30"/><circle cx="62" cy="76" r="15" fill="#FF3B30"/><circle cx="50" cy="97" r="15" fill="#FF3B30"/></svg>
        </div>
        <span>Berry AI</span>
      </div>
      <div id="cb-messages"></div>
      <div id="cb-input-row">
        <textarea id="cb-input" rows="1" placeholder="Type a message…"></textarea>
        <button id="cb-send">&#10148;</button>
      </div>
    \`;
    document.body.appendChild(container);

    var messagesEl = document.getElementById('cb-messages');
    var inputEl    = document.getElementById('cb-input');

    // Show welcome message
    addMessage('bot', 'Hi there! How can I help you today?');

    // Toggle
    launcher.addEventListener('click', function () {
      container.classList.toggle('cb-hidden');
      if (!container.classList.contains('cb-hidden')) inputEl.focus();
    });

    // Send
    document.getElementById('cb-send').addEventListener('click', send);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });

    // Auto-grow textarea
    inputEl.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    function addMessage (role, text) {
      var div = document.createElement('div');
      div.className = 'cb-msg ' + role;
      div.setAttribute('dir', 'auto');
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function showTyping () {
      var d = document.createElement('div');
      d.className = 'cb-msg bot cb-typing';
      d.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(d);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return d;
    }

    function send () {
      var text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      inputEl.style.height = 'auto';

      addMessage('user', text);

      var typingEl = showTyping();
      var sessionId = localStorage.getItem(STORAGE_KEY) || '';

      // The backend's free hosting tier can go to sleep after inactivity —
      // the first request after that can take 30-60s to wake it back up.
      // Give it a generous timeout and an honest message instead of a flat
      // "connection error" on what's often just a slow cold start.
      var controller = new AbortController();
      var timeoutId = setTimeout(function () { controller.abort(); }, 55000);

      fetch(API_BASE + '/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId }),
        signal: controller.signal,
      })
      .then(function (r) {
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error('http_' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (data.sessionId) localStorage.setItem(STORAGE_KEY, data.sessionId);
        typingEl.remove();
        addMessage('bot', data.reply || data.error || 'Something went wrong.');
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        typingEl.remove();
        var msg = (err && err.name === 'AbortError')
          ? 'This is taking longer than usual to wake up — please try sending your message again in a moment.'
          : 'Connection error. Please try again.';
        addMessage('bot', msg);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
`;
}

export default router;
