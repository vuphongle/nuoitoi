export const LANGUAGES = {
  VI: 'vi',
  EN: 'en',
} as const;

export const SUPPORTED_LANGUAGES = [LANGUAGES.VI, LANGUAGES.EN] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = LANGUAGES.VI;

export const LOCALE_COOKIE_NAME = 'i18nextLng';

export function isSupportedLanguage(value: string): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}

export function normalizeLanguage(value?: string | null): AppLanguage {
  if (!value) return DEFAULT_LANGUAGE;
  const base = value.split(/[-_]/)[0].toLowerCase();
  return isSupportedLanguage(base) ? base : DEFAULT_LANGUAGE;
}
