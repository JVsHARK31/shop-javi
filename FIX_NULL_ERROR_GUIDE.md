# 🔧 Fix Error: Null Value in Column "nama_variasi"

## ❌ Error yang Terjadi:
```
null value in column "nama_variasi" of relation "product_variations" 
violates not-null constraint
```

## 🎯 Penyebab:
- Kolom `nama_variasi` di database memiliki constraint **NOT NULL**
- Tapi aplikasi mengirim nilai kosong/null saat insert variasi produk

## ✅ Solusi Lengkap (2 Langkah):

---

## 📋 LANGKAH 1: Fix Database di Supabase

### 1.1 Buka Supabase SQL Editor
- Login ke https://app.supabase.com
- Pilih project Anda
- Klik **"SQL Editor"** di sidebar kiri
- Klik **"New Query"**

### 1.2 Copy & Paste Script SQL

**Buka file:** `FIX_NULL_CONSTRAINT.sql`

Atau copy script ini:

```sql
-- STEP 1: Hapus NOT NULL constraint
ALTER TABLE product_variations 
ALTER COLUMN nama_variasi DROP NOT NULL;

ALTER TABLE product_variations 
ALTER COLUMN stok DROP NOT NULL;

-- STEP 2: Update trigger untuk handle INSERT
CREATE OR REPLACE FUNCTION sync_product_variations_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Sync name <-> nama_variasi
    IF NEW.name IS NOT NULL AND NEW.name != '' THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS NOT NULL AND NEW.nama_variasi != '' THEN
      NEW.name := NEW.nama_variasi;
    ELSIF NEW.name IS NULL AND NEW.nama_variasi IS NULL THEN
      NEW.name := 'Default Variation';
      NEW.nama_variasi := 'Default Variation';
    END IF;
    
    -- Sync stock <-> stok
    IF NEW.stock IS NOT NULL THEN
      NEW.stok := NEW.stock;
    ELSIF NEW.stok IS NOT NULL THEN
      NEW.stock := NEW.stok;
    ELSE
      NEW.stock := 0;
      NEW.stok := 0;
    END IF;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS DISTINCT FROM OLD.nama_variasi THEN
      NEW.name := NEW.nama_variasi;
    END IF;
    
    IF NEW.stock IS DISTINCT FROM OLD.stock THEN
      NEW.stok := NEW.stock;
    ELSIF NEW.stok IS DISTINCT FROM OLD.stok THEN
      NEW.stock := NEW.stok;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Re-create trigger
DROP TRIGGER IF EXISTS sync_product_variations_trigger ON product_variations;
CREATE TRIGGER sync_product_variations_trigger
  BEFORE INSERT OR UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION sync_product_variations_fields();

-- STEP 4: Set default value
ALTER TABLE product_variations 
ALTER COLUMN nama_variasi SET DEFAULT 'Default Variation';

ALTER TABLE product_variations 
ALTER COLUMN stok SET DEFAULT 0;

-- STEP 5: Update existing NULL values
UPDATE product_variations 
SET nama_variasi = 'Default Variation'
WHERE nama_variasi IS NULL OR nama_variasi = '';

UPDATE product_variations 
SET stok = 0
WHERE stok IS NULL;
```

### 1.3 Jalankan Script
- Klik **"Run"** atau tekan `Ctrl + Enter`
- Tunggu sampai selesai (biasanya < 5 detik)
- Pastikan tidak ada error muncul

---

## 🔄 LANGKAH 2: Update Code (Sudah Selesai)

Code sudah diupdate untuk:
- ✅ Selalu mengirim `nama_variasi` dan `name`
- ✅ Menggunakan default value jika kosong
- ✅ Handle null values dengan benar
- ✅ Auto-sync antara kolom lama dan baru

**File yang diupdate:**
- `lib/services/products.ts` - createProduct()
- `lib/services/products.ts` - updateProduct()

---

## 🧪 Test Setelah Fix

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Test Buat Produk Baru
1. Buka halaman Admin → Products
2. Klik "Tambah Produk"
3. Isi form produk:
   - Judul: "Test Product"
   - Slug: "test-product"
   - Deskripsi: "Test description"
   - Base Price: 50000
   
