import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simplified Gate Layer (Middleware)
// In a real app, this would verify JWT tokens and check RBAC
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public assets and auth routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname === '/login') {
    return NextResponse.next();
  }

  // Mock authentication check
  const userCookie = request.cookies.get('user_session');
  
  if (!userCookie && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Gate Layer: Log every access (Immutable Logs concept)
  // Note: Middleware can't directly write to SQLite easily in some environments, 
  // so we'd typically call an internal API or use a logging service.
  // For this demo, we'll assume the API routes handle their own logging.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
