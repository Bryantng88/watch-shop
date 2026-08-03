# Production build handoff

Status: in progress. Do not deploy the web image yet.

## Completed

- Added `Dockerfile`, `compose.yaml`, `.dockerignore` and `.env.production.example`.
- Next.js uses standalone output and Webpack production build.
- Added `GET /api/health`.
- Added a separate `ops` image for `prisma migrate deploy` and maintenance scripts.
- Moved `@prisma/client` to production dependencies.
- `.env.production` is ignored by Git and mounted as a BuildKit secret/runtime env file.
- Docker/Prisma validation passed locally:

  ```text
  watch-shop-ops:local (linux/amd64)
  prisma generate: passed
  ```

- `npm run build` reaches:

  ```text
  Compiled successfully
  Checking validity of types
  ```

## Current blockers

1. Finish the Next.js 15 async request API migration:
   - dynamic pages must use `params: Promise<...>`;
   - pages must use `searchParams: Promise<...>`;
   - route handlers must use `context.params: Promise<...>` and await it.
2. Fix stale compatibility imports/exports reported as `Attempted import error`.
   Important groups are acquisition, product, service, media and order legacy routes.
   Connect them to the current domain/application contract; do not create fake
   success responses or enable TypeScript build bypasses.
3. Fix remaining source TypeScript errors after the Next generated route errors.
4. Re-run the production build, then build and smoke-test the web container.

The generated Prisma/Zod directory, `component for chatGPT`, and `src/note.ts`
are excluded from production TypeScript scanning because they are generated or
archived content, not application source.

## Commands on the next machine

```sh
npm ci
npx prisma generate
npm run build
```

After `npm run build` passes:

```sh
docker build --target ops -t watch-shop-ops:local .
docker build \
  --secret id=env_production,src=.env.production \
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

Review these intentional compatibility decisions before release:

- unfinished public/storefront routes currently redirect to `/admin`;
- the legacy acquisition `create-with-ai` endpoint returns HTTP 410;
- `src/app/(admin)/admin/products/_server/product.service.ts` is a temporary
  compatibility adapter and still contains explicit failures for retired flows;
- the empty non-module file at
  `src/app/(admin)/admin/products/[id]/content/route.ts` was removed.

Related deployment instructions: `docs/deployment/nas-docker.md`.
