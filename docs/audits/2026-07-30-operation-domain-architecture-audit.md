# Operation and Domain Architecture Audit — 2026-07-30

Status: remediation in progress  
Environment audited: development  
Architecture baseline:

- `docs/architecture/15-event-driven-domain-boundary.md`
- `docs/architecture/23-list-projection-consistency-production-gate.md`
- `docs/architecture/27-watch-cost-ledger-projection.md`
- `docs/architecture/28-durable-business-event-consumer-outbox.md`

## Purpose

This document preserves the evidence and remediation history for the
cross-domain audit performed before production. Future audits should append a
dated result to the history section instead of replacing this baseline.

Machine handoff and the authoritative remaining-work checklist:

- `docs/audits/2026-07-30-operation-audit-handoff.md`

## Required architecture

```text
User command
-> owning domain validates and writes business truth
-> BusinessEventLog and durable projection delivery are persisted atomically
-> transaction commits
-> application scheduler runs consumers after commit
-> completion barriers succeed
-> projection delivery reaches SUCCEEDED
-> client reconciles list, board, counters, actor and last action
```

Rules:

- A domain must not write another domain's projection or Workspace runtime.
- GET/list/detail reads must not repair or rebuild populated projections.
- UI progress must distinguish command acceptance from projection completion.
- User-triggered events must preserve the current `actorUserId`.
- List, board, stage count and dashboard must use the same projection contract.

## Baseline evidence

### Healthy foundations

- Projection delivery: `242 SUCCEEDED`, no blocked, pending, processing,
  retryable failed or dead delivery.
- Projection versions: no stale registered version.
- Watch List: 437 rows.
- Watch Cost Ledger: 437 rows.
- Order List and Detail: 74 rows each.
- Payment List: 228 rows.
- Service Request List: 61 source / 61 projection.
- Operation smoke found no duplicate IDs and no item returned in a wrong stage.
- Canonical Flow and Board Query Gateways are active.
- Dashboard GET paths do not run reconciliation writes.

### Performance baseline

| Flow | Stage | Read duration |
| --- | --- | ---: |
| Technical | Inspect | 1531 ms |
| Technical | Ready | 832 ms |
| Technical | Processing | 852 ms |
| Technical | Done | 809 ms |
| Payment | Review | 1283 ms |
| Payment | Settled | 909 ms |
| Media | Photography | 1056 ms |
| Media | Processing | 904 ms |
| Media | Publish | 898 ms |
| Media | Done | 963 ms |
| Shipment | Waiting | 1050 ms |
| Shipment | Processing | 791 ms |
| Shipment | Done | 995 ms |

## Findings and remediation tracker

### A-01 — Domain write and event/outbox are not atomic

Severity: critical  
Status: code migration substantially complete; runtime matrix pending

Evidence:

- Order and Shipment emitters use global Prisma.
- Shipment and several Order commands publish events after the domain
  transaction commits.
- Payment commands also record events after their transaction.

Risk:

Business truth can commit while BusinessEventLog/projection delivery does not.
The visible symptom is a successful action whose item, counter or board remains
in the previous state.

Required remediation:

- Event/outbox persistence accepts and uses the command transaction.
- Consumer execution remains after commit and never retains a transaction
  client.
- Application entry points pass the runtime scheduler.

Implemented:

- Added durable per-consumer outbox rows for coordination, workflow, timeline
  and notification.
- Added independent claim, retry, exponential backoff, stale-lock recovery and
  dead-letter states.
- Coordination/workflow now gate projection release.
- Projection maintenance drains consumer deliveries before projections.
- `recordBusinessEvent` no longer retains a transaction client while executing
  downstream consumers.

Remaining:

- Execute and document the per-command runtime/idempotency matrix listed in
  the handoff document before marking this finding remediated.

### A-02 — Operation progress does not consistently track delivery

Severity: critical  
Status: partially remediated

Evidence:

- Watch Media polls `ProjectionEventDelivery`.
- Generic Payment, Shipment and Technical actions mark progress complete from
  the command response or a timer.

Risk:

The UI reports completion before list/board/count projections are ready,
allowing duplicate user actions and stale refreshes.

Required remediation:

- All operation command results expose projection delivery keys.
- A shared delivery waiter drives progress and refresh.
- Optimistic removal remains allowed while reconciliation is pending.

Implemented:

- Added a shared operation delivery waiter with a 180-second bounded timeout.
- Payment and Shipment operation results now expose their projection delivery
  keys.
- Flow List and Payment Board wait for `SUCCEEDED` before reporting completion
  and refreshing.

Remaining:

- Technical actions must return their event delivery keys through the same
  adapter contract.
- Every remaining board/list action surface must adopt the shared waiter.

### A-03 — Direct projection writes outside the projection consumer

Severity: high  
Status: remediated in code; runtime verification pending

Evidence:

- Watch Workbench directly rebuilds Watch List after title/pricing saves.
- Payment core directly builds `payment-owner-summary`.

Required remediation:

- Emit catalogued domain events.
- Let registered projection builders update affected rows.

Implemented:

