-- =====================================================
-- ULTIMATE STORAGE FIX - JAVIER SHARK006 SHOP
-- Fix "Storage bucket belum dikonfigurasi" error
-- =====================================================

-- 1. DROP EXISTING BUCKET (jika ada) untuk fresh start
DELETE FROM storage.buckets WHERE id = 'product-images';

-- 2. CREATE STORAGE BUCKET dengan konfigurasi lengkap
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES (
  'product-images',
  'product-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  NOW(),
  NOW()
);

-- 3. DROP ALL EXISTING POLICIES untuk clean start
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Public product images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload product images" ON storage.objects;

-- 4. CREATE STORAGE POLICIES yang benar

-- Policy 1: Public can view product images
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Policy 2: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Policy 3: Authenticated users can update product images
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Policy 4: Authenticated users can delete product images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- 5. VERIFY BUCKET CREATION
SELECT 'ULTIMATE STORAGE FIX COMPLETED!' as status;

-- Check bucket details
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'product-images';

-- Check storage policies
SELECT 
  policyname, 
  cmd, 
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%product images%';

-- 6. TEST BUCKET ACCESS
SELECT 'Testing bucket access...' as test_status;

-- Test if we can list objects (should work even if empty)
SELECT COUNT(*) as object_count
FROM storage.objects 
WHERE bucket_id = 'product-images';

-- =====================================================
-- END OF ULTIMATE STORAGE FIX
-- =====================================================
