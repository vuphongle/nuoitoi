import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldHoldAdminShell } from './admin-layout-state.ts';

test('holds the admin shell until a post-mount profile result exists', () => {
  assert.equal(shouldHoldAdminShell({ isFetchedAfterMount: false, isPending: false }), true);
  assert.equal(shouldHoldAdminShell({ isFetchedAfterMount: false, isPending: true }), true);
});

test('releases the shell only after the fresh check has settled', () => {
  assert.equal(shouldHoldAdminShell({ isFetchedAfterMount: true, isPending: false }), false);
});
