import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('profile BFF exposes GET and PATCH for users/profile', async () => {
  const contents = await source('app/api/users/profile/route.ts');
  assert.match(contents, /export async function GET/);
  assert.match(contents, /export async function PATCH/);
  assert.equal((contents.match(/'users\/profile'/g) ?? []).length, 2);
});

test('admin proxy normalizes auth payloads and expires the session cookie', async () => {
  const contents = await source('lib/admin-proxy.ts');

  assert.match(contents, /getAdminAuthorizationStatus/);
  assert.match(contents, /adminAuthFailureResponse/);
  assert.match(contents, /name:\s*AUTH_COOKIE_NAME/);
  assert.match(contents, /value:\s*''/);
  assert.match(contents, /httpOnly:\s*true/);
  assert.match(contents, /sameSite:\s*'lax'/);
  assert.match(contents, /path:\s*'\/'/);
  assert.match(contents, /maxAge:\s*0/);
});
