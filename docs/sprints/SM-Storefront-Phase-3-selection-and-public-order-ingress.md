# Storefront Phase 3: Selection And Public Order Ingress

Date: 2026-08-05

## Outcome

Storefront customers can keep a local product selection and submit a narrow
order request. The public route delegates to the storefront application
boundary; it does not construct trusted prices, titles or order state from
caller data.

This phase is implemented in source but its migration has not been applied to
the configured shared database. Public exposure remains forbidden.

## Write Contract

- The request schema is strict and accepts customer/contact/address/note plus
  product id and quantity only.
- Product eligibility is resolved against the public catalog predicate.
- Contact-price Watches cannot enter the order flow; they remain consultation
  only.
- The existing Order write service resolves title, active variant, price,
  inventory state and HOLD transition on the server.
- Public orders are always `WEB`, `DRAFT` and `PENDING` verification.
- The response contains only order id, reference and pending-verification
  status.

## Retry, Abuse And Concurrency Controls

- `Idempotency-Key` is mandatory and namespaced by ingress channel.
- Request hash mismatch on a reused key returns conflict.
- The key and request hash live on `Order`, so the idempotency record and order
  commit atomically.
- PostgreSQL transaction advisory locks serialize the public request key,
  client fingerprint and each ordered product.
- A database-backed 5 requests / 10 minutes fingerprint limit survives process
  restarts and multiple application workers.
- The honeypot field rejects simple form bots.
- A Zalo external request id can become the durable channel-specific key; Zalo
  authentication remains a later dedicated ingress phase.

## UI

- Selection is capped at 20 unique products and persisted in browser local
  storage.
- Header shows the live selection count.
- Product detail adds orderable Watches to `/request`; contact-price Watches
  retain consultation CTA.
- The request form sends no product title or price and clearly states that the
  request is not payment and requires confirmation.

## Verification

- Scoped storefront ESLint: pass.
- TypeScript `--noEmit`: pass.
- Existing storefront contract and surface smokes: pass.
- `npm run storefront:smoke-order`: pass (strict input, server price boundary,
  durable lock/idempotency/rate-limit source assertions).
- Production build compiled, type-checked and generated 124/124 pages; the
  first runner timed out during final trace collection, so a clean completion
  run is retained as the final gate.

## Remaining Gate

- Apply `20260808_storefront_public_order_ingress` only to an isolated dev/test
  database first.
- Run destructive/concurrent HTTP tests there: same key replay, changed-body
  conflict, two keys for one Watch, and rate-limit rejection.
- Confirm the winning request creates exactly one Order and one HOLD outcome.
- Complete the pending 360/390/430 manual visual pass.
- Do not deploy or expose storefront until these database-backed gates pass.
