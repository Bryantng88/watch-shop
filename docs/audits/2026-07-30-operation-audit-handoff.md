# Operation Architecture Audit — Handoff

Updated: 2026-07-31
Purpose: continue the production-readiness audit from another machine without
reconstructing the previous work.

Status: **temporarily closed on 2026-07-31**. Do not restart the broad audit.
Only reopen a failed runtime family or a failed production gate listed below.

Read first:

1. `docs/audits/2026-07-30-operation-domain-architecture-audit.md`
2. `docs/architecture/28-durable-business-event-consumer-outbox.md`
3. `docs/operations/business-event-media-recovery-runbook.md`

## Current checkpoint

Implemented and statically verified:

- durable consumer outbox and projection barriers;
- atomic Order, Payment, Shipment, Watch Review, Watch save, Media finalize,
  Technical Issue and quick Service producer boundaries;
- shared delivery waiter for migrated Payment, Shipment and Media actions;
- no NAS operation inside a Prisma transaction;
- removed direct Watch Workbench/Payment command projection rebuilds;
- removed Order Detail/Payment owner-summary GET-time rebuilds.
- Payment Operation canonical read is fully projection-backed;
- Workspace binding writes in Watch Media, Order-from-task and
  Service-from-task use the Task-owned BusinessBinding boundary;
- final List/Board/count/actor/Media sweep passed.

Closure exceptions:

- Watch has a post-migration runtime PASS.
- Payment, Shipment, Order, Technical Issue and Service Request still need one
  fresh authenticated sample each; the matrix reports
  `NO_POST_MIGRATION_SAMPLE`.
- Watch duplicate quarantine/restore/delete remains an explicit authenticated
  maintenance exception for direct binding mutation.

Last successful checks:

```powershell
cmd /c npm run event:smoke-consumer-outbox
cmd /c npm run coordination:audit-read-architecture
cmd /c npm run coordination:smoke-operation-flows
cmd /c npm run operation:audit-runtime-matrix
cmd /c npx prisma validate
```

Targeted ESLint and `git diff --check` also passed.

Full `tsc --noEmit` is not a clean gate yet because the repository already
contains invalid TypeScript text files under `src/note.ts` and
`component for chatGPT/**`. A targeted run also exposes older cross-domain
type debt. Do not hide those errors with local casts solely to make this audit
green; record and remediate them separately.

## Historical findings and reopen conditions

### P0 — Runtime producer/outbox reconciliation

Status: temporarily closed with the five explicit sample exceptions below.

Related finding: A-01.

Code migration is substantially complete, but production approval still needs
runtime evidence for every operation-visible command family:

- Payment create/split/complete/cancel;
- Shipment create/dispatch/delivered/returning/returned;
- Order post/cancel/verify;
- Watch content/spec/pricing/review;
- Media attach/intake/reshoot/approve/recall/publish;
- Technical Issue create/confirm/start/update/complete/cancel/no-issue;
- quick Service Request and initial issue.

For each command verify business truth and event commit together, deliveries
are created once, barriers finish before projection, retry is idempotent, and
list/board/counts reconcile. Append the runtime matrix and operation keys to
the main audit before closing A-01.

Checkpoint 2026-07-31: the read-only runtime matrix exists and passes, but all
six audited families currently report `NO_POST_MIGRATION_SAMPLE`. Exercise a
representative authenticated command per family, rerun
`operation:audit-runtime-matrix`, and attach the resulting operation keys
before closing this item.

### P0 — Delivery-aware progress on every action

Status: closed for common operation actions 2026-07-31.

Related finding: A-02.

Technical actions are the known remaining gap. Audit every list, board, modal
and bulk action. Each must return the common projection delivery handle and:

- show accepted/processing/reconciling states;
- wait for delivery success before reporting final completion;
- run the common reconcile/refresh path;
- prevent duplicate submission for the active operation;
- provide bounded cancel/close UX where appropriate.

No timer or command response alone may be treated as projection completion.

Checkpoint 2026-07-31: Technical single, bulk and board transitions now use
the common projection-delivery waiter. Payment review/exception/follow-up also
return delivery handles. The remaining work is runtime UX verification of
accepted/processing/reconciling/cancel behavior, not another per-flow waiter.

### P0 — Actor and last-action propagation

Status: closed by canonical-event actor reconciliation and flow smoke; fresh
domain samples remain part of the runtime exception, not a separate code task.

Related finding: A-07.

