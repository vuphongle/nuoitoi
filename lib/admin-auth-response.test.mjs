import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AdminAuthorizationError,
  AdminRoleError,
  getAdminAuthorizationStatus,
  throwIfAdminAuthorizationFailure,
} from './admin-auth-response.ts';

test('detects authorization failures from HTTP status', () => {
  assert.equal(getAdminAuthorizationStatus(401, null), 401);
  assert.equal(getAdminAuthorizationStatus(403, undefined), 403);
});

test('detects numeric and string authorization statuses from payloads', () => {
  assert.equal(getAdminAuthorizationStatus(200, { statusCode: 401 }), 401);
  assert.equal(getAdminAuthorizationStatus(200, { statusCode: '401' }), 401);
  assert.equal(getAdminAuthorizationStatus(200, { statusCode: 403 }), 403);
  assert.equal(getAdminAuthorizationStatus(200, { statusCode: '403' }), 403);
});

test('ignores successful and unrelated response statuses', () => {
  assert.equal(getAdminAuthorizationStatus(200, { statusCode: 200 }), null);
  assert.equal(getAdminAuthorizationStatus(200, { statusCode: '200' }), null);
  assert.equal(getAdminAuthorizationStatus(500, { statusCode: 422 }), null);
  assert.equal(getAdminAuthorizationStatus(200, { status: 401 }), null);
  assert.equal(getAdminAuthorizationStatus(undefined, 'not an object'), null);
});

test('payload authorization status takes precedence over HTTP status', () => {
  assert.equal(getAdminAuthorizationStatus(401, { statusCode: 403 }), 403);
  assert.equal(getAdminAuthorizationStatus(403, { statusCode: '401' }), 401);
  assert.equal(getAdminAuthorizationStatus(401, { statusCode: 422 }), 401);
});

test('authorization errors expose status and prefer a backend message', () => {
  const backendError = new AdminAuthorizationError(403, {
    message: 'Administrators only',
  });
  assert.equal(backendError.name, 'AdminAuthorizationError');
  assert.equal(backendError.status, 403);
  assert.equal(backendError.message, 'Administrators only');

  const fallbackError = new AdminAuthorizationError(401, { message: '' });
  assert.equal(fallbackError.message, 'Admin authorization failed with status 401');
});

test('throws normalized authorization failures and returns for ordinary responses', () => {
  assert.throws(
    () => throwIfAdminAuthorizationFailure(200, { statusCode: '403', message: 'Session denied' }),
    (error) => {
      assert.ok(error instanceof AdminAuthorizationError);
      assert.equal(error.status, 403);
      assert.equal(error.message, 'Session denied');
      return true;
    }
  );

  assert.doesNotThrow(() => throwIfAdminAuthorizationFailure(200, { success: true }));
});

test('role errors are distinct from transport authorization failures', () => {
  const error = new AdminRoleError('Administrator role required');
  assert.equal(error.name, 'AdminRoleError');
  assert.equal(error.message, 'Administrator role required');
  assert.ok(!(error instanceof AdminAuthorizationError));
});
