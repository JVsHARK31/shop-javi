import { createProduct } from './services/products';

const DEMO_PRODUCTS = [
  {
    slug: 'template-website-ecommerce',
    judul: 'Template Website E-commerce',
    deskripsi: `
      <h2>Template Website E-commerce Premium</h2>
      <p>Template website e-commerce modern dan responsif yang siap pakai. Dilengkapi dengan fitur-fitur lengkap untuk membangun toko online profesional Anda.</p>

      <h3>Fitur Utama:</h3>
      <ul>
        <li>Desain modern dan responsif</li>
        <li>Halaman produk lengkap dengan variasi</li>
        <li>Keranjang belanja dan checkout</li>
        <li>Dashboard admin</li>
        <li>Integrasi payment gateway ready</li>
        <li>SEO optimized</li>
      </ul>

      <h3>Teknologi:</h3>
      <p>Built with React, Next.js, Tailwind CSS, dan Supabase</p>

      <h3>Yang Anda Dapatkan:</h3>
      <ul>
        <li>Source code lengkap</li>
        <li>Dokumentasi instalasi</li>
        <li>File Figma design (untuk lisensi komersial)</li>
        <li>Update gratis selama 6 bulan</li>
      </ul>
    `,
    kategori: ['Template Design'],
    tag: ['Website', 'E-commerce', 'Next.js', 'React'],
    gambar: [
      'https://images.pexels.com/photos/7974/pexels-photo.jpg',
      'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg',
      'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg',
      'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
      'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
    ],
    published: true,
    base_price: 150000,
    highlight_bullets: [
      'Desain modern dan profesional',
      'Fully responsive untuk semua device',
      'Source code lengkap dengan dokumentasi',
      'Mudah dikustomisasi',
      'Support untuk multiple payment gateway',
    ],
    variations: [
      {
        nama_variasi: 'Lisensi Personal',
        price: 150000,
        sku: 'TPL-ECOM-PERS',
        stok: 999,
        is_default: true,
        sort_order: 0,
      },
      {
        nama_variasi: 'Lisensi Komersial',
        price: 300000,
        sku: 'TPL-ECOM-COM',
        stok: 999,
        is_default: false,
        sort_order: 1,
      },
    ],
  },
  {
    slug: 'ebook-panduan-digital-marketing',
    judul: 'E-book Panduan Digital Marketing',
    deskripsi: `
      <h2>Panduan Lengkap Digital Marketing untuk Pemula hingga Mahir</h2>
      <p>E-book komprehensif yang membahas strategi digital marketing dari A sampai Z. Cocok untuk pemula yang ingin belajar atau profesional yang ingin upgrade skill.</p>

      <h3>Isi E-book:</h3>
      <ul>
        <li>Fundamental Digital Marketing (30 halaman)</li>
        <li>Social Media Marketing Strategy (40 halaman)</li>
        <li>Content Marketing & SEO (35 halaman)</li>
        <li>Email Marketing yang Efektif (25 halaman)</li>
        <li>Paid Advertising (Google Ads & Facebook Ads) (45 halaman)</li>
        <li>Analytics & Measurement (20 halaman)</li>
        <li>Case Studies & Template (15 halaman)</li>
      </ul>

      <h3>Bonus (Paket PDF + Video):</h3>
      <ul>
        <li>10 video tutorial praktikal (total 3 jam)</li>
        <li>Template content calendar</li>
        <li>Checklist campaign</li>
        <li>Access ke private Facebook group</li>
      </ul>

      <h3>Format:</h3>
      <p>PDF 210 halaman, full color, dengan ilustrasi dan infografis</p>
    `,
    kategori: ['E-book & Panduan'],
    tag: ['Digital Marketing', 'E-book', 'Marketing', 'SEO', 'Social Media'],
    gambar: [
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
      'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg',
    ],
    published: true,
    base_price: 75000,
    highlight_bullets: [
      '210 halaman panduan lengkap',
      'Dari fundamental sampai advanced',
      'Case studies real world',
      'Template dan checklist siap pakai',
      'Bonus video tutorial (paket lengkap)',
    ],
    variations: [
      {
        nama_variasi: 'PDF Only',
        price: 75000,
        sku: 'EBOOK-DM-PDF',
        stok: 999,
        is_default: true,
        sort_order: 0,
      },
      {
        nama_variasi: 'PDF + Video Tutorial',
        price: 125000,
        sku: 'EBOOK-DM-FULL',
        stok: 999,
        is_default: false,
        sort_order: 1,
      },
    ],
  },
  {
    slug: 'preset-lightroom-mobile',
    judul: 'Preset Lightroom Mobile',
    deskripsi: `
      <h2>Koleksi Preset Lightroom Mobile Premium</h2>
      <p>Kumpulan preset Lightroom Mobile profesional untuk berbagai jenis foto. Sempurnakan foto Instagram, feed bisnis, atau portfolio Anda dengan 1 tap!</p>

      <h3>Kategori Preset:</h3>
      <ul>
        <li><strong>Portrait & Selfie</strong> - 10 preset untuk foto wajah</li>
        <li><strong>Food & Product</strong> - 8 preset untuk produk dan kuliner</li>
        <li><strong>Landscape</strong> - 12 preset untuk pemandangan</li>
        <li><strong>Urban & Street</strong> - 10 preset untuk fotografi jalanan</li>
        <li><strong>Moody & Cinematic</strong> - 10 preset untuk tone dramatis</li>
      </ul>

      <h3>Paket:</h3>
      <ul>
        <li><strong>Basic:</strong> 20 preset pilihan terbaik</li>
        <li><strong>Pro:</strong> 50 preset dari semua kategori</li>
        <li><strong>Ultimate:</strong> 80+ preset + bonus filter vintage & 10 video tutorial editing</li>
      </ul>

      <h3>Kompatibilitas:</h3>
      <p>Lightroom Mobile (iOS & Android), Lightroom Desktop</p>

      <h3>Format File:</h3>
      <p>DNG (preset) + PDF panduan instalasi bahasa Indonesia</p>
    `,
    kategori: ['Preset & Assets'],
    tag: ['Lightroom', 'Preset', 'Fotografi', 'Mobile', 'Instagram'],
    gambar: [
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
      'https://images.pexels.com/photos/1483351/pexels-photo-1483351.jpeg',
      'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg',
      'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg',
    ],
    published: true,
    base_price: 50000,
    highlight_bullets: [
      'Preset profesional untuk berbagai jenis foto',
      'Mudah digunakan, 1-tap editing',
      'Kompatibel iOS & Android',
      'Panduan instalasi lengkap',
      'Free update preset baru',
    ],
    variations: [
      {
        nama_variasi: 'Paket Basic',
        price: 50000,
        sku: 'PRESET-LR-BASIC',
        stok: 999,
        is_default: true,
        sort_order: 0,
      },
      {
        nama_variasi: 'Paket Pro',
        price: 100000,
        sku: 'PRESET-LR-PRO',
        stok: 999,
        is_default: false,
        sort_order: 1,
      },
      {
        nama_variasi: 'Paket Ultimate',
        price: 150000,
        sku: 'PRESET-LR-ULT',
        stok: 999,
        is_default: false,
        sort_order: 2,
      },
    ],
  },
];

export async function seedDemoProducts() {
  console.log('Seeding demo products...');

  for (const product of DEMO_PRODUCTS) {
    try {
      await createProduct(product as any);
      console.log(`✓ Created: ${product.judul}`);
    } catch (error) {
      console.error(`✗ Failed to create ${product.judul}:`, error);
    }
  }

  console.log('Seeding completed!');
}
