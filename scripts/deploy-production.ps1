param(
  [string]$NasHost = "192.168.1.253",
  [int]$NasPort = 22253,
  [string]$NasUser = "user",
  [string]$SshKey = "$env:USERPROFILE\.ssh\watchshop_nas_ed25519"
)

$ErrorActionPreference = "Stop"

function Run([string]$Command) {
  & cmd /c $Command
  if ($LASTEXITCODE -ne 0) { throw "Command failed: $Command" }
}

$branch = (git branch --show-current).Trim()
if ($branch -ne "main") { throw "Production release must be created from main, not '$branch'." }
if (git status --porcelain) { throw "Working tree must be clean before a production release." }

Run "git fetch origin main --tags"
$commit = (git rev-parse HEAD).Trim()
$remoteCommit = (git rev-parse origin/main).Trim()
if ($commit -ne $remoteCommit) { throw "HEAD must exactly match origin/main." }

$tag = (git tag --points-at HEAD | Where-Object { $_ -like "production-*" } | Select-Object -First 1)
if (-not $tag) { throw "HEAD must have a production-* tag before deployment." }

$short = (git rev-parse --short=8 HEAD).Trim()
$imageTag = "release-$short"
$archive = "watch-shop-release-$short.tar.gz"
$remoteRoot = "/share/homes/$NasUser"
$remoteRelease = "$remoteRoot/releases/$imageTag"
$docker = "/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker"

Run "git archive --format=tar.gz --output=$archive HEAD"
Run "scp -O -P $NasPort -i `"$SshKey`" $archive ${NasUser}@${NasHost}:$remoteRoot/"

$prepare = "set -e; mkdir -p '$remoteRelease'; tar -xzf '$remoteRoot/$archive' -C '$remoteRelease'; cp /share/WatchShop/app/.env.production '$remoteRelease/.env.production'; cp /share/WatchShop/app/.env.build '$remoteRelease/.env.build'; printf '%s\n' '$commit' > '$remoteRelease/RELEASE_COMMIT'; printf '%s\n' '$tag' > '$remoteRelease/RELEASE_TAG'"
Run "ssh -p $NasPort -i `"$SshKey`" ${NasUser}@${NasHost} `"$prepare`""

$build = "cd '$remoteRelease'; export IMAGE_TAG='$imageTag'; export DOCKER_BUILDKIT=1; $docker compose --env-file .env.production build app migrate"
$built = $false
for ($attempt = 1; $attempt -le 3 -and -not $built; $attempt++) {
  & ssh -p $NasPort -i $SshKey "${NasUser}@${NasHost}" $build
  $built = $LASTEXITCODE -eq 0
}
if (-not $built) { throw "Production image build failed after 3 attempts." }

# Apply additive migrations and refresh the versioned Watch List read model
# before the new web container starts serving traffic.
$prepareData = "set -e; cd '$remoteRelease'; export IMAGE_TAG='$imageTag'; $docker compose -p watch-shop --env-file .env.production run --rm migrate; $docker compose -p watch-shop --env-file .env.production run --rm migrate npm run projection:rebuild-watch-list"
Run "ssh -p $NasPort -i `"$SshKey`" ${NasUser}@${NasHost} `"$prepareData`""

$deploy = "set -e; PREVIOUS=`$($docker inspect watch-shop-app-1 --format='{{.Config.Image}}'); printf '%s\n' `"`$PREVIOUS`" > '$remoteRelease/PREVIOUS_IMAGE'; cd '$remoteRelease'; export IMAGE_TAG='$imageTag'; $docker compose -p watch-shop --env-file .env.production up -d --no-deps app; for i in 1 2 3 4 5 6 7 8 9 10; do STATUS=`$($docker inspect watch-shop-app-1 --format='{{.State.Health.Status}}' 2>/dev/null || true); [ `"`$STATUS`" = healthy ] && exit 0; sleep 3; done; exit 1"
Run "ssh -p $NasPort -i `"$SshKey`" ${NasUser}@${NasHost} `"$deploy`""

Write-Host "Production deployed: $tag ($commit), image watch-shop:$imageTag"
