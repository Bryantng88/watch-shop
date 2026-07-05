# SM Sprint 42: Watch Blueprint Event Binding V1

Date: 2026-07-04

Status: Implemented

## Mission

Make Watch auto-binding owned by Blueprint snapshot, not by hardcoded
workspace behavior.

M2 north star:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership.
```

Sprint 42 covers:

```text
Blueprint event binding -> Workspace snapshot -> Coordination consumer enforcement
```

## Implemented

- Added a shared Workspace event binding contract.
- Seeded Watch publish event bindings for the Media `publish` Blueprint.
- Stored event bindings in Workspace definition snapshots.
- Added event binding snapshot notes to system-created weekly work tickets.
- Updated coordination auto-binding to require a matching Blueprint snapshot
  binding before linking a business target to a work ticket.
- Added duplicate binding protection inside the active runtime scope.
- Added Blueprint event binding audit output for developer diagnostics.

## Watch Event Bindings

The Media `publish` Blueprint now owns these Watch bindings:

```text
watch.content.submitted
watch.content.rejected
watch.content.approved
watch.image.submitted
watch.image.rejected
watch.image.approved
```

All bindings use:

```text
targetType: WATCH
consumer: coordination
scopeType: CURRENT_ACTIVE_WEEKLY_SPACE
scopeContext: MEDIA
workTypeKey: publish
effects: AUTO_BIND, APPLY_WORKFLOW, WRITE_ACTIVITY
status: ACTIVE
source: BLUEPRINT
```

## Runtime Rule

Coordination route registry still decides whether the coordination consumer
knows how to handle an event.

The Workspace item decides whether the event may bind to it.

Rule:

```text
No matching Blueprint event binding in the active Workspace snapshot,
no auto-binding.
```

Matching key:

```text
eventKey + targetType + consumer + scopeType + scopeContext + workTypeKey
```

If more than one active item in the same scope claims the same binding, runtime
skips with `DUPLICATE_BLUEPRINT_EVENT_BINDING`.

If an active item matches the legacy route but has no Blueprint binding, runtime
skips with `NO_BLUEPRINT_EVENT_BINDING`.

## Audit Matrix

Developer diagnostics now expose event binding rows with:

```text
eventKey
targetType
consumer
scopeType
scopeContext
workTypeKey
effects
status
source
sourceBlueprint
conflictKey
conflictCount
hasConflict
```

Legacy coordination routes are listed as consumer routing, but conflict detection
only counts active Blueprint bindings because legacy routes are not Workspace
ownership.

## Files Changed

- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/blueprint/shared/workspace-capabilities.ts`
- `src/domains/blueprint/server/blueprint.types.ts`
- `src/domains/blueprint/server/blueprint-library.service.ts`
- `src/domains/blueprint/server/blueprint-event-binding-audit.service.ts`
- `src/domains/blueprint/server/index.ts`
- `src/domains/coordination/server/coordination-cycle.service.ts`
- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/app/(admin)/admin/system/workflows/page.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `docs/sprints/CURRENT.md`

## Out Of Scope

- Event binding authoring UI.
- Event binding persistence outside snapshot notes.
- Applying Blueprint updates to existing Workspace items.
- Order, service, payment, or other domain event bindings.
- Automation, notification, permission, analytics.

## Acceptance

Sprint 42 passes if:

- Blueprint declares Watch publish event bindings.
- New Workspace snapshots include event bindings.
- New system weekly Media publish tickets include event bindings.
- Coordination auto-binding requires a snapshot binding.
- Developer diagnostics can show what event is bound by which Blueprint.

Status: PASS.
