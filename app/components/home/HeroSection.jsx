'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className={styles.hero} aria-label="Banner principal">
      {/* Background Image */}
      <div className={styles.imgWrapper}>
        <Image
          src={imgError ? 'https://images.unsplash.com/photo-1547887538-e76d3b23a621?w=1600&q=90' : '/hero-banner.png'}
          alt="Colección de perfumes de lujo Tienda Luxa"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>

      {/* Dark overlay gradient */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.textBlock}>
          <span className={styles.badge}>Nueva Colección · 2026</span>
          <h1 className={styles.title}>
            El Arte de<br />
            <em>lo Extraordinario</em>
          </h1>
          <p className={styles.subtitle}>
            Fragancias icónicas y cosméticos de élite,<br className={styles.br} />
            ahora disponibles en Paraguay.
          </p>
          <div className={styles.ctas}>
            <Link href="#coleccion" className={`btn-gold ${styles.ctaMain}`} id="hero-ver-coleccion">
              Ver Colección
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/novedades" className={styles.ctaSecondary}>
              Novedades →
            </Link>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>+200</strong>
              <span>Marcas Originales</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>100%</strong>
              <span>Autenticidad Garantizada</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>PY</strong>
              <span>Envíos a todo Paraguay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>Deslizá</span>
      </div>
    </section>
  );
}
