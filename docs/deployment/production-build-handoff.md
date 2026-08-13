# Production build handoff

Status: deployed successfully on the QNAP LAN host. The application container is
healthy and both liveness and Supabase readiness checks pass. Public Internet
exposure remains blocked pending reverse proxy/TLS and security hardening.

## Completed

- Added `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.build.example` and
  `.env.production.example`.
- Next.js uses standalone output and Webpack production build.
- Added `GET /api/health` for process liveness and `GET /api/ready` for a safe
  Supabase `SELECT 1` readiness check.
- Added a separate `ops` image for `prisma migrate deploy` and maintenance scripts.
- Moved `@prisma/client` to production dependencies.
- `.env.build` and `.env.production` are ignored by Git. The smaller build file
  is mounted as a BuildKit secret; the production file is used only at runtime.
- Docker validation passed on Docker Engine 28.4.0 / Compose 2.39.4 on 2026-08-04:

  ```text
  watch-shop-ops:local (linux/amd64)
  prisma generate: passed
  watch-shop:local runtime build: passed
  container health: healthy
  GET /api/health: 200 {"status":"ok",...}
  Next.js production startup: ready in 89ms
  ```

- Legacy invoice, admin product and other superseded compatibility routes were
  removed or connected to the current domain contracts.
- The unused OpenAI acquisition/product generation paths, processors, endpoints,
  UI and package dependency were removed. Production build no longer requires an
  OpenAI build secret.
- The Next.js 15 async request API migration and remaining source type errors are
  complete.
- Local source validation passed on 2026-08-03:

  ```text
  npx tsc --noEmit: passed (0 errors)
  Compiled successfully
  Generated static pages (127/127)
  npm run build: passed (exit code 0)
  ```

- Deployment hardening validation passed on 2026-08-04:

  ```text
  npx eslint health/ready routes: passed
  npx tsc --noEmit: passed
  npm run build: passed (127/127 pages)
  Docker runtime image build: passed
  Compose config using example env files: passed
  PostgreSQL 17 backup/restore script syntax: passed
  ```

## QNAP handoff state (2026-08-04)

- Target: QNAP TS-473A, QTS 5.1.7, x86-64, 16 GB usable memory.
- NAS LAN address: `192.168.1.253`.
- Container Station is installed. Docker Engine `27.1.2-qnap8` and Docker Compose
  `v2.29.1-qnap2` are available.
- Shared folders were created on `DataVol1`:

  ```text
  /share/WatchShop/app
  /share/WatchShopBackup/database
  /share/WatchShopBackup/weekly
  /share/WatchShopBackup/monthly
  ```

- A source bundle was uploaded and extracted directly into
  `/share/WatchShop/app`; `compose.yaml`, `Dockerfile`, `src`, `prisma`, `ops` and
  the package files are visible at that level.
- The user reports that `.env.production` and `.env.build` were copied from the
  examples and filled on the NAS. They contain secrets and were not inspected or
  independently validated.
- Intended QNAP values include:

  ```dotenv
  APP_URL=http://192.168.1.253:3000
  DB_BACKUP_DIR=/share/WatchShopBackup/database
  DATABASE_URL=<Supabase session pooler on port 5432>
  DIRECT_URL=<Supabase session pooler on port 5432 for initial IPv4 deployment>
  ```

- LAN-only SSH was enabled on port `22253`. The deployment was performed from the
  normal admin shell in `/share/WatchShop/app`.
- Compose/env validation passed without printing secrets.
- The NAS built `watch-shop:local` (353 MB) and `watch-shop-ops:local` (1.71 GB).
- The initial Supabase backup completed and its SHA-256 checksum passed:

  ```text
  /share/WatchShopBackup/database/watch-shop-20260804T064659Z.dump (3.6 MB)
  /share/WatchShopBackup/database/watch-shop-20260804T064659Z.dump.sha256
  ```

- `prisma migrate deploy` found 31 migrations and reported no pending migrations.
- `watch-shop-app-1` started healthy. Next.js production was ready in 197 ms.
- Runtime verification passed:

  ```text
  GET /api/health: 200 {"status":"ok",...}
  GET /api/ready: 200 {"status":"ready","database":"reachable",...}
  initial readiness latency: 740 ms
  ```
