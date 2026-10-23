import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { STORAGE_KEYS } from '@core/constants/storage';

// Public routes accessible without authentication
const PUBLIC_PATHS = ['/login', '/api'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let API proxy requests pass through directly
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 1. If user already has an active token and visits /login, redirect to /dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user has no token and visits a protected page, redirect to /login
  if (!token && !isPublicPath && pathname !== '/') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
