// Test delete function specifically
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDeleteFunction() {
  try {
    console.log('🔧 Testing DELETE Function Specifically...\n');
    
    // 1. Get existing products
    console.log('1. Getting existing products...');
    const { data: products, error: selectError } = await supabase
      .from('products')
      .select('id, slug, judul')
      .limit(5);
    
    if (selectError) {
      console.error('❌ SELECT failed:', selectError.message);
      return;
    }
    
    console.log('✅ Found', products?.length || 0, 'products');
    if (products && products.length > 0) {
      console.log('📋 Products:', products.map(p => `${p.slug} (${p.id})`));
    }
    
    // 2. Create test product for deletion
    console.log('\n2. Creating test product for deletion...');
    const testProductData = {
      slug: 'test-delete-' + Date.now(),
      judul: 'Test Delete Product',
      deskripsi: 'This product will be deleted',
      kategori: ['Test'],
      tag: ['test', 'delete'],
      gambar: ['https://via.placeholder.com/400'],
      published: false,
      base_price: 1000,
      stok_total: 1,
      highlight_bullets: ['Will be deleted']
    };
    
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert([testProductData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ INSERT failed:', insertError.message);
      console.log('🔍 Insert error details:', insertError);
      return;
    }
    
    console.log('✅ Created test product:', newProduct.slug, '(ID:', newProduct.id + ')');
    
    // 3. Test DELETE function
    console.log('\n3. Testing DELETE function...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', newProduct.id);
    
    if (deleteError) {
      console.error('❌ DELETE FAILED:', deleteError.message);
      console.log('🔍 Delete error details:', deleteError);
      console.log('🔍 Error code:', deleteError.code);
      console.log('🔍 Error hint:', deleteError.hint);
      
      // Check if product still exists
      const { data: stillExists } = await supabase
        .from('products')
        .select('id, slug')
        .eq('id', newProduct.id)
        .single();
      
      if (stillExists) {
        console.log('⚠️ Product still exists after delete attempt');
        console.log('📋 Remaining product:', stillExists);
      }
      
    } else {
      console.log('✅ DELETE SUCCESSFUL!');
      
      // Verify deletion
      const { data: verifyDelete } = await supabase
        .from('products')
        .select('id')
        .eq('id', newProduct.id)
        .single();
      
      if (!verifyDelete) {
        console.log('✅ Product successfully deleted (verified)');
      } else {
        console.log('⚠️ Product still exists after delete');
      }
    }
    
    // 4. Check current policies
    console.log('\n4. Checking current RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'products');
    
    if (policyError) {
      console.log('⚠️ Could not check policies:', policyError.message);
    } else {
      console.log('📋 Current policies for products table:');
      policies?.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testDeleteFunction();
