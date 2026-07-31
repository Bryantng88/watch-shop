# Operation Architecture Audit — Handoff

Updated: 2026-07-30  
Purpose: continue the production-readiness audit from another machine without
reconstructing the previous work.

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

Last successful checks:

```powershell
cmd /c npm run event:smoke-consumer-outbox
cmd /c npm run coordination:audit-read-architecture
cmd /c npx prisma validate
```

Targeted ESLint and `git diff --check` also passed.

Full `tsc --noEmit` is not a clean gate yet because the repository already
contains invalid TypeScript text files under `src/note.ts` and
`component for chatGPT/**`. A targeted run also exposes older cross-domain
type debt. Do not hide those errors with local casts solely to make this audit
green; record and remediate them separately.

## Audit work still required

### P0 — Runtime producer/outbox reconciliation

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

### P0 — Delivery-aware progress on every action

Related finding: A-02.

Technical actions are the known remaining gap. Audit every list, board, modal
and bulk action. Each must return the common projection delivery handle and:

- show accepted/processing/reconciling states;
- wait for delivery success before reporting final completion;
- run the common reconcile/refresh path;
- prevent duplicate submission for the active operation;
- provide bounded cancel/close UX where appropriate.

No timer or command response alone may be treated as projection completion.

### P0 — Actor and last-action propagation

Related finding: A-07.

Re-run the event audit for Payment, Shipment, Order, Watch, Acquisition,
Service and Technical. Authenticated actions must store the current user;
System is allowed only for jobs, migrations, backfills and explicit
system-created operations. Verify list and board show the same actor after
refresh and reload.

### P1 — Payment Operation canonical read

Related finding: A-05.

Payment Operation still uses a hybrid `Payment.findMany` read plus runtime
joins. Migrate pagination, filtering, sorting and stage counts to
`payment-list`; hydrate activity/binding only for the current page.

### P1 — Workspace runtime ownership

Related finding: A-06.

Audit remaining direct writes to `TaskExecution`, Workspace metadata, task
bindings/activity and workflow stage state. Known areas are Watch Media
compatibility writes, Order-from-task, Service-from-task and reshoot/recall.
Business commands should emit intent; the Task/Workflow boundary should own
Workspace mutation.

### P1 — Projection runtime verification

Related findings: A-03 and A-04.

Verify Watch title/pricing updates through delivery, confirm missing Order
Detail/Payment summary GETs perform no write, and repair missing rows only via
maintenance/backfill.

### P1 — Coordination summary coverage

Related finding: A-09.

Baseline: 324 non-cancelled TaskItems versus 320
`coordination-workspace-summary` rows.

Identify the exact four missing IDs, classify legitimate exclusions versus
drift, repair only through projection maintenance/backfill, and add coverage
assertion to the production gate.

### P2 — Payment implementation consolidation

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

## Suggested continuation order

1. Confirm migration and clean worktree scope.
2. Run the checkpoint commands above.
3. Complete A-01 runtime matrix.
4. Complete A-02 Technical/common progress.
5. Re-audit A-07 actor/last action.
6. Fix A-09 coverage.
7. Migrate A-05 Payment read.
8. Resolve A-06 ownership leaks.
9. Sweep counts/refresh and Media reads.
10. Discuss, then consolidate A-10.
11. Run the production gate and append a dated result.

## Production gate

Do not approve production until no critical finding is open, no relevant
delivery is pending/stale/failed/dead, every operation uses delivery-aware
progress, actor and last action are correct, source/projection coverage passes,
list/board/counts/reload reconcile, and Media recovery passes without manual
path rewriting.
