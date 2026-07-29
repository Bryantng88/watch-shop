# List And Board Projection Consistency Production Gate

## Purpose

Every operational list and board must reflect a completed business action
without requiring a full page reload and without making the write path wait for
all downstream read models.

This rule applies globally to:

- Watch, Order, Service, Acquisition, Payment, Shipment, and future domains;
- list and board modes of the same operational flow;
- stage tabs, visible rows, totals, counters, filters, recent activity, and
  last-action summaries;
- row, modal, bulk, drag/drop, Blueprint, and API entry points for the same
  command.

The Watch Media flow is a reference implementation, not a special-case
architecture.

## Source Of Truth And Read Contract

Business-domain state remains the source of truth. Lists and boards read from a
rebuildable projection.

```text
Business command
-> business truth + catalogued event committed
-> command returns a committed outcome
-> client reconciles the visible slice immediately from that outcome
-> durable projection delivery converges in the background
-> a scoped read confirms/replaces the temporary client state
```

UI code must not infer a business state from a button label or call a projection
builder directly. It may temporarily patch rows and counters only from an
explicit committed outcome returned by the command.

For chained transitions, reconciliation must use the final command outcome,
not the transition originally rendered by the UI. For example, Photography may
accept `IN_PROGRESS` and immediately advance to `DONE`; batch results therefore
return the final `toState` for each item. Successful `DONE` items are removed
from the current stage immediately and remain hidden until the authoritative
projection no longer contains them. A partial batch must preserve and display
the failed item's label plus its server-provided reason.

Action feedback is scoped to the stage where the command ran. Because the list
component can remain mounted while stage data changes, navigating to another
stage must clear the previous stage's transient error.

## Post-Mutation Consistency Rule

After a state-changing action succeeds:

1. Disable the affected control and show application-level progress.
2. Commit business truth and its event/outbox atomically.
3. Return an explicit outcome containing affected IDs and final states.
4. Reconcile visible rows, membership, counters, pagination, and selection from
   that committed outcome immediately.
5. Do not wait for asynchronous projection consumers on the interaction path.
6. Confirm once through a scoped read. When the projection can still be stale,
   use an explicit source-consistency read instead of repeatedly refreshing.
7. Replace temporary client state with the confirmed slice and allow the
   durable projection delivery to converge in the background.

The reconciled surface must update together:

- the item leaves its old stage when no longer eligible;
- the item appears in its destination stage;
- list and board modes agree;
- stage counters, total count, pagination, and filter result count agree;
- latest status and last action agree with Activity;
- bulk selection and available actions are recalculated.

A user must never need to repeat the business action just to update the screen.

## Refresh Contract

Every operational list and board provides one consistent Refresh action.

Refresh:

- invalidates the current projection query, not only the visible row array;
- reloads rows, board data, counters, totals, pagination metadata, and
  last-action data from the same projection generation;
- preserves search, filters, sort, period, stage, page size, and view mode;
- coalesces concurrent refresh requests;
- prevents an older response from replacing a newer response;
- displays progress and an actionable failure message;
- never replays or submits a business command.

`router.refresh()` is not a post-mutation list reconciliation mechanism. It may
be used for structural page changes outside the list contract, but must not be
the only success callback for a row, modal, bulk, or drag/drop command.

Operational mutations use **committed reconciliation**:

- the server returns the final transition outcome after commit;
- the client applies that outcome without guessing;
- the confirmation request targets the list/board endpoint, never the whole
  page;
- projection-backed endpoints expose an explicit source-consistency option
  when immediate confirmation cannot wait for outbox delivery;
- older confirmation responses cannot replace newer outcomes.

The shared Coordination flow list and Watch list are guarded by
`npm run check:list-reconciliation-contract`. Adding a whole-page
`router.refresh()` to either mutation surface fails the architecture check.

A full browser reload must not produce a different business result from the
Refresh action. If it does, the Refresh implementation or projection
subscription is incomplete.

## Status Mapping Rule

