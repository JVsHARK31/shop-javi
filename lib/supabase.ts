import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'stok_total'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_variations: {
        Row: {
          id: string;
          product_id: string;
          nama_variasi: string;
          price: number;
          sku: string;
          stok: number;
          is_default: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['product_variations']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
          last_login: string | null;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
    };
  };
};
