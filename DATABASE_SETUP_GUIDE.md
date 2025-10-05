# 🗄️ DATABASE SETUP GUIDE - JAVIER SHARK006 SHOP

## 🚀 **SQL VERSI TERBARU - FIX SEMUA ERROR**

### 📁 **File SQL yang Tersedia:**

1. **`CLEAN_DATABASE_SETUP.sql`** - Setup database dari awal (fresh start)
2. **`QUICK_DATABASE_RESET.sql`** - Reset data lama tanpa hapus tabel
3. **`ADMIN_LOGIN_ERROR_FIX.md`** - Fix error login admin

## 🎯 **CARA PENGGUNAAN:**

### **Opsi 1: Fresh Start (Recommended)**
**Gunakan jika database masih kosong atau ingin setup ulang:**

1. Buka: https://supabase.com/dashboard/project/unirpugxxddorhuyhibf
2. Klik: "SQL Editor"
3. Copy & Paste: **`CLEAN_DATABASE_SETUP.sql`**
4. Klik: "Run"

### **Opsi 2: Quick Reset**
**Gunakan jika sudah ada tabel tapi data bermasalah:**

1. Buka: https://supabase.com/dashboard/project/unirpugxxddorhuyhibf
2. Klik: "SQL Editor"
3. Copy & Paste: **`QUICK_DATABASE_RESET.sql`**
4. Klik: "Run"

## ✅ **FITUR SQL VERSI TERBARU:**

### **🔧 Fix Error yang Sudah Diperbaiki:**
- ✅ **Duplicate key constraint** - Handle dengan DROP IF EXISTS
- ✅ **Policy conflicts** - Policy dengan nama unik
- ✅ **Admin user password** - Password yang benar
- ✅ **Data consistency** - Foreign key relationships
- ✅ **RLS policies** - Row Level Security yang benar

### **📊 Data yang Akan Dibuat:**
- **4 Categories**: Template Design, E-book & Panduan, Preset & Assets, Produk AI
- **6 Products**: Bolt AI, Lightroom Preset, E-book Marketing, Template E-commerce, Template Portfolio, Instagram Preset
- **1 Admin User**: Javier (password: athallah310706)

### **🔐 Admin Login:**
- **Username**: `Javier`
- **Password**: `athallah310706`

## 🚨 **URGENT - JALANKAN SEKARANG:**

### **Jika Error Duplicate Key:**
```sql
-- Jalankan ini dulu untuk clear data lama
DELETE FROM admin_users WHERE username = 'Javier';
INSERT INTO admin_users (username, password_hash) VALUES ('Javier', 'athallah310706');
```

### **Jika Ingin Fresh Start:**
```sql
-- Jalankan CLEAN_DATABASE_SETUP.sql lengkap
```

## 📋 **VERIFIKASI SETUP:**

Setelah SQL dijalankan, cek hasilnya:

```sql
-- Cek categories
SELECT COUNT(*) as categories_count FROM categories;

-- Cek products  
SELECT COUNT(*) as products_count FROM products;

-- Cek admin user
SELECT username FROM admin_users WHERE username = 'Javier';

-- Cek published products
SELECT slug, judul FROM products WHERE published = true;
```

## 🎉 **EXPECTED RESULTS:**

- ✅ **4 categories** created
- ✅ **6 products** created (all published)
- ✅ **1 admin user** Javier created
- ✅ **Login berfungsi** dengan kredensial yang benar
- ✅ **Website menampilkan** produk dengan benar

## 🔧 **TROUBLESHOOTING:**

### **Error: "relation does not exist"**
**Solusi**: Jalankan `CLEAN_DATABASE_SETUP.sql` untuk create tabel

### **Error: "duplicate key"**
**Solusi**: Jalankan `QUICK_DATABASE_RESET.sql` untuk clear data

### **Login masih gagal**
**Solusi**: 
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check console untuk error

## 📱 **TESTING CHECKLIST:**

- [ ] SQL berhasil dijalankan tanpa error
- [ ] Categories terlihat di website
- [ ] Products terlihat di website  
- [ ] Admin login berfungsi
- [ ] Dashboard admin bisa diakses
- [ ] Produk detail page berfungsi

---

**Status**: ✅ **SQL VERSI TERBARU SIAP**  
**Action**: Pilih salah satu SQL file dan jalankan  
**Time**: 2-3 menit setup + 1 menit test
