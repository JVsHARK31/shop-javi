-- Migration: Add missing columns to product_variations table
-- Date: 2025-01-08
-- Description: Add price_override, name, and stock columns for schema compatibility

-- Step 1: Add price_override column (nullable, for custom pricing per variation)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS price_override DECIMAL(10,2) DEFAULT NULL;

-- Step 2: Add 'name' column as alias for 'nama_variasi' (for forward compatibility)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Step 3: Add 'stock' column as alias for 'stok' (for forward compatibility)
ALTER TABLE product_variations 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Step 4: Migrate existing data from old columns to new columns
UPDATE product_variations 
SET 
  name = nama_variasi,
  stock = stok
WHERE name IS NULL OR stock IS NULL;

-- Step 5: Add NOT NULL constraints after data migration (optional - commented out for safety)
-- ALTER TABLE product_variations ALTER COLUMN name SET NOT NULL;
-- ALTER TABLE product_variations ALTER COLUMN stock SET NOT NULL;

-- Step 6: Create index on new columns for better query performance
CREATE INDEX IF NOT EXISTS idx_product_variations_name ON product_variations(name);
CREATE INDEX IF NOT EXISTS idx_product_variations_stock ON product_variations(stock);

-- Step 7: Add comment to columns for documentation
COMMENT ON COLUMN product_variations.price_override IS 'Custom price override for this variation. If NULL, uses product base_price';
COMMENT ON COLUMN product_variations.name IS 'Variation name (new field, mirrors nama_variasi)';
COMMENT ON COLUMN product_variations.stock IS 'Stock quantity (new field, mirrors stok)';

-- Optional: Create trigger to keep old and new columns in sync
CREATE OR REPLACE FUNCTION sync_product_variations_fields()
RETURNS TRIGGER AS $$
BEGIN
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS sync_product_variations_trigger ON product_variations;
CREATE TRIGGER sync_product_variations_trigger
  BEFORE INSERT OR UPDATE ON product_variations
  FOR EACH ROW
  EXECUTE FUNCTION sync_product_variations_fields();

-- Verification query (run this to check the migration)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'product_variations' 
-- ORDER BY ordinal_position;
