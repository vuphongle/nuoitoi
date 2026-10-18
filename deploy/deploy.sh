#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $(id -u) != 0 ]]; then
  echo 'Run this script as root.' >&2
  exit 1
fi
umask 022

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
deploy_root=${SAOKE_DEPLOY_ROOT:-/opt/saoke}
env_dir=${SAOKE_ENV_DIR:-/etc/saoke}
unit_dir=${SAOKE_SYSTEMD_DIR:-/etc/systemd/system}
cd -- "$repo_dir"

for command in node npm npx rsync flock systemctl systemd-analyze curl git; do
  command -v "$command" >/dev/null
done
id saoke >/dev/null
test -r "$env_dir/frontend.env"
test -r "$env_dir/backend.env"
mkdir -p "$deploy_root/releases"
exec 9>"$deploy_root/deploy.lock"
flock -n 9 || { echo 'Another deployment is running.' >&2; exit 1; }

# Build away from the running release. Never evaluate environment files as shell code.
NODE_ENV=development npx --yes pnpm@10.34.7 install --frozen-lockfile
npm --prefix backend ci --include=dev --no-audit --no-fund
node - "$env_dir/frontend.env" <<'NODE'
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const dotenv = require('./backend/node_modules/dotenv');
const env = dotenv.parse(fs.readFileSync(process.argv[2]));
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, ...env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
NODE
npm run build:backend

release_id="$(date -u +%Y%m%dT%H%M%S)-$(git rev-parse --short HEAD)"
release_dir="$deploy_root/releases/$release_id"
mkdir "$release_dir"
mkdir -p "$release_dir/frontend/.next/static" "$release_dir/backend"
rsync -a --exclude='.env' --exclude='.env.*' .next/standalone/ "$release_dir/frontend/"
rsync -a public/ "$release_dir/frontend/public/"
rsync -a .next/static/ "$release_dir/frontend/.next/static/"
rsync -a backend/dist/ "$release_dir/backend/dist/"
rsync -a backend/node_modules/ "$release_dir/backend/node_modules/"
install -m 0644 backend/package.json "$release_dir/backend/package.json"
mkdir -p "$release_dir/frontend/.next/cache"
chown -R saoke:saoke "$release_dir/frontend/.next/cache"
test -f "$release_dir/frontend/server.js"
test -f "$release_dir/backend/dist/main.js"

previous_release=''
if [[ -L "$deploy_root/current" ]]; then
  previous_release=$(readlink -f "$deploy_root/current")
elif [[ -e "$deploy_root/current" ]]; then
  echo "$deploy_root/current must be a symlink." >&2
  exit 1
elif [[ -f "$deploy_root/frontend/server.js" && -f "$deploy_root/backend/dist/main.js" ]]; then
  # Preserve the original deployment during the first migration to releases.
  previous_release=$deploy_root
fi

switch_release() {
  ln -s -- "$1" "$next_link" || return
  mv -Tf -- "$next_link" "$deploy_root/current"
}

rollback() {
  local status=$?
  trap - EXIT INT TERM
  if (( status == 0 )); then return; fi
  rm -f -- "$next_link"
  echo 'Deployment failed.' >&2
  for unit in saoke.service saoke-backend.service; do
    if [[ -f "$unit_backup/$unit" ]]; then
      cp -- "$unit_backup/$unit" "$unit_dir/$unit"
    fi
  done
  systemctl daemon-reload || true
  if [[ -n "$previous_release" ]]; then
    echo "Restoring $previous_release" >&2
    if switch_release "$previous_release"; then
      systemctl restart saoke-backend.service saoke.service || true
    fi
  else
    systemctl stop saoke.service saoke-backend.service || true
    echo 'No previous release is available.' >&2
  fi
  exit "$status"
}

systemd-analyze verify deploy/saoke.service deploy/saoke-backend.service
next_link="$deploy_root/.current-$$"
unit_backup="$release_dir/previous-units"
mkdir "$unit_backup"
for unit in saoke.service saoke-backend.service; do
  if [[ -f "$unit_dir/$unit" ]]; then
    cp -- "$unit_dir/$unit" "$unit_backup/$unit"
  fi
done
trap rollback EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
switch_release "$release_dir"
install -m 0644 deploy/saoke.service deploy/saoke-backend.service "$unit_dir/"
systemctl daemon-reload
systemctl enable saoke-backend.service saoke.service
systemctl restart saoke-backend.service saoke.service

wait_for_url() {
  local url=$1
  for (( attempt=0; attempt<30; attempt++ )); do
    if curl --fail --silent --show-error --location --max-time 3 "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  echo "Health check failed: $url" >&2
  return 1
}

wait_for_url http://127.0.0.1:3069/api/health
wait_for_url http://127.0.0.1:3000/vi
wait_for_url http://127.0.0.1:3000/api/public/lixi-sessions
trap - EXIT INT TERM
echo "Deployed $release_id"
echo 'Previous releases are retained under the releases directory.'
