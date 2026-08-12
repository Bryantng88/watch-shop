# Release handoff: Media, Acquisition and Strap fixes

Status: local implementation complete; not committed, tagged or deployed yet.

Prepared: 2026-08-11 (Asia/Bangkok)  
Current base revision: `820b2a10` (`fix: stabilize production inventory management`)

The final release revision and immutable `IMAGE_TAG` must be filled in after the
working tree is reviewed and committed:

```text
RELEASE_SHA=<full Git commit SHA>
IMAGE_TAG=release-<short SHA>
```

Do not deploy from an uncommitted working tree and do not reuse
`watch-shop-release-820b2a10.tar.gz`. That archive predates this release and is
not part of the source release.

## Release scope

### Acquisition and Trade-in

- Reject approval/posting of zero-value acquisitions with a user-facing error.
- Prevent repeated create/submit clicks from producing duplicate drafts.
- Preserve quantity, unit cost, totals and editable draft data.
- Include strap/accessory acquisitions in payment and inventory projections.
- Consolidate identical strap variants by business identity and sum stock.
- Support one Trade-in acquisition containing multiple Watches.
- Trade-in lines may reference Watches previously sold to the customer or
  external Watches supplied by the customer.
- Emit/update the relevant acquisition, payment, inventory and list projection
  events.

### Watch Media and Cover

- Add the segmented NAS Cover source: `media/{men|women|unisex}/cover`.
- A confirmed Cover is ingested into `media/objects/...`, bound with role
  `COVER`, projected to `ProductImage(COVER)` and emitted as
  `watch.cover.updated`.
- Cover selection is staged. Selecting an image does not mutate NAS or DB until
  the operator clicks `Xác nhận Cover`.
- Cover can be replaced or returned to its original Cover source folder.
- Returning is blocked if the source is unknown, the destination is occupied or
  another business object still uses the media object.
- Cover remains independent from Content/Image approval.

### Media Processing and Publish gates

Media progress is now:

```text
profile + content + gallery + cover = x/4
```

Boundary rules:

```text
Media Processing -> Publish
  requires profile + content + gallery
  Cover may be absent after an explicit warning

Publish -> Done (`mark-posted`)
  requires ProductImage(role=COVER, isForStorefront=true)
```

Both boundaries are enforced server-side. The Publish workspace exposes the
same `Xử lý media` modal so Cover can be added without recalling the item to
Media Processing.

### Activity link production fix

System activities belong to their Task/Workspace. They now open
`/admin/task-items/{taskItemId}` instead of treating `watch.id` as a route
`productId`. Watch business-event links use `metadata.productId` when present.
This fixes the production server exception seen when opening an Activity row.

## Database change

New committed migration expected in the release:

```text
prisma/migrations/20260811_acquisition_trade_in_multi_source/migration.sql
```

It performs additive/repair work:

1. adds nullable `Acquisition.sourceOrderId`;
2. adds its index and `Order` foreign key with `ON DELETE SET NULL`;
3. backfills existing Trade-in acquisitions from `sourceOrderItemId`;
4. recalculates totals for existing draft acquisitions as
   `SUM(quantity * unitCost)`.

Run only with `prisma migrate deploy` through the `migrate` Compose service.
Never run `prisma db push` in production.

The optional `strap:merge-duplicate-variants` command mutates production data.
It is not a normal migration and must not be run automatically. Run it only
after the application and migration are healthy, after a fresh backup, and only
if duplicate strap variants are confirmed. It refuses groups containing a strap
currently attached to a Watch.

## Files that must not enter the release

- `.env`, `.env.local`, `.env.production`, `.env.build` or any secret archive;
- `.next`, `.next-dev`, `node_modules`;
- database dumps;
- `watch-shop-release-820b2a10.tar.gz`;
- temporary screenshots or local test artifacts.

The NAS-owned `.env.production` and `.env.build` must be preserved in place.

## Before leaving the current development machine

1. Review the entire dirty worktree. The release intentionally includes the
   Acquisition, Trade-in, Strap, Cover, Media progress, Publish guard and
   Activity-link changes described above.
2. Confirm the new migration, Cover applications and this handoff are tracked.
3. Do not stage `watch-shop-release-820b2a10.tar.gz`.
4. Run:

```powershell
npx.cmd tsc --noEmit --pretty false --incremental false
npm.cmd run check:list-reconciliation-contract
npm.cmd run check:media-boundaries
npm.cmd run media:verify-policy
npm.cmd run build
git diff --check
```

