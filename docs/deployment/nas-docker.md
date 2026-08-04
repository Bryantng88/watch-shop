# NAS Docker deployment

This deployment keeps Supabase PostgreSQL and S3-compatible media storage outside
the application container. Supabase is the only production database primary. A
NAS database, when used, is an isolated restore target rather than a second write
destination. The web image is immutable; database migrations, backups and
projection maintenance are explicit operations.

## Prerequisites

- Docker Engine with Docker Compose v2 and BuildKit support.
- Network access from the NAS to PostgreSQL, S3 and any enabled integrations.
- A reverse proxy and TLS certificate on the NAS.
- A database and media backup before every schema or projection migration.

## QNAP TS-473A / QTS 5.1 layout

The initial deployment target is a QNAP TS-473A running QTS 5.1.7. This model is
64-bit x86, so the default `linux/amd64` Node and PostgreSQL images are supported.
Install Container Station from App Center before deployment.

Create two dedicated shared folders on `DataVol1` instead of placing application
data in `Public`, `Web` or a user's home folder:

```text
/share/WatchShop
  app/             # compose.yaml, deployment env files and checked-out source

/share/WatchShopBackup
  database/        # nightly custom-format PostgreSQL dumps
  weekly/          # retained copies, not touched by daily retention
  monthly/         # retained copies, not touched by daily retention
```

Grant access only to the NAS administrator/deployment account and Container
Station. Do not enable guest access. Enable QTS snapshots for the backup shared
folder when the storage pool supports them, then use HBS 3 to copy that folder to
an external disk or a second remote destination. A snapshot on the same NAS is
not the off-NAS backup copy.

For this QNAP, set these deployment values in `.env.production`:

```dotenv
APP_BIND_ADDRESS=0.0.0.0
APP_PORT=3000
APP_ENV_FILE=.env.production
BUILD_ENV_FILE=.env.build
DB_BACKUP_DIR=/share/WatchShopBackup/database
```

Use QTS reverse proxy/TLS for user access; do not forward Supabase/PostgreSQL
ports or expose Container Station management to the Internet.

## First deployment

1. Copy `.env.build.example` to `.env.build` and
   `.env.production.example` to `.env.production` on the deployment host.
2. Replace every placeholder and restrict read access to both files. Keep only
   public build values and, if prerendering requires it, a restricted database
   account in `.env.build`. Runtime credentials belong in `.env.production`.
   For a persistent NAS container, use either the Supabase direct connection when
   IPv6 is available or the Supavisor session pooler on port `5432`. Reserve the
   direct URL for migrations and backups. Do not use transaction pooling on port
   `6543` as the default for this deployment.
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
   docker compose --env-file .env.production build app migrate
   ```

5. Apply committed Prisma migrations exactly once:

   ```sh
   docker compose --env-file .env.production --profile tools run --rm migrate
   ```

6. Start the web application:

   ```sh
   docker compose --env-file .env.production up -d app
   docker compose --env-file .env.production ps
   ```

7. Verify both endpoints, then smoke-test login and the critical admin workflows:

   ```text
   http://NAS_HOST:APP_PORT/api/health  # process liveness
   http://NAS_HOST:APP_PORT/api/ready   # Supabase readiness
   ```

   Configure the NAS reverse proxy to forward HTTPS traffic to the application.
   Monitor `/api/ready`; do not use it as the Docker restart healthcheck because
   restarting the app cannot repair a WAN or Supabase outage.

Do not use `prisma db push` in production. Do not run projection rebuilds on
every container startup. Run a rebuild only when its release notes require it,
using the ops image and after taking a database backup.

## Release update

Use an immutable tag such as a Git commit SHA in `IMAGE_TAG`:

```sh
docker compose --env-file .env.production build app migrate
docker compose --env-file .env.production --profile tools run --rm migrate
docker compose --env-file .env.production up -d --no-deps app
docker compose --env-file .env.production ps
```

After deployment, verify the health endpoint and the critical admin workflows.
Keep the previous image tag until the release has been accepted.

Keep `.env.build` and `.env.production` out of source control. Docker mounts
`.env.build` as a BuildKit secret for the build command; it is not copied into
an image layer.

## Database backup

`db-backup` creates a compressed custom-format dump of the application's `public`
schema, validates that the archive is readable and writes a SHA-256 checksum. It
does not include S3/media objects, which require a separate versioning and backup
policy.

Set `DB_BACKUP_DIR` in `.env.production` to an absolute NAS host directory, then
run the first backup manually:

```sh
docker compose --env-file .env.production --profile tools run --rm db-backup
```

Confirm that both `watch-shop-TIMESTAMP.dump` and its `.sha256` file exist. Only
after this manual check should the same command be scheduled nightly in the NAS
scheduler. Keep 14 daily copies by default, copy selected archives into separate
weekly/monthly directories, and maintain at least one encrypted copy outside the
NAS.

The backup connects with `DIRECT_URL`. If the NAS cannot reach Supabase's IPv6
direct endpoint and the project has no IPv4 add-on, set `DIRECT_URL` to the
Supavisor session-pooler connection string on port `5432` for this operation.

## Restore drill

Never test a restore against production. Create a disposable PostgreSQL database
with no application traffic, then explicitly supply its URL:

```sh
RESTORE_TEST_DATABASE_URL='postgresql://...' \
  docker compose --env-file .env.production --profile tools run --rm \
  db-restore-drill /backups/watch-shop-TIMESTAMP.dump
```

The command validates the checksum/archive, replaces objects only inside the
explicit test database and verifies that Prisma migration history is readable.
Run a restore drill after the first backup and at least quarterly.

## Supabase outage behavior

- `/api/health` may remain healthy while Supabase or the WAN is unavailable.
- `/api/ready` returns HTTP `503` without exposing connection details.
- Business writes must not be redirected to a local database. Do not report an
  operation as successful unless its production transaction commits.
- For a short outage, pause writes and retry after connectivity returns. For a
  disaster, restore a verified backup into a replacement Supabase project or a
  deliberately promoted PostgreSQL instance, update the connection secrets and
  smoke-test before reopening traffic.

## Rollback

Set `IMAGE_TAG` back to the previous image and recreate `app`. Application image
rollback does not reverse a database migration. Schema changes must therefore be
backward-compatible, or have a separately reviewed restore/down-migration plan.

## Scheduled jobs

Use the NAS scheduler (or one dedicated scheduler container) to call the protected
internal job endpoints with `INTERNAL_JOB_SECRET` / `CRON_SECRET`. Never expose
those endpoints without their secret and do not schedule the same job from more
than one host.
