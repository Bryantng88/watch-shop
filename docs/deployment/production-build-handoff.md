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

```powershell
scp -O -P 22253 `
  D:\workspace\project\watch-shop\watch-shop-production-r2-20260804.tar.gz `
  user@192.168.1.253:/share/WatchShop/app/
ssh -p 22253 user@192.168.1.253
```

At the NAS shell, elevate before using Docker. Enter the `user` password when
prompted and verify that the prompt changes from `$` to `#`:

```sh
sudo -i
whoami
cd /share/WatchShop/app
sha256sum watch-shop-production-r2-20260804.tar.gz
```

For this revision, the expected SHA-256 is:

```text
092c0ee8d67013b4d20d19e5ffc0ddbd2488e686c4649b45707caa3fd6130df4
```

Stop if the hash differs. Extracting the bundle preserves `.env.build` and
`.env.production` because real environment files are excluded from the archive.
Validate Compose and complete a database backup before any migration:

```sh
tar -xzf watch-shop-production-r2-20260804.tar.gz -C /share/WatchShop/app
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
tar -xzf watch-shop-production-r2-20260804.tar.gz -C /share/WatchShop/app
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
