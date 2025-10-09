# 🔧 Panduan Fix Error Supabase Database

## ❌ Error yang Terjadi:
```
Could not find the 'price_override' column of 'product_variations' in the schema cache
```

## ✅ Solusi: Tambahkan Kolom yang Hilang

### 📋 Langkah-langkah:

#### 1. **Buka Supabase Dashboard**
   - Login ke [Supabase Dashboard](https://app.supabase.com)
   - Pilih project Anda

#### 2. **Buka SQL Editor**
   - Klik menu "SQL Editor" di sidebar kiri
   - Klik "New Query"

#### 3. **Copy & Paste Script SQL**
   
   **Buka file:** `QUICK_FIX_SUPABASE.sql`
   
   Atau copy script di bawah ini:

```sql
-- 1. Tambahkan kolom price_override
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS price_override DECIMAL(10,2) DEFAULT NULL;

-- 2. Tambahkan kolom name (mirror dari nama_variasi)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- 3. Tambahkan kolom stock (mirror dari stok)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 4. Migrate data dari kolom lama ke kolom baru
UPDATE product_variations 
SET 
  name = COALESCE(name, nama_variasi),
  stock = COALESCE(stock, stok);

-- 5. Buat trigger untuk auto-sync kedua kolom
CREATE OR REPLACE FUNCTION sync_product_variations_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT: Set default values if not provided
  IF TG_OP = 'INSERT' THEN
    -- Sync name <-> nama_variasi
    IF NEW.name IS NOT NULL THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS NOT NULL THEN
      NEW.name := NEW.nama_variasi;
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
  
  -- UPDATE: Sync whichever field was changed
  IF TG_OP = 'UPDATE' THEN
    -- Sync name <-> nama_variasi
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS DISTINCT FROM OLD.nama_variasi THEN
      NEW.name := NEW.nama_variasi;
    END IF;
    
    -- Sync stock <-> stok
    IF NEW.stock IS DISTINCT FROM OLD.stock THEN
      NEW.stok := NEW.stock;
    ELSIF NEW.stok IS DISTINCT FROM OLD.stok THEN
      NEW.stock := NEW.stok;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Buat trigger
DROP TRIGGER IF EXISTS sync_product_variations_trigger ON product_variations;
CREATE TRIGGER sync_product_variations_trigger
  BEFORE INSERT OR UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION sync_product_variations_fields();

-- 7. Verifikasi perubahan
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_variations' 
  AND column_name IN ('nama_variasi', 'name', 'stok', 'stock', 'price_override', 'price')
ORDER BY ordinal_position;
```

#### 4. **Jalankan Script**
   - Klik tombol "Run" atau tekan `Ctrl + Enter`
   - Tunggu hingga selesai (biasanya < 5 detik)

#### 5. **Verifikasi Hasil**
   
   Script akan menampilkan tabel dengan kolom-kolom:
   ```
   column_name      | data_type | is_nullable | column_default
   -----------------|-----------|-------------|---------------
   nama_variasi     | varchar   | YES         | NULL
   name             | varchar   | YES         | NULL
   price            | numeric   | YES         | NULL
   price_override   | numeric   | YES         | NULL
   stok             | integer   | YES         | NULL
   stock            | integer   | NO          | 0
   ```

#### 6. **Test Simpan Produk**
   - Buka aplikasi Anda
   - Coba buat/edit produk dengan variasi
   - Seharusnya tidak ada error lagi! ✅

---

## 🔍 Apa yang Dilakukan Script Ini?

### 1. **Menambahkan Kolom Baru:**
   - `price_override`: Harga custom per variasi (opsional)
   - `name`: Nama variasi (mirror dari `nama_variasi`)
   - `stock`: Jumlah stok (mirror dari `stok`)

### 2. **Migrasi Data:**
   - Copy data dari kolom lama ke kolom baru
   - Memastikan backward compatibility

### 3. **Auto-Sync dengan Trigger:**
   - Ketika Anda update `name`, otomatis update `nama_variasi`
   - Ketika Anda update `stock`, otomatis update `stok`
   - Dan sebaliknya!

### 4. **Keuntungan:**
   - ✅ Support code lama dan baru
   - ✅ Tidak perlu ubah code lagi
   - ✅ Data tetap konsisten
   - ✅ Mudah maintenance

---

## 🆘 Troubleshooting

### Error: "permission denied for table product_variations"
**Solusi:** Pastikan Anda login sebagai owner project atau punya permission untuk ALTER TABLE

### Error: "column already exists"
**Solusi:** Skip error ini, artinya kolom sudah ditambahkan sebelumnya

### Script tidak menampilkan hasil verifikasi
**Solusi:** Scroll ke bawah di SQL Editor, hasil query ada di bagian bawah

### Masih error setelah run script
**Solusi:** 
1. Refresh halaman admin
2. Clear cache browser (Ctrl + Shift + R)
3. Restart development server: `npm run dev`

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:
1. Screenshot error yang muncul
2. Check Supabase logs: Settings → Database → Logs
3. Pastikan koneksi ke Supabase aktif

---

## ✨ Setelah Fix Berhasil

Schema database Anda sekarang support:
- ✅ Field lama: `nama_variasi`, `stok`, `price`
- ✅ Field baru: `name`, `stock`, `price_override`
- ✅ Auto-sync antara field lama dan baru
- ✅ Backward & forward compatibility

**Sekarang Anda bisa simpan produk tanpa error!** 🎉
