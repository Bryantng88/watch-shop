# SM Sprint 52 - Workspace Workflow Processor Boundary

Type: SM Mode

M2 vertical slice:

```text
Business Domain action -> Business Event -> Dispatcher -> Consumer Registry -> Event Consumers
```

Reference flow:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Notification
```

## Mission

Create a clear server-side boundary for Workspace workflow orchestration.

The immediate pain is Watch Media: manual Workspace actions and event-triggered
Workspace transitions still caused Task/Coordination code to know too much
about Watch Media side effects. Sprint 52 starts moving that cross-domain
orchestration behind a `Workspace Workflow Processor` boundary while preserving
current behavior.

Watch Media is only the reference implementation. The boundary applies to all
future domain/workspace/workflow combinations: Order, Service, Shipment,
Inventory, Marketing, and any later domain should follow the same rule.

## Boundary Definition

The processor answers:

```text
Given this Workspace Item workflow transition,
what collaboration side effects should happen next?
```

The processor does not own:

- Watch business truth.
- Workspace/Item persistence details.
- Notification delivery.
- Timeline rendering.
- Projection read models.
- UI progress rendering.

It may call focused services that own those effects and return a structured
result.

## Implemented

- Added `src/domains/task/server/workspace-workflow-processor.ts`.
- Manual queue-item transitions now call
  `processManualWorkspaceWorkflowTransition()` after the workflow transition is
  applied.
- Event-triggered coordination workflow transitions now call
  `processEventWorkspaceWorkflowTransition()` instead of calling the low-level
  workflow state updater directly.
- `task.actions.ts` no longer imports Watch Media side-effect services
  directly.
- Watch Media side effects are centralized behind the processor for:
  - Photoshoot `DONE` -> emit photoshoot completed behavior.
  - Media Processing `DONE` -> approve media and emit ready-for-publish.
  - Publish `RECALLED` -> recall Watch media and reopen Media Processing.
- Manual transition response remains compatible with existing UI:
  - `result`
  - `mediaProcessingResult`
  - new `workflowProcessorResult`
- Event transition response keeps compatibility fields such as:
  - `applied`
  - `reason`
  - `workflowKey`
  - `fromState`
  - `toState`
  - `terminal`
  - `eventTransitionResult`

## Current Flow After Sprint 52

Manual Workspace action:

```text
UI action
-> applyQueueItemManualTransitionAction()
-> applyManualWorkflowAction()
-> processManualWorkspaceWorkflowTransition()
-> focused Watch Media service if the transition requires it
-> revalidate affected Workspace/Watch paths
```

Event-triggered Workspace action:

```text
Business Event
-> Dispatcher
-> coordination consumer
-> ensure Workspace Item binding
-> processEventWorkspaceWorkflowTransition()
-> workflow runtime update
-> activity projection
```

## Engineering Rules

- Business Domain still owns business truth.
- Domain data writes may call the owning domain service directly.
- Do not force ordinary field edits through Business Events.
- Business Events are for meaningful facts that other concerns should react to.
- Projection/List is a read/action surface, not business truth.
- Workspace Workflow Processor owns orchestration decisions only.
- Focused services still perform concrete work.
- Do not move generic CRUD into the processor.
- Do not make the processor import UI or Next cache APIs.
- Do not add schema changes in this sprint.
- Do not rewrite Watch Media UI in this sprint.
- Preserve old response fields while adding new processor result shape.

## Why This Matters

Before Sprint 52, `task.actions.ts` applied a Workspace workflow transition and
then directly called Watch Media side-effect services. Coordination also called
the low-level workflow transition updater directly.

That made the boundary blurry:

```text
Task action / Coordination
-> workflow transition
-> Watch Media side effects
```

After Sprint 52, the boundary is explicit:

```text
Task action / Coordination
-> Workspace Workflow Processor
-> focused effect service
```

This keeps future Order/Service flows from copying Watch-specific orchestration
into UI actions, Task actions, or individual consumers.

The general pattern is:

```text
Domain data write
-> owning Business Domain service

Business milestone
-> Business Event -> Dispatcher -> Consumers

Workspace workflow transition
-> Workspace Workflow Processor -> focused services

List/search/dashboard read
-> Projection
```

## Verification

Ran:

```text
cmd /c npx eslint src/domains/task/actions/task.actions.ts src/domains/task/server/workspace-workflow-processor.ts src/domains/coordination/server/coordination-event-consumer.ts --max-warnings=0
```

Result: pass.

Typecheck note:

```text
cmd /c npx tsc --noEmit --pretty false
```

Whole-repo typecheck still fails on pre-existing unrelated files such as
`src/note.ts`, `component for chatGPT/...`, and older task/watch typing issues.

A scoped temp typecheck was also run for the touched graph; remaining failures
were existing dependency errors outside the new processor/action boundary.

## Known Limitations

- Watch Media focused services still live under `watch/server/media-work`.
- The processor currently handles the Watch Media reference flow only.
- The event transition processor wraps existing workflow runtime updates; it
  does not yet produce side-effect plans beyond the raw transition result.
- There is no dedicated test harness in this repo yet for processor unit tests.
- Realtime progress/background jobs remain later work.

## Next Follow-Up

- Add small tests once a local test harness exists.
- Move additional cross-domain manual/event workflow rules into the processor as
  they are touched.
- Keep Sprint 53 focused on Projection Framework, not more Watch Media UI
  cleanup.

## Acceptance

Sprint 52 passes if:

- Task actions do not directly import Watch Media side-effect services for
  workflow completion/recall orchestration.
- Coordination event consumer uses the Workspace Workflow Processor boundary
  for event-triggered workflow transitions.
- Existing Media approve/Photoshoot complete/Publish recall behavior is kept.
- UI compatibility fields remain available.
- Processor result exposes clear applied/skipped/failed-style effect reporting.
