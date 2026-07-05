# SM Sprint 43: Watch Timeline Activity Consolidation V1

Date: 2026-07-04

Status: Implemented

## Mission

Make Watch event history practical and reliable inside the Workspace item.

Sprint 43 does not introduce a new timeline product model. It consolidates the
current behavior around one rule:

```text
BusinessEvent creates the activity anchor.
Feedback and user discussion attach to that activity context.
```

## Implemented

- Coordination consumer now uses the same Watch event presentation as timeline
  projection.
- Watch event activities now include a readable body snapshot from event payload:
  - Watch title
  - ref/SKU
  - review target
  - status transition
  - feedback message when present
- Business event orchestration now runs `coordination` before the remaining
  consumers.
- Timeline projection therefore runs after auto-binding has had a chance to
  create the TaskItem business binding.
- Existing consumer contracts remain unchanged.

## Runtime Flow

For Watch review events:

```text
Watch service emits BusinessEvent
BusinessEvent log is upserted
Coordination consumer resolves Blueprint snapshot binding
Coordination consumer binds Watch to Media weekly publish item
Coordination consumer creates/updates the activity anchor
Timeline consumer projects entries/activity against the now-related TaskItem
Workflow transition applies through the binding path
User discussion can be added as replies on the activity
```

## Activity vs Discussion Decision

Sprint 43 keeps a pragmatic model:

- Activity is the event/history anchor.
- System and BusinessEvent entries are activities.
- User discussion is not a separate competing feed.
- User discussion is attached to an activity as replies.

This means Activity and Discussion are not separate business concepts in M2;
they are two interaction modes on the same timeline surface.

## Out Of Scope

- Removing the legacy `TimelineEntry` table/model.
- Rebuilding the task item UI.
- Adding a separate discussion product.
- Cross-domain timeline standardization for Order, Service, Payment, etc.
- Migration of historical entries.

## Acceptance

Sprint 43 passes if:

- Watch auto-binding happens before timeline projection.
- Watch event activity title/body is consistent between coordination and
  timeline projection.
- Feedback remains part of the activity context.
- User discussion can stay as replies on the activity.

Status: PASS.
