'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { formatPYG } from '../../lib/utils';
import ProductCard from './ProductCard';
import styles from './ProductDetail.module.css';

export default function ProductDetail({ product, relatedProducts }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty]         = useState(1);
  const [imgErr, setImgErr]   = useState(false);
  const [adding, setAdding]   = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const discount = product.priceOld
    ? Math.round((1 - product.price / product.priceOld) * 100)
    : null;

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);
    addItem({ ...product, quantity: qty });

    // Show toast
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
    setTimeout(() => setAdding(false), 800);
  };

  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=90';
  const imgSrc = imgErr 
    ? (product.imageFallback || DEFAULT_IMAGE) 
    : (product.image || product.imageFallback || DEFAULT_IMAGE);

  const displayBrand = product.brand || 'Luxa';
  const specText = [product.ml, product.subcategory].filter(Boolean).join(' · ') || 'Fragancia';
  const categoryLink = product.category || 'all';
  const categoryLabel = product.category || 'Productos';

  const rating = Number(product.rating);
  const showRating = !isNaN(rating) && rating > 0;

  return (
    <>
      {/* Toast notification */}
      {toastVisible && (
        <div className="toast" role="alert" aria-live="polite">
          <span className="toast-icon">✓</span>
          <span><strong>{product.name}</strong> agregado al carrito</span>
        </div>
      )}

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Inicio</Link>
          <span>›</span>
          <Link href={`/categoria/${categoryLink}`} style={{ textTransform: 'capitalize' }}>{categoryLabel}</Link>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        {/* Main PDP layout */}
        <div className={styles.pdpGrid}>
          {/* ── LEFT: Images ── */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <Image
                src={imgSrc}
                alt={`${product.name} — ${displayBrand}`}
                fill
                priority
                style={{ objectFit: 'contain' }}
                onError={() => setImgErr(true)}
                unoptimized
              />

              {/* Badges */}
              <div className={styles.badges}>
                {product.isNew && <span className={styles.badgeNew}>Nuevo</span>}
                {discount && <span className={styles.badgeSale}>-{discount}%</span>}
                {product.isBestseller && (
                  <span className={styles.badgeBest}>⭐ Bestseller</span>
                )}
              </div>
            </div>

            {/* Thumbnail strip (same image repeated for demo) */}
            <div className={styles.thumbs}>
              {[1, 2, 3].map(n => (
                <button key={n} className={`${styles.thumb} ${n === 1 ? styles.thumbActive : ''}`}>
                  <Image
                    src={imgSrc}
                    alt={`Vista ${n}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className={styles.details}>
            {/* Brand & rating */}
            <div className={styles.topRow}>
              <span className={styles.brand}>{displayBrand}</span>
              {showRating && (
                <div className={styles.rating}>
                  <span className={styles.stars}>
                    {'★'.repeat(Math.floor(rating))}
                  </span>
                  <span className={styles.ratingText}>
                    {rating} ({product.reviews || 0} reseñas)
                  </span>
                </div>
              )}
            </div>

            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productSub}>{specText}</p>

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatPYG(product.price)}</span>
              {product.priceOld && (
                <>
                  <span className={styles.priceOld}>{formatPYG(product.priceOld)}</span>
                  <span className={styles.discount}>Ahorrás {discount}%</span>
                </>
              )}
            </div>

            {/* Free shipping notice */}
            <div className={styles.shippingNote}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="m16 8 5 3v5h-5V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              {product.price >= 500000
                ? '¡Este producto califica para envío gratis!'
                : `Envío gratis en compras mayores a ₲ 500.000`}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <h3 className={styles.descTitle}>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity + Add to cart */}
            <div className={styles.actions}>
              {/* Quantity */}
              <div className={styles.qtyWrapper}>
                <label className={styles.qtyLabel}>Cantidad</label>
                <div className={styles.qtyControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Reducir cantidad"
                  >−</button>
                  <input
                    type="number"
                    className={styles.qtyInput}
                    value={qty}
                    min={1}
                    max={99}
                    readOnly
                    aria-label="Cantidad"
                  />
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.min(99, q + 1))}
                    aria-label="Aumentar cantidad"
                  >+</button>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                id={`pdp-add-to-cart-${product.id}`}
                className={`btn-primary ${styles.addBtn} ${adding ? styles.addBtnSuccess : ''}`}
                onClick={handleAddToCart}
                disabled={adding}
                aria-label={`Agregar ${qty} ${product.name} al carrito`}
              >
                {adding ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ¡Agregado!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    Agregar al Carrito
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/595981000000?text=Hola%2C%20me%20interesa%20el%20producto%3A%20${encodeURIComponent(product.name)}%20de%20${encodeURIComponent(product.brand)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Consultar por WhatsApp
            </a>

            {/* Product features */}
            <ul className={styles.features}>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                100% Auténtico — Garantizado
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Envío a todo Paraguay
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Pago coordinado por WhatsApp (SIPAP / Efectivo)
              </li>
            </ul>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title" className={styles.relatedTitle}>También te puede gustar</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
