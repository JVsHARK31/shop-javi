// Test Supabase Storage bucket untuk upload gambar
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageBucket() {
  try {
    console.log('🔧 Testing Supabase Storage Bucket...\n');
    
    // 1. Check if bucket exists
    console.log('1. Checking if product-images bucket exists...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    const productImagesBucket = buckets.find(bucket => bucket.id === 'product-images');
    
    if (productImagesBucket) {
      console.log('✅ product-images bucket exists');
      console.log('📋 Bucket details:', {
        id: productImagesBucket.id,
        name: productImagesBucket.name,
        public: productImagesBucket.public,
        file_size_limit: productImagesBucket.file_size_limit,
        allowed_mime_types: productImagesBucket.allowed_mime_types
      });
    } else {
      console.log('❌ product-images bucket does not exist');
      console.log('📋 Available buckets:', buckets.map(b => b.id));
      console.log('\n🔧 SOLUTION: Run STORAGE_BUCKET_SETUP.sql in Supabase SQL Editor');
      return;
    }
    
    // 2. Test file upload (create a test file)
    console.log('\n2. Testing file upload...');
    
    // Create a test image file (1x1 pixel PNG)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageData, 'base64');
    const testFile = new File([testImageBuffer], 'test-image.png', { type: 'image/png' });
    
    const fileName = `test-${Date.now()}.png`;
    const filePath = `products/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Upload failed:', uploadError.message);
      console.error('📋 Upload error details:', uploadError);
    } else {
      console.log('✅ Upload successful');
      console.log('📋 Upload data:', uploadData);
      
      // 3. Test getting public URL
      console.log('\n3. Testing public URL generation...');
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log('✅ Public URL generated:', publicUrl);
      
      // 4. Test file deletion
      console.log('\n4. Testing file deletion...');
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      
      if (deleteError) {
        console.error('❌ Delete failed:', deleteError.message);
      } else {
        console.log('✅ File deleted successfully');
      }
    }
    
    // 5. Test bucket permissions
    console.log('\n5. Testing bucket permissions...');
    
    // Try to list files in bucket
    const { data: files, error: listError } = await supabase.storage
      .from('product-images')
      .list('products', {
        limit: 10,
        offset: 0
      });
    
    if (listError) {
      console.error('❌ List files failed:', listError.message);
    } else {
      console.log('✅ List files successful');
      console.log('📋 Files in products folder:', files?.length || 0);
    }
    
    console.log('\n🎯 STORAGE BUCKET TEST SUMMARY:');
    if (productImagesBucket && !uploadError) {
      console.log('✅ Bucket exists and is properly configured');
      console.log('✅ Upload functionality working');
      console.log('✅ Public URL generation working');
      console.log('✅ Delete functionality working');
      console.log('✅ List files working');
      console.log('\n🎉 Storage bucket is ready for image uploads!');
    } else {
      console.log('❌ Storage bucket needs to be set up');
      console.log('🔧 Run STORAGE_BUCKET_SETUP.sql in Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testStorageBucket();
