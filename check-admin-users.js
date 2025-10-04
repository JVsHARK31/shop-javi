// Check all admin users in database
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unirpugxxddorhuyhibf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaXJwdWd4eGRkb3JodXloaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1ODQ4NjQsImV4cCI6MjA3NTE2MDg2NH0.omUJHaOgWvk03SggAsnNetpxK5dQ76SnmRKFc8EXEgM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking all admin users...');
    
    // Get all users
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('📊 Found', users?.length || 0, 'admin users');
    
    if (users && users.length > 0) {
      console.log('\n📋 All admin users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Password Hash: ${user.password_hash}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
      
      // Check if Javier exists
      const javierUser = users.find(u => u.username === 'Javier');
      if (javierUser) {
        console.log('✅ User Javier found');
        console.log('🔍 Password check:');
        console.log('Stored password:', javierUser.password_hash);
        console.log('Expected password: athallah310706');
        console.log('Match:', javierUser.password_hash === 'athallah310706' ? '✅ YES' : '❌ NO');
        
        if (javierUser.password_hash !== 'athallah310706') {
          console.log('\n🔧 SOLUTION: Run this SQL in Supabase:');
          console.log(`UPDATE admin_users SET password_hash = 'athallah310706' WHERE username = 'Javier';`);
        } else {
          console.log('\n🎉 Password is correct! Login should work.');
        }
      } else {
        console.log('❌ User Javier not found');
        console.log('\n🔧 SOLUTION: Run this SQL in Supabase:');
        console.log(`INSERT INTO admin_users (username, password_hash) VALUES ('Javier', 'athallah310706');`);
      }
    } else {
      console.log('❌ No admin users found');
      console.log('\n🔧 SOLUTION: Run this SQL in Supabase:');
      console.log(`INSERT INTO admin_users (username, password_hash) VALUES ('Javier', 'athallah310706');`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkAdminUsers();