- Watch Workbench title saves now emit `watch.spec.updated`.
- Watch Workbench pricing saves now emit `watch.price.updated`.
- Payment command rollups now calculate source-domain settlement state and no
  longer invoke `payment-owner-summary` projection builders.

### A-04 — GET-time projection rebuild

Severity: high  
Status: remediated in code; runtime verification pending

Evidence:

- Order Detail builds a missing row during read.
- Payment owner summary builds missing rows during read.

Required remediation:

- Read returns projection state only.
- Missing rows are repaired through maintenance/backfill.

Implemented:

- Order Detail reads only the persistent `order-detail` projection.
- Single and batch Payment owner summary reads no longer build missing rows.
- Missing coverage is now a maintenance/backfill concern and cannot add write
  latency to GET requests.

### A-05 — Payment Operation uses a hybrid source read

Severity: high  
Status: open

Evidence:

- Payment Operation queries `Payment.findMany`, then joins bindings, activity
  and projection previews.
- `payment-list` already contains all 228 Payment rows.

Required remediation:

- Payment Operation pagination, filtering, sorting and stage counts read
  `payment-list`.
- Activity and binding hydration is limited to the current page.

### A-06 — Workspace runtime ownership leaks into business domains

Severity: high  
Status: open

Evidence:

- Watch Media writes `TaskExecution.metadataJson` directly.
- Order-from-task and Service-from-task create TaskExecution rows directly.
- Reshoot handling reads a coordination consumer result and then mutates its
  binding.

Required remediation:

- Domain events carry the required business payload.
- Workflow/Task application boundaries own TaskExecution mutation.
- Compatibility adapters must be explicit and centralized.

### A-07 — Actor propagation is incomplete

Severity: high  
Status: partially remediated

Fourteen-day event audit:

| Event | Missing actor |
| --- | ---: |
| `payment.status_updated` | 82 / 82 |
| `payment.paid` | 82 / 82 |
| `payment.created` | 21 / 21 |
| `acquisition.created` | 15 / 15 |
| `acquisition.posted` | 13 / 13 |
| `order.posted` | 3 / 3 |
| `shipment.created` | 2 / 2 |
| `watch.created` | 50 / 50 |
| `watch.publish.assets.downloaded` | 7 / 18 |

Required remediation:

- Shared command context requires actor for user-triggered commands.
- Only scheduled jobs, migrations and repair scripts may resolve to System.

Implemented for new operation mutations:

- Payment complete/split events now receive the authenticated actor from the
  operation adapter.
- Shipment-generated Payment events inherit the Shipment command actor.
- Watch Workbench title/pricing events preserve the authenticated actor.

Historical rows remain unchanged; the table above is retained as baseline
evidence.

### A-08 — Flow count contract is inconsistent

Severity: medium  
Status: remediated in code; runtime verification pending

Evidence:

- Technical and Media Flow Query responses contain stage counts.
- Payment and Shipment responses return an empty `stageCounts` object while
  their paginated totals are populated.

Required remediation:

- Each flow gateway returns stage counts from the same projection/filter scope
  as its list and board.

Implemented:

- Non-Media/Technical flows now aggregate stage counts from the same canonical
  Workspace queue count map used by their flow response.

### A-09 — Coordination summary coverage is incomplete

Severity: medium  
Status: open

Evidence:

- Non-cancelled TaskItem source: 324.
- `coordination-workspace-summary`: 320.

Required remediation:

- Identify four missing rows.
- Repair projection rows without replaying business side effects.
- Add coverage to the production gate.

### A-10 — Payment implementation is fragmented

Severity: medium  
Status: open

Evidence:

- `src/domains/payment/server`
- `src/domains/payment/payment/server`
- `src/app/(admin)/admin/payments/_server`
- legacy `payment.service copy.ts`

Required remediation:

- Select one canonical Payment application boundary.
- Convert remaining imports to compatibility re-exports before deleting legacy
  implementations.

## Production gate

Production is not approved while any critical finding is open.

Minimum gate:

- atomic domain write/event/outbox on all operation-visible commands;
- delivery-aware progress for all flow actions;
- zero direct projection writes from domain/UI code;
- zero GET-time projection rebuild;
- zero stale/failed projection delivery;
- source/projection coverage passes;
- actor is present for user-triggered smoke actions;
- list, board and stage counts reconcile after each smoke mutation.

## Audit history

### 2026-07-30 — Initial baseline

- Static architecture audit completed.
- Read-only database projection and flow smoke completed.
- Findings A-01 through A-10 recorded.
- Remediation started.

### 2026-07-30 — Remediation pass 1

- Removed Watch Workbench direct Watch List rebuilds.
- Removed Payment command calls into projection builders.
- Removed Order Detail and Payment owner summary GET-time repair writes.
- Targeted ESLint passed for all changed projection/workbench files.
- Full TypeScript validation remains blocked by pre-existing invalid
  `src/note.ts` and `component for chatGPT/**/note.ts` source files; those files
  were not changed by this audit.
