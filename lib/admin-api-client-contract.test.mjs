import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('admin client owns authorization cleanup while the public client stays isolated', async () => {
  const [adminClient, publicClient] = await Promise.all([
    source('lib/admin-api-client.ts'),
    source('lib/api-client.ts'),
  ]);

  assert.match(adminClient, /handleAdminResponse/);
  assert.match(adminClient, /createAdminSessionExpiryHandler/);
  assert.match(adminClient, /clearAdminQueryState/);
  assert.doesNotMatch(publicClient, /AdminAuthorization|admin-session|auth\/login/);
});

test('only protected BFF-backed services use the admin client', async () => {
  const protectedServices = [
    'services/user.service.ts',
    'services/admin-blog.service.ts',
    'services/admin-blog-category.service.ts',
    'services/admin-product.service.ts',
    'services/admin-product-category.service.ts',
  ];
  const publicServices = [
    'services/blog.service.ts',
    'services/product.service.ts',
    'services/contact.service.ts',
  ];

  for (const path of protectedServices) {
    const contents = await source(path);
    assert.match(contents, /adminApiClient/, `${path} must use adminApiClient`);
    assert.doesNotMatch(contents, /\bapiClient\b/, `${path} must not use apiClient`);
  }

  for (const path of publicServices) {
    const contents = await source(path);
    assert.match(contents, /\bapiClient\b/, `${path} must retain apiClient`);
    assert.doesNotMatch(contents, /adminApiClient/, `${path} must stay public`);
  }
});

test('the query client disables retries for authorization failures', async () => {
  const contents = await source('lib/query-client.ts');
  assert.match(contents, /AdminAuthorizationError/);
  assert.match(contents, /retry/);
  assert.match(contents, /PROFILE_QUERY_KEY/);
});
