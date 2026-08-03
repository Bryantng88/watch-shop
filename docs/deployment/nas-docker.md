# NAS Docker deployment

This deployment keeps PostgreSQL and S3-compatible media storage outside the
application container. The web image is immutable; database migrations and
projection maintenance are explicit release operations.

## Prerequisites

- Docker Engine with Docker Compose v2 and BuildKit support.
- Network access from the NAS to PostgreSQL, S3 and any enabled integrations.
- A reverse proxy and TLS certificate on the NAS.
- A database and media backup before every schema or projection migration.

## First deployment

1. Copy `.env.build.example` to `.env.build` and
   `.env.production.example` to `.env.production` on the deployment host.
2. Replace every placeholder and restrict read access to both files. Keep only
   public build values and, if prerendering requires it, a restricted database
   account in `.env.build`. Runtime credentials belong in `.env.production`.
3. Run the source preflight with the same revision that will be deployed:

   ```sh
   npm ci
   npx prisma generate
   npx tsc --noEmit
   npm run build
   ```

4. Build the images. `NEXT_PUBLIC_*` values are embedded in the web image here,
   so changing them requires another build:

   ```sh
   docker compose build app migrate
   ```

5. Apply committed Prisma migrations exactly once:

   ```sh
   docker compose --profile tools run --rm migrate
   ```

6. Start the web application:

   ```sh
   docker compose up -d app
   docker compose ps
   ```

7. Verify `http://NAS_HOST:APP_PORT/api/health`, then smoke-test login and the
   critical admin workflows. Configure the NAS reverse proxy to forward HTTPS
   traffic to that address.

Do not use `prisma db push` in production. Do not run projection rebuilds on
every container startup. Run a rebuild only when its release notes require it,
using the ops image and after taking a database backup.

## Release update

Use an immutable tag such as a Git commit SHA in `IMAGE_TAG`:

```sh
docker compose build app migrate
docker compose --profile tools run --rm migrate
docker compose up -d --no-deps app
docker compose ps
```

After deployment, verify the health endpoint and the critical admin workflows.
Keep the previous image tag until the release has been accepted.

Keep `.env.build` and `.env.production` out of source control. Docker mounts
`.env.build` as a BuildKit secret for the build command; it is not copied into
an image layer.

## Rollback

Set `IMAGE_TAG` back to the previous image and recreate `app`. Application image
rollback does not reverse a database migration. Schema changes must therefore be
backward-compatible, or have a separately reviewed restore/down-migration plan.

## Scheduled jobs

Use the NAS scheduler (or one dedicated scheduler container) to call the protected
internal job endpoints with `INTERNAL_JOB_SECRET` / `CRON_SECRET`. Never expose
those endpoints without their secret and do not schedule the same job from more
than one host.
