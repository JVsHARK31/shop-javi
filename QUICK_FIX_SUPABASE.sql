-- ============================================
-- QUICK FIX untuk Supabase SQL Editor
-- Copy dan paste script ini ke Supabase SQL Editor
-- ============================================

-- 1. Tambahkan kolom price_override
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS price_override DECIMAL(10,2) DEFAULT NULL;

-- 2. Tambahkan kolom name (mirror dari nama_variasi)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- 3. Tambahkan kolom stock (mirror dari stok)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 4. Migrate data dari kolom lama ke kolom baru
UPDATE product_variations 
SET 
  name = COALESCE(name, nama_variasi),
  stock = COALESCE(stock, stok);

-- 5. Buat trigger untuk auto-sync kedua kolom
CREATE OR REPLACE FUNCTION sync_product_variations_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT: Set default values if not provided
  IF TG_OP = 'INSERT' THEN
    -- Sync name <-> nama_variasi
    IF NEW.name IS NOT NULL THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS NOT NULL THEN
      NEW.name := NEW.nama_variasi;
    END IF;
    
    -- Sync stock <-> stok
    IF NEW.stock IS NOT NULL THEN
      NEW.stok := NEW.stock;
    ELSIF NEW.stok IS NOT NULL THEN
      NEW.stock := NEW.stok;
    ELSE
      NEW.stock := 0;
      NEW.stok := 0;
    END IF;
  END IF;
  
  -- UPDATE: Sync whichever field was changed
  IF TG_OP = 'UPDATE' THEN
    -- Sync name <-> nama_variasi
    IF NEW.name IS DISTINCT FROM OLD.name THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS DISTINCT FROM OLD.nama_variasi THEN
      NEW.name := NEW.nama_variasi;
    END IF;
    
    -- Sync stock <-> stok
    IF NEW.stock IS DISTINCT FROM OLD.stock THEN
      NEW.stok := NEW.stock;
    ELSIF NEW.stok IS DISTINCT FROM OLD.stok THEN
      NEW.stock := NEW.stok;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Buat trigger
DROP TRIGGER IF EXISTS sync_product_variations_trigger ON product_variations;
CREATE TRIGGER sync_product_variations_trigger
  BEFORE INSERT OR UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION sync_product_variations_fields();

-- 7. Verifikasi perubahan
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_variations' 
  AND column_name IN ('nama_variasi', 'name', 'stok', 'stock', 'price_override', 'price')
ORDER BY ordinal_position;

-- 8. Test data - pastikan sync bekerja
-- UPDATE product_variations SET name = 'Test Variation' WHERE id = (SELECT id FROM product_variations LIMIT 1);
-- SELECT nama_variasi, name, stok, stock FROM product_variations LIMIT 5;
