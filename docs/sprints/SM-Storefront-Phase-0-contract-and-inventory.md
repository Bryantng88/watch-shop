# Storefront Phase 0: Contract And Legacy Inventory

Date: 2026-08-05

## Outcome

Phase 0 establishes the public boundary before rebuilding the storefront. The
legacy storefront is a visual reference only. Its implementation, demo data and
abandoned feature imports are not an approved foundation.

## Current Runtime Baseline

- `src/app/(public)/page.tsx` redirects `/` to `/admin`.
- `src/app/(public)/products/page.tsx` redirects `/products` to
  `/admin/watches`.
- `src/app/(public)/products/[slug]/page.tsx` redirects product detail to
  `/admin/watches`.
- `src/middleware.ts` exists and matches `/admin/:path*`,
  `/api/admin/:path*` and `/api/media/:path*`.
- `src/app/api/public/orders/route.ts` already calls
  `createOrderApplication`, but it is not ready for public exposure: it has no
  idempotency/rate limit and still translates client title/zero-price values
  into the broad admin-oriented order input.
- No manifest, install icons or service worker exist for a public PWA shell.

## Legacy Visual Inventory

Keep only as visual references until replacement acceptance:

- `src/app/(public)/products/page.module.css`: catalog toolbar, filters, product
  grid, price presentation, responsive rules and footer treatment.
- `src/app/(public)/products/[slug]/detail.module.css`: gallery, summary,
  actions, specification blocks and related-product layout.
- `src/components/common/Header/*` and `src/components/common/Footer/*`.
- `src/components/product/PromoBanner/*`, `ProductMeta/*` and `Accordion/*`.
- `public/footer.jpg` and `public/temp_watch.jpg` pending asset review.

Do not reuse as implementation:

- `src/components/hooks/useCart.ts` imports the removed
  `@/features/cart/context/cart-data-context` boundary.
- `src/data/products.ts` contains static demo inventory and expiring/public NAS
  share links.
- `page2.tsx` and `[slug]/oldpage.tsx` are abandoned aliases, not alternate
  production routes.
- Legacy CSS contains mojibake and desktop-first assumptions.

## Public Catalog Contract

The source contract is
`src/domains/storefront/contracts/public-catalog.contract.ts`.

Supported list input:

- normalized text query;
- brand and audience filters;
- public price range;
- newest/price sorting;
- opaque cursor pagination, default 24 and maximum 48 rows.

Public list/detail output is an explicit DTO. It may expose identity, slug,
title, public brand, storefront media, public price/contact policy, audience,
public tag/condition, public content/specifications and SEO fields.

It must never expose Prisma entities, vendor identity, acquisition data, cost or
minimum price, service state/history, task/workflow state, internal notes,
review actors or other admin projection metadata.

## Public Eligibility Contract

A Watch is eligible only when all rules below are true at query time:

- Product is Watch type, has a non-empty unique slug and is published.
- Product status is `AVAILABLE`.
- Watch sale stage is `READY` and stock stage represents in-stock inventory.
- Watch is not `HOLD`, `SOLD`, in service, consigned out, draft or processing.
- Public content is published.
- At least one usable image is explicitly storefront-enabled; image fallback
  policy must not select admin-only media.
- A positive sale/list price exists when price visibility is `SHOW`; otherwise
  the DTO uses the explicit `CONTACT` policy and exposes no amount.
- Active order/reservation locks are checked again by the write flow, even when
  a cached catalog read previously showed the Watch as available.

Phase 1 must encode these rules once in the public catalog query service and
test every exclusion. Admin Watch list DTOs are forbidden because they include
fields such as vendor and cost.

## Public Order Contract

The source contract is
`src/domains/storefront/contracts/public-order.contract.ts`.

- Input accepts customer/contact data, product ids and quantities only. It does
  not accept title, image, price, discount, status, source or verification
  state from a caller.
- `Idempotency-Key` is required at the transport boundary and is 16-128 safe
  characters.
- The application adapter assigns channel `STOREFRONT` or `ZALO` internally.
- The server resolves current title, public price, availability, maximum
  quantity and active locks in the transaction.
- Successful requests create exactly one `WEB`, `DRAFT`, `PENDING` order and
  return a small `PENDING_VERIFICATION` response.
- The `website` field is a honeypot and must remain empty. It is not persisted.
- Rate limiting, durable idempotency and sanitized error mapping are Phase 3
  requirements; the current public route must not be exposed before then.

## Zalo Contract Boundary

- Raw Zalo webhook payloads belong to the Zalo adapter, not the storefront
  contract.
- The adapter verifies provider signature/token and replay window before
  normalization.
- Watch lookup calls the public catalog application service directly.
- Order creation maps to `SubmitPublicOrderCommand` with channel `ZALO` and a
  stable external event/delivery id. It does not call storefront HTTP routes or
  any admin API.
- Provider-specific raw schemas remain pending until the selected Zalo webhook
  event/version and signature specification are confirmed.

## Exposure Matrix

| Path | Internet | Authentication | Cache |
| --- | --- | --- | --- |
| `/`, `/products/*` | Allow after acceptance | Public | Safe GET only |
| `/api/public/catalog/*` | Allow after acceptance | Public + rate limit | Bounded public GET |
| `/api/public/orders` | Allow after acceptance | Public guardrails | Never |
| `/api/integrations/zalo/*` | Allow required paths only | Zalo signature/token | Never |
| `/admin/*` | Deny; LAN/VPN only | Admin session + permission | Never |
| `/api/admin/*` | Deny; LAN/VPN only | Admin session + permission | Never |
| `/api/media/*` | Deny by default | Admin session + permission | Never |

Public image delivery must use a dedicated safe media path or storage policy;
it must not require exposing the admin media API.

## Phase 0 Gate

- Legacy inventory recorded: complete.
- Public catalog DTO/query contract recorded in code: complete.
- Public order/channel command contract recorded in code: complete.
- Public eligibility and forbidden-field rules recorded: complete.
- Middleware and exposure matrix inspected: complete.
- Zalo provider-specific signature/raw event contract: intentionally pending
  provider configuration; it does not block Phase 1 catalog work.

Next: Phase 1 implements the public catalog repository/query service and tests
against these contracts. No public route is enabled in Phase 0.
