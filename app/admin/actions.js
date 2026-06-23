'use server'

import { revalidatePath } from 'next/cache';
import supabase from '../../db.js';

// Genera un slug único a partir del nombre
function generateSlug(name, suffix = '') {
  const base = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return suffix ? `${base}-${suffix}` : base;
}

export async function bulkUpsertProducts(products) {
  // products: Array de { codigo_item_proveedor, name, price }
  if (!products || products.length === 0) {
    return { updated: 0, created: 0, errors: [] };
  }

  const codigos = products.map(p => p.codigo_item_proveedor).filter(Boolean);

  // 1. Buscar qué códigos ya existen en la BD (solo los que tienen código)
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, slug, codigo_item_proveedor')
    .in('codigo_item_proveedor', codigos);

  if (fetchError) {
    console.error('Error fetching existing products:', fetchError);
    return { updated: 0, created: 0, errors: [fetchError.message] };
  }

  const existingMap = new Map(
    (existingProducts || []).map(p => [p.codigo_item_proveedor, p])
  );

  const toUpdate = [];
  const toCreate = [];

  for (const p of products) {
    if (!p.codigo_item_proveedor) continue;
    if (existingMap.has(p.codigo_item_proveedor)) {
      // Solo actualizar name y price, preservar el resto
      toUpdate.push({
        codigo_item_proveedor: p.codigo_item_proveedor,
        name: p.name,
        price: p.price,
      });
    } else {
      toCreate.push(p);
    }
  }

  let updated = 0;
  let created = 0;
  const errors = [];

  // 2. Actualizar existentes (UPDATE por codigo_item_proveedor)
  const BATCH_SIZE = 100;
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const batch = toUpdate.slice(i, i + BATCH_SIZE);
    for (const item of batch) {
      const { error } = await supabase
        .from('products')
        .update({ name: item.name, price: item.price })
        .eq('codigo_item_proveedor', item.codigo_item_proveedor);
      if (error) {
        errors.push(`Update ${item.codigo_item_proveedor}: ${error.message}`);
      } else {
        updated++;
      }
    }
  }

  // 3. Insertar nuevos (se generan slugs únicos)
  // Obtener slugs existentes para evitar colisiones
  const { data: existingSlugs } = await supabase
    .from('products')
    .select('slug');
  const slugSet = new Set((existingSlugs || []).map(p => p.slug));

  const newProducts = toCreate.map(p => {
    let slug = generateSlug(p.name || p.codigo_item_proveedor);
    if (!slug) slug = `producto-${p.codigo_item_proveedor}`;
    // Asegurar unicidad
    let uniqueSlug = slug;
    let counter = 1;
    while (slugSet.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter++}`;
    }
    slugSet.add(uniqueSlug);
    return {
      slug: uniqueSlug,
      name: p.name || '',
      price: p.price || 0,
      codigo_item_proveedor: p.codigo_item_proveedor,
      brand: '',
      category: '',
      inStock: true,
    };
  });

  for (let i = 0; i < newProducts.length; i += BATCH_SIZE) {
    const batch = newProducts.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      errors.push(`Insert batch ${i / BATCH_SIZE + 1}: ${error.message}`);
    } else {
      created += batch.length;
    }
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { updated, created, errors };
}



export async function createProduct(formData) {
  const newProduct = {
    slug: formData.get('name').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    image: formData.get('image'),
    brand: formData.get('brand') || 'Tienda Luxa',
    subcategory: formData.get('category'),
    ml: '100ml',
    inStock: true,
  };

  const { error } = await supabase.from('products').insert([newProduct]);
  
  if (error) {
    console.error("Error creating product:", error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function updateProduct(id, formData) {
  const updatedProduct = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    image: formData.get('image'),
  };

  const { error } = await supabase
    .from('products')
    .update(updatedProduct)
    .eq('id', id);

  if (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}
