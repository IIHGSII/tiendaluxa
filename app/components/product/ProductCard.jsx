'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPYG } from '../../lib/utils';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const discount = product.priceOld
    ? Math.round((1 - product.price / product.priceOld) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 700);
  };

  return (
    <article className={styles.card} id={`product-${product.id}`}>
      <Link href={`/producto/${product.slug}`} className={styles.imgWrapper}>
        <Image
          src={imgErr ? product.imageFallback : (product.image || product.imageFallback)}
          alt={`${product.name} — ${product.brand}`}
          fill
          style={{ objectFit: 'cover' }}
          onError={() => setImgErr(true)}
          unoptimized
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && <span className={styles.badgeNew}>Nuevo</span>}
          {discount && <span className={styles.badgeSale}>-{discount}%</span>}
          {product.isBestseller && !product.isNew && (
            <span className={styles.badgeBest}>Bestseller</span>
          )}
        </div>

        {/* Quick add overlay */}
        <div className={styles.quickAdd}>
          <button
            className={`${styles.addBtn} ${adding ? styles.addBtnSuccess : ''}`}
            onClick={handleAdd}
            id={`add-to-cart-${product.id}`}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            {adding ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Agregado
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Agregar al Carrito
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.brand}>{product.brand}</span>
        <Link href={`/producto/${product.slug}`} className={styles.name}>
          {product.name}
        </Link>
        <span className={styles.sub}>{product.ml} · {product.subcategory}</span>

        {/* Rating */}
        {product.rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className={styles.reviewCount}>({product.reviews})</span>
          </div>
        )}

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPYG(product.price)}</span>
          {product.priceOld && (
            <span className={styles.priceOld}>{formatPYG(product.priceOld)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
