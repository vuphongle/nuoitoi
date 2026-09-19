import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

test('admin catch-all invokes the segment not-found boundary', async () => {
  const contents = await source('app/admin/[...not-found]/page.tsx');
  assert.match(contents, /import\s*{\s*notFound\s*}\s*from\s*'next\/navigation'/);
  assert.match(contents, /notFound\(\)/);
});

test('admin not-found stays inside admin navigation', async () => {
  const contents = await source('app/admin/not-found.tsx');
  assert.match(contents, /\/admin\/dashboard/);
  assert.match(contents, /\/admin\/settings/);
  assert.doesNotMatch(contents, /MarketingLayout/);
  assert.doesNotMatch(contents, /currentLocale|\/support/);
});

test('both locales define all admin not-found labels', async () => {
  for (const locale of ['vi', 'en']) {
    const contents = await source(`shared/i18n/locales/${locale}/common.ts`);
    const section = contents.match(/adminNotFound:\s*{[\s\S]*?\n\s*},/)?.[0] ?? '';
    for (const key of ['title', 'description', 'dashboard', 'settings']) {
      assert.match(section, new RegExp(`${key}:`), `${locale} is missing ${key}`);
    }
  }
});
