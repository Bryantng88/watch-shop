# Public Storefront MVP and NAS Handoff

Date: 2026-07-20

## Decision

The repo has enough business foundation to start a basic customer-facing
storefront, but the current public surface should be treated as a prototype.

Target the first release as a public catalog plus order-request flow, not a
fully automated ecommerce checkout.

The legacy storefront is a visual reference only. Preserve its approved visual
direction where useful, but do not restore or extend its obsolete feature,
cart, catalog, data-access, or service code.

## Storefront Engineering Contract

- Rebuild the UI with current project conventions and mobile-first responsive
  components; use the legacy list/detail styling only as a design reference.
- Keep channel UI and transport thin. Storefront and Zalo adapters validate and
  translate requests, then call explicit application/domain boundaries.
- Put public-safe watch selection, availability, pricing and order-request rules
  in shared application/domain services. Do not duplicate those rules across
  pages, route handlers or Zalo integrations.
- Query through an explicit public catalog read service/projection that returns
  a small public DTO. Never expose a Prisma entity or reuse an admin DTO and
  redact it afterward.
- Keep repositories focused on persistence and optimized projections. Select
  only fields required by the public contract, avoid N+1 queries, paginate list
  reads, and define cache/revalidation behavior explicitly.
- Keep write flows transactional where business invariants require it. Resolve
  price, availability and locks on the server; never trust client-derived
  business values.
- Define and version request/response schemas for storefront and Zalo ingress.
  Validate at the boundary and cover application contracts with automated
  tests.
- Do not import from admin route folders or legacy `features/cart`,
  `features/catalog`, static demo data, or abandoned storefront components.
- Delete superseded legacy storefront code only after the replacement list,
  detail and order-request flows pass their acceptance gates.

## Recommended MVP Scope

- Public visitors can browse watches.
- Public visitors can view a watch detail page.
- Public visitors can search and filter the catalog.
- Public visitors can add one or more watches to an order request.
- Public order submission creates a `WEB` order with pending verification.
- Admin keeps confirming, reserving, payment tracking, shipment, and operations
  in the local admin surface.

## Phase 0: Mobile-First and PWA-Ready Foundation

This is the first implementation phase when the storefront rebuild starts. Do
not begin by extending the current desktop prototype.

- Design the public list, detail and order-request flow mobile-first, then expand
  them for tablet and desktop.
- Verify the primary flows at 360 px, 390 px and 430 px widths. Controls must not
  overlap, depend on hover, or require page-level horizontal scrolling.
- Keep tap targets at least 44 px where practical; use mobile drawers/sheets for
  filters and menus, and stable aspect ratios for product media.
- Add a web app manifest, install icons, theme metadata and an installable HTTPS
  shell. Treat offline support as progressive enhancement, not as a requirement
  to submit orders without a connection.
- Cache only versioned static assets and explicitly public catalog/media
  responses. Never cache admin pages, authenticated API responses, customer
  details, order submissions or other business mutations in a service worker.
- Show an explicit offline/read-only state. Availability, price and order
  submission must be revalidated against the server when online.
- Keep the admin application responsive where practical, but do not include it
  in the storefront PWA offline/cache scope.

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

## Zalo Public API Boundary

Zalo integrations have the same internet-reachability requirement as the
storefront: Zalo cannot call admin routes that are intentionally available only
from the LAN or VPN. The public reverse proxy may therefore expose a narrowly
scoped Zalo ingress alongside the storefront.

- Keep `/admin` and `/api/admin/*` private.
- Expose dedicated HTTPS endpoints such as `/api/integrations/zalo/*`; do not
  expose admin APIs for Zalo and do not treat a Zalo webhook as an anonymous
  storefront request.
- Storefront and Zalo may share the same public-safe catalog query and modern
  Order application/domain boundary. Share application services and business
  rules rather than making one channel call another channel's HTTP endpoint.
- Watch lookup from Zalo must return only the same public-safe fields and
  availability rules as the storefront catalog. It must never leak cost,
  vendor, acquisition, service, task, or other internal metadata.
