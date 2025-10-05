// Test delete function with foreign key constraints
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDeleteWithConstraints() {
  try {
    console.log('🔧 Testing DELETE with Foreign Key Constraints...\n');
    
    // 1. Create test product with variations
    console.log('1. Creating test product with variations...');
    const testProductData = {
      slug: 'test-delete-with-variations-' + Date.now(),
      judul: 'Test Delete Product with Variations',
      deskripsi: 'This product has variations and will be deleted',
      kategori: ['Test'],
      tag: ['test', 'delete', 'variations'],
      gambar: ['https://via.placeholder.com/400'],
      published: false,
      base_price: 1000,
      stok_total: 5,
      highlight_bullets: ['Has variations', 'Will be deleted']
    };
    
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert([testProductData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ INSERT product failed:', insertError.message);
      return;
    }
    
    console.log('✅ Created product:', newProduct.slug, '(ID:', newProduct.id + ')');
    
    // 2. Add variations to the product
    console.log('\n2. Adding product variations...');
    const variationsData = [
      {
        product_id: newProduct.id,
        nama_variasi: 'Variation 1',
        price: 1000,
        sku: 'TEST-VAR-1',
        stok: 3,
        is_default: true,
        sort_order: 1
      },
      {
        product_id: newProduct.id,
        nama_variasi: 'Variation 2',
        price: 1500,
        sku: 'TEST-VAR-2',
        stok: 2,
        is_default: false,
        sort_order: 2
      }
    ];
    
    const { data: variations, error: variationsError } = await supabase
      .from('product_variations')
      .insert(variationsData)
      .select();
    
    if (variationsError) {
      console.error('❌ INSERT variations failed:', variationsError.message);
    } else {
      console.log('✅ Created', variations?.length || 0, 'variations');
    }
    
    // 3. Verify product with variations exists
    console.log('\n3. Verifying product with variations...');
    const { data: productWithVars, error: selectError } = await supabase
      .from('products')
      .select(`
        *,
        variations:product_variations(*)
      `)
      .eq('id', newProduct.id)
      .single();
    
    if (selectError) {
      console.error('❌ SELECT failed:', selectError.message);
    } else {
      console.log('✅ Product has', productWithVars.variations?.length || 0, 'variations');
    }
    
    // 4. Test DELETE product (should cascade delete variations)
    console.log('\n4. Testing DELETE product with CASCADE...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', newProduct.id);
    
    if (deleteError) {
      console.error('❌ DELETE FAILED:', deleteError.message);
      console.log('🔍 Delete error details:', deleteError);
      
      // Check what still exists
      const { data: remainingProduct } = await supabase
        .from('products')
        .select('id, slug')
        .eq('id', newProduct.id)
        .single();
      
      const { data: remainingVariations } = await supabase
        .from('product_variations')
        .select('id, nama_variasi')
        .eq('product_id', newProduct.id);
      
      if (remainingProduct) {
        console.log('⚠️ Product still exists:', remainingProduct);
      }
      
      if (remainingVariations && remainingVariations.length > 0) {
        console.log('⚠️ Variations still exist:', remainingVariations);
      }
      
    } else {
      console.log('✅ DELETE SUCCESSFUL!');
      
      // Verify everything is deleted
      const { data: verifyProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', newProduct.id)
        .single();
      
      const { data: verifyVariations } = await supabase
        .from('product_variations')
        .select('id')
        .eq('product_id', newProduct.id);
      
      if (!verifyProduct && (!verifyVariations || verifyVariations.length === 0)) {
        console.log('✅ Product and variations successfully deleted (verified)');
      } else {
        console.log('⚠️ Some data still exists after delete');
        if (verifyProduct) console.log('  - Product still exists');
        if (verifyVariations && verifyVariations.length > 0) {
          console.log('  - Variations still exist:', verifyVariations.length);
        }
      }
    }
    
    // 5. Test delete with manual cascade (delete variations first, then product)
    console.log('\n5. Testing manual CASCADE delete...');
    
    // Create another test product
    const testProductData2 = {
      slug: 'test-manual-cascade-' + Date.now(),
      judul: 'Test Manual Cascade Delete',
      deskripsi: 'This will be deleted manually',
      kategori: ['Test'],
      tag: ['test', 'manual'],
      gambar: ['https://via.placeholder.com/400'],
      published: false,
      base_price: 2000,
      stok_total: 1,
      highlight_bullets: ['Manual delete test']
    };
    
    const { data: newProduct2, error: insertError2 } = await supabase
      .from('products')
      .insert([testProductData2])
      .select()
      .single();
    
    if (insertError2) {
      console.error('❌ INSERT product 2 failed:', insertError2.message);
    } else {
      console.log('✅ Created product 2:', newProduct2.slug);
      
      // Add variation
      const { error: varError } = await supabase
        .from('product_variations')
        .insert([{
          product_id: newProduct2.id,
          nama_variasi: 'Manual Test Variation',
          price: 2000,
          sku: 'MANUAL-TEST-1',
          stok: 1,
          is_default: true,
          sort_order: 1
        }]);
      
      if (varError) {
        console.error('❌ INSERT variation failed:', varError.message);
      } else {
        console.log('✅ Added variation to product 2');
        
        // Delete variations first
        const { error: deleteVarsError } = await supabase
          .from('product_variations')
          .delete()
          .eq('product_id', newProduct2.id);
        
        if (deleteVarsError) {
          console.error('❌ Delete variations failed:', deleteVarsError.message);
        } else {
          console.log('✅ Variations deleted manually');
          
          // Then delete product
          const { error: deleteProdError } = await supabase
            .from('products')
            .delete()
            .eq('id', newProduct2.id);
          
          if (deleteProdError) {
            console.error('❌ Delete product failed:', deleteProdError.message);
          } else {
            console.log('✅ Product deleted manually - SUCCESS!');
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testDeleteWithConstraints();