- Initial LAN access at `http://192.168.1.253:3000` was confirmed. QNAP reverse
  proxy/TLS and a comprehensive critical-flow smoke record are not complete.

## Remaining deployment work

Before public Internet exposure:

1. Complete and record smoke tests for login and the critical admin flows:
   watches, acquisitions,
   accessories, orders, services, shipments and payments.
2. Configure QNAP reverse proxy/TLS; expose only HTTPS, not ports `3000`, `8080`
   or `22253`.
3. Configure the nightly database backup schedule, QTS snapshot policy and an
   HBS 3 encrypted off-NAS copy.
4. Run the first restore drill against a disposable database.
5. Review the dependency audit findings before exposing the service to the public
   Internet. The local `npm ci` reported 38 findings (1 low, 20 moderate, 15 high,
   2 critical); no automatic force-fix was applied.
6. Disable SSH after deployment work, or restrict it to LAN/VPN administration.

The generated Prisma/Zod directory, `component for chatGPT`, and `src/note.ts`
are excluded from production TypeScript scanning because they are generated or
archived content, not application source.

## Revalidation commands

```sh
npm ci
npx prisma generate
npx tsc --noEmit
npm run build
```

Then build and verify the containers:

```sh
docker build --target ops -t watch-shop-ops:local .
docker build \
  --secret id=env_build,src=.env.build \
  --target runtime \
  -t watch-shop:local .
docker compose --env-file .env.production up -d app
docker compose --env-file .env.production ps
```

Verify:

```text
http://localhost:3000/api/health
```

Do not run `prisma db push` on production. The release command is:

```sh
docker compose --env-file .env.production --profile tools run --rm migrate
```

## Transfer note

Commit and push the deployment files and this handoff before switching machines.
The local Docker image does not move with Git and can be rebuilt from the files.

Security cleanup is still required: tracked `.env.zip` contains an archived
`.env`. It was not extracted and was deleted from the NAS deployment folder, but
it remains in the repository/history. Remove it from the tracked source, exclude
secret archives from future bundles, and rotate any credentials that archive may
have contained before public exposure. Do not commit deployment env files.

The Prisma `Invoice` model remains in the database schema so this cleanup does not
silently drop production data. The obsolete invoice UI and API runtime paths have
been removed. Any future schema removal must be handled as a separate, backed-up
and reviewed migration.

Related deployment instructions: `docs/deployment/nas-docker.md`.

## Laptop UI refresh deployment (2026-08-04)

Before deploying the authorization hardening update, add a unique
`AUTH_SECRET` of at least 32 random characters to the NAS `.env.production`.
Legacy cookies contain an unsigned user id and are intentionally rejected, so
all users must sign in again after the new image starts.

The admin laptop-layout refresh was uploaded, built on the NAS and deployed by
recreating only the `app` service. No database migration was run for this
UI-only release.

Deployment policy: transfer source only, then SSH into the NAS and build the
Linux image in `/share/WatchShop/app` with Docker Compose. Do not transfer a
locally built development image.

Included UI changes:

- The desktop sidebar is icon-only below `2200px`, expands automatically on
  wider screens and no longer duplicates the account/logout controls from the
  top bar.
- Business-list dashboard cards and filter controls reflow more safely on
  laptop-width content areas.
- Watch-list columns have explicit widths, horizontal scrolling is allowed when
  required, and the Actions column remains pinned to the right.
- Watch Media, Service and Sale statuses retain their icon and text labels.
- Watch `Ngày tạo`, `Cập nhật` and `Thao tác cuối` information is present; no
  activity/actor columns are intentionally hidden in this pending build.
- Action columns were normalized on the Watch, Acquisition, Order, Service,
  Shipment, Task and Work Case lists.
- Shared row-action popovers now render through a document-body portal, update
  their position on scroll/resize and are not clipped by table overflow.

Local validation completed:

```text
npx tsc --noEmit: passed
npm run build: passed
Compiled successfully
Generated static pages: 124/124
```

A deployment bundle was created on the Windows development machine:

