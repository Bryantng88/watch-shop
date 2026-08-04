#!/usr/bin/env bash
# This script is mounted directly into a Linux container; keep LF line endings.
set -Eeuo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: restore-drill.sh /backups/watch-shop-TIMESTAMP.dump" >&2
  exit 1
fi

dump_path="$1"
if [[ "$dump_path" != /backups/watch-shop-*.dump ]] || [[ ! -f "$dump_path" ]]; then
  echo "Dump must be an existing watch-shop backup below /backups" >&2
  exit 1
fi

if [[ -z "${RESTORE_TEST_DATABASE_URL:-}" ]]; then
  echo "RESTORE_TEST_DATABASE_URL is required and must target a disposable DB" >&2
  exit 1
fi

if [[ -f "$dump_path.sha256" ]]; then
  dump_dir="$(dirname -- "$dump_path")"
  dump_name="$(basename -- "$dump_path")"
  (
    cd -- "$dump_dir"
    sha256sum --check "$dump_name.sha256"
  )
fi

pg_restore --list "$dump_path" >/dev/null
echo "Archive is readable. Restoring into the explicitly supplied disposable DB."
pg_restore \
  --dbname="$RESTORE_TEST_DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  "$dump_path"

psql "$RESTORE_TEST_DATABASE_URL" \
  --set=ON_ERROR_STOP=1 \
  --command='SELECT COUNT(*) AS prisma_migration_count FROM public._prisma_migrations;'

echo "Restore drill completed. Keep this database isolated from production traffic."
