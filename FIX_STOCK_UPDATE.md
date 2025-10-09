# 🔧 Fix: Stok Tidak Terupdate/Tertambah

## ❌ Masalah:
- Produk bisa disimpan ✅
- Tapi stok variasi tidak terupdate atau tidak bertambah ❌
- Stok selalu 0 atau tidak berubah

## 🔍 Penyebab:
Form admin menggunakan field `stok` (lama), tapi code backend mencari field `stock` (baru), sehingga data stok tidak terbaca dan default ke 0.

## ✅ Solusi yang Diterapkan:

### **1. Update Backend Code** (Sudah Selesai ✅)

**File:** `lib/services/products.ts`

**Perubahan:**
```typescript
// SEBELUM (❌ Stok tidak tersimpan):
stok: v.stock ?? 0,     // v.stock = undefined dari form
stock: v.stock ?? 0,    // selalu 0!

// SESUDAH (✅ Stok tersimpan dengan benar):
const stockValue = (v as any).stok ?? v.stock ?? 0;  // Cek stok dulu, lalu stock
stok: stockValue,
stock: stockValue,
```

**Logika Baru:**
1. Cek field `stok` (dari form lama) → jika ada, pakai ini
2. Jika tidak ada, cek field `stock` (dari schema baru)
3. Jika kedua tidak ada, default ke 0

### **2. Backward Compatibility**

Code sekarang support:
- ✅ Form lama dengan field `stok`
- ✅ Schema baru dengan field `stock`
- ✅ Auto-sync kedua field
- ✅ Trigger database tetap berfungsi

---

## 🧪 Testing

### **Test 1: Buat Produk Baru dengan Stok**

1. **Buka Admin → Products → Tambah Produk**

2. **Isi Form:**
   ```
   Judul: Test Produk Stok
   Slug: test-produk-stok
   Base Price: 100000
   ```

3. **Tambah Variasi:**
   ```
   Variasi 1:
   - Nama: Ukuran S
   - Harga: 100000
   - Stok: 50        ← Input stok di sini
   
   Variasi 2:
   - Nama: Ukuran M
   - Harga: 120000
   - Stok: 30        ← Input stok di sini
   ```

4. **Simpan Produk**

5. **Verifikasi:**
   - ✅ Produk tersimpan
   - ✅ Variasi muncul dengan stok yang benar
   - ✅ Stok Total = 80 (50 + 30)

---

### **Test 2: Edit Produk & Update Stok**

1. **Buka produk yang sudah ada**

2. **Edit Variasi:**
   ```
   Variasi 1: Ubah stok dari 50 → 100
   Variasi 2: Ubah stok dari 30 → 75
   ```

3. **Simpan**

4. **Verifikasi:**
   - ✅ Stok terupdate dengan benar
   - ✅ Stok Total = 175 (100 + 75)
   - ✅ Data di database terupdate

---

### **Test 3: Verifikasi di Database**

**Di Supabase SQL Editor, jalankan:**

```sql
-- Check variasi produk terakhir
SELECT 
  p.judul as produk,
  pv.nama_variasi,
  pv.stok,
  pv.stock,
  pv.price
FROM products p
JOIN product_variations pv ON p.id = pv.product_id
ORDER BY p.created_at DESC
LIMIT 10;
```

**Expected Output:**
```
┌──────────────────┬────────────────┬──────┬───────┬─────────┐
│ produk           │ nama_variasi   │ stok │ stock │ price   │
├──────────────────┼────────────────┼──────┼───────┼─────────┤
│ Test Produk Stok │ Ukuran S       │ 100  │ 100   │ 100000  │
│ Test Produk Stok │ Ukuran M       │ 75   │ 75    │ 120000  │
└──────────────────┴────────────────┴──────┴───────┴─────────┘
```

✅ **Pastikan kolom `stok` dan `stock` memiliki nilai yang sama!**

---

## 🔄 Bagaimana Fix Ini Bekerja?

### **Flow Data Stok:**

