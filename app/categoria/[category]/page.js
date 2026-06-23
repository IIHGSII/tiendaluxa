import Link from 'next/link';
import { getProductsByCategory } from '../../data/products';
import ProductCard from '../../components/product/ProductCard';
import styles from './category.module.css';

const CATEGORY_NAMES = {
  masculino: 'Fragancias Masculinas',
  femenino: 'Fragancias Femeninas',
  unisex: 'Fragancias Unisex',
  cuidado: 'Cuidado Personal',
  all: 'Catálogo Completo',
};

export async function generateMetadata({ params }) {
  const categoryName = CATEGORY_NAMES[params.category] || 'Colección';
  return {
    title: `${categoryName} | Tienda Luxa Paraguay`,
    description: `Explorá nuestra exclusiva selección de ${categoryName.toLowerCase()} en Tienda Luxa. Las mejores marcas de lujo con envíos a todo el Paraguay.`,
  };
}

export default async function CategoryPage({ params }) {
  const categoryKey = params.category;
  const products = await getProductsByCategory(categoryKey);
  const categoryName = CATEGORY_NAMES[categoryKey] || 'Colección';

  return (
    <section className={styles.section} aria-label={categoryName}>
      <div className="container">
        {/* Category Header */}
        <div className={styles.hero}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-black)' }}>{categoryName}</span>
          </nav>
          <span className="section-label">Categorías</span>
          <div className="gold-divider" style={{ display: 'block', margin: '0.5rem auto 1rem' }} />
          <h1 className={styles.title}>{categoryName}</h1>
          <p className={styles.subtitle}>
            {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✨</div>
            <h2 className={styles.emptyTitle}>Próximamente más productos</h2>
            <p className={styles.emptyText}>
              Estamos actualizando nuestro catálogo constantemente con las fragancias y marcas más exclusivas.
            </p>
            <Link href="/categoria/all" className="btn-primary">
              Ver todo el catálogo
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
