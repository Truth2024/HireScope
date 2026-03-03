import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isProfilePage = /^\/(?:[a-z]{2}\/)?profile/.test(pathname);
  const isAuthPage = /^\/(?:[a-z]{2}\/)?(login|register)/.test(pathname);

  if (refreshToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!refreshToken && isProfilePage) {
    const locale = pathname.split('/')[1] || 'ru';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