```text
C:\Users\MRD734~1.DUC\AppData\Local\Temp\watch-shop-ui-20260804.tar.gz
size: 4,165,817 bytes
```

The archive safety check confirmed that it contains no `.env*`, `.git`,
`.next`, `node_modules`, logs, zip/tar archives, `tsconfig.tsbuildinfo` or
`component for chatGPT` content. The bundle is stored in the Windows temporary
directory and should be recreated if it is no longer present.

An earlier deployment attempt was paused because the development machine could
not reach the LAN-only NAS SSH endpoint:

```text
192.168.1.253:22253: connection timed out
longnd.myqnapcloud.com:22253: connection refused
```

The deployment resumed after the laptop returned to the home LAN. The bundle was
uploaded with legacy SCP mode because QNAP SFTP remained disabled:

```sh
scp -O -P 22253 watch-shop-ui-20260804.tar.gz \
  user@192.168.1.253:/share/WatchShop/app/
```

On the NAS, enter the normal admin shell, preserve `.env.production` and
`.env.build`, and extract the source over `/share/WatchShop/app`. The archive
excludes deployment env files, so they are not overwritten. Do not treat archive
extraction as deletion of retired files. Then build and replace only the
application service; this UI release has no database migration:

```sh
cd /share/WatchShop/app
tar -xzf watch-shop-ui-20260804.tar.gz -C /share/WatchShop/app
sed -i 's/\r$//' ops/database/backup.sh ops/database/restore-drill.sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production build app
docker compose --env-file .env.production up -d --no-deps app
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=50 app
```

Verify before accepting the release:

```text
http://192.168.1.253:3000/api/health
http://192.168.1.253:3000/api/ready
```

Deployment verification passed:

```text
watch-shop-app-1: healthy
Next.js production ready: 245 ms
GET /api/health: 200 {"status":"ok",...}
GET /api/ready: 200 {"status":"ready","database":"reachable",...}
readiness latency: 765 ms
```

A fresh database backup was not required for this UI-only release because it
contained no schema migration or data maintenance command.

Smoke-test the Watch and Order lists in particular: sidebar auto-collapse,
horizontal table scrolling, pinned Actions, visible Watch activity columns and
row-action popovers near the top, middle and bottom of the viewport.

## Production revision 2: authorization and admin cleanup (2026-08-04)

Status: local source and production build validation passed. The Linux image
must be rebuilt on the NAS. Database acceptance remains gated by the post-migrate
permission catalog audit. The audit can reach Supabase when run directly on the
development host; commands executed in the restricted automation sandbox cannot.

The current development and NAS environments point to the same Supabase
database. A migration launched from the development machine therefore changes
the database used by the NAS application as well. Do not run the revision 2
migrations casually during UI development. The release sequence below takes a
backup first, applies migrations once, verifies the permission catalog and only
then replaces the running app container. A separate Supabase development project
is recommended before the next schema-changing development cycle.

Included changes:

- Replaced broad read/write admin API rules with endpoint- and method-specific
  create, update, delete, approve and view policies.
- Added fail-closed coverage checks for all 126 admin API routes (148 HTTP
  handlers), 68 admin pages and 100 exported server actions across 25 files.
- Added inner-policy checks so route/page `requirePermission` calls cannot drift
  from the middleware policy unnoticed.
- Added target-aware workflow mutation authorization: Payment, Shipment, Order,
  Watch and Service items require their matching update permission; unknown
  workflow targets require `TASK_MANAGE`.
- Added permission implications such as `TASK_MANAGE -> TASK_VIEW`,
  `USER_MANAGE -> USER_VIEW/CREATE/UPDATE/DELETE` and domain write permissions
  implying their matching view permission. Middleware, server code and UI use
  the same expanded permission set.
- Media rendering is infrastructure, not the Media Library business permission:
  every authenticated user may call `/api/media/sign` so required images and
  avatars render across domains. `MEDIA_VIEW` continues to protect Media Library
  pages, asset browsing and other media-business reads.
- Aligned granular user view/create/update controls and hid unavailable commands
  from read-only user administrators.
