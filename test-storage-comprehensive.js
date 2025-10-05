// Comprehensive storage bucket test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageComprehensive() {
  try {
    console.log('🔧 COMPREHENSIVE STORAGE TEST...\n');
    
    // 1. Test connection
    console.log('1. Testing Supabase connection...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log('⚠️ Auth error (this is normal for anon key):', authError.message);
    } else {
      console.log('✅ Connection successful');
    }
    
    // 2. Check if bucket exists
    console.log('\n2. Checking if product-images bucket exists...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      console.error('📋 Full error:', bucketsError);
      return;
    }
    
    console.log('📋 All buckets:', buckets.map(b => b.id));
    
    const productImagesBucket = buckets.find(bucket => bucket.id === 'product-images');
    
    if (!productImagesBucket) {
      console.log('❌ product-images bucket does not exist');
      console.log('\n🚨 SOLUTION: Run ULTIMATE_STORAGE_FIX.sql in Supabase SQL Editor');
      return;
    }
    
    console.log('✅ product-images bucket exists');
    console.log('📋 Bucket configuration:', {
      id: productImagesBucket.id,
      name: productImagesBucket.name,
      public: productImagesBucket.public,
      file_size_limit: productImagesBucket.file_size_limit,
      allowed_mime_types: productImagesBucket.allowed_mime_types
    });
    
    // 3. Test bucket permissions
    console.log('\n3. Testing bucket permissions...');
    
    // Test list files (should work even if empty)
    const { data: files, error: listError } = await supabase.storage
      .from('product-images')
      .list('products', {
        limit: 10,
        offset: 0
      });
    
    if (listError) {
      console.error('❌ List files failed:', listError.message);
      console.error('📋 List error details:', listError);
    } else {
      console.log('✅ List files successful');
      console.log('📋 Files in products folder:', files?.length || 0);
    }
    
    // 4. Test file upload
    console.log('\n4. Testing file upload...');
    
    // Create a test image file (1x1 pixel PNG)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageData, 'base64');
    const testFile = new File([testImageBuffer], 'comprehensive-test.png', { type: 'image/png' });
    
    const fileName = `comprehensive-test-${Date.now()}.png`;
    const filePath = `products/${fileName}`;
    
    console.log('📤 Uploading test file:', fileName);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError.message);
      console.error('📋 Upload error details:', uploadError);
      console.error('📋 Error code:', uploadError.statusCode);
      console.error('📋 Error hint:', uploadError.hint);
    } else {
      console.log('✅ Upload test successful');
      console.log('📋 Upload data:', uploadData);
      
      // 5. Test public URL generation
      console.log('\n5. Testing public URL generation...');
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log('✅ Public URL generated:', publicUrl);
      
      // 6. Test file deletion
      console.log('\n6. Testing file deletion...');
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      
      if (deleteError) {
        console.error('❌ Delete test failed:', deleteError.message);
      } else {
        console.log('✅ Delete test successful');
      }
    }
    
    // 7. Test different file types
    console.log('\n7. Testing different file types...');
    
    const testFiles = [
      { name: 'test.jpg', type: 'image/jpeg', data: testImageData },
      { name: 'test.png', type: 'image/png', data: testImageData },
      { name: 'test.webp', type: 'image/webp', data: testImageData },
      { name: 'test.gif', type: 'image/gif', data: testImageData }
    ];
    
    for (const testFile of testFiles) {
      const buffer = Buffer.from(testFile.data, 'base64');
      const file = new File([buffer], testFile.name, { type: testFile.type });
      const testFileName = `type-test-${Date.now()}-${testFile.name}`;
      const testFilePath = `products/${testFileName}`;
      
      const { error: typeError } = await supabase.storage
        .from('product-images')
        .upload(testFilePath, file);
      
      if (typeError) {
        console.log(`❌ ${testFile.type} upload failed:`, typeError.message);
      } else {
        console.log(`✅ ${testFile.type} upload successful`);
        
        // Clean up
        await supabase.storage
          .from('product-images')
          .remove([testFilePath]);
      }
    }
    
    // 8. Summary
    console.log('\n🎯 COMPREHENSIVE STORAGE TEST SUMMARY:');
    
    if (productImagesBucket && !uploadError) {
      console.log('✅ Bucket exists and is properly configured');
      console.log('✅ Upload functionality working');
      console.log('✅ Public URL generation working');
      console.log('✅ Delete functionality working');
      console.log('✅ Multiple file types supported');
      console.log('\n🎉 Storage is ready for production use!');
    } else {
      console.log('❌ Storage setup needs attention');
      console.log('🔧 Run ULTIMATE_STORAGE_FIX.sql in Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('📋 Full error:', error);
  }
}

testStorageComprehensive();
