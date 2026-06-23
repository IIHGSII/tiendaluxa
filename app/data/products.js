import supabase from '../../db.js';

// Video feed items remain static as they are UI-specific
export const videoFeedItems = [
  {
    id: 'v1',
    productId: 4,  // Sauvage Dior
    thumbnail: 'https://images.unsplash.com/photo-1547887538-047e855c1c01?w=400&q=90',
    caption: 'El nuevo ritual matutino de élite ✨',
    likes: '24.8K',
    productSlug: 'sauvage-dior-edp',
  },
  {
    id: 'v2',
    productId: 5,  // Chanel N5
    thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=90',
    caption: 'Clásico intemporal. N°5 forever 🌹',
    likes: '41.2K',
    productSlug: 'chanel-n5-edp',
  },
  {
    id: 'v3',
    productId: 11, // La Mer
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=90',
    caption: 'Skincare de lujo real 🌊',
    likes: '18.6K',
    productSlug: 'la-mer-creme',
  },
  {
    id: 'v4',
    productId: 9,  // Jo Malone
    thumbnail: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=90',
    caption: 'Layering de fragancias luxury 🍃',
    likes: '32.1K',
    productSlug: 'jo-malone-lime-basil',
  },
];

// Async data fetching from Supabase

export async function getBestSellers() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('isBestseller', true)
    .limit(8);
  
  if (error) {
    console.error("Error fetching bestsellers:", error);
    return [];
  }
  return data || [];
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
  return data || null;
}

export async function getProductsByCategory(category) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
    
  if (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    return [];
  }
  return data || [];
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(limit);
    
  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
  return data || [];
}

// Fetch multiple products by their IDs (useful for VideoFeed)
export async function getFeedProducts(feedItems) {
  const ids = feedItems.map(item => item.productId);
  if (ids.length === 0) return [];
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids);
    
  if (error) {
    console.error("Error fetching feed products:", error);
    return [];
  }
  return data || [];
}
