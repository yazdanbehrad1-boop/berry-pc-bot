import { leadCaptureDefinition, captureLead } from './leadCapture.js';
import { orderStatusDefinition, getOrderStatus } from './orderStatus.js';

// All tool definitions passed to Claude in the tools array
export const toolDefinitions = [
  leadCaptureDefinition,
  orderStatusDefinition,
];

/**
 * Dispatch a tool call from Claude to the correct handler.
 * @param {string} name   - Tool name
 * @param {object} input  - Tool input from Claude
 * @param {object} ctx    - Runtime context (sessionId, source)
 * @returns {object}      - Tool result object
 */
export async function executeTool(name, input, ctx = {}) {
  switch (name) {
    case 'capture_lead':
      return captureLead(input, ctx);

    case 'get_order_status':
      return getOrderStatus(input);

    default:
      return { error: `Unknown tool: ${name}` };
  }
}