Re-run the event audit for Payment, Shipment, Order, Watch, Acquisition,
Service and Technical. Authenticated actions must store the current user;
System is allowed only for jobs, migrations, backfills and explicit
system-created operations. Verify list and board show the same actor after
refresh and reload.

Checkpoint 2026-07-31: authenticated common operation actions now fail closed
when actor identity is absent. List/Board uses the latest BusinessEvent as the
canonical last-action signal, Technical Board follows the same rule, and the
operation-flow smoke reports zero actor mismatches across Payment, Shipment,
Technical and Media. Service Request post/complete/vendor commands now emit
actor-bearing events atomically. A fresh authenticated runtime sample is still
required for final production evidence.

### P1 — Payment Operation canonical read

Status: closed 2026-07-31.

Related finding: A-05.

Payment Operation still uses a hybrid `Payment.findMany` read plus runtime
joins. Migrate pagination, filtering, sorting and stage counts to
`payment-list`; hydrate activity/binding only for the current page.

### P1 — Workspace runtime ownership

Status: closed for normal operation flows 2026-07-31. Watch duplicate
quarantine/restore/delete is the documented maintenance exception.

Related finding: A-06.

Audit remaining direct writes to `TaskExecution`, Workspace metadata, task
bindings/activity and workflow stage state. Known areas are Watch Media
compatibility writes, Order-from-task, Service-from-task and reshoot/recall.
Business commands should emit intent; the Task/Workflow boundary should own
Workspace mutation.

### P1 — Projection runtime verification

Status: closed 2026-07-31 by projection runtime and domain projection smokes.

Related findings: A-03 and A-04.

Verify Watch title/pricing updates through delivery, confirm missing Order
Detail/Payment summary GETs perform no write, and repair missing rows only via
maintenance/backfill.

### P1 — Coordination summary coverage

Status: closed 2026-07-31 at 324/324.

Related finding: A-09.

Baseline: 324 non-cancelled TaskItems versus 320
`coordination-workspace-summary` rows.

Checkpoint 2026-07-31: projection maintenance identified and repaired the four
missing rows; coverage is 324/324. Keep the coverage assertion in the
production run instead of assuming this one-time repair prevents recurrence.

Identify the exact four missing IDs, classify legitimate exclusions versus
drift, repair only through projection maintenance/backfill, and add coverage
assertion to the production gate.

### P2 — Payment implementation consolidation

Status: deferred, non-blocking. Reopen only if import mapping finds a live
route entering a retired implementation.

Related finding: A-10.

Potential implementations remain in:

- `src/domains/payment/server`
- `src/domains/payment/payment/server`
- `src/app/(admin)/admin/payments/_server`
- legacy files such as `payment.service copy.ts`

Map all imports, designate the canonical boundary, convert live legacy imports
to compatibility re-exports, prove routes no longer import retired code, then
delete dead code. This changes architectural ownership: if docs do not resolve
the canonical boundary, confirm it with the owner before editing.

### P2 — Count, refresh and Media read sweep

Status: closed 2026-07-31 by flow, board, read-architecture and Media gates.

Related finding: A-08 and the original UX incidents.

Across every flow and List/Board mode verify:

- moved item disappears or is marked pending immediately;
- common refresh equals full page reload;
- header total, stage counts and footer count agree;
- filters/pagination use the same projection version;
- no stale in-flight request overwrites a newer result.

Also verify canonical Media resolution on Watch, Coordination, Service,
Technical, Order and other thumbnail surfaces, including both audience
segments. Never bulk-move legacy files without an atomic reference-update
plan.

## Reopen order

1. Run the checkpoint commands above.
2. If a gate fails, reopen only the related finding.
3. Capture fresh authenticated samples for the five runtime families still
   marked `NO_POST_MIGRATION_SAMPLE`.
4. Reopen Payment consolidation only when a live retired import is proven.

## Production gate

Do not approve production until no critical finding is open, no relevant
delivery is pending/stale/failed/dead, every operation uses delivery-aware
progress, actor and last action are correct, source/projection coverage passes,
list/board/counts/reload reconcile, and Media recovery passes without manual
path rewriting.

## 2026-07-31 handoff addendum

The durable consumer adapter regression is fixed at the shared boundary.
Timeline and Notification had received an incomplete reconstructed
`eventLog`, producing `unknown` and `INVALID_EVENT_LOG`. The regression smoke
now asserts the canonical envelope, and the runtime matrix rejects
contract-invalid terminal skips.

Before production, inventory and selectively replay historical affected
Timeline/Notification deliveries using their original operation keys. Do not
create replacement business events or repair projections directly.
