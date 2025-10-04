# Setup Supabase Database

## 🔗 Koneksi Berhasil!
✅ **Supabase URL**: https://unirpugxxddorhuyhibf.supabase.co  
✅ **Connection Status**: Connected

## 🗄️ Database Setup Required

### Langkah 1: Buka Supabase Dashboard
1. Masuk ke [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih project: **unirpugxxddorhuyhibf**
3. Klik **SQL Editor** di sidebar kiri

### Langkah 2: Jalankan SQL Commands
Copy dan paste SQL berikut di SQL Editor, lalu klik **Run**:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT DEFAULT '',
  kategori TEXT[] DEFAULT '{}',
  tag TEXT[] DEFAULT '{}',
  gambar TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  base_price DECIMAL(10,2) DEFAULT 0,
  stok_total INTEGER DEFAULT 0,
  highlight_bullets TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  nama_variasi TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sku TEXT NOT NULL,
  stok INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Template Design', 'template-design', 'Template website dan aplikasi'),
('E-book & Panduan', 'ebook-panduan', 'E-book dan panduan digital'),
('Preset & Assets', 'preset-assets', 'Preset dan aset digital'),
('Produk AI', 'produk-ai', 'Produk berbasis AI')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (slug, judul, deskripsi, kategori, tag, gambar, published, base_price, stok_total, highlight_bullets) VALUES
('bolt-new-ai-1-bulan', 'Bolt new AI-1 bulan', 'Akses premium Bolt.new untuk 1 bulan penuh dengan fitur AI terbaru', 
 ARRAY['Produk AI'], ARRAY['#AI', 'Bolt.new'], 
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], 
 true, 150000, 10, ARRAY['Akses penuh fitur AI', '1 bulan penuh', 'Support 24/7']),
('preset-lightroom-mobile', 'Preset Lightroom Mobile', 'Koleksi preset Lightroom untuk mobile photography',
 ARRAY['Preset & Assets'], ARRAY['Lightroom', 'Preset', 'Fotografi', 'Mobile'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 50000, 50, ARRAY['20+ preset unik', 'Kompatibel mobile', 'Easy to use']),
('ebook-panduan-digital-marketing', 'E-book Panduan Digital Marketing', 'Panduan lengkap digital marketing untuk pemula',
 ARRAY['E-book & Panduan'], ARRAY['E-book', 'Marketing', 'Digital Marketing'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 75000, 25, ARRAY['100+ halaman', 'Strategi terbaru', 'Case study real']),
('template-website-ecommerce', 'Template Website E-commerce', 'Template website e-commerce modern dan responsive',
 ARRAY['Template Design'], ARRAY['Website', 'E-commerce', 'Template'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 150000, 15, ARRAY['Responsive design', 'Modern UI', 'Easy customization'])
ON CONFLICT (slug) DO NOTHING;
```

### Langkah 3: Enable Row Level Security (RLS)
Setelah tabel dibuat, jalankan SQL berikut untuk enable RLS:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products and categories
CREATE POLICY "Public products are viewable by everyone" ON products
    FOR SELECT USING (published = true);

CREATE POLICY "Public categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public product_variations are viewable by everyone" ON product_variations
    FOR SELECT USING (true);
```

## 🔐 Environment Variables untuk Vercel

Tambahkan environment variables berikut di Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://unirpugxxddorhuyhibf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM
```

## ✅ Verifikasi Setup

Setelah menjalankan SQL commands, aplikasi akan:
- ✅ Menampilkan 4 produk sample
- ✅ Filter berdasarkan kategori
- ✅ Search produk berfungsi
- ✅ Admin dashboard bisa diakses
- ✅ Responsive design optimal

## 🚀 Deployment ke Vercel

1. Import project dari GitHub: `JVsHARK31/shop-javi`
2. Tambahkan environment variables di atas
3. Deploy otomatis akan berjalan
4. Aplikasi siap live!

## 📞 Support

Jika ada masalah dengan setup database, pastikan:
- SQL commands dijalankan di SQL Editor Supabase
- RLS policies sudah dibuat
- Environment variables sudah ditambahkan di Vercel
