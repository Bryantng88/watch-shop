# SM Sprint 56 - Projection Observability & Repair

## Status

Implemented.

## Intent

Sprint 56 adds a small internal operations layer for projections.

The goal is not a dashboard. The goal is to make projection rollout safer:

- see which projections are registered;
- see row counts, status counts, versions, and projected timestamps;
- compare supported projections with their source query;
- rebuild/repair a projection by a small scope;
- keep repair idempotent and limited to read model records.

## Architecture Rule

Projection repair only rebuilds projection read models.

It must not:

- replay notification side effects;
- apply workspace workflow transitions;
- mutate Watch, Order, Service, or other business truth;
- become a manual event replay system.

Business truth remains in the owning domain. Projection remains rebuildable read
data.

## Implemented Code

- `src/domains/projection/server/projection-observability.types.ts`
- `src/domains/projection/server/projection-observability.service.ts`
- `src/app/api/admin/system/projections/route.ts`
- `src/domains/projection/server/projection-record.repo.ts`
- `src/domains/projection/server/projection.types.ts`
- `src/domains/projection/server/index.ts`

## Internal API

Permission:

- `SYSTEM_JOB_VIEW`

Read status:

```text
GET /api/admin/system/projections
GET /api/admin/system/projections?projectionKey=watch-list
GET /api/admin/system/projections?projectionKey=watch-media-queue&workspaceId=<taskItemId>
```

Run compare:

```json
{
  "action": "compare",
  "projectionKey": "watch-list",
  "scope": {
    "limit": 20,
    "filters": {
      "view": "all",
      "meta": "lite"
    }
  }
}
```

Run repair/rebuild:

```json
{
  "action": "repair",
  "projectionKey": "watch-media-queue",
  "scope": {
    "workspaceId": "<taskItemId>"
  },
  "compare": true
}
```

## Supported Projections

### `watch-media-queue`

Status is read from `ProjectionRecord`.

Compare requires:

- `scope.workspaceId`

Repair can run by:

- `scope.workspaceId`;
- `scope.targetType` + `scope.targetId`;
- all media workspaces if no scope is supplied.

### `watch-list`

Status is read from `ProjectionRecord`.

Compare supports:

- `scope.limit`;
- `scope.filters` using the same shape as `WatchListFilters`.

Repair can run by:

- `scope.targetType` + `scope.targetId`;
- `scope.limit` for batch size;
- all watch list rows if no scope is supplied.

## Expected Output

- Operators can inspect projection health without reading DB rows by hand.
- A projection mismatch can be repaired through a scoped rebuild.
- Repair returns before/build/after/compare result in one response.
- Projection repair stays isolated from event replay and side effects.

## Verification

Run targeted checks:

```text
cmd /c npx eslint src/domains/projection/server src/app/api/admin/system/projections/route.ts --max-warnings=0
cmd /c npx prisma validate
```

Whole-repo `tsc --noEmit` is still expected to be noisy in this checkout because
of unrelated older files/import graph issues. Use targeted verification for
this sprint unless those older errors are being addressed.

Observed verification after implementation:

- `cmd /c npx eslint src/domains/projection/server src/app/api/admin/system/projections/route.ts --max-warnings=0` passed.
- `cmd /c npx prisma validate` passed.
- Scoped TypeScript check reached pre-existing errors in
  `src/domains/task/server/business-binding.service.ts`; no Sprint 56-specific
  TypeScript error was identified before those existing errors stopped the
  compiler.

Known pre-existing TypeScript blockers:

- `business-binding.service.ts`: `productImage` row shape is `{ id }[]` but the
  downstream helper expects `{ fileKey? }[]`.
- `business-binding.service.ts`: `taskId` is passed to a type that expects
  `BusinessBindingTargetInput & { taskItemId: string }`.

## Handoff

Read these files first when continuing this projection work:

- `docs/architecture/15-event-driven-domain-boundary.md`
- `docs/sprints/SM-Sprint-54-watch-queue-media-projection.md`
- `docs/sprints/SM-Sprint-55-watch-list-projection.md`
- `docs/sprints/SM-Sprint-56-projection-observability-repair.md`
- `src/domains/projection/server/projection-observability.service.ts`
- `src/app/api/admin/system/projections/route.ts`

Current projection read flags:

- `WATCH_MEDIA_QUEUE_PROJECTION_READ=1` enables Media Workspace queue reads from
  projection with fallback.
- `WATCH_LIST_PROJECTION_READ=1` enables Watch List reads from projection with
  fallback.

Do not turn Watch List projection into the final UI source until Sprint 57
reviews the reduced list contract with the product owner.

## Next Recommended Sprint

Before fully cutting Watch List UI over to projection, review the Watch List UI
contract with the product owner:

- which fields the list still needs;
- which business logic should leave the client;
- which actions should remain available from the list;
- which projection columns are required for search/filter/sort.

Do not copy the old list query shape into projection just because the old UI
used it.
