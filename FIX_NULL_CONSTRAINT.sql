-- ============================================
-- FIX: NULL VALUE ERROR di nama_variasi
-- Copy dan paste script ini ke Supabase SQL Editor
-- ============================================

-- STEP 1: Hapus NOT NULL constraint dari nama_variasi dan stok
-- Ini memungkinkan kolom lama menjadi nullable
ALTER TABLE product_variations 
ALTER COLUMN nama_variasi DROP NOT NULL;

ALTER TABLE product_variations 
ALTER COLUMN stok DROP NOT NULL;

-- STEP 2: Update trigger untuk handle INSERT dengan benar
-- Pastikan ketika insert dengan 'name', otomatis isi 'nama_variasi'
CREATE OR REPLACE FUNCTION sync_product_variations_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- HANDLE INSERT
  IF TG_OP = 'INSERT' THEN
    -- Sync name <-> nama_variasi
    IF NEW.name IS NOT NULL AND NEW.name != '' THEN
      NEW.nama_variasi := NEW.name;
    ELSIF NEW.nama_variasi IS NOT NULL AND NEW.nama_variasi != '' THEN
      NEW.name := NEW.nama_variasi;
    ELSIF NEW.name IS NULL AND NEW.nama_variasi IS NULL THEN
      -- Jika kedua NULL, set default
      NEW.name := 'Default Variation';
      NEW.nama_variasi := 'Default Variation';
    END IF;
    
    -- Sync stock <-> stok
    IF NEW.stock IS NOT NULL THEN
      NEW.stok := NEW.stock;
    ELSIF NEW.stok IS NOT NULL THEN
      NEW.stock := NEW.stok;
    ELSE
      -- Default stock jika kedua NULL
      NEW.stock := 0;
      NEW.stok := 0;
    END IF;
  END IF;
  
  -- HANDLE UPDATE
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

-- STEP 3: Re-create trigger
DROP TRIGGER IF EXISTS sync_product_variations_trigger ON product_variations;
CREATE TRIGGER sync_product_variations_trigger
  BEFORE INSERT OR UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION sync_product_variations_fields();

-- STEP 4: Set default value untuk kolom lama (optional)
ALTER TABLE product_variations 
ALTER COLUMN nama_variasi SET DEFAULT 'Default Variation';

ALTER TABLE product_variations 
ALTER COLUMN stok SET DEFAULT 0;

-- STEP 5: Update existing NULL values (jika ada)
UPDATE product_variations 
SET nama_variasi = 'Default Variation'
WHERE nama_variasi IS NULL OR nama_variasi = '';

UPDATE product_variations 
SET stok = 0
WHERE stok IS NULL;

-- STEP 6: Verifikasi perubahan
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_variations' 
  AND column_name IN ('nama_variasi', 'name', 'stok', 'stock', 'price', 'price_override')
ORDER BY ordinal_position;

-- STEP 7: Test INSERT - uncomment untuk test
/*
INSERT INTO product_variations (product_id, name, stock, price, is_default, sort_order)
VALUES (
  (SELECT id FROM products LIMIT 1),
  'Test Variation',
  10,
  50000,
  false,
  0
)
RETURNING *;
*/
