# Storefront Phase 1: Public Catalog Boundary

Date: 2026-08-05

## Outcome

The storefront now has a dedicated public Watch catalog read boundary. It is
not wired to an internet-facing route yet; the existing public pages continue
to redirect to admin until the Phase 2 UI is ready.

## Implemented Boundary

- `src/domains/storefront/contracts/public-catalog.contract.ts`
  - validated search/filter/sort/cursor input;
  - bounded page size (24 default, 48 maximum);
  - explicit list/detail/image/price/spec DTOs;
  - strict public slug validation.
- `src/domains/storefront/server/public-catalog.repo.ts`
  - a dedicated Prisma select with no admin DTO reuse;
  - one bounded query for list data and one query for detail data;
  - explicit storefront-only image selection;
  - centralized public eligibility and normalized filters;
  - opaque cursor support and deterministic tie-break ordering.
- `src/domains/storefront/server/public-catalog.service.ts`
  - DTO mapping and price/contact policy;
  - opaque versioned cursor encoding/validation;
  - stable public image references by product/image identity;
  - public specification allow-list rather than raw model serialization.

## Eligibility Applied At The Repository

Every returned item must satisfy all of the following:

- `Product.type = WATCH`;
- `Product.status = AVAILABLE`;
- non-empty slug and published timestamp;
- Product and Watch content are both `PUBLISHED`;
- Watch sale stage is `READY`;
- Watch stock stage is `IN_STOCK`;
- Watch service stage is `NOT_REQUIRED` or `DONE`;
- at least one non-empty `ProductImage` explicitly has
  `isForStorefront = true`;
- visible prices require a positive authoritative Watch sale price; hidden
  prices map to `CONTACT` with no amount.

The order write flow must re-check availability and active locks. Catalog
eligibility is a read-time promise, not an inventory reservation.

## Data-Leak Guardrail

`scripts/smoke-storefront-contract.ts` recursively audits the public Prisma
selects and mapped DTOs. The smoke rejects vendor, acquisition, cost, minimum
price, service cost, task, review and internal note keys. It also proves the
public order schema rejects caller-provided price and source fields.

Run:

```powershell
npm run storefront:smoke-contract
```

## Public Media Boundary

Catalog DTOs reference images through:

```text
/api/public/catalog/watches/{productId}/images/{imageId}
```

The route is intentionally not implemented in Phase 1. Phase 2 must resolve
the image by both identities and re-check `isForStorefront = true`; it must not
accept an arbitrary storage key and must not expose `/api/media/sign` publicly.

## Verification

- scoped ESLint: pass;
- TypeScript `--noEmit`: pass;
- storefront contract smoke: pass;
- no public route enabled and no database migration required.

## Phase 1 Gate

- Dedicated catalog repository/query service: complete.
- Explicit public DTO and allow-listed specifications: complete.
- Eligibility exclusions centralized: complete.
- Cursor and input contracts: complete.
- Forbidden-field/order-boundary regression smoke: complete.
- Public media delivery: deferred to Phase 2 with the identity-bound contract
  above.

Next: Phase 2 builds the mobile-first public shell, catalog list/detail routes
and identity-bound public image delivery on this boundary.

