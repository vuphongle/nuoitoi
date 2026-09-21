import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeJwtPayload,
  getSessionSecret,
  createSignedSessionToken,
  verifySignedSessionToken,
  isValidAdminSessionToken,
} from './auth.ts';

test('decodeJwtPayload returns claims for valid jwt shape', () => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ userId: 1, role: 'admin', exp: 1999999999 })
  ).toString('base64url');
  const fakeToken = header + '.' + payload + '.signature';

  const result = decodeJwtPayload(fakeToken);
  assert.equal(result?.userId, 1);
  assert.equal(result?.role, 'admin');
});

test('signed session rejects forged or tampered tokens', async () => {
  const secret = 'super-secret-key-1234567890123456';
  const signed = await createSignedSessionToken(
    { accessToken: 'raw.token.here', userId: 1, role: 'admin', exp: 1999999999 },
    secret
  );

  const valid = await verifySignedSessionToken(signed, secret);
  assert.equal(valid?.role, 'admin');
  assert.equal(valid?.userId, 1);

  const [payload, signature] = signed.split('.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  decoded.role = 'superadmin';
  const tampered = Buffer.from(JSON.stringify(decoded)).toString('base64url') + '.' + signature;
  assert.equal(await verifySignedSessionToken(tampered, secret), null);
});

test('isValidAdminSessionToken blocks non-admin and expired tokens', async () => {
  const secret = 'super-secret-key-1234567890123456';
  const adminSession = await createSignedSessionToken(
    { accessToken: 'raw.token.here', userId: 1, role: 'admin', exp: 1999999999 },
    secret
  );
  const userSession = await createSignedSessionToken(
    { accessToken: 'raw.token.here', userId: 2, role: 'user', exp: 1999999999 },
    secret
  );
  const expiredSession = await createSignedSessionToken(
    { accessToken: 'raw.token.here', userId: 1, role: 'admin', exp: 1000 },
    secret
  );

  assert.equal(await isValidAdminSessionToken(adminSession, secret), true);
  assert.equal(await isValidAdminSessionToken(userSession, secret), false);
  assert.equal(await isValidAdminSessionToken(expiredSession, secret), false);
  assert.equal(await isValidAdminSessionToken('forged.raw.jwt', secret), false);
});

test('getSessionSecret fails closed when no session secret is configured', () => {
  const previous = process.env.AUTH_SESSION_SECRET;
  delete process.env.AUTH_SESSION_SECRET;

  try {
    assert.equal(getSessionSecret(), null);
  } finally {
    if (previous === undefined) {
      delete process.env.AUTH_SESSION_SECRET;
    } else {
      process.env.AUTH_SESSION_SECRET = previous;
    }
  }
});
