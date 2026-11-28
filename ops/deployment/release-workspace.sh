# Build retries may reuse only a prepared, unchanged workspace that has never
# crossed the database-backup/migration boundary. No values are logged here.
retryable_release_workspace() {
  local directory="$1" sha="$2" tag="$3" active_image="$4" candidate_image="$5" config="$6"
  [[ -d "$directory" && ! -L "$directory" ]] || return 1
  [[ -f "$directory/.build-retry-allowed" ]] || return 1
  [[ "$(cat "$directory/.build-retry-allowed")" == "$sha" ]] || return 1
  [[ "$(cat "$directory/RELEASE_COMMIT")" == "$sha" ]] || return 1
  [[ "$(cat "$directory/RELEASE_TAG")" == "$tag" ]] || return 1
  [[ -n "$active_image" && "$active_image" != "$candidate_image" ]] || return 1
  cmp -s "$directory/.env.production" "$config/.env.production" || return 1
  cmp -s "$directory/.env.build" "$config/.env.build" || return 1
}
