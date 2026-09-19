import assert from 'node:assert/strict';
import test from 'node:test';

import { getAdminPaginationModel } from './admin-pagination-model.ts';

test('sanitizes invalid page totals without allocating pagination items', () => {
  for (const totalPages of [Number.NaN, Number.POSITIVE_INFINITY, -10, -1, 0]) {
    assert.deepEqual(getAdminPaginationModel(4, totalPages), {
      currentPage: 0,
      totalPages: 0,
      hasPrevious: false,
      hasNext: false,
      items: [],
    });
  }
});

test('clamps invalid current pages into the available range', () => {
  assert.equal(getAdminPaginationModel(-20, 10).currentPage, 1);
  assert.equal(getAdminPaginationModel(Number.NaN, 10).currentPage, 1);
  assert.equal(getAdminPaginationModel(Number.POSITIVE_INFINITY, 10).currentPage, 1);
  assert.equal(getAdminPaginationModel(99, 10).currentPage, 10);
  assert.equal(getAdminPaginationModel(4.9, 10.8).currentPage, 4);
});

test('returns every page for small totals and accurate boundary state', () => {
  assert.deepEqual(getAdminPaginationModel(1, 5), {
    currentPage: 1,
    totalPages: 5,
    hasPrevious: false,
    hasNext: true,
    items: [1, 2, 3, 4, 5],
  });

  assert.deepEqual(getAdminPaginationModel(5, 5), {
    currentPage: 5,
    totalPages: 5,
    hasPrevious: true,
    hasNext: false,
    items: [1, 2, 3, 4, 5],
  });
});

test('keeps large pagination windows bounded with ellipsis markers', () => {
  assert.deepEqual(getAdminPaginationModel(1, 1_000_000).items, [
    1,
    2,
    3,
    4,
    5,
    'ellipsis',
    1_000_000,
  ]);
  assert.deepEqual(getAdminPaginationModel(500_000, 1_000_000).items, [
    1,
    'ellipsis',
    499_999,
    500_000,
    500_001,
    'ellipsis',
    1_000_000,
  ]);
  assert.deepEqual(getAdminPaginationModel(1_000_000, 1_000_000).items, [
    1,
    'ellipsis',
    999_996,
    999_997,
    999_998,
    999_999,
    1_000_000,
  ]);

  for (const currentPage of [1, 4, 500_000, 999_997, 1_000_000]) {
    assert.ok(getAdminPaginationModel(currentPage, 1_000_000).items.length <= 7);
  }
});
