# Release handoff: Storefront purchase request and Activity resilience

## 2026-08-12 hardening follow-up (supersedes ingress/event notes below)

The release candidate now closes the audit gaps found after the original
handoff was written:

- every newly created request emits `purchase_request.created` in the same
  transaction as `PurchaseRequest`, its initial Activity and the durable
  ingress receipt;
- every merge that adds Watch items emits `purchase_request.items_added` in
  the same transaction as the new items and Activity note;
- both event keys are registered contracts with target type
  `PURCHASE_REQUEST`, versioned required payloads and timeline delivery;
- `PurchaseRequestIngressReceipt` records every storefront idempotency key,
  including keys that merge into an older PR. Replaying a merge returns the
  original `MERGED` disposition and `addedItemCount` without running the
  mutation or event again;
- `PurchaseRequest.normalizedPhone` is persisted and indexed. Merge lookup is
  now a direct indexed query and no longer scans the latest 100 waiting rows;
- invalid non-numeric phone values are rejected before merge;
- a new request receives an initial `PurchaseRequestActivity` instead of
  opening with an empty Activity history.

Additive migrations:

```text
20260812_add_purchase_request_contact_channels
20260812_harden_purchase_request_ingress
```

Staging and production must set `STOREFRONT_REQUIRE_COVER_IMAGE=1`. Export and
acceptance tooling now selects only storefront-enabled images with role
`COVER`; a generic storefront image is not sufficient.

### Storefront catalog/filter source audit

The public catalog intentionally reads canonical business truth, not the Admin
`watch-list` `ProjectionRecord`:

- Product identity/brand/status and storefront Cover come from `Product`;
- audience, style, collectible and lifecycle gates come from `Watch`;
- size, movement, case material and strap type come from `WatchSpecV2`;
- sale price comes from `WatchPrice`.

This matches the Watch form write path. The Admin Watch List projection is not
a suitable public catalog source because it is asynchronous and does not carry
the complete size/material/style/strap facet fields. Indexes were added for
`Watch.style`, `WatchSpecV2.caseSizeMM` and `WatchSpecV2.braceletType`; the
existing movement/material/audience/collectible indexes remain authoritative.

### Migration-chain warning

A clean zero-database `prisma migrate deploy` audit currently fails in the
pre-existing migration `20260701_task_item_activity_v1` because it references
`TaskItem` before that table exists in the historical chain. Do not edit or
reorder applied migration history for this storefront release. Staging and
production must use their established baseline and run `prisma migrate status`
before applying the two additive migrations above. Repairing clean bootstrap is
a separate migration-baseline task.

Status: implemented and validated locally; staging rollout pending the immutable
release revision recorded during this deployment session.

Prepared: 2026-08-12 (Asia/Bangkok)  
Current branch base before the hardening commit: `7a95f81b` (`origin/main`).

Do not deploy from an uncommitted directory. Record the full reviewed commit SHA,
archive checksum and immutable image tag in the rollout evidence below.

Suggested immutable image tag:

```text
IMAGE_TAG=storefront-staging-<SHORT_SHA>
```

## Release scope

### Storefront form submission

The public purchase-request form now supports progressive enhancement:

- With JavaScript available, the client sends JSON to `POST /api/public/orders`
  and immediately shows `Đang gửi…`, success or a user-facing error.
- Without hydration or when JavaScript has not loaded yet, the browser submits a
  normal HTML `POST` to the same endpoint.
- The API accepts JSON, `application/x-www-form-urlencoded` and multipart form
  payloads. HTML submissions receive a `303` redirect back to `/request` with a
  success or error result.
- The form can no longer fall through to `GET /request?customerName=...`, which
  previously looked like a successful click but never called the write API.
- Every submission carries an idempotency key. Repeating the same submission
  does not create another request.

Successful creation shows:

```text
Đã nhận yêu cầu
Mã tham chiếu: PR-...
Hãy cung cấp mã này khi cần trao đổi với đội ngũ tư vấn.
```

### Merge rule for follow-up Watch selections

A new storefront submission is merged into an existing purchase request only
when all of the following are true:

- The normalized customer phone number matches.
- The existing request status is `WAITING`.
- The request is not linked to an Order (`orderId IS NULL`).
- The combined request contains no more than 20 distinct Watches.

Phone normalization removes non-digits and treats a Vietnamese `84...` prefix
as the equivalent leading-zero number. For example, `+84 357 547 090` and
`0357547090` resolve to the same customer key.

