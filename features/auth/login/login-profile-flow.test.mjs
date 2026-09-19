import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AdminAuthorizationError, AdminRoleError } from '../../../lib/admin-auth-response.ts';
import { getLoginProfileAction } from './login-profile-flow.ts';

const adminProfile = { id: 1, role: 'admin' };

test('does not redirect from cached profile data before a fresh mount fetch settles', () => {
  assert.equal(
    getLoginProfileAction({
      isFetchedAfterMount: false,
      isSuccess: true,
      profile: adminProfile,
      error: null,
    }),
    'stay'
  );
});

test('redirects only for a freshly fetched admin profile', () => {
  assert.equal(
    getLoginProfileAction({
      isFetchedAfterMount: true,
      isSuccess: true,
      profile: adminProfile,
      error: null,
    }),
    'redirect'
  );
});

test('stays for HTTP authorization failures and cleans successful role failures', () => {
  assert.equal(
    getLoginProfileAction({
      isFetchedAfterMount: true,
      isSuccess: false,
      profile: undefined,
      error: new AdminAuthorizationError(403),
    }),
    'stay'
  );
  assert.equal(
    getLoginProfileAction({
      isFetchedAfterMount: true,
      isSuccess: false,
      profile: undefined,
      error: new AdminRoleError(),
    }),
    'cleanup-role'
  );
  assert.equal(
    getLoginProfileAction({
      isFetchedAfterMount: true,
      isSuccess: true,
      profile: { id: 2, role: 'user' },
      error: null,
    }),
    'cleanup-role'
  );
});

test('shows ordinary profile loading errors', () => {
  assert.equal(
    getLoginProfileAction({
      isFetchedAfterMount: true,
      isSuccess: false,
      profile: undefined,
      error: new Error('offline'),
    }),
    'show-error'
  );
});

test('login, layout, and header delegate to the shared profile/session flow', async () => {
  const root = new URL('../../../', import.meta.url);
  const [login, layout, header] = await Promise.all([
    readFile(new URL('features/auth/login/components/login-form.tsx', root), 'utf8'),
    readFile(new URL('app/admin/layout.tsx', root), 'utf8'),
    readFile(new URL('components/layout/admin-header.tsx', root), 'utf8'),
  ]);

  assert.match(login, /getLoginProfileAction/);
  assert.match(login, /handleAdminSessionExpiry\(\)[\s\S]*loginApi\.login/);
  assert.match(login, /fetchQuery\(profileQueryOptions\(\)\)/);
  assert.match(login, /router\.replace/);
  assert.match(layout, /useProfile/);
  assert.match(layout, /isFetchedAfterMount/);
  assert.match(layout, /shouldHoldAdminShell/);
  assert.doesNotMatch(layout, /\/api\/auth\/me/);
  assert.match(header, /useAuthStore/);
  assert.match(header, /clearAdminQueryState/);
});
