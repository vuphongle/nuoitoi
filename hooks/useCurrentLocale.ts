'use client';

import { usePathname } from 'next/navigation';
import { AppLanguage, DEFAULT_LANGUAGE, isSupportedLanguage } from '@/constants/lang';

export function useCurrentLocale(): AppLanguage {
  const pathname = usePathname();
  const segment = pathname?.split('/')[1];

  return segment && isSupportedLanguage(segment) ? segment : DEFAULT_LANGUAGE;
}

export function getLocalizedPath(pathname: string, targetLocale: AppLanguage): string {
  const cleanPath = pathname?.startsWith('/') ? pathname : '/' + (pathname || '');
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length === 0) return '/' + targetLocale;

  if (isSupportedLanguage(segments[0])) {
    segments[0] = targetLocale;
    return '/' + segments.join('/');
  }

  return '/' + targetLocale + cleanPath;
}
