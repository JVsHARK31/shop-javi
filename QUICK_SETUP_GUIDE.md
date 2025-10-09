# 🚀 QUICK SETUP GUIDE - JAVIER_SHARK006 SHOP

Panduan cepat untuk setup dan menjalankan aplikasi.

## ⚡ QUICK START (5 Menit)

### 1. Clone & Install
```bash
cd Javier_Shark006
npm install
```

### 2. Setup Environment
Edit file `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gmcwmguddghztvwhfesp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_WHATSAPP_NUMBER=6288290286954
```

**Cara dapat Service Role Key**:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Settings → API
4. Copy `service_role` key (jangan yang anon!)

### 3. Setup Database
1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `supabase/COMPLETE_DATABASE_SCHEMA.sql`
3. Paste dan Run

### 4. Setup Storage Bucket
1. Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `product-images`
4. Public: ✅ YES
5. Click Create

### 5. Run Development Server
```bash
npm run dev
```

Buka: http://localhost:3000

## 🔑 LOGIN ADMIN

```
URL: http://localhost:3000/admin/login

Username: Javier
Password: athallah310706
```

## ✅ VERIFIKASI SETUP

### Test 1: Homepage
- [ ] Homepage terbuka tanpa error
- [ ] Header tampil dengan logo dan tombol Admin
- [ ] Search bar berfungsi

### Test 2: Admin Login  
- [ ] Buka `/admin/login`
- [ ] Login dengan credentials di atas
- [ ] Redirect ke dashboard

### Test 3: Tambah Produk
- [ ] Dashboard → Produk → Tambah Produk
- [ ] Upload 1-4 gambar (test validasi maksimal 4)
- [ ] Tambah variasi dengan harga dan stok
- [ ] Save → Produk muncul di list

### Test 4: Order WhatsApp
- [ ] Buka produk di storefront
- [ ] Pilih variasi
- [ ] Klik "Pesan via WhatsApp"
- [ ] WhatsApp terbuka dengan pesan terformat
- [ ] Check database `wa_order_intents` untuk log

## 🐛 TROUBLESHOOTING

### Error: "Bucket not found"
**Solusi**: Buat storage bucket `product-images` di Supabase Dashboard

### Error: "insufficient_privilege"
**Solusi**: 
1. Pastikan database schema sudah dijalankan
2. Check RLS policies di Supabase → Authentication → Policies

### Error: "Username atau password salah"
**Solusi**: Pastikan menggunakan credentials yang benar:
- Username: `Javier` (case-sensitive)
- Password: `athallah310706`

### Gambar tidak bisa diupload
**Solusi**:
1. Check storage bucket sudah dibuat
2. Check bucket adalah public
3. Check file size < 5MB
4. Check format: JPEG, PNG, WebP, atau GIF

### WhatsApp tidak terbuka
**Solusi**:
1. Pastikan browser allow popups
2. Check nomor WhatsApp benar: `6288290286954`
3. Check format nomor (harus tanpa +, -, atau spasi)

## 📝 CHEAT SHEET

### Admin URLs
```
Login:      /admin/login
Dashboard:  /admin/dashboard
Products:   /admin/products
Categories: /admin/categories
```

### Database Tables
```sql
-- Check products
SELECT * FROM products;

-- Check WA order intents
SELECT * FROM wa_order_intents ORDER BY created_at DESC;

-- Check images count per product
SELECT product_id, COUNT(*) as image_count 
FROM product_images 
GROUP BY product_id;
```

### Environment Variables
```bash
# List all env vars
cat .env

# Test Supabase connection
curl "https://gmcwmguddghztvwhfesp.supabase.co/rest/v1/" \
  -H "apikey: YOUR_ANON_KEY"
```

## 🎯 FITUR UTAMA YANG SUDAH DIIMPLEMENTASIKAN

✅ Admin login hardcoded (Javier/athallah310706)  
✅ Maksimal 4 gambar per produk  
✅ WhatsApp order dengan logging ke database  
✅ Rentang harga untuk variasi (tanpa kata "Mulai")  
✅ Badge "Stok Habis" untuk produk tanpa stok  
✅ Responsive design (mobile-first)  
✅ Sticky header dengan burger menu  
✅ Tombol Back di halaman detail  
✅ Semua teks dalam Bahasa Indonesia  

## 📚 DOKUMENTASI LENGKAP

Untuk detail teknis lengkap, baca:
- `IMPLEMENTATION_COMPLETE.md` - Dokumentasi lengkap semua implementasi
- `COMPLETE_DATABASE_SCHEMA.sql` - Schema database dengan comments
- `README.md` - Project overview

## 🆘 BUTUH BANTUAN?

1. Check console browser untuk error
2. Check Supabase logs di Dashboard
3. Verify `.env` sudah benar
4. Pastikan database schema sudah dirun
5. Pastikan storage bucket sudah dibuat

## 🎉 SELESAI!

Jika semua step di atas berhasil, aplikasi siap digunakan!

**Next Steps**:
- Tambah produk via admin
- Test order via WhatsApp
- Customize design sesuai kebutuhan
- Deploy ke Vercel/Netlify

---

**Quick Reference**:
- Admin Login: `/admin/login`
- Username: `Javier`
- Password: `athallah310706`
- WhatsApp: `6288290286954`
- Max Images: `4 per product`

Happy coding! 🚀