- Added accessory permissions and the `ACCESSORY_MANAGER` role.
- Aligned `SALE_ADMIN` with `TASK_VIEW`, Payment view/create/update, Watch cost
  visibility and Activity read/edit.
- Removed retired `INVOICE_*` permission metadata without removing Invoice data
  or schema objects.
- Simplified the sidebar. Customer work is deferred to the storefront session;
  Catalog, Blueprint Library, Media and Jobs remain direct permission-protected
  routes but are no longer permanent menu items. The dead Reports menu was also
  removed because no report page currently exists.
- Refined laptop dashboards and Space controls. Four dashboard widgets remain on
  one row when width permits and secondary widgets collapse only on narrower
  viewports.

Committed migrations in this release:

```text
20260804_accessory_role_permissions
20260804_permission_policy_alignment
20260804_strap_acquisition_permission_catalog
```

The third migration is a corrective catalog migration. The original accessory
migration granted the legacy `STRAP_ACQUISITION_*` permissions only when those permission
rows already existed. The release audit caught the missing rows before the app
container was replaced; the corrective migration inserts the catalog entries
and grants them to `ACCESSORY_MANAGER` idempotently.

Local release gates:

```text
npm run auth:audit-policy: passed
API routes: 126
API methods: 148
Admin pages: 68
Server action files: 25
Exported server actions: 100
npx tsc --noEmit: passed
npm run build: passed
Compiled successfully
Generated static pages: 124/124
```

Development now writes compiler artifacts to `.next-dev`; production builds
continue to write to `.next`. This prevents a release build from removing the
running dev server's CSS chunks. Restart an older dev process once after
receiving this change so it loads the new `distDir` configuration.

## Scoped acquisition permission hotfix (2026-08-05)

### Symptom and root cause

- ADMIN lost the Acquisition sidebar entry because application code expected
  scoped permission codes while the database still contained the legacy
  `ACQUISITION_*` catalog.
- SALE could see and enter the Watch acquisition flow because compatibility
  mapping preserved its former general permission as `ACQUISITION_*_ALL`.
- Sidebar visibility is not the security boundary. The hotfix also derives item
  scope on the server for list/dashboard queries and create, update, approve,
  bulk approve and cancel endpoints.

### Required patch contents

The production patch must include the application changes and all three ordered
migrations:

```text
20260805_scoped_acquisition_permissions
20260805_sync_admin_permission_catalog
20260806_restrict_sale_acquisition_scope
```

The first migration replaces the legacy catalog with Watch, Accessory and All
permissions. The second synchronizes the persisted ADMIN role with its runtime
full access. The third removes every acquisition permission from SALE except:

```text
ACCESSORY_ACQUISITION_VIEW
ACCESSORY_ACQUISITION_CREATE
```

Do not manually grant SALE `WATCH_ACQUISITION_*`,
`ACCESSORY_ACQUISITION_UPDATE/APPROVE/DELETE`, or `ACQUISITION_*_ALL`.

### NAS hotfix sequence

From `/share/WatchShop/app` as the elevated NAS administrator, after extracting
and verifying the patch archive:

```sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production --profile tools run --rm db-backup
echo $?
ls -lht /share/WatchShopBackup/database | head

docker compose --env-file .env.production build app migrate
docker compose --env-file .env.production --profile tools run --rm migrate
docker compose --env-file .env.production --profile tools run --rm migrate \
  npm run auth:audit-permissions
docker compose --env-file .env.production up -d --no-deps --force-recreate app
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=80 app
curl -f http://127.0.0.1:3000/api/health
curl -f http://127.0.0.1:3000/api/ready
```

Stop before replacing the app container if backup, build, migration or audit
fails. If development and NAS still point to the same Supabase project, these
migrations may already be recorded when the hotfix reaches the NAS. `migrate`
may therefore report no pending migrations; do not treat that as an error. The
new application image and successful permission audit are still required.

A successful audit must report:

```text
ok: true
catalogCount: 62
persistedCatalogCount: 62
missingCatalogCodes: []
expectedRoleDrift: []
forbiddenRoleDrift: []
retiredPermissionCodesPresent: []
```

### Acceptance checks

