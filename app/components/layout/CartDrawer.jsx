'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { formatPYG } from '../../lib/utils';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQty,
    subtotal, shipping, total,
    totalItems,
  } = useCart();

  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        ref={drawerRef}
        id="cart-drawer"
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-label="Carrito de compras"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div>
            <h2 className={styles.drawerTitle}>Mi Carrito</h2>
            {totalItems > 0 && (
              <span className={styles.itemCount}>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Free shipping banner */}
        {subtotal > 0 && subtotal < 500000 && (
          <div className={styles.shippingBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span>Agregá <strong>{formatPYG(500000 - subtotal)}</strong> más para envío gratis</span>
          </div>
        )}
        {subtotal >= 500000 && (
          <div className={`${styles.shippingBanner} ${styles.shippingFree}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>¡Envío gratis desbloqueado! 🎉</span>
          </div>
        )}

        {/* Cart Items */}
        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p>Tu carrito está vacío</p>
              <button className="btn-primary" onClick={closeCart} style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                Explorar productos
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                {/* Product Image */}
                <Link href={`/producto/${item.slug}`} onClick={closeCart} className={styles.itemImg}>
                  <Image
                    src={item.image || item.imageFallback || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=90'}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    unoptimized
                  />
                </Link>

                {/* Item Info */}
                <div className={styles.itemInfo}>
                  <span className={styles.itemBrand}>{item.brand || 'Luxa'}</span>
                  <Link href={`/producto/${item.slug}`} onClick={closeCart} className={styles.itemName}>
                    {item.name}
                  </Link>
                  <span className={styles.itemMl}>{[item.ml, item.subcategory].filter(Boolean).join(' · ') || 'Fragancia'}</span>

                  <div className={styles.itemFooter}>
                    {/* Qty controls */}
                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        aria-label="Reducir cantidad"
                      >−</button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>
                    <span className={styles.itemPrice}>{formatPYG(item.price * item.quantity)}</span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>{formatPYG(subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : formatPYG(shipping)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>{formatPYG(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={closeCart}>
              Finalizar Compra
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>

            <button className={styles.continueBtn} onClick={closeCart}>
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
