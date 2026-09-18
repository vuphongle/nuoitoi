import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

function flattenKeys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === 'object' && !Array.isArray(child)
      ? flattenKeys(child, path)
      : [path];
  });
}

test('Vietnamese and English lixi resources expose the same component keys', async () => {
  const [{ default: vi }, { default: en }] = await Promise.all([
    import('../../shared/i18n/locales/vi/lixi.ts'),
    import('../../shared/i18n/locales/en/lixi.ts'),
  ]);

  const expectedSections = [
    'common',
    'header',
    'mobileMenu',
    'hero',
    'dashboard',
    'expenses',
    'whyUs',
    'commitments',
    'compare',
    'donateCarousel',
    'allocation',
    'heart',
    'footer',
    'feedbackDialog',
  ];

  assert.deepEqual(Object.keys(vi), expectedSections);
  assert.deepEqual(Object.keys(en), expectedSections);
  assert.deepEqual(flattenKeys(en).sort(), flattenKeys(vi).sort());
});

test('the shared i18n instance registers the lixi namespace for both locales', async () => {
  const contents = await source('shared/i18n/index.ts');

  assert.match(contents, /import vi_lixi from '.\/locales\/vi\/lixi'/);
  assert.match(contents, /import en_lixi from '.\/locales\/en\/lixi'/);
  assert.match(contents, /vi:\s*{[\s\S]*?lixi:\s*vi_lixi/);
  assert.match(contents, /en:\s*{[\s\S]*?lixi:\s*en_lixi/);
  assert.match(contents, /ns:\s*\[[\s\S]*?'lixi'/);
});

test('lixi components with user-facing copy use the lixi namespace', async () => {
  const files = [
    'Header.tsx',
    'MobileMenu.tsx',
    'Hero.tsx',
    'Dashboard.tsx',
    'Expenses.tsx',
    'WhyUs.tsx',
    'Commitments.tsx',
    'Compare.tsx',
    'DonateCarousel.tsx',
    'Allocation.tsx',
    'Heart.tsx',
    'Footer.tsx',
    'BackToTop.tsx',
    'Counter.tsx',
  ];

  for (const file of files) {
    const contents = await source(`components/lixi/${file}`);
    assert.match(contents, /useI18n\('lixi'\)/, `${file} must use the lixi namespace`);
  }
});

test('language controls follow the route-backed i18n locale', async () => {
  const [header, mobileMenu] = await Promise.all([
    source('components/lixi/Header.tsx'),
    source('components/lixi/MobileMenu.tsx'),
  ]);

  assert.doesNotMatch(header, /useState<'VI' \| 'EN'>/);
  assert.match(header, /currentLanguage/);
  assert.match(header, /switchLanguage/);
  assert.match(mobileMenu, /AppLanguage/);
});
