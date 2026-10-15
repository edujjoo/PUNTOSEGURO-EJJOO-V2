'use server';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

export async function login(prev, formData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') || '').trim(),
    password: String(formData.get('password') || ''),
  });
  if (error) return { error: 'Correo o contraseña incorrectos.' };
  redirect('/centros');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
