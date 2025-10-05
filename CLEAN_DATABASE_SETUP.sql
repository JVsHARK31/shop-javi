-- =====================================================
-- JAVIER SHARK006 SHOP - CLEAN DATABASE SETUP
-- SQL Versi Terbaru - Fix Semua Error
-- =====================================================

-- 1. DROP EXISTING TABLES (jika ada) - untuk fresh start
DROP TABLE IF EXISTS product_variations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 2. CREATE TABLES dengan struktur yang benar
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
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

CREATE TABLE product_variations (
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

CREATE TABLE admin_users (
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

-- 4. CREATE POLICIES yang benar
-- Products: hanya yang published bisa dilihat publik
CREATE POLICY "products_select_policy" ON products
    FOR SELECT USING (published = true);

-- Categories: semua bisa dilihat publik
CREATE POLICY "categories_select_policy" ON categories
    FOR SELECT USING (true);

-- Product variations: semua bisa dilihat publik
CREATE POLICY "product_variations_select_policy" ON product_variations
    FOR SELECT USING (true);

-- Admin users: hanya admin yang terautentikasi
CREATE POLICY "admin_users_select_policy" ON admin_users
    FOR SELECT USING (true);

-- 5. INSERT SAMPLE CATEGORIES
INSERT INTO categories (name, slug, description) VALUES
('Template Design', 'template-design', 'Template website dan aplikasi modern'),
('E-book & Panduan', 'ebook-panduan', 'E-book dan panduan digital lengkap'),
('Preset & Assets', 'preset-assets', 'Preset dan aset digital kreatif'),
('Produk AI', 'produk-ai', 'Produk berbasis Artificial Intelligence');

-- 6. INSERT SAMPLE PRODUCTS
INSERT INTO products (slug, judul, deskripsi, kategori, tag, gambar, published, base_price, stok_total, highlight_bullets) VALUES

('bolt-new-ai-1-bulan', 
 'Bolt new AI-1 bulan', 
 'Akses premium Bolt.new untuk 1 bulan penuh dengan fitur AI terbaru untuk pengembangan aplikasi web modern dan cepat',
 ARRAY['Produk AI'], 
 ARRAY['#AI', 'Bolt.new', 'Development', 'Web App'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 
 150000, 
 10, 
 ARRAY['Akses penuh fitur AI', '1 bulan penuh', 'Support 24/7', 'Update terbaru']),

('preset-lightroom-mobile', 
 'Preset Lightroom Mobile', 
 'Koleksi preset Lightroom untuk mobile photography dengan 20+ preset unik yang siap pakai',
 ARRAY['Preset & Assets'], 
 ARRAY['Lightroom', 'Preset', 'Fotografi', 'Mobile', 'Photo'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 
 50000, 
 50, 
 ARRAY['20+ preset unik', 'Kompatibel mobile', 'Easy to use', 'High quality']),

('ebook-panduan-digital-marketing', 
 'E-book Panduan Digital Marketing', 
 'Panduan lengkap digital marketing untuk pemula dengan strategi terbaru dan case study real',
 ARRAY['E-book & Panduan'], 
 ARRAY['E-book', 'Marketing', 'Digital Marketing', 'Strategy'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 
 75000, 
 25, 
 ARRAY['100+ halaman', 'Strategi terbaru', 'Case study real', 'Bonus templates']),

('template-website-ecommerce', 
 'Template Website E-commerce', 
 'Template website e-commerce modern dan responsive dengan UI yang menarik dan fitur lengkap',
 ARRAY['Template Design'], 
 ARRAY['Website', 'E-commerce', 'Template', 'Responsive', 'Modern'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 
 150000, 
 15, 
 ARRAY['Responsive design', 'Modern UI', 'Easy customization', 'SEO ready']),

('template-portfolio-creative', 
 'Template Portfolio Creative', 
 'Template portfolio kreatif untuk designer dan developer dengan animasi modern dan smooth transitions',
 ARRAY['Template Design'], 
 ARRAY['Portfolio', 'Creative', 'Design', 'Animation', 'Developer'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 
 200000, 
 8, 
 ARRAY['Modern design', 'Smooth animations', 'Mobile first', 'Fast loading']),

('preset-instagram-feed', 
 'Preset Instagram Feed', 
 'Preset untuk Instagram feed yang konsisten dan menarik dengan warna yang aesthetic dan profesional',
 ARRAY['Preset & Assets'], 
 ARRAY['Instagram', 'Preset', 'Social Media', 'Aesthetic', 'Feed'],
 ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'],
 true, 
 35000, 
 30, 
 ARRAY['Aesthetic colors', 'Instagram ready', 'Easy apply', 'Professional look']);

-- 7. INSERT ADMIN USER dengan password yang benar
INSERT INTO admin_users (username, password_hash) VALUES
('Javier', 'athallah310706');

-- 8. VERIFY DATA
SELECT 'Categories inserted:' as info, COUNT(*) as count FROM categories;
SELECT 'Products inserted:' as info, COUNT(*) as count FROM products;
SELECT 'Admin users:' as info, username, created_at FROM admin_users;

-- 9. TEST QUERIES
SELECT 'Sample products:' as info;
SELECT slug, judul, base_price, published FROM products LIMIT 3;

SELECT 'Sample categories:' as info;
SELECT name, slug FROM categories;

-- =====================================================
-- END OF SETUP
-- =====================================================
