import { supabase } from '../../lib/supabase.js';

// OpenAI / Groq tool definition format
export const leadCaptureDefinition = {
  type: 'function',
  function: {
    name: 'capture_lead',
    description:
      "Save a potential customer's contact details so the sales team can follow up. " +
      'Call this when a user expresses buying intent, asks for a quote, requests a custom build, ' +
      'or provides their contact information.',
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

  return {
    success: true,
    message: `Thank you, ${name}! Your details have been saved and our team will reach out to ${email} shortly.`,
  };
}
