# Storefront Phase 2: Mobile Shell And Catalog UI

Date: 2026-08-05

## Outcome

The public shell, catalog list and Watch detail surfaces have been rebuilt on
the Phase 1 public catalog boundary. The legacy UI informed the restrained
catalog/gallery visual direction, but no legacy cart/catalog feature code or
Bootstrap runtime was restored.

The surfaces remain `noindex, nofollow` and are not authorized for public NAS
exposure yet.

## Implemented

- `/` now redirects to `/products` inside the public route group.
- Public layout includes a mobile menu, compact brand header, catalog
  navigation, footer and explicit storefront error state.
- `/products` renders real public-safe catalog data with:
  - search;
  - audience filter;
  - public price range;
  - stable sorting;
  - cursor-based “xem thêm” navigation;
  - mobile filter disclosure and desktop sidebar;
  - loading-independent empty/error states.
- `/products/[slug]` renders public title, gallery, price/contact policy,
  summary, allow-listed specifications and safe SEO metadata.
- Product media uses stable 3:4 and square aspect ratios with responsive Next
  image sizing.

## Public Image Delivery

`/api/public/catalog/watches/{productId}/images/{imageId}` performs an
identity-bound database lookup before signing storage media. The lookup
requires:

- matching product id and image id;
- `isForStorefront = true`;
- a non-empty storage key;
- the owning Watch still satisfying the complete public catalog eligibility
  predicate.

The endpoint never accepts a caller-provided storage key and does not reuse or
expose `/api/media/sign`. Signed redirects expire in a bounded 60-600 second
window and return public cache headers only for that safe GET redirect.

## Boundary And Runtime Verification

- Scoped ESLint: pass.
- TypeScript `--noEmit`: pass.
- `npm run storefront:smoke-contract`: pass.
- `npm run storefront:smoke-surface`: pass.
- Production Next build: pass; `/products`, `/products/[slug]` and the public
  image endpoint are recognized as dynamic routes.
- Local `/products` against the configured Supabase connection: HTTP 200.
- Public surface smoke proves no admin imports, no admin media signer and no
  accidental admin-auth matcher on `/api/public/*`.

## Responsive Gate Status

The implementation is mobile-first and has explicit breakpoints/tap targets for
360, 390 and 430 px. A first screenshot run caught and corrected announcement,
header and empty-state sizing issues.

Final automated screenshot evidence remains pending because the available
Windows Chrome CLI enforced a larger minimum CSS viewport while cropping the
bitmap, and its DevTools emulation channel did not return stable messages. Do
not treat those cropped screenshots as acceptance evidence. Complete a manual
browser/device pass at 360, 390 and 430 px before closing the responsive gate.

## Phase 2 Gate

- Public shell/list/detail implementation: complete.
- Public image ownership/security boundary: complete.
- Compile, type, contract and boundary smoke gates: complete.
- Real configured-database HTTP smoke: complete.
- Manual 360/390/430 visual acceptance: pending.
- Public exposure: forbidden until later security/NAS gates.

Next after the manual visual pass: Phase 3 implements local selection/cart and
the hardened idempotent public order-request application flow.

