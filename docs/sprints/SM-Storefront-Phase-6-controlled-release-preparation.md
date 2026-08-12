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

## NAS Staging Checkpoint: 2026-08-06

NAS staging is running on the QNAP host from revision `5fc0cdc8`. Production
remains online and unchanged: `watch-shop-app-1` is healthy on the
`watch-shop:payment-scope-20260805-r1` image. The staging release is:

```text
/share/WatchShop/staging/release-5fc0cdc8
```

The valid source archive is `watch-shop-storefront-5fc0cdc8-v2.tar.gz`, created
with `git archive` and verified with `tar -tzf`. Do not use the quarantined
`release-5fc0cdc8-corrupt` directory produced by the earlier truncated Windows
archive.

### Running staging stack

- external Docker network: `watch-shop-staging`;
- PostgreSQL 17: `watch-shop-staging-db`, volume
  `watch-shop-staging-postgres`, database `watch_shop_storefront_staging`;
- MinIO: `watch-shop-staging-minio`, volume `watch-shop-staging-minio`, private
  binding `127.0.0.1:9000`, bucket `storefront-test-staging`;
- app: `watch-shop-storefront-staging-app-1`, immutable image
  `watch-shop:storefront-staging-5fc0cdc8`, private binding
  `127.0.0.1:3001 -> 3000`;
- deny-by-default Nginx: `watch-shop-staging-public-proxy`, private binding
  `127.0.0.1:8088 -> 8080`;
- operations image: `watch-shop-ops:storefront-staging-5fc0cdc8`;
- Compose project: `watch-shop-storefront-staging`, using `compose.yaml`,
  `compose.staging.yaml` and `.env.staging`;
- NAS-only secrets: `/share/WatchShop/staging/.env.infra`, `.env.staging` and
  `.env.build.staging`, all mode `600`.

Verified after the latest restart:

- `/api/ready` reports `ready` with the database reachable;
- proxy `/products` returns 200;
- proxy `/admin` and `/api/health` return 404;
- production app remains healthy.

### Production database clone

A fresh production dump was created and checksum-verified at:

```text
/share/WatchShopBackup/database/watch-shop-20260806T093700Z.dump
```

It was restored only into `watch_shop_storefront_staging` while the staging app
and proxy were stopped. The restore drill passed with 41 recorded Prisma
migrations. Before applying new migrations, a checksum-verified staging clone
backup was written as:

```text
/share/WatchShop/staging/backups/database/watch-shop-20260806T094327Z.dump
```

The two pending migrations, `20260807_remove_sale_payment_permissions` and
`20260808_storefront_public_order_ingress`, were applied successfully with
`prisma migrate deploy`; `prisma migrate status` now reports the schema is up to
date. The clone includes 94 public tables and representative production counts
including 74 Customers, 82 Orders and 7 Users.

This is now a production-data clone, not a disposable synthetic test database.
Do **not** run `storefront:test-db`, acceptance seed/cleanup scripts, `db push
--force-reset`, or destructive drills against it. Do not print customer rows or
credentials during diagnostics.

The cloned `zalo_oa_token` entry in `SystemJobControl` was disabled and its
metadata cleared. `.env.staging` also has blank production Zalo OA credentials
and separate staging application secrets. The verification result was:

```text
zalo_oa_token|f|t
```

### Production media clone

Production media remains in the external `image-browsing` S3 bucket (about
26 GiB and 35,836 objects). The whole bucket was deliberately not copied.
Instead, the 1,639 distinct `ProductImage.fileKey` values marked for storefront
use were exported to the mode-600 file:

```text
/share/WatchShop/staging/storefront-media-keys.txt
```

Selective copy placed 1,625 referenced objects into
`storefront-test-staging`; 14 references were already missing at the production
source. This 14-object gap is explicitly accepted for staging. Do not point the
staging app directly at the production bucket and do not delete the 14 database
rows merely to hide the gap.

### DNS, TLS and external access

The domain `vinticwatches.vn` was added to the Cloudflare Free plan. DNSSEC was
disabled at the registrar before changing delegation. Public DNS now returns
the assigned Cloudflare nameservers:

```text
aragon.ns.cloudflare.com
roxy.ns.cloudflare.com
```

Cloudflare was still showing `Waiting for your registrar to propagate your new
nameservers` at the last check. Use **Check nameservers now** and wait for the
zone to become **Active**. Do not re-enable registrar DNSSEC yet.

