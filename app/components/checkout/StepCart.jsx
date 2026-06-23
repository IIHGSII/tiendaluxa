'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { formatPYG } from '../../lib/utils';
import styles from './StepCart.module.css';

export default function StepCart({ onNext }) {
  const { items, removeItem, updateQty, subtotal, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <h3>Tu carrito está vacío</h3>
        <p>Agregá productos antes de continuar con la compra.</p>
        <Link href="/" className="btn-primary">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Revisión del Carrito</h2>

      <div className={styles.layout}>
        {/* Items table */}
        <div className={styles.itemsSection}>
          <div className={styles.tableHeader}>
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Total</span>
          </div>

          {items.map(item => (
            <div key={item.id} className={styles.itemRow}>
              {/* Image + Info */}
              <div className={styles.itemLeft}>
                <div className={styles.itemImg}>
                  <Image
                    src={item.image || item.imageFallback || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=90'}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemBrand}>{item.brand || 'Luxa'}</span>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemMeta}>{[item.ml, item.subcategory].filter(Boolean).join(' · ') || 'Fragancia'}</span>
                  <span className={styles.itemUnitPrice}>{formatPYG(item.price)} c/u</span>
                </div>
              </div>

              {/* Qty controls */}
              <div className={styles.qtyCell}>
                <div className={styles.qtyControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    aria-label="Reducir"
                  >−</button>
                  <span className={styles.qty}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    aria-label="Aumentar"
                  >+</button>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  Eliminar
                </button>
              </div>

              {/* Line total */}
              <div className={styles.lineTotal}>
                {formatPYG(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary panel */}
        <aside className={styles.summaryPanel}>
          <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPYG(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={shipping === 0 ? styles.free : ''}>
                {shipping === 0 ? 'Gratis 🎉' : formatPYG(shipping)}
              </span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{formatPYG(total)}</span>
            </div>
          </div>

          {shipping > 0 && (
            <p className={styles.freeShipHint}>
              Agregá {formatPYG(500000 - subtotal)} más para envío gratis.
            </p>
          )}

          <button
            id="checkout-step1-next"
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-4)' }}
            onClick={onNext}
          >
            Continuar con el Envío
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          <Link href="/" className={styles.backLink}>← Seguir comprando</Link>
        </aside>
      </div>
    </div>
  );
}
