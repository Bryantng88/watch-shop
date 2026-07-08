# SM Sprint 55: Watch List Projection

## Mission

Build the second concrete projection: `watch-list`.

Sprint 54 proved the ProjectionRecord store and Media Queue projection pattern.
Sprint 55 applies the same boundary to `/admin/watches`, while keeping the
existing Watch List query as the default fallback.

## Architecture Rules

Watch List Projection is a read model.

It must:

- serve list/search/filter/sort reads;
- keep only fields needed by the Watch List UI;
- be rebuildable from Watch/Product source data;
- stay behind a feature flag until compared and accepted.

It must not:

- mutate Watch, Product, pricing, content, image, review, or workflow state;
- validate sale/readiness business rules;
- replace Watch domain services;
- copy full Watch aggregates or detail payloads;
- make `watch-list.repo.ts` larger.

## Code Architecture

Projection code is split into small modules under:

```text
src/domains/projection/server/watch-list/
```

Files:

- `watch-list-projection.constants.ts`
- `watch-list-projection.types.ts`
- `watch-list-projection.source.ts`
- `watch-list-projection.mapper.ts`
- `watch-list-projection.query.ts`
- `watch-list-projection.builder.ts`
- `watch-list-projection.compare.ts`
- `index.ts`

The Watch List service only chooses between projection and fallback:

- `src/domains/watch/server/list/watch-list.service.ts`

The existing source query remains in:

- `src/domains/watch/server/list/watch-list.repo.ts`

## Implemented

### Projection Key

```text
watch-list
```

Version:

```text
1
```

### Projection Row Shape

Each `ProjectionRecord.dataJson` stores:

- `row`: the existing `WatchRow` UI shape;
- `filters`: query fields used by projection query.

Filter fields include:

- `watchId`
- `productId`
- `sku`
- `title`
- `brandId`
- `brandName`
- `vendorId`
- `vendorName`
- `saleStage`
- `serviceStage`
- `stockStage`
- `hasContent`
- `hasImages`
- `isPosted`
- `reviewStatus`
- `contentStatus`
- `specStatus`
- `salePrice`
- `listPrice`
- `createdAt`
- `updatedAt`

Indexed `ProjectionRecord` columns are also used:

- `projectionKey`
- `status` for sale stage / primary tabs
- `searchText`
- `sortAt`
- `entityType`
- `entityId`
- `spaceId` as product id

### Builder

Added:

- `watchListProjectionBuilder`

It supports:

- full rebuild in batches;
- rebuild by Watch target;
- rebuild by Product target;
- event-driven rebuild from selected Watch events.

The builder is registered in:

- `src/domains/projection/server/projection.registry.ts`

### Query

Added:

- `listWatchListProjection()`

It supports:

- primary tab filtering by `saleStage/status`;
- `q` and `sku` through `searchText`;
- brand/vendor filters;
- content/image filters;
- ready/processing subfilters;
- basic sort by updated, created, price, and title;
- lite mode with `pageSize + 1` next-page behavior;
- full mode counts/summary.

### Fallback

Added:

- `listWatchListProjectionWithFallback()`

Feature flag:

```text
WATCH_LIST_PROJECTION_READ=1
```

Default behavior remains source query.

When enabled:

- read projection first;
- if first page is empty, rebuild projection in batches and try again;
- if projection read fails, fallback to `listAdminWatches()`.

### Compare

Added:

- `compareWatchListProjection()`

It compares projection rows against the source Watch List query and reports:

- rows missing in projection;
- extra rows in projection;
- changed fields like `sku`, `title`, `saleState`, `updatedAt`, `imageUrl`,
  `hasContent`, `hasImages`, and `reviewStatus`.

### Event Contract

Watch event contracts now include `projection` for the events that can affect
Watch List rows, including:

- review submit/approve/reject/unapprove;
- content modified;
- media asset/ready/recall;
- sale stage posted.

## Guardrails

- Projection read is off unless `WATCH_LIST_PROJECTION_READ=1`.
- Old Watch List query remains intact.
- Watch List UI is not rewritten.
- Watch List source query remains the comparison/fallback source.
- Projection builder does not write business tables.
- Projection query does not call Watch domain services.

## Required Review Before Full UI Cutover

Do not fully switch the Watch List UI to projection until we explicitly review
and agree on the final Watch List surface.

Reason:

- the current Watch List UI still carries too much business/workflow logic;
- some fields are legacy display fields and may no longer be needed;
- some computed readiness/status logic should live in domain/projection code,
  not in the client UI;
- moving to projection is the right moment to reduce the UI contract, not copy
  every old field forward forever.

Before making projection the default read source, review and decide:

- which fields the Watch List UI actually displays;
- which filters/sorts are still product requirements;
- which columns/actions should remain on the list versus move to detail/workspace;
- which readiness/review/status values are projection read fields;
- which business decisions must stay in Watch domain services;
- which old `WatchRow` fields can be deprecated;
- whether the projection row should keep the current `WatchRow` compatibility
  shape or move to a smaller `WatchListProjectionRow` UI contract.

This review is a product + architecture checkpoint. It must happen after
projection compare/rebuild is available and before removing source-query
fallback.

## Verification

Passed:

```text
cmd /c npx eslint src/domains/projection/server/watch-list src/domains/projection/server/watch-list-projection.service.ts src/domains/projection/server/projection.registry.ts src/domains/projection/server/index.ts src/domains/watch/server/list/watch-list.service.ts src/domains/watch/server/events/watch-business-event.contract.ts --max-warnings=0
```

Scoped TypeScript check was attempted with a temporary `tsconfig.sprint55`.
It was blocked by existing unrelated type debt reached through the projection
registry import graph:

- `src/domains/task/server/business-binding.service.ts`

No temporary tsconfig or build info artifact is kept.

## Acceptance

Sprint 55 is accepted when:

- `watch-list` builder is registered;
- Watch List can read projection through a feature flag;
- source query fallback remains intact;
- projection rows can be rebuilt in batches;
- compare/debug path exists;
- code is split across projection modules instead of growing a large service
  file;
- projection stays a read model.

## Next

Before making projection the default Watch List read source:

1. Apply the `ProjectionRecord` migration from Sprint 54.
2. Rebuild `watch-list`.
3. Run compare against source query for common tabs/filters.
4. Test `/admin/watches` with `WATCH_LIST_PROJECTION_READ=1`.
5. Review the Watch List UI field/display contract with the product owner.
6. Only then consider defaulting the read path to projection.
