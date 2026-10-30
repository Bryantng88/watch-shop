# Full Watch Shop application preview

This preview runs the current repository's Next.js application, including the
existing `/admin/personal-work` page, against an isolated local PostgreSQL
instance. It is not the standalone HTML demo and does not create a hosted Site.
It does not implement or simulate automatic Codex execution.

## Requirements and startup

Use a Linux/macOS machine with Node.js, npm, and a running Docker daemon on
`/var/run/docker.sock`. Install the repository dependencies with `npm ci`.
Run from the repository root:

```sh
npm run preview:local
```

The command creates a checkout-specific PostgreSQL 17 container with a named
volume, bound only to `127.0.0.1:54329`. It generates a Prisma client, synchronizes
the current schema into `watch_shop_preview_test`, seeds a test administrator
and five personal work items, then starts the real app on `127.0.0.1:3000`.

Open `http://localhost:3000/login` on that same machine. The existing guarded
local auto-login opens the test admin. Navigate to Không gian cá nhân or
`/admin/personal-work`. Auto-login remains limited to development, loopback
requests and a loopback test database; no application access rules are changed.
The script does not print a password or enable remote auto-login.

Credentials and local state are generated under the ignored
`.watch-shop-preview/` directory. Keep this directory private and do not commit,
upload, print or copy it into a release. Do not delete it while retaining its
associated PostgreSQL volume: the next invocation would generate different
credentials. Ports are recorded in the state file and may be adjusted before
first container creation if the defaults are occupied.

The preview sets its own database and auth environment for child processes;
it does not edit `.env.production`, `.env.build`, or `.env.local`. It clears
Google OAuth and primary S3 credentials for its app process. Other integrations
are not configured or verified by this helper. Use only synthetic test data.

An empty preview database uses `prisma db push --skip-generate` without reset
or accept-data-loss. Historical migrations cannot bootstrap a blank database;
see `docs/testing/storefront-isolated-database.md`. This is not the NAS migration
procedure. Existing staging and production retain `prisma migrate deploy`.

## Commands

```sh
npm run preview:local -- setup
npm run preview:local -- status
npm run preview:local -- verify
npm run preview:local -- stop
```

`setup` prepares the isolated database without starting Next.js. `verify`
prepares it, then runs the personal-work boundary, standalone, schedule and
calendar smoke suites sequentially. These suites use real preview database
fixtures; Google calls are mocked. `stop` stops only this checkout's labeled
database container and preserves its data. Stop the app with Ctrl+C in the
terminal that started it. No command removes volumes or touches a NAS daemon.

## NAS staging target

The existing repository handoff records a separate NAS staging deployment:

- Admin ingress: `http://192.168.1.253:18089/admin`.
- Personal work entry, once the current application is deployed:
  `http://192.168.1.253:18089/admin/personal-work`.
- Staging database: `watch-shop-staging-db:5432`,
  `watch_shop_storefront_staging`.
- Staging admin container: `watch-shop-storefront-staging-admin-app`.
- SSH: `user@192.168.1.253`, port `22253`, using a separately configured identity.

These are historical configuration references, not current health or deployment
claims. Read `docs/deployment/release-2026-08-14-carrier-staging-handoff.md` and
verify live identity before deployment. Do not substitute the production admin
domain, database, containers or production runner for staging.

The current GitHub workflow is production-only. This helper does not modify it,
create a staging workflow, use the production runner, or deploy to the NAS.
Cloud access to the LAN staging target requires an operator-configured VPN,
HTTP destination policy, TCP grant for SSH and a securely supplied SSH identity.
Do not copy a workstation's private keys into Git or weaken ingress rules to
make Cloud access work.

## Validation in Codex Cloud

Verified on source base `62d0fa51770ee585fa26e72beabc8727dbb1f2d8` with synthetic
local data:

- PostgreSQL container startup and repeat setup preserve the existing fixture IDs.
- Local login returns a session and authenticated `/admin/personal-work` returns
  HTTP 200 with the actual application UI and seeded personal work.
- An unauthenticated personal-work request redirects to login.
- Personal-work boundary, standalone, schedule and calendar smoke suites pass.
- TypeScript and scoped ESLint for the changed scripts pass.
- The production build completes, including generation of 147 pages.

Full-repository ESLint reports pre-existing errors across legacy/generated code;
it is not a passing gate. Browser interaction and NAS deployment are not implied
by HTTP acceptance. A separate Codex executor and actual Google OAuth connection
remain future integration work.
