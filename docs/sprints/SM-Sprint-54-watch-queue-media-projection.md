# SM Sprint 54: Watch Queue / Media Projection

## Mission

Build the first concrete Projection on top of the Sprint 53 projection
framework.

The selected use case is the Media Workspace watch queue because it already
needs a read shape that combines TaskItem queue state, Watch summary, workflow
runtime, activity stats, and media progress.

## Architectural Rule

Projection is a read model only.

It may prepare rows for list/search/filter/sort and action identity. It must not
validate Watch business rules, mutate Watch state, apply workflow transitions,
or receive writes directly from UI.

Write flow remains:

```text
Workspace action
-> owning domain service or Workspace Workflow Processor
-> Business Event
-> Dispatcher
-> Projection consumer/builder updates read model
```

Read flow for Media Queue can now be:

```text
Task Item detail / Media Workspace
-> WatchMediaQueueProjection query
-> ProjectionRecord rows
-> fallback to source query when disabled, empty, or failed
```

## Implemented

### Generic Projection Store

Added a small persisted read-model table:

- `ProjectionRecord`
- migration: `prisma/migrations/20260708_projection_record_v1/migration.sql`

The table is generic enough for future projections, while concrete row contracts
remain in code.

Indexed columns:

- `projectionKey`
- `workspaceId`
- `status`
- `sortAt`
- `entityType`
- `entityId`
- `projectedAt`

The full row payload is stored in `dataJson`.

### Raw Projection Repository

Added:

- `src/domains/projection/server/projection-record.repo.ts`

This uses raw Prisma SQL instead of `db.projectionRecord.*` so Sprint 54 does
not depend on a freshly generated Prisma Client during development.

Responsibilities:

- `upsertProjectionRecord()`
- `listProjectionRecords()`
- `deleteProjectionRecords()`

### Watch Media Queue Projection

Added:

- `src/domains/projection/server/watch-media-queue.projection.ts`

Projection key:

```text
watch-media-queue
```

Version:

```text
1
```

The projection stores one row per Watch queue binding in a Media Workspace.

Each row is currently the existing `QueueItemDTO` shape, but only for the Media
Workspace Watch queue. It is persisted as read data and indexed by:

- workspace/task item id;
- binding id as row key;
- target type/id;
- queue status;
- updated/sort date;
- search text.

This keeps UI compatibility while establishing the persisted projection
boundary.

### Builder / Rebuild

The builder can rebuild by:

- `workspaceId`;
- `targetType + targetId`;
- all Media Workspace task items.

For a Watch event, it resolves affected Media Workspace task items, rebuilds the
source rows for that workspace, deletes stale projection rows for the workspace,
and upserts the current read rows.

The rebuild is idempotent.

### Event Consumer Registration

Projection builder registry now includes:

- `watchMediaQueueProjectionBuilder`

Business event dispatcher now enables the `projection` consumer.

The builder only reacts to selected Watch media/review/content events, so other
events can still skip projection safely.

The relevant Watch event contracts now include `projection` in `knownConsumers`;
otherwise the dispatcher validator would skip the projection consumer.

### Fallback Read Path

Task Item detail now routes Media Workspace queue reads through:

- `listWatchMediaQueueProjectionItemsWithFallback()`

The projection read path is guarded by:

```text
WATCH_MEDIA_QUEUE_PROJECTION_READ=1
```

When the flag is not enabled, it uses the old source query.

When enabled, it tries projection first, performs a scoped rebuild if projection
is empty, and falls back to the source query if projection read/rebuild fails.

### Compare / Debug Path

Added:

- `compareWatchMediaQueueProjection()`

It compares source query rows with projection rows for one workspace and reports:

- missing projection rows;
- extra projection rows;
- changed fields.

## Files Changed

- `prisma/schema.prisma`
- `prisma/migrations/20260708_projection_record_v1/migration.sql`
- `src/domains/projection/server/projection-record.repo.ts`
- `src/domains/projection/server/watch-media-queue.projection.ts`
- `src/domains/projection/server/projection.registry.ts`
- `src/domains/projection/server/index.ts`
- `src/domains/event/dispatcher/business-event-consumers.registry.ts`
- `src/domains/watch/server/events/watch-business-event.contract.ts`
- `src/domains/task/server/core/task-item-detail.repo.ts`

## Guardrails

- Projection remains read-only.
- Projection rows are rebuildable from source query.
- No UI writes projection directly.
- No Watch business rule moved into projection.
- Old source query remains available and is still the default unless the feature
  flag is enabled.
- Watch List is not moved in this sprint.
- AI/query projection is not added in this sprint.

## Verification

Passed:

```text
cmd /c npx eslint src/domains/projection/server src/domains/event/dispatcher/business-event-consumers.registry.ts src/domains/task/server/core/task-item-detail.repo.ts --max-warnings=0
```

Whole-repo TypeScript is still blocked by existing unrelated syntax/type issues
in older files, including:

- `src/note.ts`
- `component for chatGPT/...`
- existing coordination/timeline/watch-review/workflow-definition type issues
  reached by scoped import checking.

## Acceptance

Sprint 54 is accepted when:

- a persisted generic projection record table exists;
- `WatchMediaQueueProjection` has a concrete builder and query path;
- Media Workspace can read projection through a feature flag;
- source query fallback remains available;
- projection can be rebuilt by workspace or Watch target;
- projection can be compared against the source query;
- projection consumer is enabled without becoming a God service.

## Next

Sprint 55 should move to Watch List Projection only after Media Queue projection
has been exercised and compared against the source query.