Merge behavior:

- Keep the existing `PurchaseRequest.id` and `PR-...` reference.
- Add only product IDs not already present in `PurchaseRequestItem`.
- Preserve the request stage as `WAITING`.
- Refresh customer/contact fields from the latest submission where supplied.
- Update `updatedAt`, causing the request to appear as recently updated.
- Add a `PurchaseRequestActivity` of type `NOTE`, for example:

  ```text
  Khách bổ sung 2 Watch từ Storefront: <Watch A>, <Watch B>.
  ```

- Return `disposition: "MERGED"` and `addedItemCount` to the storefront.
- Display the same PR reference with the message:

  ```text
  Bạn vừa bổ sung thêm 2 Watch vào yêu cầu mua hàng.
  Mã tham chiếu: PR-...
  ```

If the previous request is `PROCESSING` or `COMPLETED`, the submission creates a
new purchase request and receives a new PR reference. This prevents the scope of
work from changing silently after an operator has started processing it.

Concurrent submissions using the same normalized phone are serialized with a
PostgreSQL advisory transaction lock. They therefore resolve to the same
`WAITING` request instead of racing into duplicate requests.

### Activity/legacy Watch resilience

The same commit includes the earlier Watch detail fix. Reading selected Watch
media no longer throws `Watch not found for product ...` when local or legacy
data contains a Product without the corresponding Watch row. The read path
falls back to legacy selected media or an empty list. Write operations retain
the strict Watch-owner requirement.

## Files changed

```text
src/app/(public)/request/page.tsx
src/app/api/public/orders/route.ts
src/domains/storefront/contracts/public-order.contract.ts
src/domains/storefront/server/public-order.service.ts
src/domains/storefront/ui/PublicOrderForm.tsx
src/domains/media/application/media-command.service.ts
scripts/integration-storefront-order-db.ts
scripts/smoke-storefront-order-ingress.ts
```

## Database impact

This release has two additive Prisma migrations:

```text
20260812_add_purchase_request_contact_channels
20260812_harden_purchase_request_ingress
```

Existing and added tables used by the change:

- `PurchaseRequest`
- `PurchaseRequestItem`
- `PurchaseRequestActivity`
- `PurchaseRequestIngressReceipt`
- `Product`, `Watch` and `WatchPrice`

Production must already contain the purchase-request schema introduced by prior
migrations. Confirm before rollout:

```bash
npx prisma migrate status
```

The normal production migration command remains safe and should still be run as
part of the standard release process:

```bash
docker compose --profile tools run --rm migrate
```

## Validation completed locally

The following passed on 2026-08-12 against the disposable PostgreSQL 17 database
`watch_shop_storefront_test` at `127.0.0.1:5433`:

```text
ESLint on changed storefront/API/test files: passed
npx tsc --noEmit --pretty false --incremental false: passed
npm run storefront:smoke-order: passed (16 checks)
npm run storefront:test-db: passed (23 checks)
git diff --check: passed
```

The DB integration suite covers:

- idempotent replay;
- concurrent submissions for the same phone;
- merging a new Watch into the same `WAITING` PR;
- creating a merge Activity note;
- creating a new PR after the former PR becomes `PROCESSING`;
- the existing public rate limit and Zalo ingress behavior.

## Staging rollout evidence: 2026-08-12

- application source revision: `5916cbdeaced910aae083c9702a254e025f337a3`;
- immutable images: `watch-shop:storefront-staging-5916cbde` and
  `watch-shop-ops:storefront-staging-5916cbde`;
- source archive: `watch-shop-storefront-5916cbde.tar.gz`;
- archive SHA-256:
  `37f48b1ae922337406ff64395fff6395e03942d6a94b0e98511ee50aebc60e90`;
- pre-migration staging backup:
  `/share/homes/user/watch-shop-staging-pre-5916cbde.dump`;
- backup SHA-256:
  `afafe32704fb1bb325fda471fe9313872c744e8ed8c91034f8cb7053db590522`;
- active release directory: `/share/WatchShop/staging/release-5916cbde`;
- both `watch-shop-storefront-staging-app-1` and
  `watch-shop-storefront-staging-admin-app` are healthy on the immutable image;
- production remained on `watch-shop:release-b993cf32` and was not changed;
- all 48 staging migrations are applied and Prisma reports the schema up to
  date;
- `STOREFRONT_REQUIRE_COVER_IMAGE=1` is confirmed in the running public app.

