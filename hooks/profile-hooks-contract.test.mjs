import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

test('profile service uses the isolated admin client', async () => {
  const contents = await source('services/profile.service.ts');
  assert.match(contents, /adminApiClient/);
  assert.match(contents, /get<ProfileResponse>\('\/users\/profile',[\s\S]*signal\)/);
  assert.match(contents, /patch<ProfileResponse>\('\/users\/profile'/);
});

test('profile query is fresh, non-retrying, and extracts the admin payload', async () => {
  const contents = await source('hooks/profile-query.ts');
  assert.match(contents, /PROFILE_QUERY_KEY/);
  assert.match(contents, /retry:\s*false/);
  assert.match(contents, /staleTime:\s*0/);
  assert.match(contents, /signal/);
  assert.match(contents, /extractAdminProfile/);
});

test('profile hooks synchronize extracted query data and force a refresh after patch', async () => {
  const contents = await source('hooks/use-profile.ts');
  assert.match(contents, /useQuery/);
  assert.match(contents, /useMutation/);
  assert.match(contents, /fetchQuery/);
  assert.match(contents, /cancelQueries/);
  assert.match(contents, /setUser\(profile/);
  assert.match(contents, /profileQueryOptions/);
});
