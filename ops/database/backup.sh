#!/usr/bin/env bash
set -Eeuo pipefail

backup_dir="${BACKUP_DIR:-/backups}"
retention_days="${DB_BACKUP_RETENTION_DAYS:-14}"

if [[ -z "${DIRECT_URL:-}" ]]; then
  echo "DIRECT_URL is required" >&2
  exit 1
fi

if [[ "$backup_dir" != "/backups" && "$backup_dir" != /backups/* ]]; then
  echo "BACKUP_DIR must be /backups or a child of /backups" >&2
  exit 1
fi

if ! [[ "$retention_days" =~ ^[0-9]+$ ]] || (( retention_days < 1 )); then
  echo "DB_BACKUP_RETENTION_DAYS must be a positive integer" >&2
  exit 1
fi

mkdir -p "$backup_dir"
timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
final_path="$backup_dir/watch-shop-$timestamp.dump"
temp_path="$final_path.partial"

cleanup() {
  rm -f -- "$temp_path"
}
trap cleanup EXIT

echo "Creating application database backup at $final_path"
pg_dump \
  --dbname="$DIRECT_URL" \
  --format=custom \
  --compress=9 \
  --schema=public \
  --no-owner \
  --no-privileges \
  --file="$temp_path"

pg_restore --list "$temp_path" >/dev/null
mv -- "$temp_path" "$final_path"
sha256sum "$final_path" >"$final_path.sha256"

# Retention applies only to files created by this script inside the validated
# backup mount. Weekly/monthly copies should live in separate directories.
find "$backup_dir" -maxdepth 1 -type f \
  \( -name 'watch-shop-*.dump' -o -name 'watch-shop-*.dump.sha256' \) \
  -mtime "+$retention_days" -delete

echo "Backup completed: $final_path"
