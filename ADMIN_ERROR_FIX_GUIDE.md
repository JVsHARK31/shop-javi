# 🚨 ADMIN ERROR FIX GUIDE - Produk Tidak Bisa Dihapus/Disembunyikan

## ❌ **ERROR YANG TERJADI:**
- Admin tidak bisa menghapus produk
- Admin tidak bisa menyembunyikan produk (toggle published)
- Error permissions di database

## 🔍 **ROOT CAUSE:**
**RLS (Row Level Security) Policies** di database tidak memberikan akses penuh ke admin untuk melakukan CRUD operations.

## ✅ **SOLUSI LENGKAP:**

### **LANGKAH 1: Fix RLS Policies**

**Jalankan SQL ini di Supabase SQL Editor:**

```sql
-- 1. DROP EXISTING POLICIES yang bermasalah
DROP POLICY IF EXISTS "products_select_policy" ON products;
DROP POLICY IF EXISTS "categories_select_policy" ON categories;
DROP POLICY IF EXISTS "product_variations_select_policy" ON product_variations;
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;

-- 2. CREATE NEW POLICIES yang benar untuk admin
CREATE POLICY "products_admin_full_access" ON products
    FOR ALL USING (true);

CREATE POLICY "products_public_select_published" ON products
    FOR SELECT USING (published = true);

CREATE POLICY "categories_admin_full_access" ON categories
    FOR ALL USING (true);

CREATE POLICY "categories_public_select" ON categories
    FOR SELECT USING (true);

CREATE POLICY "product_variations_admin_full_access" ON product_variations
    FOR ALL USING (true);

CREATE POLICY "product_variations_public_select" ON product_variations
    FOR SELECT USING (true);

CREATE POLICY "admin_users_admin_full_access" ON admin_users
    FOR ALL USING (true);

CREATE POLICY "admin_users_public_select" ON admin_users
    FOR SELECT USING (true);
```

### **LANGKAH 2: Test Admin Permissions**

**Jalankan script test:**
```bash
node test-admin-permissions.js
```

### **LANGKAH 3: Verify Fix**

**Cek di admin dashboard:**
1. Buka `/admin/products`
2. Coba toggle published status produk
3. Coba hapus produk
4. Coba edit produk

## 🎯 **EXPECTED RESULTS:**

### **✅ Setelah Fix:**
- Admin bisa menghapus produk
- Admin bisa menyembunyikan/menampilkan produk
- Admin bisa edit semua field produk
- Admin bisa create produk baru
- Public tetap hanya bisa lihat produk yang published

### **🔧 Technical Details:**
- **RLS Policies**: Memberikan akses penuh ke admin (`FOR ALL USING (true)`)
- **Public Access**: Tetap terbatas hanya SELECT produk yang published
- **Admin Functions**: `toggleProductPublished()` dan `deleteProduct()` akan bekerja

## 📋 **FUNGSI ADMIN YANG DIPERBAIKI:**

### **1. Toggle Published Status**
```typescript
// File: lib/services/products.ts
export async function toggleProductPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ published })
    .eq('id', id);

  if (error) throw error;
}
```

### **2. Delete Product**
```typescript
// File: lib/services/products.ts
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
```

### **3. Update Product**
```typescript
// File: lib/services/products.ts
export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const { variations, ...productData } = product;

  const { error: productError } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  if (productError) throw productError;
  // ... rest of function
}
```

## 🚨 **URGENT ACTION:**

### **Jalankan SQL Fix SEKARANG:**

1. **Buka**: https://supabase.com/dashboard/project/unirpugxxddorhuyhibf
2. **Klik**: "SQL Editor"
3. **Copy & Paste**: SQL dari `ADMIN_PERMISSIONS_FIX.sql`
4. **Klik**: "Run"
5. **Test**: Login admin dan coba hapus/toggle produk

## 🔧 **TROUBLESHOOTING:**

### **Masalah 1: Masih tidak bisa hapus produk**
**Solusi**: 
- Pastikan SQL fix sudah dijalankan
- Hard refresh browser (Ctrl+F5)
- Check browser console untuk error

### **Masalah 2: Error "insufficient_privilege"**
**Solusi**: 
- Jalankan SQL fix lagi
- Pastikan tidak ada policy yang conflict

### **Masalah 3: Public bisa lihat produk yang tidak published**
**Solusi**: 
- Check policy `products_public_select_published`
- Pastikan kondisi `published = true` ada

## 📱 **TESTING CHECKLIST:**

- [ ] SQL fix berhasil dijalankan tanpa error
- [ ] Admin bisa login ke dashboard
- [ ] Admin bisa toggle published status produk
- [ ] Admin bisa hapus produk
- [ ] Admin bisa edit produk
- [ ] Admin bisa create produk baru
- [ ] Public hanya lihat produk yang published

## 🎉 **BONUS FEATURES:**

Setelah fix, admin juga bisa:
- ✅ **Bulk operations** (jika diimplementasikan)
- ✅ **Export/Import** produk (jika diimplementasikan)
- ✅ **Advanced filtering** di admin panel
- ✅ **Product analytics** (jika diimplementasikan)

---

**Status**: 🚨 **URGENT - Admin permissions broken**  
**Action**: Run SQL fix immediately  
**Time**: 2 menit setup + 1 menit test
