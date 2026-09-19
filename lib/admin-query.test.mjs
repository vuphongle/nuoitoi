import test from 'node:test';
import assert from 'node:assert/strict';
import { clearAdminQueryState, isAdminQueryKey } from './admin-query.ts';

test('identifies only admin-scoped query keys', () => {
  assert.equal(isAdminQueryKey(['admin-profile']), true);
  assert.equal(isAdminQueryKey(['admin-users', 'list']), true);
  assert.equal(isAdminQueryKey(['products', 'list']), false);
  assert.equal(isAdminQueryKey([]), false);
});

test('removes every admin query and clears mutation results', async () => {
  let predicate;
  let mutationClears = 0;
  await clearAdminQueryState({
    cancelQueries: async ({ predicate: received }) => {
      predicate = received;
    },
    removeQueries: ({ predicate: received }) => {
      predicate = received;
    },
    getMutationCache: () => ({
      clear: () => {
        mutationClears += 1;
      },
    }),
  });

  assert.equal(predicate({ queryKey: ['admin-products'] }), true);
  assert.equal(predicate({ queryKey: ['products'] }), false);
  assert.equal(mutationClears, 1);
});

test('does not wait for cancellation before removing admin state', () => {
  let removed = false;
  const neverSettles = new Promise(() => {});

  const result = clearAdminQueryState({
    cancelQueries: () => neverSettles,
    removeQueries: () => {
      removed = true;
    },
    getMutationCache: () => ({ clear: () => {} }),
  });

  assert.equal(result, undefined);
  assert.equal(removed, true);
});
