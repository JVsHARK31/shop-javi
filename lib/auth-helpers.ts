'use client';

import { createClient } from '@/lib/supabase/client';

export async function signInAdmin(username: string, password: string) {
  const supabase = createClient();

  // Query admin_users table
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !adminUser) {
    throw new Error('Username atau password salah');
  }

  // Simple password comparison (in production, use bcrypt.compare)
  if (adminUser.password_hash !== password) {
    throw new Error('Username atau password salah');
  }

  // Update last login
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', adminUser.id);

  // Store session in localStorage (simple approach)
  localStorage.setItem('admin_session', JSON.stringify({
    id: adminUser.id,
    username: adminUser.username,
    authenticated: true,
    loginTime: new Date().toISOString()
  }));

  return adminUser;
}

export async function signOutAdmin() {
  // Clear admin session from localStorage
  localStorage.removeItem('admin_session');
}

export async function getCurrentAdminUser() {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem('admin_session');
  
  if (!sessionData) {
    return null;
  }

  try {
    const session = JSON.parse(sessionData);
    return session;
  } catch (error) {
    localStorage.removeItem('admin_session');
    return null;
  }
}

export async function checkAdminAuth() {
  const adminUser = await getCurrentAdminUser();
  return adminUser && adminUser.authenticated;
}
