'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryGrid.module.css';

const categories = [
  {
    id: 'masculino',
    label: 'Masculino',
    description: 'Fragancias audaces y sofisticadas',
    href: '/categoria/masculino',
    image: '/cat-masculino.png',
    fallback: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=90',
    accent: '#1A2535',
  },
  {
    id: 'femenino',
    label: 'Femenino',
    description: 'Bouquets florales y orientales',
    href: '/categoria/femenino',
    image: '/cat-femenino.png',
    fallback: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=90',
    accent: '#3D1F2B',
  },
  {
    id: 'unisex',
    label: 'Unisex',
    description: 'Sin fronteras, puro carácter',
    href: '/categoria/unisex',
    image: '/cat-unisex.png',
    fallback: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=90',
    accent: '#2A2820',
  },
  {
    id: 'cuidado',
    label: 'Cuidado Personal',
    description: 'El lujo de cuidar tu piel',
    href: '/categoria/cuidado',
    image: '/cat-cuidado.png',
    fallback: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=90',
    accent: '#1A2F2A',
  },
];

export default function CategoryGrid() {
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="coleccion" className={styles.section} aria-labelledby="cat-title">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Explorar</span>
          <div className="gold-divider" />
          <h2 id="cat-title" className={styles.title}>Nuestras Categorías</h2>
        </div>

        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={styles.card}
              id={`cat-${cat.id}`}
              style={{ '--accent': cat.accent, animationDelay: `${i * 0.1}s` }}
            >
              {/* Image */}
              <div className={styles.imgWrapper}>
                <Image
                  src={failedImages[cat.id] ? cat.fallback : cat.image}
                  alt={`Perfumes ${cat.label} — Tienda Luxa`}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={() => handleImageError(cat.id)}
                  unoptimized
                />
              </div>

              {/* Gradient overlay */}
              <div className={styles.overlay} />

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{cat.label}</h3>
                <p className={styles.cardDesc}>{cat.description}</p>
                <span className={styles.cardCta}>
                  Ver productos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
