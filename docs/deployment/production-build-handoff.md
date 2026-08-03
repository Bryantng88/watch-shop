# Production build handoff

Status: source build passed. The remaining release gate is to build and smoke-test
the images on a machine with Docker Engine.

## Completed

- Added `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.build.example` and
  `.env.production.example`.
- Next.js uses standalone output and Webpack production build.
- Added `GET /api/health`.
- Added a separate `ops` image for `prisma migrate deploy` and maintenance scripts.
- Moved `@prisma/client` to production dependencies.
- `.env.build` and `.env.production` are ignored by Git. The smaller build file
  is mounted as a BuildKit secret; the production file is used only at runtime.
- An earlier Docker/Prisma check passed for the `ops` target only:

  ```text
  watch-shop-ops:local (linux/amd64)
  prisma generate: passed
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

## Remaining release gate

Docker CLI is not available on the current machine. Before deployment, use a host
with Docker Engine to:

1. Build both the `ops` and `runtime` targets without bypassing checks.
2. Run `prisma migrate deploy` against the intended database after taking a backup.
3. Start the application and verify `/api/health`.
4. Smoke-test login and the critical admin flows for watches, acquisitions,
   accessories, orders, services, shipments and payments.

The generated Prisma/Zod directory, `component for chatGPT`, and `src/note.ts`
are excluded from production TypeScript scanning because they are generated or
archived content, not application source.

## Commands on the next machine

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
docker compose up -d app
docker compose ps
```

Verify:

```text
http://localhost:3000/api/health
```

Do not run `prisma db push` on production. The release command is:

```sh
docker compose --profile tools run --rm migrate
```

## Transfer note

The worktree currently contains uncommitted Docker/build changes mixed with
pre-existing business changes. Preserve the entire working tree when moving to
the other machine, or commit/push it deliberately before switching machines.
The local Docker image does not move with Git and can be rebuilt from the files.

The Prisma `Invoice` model remains in the database schema so this cleanup does not
silently drop production data. The obsolete invoice UI and API runtime paths have
been removed. Any future schema removal must be handled as a separate, backed-up
and reviewed migration.

Related deployment instructions: `docs/deployment/nas-docker.md`.
