# Public Storefront MVP and NAS Handoff

Date: 2026-07-20

## Decision

The repo has enough business foundation to start a basic customer-facing
storefront, but the current public surface should be treated as a prototype.

Target the first release as a public catalog plus order-request flow, not a
fully automated ecommerce checkout.

## Recommended MVP Scope

- Public visitors can browse watches.
- Public visitors can view a watch detail page.
- Public visitors can search and filter the catalog.
- Public visitors can add one or more watches to an order request.
- Public order submission creates a `WEB` order with pending verification.
- Admin keeps confirming, reserving, payment tracking, shipment, and operations
  in the local admin surface.

## Current Evidence

- Public route group exists under `src/app/(public)`.
- Public product list/detail routes exist:
  - `src/app/(public)/products/page.tsx`
  - `src/app/(public)/products/[slug]/page.tsx`
- Public order API exists:
  - `src/app/api/public/orders/route.ts`
- Modern order domain already supports the safer public order default:
  - `src/domains/order/application/create-order/create-order.application.ts`
  - `source === WEB` defaults to `verificationStatus=PENDING`.
  - `source === WEB` defaults to `status=DRAFT`.
- Watch inventory read model/domain exists:
  - `src/domains/watch/server/inventory-query/watch-inventory-query.service.ts`

## Gaps Before Public Exposure

- Public pages still look like an older/prototype implementation.
- Public product pages import `@/features/catalog/...`, but the current
  `src/features` listing shows `products`, `cart`, and `__generated__`, not a
  clear `catalog` feature folder.
- Several public files contain mojibake/encoding-corrupted Vietnamese text.
- `src/app/api/public/orders/route.ts` imports the old admin order service:
  `@/app/(admin)/admin/orders/_servers/order.service`.
- Public order API should call the domain/application path instead:
  `createOrderApplication` or the modern order server boundary.
- Public API currently needs stronger input validation, spam protection, and
  duplicate/order-lock hardening before internet exposure.
- Root middleware appears to be named `src/middeware.ts` instead of
  `middleware.ts`; verify whether Next is actually applying admin protection.

## Exposure Boundary

NAS hosting is acceptable for the public storefront if access is split clearly:

- Expose only public routes, static assets, media needed by the storefront, and
  `api/public/*`.
- Keep `/admin` and `/api/admin/*` LAN/VPN-only, or block them at the reverse
  proxy.
- Do not rely only on UI hiding for admin protection.
- Use HTTPS, backups, and a restore plan for database and media.

## Public Catalog Rules

Only show watches that are safe to sell publicly:

- Sale-ready / available / in-stock.
- Has a usable public image.
- Has a public price or a clear contact-for-price policy.
- Not `SOLD`.
- Not `HOLD`.
- Not draft/internal/testing content.
- No internal cost, vendor, service, acquisition, or task metadata leaks.

## Public Order Rules

The public order form should be a request/lead flow:

- Required fields: customer name, phone, address or contact channel, selected
  watches.
- Optional fields: note, preferred contact method.
- Server must not trust client-submitted price.
- Server resolves product, price, availability, stock/order locks from DB.
- Create order as `source=WEB`, `status=DRAFT`, `verificationStatus=PENDING`.
- Admin verifies before posting/reserving/finalizing.
- Add rate limit, honeypot or captcha, and idempotency/duplicate protection.

## Suggested Implementation Plan

1. Replace old public catalog imports with a current public watch catalog query.
2. Rebuild public list/detail UI as a compact mobile-first storefront.
3. Implement public filters on top of the public-safe query.
4. Rewire `api/public/orders` to the modern order application boundary.
5. Add schema validation for public order input.
6. Add spam/rate-limit guardrails.
7. Fix middleware filename/config and reverse proxy rules for `/admin` and
   `/api/admin`.
8. Test the NAS deployment path with public-only access.

## Acceptance Checklist

- `npm run lint` or scoped lint passes for changed public/order files.
- `/products` renders without missing imports.
- `/products/[slug]` renders with correct data and no mojibake.
- Filters work on desktop and mobile.
- Public order creates a `WEB` pending draft order.
- Public order cannot submit sold/hold/unavailable watches.
- Client-submitted price cannot override DB price.
- `/admin` is not reachable from the public internet.
- `/api/admin/*` is not reachable from the public internet.
- Images render from NAS/public URLs.

## Next Prompt

Resume from this doc and build the public storefront MVP hardening pass. Start
by auditing the current public route imports and rewiring the public order API
to the modern order application boundary before exposing anything on NAS.