The production-clone data had no `COVER` rows: 1,201 storefront images were
legacy `GALLERY` rows. After the backup, exactly one existing primary storefront
image was promoted to `COVER` for each of the 45 Watches that already satisfied
all other storefront business/review gates. No file key or production data was
changed. The guarded export then returned eligible Watches with a real Cover.

HTTP acceptance through the LAN-only proxies passed:

```text
200 /products
200 /products?strapType=BRACELET
200 /products?strapType=LEATHER
200 /request
404 /api/health on the deny-by-default public proxy (expected)
307 /admin/purchase-requests to authentication (expected)
```

Purchase-request acceptance created `PR-20260812-258808A2`, replayed its first
idempotency key without duplication, then added a second Watch using the same
normalized phone number. Evidence after the merge:

```text
status=WAITING
items=2
activities=2
purchase_request.created=1
purchase_request.items_added=1
ingress receipts=2
contact preference=INSTAGRAM
contact handle=@staging_acceptance
```

Rollback application tag (schema changes are additive):
`watch-shop:storefront-staging-purchase-ba29b20d-r1`. Restore the checksum-
verified staging backup only if a database rollback is explicitly required.

## Production rollout evidence: 2026-08-12

- final production source revision: `83916bc1`;
- immutable runtime image: `watch-shop:release-83916bc1`;
- immutable ops image: `watch-shop-ops:release-83916bc1`;
- source archive: `watch-shop-production-83916bc1.tar.gz`;
- archive SHA-256:
  `be165d2a75f9fab73b079ec51edf47317b1f390c033bf8f4c5a619d1f70307e6`;
- pre-rollout database backup:
  `/share/WatchShopBackup/database/watch-shop-20260812T165240Z.dump`;
- backup SHA-256:
  `c05d9ea782412e75ca771a1788d974d42cb245fd0d755e059205726362349d63`;
- rollback runtime image: `watch-shop:release-b993cf32`;
- all 48 migrations are applied and Prisma reports the production schema up to
  date;
- `STOREFRONT_REQUIRE_COVER_IMAGE=1` is confirmed in the healthy running app.

Production data preparation used guarded, dry-run-first utilities. It generated
46 missing stable slugs and promoted exactly one existing primary storefront
image to `COVER` for each of the same 46 already-eligible Watches. No media
object/file key was copied, deleted or renamed.

### Production cover correction: 2026-08-13

The automatic promotion above was intentionally reversed after visual review:
an existing primary image is not necessarily a curated storefront cover.

- pre-correction backup:
  `/share/WatchShopBackup/database/watch-shop-20260812T180519Z.dump`;
- backup SHA-256:
  `dd74be7852011f782d8e5a6eb28a601932545d955d8a7150357502e89a780a52`;
- cleanup utility revision: `0024afa9`;
- immutable cleanup image: `watch-shop-ops:release-0024afa9`;
- the guarded cleanup matched exactly the 46 rows written in the original
  `2026-08-12T17:03:00Z`–`17:05:00Z` backfill window;
- it changed those image roles from `COVER` to `INLINE` and cleared only the
  matching legacy `Product.storefrontImageKey` pointers;
- it did not delete ProductImage, MediaObject or storage files;
- immediate post-apply dry-run returned zero candidates;
- the public-watch export returned an empty product list, proving that no
  uncurated legacy image still satisfies the cover gate;
- public acceptance returned `/products` 200 with `0 sản phẩm`, while `/admin`
  and `/api/health` remained 404 through the storefront proxy.

Production operators must now select a cover through the Admin watch media
workflow. A Watch becomes public only after the normal eligibility checks and a
real `COVER` image are both present. Do not run the automatic cover backfill in
production again.

### Public activation and storefront surface updates: 2026-08-13

The customer-facing hostname was activated through the existing healthy
Cloudflare Tunnel. The tunnel published `vinticwatches.vn` to the loopback-only
production storefront proxy at `http://127.0.0.1:18090`. No router port was
opened. The deny-by-default proxy continued to return 404 for `/admin` and
`/api/health` on the public hostname while allowing the storefront pages and
required public API/media routes.

Revision `34e3b99d` changed the storefront paper/background color from
`#fbfaf7` to `#ffffff`. The change covered the public layout, header/mobile
menu, filter controls, image focus rings and PWA manifest background rather
than changing only the catalog page container.

