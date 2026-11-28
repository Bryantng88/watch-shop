# Domain layering and incremental adoption

Status: accepted for incremental implementation, 2026-11-28.

The application remains a domain-first modular monolith. This contract does not
authorize a bulk folder move, schema change, or split into network services.
Use the owning-domain rules in 15, the durable delivery rules in 28 (which take
precedence over older direct-dispatch examples), and the projection contracts.

## Responsibilities

- `app`: routing, authentication/authorization entry, request parsing and initial
  page composition. Routes delegate business operations to their owning domain.
- `ui`: components and interaction hooks. New browser-facing components belong
  here; existing `client` directories remain compatible until their feature is
  deliberately migrated. Folder names alone do not make code client or server.
- `actions` / API adapters: authenticate, validate the request, call the use case,
  serialize its outcome and invalidate the relevant read surface. Server Actions
  with `use server` are RPC boundaries, not browser implementation imports.
- `application`: optional coordination of a nontrivial use case. Small domains
  do not need this directory or an extra pass-through wrapper.
- `server/*.service.ts`: business rules, command transaction boundaries and DTO
  assembly. Services receive verified actor context where required; moving logic
  must never move or remove its authorization guard.
- `server/*.repo.ts`: source queries and persistence. Accept the shared `DB`
  transaction/client port. Do not open a hidden transaction or commit midway
  through a caller's business command.
- `shared` / `contracts`: safe DTOs, validation and pure rules. No database,
  storage credentials, worker orchestration or server side effects.
- `domains/shared` and `server`: UI/feedback primitives versus shared server
  infrastructure. Do not create a second generic helpers hierarchy.

Runtime browser imports must not reach server/storage implementations or Prisma.
Type-only imports are excluded. Browser access to a Server Action is allowed;
browser authorization is never a substitute for its server check.

Only the owning domain changes its business truth. Cross-domain read composition
is allowed explicitly for a view, without acquiring ownership of those records.
Cross-domain commands use the owner's public command boundary. Business changes
and their durable event/outbox records share the owning transaction; consumers
run after commit. Do not force every local field edit through an event.

## Reference slice: Order draft preparation

`getOrderDraftForEdit` in `order/server/detail/order-detail.service.ts` assembles
the editable DTO. `getOrderDraftForEditRepo` and `getOrderTradeInForEditRepo` own
the source-backed queries and accept `DB`. The trade-in read is an explicit
read-only composition with Acquisition; it does not write Acquisition records.
Projection-backed display and source-backed edit preparation remain distinct.
This pilot preserves selections, ordering, mapping and public APIs. It does not
declare every existing Order service fully migrated.

## Enforcement and rollout

Run `node scripts/check-domain-layering.mjs`. It traces runtime imports from
`use client` entrypoints through local imports/re-exports/dynamic imports, stops
at Server Action RPC modules, and checks the Order pilot for inline model queries.
It is a conservative source boundary check, not proof of the emitted browser
bundle's contents or a replacement for permission and transaction tests.

Existing violations are frozen in `domain-layering-baseline.json`. These are
reviewed migration targets, not approved design patterns or confirmed credential
exposures. CI rejects new violations and obsolete exceptions. Baseline expansion
requires an explicit reason/review; never regenerate it to silence a failure.

Next work is driven by risk: first command permissions, inventory/payment
transactions and event delivery; then split large Work/Coordination/Watch UI by
use case while retaining behavior tests. Migrate legacy paths only with actual
call-site work; remove adapters only after checking all callers. Avoid cosmetic
repository-wide renames and do not add folders that merely forward calls.
