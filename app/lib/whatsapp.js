// ============================================================
// TIENDA LUXA — WhatsApp URL Builder
// ============================================================

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '595981000000';

/**
 * Build a WhatsApp redirect URL with order details
 * @param {Array} cartItems - [{name, quantity, price, ...}]
 * @param {Object} formData - {fullName, city, address, ...}
 * @param {number} total - Total order amount
 */
export function buildWhatsAppURL(cartItems, formData, total) {
  const { fullName, city, address, phone } = formData;

  // Format product lines
  const productLines = cartItems
    .map(item => `• ${item.quantity}x ${item.name} (${item.brand}) — ₲ ${(item.price * item.quantity).toLocaleString('es-PY')}`)
    .join('\n');

  const totalFormatted = `₲ ${total.toLocaleString('es-PY')}`;

  const message = [
    '🛍️ *Hola, quiero confirmar mi pedido en Tienda Luxa:*',
    '',
    '*📦 Productos:*',
    productLines,
    '',
    `*💰 Total del pedido: ${totalFormatted}*`,
    '',
    '*📍 Datos de envío:*',
    `• Nombre: ${fullName}`,
    `• Ciudad: ${city}`,
    `• Dirección: ${address}`,
    phone ? `• WhatsApp: ${phone}` : '',
    '',
    '⏳ _Aguardo confirmación para coordinar el pago (SIPAP o efectivo)._',
  ]
    .filter(line => line !== null && line !== undefined)
    .join('\n');

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
