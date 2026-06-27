import { supabase } from '../../lib/supabase.js';

// OpenAI / Groq tool definition format
export const orderStatusDefinition = {
  type: 'function',
  function: {
    name: 'get_order_status',
    description:
      'Look up the current status of a customer order by order ID. ' +
      'Use this when a user asks about their order, delivery, or tracking information.',
    parameters: {
      type: 'object',
      properties: {
        order_id: {
          type: 'string',
          description: 'The order ID provided by the customer (e.g. ORD-1001)',
        },
      },
      required: ['order_id'],
    },
  },
};

const STATUS_LABELS = {
  processing: '🔄 Processing — your order is being prepared.',
  shipped:    '📦 Shipped — your order is on its way!',
  delivered:  '✅ Delivered — your order has arrived.',
  cancelled:  '❌ Cancelled — this order has been cancelled.',
};

/**
 * Execute the order-status tool.
 */
export async function getOrderStatus(input) {
  const orderId = input.order_id.trim().toUpperCase();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return {
      found: false,
      message: `No order found with ID **${orderId}**. Please double-check the order number and try again.`,
    };
  }

  const statusLabel   = STATUS_LABELS[order.status] || order.status;
  const trackingInfo  = order.tracking_number
    ? `\nTracking number: **${order.tracking_number}**`
    : '';
  const eta = order.estimated_delivery
    ? `\nEstimated delivery: **${order.estimated_delivery}**`
    : '';

  return {
    found:              true,
    order_id:           order.id,
    customer_name:      order.customer_name,
    status:             order.status,
    tracking_number:    order.tracking_number,
    estimated_delivery: order.estimated_delivery,
    total:              order.total,
    message:
      `Order **${order.id}** for ${order.customer_name}:\n` +
      `${statusLabel}${trackingInfo}${eta}\n` +
      `Order total: $${order.total}`,
  };
}
