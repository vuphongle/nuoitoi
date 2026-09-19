import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdminSessionExpiryHandler } from './admin-session.ts';

function createHarness(overrides = {}) {
  const calls = [];
  const handler = createAdminSessionExpiryHandler({
    clearAdminState: async () => calls.push('clear-admin-state'),
    logoutStore: () => calls.push('logout-store'),
    revokeServerSession: async () => calls.push('revoke-server'),
    getPathname: () => '/admin/settings',
    replaceLocation: (path) => calls.push(`replace:${path}`),
    ...overrides,
  });
  return { calls, handler };
}

test('cleans profile state, revokes the session, then redirects to login', async () => {
  const { calls, handler } = createHarness();

  await handler();

  assert.deepEqual(calls, [
    'clear-admin-state',
    'logout-store',
    'revoke-server',
    'replace:/auth/login',
  ]);
});

test('stays on the login page while still cleaning the expired session', async () => {
  const { calls, handler } = createHarness({ getPathname: () => '/auth/login' });

  await handler();

  assert.deepEqual(calls, ['clear-admin-state', 'logout-store', 'revoke-server']);
});

test('redirects even when server-side revocation fails', async () => {
  const { calls, handler } = createHarness({
    revokeServerSession: async () => {
      calls.push('revoke-server');
      throw new Error('offline');
    },
  });

  await handler();

  assert.deepEqual(calls, [
    'clear-admin-state',
    'logout-store',
    'revoke-server',
    'replace:/auth/login',
  ]);
});

test('deduplicates concurrent expiry handling', async () => {
  let releaseRevocation;
  const revocation = new Promise((resolve) => {
    releaseRevocation = resolve;
  });
  const { calls, handler } = createHarness({
    revokeServerSession: async () => {
      calls.push('revoke-server');
      await revocation;
    },
  });

  const first = handler();
  const second = handler();
  releaseRevocation();
  await Promise.all([first, second]);

  assert.deepEqual(calls, [
    'clear-admin-state',
    'logout-store',
    'revoke-server',
    'replace:/auth/login',
  ]);
});
