# 🚨 QUICK STORAGE FIX - "Storage bucket belum dikonfigurasi"

## ❌ **ERROR YANG TERJADI:**
```
Storage bucket belum dikonfigurasi. Jalankan SQL setup di Supabase.
```

## 🔍 **ROOT CAUSE:**
Supabase Storage bucket `product-images` belum dibuat, sehingga upload gambar gagal.

## ✅ **SOLUSI CEPAT (2 MENIT):**

### **LANGKAH 1: Buka Supabase Dashboard**
1. **Buka**: https://supabase.com/dashboard/project/unirpugxxddorhuyhibf
2. **Login** dengan akun Supabase Anda
3. **Klik**: "SQL Editor" di sidebar kiri

### **LANGKAH 2: Jalankan SQL Setup**
**Copy & Paste SQL berikut ke SQL Editor:**

```sql
-- =====================================================
-- STORAGE BUCKET SETUP - JAVIER SHARK006 SHOP
-- =====================================================

-- 1. CREATE STORAGE BUCKET untuk product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. DROP EXISTING STORAGE POLICIES (jika ada)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- 3. CREATE STORAGE POLICIES untuk product-images bucket

-- Allow public to view product images
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update product images
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- 4. VERIFY BUCKET CREATION
SELECT 'Storage bucket setup completed!' as status;

-- Check if bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'product-images';
```

### **LANGKAH 3: Execute SQL**
1. **Klik**: "Run" button (atau Ctrl+Enter)
2. **Wait**: Hingga muncul hasil "Storage bucket setup completed!"
3. **Verify**: Harus ada 1 row di hasil query bucket

### **LANGKAH 4: Test Upload**
1. **Refresh** halaman admin (`/admin/products`)
2. **Klik** "Tambah Produk"
3. **Upload gambar** - seharusnya tidak ada error lagi

## 🎯 **EXPECTED RESULTS:**

### **✅ Jika Berhasil:**
- SQL execution berhasil tanpa error
- Muncul "Storage bucket setup completed!"
- Bucket `product-images` terbuat
- Upload gambar berfungsi tanpa error

### **❌ Jika Error:**
- Check error message di SQL Editor
- Pastikan menggunakan service role key
- Check permissions di Supabase project

## 🔧 **TROUBLESHOOTING:**

### **Error 1: "insufficient_privilege"**
**Solusi**: 
- Pastikan menggunakan service role key
- Check project permissions
- Contact Supabase support jika perlu

### **Error 2: "relation does not exist"**
**Solusi**: 
- Pastikan project Supabase aktif
- Check database connection
- Refresh halaman dan coba lagi

### **Error 3: "bucket already exists"**
**Solusi**: 
- Ini normal, SQL akan update bucket yang sudah ada
- Lanjutkan dengan test upload

## 📱 **VERIFICATION STEPS:**

### **1. Check Bucket di Supabase:**
1. Buka **Storage** tab di Supabase dashboard
2. Harus ada bucket **"product-images"**
3. Bucket harus **public**

### **2. Test Upload di Admin:**
1. Buka `/admin/products`
2. Klik "Tambah Produk"
3. Upload gambar
4. Harus berhasil tanpa error

### **3. Check Console Logs:**
1. Buka Developer Tools (F12)
2. Lihat console untuk debug messages
3. Harus ada "📦 STORAGE DEBUG: Bucket exists: true"

## 🚨 **URGENT CHECKLIST:**

- [ ] SQL dijalankan di Supabase SQL Editor
- [ ] Muncul "Storage bucket setup completed!"
- [ ] Bucket `product-images` terbuat
- [ ] Storage policies terbuat
- [ ] Test upload berhasil
- [ ] Tidak ada error di console

## 🎉 **AFTER FIX:**

Setelah fix, upload gambar akan mendukung:
- ✅ **Drag & Drop** upload
- ✅ **Multiple files** (max 4 gambar)
- ✅ **Image preview** sebelum upload
- ✅ **Progress indicator** saat upload
- ✅ **Error handling** dengan pesan jelas
- ✅ **File validation** (size, type)
- ✅ **Public URLs** untuk gambar

---

**Status**: 🚨 **URGENT - Storage bucket missing**  
**Action**: Run SQL setup immediately  
**Time**: 2 menit setup + 1 menit test