Display status is derived centrally from current domain/workflow truth.

- Gallery/image existence is independent from Media workflow membership.
- A watch with gallery images but no Media binding is `not in Media`.
- A watch sent directly to Media processing is `Media processing`.
- A watch returned for reshoot is `Photography` / `needs reshoot`, not `not in
  Media`.
- Completed/cancelled historical bindings must not override the newest active
  binding.
- List, board, detail, filters, and counters use the same status mapper and
  vocabulary.

Do not introduce component-local fallback mappings when the projection contract
already owns the state.

## Last Action Contract

Operational lists should expose a compact `lastAction` projection when tracking
is useful:

```ts
type LastAction = {
  eventKey: string;
  label: string;
  note: string | null;
  actorUserId: string | null;
  actorLabel: string | null;
  actorAvatarUrl: string | null;
  at: string;
};
```

Rules:

- derive it from the latest catalogued business event for the entity;
- use the shared event-label registry used by Activity/Dashboard surfaces;
- include business context such as return/reshoot note when present;
- batch-load events and actors for the projection page;
- batch-load the actor avatar with the actor label; UI uses initials or a
  system badge when no avatar exists;
- never query Activity or User once per row;
- treat the value as audit/read context, not business truth.

## Performance Budget And Query Shape

Small list features must not grow the hot query path without a budget.

Required rules:

- no N+1 queries;
- use narrow selects and page-scoped batch queries;
- fetch independent projection inputs in parallel;
- use bounded concurrency for database-heavy projection builders;
- rebuild only affected entity rows after normal commands;
- reserve full rebuilds for deployment, repair, migration, or explicit
  operational tools;
- keep modal/detail hydration out of list queries;
- do not block a save/review request on unrelated Timeline, Notification, or
  dashboard work;
- the progress UI must distinguish command acceptance from projection
  completion.

Production targets should be measured in the deployed environment. At minimum,
record p50/p95 for:

- command commit time;
- completion-barrier duration;
- projection delivery duration;
- list refresh duration;
- first modal shell render and deferred detail hydration.

A timeout must identify the consumer or projection that exceeded its budget.
Increasing a global timeout is not a valid fix for an unbounded query or
fan-out.

### Database pool budget

The query concurrency budget and Prisma connection pool must be designed
together. `Promise.all` does not create database concurrency when Prisma has a
single connection; it only creates an in-process wait queue that makes unrelated
requests inflate each other's measured query time.

Rules:

- local/development admin workloads use a bounded pool large enough for the
  measured concurrent read surfaces; the current dev baseline is
  `connection_limit=5`;
- `pool_timeout=0` is forbidden for development diagnostics because an
  exhausted pool can wait indefinitely and hide the contention source;
- changing `DATABASE_URL` pool parameters requires restarting the application
  process because an existing PrismaClient keeps its original engine pool;
- projection builders retain their own bounded fan-out even when the pool is
  larger;
- serverless production pool sizing must include maximum instance count and the
  provider connection budget. Do not copy the development limit blindly;
- performance logs distinguish source-query time from request total, but a
  query timer may still include Prisma pool wait time. Correlated slowdowns
  across unrelated domains are treated as pool contention until disproven.

## Failure And Repair

When downstream projection work fails:

- the committed business action is not submitted again;
- the progress UI shows which item failed or timed out;
- pending bulk items may be cancelled, but committed items are not rolled back
  by closing the dialog;
- durable delivery remains retryable and idempotent;
- repair rebuilds projection data only;
- repair must not repeat workflow transitions, notifications, or business
  writes.

## Delivery Liveness Gate

Implemented 2026-07-28:

- the preferred command path passes `deferConsumers` from the application
  entry point and claims the exact durable delivery after commit;
- an older producer that omits the scheduler uses a synchronous compatibility
  claim, so correctness does not depend only on the recurring worker;
- catalog event keys and projection subscriptions share one canonical
  normalization rule;
