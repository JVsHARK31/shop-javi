import { z } from 'zod';

export const productVariationSchema = z.object({
  id: z.string().optional(),
  nama_variasi: z.string().min(1, 'Nama variasi harus diisi'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  sku: z.string().min(1, 'SKU harus diisi'),
  stok: z.number().int().min(0, 'Stok tidak boleh negatif'),
  is_default: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, 'Slug harus diisi'),
  judul: z.string().min(1, 'Judul produk harus diisi'),
  deskripsi: z.string().min(1, 'Deskripsi harus diisi'),
  kategori: z.array(z.string()).default([]),
  tag: z.array(z.string()).default([]),
  gambar: z.array(z.string()).min(1, 'Minimal 1 gambar harus diupload'),
  published: z.boolean().default(false),
  base_price: z.number().min(0, 'Harga tidak boleh negatif'),
  highlight_bullets: z.array(z.string()).default([]),
  variations: z.array(productVariationSchema).min(1, 'Minimal 1 variasi harus ada'),
}).refine((data) => {
  const defaultVariations = data.variations.filter(v => v.is_default);
  return defaultVariations.length === 1;
}, {
  message: 'Harus ada tepat 1 variasi sebagai default',
  path: ['variations'],
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nama kategori harus diisi'),
  slug: z.string().min(1, 'Slug harus diisi'),
  description: z.string().default(''),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

export const orderSchema = z.object({
  variationId: z.string().min(1, 'Pilih variasi produk'),
  quantity: z.number().int().min(1, 'Jumlah minimal 1'),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariationFormData = z.infer<typeof productVariationSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
