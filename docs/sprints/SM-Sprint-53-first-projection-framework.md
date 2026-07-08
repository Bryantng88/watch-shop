# SM Sprint 53 - First Projection Framework

Type: SM Mode

M2 vertical slice:

```text
Business Domain action -> Business Event -> Dispatcher -> Consumer Registry -> Event Consumers
```

Reference projection path:

```text
Source data / Business Event
-> Projection builder or Projection consumer
-> Projection read model
-> UI list/search/filter
```

## Mission

Create the first code-level Projection Framework without migrating any current
screen to projection yet.

Projection is a read-model boundary. It is not business truth, not workflow
truth, and not a second write model.

## Implemented

- Added projection server module:
  - `src/domains/projection/server/projection.types.ts`
  - `src/domains/projection/server/projection.registry.ts`
  - `src/domains/projection/server/projection.runner.ts`
  - `src/domains/projection/server/projection-event-consumer.ts`
  - `src/domains/projection/server/index.ts`
- Added projection contract/types:
  - `ProjectionBuilder`
  - `ProjectionBuildResult`
  - `ProjectionScope`
  - `ProjectionConsumerResult`
- Added projection registry:
  - `listProjectionBuilders()`
  - `getProjectionBuilder()`
  - `listProjectionBuildersForEvent()`
- Added projection runner:
  - `runProjectionBuildersForEvent()`
  - `rebuildProjection()`
- Added projection event consumer entrypoint:
  - `consumeBusinessEventForProjection()`
- Added `projection` to `BusinessEventConsumerKey`.
- `dispatchBusinessEvent()` now has a `projection` result slot.
- `recordBusinessEvent()` returns the `projection` consumer result slot.

## Important Design Choice

The projection consumer is available but not enabled in the default dispatcher
registry yet.

Reason:

- There is no concrete projection builder yet.
- Enabling the consumer now would add skipped projection logs to events without
  changing behavior.
- Sprint 54 should enable it only when the first accepted projection builder is
  registered.

## Runtime Contract

Projection builder:

```text
key
version
sourceEvents
targetTypes
buildFromEvent()
rebuild()
```

Projection runner:

```text
event -> matching builders -> build result[]
```

Internal rebuild:

```text
projectionKey + scope -> builder.rebuild()
```

## Engineering Rules

- Projection is read-only.
- Projection must not mutate business truth.
- Projection must not dispatch notification.
- Projection must not apply workflow transitions.
- Projection builder and projection query must stay separate.
- Projection should denormalize only fields needed by list/search/filter or
  dashboard reads.
- Do not copy whole domain aggregates into projection rows.
- Do not delete old query paths before projection is compared and accepted.
- No schema migration in this sprint.

## Out Of Scope

- Building the Media Queue projection.
- Building the Watch List projection.
- Adding a projection database table.
- Replacing existing Workspace queue queries.
- Projection repair UI.
- Background projection jobs.

## Verification

Ran:

```text
cmd /c npx eslint src/domains/projection/server src/domains/event/contract/business-event-contract.types.ts src/domains/event/dispatcher/business-event-dispatcher.ts src/domains/event/dispatcher/business-event-consumers.registry.ts src/domains/event/server/business-event.service.ts --max-warnings=0
```

Result: pass.

Whole-repo typecheck is still noisy in this checkout and fails on pre-existing
unrelated files documented in Sprint 52.

## Next Recommended Sprint

Sprint 54 - Watch Queue / Media Projection.

Use the framework to build the first concrete projection for Media Workspace
queue reads. Keep the old query path as fallback and compare results before
making projection the default read path.

## Acceptance

Sprint 53 passes if:

- Projection has a typed builder contract.
- Projection has a registry.
- Projection has a runner for event-based builds.
- Projection has an internal rebuild function.
- Business event dispatch result can carry a projection consumer slot.
- No current UI or business behavior changes.
- No projection schema migration is required yet.
