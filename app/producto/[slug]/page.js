import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '../../data/products';
import ProductDetail from '../../components/product/ProductDetail';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Producto no encontrado — Tienda Luxa' };

  return {
    title: `${product.name} — ${product.brand} | Tienda Luxa Paraguay`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <section style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-16)' }}>
      <ProductDetail product={product} relatedProducts={related} />
    </section>
  );
}
