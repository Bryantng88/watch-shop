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