4. **Tambah Variasi:**
   - Nama Variasi: "Variasi 1"
   - Harga: 50000 (atau kosongkan untuk pakai base price)
   - Stok: 10
   
5. Klik **"Simpan"**

### 3. Verifikasi
- ✅ Produk berhasil disimpan tanpa error
- ✅ Variasi muncul di list
- ✅ Data tersimpan di database

---

## 🔍 Apa yang Diperbaiki?

### **SEBELUM FIX:**
```
❌ nama_variasi = NULL → Error NOT NULL constraint
❌ stok = NULL → Error NOT NULL constraint
```

### **SETELAH FIX:**
```
✅ nama_variasi nullable (bisa NULL)
✅ stok nullable (bisa NULL)
✅ Default value = 'Default Variation' dan 0
✅ Trigger auto-fill jika kosong
✅ Code selalu kirim nilai
```

---

## 🛡️ Proteksi yang Ditambahkan

### 1. **Database Level:**
- ✅ Hapus NOT NULL constraint
- ✅ Set default value
- ✅ Trigger auto-sync
- ✅ Handle NULL dengan gracefully

### 2. **Code Level:**
- ✅ Default value fallback: `v.name || 'Default Variation'`
- ✅ Stock default: `v.stock ?? 0`
- ✅ Selalu kirim kedua field (lama & baru)
- ✅ is_default otomatis untuk variasi pertama

---

## 📊 Struktur Setelah Fix

### **Column Constraints:**
```sql
┌────────────────┬──────────┬─────────────┬────────────────────────┐
│ Column         │ Type     │ Nullable    │ Default                │
├────────────────┼──────────┼─────────────┼────────────────────────┤
│ nama_variasi   │ varchar  │ YES ✅      │ 'Default Variation'    │
│ name           │ varchar  │ YES         │ NULL                   │
│ stok           │ integer  │ YES ✅      │ 0                      │
│ stock          │ integer  │ NO          │ 0                      │
│ price          │ numeric  │ YES         │ NULL                   │
│ price_override │ numeric  │ YES         │ NULL                   │
└────────────────┴──────────┴─────────────┴────────────────────────┘
```

---

## 🆘 Troubleshooting

### ❌ Error masih muncul setelah run SQL
**Solusi:**
1. Refresh halaman admin: `Ctrl + Shift + R`
2. Restart dev server: `npm run dev`
3. Clear Supabase cache di browser
4. Cek apakah SQL berhasil dijalankan tanpa error

### ❌ Trigger tidak berfungsi
**Solusi:**
1. Pastikan trigger sudah dibuat:
   ```sql
   SELECT tgname FROM pg_trigger WHERE tgrelid = 'product_variations'::regclass;
   ```
2. Re-run script trigger dari `FIX_NULL_CONSTRAINT.sql`

### ❌ Default value tidak muncul
**Solusi:**
1. Check default value:
   ```sql
   SELECT column_name, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'product_variations';
   ```
2. Re-run step 4 dari SQL script

### ❌ Data lama masih NULL
**Solusi:**
Run update query:
```sql
UPDATE product_variations 
SET nama_variasi = 'Default Variation'
WHERE nama_variasi IS NULL;
```

---

## ✨ Setelah Fix Berhasil

Sekarang Anda bisa:
- ✅ Simpan produk dengan variasi tanpa error
- ✅ Edit produk existing
- ✅ Variasi dengan/tanpa nama (pakai default)
- ✅ Backward & forward compatibility
- ✅ Auto-sync antara field lama & baru

---

## 📝 Summary Perubahan

### **Database Changes:**
1. `nama_variasi` → nullable ✅
2. `stok` → nullable ✅
3. Default values ditambahkan ✅
4. Trigger auto-sync diupdate ✅

### **Code Changes:**
1. `createProduct()` → handle null values ✅
2. `updateProduct()` → handle null values ✅
3. Default fallback values ✅
4. Send both old & new fields ✅

---

**🎉 Sekarang Anda bisa simpan produk tanpa error!**

*Jika masih ada masalah, screenshot error dan check logs di Supabase.*
