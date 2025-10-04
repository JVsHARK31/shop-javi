// Test admin login dan database connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminLogin() {
  try {
    console.log('🔍 Testing admin login setup...');
    
    // Test 1: Cek apakah tabel admin_users ada
    console.log('\n1. Checking admin_users table...');
    const { data: users, error: usersError } = await supabase
      .from('admin_users')
      .select('*');
    
    if (usersError) {
      console.error('❌ Table admin_users error:', usersError.message);
      console.log('\n🔧 SOLUTION: Run SQL setup from FIXED_SQL_COMMANDS.sql');
      return;
    }
    
    console.log('✅ Table admin_users accessible');
    console.log('📊 Found users:', users?.length || 0);
    
    // Test 2: Cek user Javier
    console.log('\n2. Checking user Javier...');
    const { data: javierUser, error: javierError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'Javier')
      .single();
    
    if (javierError) {
      console.error('❌ User Javier not found:', javierError.message);
      console.log('\n🔧 SOLUTION: Run this SQL:');
      console.log(`INSERT INTO admin_users (username, password_hash) VALUES ('Javier', 'athallah310706');`);
      return;
    }
    
    console.log('✅ User Javier found');
    console.log('📋 User details:', {
      id: javierUser.id,
      username: javierUser.username,
      password_hash: javierUser.password_hash,
      created_at: javierUser.created_at
    });
    
    // Test 3: Test password match
    console.log('\n3. Testing password match...');
    const testPassword = 'athallah310706';
    const passwordMatch = javierUser.password_hash === testPassword;
    
    if (passwordMatch) {
      console.log('✅ Password matches correctly');
    } else {
      console.log('❌ Password does not match');
      console.log('Expected:', testPassword);
      console.log('Stored:', javierUser.password_hash);
      console.log('\n🔧 SOLUTION: Update password with this SQL:');
      console.log(`UPDATE admin_users SET password_hash = 'athallah310706' WHERE username = 'Javier';`);
    }
    
    // Test 4: Summary
    console.log('\n📋 SUMMARY:');
    console.log('✅ Database connection: OK');
    console.log('✅ Table admin_users: OK');
    console.log('✅ User Javier exists:', javierUser ? 'YES' : 'NO');
    console.log('✅ Password correct:', passwordMatch ? 'YES' : 'NO');
    
    if (passwordMatch) {
      console.log('\n🎉 LOGIN SHOULD WORK!');
      console.log('Username: Javier');
      console.log('Password: athallah310706');
    } else {
      console.log('\n🚨 LOGIN WILL FAIL - Fix password first');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAdminLogin();
