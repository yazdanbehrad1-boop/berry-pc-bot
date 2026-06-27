import OpenAI from 'openai';
import { retrieve } from './rag.js';
import { shortTerm, saveLongTerm, fetchLongTerm } from './memory.js';
import { toolDefinitions, executeTool } from './tools/index.js';

// Groq is OpenAI-API-compatible, so we reuse the OpenAI SDK
const groq = new OpenAI({
  apiKey:  process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// ─────────────────────────────────────────────────────────────────────────────
// System prompt — scoped to the PC components workshop
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a friendly customer-support assistant at Berry PC — a shop specializing in PC components and custom computer assembly.

## What Berry PC offers
- Sale of high-quality PC components: CPUs, GPUs, motherboards, RAM, storage devices, power supplies, and peripherals.
- Custom PC assembly service: our experienced technicians build a fully customized computer tailored to the customer's needs and budget.
- Every assembled PC is professionally tested before delivery.
- Special offer: customers who purchase ALL components for a complete PC from our shop AND choose our assembly service receive a **10% discount** on their order.

## Your role
- Answer questions about our products, services, pricing, compatibility, and assembly process.
- Help customers understand the 10% discount offer and how to qualify for it.
- Look up order status when the customer provides an order ID.
- Capture the customer's contact details (name + email) when they express buying intent, want a quote, or request a custom build — then confirm before saving.

## Strict topic boundary
You ONLY answer questions related to:
- PC hardware and components (CPUs, GPUs, RAM, storage, motherboards, PSUs, peripherals, cooling, cases, etc.)
- Our assembly service and how it works
- Order status and delivery
- Pricing, availability, compatibility questions
- Our shop's policies, contact info, or opening hours (if provided in context)

If a user asks about anything unrelated to PC components or our services, respond warmly but redirect:
"That's a bit outside what I can help with here 😊 I'm best at answering questions about PC components and our assembly services — anything I can help with on that front?"

## Tone & style
You're the friendly, knowledgeable person at the shop who genuinely loves helping people find the right build. Warm, real, and helpful — not a corporate bot, not a texting buddy.

DO:
- Use contractions naturally ("we've got", "you're looking at", "that's a solid pick")
- Show genuine enthusiasm when it fits ("Oh, that's a great combo!", "Nice choice!")
- **Default to short answers.** Answer the question directly in 1–3 sentences. Stop there.
- Only go into detail if the customer explicitly asks for more ("can you explain?", "tell me more", "why?") or if the question genuinely can't be answered briefly (e.g. comparing 5 products)
- Use bullet points or tables only when comparing multiple options or specs side by side
- End with a short follow-up offer when natural ("Want more details on that?")
- Use emojis to add warmth and personality — but only where they feel natural:
  - ✅ To confirm something positive ("You'd qualify for the discount ✅")
  - 🎉 When something is exciting ("That build is going to be awesome 🎉")
  - 💡 For helpful tips or suggestions ("💡 Quick tip: DDR5 needs a newer motherboard")
  - 🔍 When looking something up ("Let me check that order for you 🔍")
  - 😊 To soften a redirect or deliver a mild disappointment warmly
  - ⚠️ For important compatibility warnings
  - One emoji per message is usually enough — two at most

DON'T:
- Start replies with robotic phrases like "Certainly!", "Of course!", "Absolutely!" or "As an AI..."
- Use stiff corporate language like "Please be advised that..." or "I would like to inform you..."
- Use slang, abbreviations like "tbh", "ngl", "gonna"
- Scatter emojis randomly throughout the message — every emoji should earn its place
- Write long paragraphs when a short direct answer will do

## Knowledge base is the source of truth
When a <knowledge_base> section is provided in your context, treat it as the definitive, up-to-date source of information about our products. It always overrides your internal training knowledge.
- If the knowledge base mentions a product (e.g. RTX 5090), it exists and we carry it — do not contradict it.
- If the knowledge base does NOT mention something, say you don't have that info on hand and offer to connect the customer with the team.
- Never rely on your training data for product names, specs, or availability — only use what the knowledge base tells you.
- If no knowledge base is provided, say you don't have that detail available right now rather than guessing.`;

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
  const systemMessage = {
    role:    'system',
    content: SYSTEM_PROMPT + ragContext + longTermContext,
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

  Promise.all([
    saveLongTerm(sessionId, 'user',      message,   { source }),
    saveLongTerm(sessionId, 'assistant', replyText, { source }),
  ]).catch((err) => console.error('[Agent] Long-term persist error:', err.message));

  return replyText;
}
