'use client';

import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { formatPYG } from '../../../lib/utils';
import { buildWhatsAppURL } from '../../../lib/whatsapp';
import styles from './StepPayment.module.css';

export default function StepPayment({ formData, onBack }) {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    const url = buildWhatsAppURL(items, formData, total);

    // Small delay for UX
    setTimeout(() => {
      clearCart();
      window.open(url, '_blank', 'noopener,noreferrer');
      // Reset after opening
      setConfirming(false);
    }, 600);
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Método de Pago</h2>

      <div className={styles.layout}>
        {/* Left: Payment info */}
        <div className={styles.mainCol}>
          {/* WhatsApp payment notice */}
          <div className={styles.paymentNotice}>
            <div className={styles.noticeIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </div>
            <div className={styles.noticeContent}>
              <h3 className={styles.noticeTitle}>Pago a coordinar por WhatsApp</h3>
              <p className={styles.noticeText}>
                Tu pedido será registrado de forma segura. Nos contactaremos para coordinar la transferencia
                <strong> SIPAP</strong> o pago en <strong>efectivo</strong> a convenir.
              </p>
              <div className={styles.noticeMethods}>
                <span className={styles.method}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Transferencia SIPAP
                </span>
                <span className={styles.method}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Pago en efectivo
                </span>
                <span className={styles.method}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  QR bancario
                </span>
              </div>
            </div>
          </div>

          {/* Order items summary */}
          <div className={styles.orderItems}>
            <h4 className={styles.subTitle}>Tu Pedido</h4>
            {items.map(item => (
              <div key={item.id} className={styles.orderItem}>
                <span className={styles.orderItemQty}>{item.quantity}×</span>
                <span className={styles.orderItemName}>{item.name}</span>
                <span className={styles.orderItemPrice}>{formatPYG(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Shipping address summary */}
          {formData && (
            <div className={styles.shippingCard}>
              <h4 className={styles.subTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Enviar a
              </h4>
              <div className={styles.shippingDetails}>
                <p><strong>{formData.fullName}</strong></p>
                <p>{formData.address}, {formData.city}</p>
                {formData.phone && <p>WhatsApp: {formData.phone}</p>}
                {formData.notes && (
                  <p className={styles.notes}><em>Nota: {formData.notes}</em></p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Final total + confirm */}
        <aside className={styles.sidePanel}>
          <h3 className={styles.sidePanelTitle}>Resumen Final</h3>

          <div className={styles.totalRows}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatPYG(subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : formatPYG(shipping)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total a pagar</span>
              <span>{formatPYG(total)}</span>
            </div>
          </div>

          <button
            id="checkout-confirm-order"
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <>
                <div className={styles.spinner} />
                Abriendo WhatsApp...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Confirmar Pedido
              </>
            )}
          </button>

          <p className={styles.disclaimer}>
            Al confirmar, abriremos WhatsApp con tu pedido listo para enviar. El pago se coordina directamente con nosotros.
          </p>

          <button type="button" className={styles.backBtn} onClick={onBack}>
            ← Volver a datos de envío
          </button>
        </aside>
      </div>
    </div>
  );
}