1. Logout/login after rollout so cached session permissions are rebuilt.
2. ADMIN sees Acquisition in the sidebar and Role UI shows the full catalog.
3. SALE lists only accessory acquisitions; its create action opens the
   accessory acquisition form.
4. SALE cannot open the Watch create page and receives `403` when a Watch or
   mixed payload is sent directly to the create API.
5. SALE cannot update, approve or cancel an accessory acquisition.
6. An account with both Watch and Accessory scoped permissions still cannot
   access mixed documents without the matching `*_ALL` permission.

### Rollback warning

These migrations remove legacy `ACQUISITION_*` and
`STRAP_ACQUISITION_*` permission rows. Reverting only to an older application
image is not a complete rollback for non-ADMIN users. Keep the hotfix image and
the verified pre-migration database backup until acceptance is complete.

### QNAP operator runbook

Run these steps from a Windows machine on the NAS LAN. Upload with the `user`
account because direct SSH authentication for `admin` is disabled on this NAS:

This hotfix supersedes both `watch-shop-production-r2-20260804.tar.gz` and
`watch-shop-ui-auth-patch-20260805.tar.gz`. Do not combine or deploy those two
older archives: neither one contains the complete application and migration set
required by this release. Use only the consolidated archive below.

```powershell
scp -O -P 22253 `
  D:\workspace\project\watch-shop\watch-shop-hotfix-acquisition-20260805-bc00fe0a.tar.gz `
  D:\workspace\project\watch-shop\watch-shop-hotfix-acquisition-20260805-bc00fe0a.tar.gz.sha256 `
  user@192.168.1.253:/share/WatchShop/app/
ssh -p 22253 user@192.168.1.253
```

At the NAS shell, elevate before using Docker. Enter the `user` password when
prompted and verify that the prompt changes from `$` to `#`:

```sh
sudo -i
whoami
cd /share/WatchShop/app
sha256sum -c watch-shop-hotfix-acquisition-20260805-bc00fe0a.tar.gz.sha256
```

Stop unless the checksum command reports `OK`. The checksum sidecar is generated
and reviewed together with the release archive. Extracting the bundle preserves `.env.build` and
`.env.production` because real environment files are excluded from the archive.
Validate Compose and complete a database backup before any migration:

```sh
tar -xzf watch-shop-hotfix-acquisition-20260805-bc00fe0a.tar.gz -C /share/WatchShop/app
sed -i 's/\r$//' ops/database/backup.sh ops/database/restore-drill.sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production --profile tools run --rm db-backup
echo $?
ls -lht /share/WatchShopBackup/database | head
```

Continue only when the backup command exits `0` and both the new `.dump` and
`.dump.sha256` files are present. Then build, migrate, audit and replace the app:

```sh
docker compose --env-file .env.production build app migrate
docker compose --env-file .env.production --profile tools run --rm migrate
docker compose --env-file .env.production --profile tools run --rm migrate \
  npm run auth:audit-permissions
docker compose --env-file .env.production up -d --no-deps app
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=50 app
curl -f http://127.0.0.1:3000/api/health
curl -f http://127.0.0.1:3000/api/ready
```

Stop before recreating `app` if migration or the permission audit fails. Keep
the existing container running while the new image is being built.

### NAS deployment sequence

```sh
cd /share/WatchShop/app
tar -xzf watch-shop-hotfix-acquisition-20260805-bc00fe0a.tar.gz -C /share/WatchShop/app
sed -i 's/\r$//' ops/database/backup.sh ops/database/restore-drill.sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production build app migrate
docker compose --env-file .env.production --profile tools run --rm db-backup
docker compose --env-file .env.production --profile tools run --rm migrate
docker compose --env-file .env.production --profile tools run --rm migrate \
  npm run auth:audit-permissions
docker compose --env-file .env.production up -d --no-deps app
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=50 app
curl -f http://127.0.0.1:3000/api/health
curl -f http://127.0.0.1:3000/api/ready
```

Do not start the new app if `auth:audit-permissions` reports missing catalog
codes, role drift, expected role drift or retired Invoice permissions. The audit
is read-only. Do not use `prisma db push`.

Acceptance smoke tests:

