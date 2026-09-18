'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AppLanguage, DEFAULT_LANGUAGE, isSupportedLanguage, normalizeLanguage } from '@/constants/lang';
import { getLocalizedPath } from './useCurrentLocale';
import '../shared/i18n';

export const useI18n = (namespace?: string | string[]) => {
  const namespaces = namespace ? (Array.isArray(namespace) ? namespace : [namespace]) : ['common'];

  const { t, i18n, ready } = useTranslation(namespaces);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const localeSegment = pathname?.split('/')[1];
  const activeLocale =
    localeSegment && isSupportedLanguage(localeSegment)
      ? (localeSegment as AppLanguage)
      : normalizeLanguage(i18n.language);


  useEffect(() => {
    setIsHydrated(true);

    const syncLanguageToCookie = (lng: string) => {
      document.cookie = `i18nextLng=${lng}; path=/; max-age=31536000; SameSite=Lax`;
    };

    syncLanguageToCookie(i18n.language);

    i18n.on('languageChanged', syncLanguageToCookie);

    return () => {
      i18n.off('languageChanged', syncLanguageToCookie);
    };
  }, [i18n]);

  useEffect(() => {
    if (!pathname) return;

    const segment = pathname.split('/')[1];
    if (segment && isSupportedLanguage(segment) && i18n.language !== segment) {
      i18n.changeLanguage(segment);
    }
  }, [pathname, i18n]);

  const switchLanguage = (targetLocale: AppLanguage) => {
    if (!isSupportedLanguage(targetLocale)) return;

    i18n.changeLanguage(targetLocale);
    if (!pathname) return;

    const targetPath = getLocalizedPath(pathname, targetLocale);
    if (targetPath !== pathname) {
      router.push(targetPath);
    }
  };

  const translate = (key: string, options?: any): string => {
    return (t(key, { lng: activeLocale, ...options }) ?? key) as string;
  };

  return {
    t: translate,
    i18n,
    ready: true,
    currentLanguage: activeLocale,
    isHydrated,
    changeLanguage: i18n.changeLanguage.bind(i18n),
    switchLanguage,
  };
};

