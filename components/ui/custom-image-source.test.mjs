import assert from 'node:assert/strict';
import test from 'node:test';

import { getCustomImageSourceMode } from './custom-image-source.ts';

test('uses Next Image only for local and configured remote sources', () => {
  assert.equal(getCustomImageSourceMode('/images/product.png'), 'next');
  assert.equal(
    getCustomImageSourceMode('https://res.cloudinary.com/demo/image/upload/product.png'),
    'next'
  );
});

test('uses a browser image for unconfigured remote hosts', () => {
  assert.equal(getCustomImageSourceMode('https://example.com/image.png'), 'native');
  assert.equal(getCustomImageSourceMode('http://cdn.example.org/image.png'), 'native');
});

test('rejects malformed non-local image sources', () => {
  assert.equal(getCustomImageSourceMode('not a valid image URL'), 'fallback');
  assert.equal(getCustomImageSourceMode(''), 'fallback');
});
