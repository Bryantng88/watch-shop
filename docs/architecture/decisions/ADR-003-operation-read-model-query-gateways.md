# ADR-003: Operation Read Models And Query Gateways

Status: Accepted  
Date: 2026-07-27

## Context

The unified Operation Space renders Technical Issue, Media, Payment, and
Shipment flows. Historically one dashboard service and one HTTP endpoint were
used for page bootstrap, widgets, boards, flow lists, repair fallback, counts,
and pagination. That made request ownership unclear and allowed multiple
effects to start the same expensive graph concurrently.

This ADR defines one read architecture for every Operation flow. It extends the
global event and projection boundary in
`docs/architecture/15-event-driven-domain-boundary.md`; it does not create a
special architecture for any individual flow.

## Decision

Operation reads have four explicit boundaries.

### 1. Server Page Bootstrap

Owner:

- `src/app/(admin)/admin/coordination/operation/page.tsx`
- `getCoordinationDashboard`
- `mapCoordinationDashboardShell`

Responsibilities:

- authorize the viewer;
- resolve or ensure the active Coordination cycle;
- load the workspace shell needed by the initial screen;
- return an already-authorized dashboard snapshot;
- omit board and flow rows that have their own query gateway.

The page bootstrap must not load a board or flow page that the client will load
again.

The authorized page shell passes its cycle `taskId` to Board and Flow gateways.
The gateway validates the task/context scope and caches that validation for a
short period. Projection-native Technical and Media reads then bypass
`ensureCoordinationCycle()` and the workspace shell projection entirely.

### 2. Board Query Gateway

Canonical route:

```text
/api/admin/coordination/operation/boards/:boardKey
```

Canonical service:

```text
getCoordinationBoard()
```

Responsibilities:

- validate board key and authorization;
- read one board or one board column page;
- return aggregate column counts and page metadata;
- read the accepted projection for Technical Issue or Media.

It must not build the dashboard shell.

### 3. Flow Query Gateway

Canonical route:

```text
/api/admin/coordination/operation/flows/:flowKey
```

Canonical service:

```text
getCoordinationFlowPage()
```

Request contract:

```text
context
taskId
date
flowStage
flowPage
flowPageSize
flowQuery
flowStatus
flowPaymentStatus
flowSort
doneRange
```

Response contract:

