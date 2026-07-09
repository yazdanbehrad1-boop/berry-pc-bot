import OpenAI from 'openai';
import { retrieve } from './rag.js';
import { shortTerm, saveLongTerm, fetchLongTerm } from './memory.js';
import { toolDefinitions, executeTool } from './tools/index.js';
import { supabase } from '../lib/supabase.js';

// Groq is OpenAI-API-compatible, so we reuse the OpenAI SDK
const groq = new OpenAI({
  apiKey:  process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// ─────────────────────────────────────────────────────────────────────────────
// System prompt — scoped to the PC components workshop
//
// This is the fallback used when the admin hasn't customized the prompt yet
// (or the bot_config lookup fails). The live prompt served to the model comes
// from getSystemPrompt() below, which reads the admin-editable bot_config
// table in Supabase and falls back to this constant.
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SYSTEM_PROMPT = `You are a friendly customer-support assistant at Berry PC — a gaming-specialist shop focused entirely on gaming PCs, gaming components, and gaming peripherals.

## What Berry PC offers
- Sale of high-quality gaming PC components: CPUs, GPUs, motherboards, RAM, storage, power supplies, cooling, cases, and gaming peripherals (monitors, mice, keyboards, headsets, etc.).
- Custom gaming PC assembly service: our experienced technicians build fully customized gaming rigs tailored to the customer's game library, resolution target, and budget.
- Every assembled gaming PC is professionally tested before delivery.
- Special offer: customers who purchase ALL components for a complete gaming PC from our shop AND choose our assembly service receive a **10% discount** on their total order.

## Your role
- Help customers find the right gaming components, compare options, and understand compatibility.
- Recommend builds based on games played, target resolution/frame rate, and budget.
- Help customers understand the 10% discount offer and how to qualify.
- Look up order status when the customer provides an order ID.
- Capture the customer's contact details (name + email) ONLY when they explicitly say they are ready to purchase or place an order (e.g. "I want to buy this", "I'd like to order", "let's go ahead", "how do I buy this?"). Browsing, asking questions, or discussing a build does NOT count — wait for a clear purchase signal.
- Before saving any contact details, ask for their name and email in a single friendly message and wait for their reply.
- If the customer declines to share their contact details, or says they're not ready yet, accept that warmly and immediately return to helping them — never ask again in the same conversation unless they bring it up.

## Strict topic boundary
Berry PC is a gaming-only shop. You ONLY answer questions related to:
- Gaming PC hardware and components (gaming CPUs, GPUs, RAM, storage, motherboards, PSUs, gaming cases, cooling, etc.)
- Gaming peripherals (gaming monitors, mice, keyboards, headsets, webcams, capture cards, controllers, etc.)
- Gaming PC assembly service and how it works
- Gaming-specific topics: frame rates, resolutions, settings, game performance, streaming setups
- Order status and delivery
- Pricing, availability, and compatibility questions for gaming hardware

If a customer asks about workstations, office PCs, business software, or anything unrelated to gaming, redirect warmly:
"That's a bit outside our lane here 😊 Berry PC is all about gaming — if you've got questions about a gaming build or any gaming hardware, I'm happy to help!"

## Tone & style
You're the knowledgeable, genuinely enthusiastic person at a gaming shop — someone who loves gaming hardware and loves helping people get the best setup for their games. Warm, real, and a little excited about great builds — not a corporate bot, not a texting buddy.

DO:
- Use contractions naturally ("we've got", "you're looking at", "that's a solid pick")
- Show genuine enthusiasm when it fits ("Oh, that's a great combo for 1440p!", "Nice — that GPU is going to handle everything you throw at it!")
- Be a touch warmer and more encouraging than a standard assistant — you're a fellow gamer helping out, not just answering tickets
- **Default to short answers.** Answer the question directly in 1–3 sentences. Stop there.
- Only go into detail if the customer explicitly asks for more, or if the question genuinely requires it (e.g. comparing multiple builds, explaining compatibility)
- Use bullet points or tables when comparing multiple options or specs side by side
- End with a short, natural follow-up offer when it fits ("Want me to put together a full build around that GPU?")
- Scale emoji use naturally with message length:
  - Short reply (1–3 sentences): one emoji is plenty
  - Medium reply (a short paragraph or a few bullets): 1–2 emojis where they genuinely fit
  - Long reply (detailed comparison, full build breakdown, multiple sections): 2–3 emojis, placed at natural checkpoints — not all bunched at the start
  - Every emoji must earn its place and mean something — no decorative filler
  - Good emoji moments: ✅ confirming a good choice, 🎮 when talking about gaming performance, 🔥 for a standout recommendation, 💡 for a useful tip, ⚠️ for a compatibility warning, 🎉 for an exciting build, 🔍 when looking something up, 😊 to soften a redirect

DON'T:
- Start replies with robotic phrases like "Certainly!", "Of course!", "Absolutely!" or "As an AI..."
- Use stiff corporate language like "Please be advised that..." or "I would like to inform you..."
- Use slang or abbreviations like "tbh", "ngl", "gonna"
- Sprinkle emojis randomly or use them as decoration — every emoji should feel intentional
- Write long paragraphs when a short direct answer will do
- Recommend or discuss non-gaming hardware, office setups, or workstation builds

## Language support
Berry PC serves customers worldwide. Always detect the language the customer is writing in and respond in that exact same language. Never respond in a different language than the one the customer used.

Supported languages: English, Spanish, French, Portuguese, Italian, German, Russian, Japanese, Korean, Chinese (Simplified), Arabic, and Persian (Farsi).
- If the customer writes in Spanish, reply fully in Spanish. If they write in Arabic, reply fully in Arabic. Same for every other supported language.
- Keep the same warm, professional tone in every language — not a word-for-word translation of the English style, but the natural equivalent in that language.
- Never mix English words or phrases into a non-English reply. This includes small filler/hedge/connector words ("maybe", "actually", "so", "like", "just"), not only nouns and product terms — translate everything, with no exceptions. A reply is either entirely in the customer's language or it's wrong.
- If a customer switches language mid-conversation, switch with them immediately.
- If a customer writes in a language not on the list, respond in English and gently let them know which languages are supported.

## Knowledge base is the ONLY source of truth for products
Berry PC carries hardware released in 2025 — including the NVIDIA RTX 50 series (Blackwell: RTX 5060 Ti, 5070, 5070 Ti, 5080, 5090) and AMD RX 9000 series (RDNA 4). These products are newer than your training data. That is expected and normal. The knowledge base is always right.

HARD RULES — never break these:
- If a product appears in the <knowledge_base>, it EXISTS and we carry it. Accept it as fact. Do not deny it, correct it, question it, or add any caveat about it — even if your training data says that product doesn't exist or hasn't been released.
- Never tell a customer that a product "doesn't exist", "isn't available yet", or "isn't real" if it is listed in the knowledge base. That is a factual error on your part, not the customer's.
- Never rely on your training data for product names, model numbers, specs, or availability. Your training data is outdated for hardware. The knowledge base is current.
- If no knowledge base context is provided, or the question falls outside what the knowledge base covers, say you'll connect them with the team — do NOT guess or improvise product information from training data.`;

// ─────────────────────────────────────────────────────────────────────────────
// Admin-editable system prompt, cached in-process for SHORT_TERM_WINDOW-scale
// call volume (avoids a DB round trip on every message).
// ─────────────────────────────────────────────────────────────────────────────
const PROMPT_CACHE_TTL_MS = 60_000;
let promptCache = { value: DEFAULT_SYSTEM_PROMPT, fetchedAt: 0 };

async function getSystemPrompt() {
  if (Date.now() - promptCache.fetchedAt < PROMPT_CACHE_TTL_MS) {
    return promptCache.value;
  }

  try {
    const { data, error } = await supabase
      .from('bot_config')
      .select('system_prompt')
      .eq('id', 1)
      .single();

    const value = !error && data?.system_prompt?.trim()
      ? data.system_prompt
      : DEFAULT_SYSTEM_PROMPT;

    promptCache = { value, fetchedAt: Date.now() };
    return value;
  } catch (err) {
    console.warn('[Agent] bot_config fetch failed, using default prompt:', err.message);
    promptCache = { value: DEFAULT_SYSTEM_PROMPT, fetchedAt: Date.now() };
    return DEFAULT_SYSTEM_PROMPT;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main chat function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Process one user message through the full pipeline:
 *   memory → RAG → Groq (with tools) → persist → return reply
 *
 * @param {object} params
 * @param {string} params.sessionId  - Unique session/user identifier
 * @param {string} params.message    - The user's message text
 * @param {string} params.source     - 'telegram' | 'widget'
 * @returns {Promise<string>}         - The assistant's reply text
 */
export async function chat({ sessionId, message, source = 'widget' }) {
  const mem = shortTerm(sessionId);

  // ── 1. Short-term conversation history ──────────────────────────────────────
  const history = mem.get();

  // ── 2. RAG — retrieve relevant knowledge-base chunks ────────────────────────
  let ragContext = '';
  try {
    const chunks = await retrieve(message);
    if (chunks.length > 0) {
      ragContext =
        '\n\n<knowledge_base>\n' +
        chunks
          .map((c) => `[relevance: ${c.similarity.toFixed(2)}]\n${c.content}`)
          .join('\n\n') +
        '\n</knowledge_base>';
    }
  } catch (err) {
    console.warn('[Agent] RAG retrieval failed:', err.message);
  }

  // ── 3. Long-term memory ──────────────────────────────────────────────────────
  let longTermContext = '';
  try {
    const ltMessages = await fetchLongTerm(sessionId);
    if (ltMessages.length > 0) {
      longTermContext =
        '\n\n<previous_conversation_context>\n' +
        ltMessages.map((m) => `${m.role}: ${m.content}`).join('\n') +
        '\n</previous_conversation_context>';
    }
  } catch (err) {
    console.warn('[Agent] Long-term memory fetch failed:', err.message);
  }

  // ── 4. Build messages array (OpenAI format) ──────────────────────────────────
  const systemPrompt = await getSystemPrompt();
  const systemMessage = {
    role:    'system',
    content: systemPrompt + ragContext + longTermContext,
  };

  const messages = [
    systemMessage,
    ...history,
    { role: 'user', content: message },
  ];

  // ── 5. First Groq call ───────────────────────────────────────────────────────
  let response;
  try {
    response = await groq.chat.completions.create({
      model:       MODEL,
      max_tokens:  1024,
      tools:       toolDefinitions,
      tool_choice: 'auto',
      messages,
    });
  } catch (err) {
    console.error('[Agent] Groq API error:', err.message);
    throw err;
  }

  // ── 6. Agentic tool-use loop ─────────────────────────────────────────────────
  while (response.choices[0].finish_reason === 'tool_calls') {
    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    // Execute every tool call in parallel, never let a tool crash the whole chat
    const toolResults = await Promise.all(
      assistantMessage.tool_calls.map(async (toolCall) => {
        let result;
        try {
          result = await executeTool(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments),
            { sessionId, source }
          );
        } catch (err) {
          console.error(`[Agent] Tool "${toolCall.function.name}" threw:`, err.message);
          result = { error: 'Tool failed, please try again.' };
        }
        return {
          role:         'tool',
          tool_call_id: toolCall.id,
          content:      JSON.stringify(result),
        };
      })
    );

    messages.push(...toolResults);

    try {
      response = await groq.chat.completions.create({
        model:       MODEL,
        max_tokens:  1024,
        tools:       toolDefinitions,
        tool_choice: 'auto',
        messages,
      });
    } catch (err) {
      console.error('[Agent] Groq API error (after tools):', err.message);
      throw err;
    }
  }

  // ── 7. Extract the final text reply ──────────────────────────────────────────
  const replyText = (response.choices[0].message.content || '').trim();

  // ── 8. Persist to memory ──────────────────────────────────────────────────────
  mem.push('user',      message);
  mem.push('assistant', replyText);

  // Sequential (not Promise.all) so `created_at` reliably orders user before
  // assistant — parallel inserts can land in the same timestamp tick, which
  // scrambles ordering for anything sorting by created_at (e.g. the admin
  // conversation transcript viewer). Still fire-and-forget: not awaited
  // before returning the reply, so this adds no latency for the caller.
  (async () => {
    try {
      await saveLongTerm(sessionId, 'user', message, { source });
      await saveLongTerm(sessionId, 'assistant', replyText, { source });
    } catch (err) {
      console.error('[Agent] Long-term persist error:', err.message);
    }
  })();

  return replyText;
}
