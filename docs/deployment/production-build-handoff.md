# Production build handoff

Status: source and local Docker validation passed. The QNAP deployment host and
files are prepared, but the NAS image has not been built and no production backup
or migration has been run yet.

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
- Container Station is installed and opens successfully. No application or
  container has been created there yet.
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

- The next action is to enable LAN-only SSH in QTS, connect from the workstation,
  `cd /share/WatchShop/app`, validate Compose/env without printing secrets, and
  build the NAS images. Do not use Container Station's manual Create Application
  flow before this because the relative build context must be the source folder.
- No Supabase backup, Prisma migration, NAS image build, reverse proxy or business
  smoke test has been performed.

## Remaining deployment work

Before enabling normal users on the NAS:

1. Validate the NAS env files and build both images from `/share/WatchShop/app`.
2. Create and verify the first Supabase dump in the NAS backup folder.
3. Only after the backup, run `prisma migrate deploy` once.
4. Start the Compose application and verify `/api/health` and `/api/ready` at
   `http://192.168.1.253:3000`.
5. Smoke-test login and the critical admin flows for watches, acquisitions,
   accessories, orders, services, shipments and payments.
6. Configure QNAP reverse proxy/TLS and an HBS 3 off-NAS backup copy.
7. Review the dependency audit findings before exposing the service to the public
   Internet. The local `npm ci` reported 38 findings (1 low, 20 moderate, 15 high,
   2 critical); no automatic force-fix was applied.

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
