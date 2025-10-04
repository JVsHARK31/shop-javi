export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          judul: string;
          deskripsi: string;
          kategori: string[] | null;
          tag: string[] | null;
          gambar: string[] | null;
          published: boolean | null;
          base_price: number | null;
          stok_total: number | null;
          highlight_bullets: string[] | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          judul: string;
          deskripsi?: string;
          kategori?: string[];
          tag?: string[];
          gambar?: string[];
          published?: boolean;
          base_price?: number;
          stok_total?: number;
          highlight_bullets?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          judul?: string;
          deskripsi?: string;
          kategori?: string[];
          tag?: string[];
          gambar?: string[];
          published?: boolean;
          base_price?: number;
          stok_total?: number;
          highlight_bullets?: string[];
          updated_at?: string;
        };
      };
      product_variations: {
        Row: {
          id: string;
          product_id: string;
          nama_variasi: string;
          price: number;
          sku: string;
          stok: number | null;
          is_default: boolean | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          nama_variasi: string;
          price: number;
          sku: string;
          stok?: number;
          is_default?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          nama_variasi?: string;
          price?: number;
          sku?: string;
          stok?: number;
          is_default?: boolean;
          sort_order?: number;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string | null;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          last_login?: string;
        };
      };
    };
  };
};
