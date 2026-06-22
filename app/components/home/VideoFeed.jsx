'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { videoFeedItems, products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { formatPYG } from '../../lib/utils';
import styles from './VideoFeed.module.css';

export default function VideoFeed() {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(null);

  const handleAdd = (productId, e) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setAdding(productId);
    addItem(product);
    setTimeout(() => setAdding(null), 800);
  };

  return (
    <section className={styles.section} aria-labelledby="vf-title">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Tendencias</span>
          <div className="gold-divider" />
          <h2 id="vf-title" className={styles.title}>Lo Que Está de Moda</h2>
          <p className={styles.subtitle}>
            Inspirate con los looks más trendy · Comprá directamente desde acá
          </p>
        </div>

        <div className={styles.feed}>
          {videoFeedItems.map((item, i) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;

            return (
              <div
                key={item.id}
                className={styles.reel}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* Thumbnail */}
                <Link href={`/producto/${item.productSlug}`} className={styles.reelImg}>
                  <Image
                    src={item.thumbnail}
                    alt={item.caption}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />

                  {/* Play icon overlay */}
                  <div className={styles.playOverlay}>
                    <div className={styles.playBtn}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </div>

                  {/* Gradient bottom */}
                  <div className={styles.reelGradient} />

                  {/* Stats */}
                  <div className={styles.reelStats}>
                    <span className={styles.likes}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {item.likes}
                    </span>
                  </div>
                </Link>

                {/* Caption */}
                <p className={styles.caption}>{item.caption}</p>

                {/* Product chip */}
                <div className={styles.productChip}>
                  <div className={styles.chipInfo}>
                    <span className={styles.chipBrand}>{product.brand}</span>
                    <span className={styles.chipName}>{product.name}</span>
                    <span className={styles.chipPrice}>{formatPYG(product.price)}</span>
                  </div>

                  <button
                    className={`${styles.chipAdd} ${adding === product.id ? styles.chipAdded : ''}`}
                    onClick={(e) => handleAdd(product.id, e)}
                    id={`video-add-${product.id}`}
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    {adding === product.id ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
