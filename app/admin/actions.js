'use server'

import { revalidatePath } from 'next/cache';
import supabase from '../../db.js';

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
