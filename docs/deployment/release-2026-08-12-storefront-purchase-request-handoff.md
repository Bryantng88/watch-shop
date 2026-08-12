# Release handoff: Storefront purchase request and Activity resilience

Status: implemented and committed locally; not pushed or deployed.

Prepared: 2026-08-12 (Asia/Bangkok)  
Local release revision: `91b7a7e8edff55c69c84ee40e987a5b0bfaa0fec`  
Local commit message: `aaa`  
Remote base revision: `eb95cb32` (`origin/main` at handoff time)

The local branch is one commit ahead of `origin/main`. Do not deploy from an
uncommitted directory or identify the release only by the non-descriptive commit
message. Use the full SHA above, or replace it with a reviewed follow-up commit
and record that SHA before deployment.

Suggested immutable image tag:

```text
IMAGE_TAG=release-91b7a7e8
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

There is no Prisma schema change and no new migration in this release.

Existing tables used by the change:

- `PurchaseRequest`
- `PurchaseRequestItem`
- `PurchaseRequestActivity`
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
npm run storefront:test-db: passed (15 checks)
git diff --check: passed
```

The DB integration suite covers:

- idempotent replay;
- concurrent submissions for the same phone;
- merging a new Watch into the same `WAITING` PR;
- creating a merge Activity note;
- creating a new PR after the former PR becomes `PROCESSING`;
- the existing public rate limit and Zalo ingress behavior.

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
- The merge lookup currently examines the 100 most recently updated `WAITING`
  requests and compares normalized phone numbers in application code. On a very
  large waiting backlog, an older matching request outside that window will not
  merge and a new PR will be created. This is safe against corrupting another
  request, but it can create a duplicate consultation. A future schema change
  should persist and index a normalized phone field if this backlog becomes
  realistic.
- Submitting only Watches already present in the waiting request returns the
  same PR with `addedItemCount = 0`; no additional Activity note is created.
- The public rate limit remains five newly created requests per fingerprint in
  ten minutes. A valid merge is resolved before this rate-limit count.