5. Review `git diff --stat` and commit once. Push the release commit to GitHub.
6. Record the full SHA in this document or the deployment log.

Known baseline checks at preparation time:

- `check:manual-transition-outcome` reports the pre-existing bulk result string
  mismatch in `task.actions.ts`.
- `check:business-event-after-commit` reports the pre-existing
  `repair-watch-inline-media.application.ts` and Watch duplicate action.

These warnings were not introduced by the release. They must still be reviewed
before declaring a broader architecture audit fully green.

## Continue from another Windows machine

Use GitHub as the source of truth. Do not copy a dirty workspace between
machines.

```powershell
git clone https://github.com/Bryantng88/watch-shop.git watch-shop
cd watch-shop
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
```

The printed SHA must equal `RELEASE_SHA`. Then install and rerun the release
gates:

```powershell
npm.cmd ci
npx.cmd prisma generate
npx.cmd tsc --noEmit --pretty false --incremental false
npm.cmd run build
```

Create the source archive from the committed revision, not from the working
directory:

```powershell
$releaseSha = git rev-parse --short=8 HEAD
git archive --format=tar.gz --output="watch-shop-release-$releaseSha.tar.gz" HEAD
Get-FileHash -Algorithm SHA256 "watch-shop-release-$releaseSha.tar.gz"
```

Record the archive name and SHA-256 before uploading.

## Upload to the NAS

The NAS rejects direct SSH login as `admin`. Upload and log in as `user`, then
elevate with `sudo` inside the NAS shell.

```powershell
scp -P 22523 -i "$env:USERPROFILE\.ssh\watchshop_nas_ed25519" `
  "watch-shop-release-<SHORT_SHA>.tar.gz" `
  user@192.168.1.253:/share/homes/user/

ssh -p 22523 -i "$env:USERPROFILE\.ssh\watchshop_nas_ed25519" user@192.168.1.253
```

On the NAS:

```sh
sudo -i
cd /share/WatchShop/app
mv /share/homes/user/watch-shop-release-<SHORT_SHA>.tar.gz .
sha256sum watch-shop-release-<SHORT_SHA>.tar.gz
```

The NAS hash must match the Windows hash. Stop if it does not.

## NAS deployment sequence

Run as the elevated NAS administrator from `/share/WatchShop/app`.

Preserve the current source and environment files before extracting. Use a
temporary extraction directory so a partial archive never replaces the live
source:

```sh
RELEASE_SHA=<FULL_SHA>
IMAGE_TAG=release-<SHORT_SHA>
RELEASE_DIR=/share/WatchShop/releases/$IMAGE_TAG

mkdir -p "$RELEASE_DIR"
tar -xzf "watch-shop-release-<SHORT_SHA>.tar.gz" -C "$RELEASE_DIR"
cp /share/WatchShop/app/.env.production "$RELEASE_DIR/.env.production"
cp /share/WatchShop/app/.env.build "$RELEASE_DIR/.env.build"
cd "$RELEASE_DIR"
export IMAGE_TAG
```

Validate configuration and create the backup before migration:

```sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production --profile tools run --rm db-backup
```

Record the printed dump path. Stop unless the backup completes successfully.

Build both application and migration images. On this NAS, BuildKit may fail
with `Unknown system error -10 ... mkdir /app/.next/...` because the Docker
overlay filesystem is temporarily unable to create a directory. If that exact
error occurs, retry with the legacy builder; do not delete Docker data:

```sh
DOCKER_BUILDKIT=1 docker compose --env-file .env.production build --progress=plain app
DOCKER_BUILDKIT=1 docker compose --env-file .env.production --profile tools build --progress=plain migrate
```

Fallback for the exact overlay `mkdir ... error -10` only:

```sh
DOCKER_BUILDKIT=0 docker compose --env-file .env.production build --progress=plain app
DOCKER_BUILDKIT=0 docker compose --env-file .env.production --profile tools build --progress=plain migrate
```

Apply migrations and recreate only the app service:

```sh
docker compose --env-file .env.production --profile tools run --rm migrate
docker compose --env-file .env.production up -d --no-deps --force-recreate app
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=120 app
```

Wait for `healthy`, then verify locally on the NAS:

```sh
curl -i http://127.0.0.1:3000/api/health
curl -i http://127.0.0.1:3000/api/ready
```

Both endpoints must return HTTP 200. `/api/ready` must report the database as
reachable.

## Production smoke tests

Run these in order. Do not accept the release from health checks alone.

### Acquisition

1. Create an acquisition with zero unit cost and verify approval/posting is
   blocked with a clear warning.
