# Watch Detail Read Projection

## Decision

Watch Detail uses a server-composed read projection. It does not use a
materialized Prisma projection table in this phase.

`WatchDetailProjection` composes:

- the existing Watch edit/detail DTO;
- `WatchServiceProjection`;
- trade history.

## Service projection

`WatchServiceProjection` reads Service Requests for one product and composes:

- request status and vendor;
- Technical Issue summaries, confirmation, and execution statuses;
- real total and active issue counts;
- the latest non-cancelled Service Request task execution binding;
- the TaskItem workspace target when available.

The Watch Service card consumes this typed projection. It must not query Prisma,
use untyped history records, or display hard-coded issue counts.

## Write/read boundary

Creating the initial Service Request and Technical Issue remains a Service
domain command. The command returns created identifiers and workspace target;
it does not mutate the Watch detail DTO directly.

When the command remains on Watch Detail, the route refreshes and recomposes the
projection. When it navigates to a workspace, returning to Watch Detail loads a
fresh projection.

## Deferred work

A materialized Watch detail projection is deferred until list/dashboard queries
need cross-domain aggregates at scale or measured detail composition latency
requires it. No Prisma schema or projection consumer is added here.