- an event declaring the `projection` consumer must resolve at least one
  builder, otherwise delivery fails with `PROJECTION_BUILDER_REQUIRED`;
- automated coverage tests prevent adding a catalogued projection event with
  no matching builder.

Production acceptance now also requires:

| Check | Required result |
| --- | --- |
| Immediate runner | A normal mutation increments delivery attempts without waiting for cron |
| Worker fallback | A released delivery survives process loss and is later claimed |
| Backlog liveness | No `PENDING` delivery with `attempts = 0` exceeds the agreed SLA |
| Catalog coverage | Every event declaring `projection` matches a registered builder |
| Domain coverage | Source and list/detail projection entity counts have zero missing rows |

The synchronous compatibility path may add latency and must be removed from a
domain only after every entry point for that domain forwards the after-commit
scheduler. Removing it globally before that migration is complete reopens the
silent missing-row failure.

### Cross-domain hardening completed 2026-07-28

The production gate was extended after auditing Watch, Order, Payment,
Shipment, Service, Technical Issue, Coordination, Media, and Dashboard:

- projection coverage is bidirectional: every catalog event declaring the
  `projection` consumer must resolve a builder, and every builder source event
  must be catalogued and allow the `projection` consumer;
- `watch.sold`, `task.item.created`, `task.item.moved`, and
  `service.request.completed` now explicitly allow their registered projection
  subscriptions;
- projection release checks every state-writing completion barrier declared by
  the event contract. Coordination and Workflow are barriers when they are
  listed for that event; Timeline and Notification remain isolated side
  effects;
- the durable delivery worker uses real bounded concurrency. Concurrency is
  limited both across deliveries and inside one event's builder fan-out; a
  process-global serialization tail must not silently turn the configured
  worker concurrency into one;
- runtime maintenance reports status counts plus stale `BLOCKED`, unattempted
  `PENDING`, stale `PROCESSING`, retryable `FAILED`, and `DEAD` deliveries.
  Runtime smoke fails the liveness gate when any of those unhealthy classes is
  present;
- unsupported projection comparisons return an explicit non-healthy/skipped
  result. They must not be reported as a successful comparison;
- required singleton projections, currently `admin-dashboard-summary`, are
  included in recurring drift detection and repair.

### Atomic singleton projection rule

A singleton or aggregate snapshot must remain readable until its replacement is
fully built:

```text
read source with the command's DB client
-> build complete snapshot in memory
-> atomic upsert of the singleton row
```

An event builder must not delete the current singleton and wait for a later GET
request to recreate it. The Admin Dashboard follows this rule:

- event delivery rebuilds and atomically upserts the `global` row;
- the dashboard GET reads the projection;
- `ensureProjectionReady()` may bootstrap an entirely absent projection in a
  new environment, as allowed by ADR-003;
- a populated projection is never rebuilt or deleted by the GET path.

Verification:

```text
npx tsx --test src/domains/projection/server/projection-event-coverage.test.ts
npm run projection:smoke-runtime
npm run projection:smoke-admin-core
npm run coordination:audit-read-architecture
```

## Flow List Reconciliation Closure

Implemented 2026-07-28 after auditing the shared Coordination flow list across
Payment, Media, Technical, Shipment, and generic Blueprint flows.

The shared list follows these additional invariants:

- refreshed server `flowItems` and pagination replace the client copy;
- a dashboard shell loaded with `includeFlowItems: false` is not an
  authoritative empty flow result and must never replace a list loaded from the
  dedicated flow endpoint;
- optimistic hidden IDs live only until authoritative items arrive;
- selection is intersected with authoritative item IDs after reload;
- counters use an explicit destination stage when the command supplies one;
- when the destination is unknown, only the source count changes
  optimistically;
- Payment reconciliation explicitly targets `payment-settled` for single and
  bulk actions;
- pagination applies to the merged flow result, never independently to each
  Workspace before flattening.
- stage counts have three distinct states: known zero, known positive, and
  unknown/loading; the UI must not render unknown as `0`;
