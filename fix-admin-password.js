// Fix admin password - update existing user
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin password...');
    
    // Cek user Javier yang sudah ada
    console.log('\n1. Checking existing user Javier...');
    const { data: javierUser, error: javierError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'Javier')
      .single();
    
    if (javierError) {
      console.error('❌ Error finding user:', javierError.message);
      return;
    }
    
    console.log('✅ User Javier found');
    console.log('📋 Current data:', {
      id: javierUser.id,
      username: javierUser.username,
      password_hash: javierUser.password_hash,
      created_at: javierUser.created_at
    });
    
    // Update password ke yang benar
    console.log('\n2. Updating password...');
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: 'athallah310706',
        updated_at: new Date().toISOString()
      })
      .eq('username', 'Javier');
    
    if (updateError) {
      console.error('❌ Update error:', updateError.message);
      return;
    }
    
    console.log('✅ Password updated successfully');
    
    // Verifikasi update
    console.log('\n3. Verifying update...');
    const { data: updatedUser, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'Javier')
      .single();
    
    if (verifyError) {
      console.error('❌ Verify error:', verifyError.message);
      return;
    }
    
    console.log('✅ Verification successful');
    console.log('📋 Updated data:', {
      username: updatedUser.username,
      password_hash: updatedUser.password_hash
    });
    
    // Test password match
    const testPassword = 'athallah310706';
    const passwordMatch = updatedUser.password_hash === testPassword;
    
    console.log('\n🎯 LOGIN TEST:');
    console.log('Username:', updatedUser.username);
    console.log('Password:', testPassword);
    console.log('Match:', passwordMatch ? '✅ YES' : '❌ NO');
    
    if (passwordMatch) {
      console.log('\n🎉 LOGIN SHOULD WORK NOW!');
      console.log('Go to /admin/login and use:');
      console.log('Username: Javier');
      console.log('Password: athallah310706');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

fixAdminPassword();