2. Double-click or rapidly click create/submit and verify only one draft exists.
3. Reopen a draft and verify quantity, unit cost, line total and grand total.
4. Create a strap/accessory acquisition and verify Payment appears before and
   after posting, then verify stock in the strap/accessory list.
5. Enter two identical strap lines and verify one catalog variant with summed
   stock, not two duplicate rows.
6. Create a multi-Watch Trade-in containing one customer-owned Watch and one
   external Watch. Reopen, edit and post it; verify every line and total.

### Media Processing

1. Verify progress displays `x/4`, with Cover named separately.
2. With Profile/Content/Gallery complete and Cover missing, click `Duyệt xong`:
   the warning must allow continuation to Publish.
3. With any of Profile/Content/Gallery missing, verify the warning names the
   missing part and the item does not enter Publish.
4. Add a Cover and verify progress becomes `4/4` and activity records
   `watch.cover.updated`.

### Publish and Cover

1. In Publish, verify `Xử lý media` opens the Media modal.
2. Select a Cover candidate: the picker may close, but the Media modal remains
   open and no NAS/DB mutation occurs before `Xác nhận Cover`.
3. Confirm Cover and verify the source file moves into `media/objects/...`, the
   Watch preview updates and Activity receives the event.
4. Return the Cover from inside the picker and verify it returns to its original
   segmented Cover directory and storefront eligibility is removed.
5. Without Cover, click `Xác nhận đã đăng`; it must be rejected.
6. Add Cover, retry `Xác nhận đã đăng` and verify the item reaches Done.

### Activity

1. Open a `system.activity` row for a Watch Workspace. It must open the related
   Task/Workspace without a server exception.
2. Open a Watch business event. It must resolve the Watch through `productId`.
3. Verify Payment and Acquisition activity links still open their correct
   operational surfaces.

### Storefront

1. A Watch without Cover must not appear in the public catalog.
2. An otherwise eligible Watch with confirmed Cover must appear.
3. Verify its Cover image endpoint returns successfully and Gallery remains
   unchanged.

## Optional duplicate strap repair

Do not run this during the main deployment. First inspect the production strap
list and confirm duplicates remain. Create another fresh database backup, then:

```sh
docker compose --env-file .env.production --profile tools run --rm migrate \
  npm run strap:merge-duplicate-variants
```

Afterwards verify stock totals, weighted cost, acquisition history and emitted
`strap.stock.adjusted` activity. If the command reports a currently installed
strap, stop and resolve that group manually.

## Rollback

Keep the previous application image/tag and the pre-migration database dump
until all smoke tests pass.

Application rollback is safe because `Acquisition.sourceOrderId` is additive:

```sh
cd /share/WatchShop/<PREVIOUS_RELEASE_DIR>
export IMAGE_TAG=<PREVIOUS_IMAGE_TAG>
docker compose --env-file .env.production up -d --no-deps --force-recreate app
docker compose --env-file .env.production ps
curl -f http://127.0.0.1:3000/api/health
curl -f http://127.0.0.1:3000/api/ready
```

Do not automatically reverse the migration. Restore the database dump only for
a confirmed data-integrity incident and only through the documented restore
procedure in `docs/deployment/nas-docker.md`. A database restore also discards
all valid production writes made after the backup and therefore requires an
explicit maintenance decision.

## Acceptance record

Fill this during deployment:

```text
Release SHA:
Archive:
Archive SHA-256:
Image tag:
Backup path:
Migration result:
App container/image:
/api/health:
/api/ready:
Acquisition smoke:
Media Processing smoke:
Publish/Cover smoke:
Activity-link smoke:
Storefront smoke:
Accepted by:
Accepted at:
Rollback image retained until:
```

## Deployment update: 2026-08-12 10:51 Asia/Bangkok

This section supersedes the preparation status at the top of this document.

### Production state

- GitHub `main` and the deployed source revision are
  `b993cf3245e4f52e9445e27dcc8dc6a3b4380c1e`.
- Production image: `watch-shop:release-b993cf32`.
- Production container: `watch-shop-app-1` on NAS port `3000`.
- Admin URL: `https://admin.vinticwatches.vn` through
  `watch-shop-admin-internal-proxy` to `127.0.0.1:3000`.
- `/api/health`: HTTP 200 with `status=ok`.
- `/api/ready`: HTTP 200 with `database=reachable`.
- Pre-migration backup:
  `/backups/watch-shop-20260812T025446Z.dump`.
- Applied migration:
  `20260811_acquisition_trade_in_multi_source`.
