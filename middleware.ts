import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle 404 errors
  if (pathname === '/_error' || pathname === '/404') {
    return isDevelopment
      ? NextResponse.rewrite(new URL('/not-found', request.url))
      : NextResponse.rewrite(new URL('/404', request.url));
  }

  // Handle 500 errors
  if (pathname === '/500') {
    return isDevelopment
      ? NextResponse.rewrite(new URL('/error', request.url))
      : NextResponse.rewrite(new URL('/500', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    // Skip all files with extensions
    '/((?!_next|api|static|.*\\.[^/]*$).*)',
  ],
}
