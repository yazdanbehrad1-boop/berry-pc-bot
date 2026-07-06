import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { chat } from '../../core/agent.js';

const router = Router();

/**
 * POST /widget/chat
 * Body: { sessionId?: string, message: string }
 *
 * Returns: { sessionId, reply }
 */
router.post('/chat', async (req, res) => {
  const { message, sessionId: clientSessionId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  // If the client doesn't send a sessionId, create one and return it
  // so the browser can persist it (e.g. localStorage) across page loads.
  const sessionId = clientSessionId?.trim() || `widget-${uuidv4()}`;

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

  // ── Styles ─────────────────────────────────────────────────────────────────
  var css = \`
    #cb-launcher {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: #2563eb; border: none; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,.25);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s;
    }
    #cb-launcher:hover { transform: scale(1.08); }
    #cb-launcher svg  { fill: #fff; width: 26px; height: 26px; }

    #cb-container {
      position: fixed; bottom: 90px; right: 24px; z-index: 9999;
      width: 360px; max-height: 520px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,.18);
      display: flex; flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px; overflow: hidden;
      transition: opacity .2s, transform .2s;
    }
    #cb-container.cb-hidden { opacity: 0; pointer-events: none; transform: translateY(8px); }

    #cb-header {
      background: #2563eb; color: #fff; padding: 14px 16px;
      font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 10px;
    }
    #cb-header .cb-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }

    #cb-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .cb-msg { max-width: 80%; padding: 10px 14px; border-radius: 14px; line-height: 1.4; }
    .cb-msg.bot  { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; align-self: flex-start; }
    .cb-msg.user { background: #2563eb; color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
    .cb-typing   { display: flex; gap: 4px; align-items: center; padding: 10px 14px; }
    .cb-typing span { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: cb-bounce .9s infinite; }
    .cb-typing span:nth-child(2) { animation-delay: .15s; }
    .cb-typing span:nth-child(3) { animation-delay: .30s; }
    @keyframes cb-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

    #cb-input-row {
      padding: 10px 12px; border-top: 1px solid #e2e8f0;
      display: flex; gap: 8px;
    }
    #cb-input {
      flex: 1; border: 1px solid #e2e8f0; border-radius: 10px;
      padding: 9px 12px; outline: none; resize: none;
      font-family: inherit; font-size: 14px; line-height: 1.4;
    }
    #cb-input:focus { border-color: #2563eb; }
    #cb-send {
      background: #2563eb; border: none; border-radius: 10px;
      color: #fff; padding: 0 16px; cursor: pointer; font-size: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    #cb-send:hover { background: #1d4ed8; }
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
        <div class="cb-avatar">🤖</div>
        <span>AI Assistant</span>
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
    addMessage('bot', 'Hi there! 👋 How can I help you today?');

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

      fetch(API_BASE + '/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId }),
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.sessionId) localStorage.setItem(STORAGE_KEY, data.sessionId);
        typingEl.remove();
        addMessage('bot', data.reply || data.error || 'Something went wrong.');
      })
      .catch(function () {
        typingEl.remove();
        addMessage('bot', 'Connection error. Please try again.');
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
