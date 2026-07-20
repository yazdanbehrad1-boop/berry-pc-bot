import { Resend } from 'resend';
import { supabase } from '../../lib/supabase.js';
import { escapeHtml } from '../../lib/html.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// OpenAI / Groq tool definition format
export const leadCaptureDefinition = {
  type: 'function',
  function: {
    name: 'capture_lead',
    description:
      "Save a customer's contact details so the sales team can follow up. " +
      'Call this ONLY when the user explicitly says they are ready to purchase or place an order — ' +
      'for example: "I want to buy this", "I\'d like to order", "I\'m ready to purchase", "how do I buy this?", "let\'s go ahead with this build". ' +
      'Do NOT call this just because the user is browsing, asking questions, comparing options, or discussing a potential build. ' +
      'Wait until they explicitly signal purchase intent, then ask for their name and email before calling this.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Full name of the customer',
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        phone: {
          type: 'string',
          description: 'Phone number (optional)',
        },
        message: {
          type: 'string',
          description: 'Brief summary of what they are interested in (e.g. custom gaming PC, GPU upgrade)',
        },
      },
      required: ['name', 'email'],
    },
  },
};

/**
 * Execute the lead-capture tool.
 * @param {object} input  - Validated tool input
 * @param {object} ctx    - Runtime context { sessionId, source }
 */
export async function captureLead(input, ctx = {}) {
  const { name, email, phone, message } = input;

  const { error } = await supabase.from('leads').insert({
    session_id: ctx.sessionId,
    name,
    email,
    phone:   phone   || null,
    message: message || null,
    source:  ctx.source || 'unknown',
  });

  if (error) {
    console.error('[Tool:captureLead] Supabase error:', error.message);
    return {
      success: false,
      message: 'There was a problem saving your details. Please try again.',
    };
  }

  // Fire-and-forget email alert to shop owner. Escape every field — name,
  // email, phone, and message all originate from user chat input and would
  // otherwise be injected as live HTML into the owner's inbox.
  if (resend && process.env.ALERT_EMAIL) {
    resend.emails.send({
      from: 'Berry PC Bot <onboarding@resend.dev>',
      to:   process.env.ALERT_EMAIL,
      subject: `New lead: ${name}`,
      html: [
        `<h2>New purchase lead from Berry PC bot</h2>`,
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        phone   ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`   : '',
        message ? `<p><strong>Interest:</strong> ${escapeHtml(message)}</p>` : '',
        `<hr><p style="color:#888;font-size:12px">Sent automatically by the Berry PC chatbot</p>`,
      ].join(''),
    }).catch(err => console.error('[Email] Lead alert failed:', err.message));
  }

  return {
    success: true,
    saved: { name, email, phone: phone || null, message: message || null },
  };
}
