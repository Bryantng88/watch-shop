# Storefront Phase 6: Controlled Release Preparation

Date: 2026-08-05

Status: prepared, not released

## Outcome

Release verification, external-host acceptance, sanitized mutation monitoring,
legacy cleanup inventory and rollback order are prepared. Production release
and cleanup remain intentionally blocked by the Phase 3-5 acceptance gates.

## Release Verification

Run the complete source gate before building an artifact:

```sh
npm run storefront:verify
npm run build
```

`storefront:verify` covers public DTO boundaries, eligibility, public media
ownership, Order ingress, Zalo HMAC, PWA/cache/proxy policy and the legacy
cleanup inventory.

After activating an HTTPS test/public virtual host, run from a machine outside
the NAS LAN:

```sh
STOREFRONT_BASE_URL=https://shop.example.com npm run storefront:accept-public-host
```

The acceptance script performs GET-only checks. It requires public storefront,
manifest and service-worker routes to return 200 with security headers. It
requires `/admin`, `/login`, `/profile`, `/api/admin`, `/api/media`,
`/api/internal`, `/api/health` and `/api/ready` to return 404 from the public
host. It never submits an order.

## Controlled Activation

1. Complete an isolated DB migration and concurrency suite.
2. Build and tag a release-candidate application/ops image.
3. Back up production and verify the dump checksum.
4. Apply the additive storefront ingress migration with `prisma migrate deploy`.
5. Start the new image while the public Nginx/Synology virtual host remains
   disabled; smoke health/readiness over loopback/LAN.
6. Configure a strong `ZALO_INGRESS_KEYS` secret map and test signed events on
   the private test path.
7. Activate only the deny-by-default public virtual host. This proxy rule is the
   explicit exposure switch.
8. Run the external-host acceptance script, responsive/PWA tests and one
   controlled storefront Order request with a designated test Watch.
9. Confirm exactly one DRAFT/PENDING WEB order and HOLD outcome, then cancel the
   test order through the normal admin business flow.

Do not expose the application container port directly. For the public-host
layout, bind the application to loopback and keep the admin host on its existing
LAN/VPN path.

## Monitoring

Successful mutations emit sanitized structured log events:

- `[storefront-order] accepted`: order id/reference, replay flag, duration;
- `[zalo-ingress] accepted`: event id/type, replay flag, duration.

Failures retain stable codes without request bodies, phone numbers, signatures
or secrets. During the controlled window, monitor:

- 4xx/5xx rate and latency on public/Zalo routes;
- `EVENT_REPLAYED`, idempotency conflicts and rate-limit responses;
- duplicate WEB/ZALO order references;
- Watch availability/HOLD conflicts;
- database pool latency and application health;
- CSP violations, PWA install/offline behavior and signed-image failures.

## Rollback Order

1. Disable/remove the public virtual host first. Verify all public-host routes
   are unreachable before changing the application.
2. Keep the admin LAN/VPN host available and confirm `/api/health` and
   `/api/ready` internally.
3. Recreate the app from the pre-storefront image tag if application rollback
   is required.
4. The migration is additive (nullable Order ingress columns plus a receipt
   table), so the old image can ignore it. Do not manually drop columns/table
   during an incident.
5. Restore the database backup only for proven data corruption, not merely to
   disable storefront. A restore also discards legitimate admin writes made
   after the backup and therefore requires explicit business authorization.
6. Keep `/sw.js` available long enough to deliver the latest cache policy where
   practical. Existing cached fallback is read-only and contains no Order,
   customer, admin or API response. Changing the cache version on the next
   release removes the previous shell cache.

## Legacy Cleanup Audit

The following currently have no importer in the new public runtime:

- old list/detail CSS modules;
- static `src/data/products.ts` demo inventory;
- obsolete `useCart` hook;
- two obsolete common Header implementations.

`npm run storefront:audit-legacy` records this inventory and asserts that the
new storefront imports none of it. `deletionAuthorized` remains false. Delete
only after production smoke/monitoring is stable and a final repository-wide
import audit confirms no non-storefront consumer.

## Open Release Gates

- manual 360/390/430, tablet and desktop acceptance;
- HTTPS PWA installability and reconnect behavior on target devices;
- external proxy deny/allow acceptance;
- production backup/restore and rollback rehearsal;
- explicit approval to activate the public-host proxy.

The isolated database runner is now available as `npm run storefront:test-db`;
setup and safety requirements are documented in
`docs/testing/storefront-isolated-database.md`.

## Local DB Gate Result

Completed on 2026-08-05 against the disposable loopback database
`watch_shop_storefront_test` on Docker PostgreSQL 17:

- all 9 Order concurrency/idempotency/rate-limit and Zalo replay assertions
  passed;
- `npm run storefront:verify` passed every source/contract audit;
- `npm run build` compiled successfully and generated 127/127 pages;
- synthetic test records were removed by the runner's `finally` cleanup.

The blank-database migration-chain gap discovered during this gate is recorded
in `docs/testing/storefront-isolated-database.md`. It does not alter the
production migration procedure.

## Local Browser and Proxy Acceptance Result

Completed on 2026-08-05 with an isolated local stack:

- Next development server on loopback port `3100`;
- Docker PostgreSQL 17 database `watch_shop_storefront_test` on port `5433`;
- MinIO test bucket `storefront-test` on loopback port `9000`;
- Nginx deny-by-default public proxy on loopback port `8088`;
- six synthetic Watch fixtures and generated 600x800 PNG acceptance images.

Verified behavior:

- catalog, detail, request, offline, manifest and service worker routes return
  200;
- first public Order request returns 201 and an identical idempotent replay
  returns 200 with the same Order id;
- public image ownership route, signed storage fetch and Next image optimizer
  return valid PNG responses;
- public proxy acceptance allows the five storefront/PWA routes and returns 404
  for `/admin`, `/login`, `/profile`, admin/media/internal APIs, health and
  readiness routes;
- Vietnamese response content is UTF-8 clean;
- relevant ESLint and storefront smoke gates pass.

Two runtime defects were found and fixed during acceptance:

1. `next/image` could not optimize an internal image route that returned a 302
   signed-storage redirect. The public image route now fetches the controlled
   signed URL server-side, validates image MIME and a 20 MiB size ceiling, then
   returns same-origin image bytes. This also keeps external storage outside the
   storefront CSP surface.
2. The DB and public-host acceptance scripts used top-level `await`, which is
   incompatible with this repository's CJS `tsx` output. Both runners now use
   an explicit async `main()` entry point.

Local-only reusable helpers are available as:

- `npm run storefront:seed-acceptance` for guarded DB fixtures;
- `npm run storefront:seed-acceptance-media` for guarded loopback MinIO images;
- `ops/deployment/nginx-storefront-local.conf` for the local deny-by-default
  proxy.

## Next Session: NAS Staging

The next action is a staging deployment on the NAS for real-phone acceptance,
not a production replacement. Prepare:

1. a separate storefront staging image/container and rollback tag;
2. a separate disposable/sanitized staging database (never production for test
   Orders);
3. a private application port bound to loopback/LAN only;
4. a dedicated HTTPS staging hostname with the deny-by-default public proxy;
5. staging-only S3 and Zalo secrets;
6. external acceptance over phone Wi-Fi and 4G/5G at 360/390/430 widths;
7. PWA install, offline/reconnect, image, Order and signed Zalo checks;
8. confirmation that admin and internal routes remain 404 from the public host.

Do not deploy or activate the production storefront until this NAS staging gate
is complete and explicitly approved.

Until all gates close, Phase 6 is release-ready preparation only—not a
production release and not authorization to delete legacy code.
