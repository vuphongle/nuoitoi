import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LANGUAGE, isSupportedLanguage, LOCALE_COOKIE_NAME } from './constants/lang';
import { AUTH_COOKIE_NAME, getSessionSecret, isValidAdminSessionToken } from './lib/auth';

const PUBLIC_PAGES = [''];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const secret = getSessionSecret();
    const isValid = secret ? await isValidAdminSessionToken(token, secret) : false;

    if (!isValid) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/auth/login';
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';

  if (isSupportedLanguage(firstSegment)) {
    return NextResponse.next();
  }

  if (PUBLIC_PAGES.includes(firstSegment)) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const targetLocale =
      cookieLocale && isSupportedLanguage(cookieLocale) ? cookieLocale : DEFAULT_LANGUAGE;
    const targetPath = '/' + targetLocale + (pathname === '/' ? '' : pathname);
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