1. ADMIN can list, create, disable and edit users and role permissions.
2. A read-only user administrator cannot see create/edit/role commands.
3. SALE_ADMIN sees permitted Watch cost data and can view and operate Payment
   workflow items without gaining access to technical or shipment mutations.
4. ACCESSORY_MANAGER can open accessory and accessory-acquisition pages and use
   only the actions granted to the role.
5. Create, approve/post, cancel/delete and update endpoints reject adjacent but
   insufficient permissions.
6. The operation dashboard stays on one row at normal desktop width and exposes
   `Xem thêm` only when the viewport is narrow.

## Scoped Payment business permissions hotfix (2026-08-05)

This hotfix replaces coarse `PAYMENT_VIEW/CREATE/UPDATE/DELETE` permissions with
owner-aware Order, Acquisition, Service and Shipment permissions plus explicit
`PAYMENT_*_ALL` permissions. `TECHNICAL_ISSUE` payments belong to Service.
Shipment payments may retain an Order reference but belong to Shipment whenever
`shipment_id` is present. Conflicting unrelated owners fail closed.

Committed migration:

```text
20260807_scoped_payment_permissions
```

Legacy assignments map to `PAYMENT_*_ALL` to preserve existing access. ADMIN
receives the full catalog. SALE must have no Payment permission. Enforcement
covers owner APIs, generic complete/cancel APIs, Payment lists, projections,
cash-flow reads and Payment workflow actions. Acquisition financial fields also
require `PRODUCT_COST_VIEW` and the matching Acquisition Payment permission.

Run these gates before replacing the app container:

```sh
docker compose --env-file .env.production --profile tools run --rm db-backup
IMAGE_TAG=payment-scope-20260805-r1 docker compose --env-file .env.production build app migrate
IMAGE_TAG=payment-scope-20260805-r1 docker compose --env-file .env.production --profile tools run --rm migrate
IMAGE_TAG=payment-scope-20260805-r1 docker compose --env-file .env.production --profile tools run --rm migrate npm run auth:audit-permissions
```

The audit must report `ok: true`, catalog counts `78/78`, no drift, no retired
codes and no forbidden Payment permission on SALE. Only then run:

```sh
IMAGE_TAG=payment-scope-20260805-r1 docker compose --env-file .env.production up -d --no-deps --force-recreate app
```

Keep `watch-shop:pre-payment-scope-20260805` and the verified pre-migration
backup until acceptance. Image rollback does not restore retired Permission rows.

## Next release: authorization and security hardening (2026-08-09)

This section records the security work required for the next release. It is a
release backlog, not evidence that the items have already been deployed.

The policy audit was rerun against the current source after Purchase Request
operations were added:

```text
npm run auth:audit-policy: passed
API routes: 132
API methods: 154
Admin pages: 69
Server action files counted by the current audit: 25
Exported server actions counted by the current audit: 100
Failures: []
```

All current `/api/admin/**` and `/api/media/**` routes remain covered by the
fail-closed middleware policy. The Purchase Request start, complete, convert,
activity, item-decision and order-form routes also have route-level permission
checks. This does not close the following release work.

### Release blockers

1. Remove tracked `.env.zip` from the working tree and repository history using
   a reviewed history-rewrite procedure. Inventory and rotate every credential
   that may have appeared in the archive before any wider repository or public
   exposure. Do not copy the archive into a release bundle or NAS release
   directory. A normal deletion commit alone does not remove historical secret
   exposure.
2. Remove authorization bypass based only on the role name `ADMIN` from
   middleware, API helpers and page/server-action helpers. Runtime access must
   be derived from persisted `Role -> Permission` assignments, including for
   ADMIN. Keep the idempotent catalog migration/audit that grants ADMIN the full
   permission catalog, and fail closed when that catalog is incomplete.

### Required hardening in the same release

1. Add login abuse protection to `/api/auth/login`: bounded attempts by IP and
   normalized email, increasing delay or temporary lockout, generic failure
   responses and an auditable failed-login signal. Retain bcrypt verification
   and the signed, `HttpOnly`, `SameSite=Lax` cookie.
