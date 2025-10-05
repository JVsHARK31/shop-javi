-- =====================================================
-- QUICK DATABASE RESET - JAVIER SHARK006 SHOP
-- SQL untuk reset database dengan cepat
-- =====================================================

-- 1. HAPUS SEMUA DATA LAMA (HATI-HATI!)
DELETE FROM product_variations;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM admin_users;

-- 2. INSERT DATA FRESH
INSERT INTO categories (name, slug, description) VALUES
('Template Design', 'template-design', 'Template website dan aplikasi modern'),
('E-book & Panduan', 'ebook-panduan', 'E-book dan panduan digital lengkap'),
('Preset & Assets', 'preset-assets', 'Preset dan aset digital kreatif'),
('Produk AI', 'produk-ai', 'Produk berbasis Artificial Intelligence');

INSERT INTO products (slug, judul, deskripsi, kategori, tag, gambar, published, base_price, stok_total, highlight_bullets) VALUES
('bolt-new-ai-1-bulan', 'Bolt new AI-1 bulan', 'Akses premium Bolt.new untuk 1 bulan penuh dengan fitur AI terbaru', ARRAY['Produk AI'], ARRAY['#AI', 'Bolt.new'], ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], true, 150000, 10, ARRAY['Akses penuh fitur AI', '1 bulan penuh', 'Support 24/7']),
('preset-lightroom-mobile', 'Preset Lightroom Mobile', 'Koleksi preset Lightroom untuk mobile photography dengan 20+ preset unik', ARRAY['Preset & Assets'], ARRAY['Lightroom', 'Preset', 'Fotografi'], ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], true, 50000, 50, ARRAY['20+ preset unik', 'Kompatibel mobile', 'Easy to use']),
('ebook-panduan-digital-marketing', 'E-book Panduan Digital Marketing', 'Panduan lengkap digital marketing untuk pemula dengan strategi terbaru', ARRAY['E-book & Panduan'], ARRAY['E-book', 'Marketing', 'Digital Marketing'], ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], true, 75000, 25, ARRAY['100+ halaman', 'Strategi terbaru', 'Case study real']),
('template-website-ecommerce', 'Template Website E-commerce', 'Template website e-commerce modern dan responsive dengan UI yang menarik', ARRAY['Template Design'], ARRAY['Website', 'E-commerce', 'Template'], ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], true, 150000, 15, ARRAY['Responsive design', 'Modern UI', 'Easy customization']),
('template-portfolio-creative', 'Template Portfolio Creative', 'Template portfolio kreatif untuk designer dan developer dengan animasi modern', ARRAY['Template Design'], ARRAY['Portfolio', 'Creative', 'Design'], ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], true, 200000, 8, ARRAY['Modern design', 'Smooth animations', 'Mobile first']),
('preset-instagram-feed', 'Preset Instagram Feed', 'Preset untuk Instagram feed yang konsisten dan menarik dengan warna yang aesthetic', ARRAY['Preset & Assets'], ARRAY['Instagram', 'Preset', 'Social Media'], ARRAY['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800'], true, 35000, 30, ARRAY['Aesthetic colors', 'Instagram ready', 'Easy apply']);

INSERT INTO admin_users (username, password_hash) VALUES
('Javier', 'athallah310706');

-- 3. VERIFY
SELECT 'RESET COMPLETE!' as status;
SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as products_count FROM products;
SELECT username FROM admin_users WHERE username = 'Javier';
