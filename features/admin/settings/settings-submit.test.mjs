import test from 'node:test';
import assert from 'node:assert/strict';
import { submitPasswordSettings, submitProfileSettings } from './settings-submit.ts';
import { ProfileRefreshAfterUpdateError } from '../../../hooks/profile-refresh.ts';

const validProfile = {
  name: 'Admin',
  email: 'admin@gmail.com',
  phone: '0123456789',
  birth_day: '2003-01-10',
  gender: 'Male',
  avatar: '',
  lang: 'vi',
};

test('invalid profile values never call the mutation', async () => {
  let mutationCalls = 0;
  const result = await submitProfileSettings({
    values: { ...validProfile, name: '' },
    dirtyFields: { name: true },
    mutate: async () => {
      mutationCalls += 1;
      return null;
    },
  });

  assert.equal(result.status, 'validation-error');
  assert.equal(mutationCalls, 0);
});

test('an unchanged profile is a no-op', async () => {
  const result = await submitProfileSettings({
    values: validProfile,
    dirtyFields: {},
    mutate: async () => assert.fail('mutation must not run'),
  });
  assert.equal(result.status, 'unchanged');
});

test('profile patch failures are returned without resetting form values', async () => {
  const error = new Error('patch failed');
  const result = await submitProfileSettings({
    values: validProfile,
    dirtyFields: { phone: true },
    mutate: async () => {
      throw error;
    },
  });
  assert.deepEqual(result, { status: 'patch-error', error });
});

test('profile success distinguishes fresh data from refresh warnings', async () => {
  const profile = { id: 1, role: 'admin', name: 'Admin' };
  const fresh = await submitProfileSettings({
    values: validProfile,
    dirtyFields: { name: true },
    mutate: async (payload) => {
      assert.deepEqual(payload, { name: 'Admin' });
      return profile;
    },
  });
  const refreshError = new Error('refresh failed');
  const warning = await submitProfileSettings({
    values: validProfile,
    dirtyFields: { phone: true },
    mutate: async () => ({ updated: true, refreshError }),
  });

  assert.deepEqual(fresh, { status: 'updated', profile });
  assert.deepEqual(warning, { status: 'updated-with-warning', refreshError });
});

test('password clears after patch success, including refresh warnings', async () => {
  let clearCalls = 0;
  for (const mutationResult of [
    { id: 1, role: 'admin' },
    { updated: true, refreshError: new Error('refresh failed') },
  ]) {
    const result = await submitPasswordSettings({
      values: { password: 'newPassword123', confirmPassword: 'newPassword123' },
      mutate: async (payload) => {
        assert.deepEqual(payload, { password: 'newPassword123' });
        return mutationResult;
      },
      clear: () => {
        clearCalls += 1;
      },
    });
    assert.notEqual(result.status, 'patch-error');
  }
  assert.equal(clearCalls, 2);
});

test('password stays intact when PATCH fails', async () => {
  let clearCalls = 0;
  const error = new Error('patch failed');
  const result = await submitPasswordSettings({
    values: { password: 'newPassword123', confirmPassword: 'newPassword123' },
    mutate: async () => {
      throw error;
    },
    clear: () => {
      clearCalls += 1;
    },
  });

  assert.deepEqual(result, { status: 'patch-error', error });
  assert.equal(clearCalls, 0);
});

test('password clears when PATCH succeeded but authorization failed during refresh', async () => {
  let clearCalls = 0;
  const refreshError = new ProfileRefreshAfterUpdateError(new Error('session revoked'));
  const result = await submitPasswordSettings({
    values: { password: 'newPassword123', confirmPassword: 'newPassword123' },
    mutate: async () => {
      throw refreshError;
    },
    clear: () => {
      clearCalls += 1;
    },
  });

  assert.deepEqual(result, {
    status: 'updated-with-warning',
    refreshError: refreshError.cause,
  });
  assert.equal(clearCalls, 1);
});
