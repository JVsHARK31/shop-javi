export interface AdminSession {
  username: string;
  authenticated: boolean;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;

  const sessionData = sessionStorage.getItem('admin_session');
  if (!sessionData) return null;

  try {
    return JSON.parse(sessionData) as AdminSession;
  } catch {
    return null;
  }
}

export function setAdminSession(username: string): void {
  if (typeof window === 'undefined') return;

  const session: AdminSession = {
    username,
    authenticated: true,
  };

  sessionStorage.setItem('admin_session', JSON.stringify(session));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('admin_session');
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session?.authenticated === true;
}
