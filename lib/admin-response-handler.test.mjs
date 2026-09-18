import test from 'node:test';
import assert from 'node:assert/strict';
import { AdminAuthorizationError } from './admin-auth-response.ts';
import { handleAdminResponse } from './admin-response-handler.ts';

for (const input of [
  { httpStatus: 401, payload: null, expectedStatus: 401 },
  { httpStatus: 403, payload: undefined, expectedStatus: 403 },
  { httpStatus: 200, payload: { statusCode: 401 }, expectedStatus: 401 },
  { httpStatus: 200, payload: { statusCode: '403' }, expectedStatus: 403 },
]) {
  test(`cleans up and rejects admin authorization status ${input.expectedStatus}`, async () => {
    let cleanupCalls = 0;

    await assert.rejects(
      () =>
        handleAdminResponse({
          httpStatus: input.httpStatus,
          payload: input.payload,
          cleanup: async () => {
            cleanupCalls += 1;
          },
        }),
      (error) => {
        assert.ok(error instanceof AdminAuthorizationError);
        assert.equal(error.status, input.expectedStatus);
        return true;
      }
    );

    assert.equal(cleanupCalls, 1);
  });
}

test('returns ordinary successful payloads without cleanup', async () => {
  let cleanupCalls = 0;

  await handleAdminResponse({
    httpStatus: 200,
    payload: { statusCode: 200, data: { id: 1 } },
    cleanup: async () => {
      cleanupCalls += 1;
    },
  });

  assert.equal(cleanupCalls, 0);
});