```
┌─────────────────────────────────────────────────────────┐
│                      ADMIN FORM                         │
│                                                         │
│  Input Stok: 50  →  Field: "stok"  (old)              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (products.ts)                  │
│                                                         │
│  const stockValue = v.stok ?? v.stock ?? 0;            │
│  → Cek v.stok dulu (dapat 50) ✅                       │
│                                                         │
│  Insert ke database:                                    │
│  - stok: 50   (kolom lama)                             │
│  - stock: 50  (kolom baru)                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE TRIGGER                       │
│                                                         │
│  sync_product_variations_fields()                       │
│  → Auto sync stok <-> stock                            │
│  → Pastikan kedua kolom selalu sama                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                DATABASE (Supabase)                      │
│                                                         │
│  product_variations table:                              │
│  ┌──────────────┬───────┬───────┐                      │
│  │ nama_variasi │ stok  │ stock │                      │
│  ├──────────────┼───────┼───────┤                      │
│  │ Ukuran S     │  50   │  50   │  ← Tersimpan! ✅    │
│  └──────────────┴───────┴───────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Perbandingan Before/After

### **BEFORE FIX:**
```typescript
// Code mencari v.stock (undefined dari form)
stok: v.stock ?? 0,    // → 0 ❌
stock: v.stock ?? 0,   // → 0 ❌

Database:
stok = 0 ❌
stock = 0 ❌
```

### **AFTER FIX:**
```typescript
// Code cek v.stok dulu (ada nilai dari form)
const stockValue = v.stok ?? v.stock ?? 0;  // → 50 ✅
stok: stockValue,      // → 50 ✅
stock: stockValue,     // → 50 ✅

Database:
stok = 50 ✅
stock = 50 ✅
```

---

## 🆘 Troubleshooting

### ❌ Stok masih 0 setelah update code

**Solusi:**
1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Clear browser cache:**
   - Tekan `Ctrl + Shift + R` di halaman admin

3. **Cek apakah code sudah terupdate:**
   ```bash
   git pull origin main
   ```

### ❌ Stok berbeda antara stok dan stock di database

**Solusi:**
1. **Jalankan query sync di Supabase:**
   ```sql
   UPDATE product_variations
   SET stock = stok
   WHERE stock != stok OR stock IS NULL;
   ```

2. **Pastikan trigger masih aktif:**
   ```sql
   SELECT tgname FROM pg_trigger 
   WHERE tgrelid = 'product_variations'::regclass;
   ```
   
   Should show: `sync_product_variations_trigger`

### ❌ Stok Total tidak sesuai

**Solusi:**
Stok Total adalah computed value dari sum semua variasi.

**Verifikasi:**
```sql
SELECT 
  p.judul,
  SUM(pv.stok) as stok_total,
  p.stok_total as displayed_stok_total
FROM products p
LEFT JOIN product_variations pv ON p.id = pv.product_id
GROUP BY p.id, p.judul, p.stok_total;
```

**Note:** `stok_total` di tabel products adalah legacy field dan mungkin tidak akurat. Yang benar adalah sum dari variasi.

---

## 🎯 Summary

### **Root Cause:**
Field mismatch antara form (`stok`) dan backend (`stock`)

### **Fix Applied:**
```typescript
// Flexible field handling dengan prioritas
const stockValue = v.stok ?? v.stock ?? 0;
const nameValue = v.nama_variasi || v.name || 'Default Variation';
```

### **Benefits:**
- ✅ Support form lama (field `stok`)
- ✅ Support schema baru (field `stock`)
- ✅ Backward compatibility
- ✅ Forward compatibility
- ✅ Auto-sync via trigger
- ✅ No breaking changes

---

## 📝 Files Changed

1. **`lib/services/products.ts`**
   - createProduct() → Handle both stok/stock fields
   - updateProduct() → Handle both stok/stock fields
   - Flexible field mapping

---

## ✅ Verification Checklist

Setelah pull latest code, pastikan:

- [ ] Git pull latest: `git pull origin main`
- [ ] Restart server: `npm run dev`
- [ ] Clear browser cache: `Ctrl + Shift + R`
- [ ] Test buat produk baru dengan stok
- [ ] Test edit produk dan ubah stok
- [ ] Verifikasi di database: stok dan stock sama
- [ ] Check stok total = sum dari semua variasi

---

## 🎉 Result

Sekarang Anda bisa:
- ✅ Input stok saat buat produk → Tersimpan dengan benar
- ✅ Edit stok produk existing → Terupdate dengan benar
- ✅ Stok bertambah/berkurang sesuai input
- ✅ Data konsisten antara kolom lama dan baru
- ✅ Auto-sync tetap berfungsi

**Stok sekarang terupdate dengan sempurna!** 🎊