The Viettel router rejects external ports 80 and 443. A temporary test mapping
of external 10443 to NAS 8443 proved the QNAP reverse proxy, but the final design
is Cloudflare Tunnel, with no public router ports. Confirm that the temporary
10443 rule is disabled or removed before completing staging exposure. A QNAP
reverse-proxy rule exists for HTTPS `staging.vinticwatches.vn:8443` to
`http://127.0.0.1:8088`; it is not required by the final tunnel path.

### Resume from here

1. In Cloudflare, wait until `vinticwatches.vn` is **Active**.
2. Create a Cloudflared tunnel named `watch-shop-storefront-staging`. Never
   paste its tunnel token into chat or documentation.
3. Run Cloudflared on Docker network `watch-shop-staging` and route the public
   hostname `staging.vinticwatches.vn` to:

   ```text
   http://watch-shop-staging-public-proxy:8080
   ```

4. Verify external HTTPS has a valid certificate with no browser warning, then
   require `/products=200`, `/admin=404` and `/api/health=404`.
5. Perform real-device catalog/detail/image, 360/390/430 responsive, PWA
   install/offline/reconnect and controlled Order acceptance. Remember that 14
   stale media references may return unavailable images.
6. Keep production activation blocked until all Phase 6 gates pass and receive
   explicit approval. Re-enable DNSSEC later through Cloudflare using the new DS
   data, never the registrar's old DS record.

## NAS Staging Checkpoint: 2026-08-07 (latest)

Continue from this section on another workstation. The production container and
database remain out of scope and must not be used for staging acceptance.

### Storefront eligibility and deployed image

The storefront publish contract was aligned with the actual media workflow:

- both `WatchReviewState` records (`CONTENT` and `IMAGE`) must be `APPROVED`;
- Publish readiness does not require the later Done/posting step;
- legacy `Product.contentStatus` and `WatchContent.contentStatus` are not
  storefront gates;
- a stable product slug is generated when both reviews become approved;
- a storefront-enabled `COVER` image is the mandatory catalog/detail gate in
  staging and production. Set `STOREFRONT_REQUIRE_COVER_IMAGE=1`; the former
  temporary staging bypass is retired and must not be restored.

The resulting NAS image is running as:

```text
watch-shop:storefront-staging-20260807-r2
```

Container `watch-shop-storefront-staging-app-1` uses that image, remains bound
to `127.0.0.1:3001`, and passed health/readiness and `/products=200` checks.
The source changes are still local and uncommitted. The intended files include:

- `.env.production.example`;
- `scripts/seed-storefront-acceptance.ts`;
- `scripts/smoke-storefront-contract.ts`;
- `src/domains/storefront/server/public-catalog.repo.ts`;
- `src/domains/storefront/server/public-catalog.service.ts`;
- `src/domains/watch/server/review/watch-review.service.ts`;
- `scripts/backfill-storefront-slugs.ts`.

`storefront:verify`, scoped lint/typecheck and the production build passed before
deployment; the build generated 127/127 pages.

### Production-clone catalog backfill

An audit of the cloned staging database found 47 Watches at the exact storefront
eligibility intersection when the cover-role gate is bypassed. All 475 Products
initially had no slug. Before changing them, the latest staging backup checksum
was verified:

```text
watch-shop-20260806T094327Z.dump: OK
```

The guarded `scripts/backfill-storefront-slugs.ts` runner:

- refuses a database whose name does not contain `staging`;
- is dry-run unless `--apply` and
  `ALLOW_STOREFRONT_SLUG_BACKFILL=1` are both supplied;
- only fills null/empty slugs for the exact eligible intersection;
- uses the same title plus stable product-id suffix algorithm as review
  approval.

Dry-run reported 47 candidates and apply reported `updated: 47`. Do not rerun
destructive database utilities or acceptance fixture cleanup on this clone.

### Media and LAN preview

The staging MinIO bucket still contains 1,625 of 1,639 referenced storefront
objects; the accepted 14 missing source objects were not fabricated or removed
from the database.

QNAP SSH disables TCP forwarding (`administratively prohibited`). A temporary
LAN-only preview proxy was therefore created as:

```text
container: watch-shop-staging-lan-preview
binding:   192.168.1.253:18088 -> 8080
URL:       http://192.168.1.253:18088/products
```

Do not add router forwarding for port 18088. Any device on the same LAN can
reach it. Remove it after Cloudflare Tunnel acceptance:

