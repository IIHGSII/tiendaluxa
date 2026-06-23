import supabase from '../../db.js';

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
