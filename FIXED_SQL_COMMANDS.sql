-- E-commerce Database Setup untuk Javier_shark006 Shop
-- SQL yang sudah diperbaiki untuk mengatasi error policy yang sudah ada

-- 1. DROP EXISTING POLICIES (jika ada)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Public product_variations are viewable by everyone" ON product_variations;

-- 2. CREATE TABLES
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

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 3. ENABLE RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES
CREATE POLICY "Public products are viewable by everyone" ON products
    FOR SELECT USING (published = true);

CREATE POLICY "Public categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public product_variations are viewable by everyone" ON product_variations
    FOR SELECT USING (true);

-- 5. INSERT SAMPLE CATEGORIES
INSERT INTO categories (name, slug, description) VALUES
('Template Design', 'template-design', 'Template website dan aplikasi'),
('E-book & Panduan', 'ebook-panduan', 'E-book dan panduan digital'),
('Preset & Assets', 'preset-assets', 'Preset dan aset digital'),
('Produk AI', 'produk-ai', 'Produk berbasis AI')
ON CONFLICT (slug) DO NOTHING;

-- 6. INSERT SAMPLE PRODUCTS
INSERT INTO products (slug, judul, deskripsi, kategori, tag, gambar, published, base_price, stok_total, highlight_bullets) VALUES
('bolt-new-ai-1-bulan', 'Bolt new AI-1 bulan', 'Akses premium Bolt.new untuk 1 bulan penuh dengan fitur AI terbaru untuk pengembangan aplikasi web modern', 
 ARRAY['Produk AI'], ARRAY['#AI', 'Bolt.new'], 
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], 
 true, 150000, 10, ARRAY['Akses penuh fitur AI', '1 bulan penuh', 'Support 24/7']),
('preset-lightroom-mobile', 'Preset Lightroom Mobile', 'Koleksi preset Lightroom untuk mobile photography dengan 20+ preset unik',
 ARRAY['Preset & Assets'], ARRAY['Lightroom', 'Preset', 'Fotografi', 'Mobile'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 50000, 50, ARRAY['20+ preset unik', 'Kompatibel mobile', 'Easy to use']),
('ebook-panduan-digital-marketing', 'E-book Panduan Digital Marketing', 'Panduan lengkap digital marketing untuk pemula dengan strategi terbaru',
 ARRAY['E-book & Panduan'], ARRAY['E-book', 'Marketing', 'Digital Marketing'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 75000, 25, ARRAY['100+ halaman', 'Strategi terbaru', 'Case study real']),
('template-website-ecommerce', 'Template Website E-commerce', 'Template website e-commerce modern dan responsive dengan UI yang menarik',
 ARRAY['Template Design'], ARRAY['Website', 'E-commerce', 'Template'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 150000, 15, ARRAY['Responsive design', 'Modern UI', 'Easy customization']),
('template-portfolio-creative', 'Template Portfolio Creative', 'Template portfolio kreatif untuk designer dan developer dengan animasi modern',
 ARRAY['Template Design'], ARRAY['Portfolio', 'Creative', 'Design'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 200000, 8, ARRAY['Modern design', 'Smooth animations', 'Mobile first']),
('preset-instagram-feed', 'Preset Instagram Feed', 'Preset untuk Instagram feed yang konsisten dan menarik dengan warna yang aesthetic',
 ARRAY['Preset & Assets'], ARRAY['Instagram', 'Preset', 'Social Media'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 35000, 30, ARRAY['Aesthetic colors', 'Instagram ready', 'Easy apply'])
ON CONFLICT (slug) DO NOTHING;

-- 7. INSERT ADMIN USER (password: athallah310706)
INSERT INTO admin_users (username, password_hash) VALUES
('Javier', 'athallah310706')
ON CONFLICT (username) DO NOTHING;
