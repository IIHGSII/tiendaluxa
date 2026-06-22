// ============================================================
// TIENDA LUXA — Utility Functions
// ============================================================

/**
 * Format a number as Paraguayan Guaraníes
 * e.g. 985000 → "₲ 985.000"
 */
export function formatPYG(amount) {
  if (amount == null) return '';
  return '₲ ' + amount.toLocaleString('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 35000; // free shipping over ₲500.000
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

/**
 * Truncate text to a max length
 */
export function truncate(text, maxLength = 80) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate star rating display
 */
export function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
}
