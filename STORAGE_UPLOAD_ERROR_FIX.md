# 🚨 STORAGE UPLOAD ERROR FIX - "Bucket not found"

## ❌ **ERROR YANG TERJADI:**
```
Upload failed: Bucket not found
```

## 🔍 **ROOT CAUSE:**
Supabase Storage bucket `product-images` belum dibuat, sehingga upload gambar gagal.

## ✅ **SOLUSI LENGKAP:**

### **LANGKAH 1: Buat Storage Bucket**

**Jalankan SQL ini di Supabase SQL Editor:**

```sql
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
```

### **LANGKAH 2: Verifikasi Bucket**

**Setelah SQL dijalankan, cek hasilnya:**
- Harus muncul "Storage bucket setup completed!"
- Bucket `product-images` harus terbuat
- Policies harus terbuat

### **LANGKAH 3: Test Upload**

1. **Buka admin panel**: `/admin/products`
2. **Klik "Tambah Produk"**
3. **Upload gambar** di section "Gambar Produk"
4. **Verify**: Tidak ada error "Bucket not found"

## 🎯 **EXPECTED RESULTS:**

### **✅ Setelah Fix:**
- Upload gambar berhasil tanpa error
- Gambar tersimpan di Supabase Storage
- Public URL generated untuk gambar
- Gambar bisa dihapus dan diupdate

### **🔧 Technical Details:**
- **Bucket Name**: `product-images`
- **Public Access**: Yes (untuk view gambar di website)
- **File Size Limit**: 5MB per file
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Max Images**: 4 per produk

## 📋 **STORAGE CONFIGURATION:**

### **Bucket Settings:**
```sql
id: 'product-images'
name: 'product-images'
public: true
file_size_limit: 5242880 (5MB)
allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
```

### **Storage Policies:**
- **Public Read**: Semua orang bisa lihat gambar
- **Authenticated Upload**: Hanya user login bisa upload
- **Authenticated Update**: Hanya user login bisa update
- **Authenticated Delete**: Hanya user login bisa delete

## 🚨 **URGENT ACTION:**

### **Jalankan SQL Fix SEKARANG:**

1. **Buka**: https://supabase.com/dashboard/project/unirpugxxddorhuyhibf
2. **Klik**: "SQL Editor"
3. **Copy & Paste**: SQL dari `STORAGE_BUCKET_SETUP.sql`
4. **Klik**: "Run"
5. **Verify**: Harus muncul "Storage bucket setup completed!"

## 🔧 **TROUBLESHOOTING:**

### **Masalah 1: Masih error "Bucket not found"**
**Solusi**: 
- Pastikan SQL sudah dijalankan dengan benar
- Check apakah bucket terbuat di Storage tab
- Refresh halaman admin

### **Masalah 2: Error "insufficient_privilege"**
**Solusi**: 
- Pastikan menggunakan service role key
- Check storage policies sudah dibuat

### **Masalah 3: Upload berhasil tapi gambar tidak muncul**
**Solusi**: 
- Check public URL generation
- Verify bucket public setting
- Check network tab untuk error

## 📱 **TESTING CHECKLIST:**

- [ ] SQL bucket setup berhasil dijalankan
- [ ] Bucket `product-images` terbuat
- [ ] Storage policies terbuat
- [ ] Upload gambar berhasil tanpa error
- [ ] Public URL generated dengan benar
- [ ] Gambar bisa dilihat di website
- [ ] Delete gambar berfungsi

## 🎉 **BONUS FEATURES:**

Setelah fix, upload gambar juga mendukung:
- ✅ **Drag & Drop** upload
- ✅ **Multiple files** upload (max 4)
- ✅ **Image preview** sebelum upload
- ✅ **Progress indicator** saat upload
- ✅ **Error handling** dengan pesan yang jelas
- ✅ **File validation** (size, type)
- ✅ **Automatic compression** jika diperlukan

---

**Status**: 🚨 **URGENT - Storage bucket missing**  
**Action**: Run SQL setup immediately  
**Time**: 2 menit setup + 1 menit test
