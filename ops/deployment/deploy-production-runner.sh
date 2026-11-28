#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf '[deploy] %s\n' "$*"
}

die() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

release_tag="${RELEASE_TAG:-}"
expected_release_sha="${EXPECTED_RELEASE_SHA:-}"
config_dir="${WATCHSHOP_CONFIG_DIR:-/share/WatchShop/app}"
release_root="${WATCHSHOP_RELEASE_ROOT:-/share/WatchShop/releases}"
docker_bin="${WATCHSHOP_DOCKER_BIN:-/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker}"
keep_releases="${WATCHSHOP_KEEP_RELEASES:-5}"
project_name="watch-shop"
container_name="watch-shop-app-1"

[[ "$release_tag" == production-* ]] || die "RELEASE_TAG must match production-*"
[[ "$keep_releases" =~ ^[1-9][0-9]*$ ]] || die "WATCHSHOP_KEEP_RELEASES must be a positive integer"
[[ "$release_root" == /* && "$release_root" != "/" ]] || die "WATCHSHOP_RELEASE_ROOT must be a safe absolute path"
if [[ ! -x "$docker_bin" ]] && command -v docker >/dev/null 2>&1; then
  docker_bin="$(command -v docker)"
fi
[[ -x "$docker_bin" ]] || die "Docker executable not found at $docker_bin"
[[ -f "$config_dir/.env.production" ]] || die "Missing $config_dir/.env.production"
[[ -f "$config_dir/.env.build" ]] || die "Missing $config_dir/.env.build"

git fetch --quiet origin main --tags
tag_commit="$(git rev-list -n 1 "$release_tag")"
head_commit="$(git rev-parse HEAD)"
main_commit="$(git rev-parse origin/main)"

[[ "$head_commit" == "$tag_commit" ]] || die "Checked-out commit does not match $release_tag"
[[ "$tag_commit" == "$main_commit" ]] || die "$release_tag must point to the current origin/main commit"
if [[ -n "$expected_release_sha" ]]; then
  [[ "$expected_release_sha" =~ ^[0-9a-f]{40}$ ]] || die "Expected release SHA must be a full commit SHA"
  approved_commit="$(git rev-parse --verify "${expected_release_sha}^{commit}")" || die "Expected release SHA cannot be resolved"
  [[ "$tag_commit" == "$approved_commit" ]] || die "Release tag does not match the approved SHA"
fi

short_commit="$(git rev-parse --short=8 "$tag_commit")"
image_tag="release-$short_commit"
release_dir="$release_root/$image_tag"

mkdir -p "$release_root"
source "$(dirname "${BASH_SOURCE[0]}")/release-workspace.sh"
resume_build=false
if [[ -e "$release_dir" ]]; then
  active_image="$($docker_bin inspect "$container_name" --format='{{.Config.Image}}' 2>/dev/null || true)"
  retryable_release_workspace "$release_dir" "$tag_commit" "$release_tag" "$active_image" "watch-shop:$image_tag" "$config_dir" \
    || die "Existing release is not a safe build-only retry; preserve it for inspection"
  resume_build=true
fi

staging_dir="$(mktemp -d "$release_root/.staging-${image_tag}.XXXXXX")"
cleanup_staging() {
  if [[ -n "${staging_dir:-}" && -d "$staging_dir" ]]; then
    rm -rf -- "$staging_dir"
  fi
}
trap cleanup_staging EXIT

log "Preparing $release_tag ($tag_commit)"
git archive "$tag_commit" | tar -x -C "$staging_dir"
cp "$config_dir/.env.production" "$staging_dir/.env.production"
cp "$config_dir/.env.build" "$staging_dir/.env.build"
printf '%s\n' "$tag_commit" > "$staging_dir/RELEASE_COMMIT"
printf '%s\n' "$release_tag" > "$staging_dir/RELEASE_TAG"
printf '%s\n' "$tag_commit" > "$staging_dir/.build-retry-allowed"
if [[ "$resume_build" == true ]]; then
  failed_build_dir="$(mktemp -d "$release_root/.failed-build-${image_tag}.XXXXXX")"
  rmdir -- "$failed_build_dir"
  mv -- "$release_dir" "$failed_build_dir"
  log "Retrying the approved build from a fresh source archive; previous workspace retained"
fi
mv "$staging_dir" "$release_dir"
staging_dir=""

cd "$release_dir"
export IMAGE_TAG="$image_tag"
export DOCKER_BUILDKIT=1

compose() {
  "$docker_bin" compose -p "$project_name" --env-file .env.production "$@"
}

previous_image="$($docker_bin inspect "$container_name" --format='{{.Config.Image}}' 2>/dev/null || true)"
printf '%s\n' "$previous_image" > PREVIOUS_IMAGE

log "Building application and operations images sequentially"
build_ok=false
for attempt in 1 2 3; do
  if compose build app && compose build migrate; then
    build_ok=true
    break
  fi
  log "Build attempt $attempt failed"
  [[ "$attempt" == 3 ]] || sleep "$((attempt * 10))"
done
[[ "$build_ok" == true ]] || die "Production image build failed after 3 attempts"

log "Preparing the intake-name worker update from its current immutable image"
previous_worker_image="$($docker_bin inspect watch-shop-production-ben-worker --format='{{.Image}}')"
[[ "$previous_worker_image" =~ ^sha256:[0-9a-f]{64}$ ]] || die "Cannot identify previous Ben worker image"
printf '%s\n' "$previous_worker_image" > PREVIOUS_WORKER_IMAGE
"$docker_bin" build -f ops/deployment/Dockerfile.ben-quick-name \
  --build-arg "BASE_WORKER_IMAGE=$previous_worker_image" \
  --label "org.opencontainers.image.revision=$tag_commit" \
  -t "watch-shop-ben:$image_tag" .
new_worker_image="$($docker_bin image inspect "watch-shop-ben:$image_tag" --format='{{.Id}}')"
[[ "$new_worker_image" =~ ^sha256:[0-9a-f]{64}$ ]] || die "Cannot identify candidate Ben worker image"

# Once database operations begin, this workspace must never be auto-resumed.
rm -f -- "$release_dir/.build-retry-allowed"
log "Backing up the production database"
compose --profile tools run --rm db-backup

log "Applying database migrations"
compose --profile tools run --rm migrate

log "Refreshing the Watch List projection"
compose --profile tools run --rm migrate npm run projection:rebuild-watch-list

reattach_ben() {
  "$docker_bin" run --rm --network none --user 0 --entrypoint node \
    -e "BEN_WORKER_IMAGE=$1" \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$release_dir/ops/deployment/reattach-ben-worker.cjs:/reattach-ben-worker.cjs:ro" \
    "watch-shop:$image_tag" /reattach-ben-worker.cjs
}

log "Starting application image watch-shop:$image_tag"
compose up -d --no-deps app

healthy=false
for _ in $(seq 1 20); do
  status="$($docker_bin inspect "$container_name" --format='{{.State.Health.Status}}' 2>/dev/null || true)"
  if [[ "$status" == "healthy" ]]; then
    healthy=true
    break
  fi
  sleep 3
done

if [[ "$healthy" != true ]]; then
  log "Health check failed for watch-shop:$image_tag"
  if [[ -n "$previous_image" ]] && "$docker_bin" image inspect "$previous_image" >/dev/null 2>&1; then
    log "Rolling the application image back to $previous_image"
    "$docker_bin" tag "$previous_image" "watch-shop:$image_tag"
    compose up -d --no-deps --force-recreate app
    for _ in $(seq 1 20); do
      status="$($docker_bin inspect "$container_name" --format='{{.State.Health.Status}}' 2>/dev/null || true)"
      [[ "$status" == healthy ]] && break
      sleep 3
    done
    reattach_ben "$previous_worker_image" || log "ERROR: Ben worker recovery needs attention"
  else
    log "No previous application image is available for automatic rollback"
  fi
  die "Deployment failed health checks"
fi

log "Attaching Ben worker to current application"
if ! reattach_ben "$new_worker_image"; then
  if [[ -n "$previous_image" ]] && "$docker_bin" image inspect "$previous_image" >/dev/null 2>&1; then
    log "Rolling back after Ben worker verification failed"
    "$docker_bin" tag "$previous_image" "watch-shop:$image_tag"
    compose up -d --no-deps --force-recreate app
    for _ in $(seq 1 20); do
      status="$($docker_bin inspect "$container_name" --format='{{.State.Health.Status}}' 2>/dev/null || true)"
      [[ "$status" == healthy ]] && break
      sleep 3
    done
    reattach_ben "$previous_worker_image" || log "ERROR: Ben worker recovery needs attention"
  fi
  die "Deployment failed Ben worker verification"
fi

log "Starting notification worker"
compose up -d --no-deps notifications

ln -sfn "$release_dir" "$release_root/current"

log "Removing old release directories; keeping the newest $keep_releases"
mapfile -t old_releases < <(
  find "$release_root" -mindepth 1 -maxdepth 1 -type d -name 'release-*' -printf '%T@ %p\n' \
    | sort -nr \
    | tail -n "+$((keep_releases + 1))" \
    | cut -d' ' -f2-
)
for old_release in "${old_releases[@]}"; do
  [[ "$old_release" == "$release_root"/release-* ]] || die "Refusing to remove unexpected path: $old_release"
  [[ "$old_release" == "$release_dir" ]] && continue

  if ! rm -rf -- "$old_release"; then
    log "WARNING: Could not fully remove old release $old_release; check its ownership and permissions"
  elif [[ -e "$old_release" ]]; then
    log "WARNING: Old release still exists after cleanup: $old_release"
  fi
done

log "Production deployed successfully: $release_tag ($tag_commit), image watch-shop:$image_tag"
