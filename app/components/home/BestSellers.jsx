import { bestSellers } from '../../data/products';
import ProductCard from '../product/ProductCard';
import styles from './BestSellers.module.css';

export default function BestSellers() {
  return (
    <section className={styles.section} aria-labelledby="bs-title">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className="section-label">Más Vendidos</span>
            <div className="gold-divider" />
            <h2 id="bs-title" className={styles.title}>Los Favoritos de Luxa</h2>
            <p className={styles.subtitle}>
              Los perfumes y cosméticos que más eligen nuestros clientes.
            </p>
          </div>
          <a href="/categoria/all" className="btn-outline" style={{ flexShrink: 0 }}>
            Ver todo el catálogo
          </a>
        </div>

        <div className={styles.grid}>
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
