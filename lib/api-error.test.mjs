import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiErrorMessage } from './api-error.ts';

test('prefers the backend response message', () => {
  assert.equal(
    getApiErrorMessage(
      { message: 'Request failed', response: { data: { message: 'Phone is invalid' } } },
      'Fallback'
    ),
    'Phone is invalid'
  );
});

test('falls back to the error message and then the localized fallback', () => {
  assert.equal(
    getApiErrorMessage(new Error('Network unavailable'), 'Fallback'),
    'Network unavailable'
  );
  assert.equal(getApiErrorMessage(null, 'Fallback'), 'Fallback');
});
