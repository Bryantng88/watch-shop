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
-> completion-barrier consumer updates workflow/coordination truth
-> durable projection delivery is released
-> affected projection slice is rebuilt
-> client reconciles rows, board columns, counters, and last action
```

UI code must not infer a business state from a button label, patch a counter,
move a row permanently, or call a projection builder directly.

## Post-Mutation Consistency Rule

After a state-changing action succeeds:

1. Disable the affected control and show application-level progress.
2. Keep optimistic UI changes temporary and reversible.
3. Track the durable delivery for the affected read model.
4. Do not report completion until every projection required by the current
   surface reaches `SUCCEEDED`.
5. Re-fetch the affected projection slice once.
6. Replace the optimistic state with projection data.
7. Clear selected rows that are no longer eligible for the current stage.

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
  at: string;
};
```

Rules:

- derive it from the latest catalogued business event for the entity;
- use the shared event-label registry used by Activity/Dashboard surfaces;
- include business context such as return/reshoot note when present;
- batch-load events and actors for the projection page;
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

