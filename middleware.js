import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Si no está intentando acceder a la zona de administración, continuar normalmente.
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Permitir el acceso directo a la página de login
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('admin_session');
  
  if (!cookie || cookie.value !== 'authenticated') {
    // Redirigir al login si no tiene la sesión válida
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
