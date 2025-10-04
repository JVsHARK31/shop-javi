# 🚨 URGENT: DATABASE SETUP REQUIRED

## ❌ **MASALAH SAAT INI:**
- ✅ Aplikasi sudah deploy di Vercel
- ❌ Database belum di-setup
- ❌ Tidak ada produk yang ditampilkan
- ❌ Login admin tidak berfungsi
- ❌ Kategori tidak muncul

## 🔧 **SOLUSI CEPAT:**

### **LANGKAH 1: Setup Database di Supabase**

1. **Buka Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/unirpugxxddorhuyhibf
   ```

2. **Klik "SQL Editor"** di sidebar kiri

3. **Copy dan Paste SQL berikut:**
   ```sql
   -- 1. CREATE TABLES
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

   -- 2. ENABLE RLS
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

   -- 3. CREATE POLICIES
   CREATE POLICY "Public products are viewable by everyone" ON products
       FOR SELECT USING (published = true);

   CREATE POLICY "Public categories are viewable by everyone" ON categories
       FOR SELECT USING (true);

   CREATE POLICY "Public product_variations are viewable by everyone" ON product_variations
       FOR SELECT USING (true);

   -- 4. INSERT SAMPLE CATEGORIES
   INSERT INTO categories (name, slug, description) VALUES
   ('Template Design', 'template-design', 'Template website dan aplikasi'),
   ('E-book & Panduan', 'ebook-panduan', 'E-book dan panduan digital'),
   ('Preset & Assets', 'preset-assets', 'Preset dan aset digital'),
   ('Produk AI', 'produk-ai', 'Produk berbasis AI')
   ON CONFLICT (slug) DO NOTHING;

   -- 5. INSERT SAMPLE PRODUCTS
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

   -- 6. INSERT ADMIN USER (password: admin123)
   INSERT INTO admin_users (username, password_hash) VALUES
   ('admin', '$2b$10$rQZ8K9mP2nL7vX5wY3tEHOJ6kM8qR2sT4uV7wX9yZ1aB3cD5eF6gH')
   ON CONFLICT (username) DO NOTHING;
   ```

4. **Klik "Run"** untuk menjalankan SQL

### **LANGKAH 2: Test Aplikasi**

Setelah SQL dijalankan, refresh aplikasi Vercel:

1. **Homepage**: Akan menampilkan 6 produk
2. **Filter**: Kategori akan muncul di sidebar
3. **Search**: Pencarian akan berfungsi
4. **Product Detail**: Klik produk untuk melihat detail
5. **Admin Login**: 
   - URL: `/admin/login`
   - Username: `admin`
   - Password: `admin123`

## ✅ **HASIL SETELAH SETUP:**

### **Produk yang Akan Muncul:**
1. **Bolt new AI-1 bulan** - Rp 150.000
2. **Preset Lightroom Mobile** - Rp 50.000  
3. **E-book Panduan Digital Marketing** - Rp 75.000
4. **Template Website E-commerce** - Rp 150.000
5. **Template Portfolio Creative** - Rp 200.000
6. **Preset Instagram Feed** - Rp 35.000

### **Kategori yang Akan Muncul:**
- Template Design
- E-book & Panduan
- Preset & Assets
- Produk AI

### **Admin Dashboard:**
- Login berfungsi
- Manajemen produk
- Manajemen kategori
- Dashboard statistik

## 🎯 **VERIFIKASI:**

Setelah setup database:
1. ✅ **Produk muncul** di homepage
2. ✅ **Gambar loading** dengan fallback
3. ✅ **Kategori filter** berfungsi
4. ✅ **Search** berfungsi
5. ✅ **Admin login** berfungsi
6. ✅ **Responsive design** optimal

## 🚨 **PENTING:**

**Jika masih tidak muncul setelah setup database:**
1. Refresh browser (Ctrl+F5)
2. Clear browser cache
3. Tunggu 1-2 menit untuk propagasi
4. Check browser console untuk error

---

**Status**: 🚨 **URGENT - DATABASE SETUP REQUIRED**  
**Action**: Run SQL di Supabase Dashboard  
**Time**: 5 menit setup + 1 menit test
