export interface ProductVariation {
  id?: string;
  product_id?: string;
  nama_variasi: string;
  price: number;
  sku: string;
  stok: number;
  is_default: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  kategori: string[];
  tag: string[];
  gambar: string[];
  published: boolean;
  base_price: number;
  stok_total: number;
  highlight_bullets: string[];
  created_at: string;
  updated_at: string;
  variations?: ProductVariation[];
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
}
