import assert from 'node:assert/strict';
import test from 'node:test';

import { getAdminStatusConfig, normalizeAdminStatus } from './admin-status.ts';

test('maps canonical admin statuses to consistent semantic tones', () => {
  const expectedTones = {
    draft: 'gray',
    published: 'green',
    active: 'green',
    pending: 'yellow',
    admin: 'yellow',
    archived: 'zinc',
    deleted: 'red',
    inactive: 'red',
    editor: 'blue',
    user: 'gray',
  };

  for (const [status, tone] of Object.entries(expectedTones)) {
    assert.equal(getAdminStatusConfig(status).tone, tone, `${status} must use the ${tone} tone`);
  }
});

test('normalizes case and whitespace before resolving status styles', () => {
  assert.equal(normalizeAdminStatus('  PuBLished  '), 'published');
  assert.equal(getAdminStatusConfig('  ACTIVE ').tone, 'green');
  assert.equal(getAdminStatusConfig(' Editor ').tone, 'blue');
});

test('handles unknown and non-string status values with the neutral gray fallback', () => {
  for (const value of ['unrecognized', '', null, undefined, 42, {}, []]) {
    const config = getAdminStatusConfig(value);
    assert.equal(config.tone, 'gray');
    assert.match(config.className, /gray/);
  }
});
