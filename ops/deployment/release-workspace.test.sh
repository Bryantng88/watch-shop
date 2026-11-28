#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/release-workspace.sh"
fixture="$(mktemp -d)"
trap 'rm -rf -- "$fixture"' EXIT
mkdir "$fixture/release" "$fixture/config"
printf 'synthetic-runtime\n' > "$fixture/config/.env.production"
printf 'synthetic-build\n' > "$fixture/config/.env.build"
cp "$fixture/config/.env.production" "$fixture/release/.env.production"
cp "$fixture/config/.env.build" "$fixture/release/.env.build"
printf 'approved-sha\n' > "$fixture/release/RELEASE_COMMIT"
printf 'production-fixture\n' > "$fixture/release/RELEASE_TAG"
check() { retryable_release_workspace "$fixture/release" approved-sha production-fixture "$1" candidate "$fixture/config"; }
if check previous; then exit 1; fi # Legacy/unmarked workspaces fail closed.
printf 'approved-sha\n' > "$fixture/release/.build-retry-allowed"
check previous
if check candidate; then exit 1; fi # Already active releases cannot be resumed.
printf 'changed\n' > "$fixture/config/.env.production"
if check previous; then exit 1; fi # Configuration drift must not be overwritten.
cp "$fixture/release/.env.production" "$fixture/config/.env.production"
printf 'other-sha\n' > "$fixture/release/RELEASE_COMMIT"
if check previous; then exit 1; fi
printf 'approved-sha\n' > "$fixture/release/RELEASE_COMMIT"
rm "$fixture/release/.build-retry-allowed"
if check previous; then exit 1; fi # Database boundary removes retry permission.
echo 'PASS build-only retry guards, unchanged config, approved SHA and no retry after database boundary'