- immutable runtime image: `watch-shop:release-34e3b99d`;
- post-deploy container state: healthy;
- `/products`: HTTP 200;
- public `/admin`: HTTP 404;
- manifest `background_color`: `#ffffff`.

Rollback for this visual-only release is `watch-shop:release-83916bc1`. No
database rollback is required.

### Storefront slug/readiness correction: 2026-08-13

Production review found that selecting a real Cover was not sufficient for a
legacy Watch whose `Product.slug` was still null. The public catalog correctly
requires a slug because every catalog card must have a valid detail URL, but
the Admin UI did not expose that missing condition. This made the Watch appear
silently excluded even though its Cover was visible in Admin.

Revision `2096aa09` closes that workflow gap:

- `setWatchCoverApplication` now creates a deterministic storefront slug when
  the Product has no slug;
- the slug and Cover pointers are written in the same database transaction;
- the existing slug is preserved and is never regenerated by changing Cover;
- review approval and Cover selection share
  `buildWatchStorefrontSlug`, preventing two different slug algorithms;
- the Cover API returns `storefrontSlug`, allowing the form state to update
  immediately without a manual refresh;
- the Watch image form displays an eight-item storefront-readiness checklist:
  Cover, slug, Product status, sale stage, service stage, Content approval,
  Image approval and sale price;
- the guarded slug backfill was aligned with the real public eligibility rule,
  including `AVAILABLE`/`HOLD`/`SOLD`, `READY`/`HOLD`/`SOLD`, and requiring a
  real `COVER` image.

The current public eligibility rule is:

1. Product type is `WATCH`.
2. Product status is `AVAILABLE`, `HOLD` or `SOLD`.
3. Product has a non-empty slug.
4. Product has an image with `role=COVER`, `isForStorefront=true` and a
   non-empty file key.
5. Watch sale stage is `READY`, `HOLD` or `SOLD`.
6. Watch service stage is `NOT_REQUIRED` or `DONE`.
7. The latest persisted review set contains approved `CONTENT` and approved
   `IMAGE` targets.
8. Either price visibility is `HIDE`, or sale price is greater than zero.

`WatchContent.contentStatus=DRAFT` is not a public eligibility gate. The
approved Watch review pair is the readiness source of truth. The `Draft` badge
in the edit header can therefore coexist with an eligible storefront Watch;
operators should use the explicit checklist instead of inferring readiness
from that badge.

Production data correction evidence:

- affected SKU: `SEI-30062026-001`;
- Product ID: `cmpqdghm7000vxwdsbrcugjh5`;
- title: `1980s Seiko Quartz 5930 Quartz`;
- prior failure: all public conditions passed except `Product.slug=null`;
- pre-change backup:
  `/share/WatchShopBackup/database/watch-shop-20260812T185721Z.dump`;
- backup SHA-256:
  `3b771ecd339f6984362f551c21a7ba985209c4c83312921acc61d89f021ffb6d`;
- guarded dry-run candidates: 1;
- guarded apply updated: 1;
- immediate post-apply dry-run candidates: 0;
- generated slug:
  `1980s-seiko-quartz-5930-quartz-brcugjh5`.

Deployment evidence:

- immutable ops image: `watch-shop-ops:release-2096aa09`;
- immutable runtime image: `watch-shop:release-2096aa09`;
- production app health: healthy;
- catalog search for `5930`: HTTP 200 and product present;
- canonical product detail URL: HTTP 200;
- public `/admin`: HTTP 404.

Application rollback is `watch-shop:release-34e3b99d`. Rolling back the app
does not require restoring the database: the generated slug is valid under the
previous runtime and should be retained. Restore the checksum-verified backup
only for a separately approved database recovery, not for an application
rollback.

LAN acceptance passed with HTTP 200 for health, readiness, products, request,
Bracelet and Leather filters. A real production Cover was served as
`image/jpeg`, and `https://admin.vinticwatches.vn/login` remained available.
No synthetic purchase request was written to production; event/idempotency and
merge acceptance was completed against the same runtime revision on staging.

Public activation remains an ingress/DNS gate: `vinticwatches.vn` and
`www.vinticwatches.vn` did not resolve at rollout time. Do not open a router
port. Add the chosen customer-facing hostname to the existing Cloudflare Tunnel
and route it to the production app through a deny-by-default storefront proxy.

## Reproduce validation on another machine

Prerequisites:

- Node dependencies installed with `npm ci`.
- PostgreSQL 17 disposable test DB reachable locally.
- `STOREFRONT_TEST_DATABASE_URL` points to a database whose name contains
  `test` or `storefront`.
- `DATABASE_URL` and `DIRECT_URL` must not equal the disposable test URL when
  invoking the protected integration script.

PowerShell example:

```powershell
npm.cmd ci
npx.cmd prisma generate
npx.cmd eslint src/domains/storefront/server/public-order.service.ts src/domains/storefront/contracts/public-order.contract.ts src/app/api/public/orders/route.ts src/domains/storefront/ui/PublicOrderForm.tsx 'src/app/(public)/request/page.tsx' scripts/integration-storefront-order-db.ts scripts/smoke-storefront-order-ingress.ts
npm.cmd run storefront:smoke-order
$env:STOREFRONT_TEST_DATABASE_URL='postgresql://USER:PASSWORD@127.0.0.1:5433/watch_shop_storefront_test'
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:DIRECT_URL -ErrorAction SilentlyContinue
npm.cmd run storefront:test-db
npx.cmd tsc --noEmit --pretty false --incremental false
npm.cmd run build
git diff --check
```

Do not run `storefront:test-db` against production. The script creates and
deletes test Products, PurchaseRequests and related records.

## Manual acceptance test

Use a published, available Watch in the test environment.

1. Open `/request`, enter a new phone number, select one Watch and submit.
2. Confirm the storefront displays a new `PR-...` reference.
3. Open Admin -> Coordination -> Operation -> `Xử lý đơn hàng` -> `Chờ xử lý`.
4. Confirm one request exists with the same customer, phone and PR reference.
5. Return to storefront, select two different Watches and submit with the same
   phone number.
6. Confirm the storefront says the Watches were added and displays the original
   PR reference.
7. Refresh the Admin request and confirm it contains three distinct Watches.
8. Confirm Activity contains a note naming the two added Watches.
9. Submit one of the same Watches again and confirm it is not duplicated.
10. Move/start the request so its status becomes `PROCESSING`.
11. Submit another Watch from storefront using the same phone.
12. Confirm a new PR reference is created and the processing request is not
    mutated.
13. Open an Activity/legacy Watch link that previously threw `Watch not found`
    and confirm the page renders without a server exception.

Also test once with JavaScript disabled. The HTML form must POST and redirect to
a visible success/error page; it must never navigate to
`/request?customerName=...`.

## Production deployment checklist

1. Review commit `91b7a7e8` carefully because its commit message is not a useful
   release description.
2. Push the reviewed revision or create a clearly named follow-up release commit.
3. Record the final full SHA and choose a new immutable image tag.
4. Back up the production database and verify the backup checksum.
5. Build the app and ops images from that exact revision.
6. Run `prisma migrate deploy` even though this release contains no new
   migration; it verifies the target is current.
7. Recreate only the application service using the new image tag.
8. Verify `/api/health` and `/api/ready`.
9. Run the manual acceptance flow above with designated production-safe test
   Watches/customer data.
10. Inspect application logs for:

    ```text
    [storefront-purchase-request] accepted
    ```

    The entry includes `requestId`, `reference`, `replayed` and duration. It does
    not log customer phone/name.
11. Confirm the new or merged PR appears in the Admin `Chờ xử lý` stage and its
    Activity is visible.

Follow the image build, backup and NAS rollout procedures in
`docs/deployment/production-build-handoff.md` and
`docs/deployment/nas-docker.md`. Do not reuse an older mutable `local` image as
the production release identity.

## Rollback

Application rollback does not require a database rollback because this release
adds no migration.

1. Repoint/recreate the app service with the previous immutable image tag.
2. Verify health and readiness.
3. Keep PurchaseRequests created or merged while the new version was active;
   they use the existing schema and remain readable by the previous version.
4. If an operational merge must be undone, do not delete production history.
   Manually review the Activity and move the added items into a new request using
   an audited administrative procedure.

## Known operational notes

- The PR reference identifies the consultation request; it is not an Order
  number and is not used for payment.
- A converted Order receives its own reference while retaining the source
  PurchaseRequest relationship.
- Merge lookup uses the persisted, indexed `normalizedPhone` field and only
  considers requests that are still `WAITING` and have no linked Order.
- Submitting only Watches already present in the waiting request returns the
  same PR with `addedItemCount = 0`; no additional Activity note is created.
- The public rate limit remains five newly created requests per fingerprint in
  ten minutes. A valid merge is resolved before this rate-limit count.