- A-01 requires a durable after-commit consumer-delivery design. Moving the
  current synchronous consumer fan-out into a Prisma transaction would extend
  locks and reintroduce timeout risk, so that shortcut was explicitly rejected.

### 2026-07-30 — Remediation pass 2

- Added shared operation projection-delivery polling.
- Payment completion/split and Shipment operational commands return delivery
  handles to the UI.
- Shipment actions now pass the Next after-commit scheduler to event dispatch.
- Flow List and Payment Board reconcile only after tracked deliveries succeed.
- Added Payment/Shipment stage counts to the common Flow Query response.
- Propagated authenticated actors through Payment, Shipment-payment and Watch
  Workbench events.
- Targeted ESLint passed for all pass-2 files.

### 2026-07-30 — Durable consumer outbox foundation

- Accepted architecture decision 28.
- Added `BusinessEventConsumerDelivery` schema and migration.
- Applied development migrations successfully.
- Added durable consumer worker and projection barrier release.
- Integrated consumer draining into projection maintenance.
- Prisma schema validation and targeted ESLint passed.
- A-01 remains open for producer-by-producer atomic transaction migration.

### 2026-07-30 — Atomic producer migration pass 1

- Payment create, split, complete and cancel now persist event/outbox rows in
  the Payment transaction.
- Shipment update, dispatch, delivered, returning, returned and manual-create
  now persist Shipment and related Payment event/outbox rows in the Shipment
  transaction.
- Order single/bulk post, cancel and verify now persist Order, Shipment and
  Payment event/outbox rows in the Order transaction.
- Compatibility entry points without `after()` process durable deliveries only
  after commit.
- Consumer outbox smoke passed:
  - duplicate enqueue produced one row;
  - terminal delivery was not claimed twice;
  - a transaction rollback left zero delivery rows.
  - coordination was claimed in pass 1 and the remaining consumer in pass 2.
- The smoke was repeated after the producer payload was reduced to delivery
  handles and passed against the development database.
- Prisma schema validation, targeted ESLint, the operation read-architecture
  audit and `git diff --check` passed. Full repository TypeScript validation
  remains outside this pass because of the pre-existing invalid note sources
  recorded above.

### 2026-07-30 — Atomic producer migration pass 2

- The canonical `recordBusinessEvent(prisma, ...)` boundary now writes the
  event log and both delivery outboxes in one short transaction.
- Watch content saves, Workbench pricing/title updates, publish-asset usage and
  Watch form content/spec/pricing changes now record their events in the same
  database transaction as their domain mutation.
- Technical movement/calibre updates, technical assessment saves and Technical
  Issue completion/payment creation now record their events in the owning
  transaction.
- Media attachment actions finalize queue metadata/activity/event atomically
  after canonical ingest, and reshoot metadata is seeded by the durable
  coordination consumer rather than by reading an after-commit binding during
  the request.
- Publish confirmation now passes the after-commit consumer scheduler through
  the common Media workflow processor.
- The outbox smoke passed again after the canonical event boundary change.
- Remaining Media review/save consolidation is intentionally not wrapped in a
  long transaction: current Review helpers still use the global Prisma client
  and canonical ingest performs NAS I/O. Holding a transaction around either
  path would exhaust the development pool and violate architecture decisions
  25 and 28. These helpers must first accept the caller's `DB`, while NAS work
  remains a journaled `MediaOperation` outside the database transaction.

### 2026-07-30 — Atomic producer migration pass 3

- Watch Review state, logs, rejection feedback, notifications, Watch state and
  event/outbox writes now share the caller's short transaction.
- Review HTTP entry points pass the Next `after()` scheduler; Media composite
  actions propagate the same scheduler while retaining their canonical
  composite event.
- Canonical Media ingest is split into an external, idempotent
  `MediaOperation` phase and a short database-finalize phase. Finalize writes
  Media bindings, ProductImage references, sale-stage truth and event outboxes
  atomically.
- Media release/attach helpers now accept the caller's `DB`; NAS operations
  are never run through a Prisma `TransactionClient`.
- Technical Issue create, confirm, start, update, complete, no-issue close and
  cancel commands now write state, task synchronization and event outboxes in
  the owning transaction.
- Quick Service intake now creates Service Request, assessment and event
  atomically. Initial/quick issue creation and Service Request status changes
  also share one transaction.
- Maintenance rejection now uses the transaction client for vendor lookup and
  records the corresponding Technical Issue task/event transition.
- Added
  `docs/operations/business-event-media-recovery-runbook.md` covering durable
  delivery diagnosis, safe retry, projection barriers, and the Media case
  where NAS succeeds before DB finalize.
- Targeted ESLint passed for the changed Event, Review, Media, Service and
  route boundaries.
- Prisma schema validation, durable consumer outbox smoke, operation
  read-architecture audit and `git diff --check` passed. Full repository
  TypeScript validation remains blocked first by the pre-existing invalid
  `src/note.ts` and `component for chatGPT/**` sources recorded in pass 1;
  the targeted compiler also reports existing cross-domain type debt outside
  this migration, retained as audit evidence rather than hidden or patched
  locally.
