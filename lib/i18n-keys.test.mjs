import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const localeFiles = ['vi', 'en'].map((locale) => ({
  locale,
  source: readFileSync(
    new URL(`../shared/i18n/locales/${locale}/common.ts`, import.meta.url),
    'utf8'
  ),
}));

const requiredSections = {
  sidebar: [
    'appName',
    'appSub',
    'main',
    'system',
    'dashboard',
    'brands',
    'campaigns',
    'users',
    'analytics',
    'documents',
    'settings',
    'notifications',
  ],
  login: [
    'title',
    'subtitle',
    'emailLabel',
    'emailPlaceholder',
    'passwordLabel',
    'passwordPlaceholder',
    'forgotPassword',
    'submitButton',
    'backToHome',
    'bannerTitleLine1',
    'bannerTitleLine2',
    'bannerDescription',
    'invalidCredentials',
  ],
  unauthorized: ['title', 'description', 'backToHome', 'login'],
};

test('common locales define the admin and login translations', () => {
  for (const { locale, source } of localeFiles) {
    for (const [section, keys] of Object.entries(requiredSections)) {
      assert.match(source, new RegExp(`\\b${section}:\\s*{`), `${locale} is missing ${section}`);

      for (const key of keys) {
        assert.match(
          source,
          new RegExp(`\\b${key}:\\s*['\\"]`),
          `${locale} is missing ${section}.${key}`
        );
      }
    }
  }
});

test('login translations use the Card Platform brand', () => {
  for (const { locale, source } of localeFiles) {
    assert.match(source, /appName:\s*['"]Card Platform['"]/, `${locale} uses the wrong app name`);
    assert.match(
      source,
      /bannerTitleLine1:\s*['"]Card Platform['"]/,
      `${locale} uses the wrong login brand`
    );
  }

  const loginSources = localeFiles
    .map(({ source }) => source.match(/login:\s*{[\s\S]*?\n\s*},\n\s*unauthorized:/)?.[0] ?? '')
    .join('\n');

  assert.doesNotMatch(loginSources, /TranX|Translation Platform|Nền tảng dịch thuật/);
});
