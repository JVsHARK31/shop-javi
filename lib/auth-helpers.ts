'use client';

// HARDCODED ADMIN CREDENTIALS (as per requirements)
const ADMIN_USERNAME = 'Javier';
const ADMIN_PASSWORD = 'athallah310706';

export async function signInAdmin(username: string, password: string) {
  // Simple hardcoded authentication
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error('Username atau password salah');
  }

  // Store session in localStorage
  const session = {
    username: ADMIN_USERNAME,
    authenticated: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('admin_session', JSON.stringify(session));

  return session;
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
