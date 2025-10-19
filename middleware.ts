import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle Supabase auth for admin routes and auth routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/auth')) {
    return await updateSession(request);
  }

  // Handle i18n for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all routes
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(fr|en)/:path*',

    // Admin and auth routes
    '/admin/:path*',
    '/auth/:path*',

    // Enable redirects that add missing locales
    // Exclude: _next, _vercel, api, auth, admin, and files with extensions
    '/((?!_next|_vercel|api|auth|admin|.*\\..*).*)'
  ]
};
