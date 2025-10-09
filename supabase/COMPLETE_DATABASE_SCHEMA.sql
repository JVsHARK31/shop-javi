-- ================================================
-- COMPLETE DATABASE SCHEMA FOR JAVIER_SHARK006 SHOP
-- Updated schema sesuai requirement lengkap
-- ================================================

-- Drop existing tables if needed (use with caution in production)
-- DROP TABLE IF EXISTS public.wa_order_intents CASCADE;
-- DROP TABLE IF EXISTS public.product_categories CASCADE;
-- DROP TABLE IF EXISTS public.product_variations CASCADE;
-- DROP TABLE IF EXISTS public.product_images CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;

-- ====================
-- 1. PRODUCTS TABLE
-- ====================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(12,0) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index untuk performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(published);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ====================
-- 2. PRODUCT IMAGES TABLE
-- Maksimal 4 gambar per produk
-- ====================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON public.product_images(product_id, sort_order);

-- ====================
-- 3. PRODUCT VARIATIONS TABLE
-- ====================
CREATE TABLE IF NOT EXISTS public.product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price_override NUMERIC(12,0) CHECK (price_override IS NULL OR price_override >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_variations_product_id ON public.product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_variations_sort ON public.product_variations(product_id, sort_order);

-- ====================
-- 4. CATEGORIES TABLE
-- ====================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ====================
-- 5. PRODUCT CATEGORIES (Many-to-Many)
-- ====================
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (product_id, category_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON public.product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON public.product_categories(category_id);

-- ====================
-- 6. WHATSAPP ORDER INTENTS
-- Log semua niat order via WhatsApp
-- ====================
CREATE TABLE IF NOT EXISTS public.wa_order_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variation_id UUID REFERENCES public.product_variations(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_wa_intents_created ON public.wa_order_intents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_intents_product ON public.wa_order_intents(product_id);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_order_intents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "pub_read_products" ON public.products;
DROP POLICY IF EXISTS "pub_read_images" ON public.product_images;
DROP POLICY IF EXISTS "pub_read_variations" ON public.product_variations;
DROP POLICY IF EXISTS "pub_read_categories" ON public.categories;
DROP POLICY IF EXISTS "pub_read_product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "pub_insert_wa_intents" ON public.wa_order_intents;

-- Public read policies (hanya untuk data published)
CREATE POLICY "pub_read_products"
  ON public.products FOR SELECT
  USING (published = true);

CREATE POLICY "pub_read_images"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p 
      WHERE p.id = product_id AND p.published = true
    )
  );

CREATE POLICY "pub_read_variations"
  ON public.product_variations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p 
      WHERE p.id = product_id AND p.published = true
    )
  );

CREATE POLICY "pub_read_categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "pub_read_product_categories"
  ON public.product_categories FOR SELECT
  USING (true);

-- Allow anonymous users to insert WA order intents
CREATE POLICY "pub_insert_wa_intents"
  ON public.wa_order_intents FOR INSERT
  WITH CHECK (true);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- 1. Update timestamp on products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Enforce maksimal 4 gambar per produk
CREATE OR REPLACE FUNCTION enforce_max_4_images()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.product_images WHERE product_id = NEW.product_id) >= 4 THEN
    RAISE EXCEPTION 'Maksimum 4 gambar per produk';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_max_4_images ON public.product_images;
CREATE TRIGGER trg_max_4_images
  BEFORE INSERT ON public.product_images
  FOR EACH ROW
  EXECUTE FUNCTION enforce_max_4_images();

-- 3. Auto-set primary image if none exists
CREATE OR REPLACE FUNCTION auto_set_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is the first image for the product, make it primary
  IF NOT EXISTS (
    SELECT 1 FROM public.product_images 
    WHERE product_id = NEW.product_id AND id != NEW.id
  ) THEN
    NEW.is_primary = true;
  END IF;
  
  -- If setting as primary, unset others
  IF NEW.is_primary = true THEN
    UPDATE public.product_images
    SET is_primary = false
    WHERE product_id = NEW.product_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_primary_image ON public.product_images;
CREATE TRIGGER trg_auto_primary_image
  BEFORE INSERT OR UPDATE ON public.product_images
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_primary_image();

-- ================================================
-- STORAGE BUCKET SETUP
-- ================================================

-- Create product-images bucket (run this in Supabase Dashboard SQL Editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket
-- CREATE POLICY "Public read product images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'product-images');

-- CREATE POLICY "Authenticated users can upload product images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can update product images"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can delete product images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================

-- Insert sample category
-- INSERT INTO public.categories (name, slug, description) VALUES
-- ('Template Design', 'template-design', 'Template untuk desain grafis dan web'),
-- ('E-book', 'ebook', 'Buku elektronik dan panduan digital'),
-- ('Preset', 'preset', 'Preset untuk editing foto dan video')
-- ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- NOTES & REMINDERS
-- ================================================

/*
IMPORTANT REMINDERS:
1. Storage bucket 'product-images' harus dibuat manual di Supabase Dashboard
2. Service Role Key diperlukan untuk admin operations
3. Maksimal 4 gambar per produk divalidasi di trigger & aplikasi
4. RLS policies memastikan public hanya bisa read published products
5. WA order intents bisa diinsert oleh anonymous users
6. Admin operations harus menggunakan service role key di server-side

ENVIRONMENT VARIABLES NEEDED:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-side only)
*/
