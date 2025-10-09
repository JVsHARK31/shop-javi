// Product Image interface (sesuai schema baru)
export interface ProductImage {
  id?: string;
  product_id?: string;
  url: string;
  alt?: string;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

// Product Variation interface (updated untuk price_override)
export interface ProductVariation {
  id?: string;
  product_id?: string;
  name: string; // Changed from nama_variasi
  nama_variasi?: string; // Legacy field for backward compatibility
  price_override?: number | null; // Changed from price
  price?: number; // Computed field (base_price or price_override)
  stock: number; // Changed from stok
  stok?: number; // Legacy field for backward compatibility
  sku?: string;
  is_default: boolean;
  sort_order: number;
  created_at?: string;
}

// Product interface (updated untuk schema baru)
export interface Product {
  id: string;
  slug: string;
  title: string; // Changed from judul
  description: string; // Changed from deskripsi
  base_price: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  images?: ProductImage[]; // Changed from gambar: string[]
  variations?: ProductVariation[];
  categories?: Category[]; // Many-to-many relation
  // Legacy/Computed fields untuk backward compatibility
  judul?: string; // Alias untuk title
  deskripsi?: string; // Alias untuk description
  gambar?: string[]; // Computed dari images
  kategori?: string[]; // Computed dari categories
  tag?: string[]; // TODO: implement tags table jika diperlukan
  stok_total?: number; // Computed dari sum(variations.stock)
  highlight_bullets?: string[]; // TODO: implement jika diperlukan
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}

export interface ProductFilters {
  kategori?: string[];
  tag?: string[];
  search?: string;
  sortBy?: 'terbaru' | 'harga_terendah' | 'harga_tertinggi';
  published?: boolean;
}

export interface WhatsAppOrderData {
  namaProduk: string;
  namaVariasi: string;
  qty: number;
  totalHarga: number;
  urlProduk: string;
  productId?: string;
  variationId?: string;
}

// WA Order Intent untuk logging di database
export interface WAOrderIntent {
  id?: string;
  product_id?: string | null;
  variation_id?: string | null;
  quantity: number;
  message: string;
  created_at?: string;
}
