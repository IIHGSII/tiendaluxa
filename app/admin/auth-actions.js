'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.ADMIN_PASSWORD || 'TiendaluxaAdmin2024';

export async function login(prevState, formData) {
  const password = formData.get('password');

  if (password === SESSION_SECRET) {
    cookies().set(SESSION_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
  } else {
    return { error: 'Contraseña incorrecta' };
  }
  
  redirect('/admin');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
