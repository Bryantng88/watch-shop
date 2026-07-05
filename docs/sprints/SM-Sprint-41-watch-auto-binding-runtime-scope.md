# SM Sprint 41: Watch Auto-Binding Runtime Scope V1

Date: 2026-07-04

Status: Implemented

## Mission

Make Watch auto-binding scope explicit at runtime.

M2 north star:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership.
```

Sprint 41 covers:

```text
allowed coordination consumer -> active Media weekly Space -> publish Item
```

## Implemented

- Coordination auto-binding now returns explicit binding scope metadata.
- Watch review routes carry explicit scope metadata.
- Success results include:
  - scope
  - binding id
  - bindingCreated
  - workflow result
- Skip results can include scope.
- Missing active cycle/workspace and missing target item now use runtime-scope
  language.

## Runtime Scope

Watch review events route to:

```text
scopeType: CURRENT_ACTIVE_WEEKLY_SPACE
context: MEDIA
workTypeKey: publish
```

Resolved success scope:

```text
CURRENT_ACTIVE_WEEKLY_SPACE / MEDIA / publish / taskId / taskItemId
```

## Skip Reasons

Scope-related skip reasons:

- `NO_ACTIVE_BINDING_SCOPE`
- `NO_ACTIVE_SCOPE_ITEM`

Legacy reasons still exist in the type for compatibility:

- `NO_ACTIVE_COORDINATION_CYCLE`
- `NO_WORK_TICKET`

Other existing skip reasons remain:

- `NO_ROUTE`
- `ROUTE_DISABLED`
- `UNSUPPORTED_COORDINATION_TYPE`
- `UNSUPPORTED_TARGET_TYPE`
- `MISSING_BUSINESS_EVENT_LOG_ID`
- `MISSING_TARGET_ID`

## Current Behavior

When a Watch review event is consumed by coordination:

1. Resolve route from event key and target type.
2. Resolve route scope to `MEDIA`.
3. Resolve current active weekly Media Space.
4. Resolve active `publish` Item inside that Space.
5. Ensure business binding idempotently.
6. Apply workflow event transition.
7. Create business event activity.
8. Return scope, binding, and workflow result.

## Important Runtime Rule

Sprint 41 does not auto-create Media Space.

If there is no active Media weekly Space, coordination skips with:

```text
NO_ACTIVE_BINDING_SCOPE
```

This keeps old/closed cycles from receiving new events and avoids silently
creating operational scope before Blueprint Event Binding is ready.

## Files Changed

- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/domains/coordination/server/coordination-router.registry.ts`

## Out Of Scope

- Blueprint Event Binding.
- Order/Service domain events.
- Coordination Router redesign.
- Workspace lifecycle redesign.
- Auto-create missing Media Space from business events.

## Next Sprint

Sprint 42 should handle:

```text
Watch Blueprint Event Binding V1
```

Expected direction:

- Blueprint defines Watch event binding.
- Workspace snapshot stores applied event binding.
- Runtime reads binding from Workspace snapshot.
- No Blueprint Event Binding, no auto-binding.
