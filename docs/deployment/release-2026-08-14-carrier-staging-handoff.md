# Carrier integration and dynamic catalog banner — staging handoff

Status: deployed to NAS staging on 2026-08-14 (Asia/Bangkok). Production was
not changed.

## Release identity

```text
source revision: 0f61c507
carrier foundation revision: a535edd9
banner follow-up revision: 0f61c507
archive: watch-shop-staging-0f61c507.tar.gz
archive SHA-256: 48215d6969b6889c55d8d9fb9b3e0502a432ae884b8c97f9fb375651e66a19ef
runtime image: watch-shop:storefront-staging-0f61c507
runtime image ID: sha256:612412e2c66b4a0c161b272126282ce3bb0e6bd6f4743203e23af7cbefb96597
ops image: watch-shop-ops:storefront-staging-0f61c507
ops image ID: sha256:457186dc15290ec5f174464fb9f0ff97d46482912beb67f4b3aaf9a27fd014cb
release directory: /share/homes/user/watch-shop-staging-releases/release-0f61c507
```

## Scope

Carrier integration foundation:

- additive carrier request, charge, package, status-history and webhook-delivery
  persistence;
- carrier quote/create/sync service and authenticated Admin Shipment endpoint;
- webhook endpoint with signature and idempotent delivery handling;
- MOCK and Viettel Post adapters plus environment/host safety checks;
- carrier dispatch assistant in the Shipment operational UI;
- carrier tracking remains an external observation and does not directly mutate
  the canonical Shipment lifecycle state.

Storefront follow-up included in the same staging release:

- the catalog banner selects the first available Gallery hover image from the
  current catalog result;
- the banner keeps a clean fallback when no Gallery image is available;
- the image is composed on the right with a subtle blur/desaturation and a
  gradient into the text area;
- three restrained warm-stone/champagne/sage-grey tones transition with the
  rotating banner content;
- typography and text width were reduced to stay proportional to the compact
  banner.

## Staging safety configuration

The staging release deliberately does not use a real carrier endpoint or
credential:

```text
CARRIER_ENVIRONMENT=mock
CARRIER_PROVIDER=MOCK
NEXT_PUBLIC_CARRIER_TEST_UI=1
```

`CARRIER_WEBHOOK_SECRET` was generated directly on the NAS, stored only in the
mode-600 staging env file and was not printed or committed. Do not reuse it in
production. Do not switch staging to a production carrier hostname; the carrier
configuration guard rejects production hosts outside the production
environment.

## Database and migration evidence

The target was independently confirmed as:

```text
host: watch-shop-staging-db:5432
database: watch_shop_storefront_staging
```

Pre-migration backup:

```text
/share/homes/user/watch-shop-staging-backups/watch-shop-staging-pre-0f61c507.dump
/share/homes/user/watch-shop-staging-backups/watch-shop-staging-pre-0f61c507.dump.sha256
sha256sum -c: OK
size: 3.9 MB
```

`prisma migrate deploy` found 49 migrations and successfully applied:

```text
20260813_add_carrier_integration_foundation
```

The first permission audit then correctly blocked rollout because the old
staging clone had forbidden drift:

```text
SALE -> ACCESSORY_ACQUISITION_DELETE
```

The already-reviewed idempotent repair in
`prisma/migrations/20260806_restrict_sale_acquisition_scope/migration.sql` was
executed once against staging. The repeated audit passed with `ok: true`, 78/78
persisted permissions and no missing, role, forbidden-role or retired-code
drift. No application container was replaced before that gate passed.

## Validation

Local validation before packaging:

- carrier config, MOCK adapter and Viettel Post adapter tests: 6/6 pass;
- scoped ESLint for carrier endpoints/services/UI and the catalog banner: pass;
- full TypeScript check with incremental output disabled: pass;
- production build: pass, 130/130 pages;
- archive checksum verified after transfer to the NAS.

Post-rollout staging acceptance:

- `watch-shop-storefront-staging-app-1`: healthy on the new image;
- `watch-shop-storefront-staging-admin-app`: healthy on the same new image;
- staging app `/api/health`: `status=ok`;
- staging app `/api/ready`: `status=ready`, database reachable;
- `http://192.168.1.253:18088/products`: HTTP 200;
- `http://192.168.1.253:18089/admin`: HTTP 200;
- unauthenticated carrier Admin endpoint through the admin proxy: HTTP 401;
- public staging proxy continues to return HTTP 404 for `/admin` and
  `/api/health`;
- carrier flags inside both staging applications are `mock`, `MOCK`, `1`;
- application startup logs are clean; the admin app was ready in 227 ms.

Production remained on `watch-shop:release-ad99bc30` throughout the deployment.
No production migration, env edit, container replacement or carrier call was
performed.

## Staging access and rollback

LAN acceptance URLs:

```text
storefront: http://192.168.1.253:18088/products
admin:      http://192.168.1.253:18089/admin
```

The prior standalone admin staging container was retained stopped as:

```text
watch-shop-storefront-staging-admin-app-rollback-5916cbde
```

Application rollback uses `watch-shop:storefront-staging-5916cbde` for both
staging app surfaces and then restarts their corresponding proxy containers.
The carrier migration is additive, so application rollback normally leaves the
schema in place. Restore the checksum-verified staging backup only for a
separately approved database rollback; never restore it into production.

## Manual acceptance still required

Use staging-only Shipment data to verify the MOCK flow through the Admin staging
surface:

1. open a staging Shipment and request a quote;
2. create the MOCK carrier order and verify the external/tracking identities;
3. advance MOCK tracking through the simulator and verify idempotent history;
4. confirm charges remain separate from canonical Shipment status transitions;
5. verify duplicate webhook delivery does not duplicate status history or
   charges;
6. visually review the dynamic Gallery banner through several tone transitions
   and with catalog filters/sorts that change the selected image.

Do not enter real customer contact data and do not configure real carrier
credentials during this acceptance pass.
