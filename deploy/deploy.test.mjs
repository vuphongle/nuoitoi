import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

function deployFixture(t, overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), 'saoke-deploy-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const repo = join(root, 'repo');
  const target = join(root, 'runtime');
  const envDir = join(root, 'env');
  const unitDir = join(root, 'units');
  const bin = join(root, 'bin');
  const log = join(root, 'commands.log');
  for (const dir of [repo, target, envDir, unitDir, bin]) mkdirSync(dir);
  for (const path of [
    'deploy',
    '.next/standalone',
    '.next/static',
    'public',
    'backend/dist',
    'backend/node_modules',
  ]) {
    mkdirSync(join(repo, path), { recursive: true });
  }
  for (const file of ['deploy.sh', 'saoke.service', 'saoke-backend.service']) {
    copyFileSync(new URL(file, import.meta.url), join(repo, 'deploy', file));
  }
  for (const file of ['frontend.env', 'backend.env']) {
    writeFileSync(join(envDir, file), 'TEST_VALUE=fixture\n');
  }
  writeFileSync(join(repo, '.next/standalone/server.js'), '// frontend\n');
  writeFileSync(join(repo, '.next/standalone/.env'), 'SECRET=must-not-deploy\n');
  writeFileSync(join(repo, '.next/standalone/.env.production'), 'SECRET=excluded\n');
  writeFileSync(join(repo, '.next/static/app.js'), '// static\n');
  writeFileSync(join(repo, 'public/asset.txt'), 'public asset\n');
  writeFileSync(join(repo, 'backend/dist/main.js'), '// backend\n');
  writeFileSync(join(repo, 'backend/package.json'), '{}\n');
  writeFileSync(join(repo, 'backend/node_modules/runtime.js'), '// dependency\n');
  const previous = join(target, 'previous');
  mkdirSync(previous);
  symlinkSync(previous, join(target, 'current'));
  for (const file of ['saoke.service', 'saoke-backend.service']) {
    writeFileSync(join(unitDir, file), `previous ${file}\n`);
  }

  // Mock only builds and host services. File staging and symlink changes are real.
  const commandStub = `#!/usr/bin/env bash
set -e
name=$(basename "$0")
printf '%s %s\\n' "$name" "$*" >> "$MOCK_LOG"
case "$name" in
  id) if [[ "$1" == -u ]]; then echo 0; fi ;;
  git) echo fixture123 ;;
  npm) if [[ "$FAIL_BUILD" == 1 && "$*" == 'run build:backend' ]]; then exit 7; fi ;;
  systemctl)
    if [[ "$FAIL_RESTART" == 1 && "$1" == restart && ! -f "$MOCK_LOG.failed" ]]; then
      touch "$MOCK_LOG.failed"
      exit 9
    fi
    ;;
  curl) if [[ "$FAIL_HEALTH" == 1 ]]; then exit 22; fi ;;
esac
`;
  for (const command of [
    'id',
    'git',
    'npm',
    'npx',
    'node',
    'chown',
    'systemctl',
    'systemd-analyze',
    'curl',
    'sleep',
  ]) {
    writeFileSync(join(bin, command), commandStub, { mode: 0o755 });
  }
  const result = spawnSync('bash', [join(repo, 'deploy/deploy.sh')], {
    encoding: 'utf8',
    timeout: 20000,
    env: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH}`,
      SAOKE_DEPLOY_ROOT: target,
      SAOKE_ENV_DIR: envDir,
      SAOKE_SYSTEMD_DIR: unitDir,
      MOCK_LOG: log,
      ...overrides,
    },
  });
  return { result, target, previous, unitDir, log: readFileSync(log, 'utf8') };
}

test('stages a complete release, excludes secrets, then activates and checks it', (t) => {
  const { result, target, previous, log } = deployFixture(t);
  assert.equal(result.status, 0, result.stderr);
  const release = readlinkSync(join(target, 'current'));
  assert.notEqual(release, previous);
  for (const file of [
    'frontend/server.js',
    'frontend/public/asset.txt',
    'frontend/.next/static/app.js',
    'backend/dist/main.js',
    'backend/node_modules/runtime.js',
    'backend/package.json',
  ]) {
    assert.ok(existsSync(join(release, file)), file);
  }
  assert.ok(!existsSync(join(release, 'frontend/.env')));
  assert.ok(!existsSync(join(release, 'frontend/.env.production')));
  assert.match(log, /systemctl restart saoke-backend.service saoke.service/);
  assert.match(log, /curl .*127\.0\.0\.1:3069\/api\/health/);
  assert.match(log, /curl .*127\.0\.0\.1:3000\/vi/);
  assert.match(log, /curl .*127\.0\.0\.1:3000\/api\/public\/lixi-sessions/);
});

test('failed health checks restore the previous release and service definitions', (t) => {
  const { result, target, previous, unitDir, log } = deployFixture(t, { FAIL_HEALTH: '1' });
  assert.equal(result.status, 1, result.stderr);
  assert.equal(readlinkSync(join(target, 'current')), previous);
  for (const file of ['saoke.service', 'saoke-backend.service']) {
    assert.equal(readFileSync(join(unitDir, file), 'utf8'), `previous ${file}\n`);
  }
  assert.equal((log.match(/systemctl restart /g) || []).length, 2);
  assert.ok(!readdirSync(target).some((name) => name.startsWith('.current-')));
});

test('failed builds leave the running release and services untouched', (t) => {
  const { result, target, previous, log } = deployFixture(t, { FAIL_BUILD: '1' });
  assert.equal(result.status, 7, result.stderr);
  assert.equal(readlinkSync(join(target, 'current')), previous);
  assert.deepEqual(readdirSync(join(target, 'releases')), []);
  assert.doesNotMatch(log, /systemctl restart /);
});

test('failed service activation restores the previous release and exit status', (t) => {
  const { result, target, previous, log } = deployFixture(t, { FAIL_RESTART: '1' });
  assert.equal(result.status, 9, result.stderr);
  assert.equal(readlinkSync(join(target, 'current')), previous);
  assert.equal((log.match(/systemctl restart /g) || []).length, 2);
});
