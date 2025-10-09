import { supabase } from '../supabase/client';
import { Product, ProductVariation, ProductFilters } from '../types';
import { adaptProductToLegacy } from '../helpers/product-adapter';

/**
 * Get products with filters - mendukung schema lama dan baru
 */
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

  // Support both old (kategori array) and new (categories relation) schema
  if (filters?.kategori && filters.kategori.length > 0) {
    // Check if using old schema with kategori array
    query = query.overlaps('kategori', filters.kategori);
  }

  if (filters?.tag && filters.tag.length > 0) {
    query = query.overlaps('tag', filters.tag);
  }

  // Support both judul (old) and title (new)
  if (filters?.search) {
    query = query.or(`judul.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
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
  
  // Adapt products untuk backward compatibility
  return (data || []).map(adaptProductToLegacy);
}

/**
 * Get product by slug - mendukung schema lama dan baru
 */
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
  if (!data) return null;

  // Adapt product untuk backward compatibility
  return adaptProductToLegacy(data);
}

/**
 * Get product by ID - mendukung schema lama dan baru
 */
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
  if (!data) return null;

  // Adapt product untuk backward compatibility
  return adaptProductToLegacy(data);
}

/**
 * Create product - support old and new field names
 */
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
      nama_variasi: v.name || 'Default Variation',
      name: v.name || 'Default Variation',
      price: v.price ?? null,
      price_override: v.price_override ?? null,
      sku: v.sku || null,
      stok: v.stock ?? 0,
      stock: v.stock ?? 0,
      is_default: v.is_default ?? (index === 0),
      sort_order: v.sort_order ?? index,
    }));

    const { error: variationsError } = await supabase
      .from('product_variations')
      .insert(variationsToInsert);

    if (variationsError) throw variationsError;
  }

  return await getProductById(newProduct.id) as Product;
}

/**
 * Update product - support old and new field names
 */
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
        nama_variasi: v.name || 'Default Variation',
        name: v.name || 'Default Variation',
        price: v.price ?? null,
        price_override: v.price_override ?? null,
        sku: v.sku || null,
        stok: v.stock ?? 0,
        stock: v.stock ?? 0,
        is_default: v.is_default ?? (index === 0),
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

export async function getHiddenProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      variations:product_variations(*)
    `)
    .eq('published', false); // Only hidden products

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
