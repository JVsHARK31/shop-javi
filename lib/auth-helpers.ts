'use client';

import { createClient } from '@/lib/supabase/client';

export async function signInAdmin(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOutAdmin() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function checkAdminAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return true;
}
