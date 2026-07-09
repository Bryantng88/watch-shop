# SM Sprint 63 - Service Operation Workflow and Consumer Hardening

## Status

Implemented first slice.

Sprint 63 hardens Service Operation around the same M2 architecture used by
Watch Media:

```text
Business Domain action -> Business Event -> Dispatcher -> Consumer Registry -> Event Consumers -> Workspace capacity/binding.
```

This sprint does not start the ProjectionRecord Service Operation read model.

## Agreed Direction

Service Operation stays event-driven and blueprint-led.

- ServiceRequest and TechnicalIssue remain Service business truth.
- Workspace capacity and item bindings must come from Blueprint/event consumer
  behavior, not from workspace detail UI.
- Space Management remains the overview surface with `SR Cases` and
  `TI list`/Technical Bench views.
- Technical Bench is a Space Management view, not a workspace tab.
- SR Cases is a Space Management view, not a workspace tab.
- Service Operation workspace detail is hybrid by context:
  - an SR context shows the TI items for that SR;
  - a TI context shows TI operation items with stage and workflow actions.
- Stage is workflow state of TechnicalIssue operation, not a Space workflow
  engine.

## Primary Scope

### 1. Workflow/domain consistency

Fix the current ordering risk where workflow runtime can advance before the
Service domain action succeeds.

Preferred direction:

```text
manual action request
-> resolve queue business binding
-> run Service domain validation/action
-> commit workflow runtime transition
-> record processor effects/activity
```

Fallback direction:

```text
manual action request
-> commit workflow runtime transition
-> run processor effect
-> rollback workflow runtime when Service action fails
```

The preferred direction is better because Service remains the business truth.

Actions covered:

- `confirm-issue`
- `start-work`
- `mark-done`

### 2. Service Operation event consumer path review

Review the existing Watch Media event consumer path and apply the same boundary
rules to Service Operation before activating bindings.

The review must answer:

- which Service/Payment event keys are allowed to reach `coordination`;
- which keys are allowed to reach `workflow`;
- which consumer creates or updates workspace queue items;
- how existing `TECHNICAL_ISSUE` bindings are found idempotently;
- whether draft bindings can be promoted safely.

### 3. TI item list presentation cleanup

Make the TI workspace item list meaningful without inventing capacity in the UI.

The item list should show data from existing binding/read models:

- issue summary;
- SR reference;
- watch/product context;
- workflow stage;
- owner/vendor;
- priority;
- next valid workflow action.

Avoid generic or misleading values such as empty progress counts when TI
operation does not use that concept.

### 4. Space Management UI cleanup

Keep the board as a separate Space Management view. Do not render the board
inside the workspace item tab.

Remove or reduce UI elements that make the Technical Bench behave like a
workspace substitute, especially focus/detail panels that blur the boundary.

## Design Note: Possible Future Workspace Split

The current Service Operation workspace is accepted as hybrid for this sprint,
but the next operating model may split TI work by workspace role.

Candidate model:

```text
Inspect workspace
-> Processing workspace
-> Done/follow-up workspace
```

Inspect workspace:

- classify the issue;
- decide area/vendor assignment;
- finish directly when inspection finds no real issue;
- route valid work into processing.

Processing workspace:

- starts from a queued/not-started state;
- `start-work` can open a modal for cost, vendor, extra issue creation, or
  other operational updates;
- can create additional TI records when inspection/repair discovers more work;
- can change vendor/owner when needed;
- moves completed work into done/follow-up.

Done/follow-up workspace:

- monitors completed work;
- can reopen back to Processing;
- can return to Inspect when re-check is required.

This is a design candidate only in Sprint 63. Do not implement separate
Inspect/Processing/Done workspaces until the consumer/binding model is stable
and the Blueprint capacity model is explicit.

## Non-Goals

- no Service schema migration;
- no Service `spaceId` or `workspaceId`;
- no Space workflow engine;
- no SR workflow engine;
- no Payment Workspace;
- no MaintenanceRecord-as-Activity;
- no ProjectionRecord Service Operation read source;
- no separate Inspect/Processing/Done workspace implementation in this sprint.

## Acceptance Criteria

- Service Operation manual workflow action cannot leave workflow runtime ahead
  of failed Service truth.
- `confirm-issue`, `start-work`, and `mark-done` have smoke coverage or an
  equivalent scoped validation path.
- Service Operation event consumer activation decision is documented.
- Selected bindings remain `DRAFT` unless the consumer path is verified.
- TI item list renders meaningful TechnicalIssue data.
- Space Management still exposes SR and TI overview views.
- Workspace item tab does not contain Technical Bench or SR Cases board UI.
- Scoped lint passes for touched files.

## Implemented First Slice

### 1. Service Operation manual action preflight

Changed:

- `src/domains/task/server/business-binding-workflow.service.ts`
- `src/domains/task/actions/task.actions.ts`
- `src/domains/task/server/workspace-workflow-processor.ts`

Added a non-mutating manual transition resolver:

```text
resolveManualWorkflowAction
```

Service Operation manual actions now run the Service domain command before the
workflow runtime transition is written:

```text
manual action request
-> resolve matching workflow transition without writing runtime
-> run Service Operation action adapter
-> apply workflow runtime transition
-> run remaining workspace workflow processor effects
```

The workspace workflow processor no longer runs the Service Operation action
adapter after runtime transition, so `confirm-issue`, `start-work`, and
`mark-done` are not executed twice.

This closes the main Sprint 62 limitation where workflow runtime could move
ahead of failed Service truth.

### 2. Technical Bench boundary cleanup

Changed:

- `src/app/(admin)/admin/services/operation/page.tsx`

Removed the `focusTi` side panel from the Space Management Technical Bench
board. The board remains a Space Management overview view and no longer behaves
like a workspace substitute/detail shell.

### 3. TI item list presentation

Changed:

- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/ui/task-work/QueueWorkQueue.tsx`

TechnicalIssue queue previews now include more useful operational detail:

- issue summary;
- SR reference;
- watch/product context;
- image;
- area;
- owner/vendor;
- priority.

For Service Operation workspace lists, the generic `Progress` column is rendered
as `Issue detail` and uses the TechnicalIssue preview detail instead of showing
an empty progress value.

### 4. Event consumer activation decision

Service/Payment event keys remain `timeline`-only in the event catalog for this
slice, and Service Operation Blueprint event bindings remain `DRAFT`.

Reason:

- the existing coordination consumer already provides the right blueprint-led
  binding path through `ensureTaskItemBusinessBinding`;
- activation should be a separate explicit step after smoke validation of the
  Service Operation binding routes;
- Sprint 63 first slice focused on workflow/domain consistency and UI boundary
  cleanup.

## Validation

Passed:

```bash
cmd /c npx eslint src/domains/task/server/business-binding-workflow.service.ts src/domains/task/actions/task.actions.ts src/domains/task/server/workspace-workflow-processor.ts --quiet
cmd /c npx eslint src/domains/task/server/business-binding.service.ts src/domains/task/ui/task-work/QueueWorkQueue.tsx "src/app/(admin)/admin/services/operation/page.tsx" --quiet
```

## Remaining Follow-Up

- Add smoke tests around `confirm-issue`, `start-work`, and `mark-done`.
- Validate selected Service Operation event binding routes end to end before
  moving any binding from `DRAFT` to `ACTIVE`.
- Revisit the future Inspect/Processing/Done workspace split after the
  blueprint capacity model is explicit.