## Production media boundary and quick Media release: 2026-08-13

Release `09947d05` was deployed as immutable image
`watch-shop:release-09947d05`. It contains no schema migration and replaced only
the `app` service. The previous rollback image is
`watch-shop:release-a1393512`.

The public image boundary is now explicit:

- catalog cards use the selected `COVER`;
- product-detail galleries return only `GALLERY` images;
- `INLINE` is an internal Watch thumbnail and is excluded by the catalog
  repository, DTO mapper and public image-signing endpoint.

The Watch List action is now `Xử lý nhanh Media`. It first reuses the existing
Media intake application action and waits for projection delivery. After the
Watch is present in the Media space, it opens the existing embedded Media UI
focused on Cover/image processing. It does not alter the Watch lifecycle state.
Cover updates still use `setWatchCoverApplication` and emit
`watch.cover.updated`; quick-list updates carry
`entryPoint: WATCH_LIST_QUICK` for audit tracing.

Production acceptance recorded for this release:

- container `watch-shop-app-1`: `running`, `healthy`;
- local `/api/health`: HTTP 200;
- local `/api/ready`: HTTP 200;
- public `/products` and the verified Watch detail page: HTTP 200;
- public `/admin` and `/api/health`: HTTP 404 through the storefront proxy.

## Gallery ordering and separate Cover tab release: 2026-08-13

Release `ad99bc30` was deployed as immutable image
`watch-shop:release-ad99bc30`. It contains no schema migration and replaced only
the `app` service. The previous production image
`watch-shop:release-ce6b8f23` is the application rollback target.

This release completes the four-part Media Processing presentation documented
in `release-2026-08-12-media-acquisition-handoff.md`:

```text
profile + content + gallery + cover = x/4
```

- `Cover storefront` is now a fourth, separate Media Processing tab rather than
  a panel embedded in `Hình ảnh`;
- `focus=cover` opens the Cover tab directly;
- the `Hình ảnh` tab remains responsible for gallery selection, ordering and
  image review;
- the Cover tab owns Cover selection and storefront-readiness checks;
- gallery sorting uses a sortable drag overlay: the thumbnail follows the
  pointer, surrounding cards animate toward their prospective positions, the
  drop target is highlighted and the dropped image animates into place;
- left/right ordering buttons remain available as an accessible fallback;
- the first ordered Gallery image remains the storefront card hover image, and
  persisted array order continues to map to `ProductImage.sortOrder`.

Immutable release evidence:

```text
source commit: ad99bc30
archive: watch-shop-release-ad99bc30.tar.gz
archive SHA-256: 44c5b59108cd8baf3502f9bef152084a47c16aeabceb2a6ae1e778860f951ea3
runtime image: watch-shop:release-ad99bc30
runtime image ID: sha256:481ff4c0072258456915fed9b94343212b2f7d45d7c2f72faa451f67eba4a216
ops image: watch-shop-ops:release-ad99bc30
ops image ID: sha256:63a80484f393d6eb1e4dd395dc12189d5545f73ac9fc9df8ca6218d737f24cb7
release directory: /share/homes/user/watch-shop-releases/release-ad99bc30
```

Pre-rollout backup and gates:

- database backup:
  `/share/WatchShopBackup/database/watch-shop-20260813T091158Z.dump`;
- backup sidecar verification: `sha256sum -c`: `OK`;
- Prisma found 48 migrations and reported no pending migrations;
- permission catalog audit: `ok: true`, 78/78 persisted permissions and no
  missing, role, forbidden-role or retired-code drift;
- local targeted ESLint, TypeScript with incremental output disabled, production
  build (129/129 pages) and `git diff --check` passed before packaging.

Post-rollout acceptance:

- `watch-shop-app-1` runs `watch-shop:release-ad99bc30` and is `healthy`;
- local `/api/health`: `status=ok`;
- local `/api/ready`: `status=ready`, database reachable;
- public `/products`: HTTP 200;
- verified public product-detail route: HTTP 200;
- public `/admin` and `/api/health`: HTTP 404 through the deny-by-default
  storefront proxy;
- startup log: Next.js 15.5.2 ready in 210 ms.

Application rollback is `watch-shop:release-ce6b8f23`. This UI-only release has
no migration, so an application rollback does not require restoring the database
backup. Retain the verified backup as deployment evidence and use it only for a
separately approved database-recovery operation.
