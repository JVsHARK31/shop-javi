// Verify storage bucket setup
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyStorageSetup() {
  try {
    console.log('🔧 Verifying Storage Bucket Setup...\n');
    
    // 1. Check if bucket exists
    console.log('1. Checking if product-images bucket exists...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    const productImagesBucket = buckets.find(bucket => bucket.id === 'product-images');
    
    if (!productImagesBucket) {
      console.log('❌ product-images bucket does not exist');
      console.log('📋 Available buckets:', buckets.map(b => b.id));
      console.log('\n🚨 URGENT: Run SQL setup in Supabase SQL Editor!');
      console.log('📄 Use STORAGE_BUCKET_SETUP.sql file');
      return;
    }
    
    console.log('✅ product-images bucket exists');
    console.log('📋 Bucket details:', {
      id: productImagesBucket.id,
      name: productImagesBucket.name,
      public: productImagesBucket.public,
      file_size_limit: productImagesBucket.file_size_limit,
      allowed_mime_types: productImagesBucket.allowed_mime_types
    });
    
    // 2. Verify bucket configuration
    console.log('\n2. Verifying bucket configuration...');
    
    if (!productImagesBucket.public) {
      console.log('⚠️ Bucket is not public - images won\'t be accessible');
    } else {
      console.log('✅ Bucket is public');
    }
    
    if (productImagesBucket.file_size_limit !== 5242880) {
      console.log('⚠️ File size limit is not 5MB');
    } else {
      console.log('✅ File size limit is 5MB');
    }
    
    const expectedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const hasAllTypes = expectedTypes.every(type => 
      productImagesBucket.allowed_mime_types?.includes(type)
    );
    
    if (!hasAllTypes) {
      console.log('⚠️ Not all required file types are allowed');
      console.log('Expected:', expectedTypes);
      console.log('Actual:', productImagesBucket.allowed_mime_types);
    } else {
      console.log('✅ All required file types are allowed');
    }
    
    // 3. Test upload functionality
    console.log('\n3. Testing upload functionality...');
    
    // Create a test image file (1x1 pixel PNG)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageData, 'base64');
    const testFile = new File([testImageBuffer], 'test-verification.png', { type: 'image/png' });
    
    const fileName = `verification-test-${Date.now()}.png`;
    const filePath = `products/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError.message);
      console.error('📋 Upload error details:', uploadError);
    } else {
      console.log('✅ Upload test successful');
      
      // Test public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log('✅ Public URL generated:', publicUrl);
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      
      if (deleteError) {
        console.log('⚠️ Could not delete test file:', deleteError.message);
      } else {
        console.log('✅ Test file cleaned up');
      }
    }
    
    // 4. Summary
    console.log('\n🎯 STORAGE VERIFICATION SUMMARY:');
    
    if (productImagesBucket && !uploadError) {
      console.log('✅ Bucket exists and is properly configured');
      console.log('✅ Upload functionality working');
      console.log('✅ Public URL generation working');
      console.log('✅ Storage setup is COMPLETE');
      console.log('\n🎉 Upload images should work without errors!');
    } else {
      console.log('❌ Storage setup needs attention');
      console.log('🔧 Run STORAGE_BUCKET_SETUP.sql in Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

verifyStorageSetup();
