import { Product, ProductImage, ProductVariation } from '../types';

/**
 * Transform product dari schema baru ke format legacy untuk backward compatibility
 * Mengisi field judul, deskripsi, gambar, stok_total, dll
 */
export function adaptProductToLegacy(product: any): Product {
  // Compute gambar dari images
  const gambar = product.images
    ? product.images
        .sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order)
        .map((img: ProductImage) => img.url)
    : product.gambar || [];

  // Compute variations dengan price computed
  const variations = product.variations?.map((v: any) => ({
    ...v,
    // Backward compatibility: gunakan nama_variasi jika ada, jika tidak gunakan name
    nama_variasi: v.nama_variasi || v.name,
    name: v.name || v.nama_variasi,
    // Compute price dari price_override atau base_price
    price: v.price_override !== null && v.price_override !== undefined 
      ? v.price_override 
      : v.price || product.base_price,
    // Backward compatibility untuk stock/stok
    stock: v.stock !== undefined ? v.stock : v.stok || 0,
    stok: v.stok !== undefined ? v.stok : v.stock || 0,
  })) || [];

  // Compute stok_total dari sum variations.stock
  const stok_total = variations.reduce((sum: number, v: any) => sum + (v.stock || v.stok || 0), 0);

  // Compute kategori dari categories relation
  const kategori = product.categories
    ? product.categories.map((c: any) => c.name)
    : product.kategori || [];

  return {
    ...product,
    // Core fields (new schema)
    title: product.title || product.judul,
    description: product.description || product.deskripsi,
    // Legacy fields (computed)
    judul: product.judul || product.title,
    deskripsi: product.deskripsi || product.description,
    gambar,
    kategori,
    tag: product.tag || [],
    stok_total,
    highlight_bullets: product.highlight_bullets || [],
    // Processed variations
    variations,
  };
}

/**
 * Transform product dari format legacy ke schema baru untuk saving
 */
export function adaptProductFromLegacy(product: Partial<Product>): any {
  return {
    title: product.title || product.judul,
    description: product.description || product.deskripsi,
    base_price: product.base_price,
    published: product.published,
    slug: product.slug,
  };
}

/**
 * Validate maksimal 4 gambar
 */
export function validateMaxImages(images: any[]): { valid: boolean; error?: string } {
  if (images.length > 4) {
    return {
      valid: false,
      error: 'Maksimal 4 gambar per produk',
    };
  }
  return { valid: true };
}