- A Zalo order request must resolve current product, price, availability and
  order locks on the server, then create a `WEB`/channel-attributed pending
  draft through the same safe order flow used by storefront requests.
- Verify the Zalo webhook signature/token before processing, allow only known
  event types, validate payload schemas, apply rate limits, record delivery or
  event ids for idempotency, and reject replayed or duplicate requests.
- Acknowledge webhooks quickly and move slow processing to a durable background
  flow where needed. Log correlation ids and sanitized outcomes without logging
  secrets or unnecessary customer data.
- Configure the reverse proxy to expose only the required Zalo paths, with HTTPS
  and request-size/time limits. Public reachability must not widen access to the
  admin surface.

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

1. Establish the mobile-first layout, responsive navigation, viewport test
   matrix and PWA-ready public shell described in Phase 0.
2. Replace old public catalog imports with a current public watch catalog query.
3. Rebuild public list/detail UI on that foundation.
4. Implement public filters on top of the public-safe query.
5. Rewire `api/public/orders` to the modern order application boundary.
6. Add schema validation for public order input.
7. Add spam/rate-limit guardrails.
8. Fix middleware filename/config and reverse proxy rules for `/admin` and
   `/api/admin`.
9. Add the authenticated Zalo ingress on the same public-safe catalog and Order
   application boundaries, including signature verification, validation,
   idempotency, rate limiting and channel attribution.
10. Test the NAS deployment path with storefront/Zalo-only access over HTTPS.

## Delivery Phases And Gates

Each phase must close its gate before work depending on it is considered ready.
Visual work may be prototyped in parallel, but it must not bypass the public
data and application contracts.

### Phase 0: Baseline, Contracts And Legacy UI Inventory

Deliverables:

- Inventory current public routes, legacy storefront components/assets and
  broken or abandoned imports.
- Capture the approved legacy visual direction as screenshots/tokens/component
  references without adopting its implementation.
- Define public Watch list/detail DTOs, filter/pagination contract, public image
  policy and public-sale eligibility rules.
- Define storefront order-request and Zalo channel contracts, including error
  shapes, idempotency keys and channel attribution.
- Verify middleware naming/behavior and document the reverse-proxy exposure
  matrix for public, Zalo and private admin paths.

Gate:

- Contracts and exposure matrix are reviewed; no public DTO includes internal
  cost, vendor, acquisition, service, task or operational fields.

### Phase 1: Public Catalog Read Boundary

Implementation handoff:

- `docs/sprints/SM-Storefront-Phase-1-public-catalog-boundary.md`

Deliverables:

- Add a dedicated public catalog query/application service and repository
  projection over current Watch business truth/read models.
- Implement sale-ready filters, stable sorting, cursor or bounded pagination,
  search/filter normalization and public image resolution.
- Add list/detail contract tests, query-count checks where practical and tests
  proving `SOLD`, `HOLD`, draft and internal records cannot leak.
- Make the same application query callable by storefront and future Zalo
  adapters without HTTP-to-HTTP calls.

Gate:

- Public list/detail contracts pass, return only eligible watches and remain
  independent from admin route folders and legacy storefront features.

### Phase 2: Mobile-First Storefront Shell And Catalog UI

Implementation handoff:

- `docs/sprints/SM-Storefront-Phase-2-mobile-shell-and-catalog-ui.md`

Deliverables:

- Build the new public layout, header/navigation, footer, theme metadata and
  responsive content shell using the legacy UI only as visual reference.
- Implement Watch list, cards, loading/empty/error states, pagination and a
  mobile filter sheet on the Phase 1 contract.
- Implement the Watch detail page with stable media layout and public-safe
  specifications.
- Validate 360 px, 390 px, 430 px, tablet and desktop layouts, keyboard use and
  basic accessibility.

Gate:

- List/detail flows render from real public data without missing imports,
  mojibake, horizontal page overflow or admin/internal data exposure.

### Phase 3: Cart-Like Selection And Order Request

Deliverables:

- Implement a lightweight client selection/cart for composing an order request;
  it is not authoritative inventory or checkout state.