- the active page total is tagged with the stage that produced it and must not
  be reassigned to a newly selected stage while that stage is loading;
- specialized flow endpoints return lightweight counts for all stages from the
  same projection query used to load the active stage page.

The generic Workspace-backed reader merges and sorts eligible Workspace items
before applying one flow-level page window. This is the correctness fallback
for low-volume custom Blueprint flows. A flow that can exceed a bounded
in-memory merge must add a dedicated projection/query gateway, as Media,
Technical, Shipment, and Payment do; it must not restore per-Workspace
pagination.

Server/client payloads must carry an explicit authority signal when a route
intentionally omits a heavy list. An empty included list means “authoritatively
empty”; an omitted list means “unchanged, fetch from its dedicated endpoint”.
Do not infer those two states from `items.length`.

Regression scenarios for every flow:

1. forward transition;
2. reverse transition;
3. transition that skips a stage;
4. transition to exception/follow-up;
5. refresh while staying on the same stage;
6. destination navigation when the binding ID is retained;
7. multiple Workspaces contributing to page 1 and page 2;
8. bulk action with partial failures.

## Production Acceptance Matrix

Before a list/board flow is production-ready, test every state-changing action
from every supported entry point:

| Check | Required result |
| --- | --- |
| Row action | Row reconciles without full page reload |
| Modal action then close | Source row changes or leaves immediately after delivery |
| Bulk action | Per-item progress, cancel remaining work, partial failure visible |
| Drag/drop | Same command/event/projection contract as other entry points |
| List vs board | Same membership and status |
| Counters | Stage, total, and footer counts agree with rows |
| Refresh | Same result as full page reload |
| Filters/pagination | No stale row remains eligible after transition |
| Activity/last action | Event, actor, time, and context agree |
| Retry/idempotency | Repeated delivery does not duplicate side effects |
| Performance | No N+1; p50/p95 recorded and within agreed budget |
| Repair | Projection rebuild restores UI without business side effects |

Any failed row in this matrix blocks production sign-off for that flow.

## Implementation Review Checklist

1. Which business command owns the mutation?
2. Which catalogued event represents completion?
3. Which consumer is the completion barrier?
4. Which projection slices must succeed before UI completion?
5. Does the event update list, board, counters, filters, and last action?
6. Does Refresh reload all of those from one projection generation?
7. Are list inputs batch-loaded with bounded query count?
8. Can stale responses overwrite newer state?
9. Can the delivery be retried without repeating the command?
10. Does a full page reload match the in-app Refresh result?
11. Are list, modal, bulk, drag/drop, and API entry points covered?
12. Are latency and query-count measurements recorded?

If any answer is unclear, the flow is not ready for production.

## Order note and late-shipment list contract

The Order list projection includes `notes` as display and search data. The list
must not join back to the Order write model to render this column. Changes to
the projection row shape require an `ORDER_LIST_PROJECTION_VERSION` increment
so existing rows are rebuilt before the new field is relied on.

An Order originally created with `hasShipment = false` may later require
delivery. This is an explicit Shipment command, not a list-only flag change:

1. the user opens the shared Shipment form from the Order row;
2. `createManualShipment` creates the active Shipment;
3. the same transaction changes `Order.hasShipment` to `true` and moves the
   Order into `PROCESSING`;
4. `shipment.created` refreshes Order list/detail projections.

The list action is labelled `Tạo shipment` when there is no delivery yet and
`Quản lý giao hàng` when Shipment management already applies. The modal reuses
the shared form fields and feedback/progress surfaces used by Shipment
management; it does not introduce a second form vocabulary.

Recipient data for a late-created Shipment follows one server-owned fallback
order: explicit form input, then the Order shipping snapshot, then the linked
Customer profile. `shipPhone`, `shipAddress`, and `shipCity` are required
invariants. When they are still missing, the modal names the missing fields and
the Shipment command rejects the request as well; validation is not owned only
by the client.
