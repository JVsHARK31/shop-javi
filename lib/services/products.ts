import { supabase } from '../supabase/client';
import { Product, ProductVariation, ProductFilters } from '../types';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      variations:product_variations(*)
    `);

  if (filters?.published !== undefined) {
    query = query.eq('published', filters.published);
  } else {
    query = query.eq('published', true);
  }

  if (filters?.kategori && filters.kategori.length > 0) {
    query = query.overlaps('kategori', filters.kategori);
  }

  if (filters?.tag && filters.tag.length > 0) {
    query = query.overlaps('tag', filters.tag);
  }

  if (filters?.search) {
    query = query.ilike('judul', `%${filters.search}%`);
  }

  if (filters?.sortBy === 'harga_terendah') {
    query = query.order('base_price', { ascending: true });
  } else if (filters?.sortBy === 'harga_tertinggi') {
    query = query.order('base_price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variations:product_variations(*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;

  if (data && data.variations) {
    data.variations = (data.variations as ProductVariation[]).sort((a, b) => a.sort_order - b.sort_order);
  }

  return data as Product | null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variations:product_variations(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  if (data && data.variations) {
    data.variations = (data.variations as ProductVariation[]).sort((a, b) => a.sort_order - b.sort_order);
  }

  return data as Product | null;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const { variations, ...productData } = product;

  const { data: newProduct, error: productError } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (productError) throw productError;

  if (variations && variations.length > 0) {
    const variationsToInsert = variations.map((v, index) => ({
      product_id: newProduct.id,
      nama_variasi: v.nama_variasi,
      price: v.price,
      sku: v.sku,
      stok: v.stok,
      is_default: v.is_default,
      sort_order: v.sort_order ?? index,
    }));

    const { error: variationsError } = await supabase
      .from('product_variations')
      .insert(variationsToInsert);

    if (variationsError) throw variationsError;
  }

  return await getProductById(newProduct.id) as Product;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const { variations, ...productData } = product;

  const { error: productError } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  if (productError) throw productError;

  if (variations) {
    const { error: deleteError } = await supabase
      .from('product_variations')
      .delete()
      .eq('product_id', id);

    if (deleteError) throw deleteError;

    if (variations.length > 0) {
      const variationsToInsert = variations.map((v, index) => ({
        product_id: id,
        nama_variasi: v.nama_variasi,
        price: v.price,
        sku: v.sku,
        stok: v.stok,
        is_default: v.is_default,
        sort_order: v.sort_order ?? index,
      }));

      const { error: variationsError } = await supabase
        .from('product_variations')
        .insert(variationsToInsert);

      if (variationsError) throw variationsError;
    }
  }

  return await getProductById(id) as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleProductPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ published })
    .eq('id', id);

  if (error) throw error;
}

export async function getAllKategori(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('kategori');

  if (error) throw error;

  const allKategori = new Set<string>();
  data?.forEach(product => {
    product.kategori?.forEach((kat: string) => allKategori.add(kat));
  });

  return Array.from(allKategori).sort();
}

export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('tag');

  if (error) throw error;

  const allTags = new Set<string>();
  data?.forEach(product => {
    product.tag?.forEach((t: string) => allTags.add(t));
  });

  return Array.from(allTags).sort();
}