```sh
docker rm -f watch-shop-staging-lan-preview
```

The temporary router `10443 -> 8443` mapping and QNAP 8443 path are not part of
the final design and should remain disabled/removed. Final public access remains
Cloudflare Tunnel without inbound router ports.

### SSH access constraint

The Windows key is `~/.ssh/watchshop_nas_ed25519`. It authenticates as NAS user
`user` on port 22253. Adding it in QTS did not permit direct `admin` login. Use:

```powershell
ssh -i "$env:USERPROFILE\.ssh\watchshop_nas_ed25519" -p 22253 user@192.168.1.253
```

Then run `sudo -i` and enter the password interactively. QTS administrator-group
membership does not turn an SSH `user` session into an admin shell, and no
passwordless-all sudo policy should be added.

### Purchase-request product decisions

The public CTA needs to distinguish intent:

- primary: **Send purchase request**, allowing multiple unique Watches in one
  request, quantity fixed at one;
- secondary: **Ask on Instagram**, opening the shop's Instagram DM surface and
  carrying/copying the product title, stable code and URL for context;
- consultation does not reserve inventory or create an Order;
- a staff-confirmed purchase request may proceed to reservation/order handling.

Related suggestions on the request page should show up to four eligible Watches,
exclude current selections and unavailable inventory, and rank primarily by
market segment/site channel, price proximity, audience, style, brand, size,
movement and decade. Use deterministic scoring and diversity penalties before
behavioral personalization.

### Admin staging is the immediate next task

There is currently no safe admin staging URL. The public proxy deliberately
returns 404 for `/admin`, `/login`, admin/media/internal APIs and health routes.
The existing `192.168.1.253:3000/admin` surface is production and must never be
used to process staging requests.

Build a separate admin staging ingress using the same r2 application and
`watch_shop_storefront_staging` database. Requirements:

1. use a distinct hostname such as `admin-staging.vinticwatches.vn`; do not rely
   only on a different port because authentication cookies do not isolate by
   port;
2. initially bind it to LAN only (a proposed port is 18089), with no router
   forwarding;
3. allow only the admin/login and required admin API/media routes; keep the
   public storefront hostname deny-by-default;
4. confirm staging users/roles can authenticate without changing production;
5. verify the storefront request record type and the existing admin screen that
   reads it before submitting a test request;
6. keep Zalo, email, webhook and other outbound production integrations disabled;
7. map the request lifecycle through staff acceptance, reservation/cancellation
   and storefront availability updates, including multi-Watch requests;
8. when exposed externally, protect the admin hostname with Cloudflare Access.

After admin staging is available, prioritize end-to-end business acceptance over
UI polish: submit a controlled purchase request, receive it in admin, process
each item, verify audit/state transitions, and verify immediate storefront
availability. Record the visible Vietnamese typography, raw enum labels and
layout defects for the later UI/UX pass.

## Local Purchase Request Intake: 2026-08-07

The first additive implementation slice now separates storefront intent from
Order and Payment:

- public submission creates `PurchaseRequest` plus immutable product/price
  snapshots, not an Order;
- request status is `WAITING -> PROCESSING -> COMPLETED`, with terminal outcomes
  `CONVERTED`, `REJECTED`, `CANCELLED`, `EXPIRED` and `DUPLICATE`;
- multiple unique Watches are allowed, with quantity fixed at one;
- admin `/admin/purchase-requests` can accept a request, end it with a required
  reason, or record an agreed price for each Watch and convert it idempotently
  into a verified WEB Order in `DRAFT`;
- conversion does not create Payment. Existing Payment issuance remains a
  deliberate Order operation after commercial terms are confirmed;
- the existing Payment command already enforces unpaid-to-cancelled and rejects
  cancellation of paid Payment, which must use a refund flow instead.

Migration `20260809_purchase_request_intake` is additive. Legacy WEB Orders
remain readable and are not backfilled into PurchaseRequest automatically.

Local gates passed: Prisma format/generate, TypeScript no-emit, scoped ESLint,
all storefront verification scripts and the production build (127/127 pages).
Docker Desktop 4.85 and a loopback PostgreSQL 17 container were installed on
this workstation. The disposable `watch_shop_storefront_test` database was
bootstrapped from the current Prisma schema and the updated nine-assertion DB
integration suite passed, including request idempotency, non-reserving
concurrent intent, rate limiting and Zalo replay/conflict behavior.