```ts
{
  flowKey: string;
  flowItems: CoordinationFlowListItemDTO[];
  flowItemsPagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

The query order is:

```text
authorize
-> validate taskId belongs to the requested Coordination Space
-> resolve active flow and stage
-> filter/search
-> stable sort
-> count
-> paginate
-> hydrate only the visible page
```

The legacy `/dashboard?includeFlowItems=1` route is a rolling-deploy adapter
only. It must delegate to `getCoordinationFlowPage()` and must not contain a
second flow implementation.

### 4. Projection Repair And Observability

Projection rows are updated by the durable Business Event projection consumer.
Repair is an explicit operational action through projection jobs, scripts, or
the projection administration surface.

`ensureProjectionReady()` may bootstrap a projection only when the projection
has no rows in a new environment. A populated projection must never be deleted
or rebuilt from a user read request.

Reason: current rebuilders write rows in batches. Deleting a populated
projection before a request-path rebuild exposes empty or partial lists to
concurrent readers and causes visible item flicker.

Drift detection belongs to observability. Drift repair belongs to a worker or
operator action. Neither belongs to a list/board request.

## Source-Of-Truth Matrix

| Flow | Business truth for stage | Read model |
|---|---|---|
| Technical Issue | `TechnicalIssue.executionStatus`, confirmation and completion facts | `technical-issue-board` |
| Media | Watch media workflow state and active BusinessBinding | `media-operation-board` |
| Payment | `Payment.status`; bindings are compatibility/activity context only | Payment page query plus `payment-list`, `order-list`, `acquisition-list`, and `technical-issue-board` previews |
| Shipment | `Shipment.status` | `shipment-operation-queue` |

Payment is an intentional hybrid. It must not derive stage from
`TaskExecution.taskItemId`. If Payment becomes a fully materialized Operation
queue later, it must be introduced as a registered projection builder and
replace the hybrid behind the same Flow Query Gateway contract.

## Client Request Ownership

`OperationCoordinationWorkspace` is the sole owner of interactive Operation
flow queries.

Rules:

- one mode/stage/page/filter state produces one request URL;
- an identical in-flight URL is deduplicated;
- changing to a different request aborts the old browser request;
- response sequence/id checks prevent an old response from replacing new
  state;
- server shell data never overwrites an asynchronously loaded flow slice;
- changing a view does not refetch the generic dashboard merely because the
  endpoint string changed;
- changing a flow mode updates native history and client query state; it must
  not use App Router navigation to rerun Server Page Bootstrap;
- board column pagination and flow table pagination remain separate.

React effects may observe state, but only one effect may own automatic flow
loading. Event handlers update state/URL; they must not also start the same
request.

## Stable Identity And Pagination

Every projection row and DTO must expose a stable business identity.

- Board merge key: projection/business item ID.
- Flow page row key: stable binding ID when the binding is the collaboration
  identity, otherwise a deterministic `targetType:targetId` key.
- A page must not contain duplicate IDs.
- Sort must have a deterministic identity tie-breaker when the underlying query
  can return equal timestamps.
- Count and rows must use the same stage and filter predicates.

Offset pagination is accepted for the current bounded lists. A high-write,
unbounded flow must move behind the same gateway to cursor pagination rather
than inventing a new endpoint shape.

## Performance Contract

Warm-path development targets, excluding Next.js compilation:

- projection readiness check: one indexed existence/count read, normally
  cached;
- cycle scope validation: one indexed read on first use, then a short-lived
  in-process cache hit;
- board projection query: target <= 1 second;
- normal flow stage page: target <= 1.5 seconds;
- Payment hybrid stage page: target <= 2 seconds until a dedicated
  materialized queue is justified;
- one interactive action must create at most one board or flow data request.

Performance logs must distinguish:

```text
page bootstrap
board query
flow query
projection readiness
projection rebuild/repair
```

Compile time and media signing time must not be attributed to projection query
time.

## Event And Projection Coverage

For every operation-visible milestone:

1. The owning domain writes business truth.
2. The domain emits a catalogued Business Event.
3. The projection builder or Operational Blueprint subscription declares the
   event.
4. Event target resolution maps aliases such as activity/reply IDs back to the
   business or TaskItem identity.
5. The projection delivery is durable and idempotent.
6. A read-only compare smoke verifies source/projection counts and stage
   membership.

Comments use `targetTaskItemId` or `taskItemId` from event metadata. The
activity/reply ID is not a TaskItem projection key.

## Forbidden Patterns

- Rebuilding a populated projection inside a GET request.
- Deleting projection rows before a request-path batch rebuild.
- Fetching `/dashboard` and a flow gateway for the same view transition.
- Using `router.push`, `router.replace`, or `router.refresh` for a read-only
  Operation mode/stage/page change.
- Starting the same flow request from both an event handler and an effect.
- Letting a dashboard shell's empty `flowItems` replace a loaded client slice.
- Deriving Payment stage from binding location.
- Filtering after pagination.
- Adding a per-flow endpoint that bypasses the Flow Query Gateway contract.
- Hydrating all activity or business details before pagination.

## Compatibility And Migration

Compatibility adapters may remain during rolling deployment, but they must:

- delegate to the canonical gateway service;
- have no independent query or mapping logic;
- be marked as compatibility code;
- be removable without changing the client DTO.

The current dashboard route remains the compatibility and widget endpoint.
New Operation flow code must use `/flows/:flowKey`; new board code must use
`/boards/:boardKey`.

## Verification

Run:

```text
npm run coordination:audit-read-architecture
npm run coordination:smoke-operation-flows
npm run projection:smoke-runtime
```

The flow smoke must report:

- every configured stage;
- loaded and total counts;
- zero duplicate IDs;
- zero wrong-stage items;
- query duration.

## Consequences

Positive:

- query ownership is explicit;
- projection repair cannot make lists disappear during reads;
- all flows share authorization, pagination, filtering, request dedupe, and
  observability rules;
- a future Payment queue projection can replace the hybrid without changing
  the UI contract.

Trade-offs:

- the existing dashboard service remains a composition implementation behind
  the new Flow Gateway until its internal loaders are split into smaller query
  services;
- explicit repair jobs must be monitored because populated projections are no
  longer silently repaired by user traffic;
- source/projection comparison becomes a required operational check.
