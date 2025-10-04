# Panduan Deployment ke Vercel

## Langkah-langkah Deployment

### 1. Persiapan Repository
- Pastikan semua kode sudah di-commit ke GitHub
- Repository harus public atau Anda memiliki akses Vercel Pro

### 2. Setup di Vercel Dashboard
1. Masuk ke [vercel.com](https://vercel.com)
2. Klik "New Project"
3. Import repository GitHub Anda
4. Pilih framework: Next.js
5. Klik "Deploy"

### 3. Environment Variables
Tambahkan environment variables berikut di Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Konfigurasi Build
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 5. Domain Custom (Opsional)
- Di Settings > Domains
- Tambahkan domain custom Anda
- Update DNS records sesuai instruksi

## Troubleshooting

### Build Error
- Pastikan environment variables sudah di-set
- Check log build di Vercel dashboard
- Pastikan semua dependencies terinstall

### Runtime Error
- Check function logs di Vercel dashboard
- Pastikan Supabase connection berfungsi
- Verify database permissions

### Image Loading Issues
- Pastikan image URLs valid
- Check CORS settings di Supabase
- Verify image domain whitelist

## Fitur yang Sudah Dioptimasi
- ✅ Static generation untuk halaman admin
- ✅ Client-side rendering untuk halaman dinamis
- ✅ Image optimization
- ✅ Security headers
- ✅ Error handling
- ✅ Fallback untuk missing environment variables

## Monitoring
- Gunakan Vercel Analytics untuk monitoring
- Check function logs secara berkala
- Monitor Supabase usage dan limits