- Permission audit passed with catalog `78/78`, no missing codes, role drift,
  forbidden role drift or retired codes.

The audit initially detected that `SALE` had regained
`ACCESSORY_ACQUISITION_UPDATE`, `ACCESSORY_ACQUISITION_APPROVE` and
`ACCESSORY_ACQUISITION_DELETE`. The idempotent SQL in
`prisma/migrations/20260806_restrict_sale_acquisition_scope/migration.sql`
was executed once with `prisma db execute`; the audit then passed. Do not
recreate the app from an older image that expects those forbidden grants.

The actual NAS SSH port is `22253`. Port `22523` in the earlier instructions
did not accept connections. Uploads use the `user` account and interactive
`sudo -i`; sudo tickets are not shared with separate automated SSH sessions.

### Local work not committed or deployed

The working tree on the original Windows machine contains a reviewed cleanup
and two production follow-up fixes. Its base is `b993cf32`; none of these
changes are on GitHub or production yet.

1. Normalize old `media-operation-board` snapshots to the four-part progress
   contract when read. This changes legacy `x/3` presentation to `x/4`
   without mutating production rows or rebuilding projections.
2. Route Global Activity to current operational surfaces. Media system
   activity opens `/admin/coordination/media`; Payment, Technical and Shipment
   use their current surfaces. It no longer falls back to legacy Task Item UI.
3. Retire the legacy Workspace presentation only, while preserving the
   Task/TaskItem persistence, workflow runtime, queue and command APIs:
   - `/admin/tasks`, `/admin/tasks/[id]`, `/admin/task-items` and
     `/admin/task-items/[id]` are redirect-only compatibility routes;
   - four legacy Task/TaskItem client pages and the list/detail-only component
     set were deleted (about 9,500 lines);
   - remaining user-facing links were redirected to Coordination Media or
     Operation surfaces;
   - `/api/admin/task-items/manual-transition` remains intentionally because
     it is a current runtime command endpoint, not legacy UI.

Local validation for this dirty tree:

```text
npx tsc --noEmit --pretty false --incremental false: PASS
targeted ESLint with --max-warnings=0: PASS
npm run auth:audit-policy: PASS (132 routes, 155 methods, 69 pages,
  25 Server Action files, 102 actions)
npm run check:media-boundaries: PASS
npm run build: PASS (129/129 static pages)
git diff --check: PASS
```

There is no schema migration or production data mutation in this pending
cleanup. Do not rerun the acquisition migration for it.

### Moving the pending cleanup to another Windows machine

The pending cleanup is not on GitHub. A normal clone of `main` will contain
only the deployed `b993cf32` state. Before leaving the original machine, create
a patch from the dirty tree:

```powershell
cd D:\workspace\project\watch-shop\watch-shop
git diff --binary --full-index HEAD > ..\watch-shop-legacy-ui-cleanup-b993cf32.patch
Get-FileHash -Algorithm SHA256 ..\watch-shop-legacy-ui-cleanup-b993cf32.patch
```

Copy that patch to the other machine through a trusted private channel. On the
other machine:

```powershell
git clone https://github.com/Bryantng88/watch-shop.git watch-shop
cd watch-shop
git checkout main
git pull --ff-only
git rev-parse HEAD
git apply --check C:\path\watch-shop-legacy-ui-cleanup-b993cf32.patch
git apply C:\path\watch-shop-legacy-ui-cleanup-b993cf32.patch
npm.cmd ci
npx.cmd prisma generate
npx.cmd tsc --noEmit --pretty false --incremental false
npm.cmd run auth:audit-policy
npm.cmd run check:media-boundaries
npm.cmd run build
git diff --check
```

The SHA printed before applying the patch must be `b993cf32...`. Stop if it is
not, or rebase/review the patch rather than forcing it. Review the full diff,
commit once, push only after explicit approval, and build a new immutable NAS
image tag from that new commit. This is an app-only rollout: retain the current
backup and image, build on NAS, recreate only `app`, then verify health/ready,
that progress shows `/4`, Activity no longer opens the legacy UI, and direct
legacy URLs redirect to Coordination.

### Local disposable database

Docker Desktop on the original machine currently runs:

```text
watch-shop-postgres-test  postgres:17-bookworm
127.0.0.1:5433 -> 5432
database: watch_shop_storefront_test
```

`.env.local` points to this loopback disposable database. It is safe for local
testing and is separate from production. Do not copy `.env.local`; recreate
equivalent machine-local values and follow
`docs/testing/storefront-isolated-database.md` on the new machine.
