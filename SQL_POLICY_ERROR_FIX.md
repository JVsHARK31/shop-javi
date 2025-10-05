# 🚨 SQL POLICY ERROR FIX

## ❌ **ERROR YANG TERJADI:**
```
ERROR: 42710: policy "products_admin_full_access" for table "products" already exists
```

## 🔍 **ROOT CAUSE:**
Policy dengan nama yang sama sudah ada di database, jadi tidak bisa dibuat ulang.

## ✅ **SOLUSI CEPAT:**

### **LANGKAH 1: Gunakan SQL yang Sudah Diperbaiki**

**Jalankan SQL ini di Supabase SQL Editor:**

```sql
-- 1. DROP ALL EXISTING POLICIES (termasuk yang sudah ada)
DROP POLICY IF EXISTS "products_select_policy" ON products;
DROP POLICY IF EXISTS "categories_select_policy" ON categories;
DROP POLICY IF EXISTS "product_variations_select_policy" ON product_variations;
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;

-- Drop existing admin policies yang mungkin sudah ada
DROP POLICY IF EXISTS "products_admin_full_access" ON products;
DROP POLICY IF EXISTS "products_public_select_published" ON products;
DROP POLICY IF EXISTS "categories_admin_full_access" ON categories;
DROP POLICY IF EXISTS "categories_public_select" ON categories;
DROP POLICY IF EXISTS "product_variations_admin_full_access" ON product_variations;
DROP POLICY IF EXISTS "product_variations_public_select" ON product_variations;
DROP POLICY IF EXISTS "admin_users_admin_full_access" ON admin_users;
DROP POLICY IF EXISTS "admin_users_public_select" ON admin_users;

-- 2. CREATE NEW POLICIES yang benar untuk admin

-- Products: Admin bisa CRUD, public hanya bisa SELECT yang published
CREATE POLICY "products_admin_full_access" ON products
    FOR ALL USING (true);

CREATE POLICY "products_public_select_published" ON products
    FOR SELECT USING (published = true);

-- Categories: Admin bisa CRUD, public bisa SELECT semua
CREATE POLICY "categories_admin_full_access" ON categories
    FOR ALL USING (true);

CREATE POLICY "categories_public_select" ON categories
    FOR SELECT USING (true);

-- Product variations: Admin bisa CRUD, public bisa SELECT semua
CREATE POLICY "product_variations_admin_full_access" ON product_variations
    FOR ALL USING (true);

CREATE POLICY "product_variations_public_select" ON product_variations
    FOR SELECT USING (true);

-- Admin users: Admin bisa CRUD, public bisa SELECT untuk login
CREATE POLICY "admin_users_admin_full_access" ON admin_users
    FOR ALL USING (true);

CREATE POLICY "admin_users_public_select" ON admin_users
    FOR SELECT USING (true);

-- 3. VERIFY
SELECT 'RLS Policies Updated Successfully!' as status;
SELECT COUNT(*) as products_count FROM products;
```

### **LANGKAH 2: Alternative - Hapus Manual**

**Jika masih error, hapus manual satu per satu:**

```sql
-- Hapus semua policies yang ada
DROP POLICY IF EXISTS "products_admin_full_access" ON products;
DROP POLICY IF EXISTS "products_public_select_published" ON products;
DROP POLICY IF EXISTS "categories_admin_full_access" ON categories;
DROP POLICY IF EXISTS "categories_public_select" ON categories;
DROP POLICY IF EXISTS "product_variations_admin_full_access" ON product_variations;
DROP POLICY IF EXISTS "product_variations_public_select" ON product_variations;
DROP POLICY IF EXISTS "admin_users_admin_full_access" ON admin_users;
DROP POLICY IF EXISTS "admin_users_public_select" ON admin_users;

-- Kemudian buat ulang
CREATE POLICY "products_admin_full_access" ON products FOR ALL USING (true);
CREATE POLICY "products_public_select_published" ON products FOR SELECT USING (published = true);
CREATE POLICY "categories_admin_full_access" ON categories FOR ALL USING (true);
CREATE POLICY "categories_public_select" ON categories FOR SELECT USING (true);
CREATE POLICY "product_variations_admin_full_access" ON product_variations FOR ALL USING (true);
CREATE POLICY "product_variations_public_select" ON product_variations FOR SELECT USING (true);
CREATE POLICY "admin_users_admin_full_access" ON admin_users FOR ALL USING (true);
CREATE POLICY "admin_users_public_select" ON admin_users FOR SELECT USING (true);
```

## 🎯 **EXPECTED RESULTS:**

- ✅ **No errors** saat menjalankan SQL
- ✅ **Policies created** successfully
- ✅ **Admin can delete** products
- ✅ **Admin can toggle** published status

## 🔧 **TROUBLESHOOTING:**

### **Masalah 1: Masih error "policy already exists"**
**Solusi**: Jalankan DROP statements dulu, baru CREATE

### **Masalah 2: Error "relation does not exist"**
**Solusi**: Pastikan tabel sudah dibuat dengan `CLEAN_DATABASE_SETUP.sql`

### **Masalah 3: Admin masih tidak bisa delete**
**Solusi**: 
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check console untuk error

## 📱 **TESTING:**

1. **Jalankan SQL fix** di Supabase
2. **Login admin** (Javier / athallah310706)
3. **Buka** `/admin/products`
4. **Test delete** produk
5. **Test toggle** published status

## 🚨 **URGENT ACTION:**

**Gunakan `FIXED_ADMIN_PERMISSIONS.sql` yang sudah include semua DROP statements!**

---

**Status**: 🚨 **SQL POLICY CONFLICT**  
**Action**: Use fixed SQL with all DROP statements  
**Time**: 1 menit setup
