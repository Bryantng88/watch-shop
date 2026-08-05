# Storefront Phase 4: Zalo Adapter

Date: 2026-08-05

## Outcome

An authenticated Zalo connector ingress now adapts two allow-listed events to
the existing public-safe application services:

- `watch.lookup` calls the Phase 1 public catalog query;
- `order.create` calls the Phase 3 public Order request flow with `ZALO`
  attribution and the external event id as its durable idempotency key.

The ingress is `/api/integrations/zalo/events`. It imports no admin route or
admin API implementation. The migration is still unapplied because the current
configured database is shared with production; the endpoint must not be
enabled yet.

## Owned HMAC Contract

This is the Watch Shop connector contract, not an assumed native Zalo OA
webhook signature.

Required headers:

- `x-watchshop-key-id`
- `x-watchshop-timestamp`: Unix seconds, maximum clock skew 300 seconds
- `x-watchshop-nonce`: 16-128 allow-listed characters
- `x-watchshop-signature`: lowercase/uppercase hex HMAC-SHA256

Canonical payload:

```text
v1\n
{timestamp}\n
{nonce}\n
{UPPERCASE_METHOD}\n
{path_and_query}\n
{sha256_hex_of_exact_raw_body}
```

The secret is selected from `ZALO_INGRESS_KEYS`, a JSON object mapping key id
to a secret of at least 32 characters. `ZALO_INGRESS_SECRET` is supported only
as a single `default` key compatibility option. Signature comparison is
constant-time. Payloads over 64 KiB are rejected at the application boundary;
the reverse proxy must enforce the same or a smaller limit before buffering.

## Event Contract

Every strict JSON envelope contains:

- `eventId`: 16-128 safe characters;
- `occurredAt`: offset-aware ISO timestamp;
- `type`: exactly `watch.lookup` or `order.create`;
- `data`: the existing public catalog query or public order request schema.

Unknown fields and unsupported events are rejected. Responses and logs expose
only stable error codes and the caller event id; secrets, signatures, customer
payloads and internal stack traces are not logged.

## Durable Replay Handling

`IntegrationIngressReceipt` persists channel, key id, nonce, event id, event
type, request hash, status and sanitized result/error metadata.

- Channel + nonce and channel + event id are unique.
- Same event id with a changed request hash is a conflict.
- Completed duplicate events return the stored safe response and do not rerun
  business writes.
- Fresh concurrent duplicates return `EVENT_IN_PROGRESS`.
- A processing receipt older than 60 seconds may be reclaimed. Order retry is
  still safe because the same Zalo event id reaches the atomic Order
  idempotency key.
- Receipts expire logically after 24 hours; a later operational cleanup job may
  delete expired rows without changing replay behavior during the window.

## Verification

- `npm run storefront:smoke-zalo`: pass; valid HMAC, raw-body tamper,
  timestamp expiry and event allow-list are covered.
- Scoped storefront/Zalo ESLint: pass.
- TypeScript `--noEmit`: pass.
- Prisma schema formatting and generated TypeScript models: pass. On Windows,
  Prisma could not replace the in-use query-engine executable; rerun generate
  in the clean build container.

## Remaining Gate

- Apply the Phase 3/4 migration to an isolated test database.
- Exercise receipt replay/concurrency and Zalo-created Order/HOLD outcomes over
  HTTP with a real connector key.
- Confirm the intended connector can generate this owned HMAC contract.
- If using native Zalo OA webhooks directly, obtain the authenticated official
  OA webhook contract and add a separate native verifier adapter; do not change
  the shared catalog or Order services.
- Do not expose the endpoint or storefront until Phase 5 proxy/security gates.
