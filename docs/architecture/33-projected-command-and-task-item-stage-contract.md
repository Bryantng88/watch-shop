# Projected commands and Task Item stage contracts

## Command boundary

Any command that changes data consumed by a projection uses
`runBusinessEventTransaction` and `delivery.emit`. Domain state and its event are
atomic; durable consumers and projections run only after commit. The boundary
rejects silent commands with `BUSINESS_COMMAND_EVENT_REQUIRED` unless a
maintenance command explicitly sets `allowNoEvents`.

UI actions never invoke projection builders. Event contracts declare the
`projection` consumer and builders subscribe through the projection registry.
Coverage tests enforce both sides of that declaration.

## Task Item stage contract

A `TASK_ITEM` list is not a queue/workspace flow and must not emulate stages with
the generic workspace status filter. Its view contract declares:

- ordered stage key and label;
- transition target for each stage;
- user-facing action label.

For ad-hoc work the contract is:

```text
TODO --Bắt đầu--> IN_PROGRESS --Hoàn tất--> DONE --Mở lại--> TODO
```

The stage selector has its own URL state (`taskItemStage`). `TASK_ITEM` modes are
user-managed and read the current Space's `TaskItem` aggregate directly; they do
not depend on an event-driven workspace-summary projection. Counters and visible
rows are derived from that same source collection. This is required because a
free Task Item has no business-domain event, and the presence of unrelated
projection rows must never prevent newly-created source rows from appearing.

A successful command refreshes the authoritative source collection. Status
transitions may still emit the generic audit/invalidation event, but that event
is not the ownership mechanism for a free-work list.

This contract is reusable for future free-form Task Item views: configure the
stages and transitions in `SpaceViewModeConfig`; do not add UI conditionals or
temporary per-item status overrides.
