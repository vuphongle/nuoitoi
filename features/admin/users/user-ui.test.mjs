import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('./components/user-list.tsx', import.meta.url), 'utf8');

test('centers the desktop user action header and body cell', () => {
  assert.match(
    source,
    /<TableHead className="w-16 text-center">\s*<span className="block">Thao<\/span>\s*<span className="block">tác<\/span>\s*<\/TableHead>\s*<\/TableRow>/
  );
  assert.match(source, /<TableCell className="text-center">\s*<UserActions/);
});
