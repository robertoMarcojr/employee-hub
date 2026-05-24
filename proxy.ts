import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login'];

function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function getDefaultRoute(role?: string): string {
  if (role === 'admin') return '/admin/users';
  if (role === 'executive') return '/executive';
  return '/employee';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isPublic = publicPaths.some(p => pathname.startsWith(p)) || pathname === '/';

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && token && pathname !== '/') {
    const payload = decodeToken(token);
    const target = getDefaultRoute(payload?.role);
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (!isPublic && token && !pathname.startsWith('/admin') && !pathname.startsWith('/employee') && !pathname.startsWith('/executive')) {
    const payload = decodeToken(token);
    const target = getDefaultRoute(payload?.role);
    if (!pathname.startsWith(target)) {
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