- Define validated public order schemas and keep the route handler thin.
- Complete the modern Order application flow with server-resolved price,
  availability and locking, transactional invariants, `source=WEB`,
  `status=DRAFT` and `verificationStatus=PENDING`.
- Add idempotency, duplicate protection, rate limiting and a honeypot/captcha
  strategy; return stable safe errors without leaking internals.
- Cover successful, unavailable, sold/hold, price-tampering, duplicate and
  concurrent request cases.

Gate:

- A public request creates exactly one valid pending draft; client price cannot
  affect persisted price and unavailable watches cannot be ordered.

### Phase 4: Zalo Adapter On Shared Contracts

Deliverables:

- Add dedicated `/api/integrations/zalo/*` ingress and signature/token
  verification, supported-event allow-list, payload schemas and replay defense.
- Adapt Zalo Watch lookup to the Phase 1 public catalog service.
- Adapt Zalo order creation to the Phase 3 Order application flow with explicit
  Zalo channel attribution and idempotent event/delivery ids.
- Add fast acknowledgement, sanitized correlated logging and durable background
  processing for slow work where needed.

Gate:

- Valid Zalo requests use the same business rules as storefront; invalid,
  replayed or duplicate events create no order and no admin API is exposed.

### Phase 5: PWA, Security And NAS Exposure

Deliverables:

- Add manifest, install icons, theme metadata and an HTTPS-installable shell.
- Define service-worker cache allow-lists for versioned static assets and safe
  public reads only; explicitly exclude mutations, customer data and all admin
  or authenticated responses.
- Add a visible offline/read-only state and revalidate price/availability before
  submission.
- Configure reverse proxy, HTTPS, request-size/time limits and public route
  allow-lists while keeping `/admin` and `/api/admin/*` LAN/VPN-only.
- Run security, restore, media URL and external-network acceptance checks.

Gate:

- Storefront and Zalo work through public HTTPS, admin remains unreachable from
  the public internet, and cache/security acceptance checks pass.

### Phase 6: Controlled Release And Legacy Cleanup

Deliverables:

- Release behind an explicit public exposure switch or reverse-proxy rule,
  monitor errors, latency, order duplication and availability conflicts.
- Document rollback for application, proxy configuration and storefront cache.
- Remove superseded legacy pages/components/assets and broken feature imports
  only after the replacement passes production smoke checks.
- Update the handoff with final contracts, operational ownership and deferred
  ecommerce features.

Gate:

- Production smoke and monitoring are stable, rollback is proven, and removed
  legacy code has no remaining imports or runtime dependency.

## Acceptance Checklist

- `npm run lint` or scoped lint passes for changed public/order files.
- `/products` renders without missing imports.
- `/products/[slug]` renders with correct data and no mojibake.
- Filters work on desktop and mobile.
- List, detail, navigation, filters and order request pass at 360 px, 390 px and
  430 px without overlap or page-level horizontal overflow.
- Public storefront has a valid web app manifest, install icons and theme
  metadata, and is installable when served over HTTPS.
- Service-worker caching excludes admin/authenticated routes and all order or
  business mutations.
- Offline mode is visibly read-only and cannot present stale availability as a
  confirmed order.
- Public order creates a `WEB` pending draft order.
- Public order cannot submit sold/hold/unavailable watches.
- Client-submitted price cannot override DB price.
- `/admin` is not reachable from the public internet.
- `/api/admin/*` is not reachable from the public internet.
- Zalo can reach only its dedicated authenticated integration endpoints; valid
  watch lookup and order-request flows reuse the public-safe application rules.
- Invalid signatures, replayed events, duplicate order requests and unsupported
  Zalo events are rejected without creating an order.
- Images render from NAS/public URLs.

## Next Prompt

Resume from this doc and rebuild the public storefront. Start with Phase 0:
audit the current public routes at the required mobile widths, establish the
mobile-first/PWA-ready shell and its cache boundaries, then rewire the catalog
and public order API to the modern domain/application boundaries. Do not expose
the storefront publicly until the security and NAS acceptance gates pass.
