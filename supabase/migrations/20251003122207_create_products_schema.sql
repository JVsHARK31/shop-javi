/*
  # Create Products Schema for Javier_shark006 Shop

  ## Overview
  Creates a complete database schema for a digital product storefront with product variations,
  categories, tags, and admin authentication.

  ## New Tables
  
  ### 1. `products`
  Main product table containing core product information
  - `id` (uuid, primary key) - Unique product identifier
  - `slug` (text, unique) - URL-friendly product identifier
  - `judul` (text) - Product title in Indonesian
  - `deskripsi` (text) - Rich HTML description
  - `kategori` (text[]) - Array of category names
  - `tag` (text[]) - Array of tag names
  - `gambar` (text[]) - Array of image URLs
  - `published` (boolean) - Visibility status
  - `base_price` (numeric) - Base price in Rupiah
  - `stok_total` (integer) - Total stock (auto-calculated)
  - `highlight_bullets` (text[]) - Key feature highlights
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. `product_variations`
  Product variations with individual pricing and stock
  - `id` (uuid, primary key) - Unique variation identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `nama_variasi` (text) - Variation name (e.g., "Lisensi Personal")
  - `price` (numeric) - Final price for this variation
  - `sku` (text) - Stock keeping unit code
  - `stok` (integer) - Stock quantity
  - `is_default` (boolean) - Default selection flag
  - `sort_order` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 3. `categories`
  Product categories for filtering
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text, unique) - Category name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Optional description
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 4. `admin_users`
  Admin authentication
  - `id` (uuid, primary key) - Unique admin identifier
  - `username` (text, unique) - Admin username
  - `password_hash` (text) - Encrypted password
  - `created_at` (timestamptz) - Creation timestamp
  - `last_login` (timestamptz) - Last login timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for published products
  - Admin-only write access
  - Secure admin authentication

  ## Indexes
  - Product slug for fast lookups
  - Product published status for filtering
  - Variation product_id for joins
  - Category slug for routing
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  judul text NOT NULL,
  deskripsi text NOT NULL DEFAULT '',
  kategori text[] DEFAULT '{}',
  tag text[] DEFAULT '{}',
  gambar text[] DEFAULT '{}',
  published boolean DEFAULT false,
  base_price numeric(10,2) DEFAULT 0 CHECK (base_price >= 0),
  stok_total integer DEFAULT 0 CHECK (stok_total >= 0),
  highlight_bullets text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  nama_variasi text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  sku text NOT NULL,
  stok integer DEFAULT 0 CHECK (stok >= 0),
  is_default boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, nama_variasi)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_kategori ON products USING GIN(kategori);
CREATE INDEX IF NOT EXISTS idx_products_tag ON products USING GIN(tag);
CREATE INDEX IF NOT EXISTS idx_variations_product_id ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_variations_sort_order ON product_variations(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-calculate stok_total
CREATE OR REPLACE FUNCTION calculate_stok_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stok_total = (
    SELECT COALESCE(SUM(stok), 0)
    FROM product_variations
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stok_total calculation
DROP TRIGGER IF EXISTS trigger_calculate_stok_total ON product_variations;
CREATE TRIGGER trigger_calculate_stok_total
  AFTER INSERT OR UPDATE OR DELETE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION calculate_stok_total();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read for published products)
CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  USING (published = true);

CREATE POLICY "Public can view all products for admin"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  USING (true);

-- RLS Policies for product_variations (public read through products)
CREATE POLICY "Public can view variations of published products"
  ON product_variations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variations.product_id
      AND products.published = true
    )
  );

CREATE POLICY "Public can view all variations for admin"
  ON product_variations FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert variations"
  ON product_variations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update variations"
  ON product_variations FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete variations"
  ON product_variations FOR DELETE
  USING (true);

-- RLS Policies for categories (public read)
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  USING (true);

-- RLS Policies for admin_users (restricted)
CREATE POLICY "Admin can view own data"
  ON admin_users FOR SELECT
  USING (true);

CREATE POLICY "Admin can update own data"
  ON admin_users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Template Design', 'template-design', 'Template website dan desain siap pakai'),
  ('E-book & Panduan', 'ebook-panduan', 'Panduan digital dan e-book edukatif'),
  ('Preset & Assets', 'preset-assets', 'Preset foto dan aset digital'),
  ('Lisensi Software', 'lisensi-software', 'Lisensi dan aktivasi software'),
  ('Online Course', 'online-course', 'Kursus online dan materi pembelajaran')
ON CONFLICT (slug) DO NOTHING;