2. Fix `scripts/audit-admin-permission-policy.ts` so Server Actions are detected
   through the TypeScript directive/AST instead of requiring the file to start
   with the exact bytes `"use server"`. The current audit misses files with a
   leading comment, including `task-support.actions.ts`; that action is guarded
   today, but future files must not escape coverage.
3. Require an inner `requirePermissionApi`/domain authorization check for every
   admin mutation in addition to middleware. Extend the policy audit to fail
   when a POST, PUT, PATCH or DELETE route relies on middleware alone, except for
   an explicitly reviewed allow-list.
4. Remove write-on-read behavior from Coordination Dashboard GET. A user with
   only `TASK_VIEW` must not provision a cycle/workspace through
   `ensureCoordinationCycle`. Provision through a POST command requiring
   `TASK_MANAGE`, a deployment/job step, or return a not-provisioned read state.
5. Preserve the reverse-proxy trust boundary for public rate limiting. The app
   port must not be publicly reachable, and the trusted proxy must replace
   client-supplied forwarding headers. Add a trusted-proxy check before using
   `x-forwarded-for`; otherwise use the socket/proxy-provided address.

### Next-release acceptance gates

Run against the release source and the actual target database after backup and
migration, before replacing the running app:

```sh
npm run auth:audit-policy
npm run auth:audit-permissions
npx tsc --noEmit
```

Acceptance requires all of the following:

1. `auth:audit-policy` reports no missing route/page/action coverage and counts
   every Server Action file regardless of comments or quote style.
2. `auth:audit-permissions` reports `ok: true`, catalog counts matching the
   release catalog, no missing codes, no role drift, no forbidden role drift and
   no retired permission codes.
3. Removing one persisted permission from an ADMIN test role denies the matching
   API/page; restoring the permission restores access. The role label alone must
   grant nothing.
4. Unauthenticated admin mutations return `401`; authenticated users with an
   adjacent but insufficient permission return `403`; authorized users retain
   the expected operation.
5. Repeated invalid login attempts are throttled/locked without revealing
   whether an email exists, while a valid login succeeds after the bounded
   protection window.
6. A `TASK_VIEW`-only user cannot create a Coordination cycle or workspace by
   issuing GET requests.
7. `.env.zip` is absent from the worktree, release archive and rewritten Git
   history, and the credential-rotation checklist is signed off.

The local test database is intentionally role-minimal and currently reports
missing SALE, SALE_ADMIN and ACCESSORY_MANAGER roles in
`auth:audit-permissions`. That local result is not a production acceptance
result. The target staging/production database must independently pass the audit
with `ok: true`.

## Pending release handoff: 2026-08-12

The next Media, Acquisition, Trade-in, Strap and Activity-link release has a
dedicated machine-to-machine and NAS deployment runbook:

```text
docs/deployment/release-2026-08-12-media-acquisition-handoff.md
```

Use that document for the release SHA/archive hash, migration, backup, NAS build,
smoke tests and rollback record. It is preparation documentation, not evidence
that the release has already been committed or deployed.

## Current direct NAS deployment access: 2026-08-13

The deployment workstation can SSH directly to the production NAS with the
current Ed25519 deployment identity:

```text
host: 192.168.1.253
port: 22253
user: user
local private-key path: %USERPROFILE%\.ssh\watchshop_nas_ed25519
key fingerprint: SHA256:7tdvRJaxa72wP2k0SJwPezefqWHWhd2Rfk38Gb1aYRg (ED25519)
Docker CLI: /share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker
```

PowerShell example:

```powershell
ssh -p 22253 `
  -i "$env:USERPROFILE\.ssh\watchshop_nas_ed25519" `
  user@192.168.1.253
```

The NAS currently does not expose the SCP/SFTP subsystem. Transfer a release as
text-safe Base64 over SSH, verify its SHA-256 after decoding, and stop if the
checksum differs. The `user` account can run the Container Station Docker CLI;
`sudo -n` is not available.

Never paste or commit the private-key contents into this repository. The path,
host identity and commands belong in this runbook; the private key must be moved
to another workstation through a secure secret-transfer channel and stored with
restricted filesystem permissions. A public key or fingerprint may be recorded
here, but it cannot replace the private key required for authentication.
