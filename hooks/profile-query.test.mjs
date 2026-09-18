import test from 'node:test';
import assert from 'node:assert/strict';
import { AdminAuthorizationError, AdminRoleError } from '../lib/admin-auth-response.ts';
import {
  extractAdminProfile,
  ProfileRefreshAfterUpdateError,
  refreshProfileAfterPatch,
} from './profile-refresh.ts';

const adminProfile = {
  id: 1,
  name: 'Admin',
  email: 'admin@gmail.com',
  phone: '0123456789',
  birth_day: '2003-01-10',
  gender: 'Male',
  role: 'admin',
  avatar: 'https://example.com/avatar.jpg',
  lang: 'vi',
  created_at: '2026-09-06T14:19:17.558Z',
  updated_at: '2026-09-06T14:19:17.558Z',
};

test('extracts a complete admin profile from the response envelope', () => {
  assert.deepEqual(extractAdminProfile({ data: adminProfile }), adminProfile);
});

test('rejects missing and non-admin profiles', () => {
  assert.throws(() => extractAdminProfile(null), /profile/i);
  assert.throws(
    () => extractAdminProfile({ data: { ...adminProfile, role: 'user' } }),
    AdminRoleError
  );
});

test('returns the fresh profile after a successful refresh', async () => {
  const result = await refreshProfileAfterPatch(
    async () => adminProfile,
    async () => {}
  );
  assert.deepEqual(result, adminProfile);
});

test('reports a non-auth refresh warning without inventing fresh data', async () => {
  const refreshError = new Error('profile refresh unavailable');
  const result = await refreshProfileAfterPatch(
    async () => {
      throw refreshError;
    },
    async () => assert.fail('cleanup must not run')
  );

  assert.deepEqual(result, { updated: true, refreshError });
});

test('marks authorization refresh failures as post-update failures without duplicated cleanup', async () => {
  const error = new AdminAuthorizationError(403);
  await assert.rejects(
    () =>
      refreshProfileAfterPatch(
        async () => {
          throw error;
        },
        async () => assert.fail('cleanup already ran at the HTTP boundary')
      ),
    (received) => {
      assert.ok(received instanceof ProfileRefreshAfterUpdateError);
      assert.equal(received.cause, error);
      return true;
    }
  );
});

test('cleans up a successful non-admin response before rethrowing it', async () => {
  const error = new AdminRoleError();
  let cleanupCalls = 0;

  await assert.rejects(
    () =>
      refreshProfileAfterPatch(
        async () => {
          throw error;
        },
        async () => {
          cleanupCalls += 1;
        }
      ),
    (received) => {
      assert.ok(received instanceof ProfileRefreshAfterUpdateError);
      assert.equal(received.cause, error);
      return true;
    }
  );
  assert.equal(cleanupCalls, 1);
});
