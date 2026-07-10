# Service Operation Retrospective - Corrections and Current Contract

## Purpose

This note records the Service Operation misunderstandings that happened during
Sprints 61-65, what was wrong, and how the implementation was corrected back to
the agreed architecture.

It should be read before continuing Service Operation work.

## Current Contract

Service Operation follows the same M2 direction as Watch Media:

```text
Business Domain action
-> Business Event
-> Dispatcher
-> Consumer Registry
-> Coordination Consumer
-> Blueprint receiver / workspace binding
-> Queue item workflow
```

ServiceRequest and TechnicalIssue remain Service business truth.

Workspace capacity and queue item binding are Blueprint/event-consumer led. UI
must not create hidden capacity or bind business objects just because a detail
page was opened.

ProjectionRecord Service Operation reads remain deferred.

## Correct UI Boundaries

Space Management and workspace are different surfaces.

Space Management:

- shows the Service Operation space/workspace index;
- exposes `SR Cases` as SR workspace rows;
- exposes `Technical Bench` as the technical workspace index;
- is allowed to help users inspect workload across stages;
- hydrates workspace rows with ServiceRequest and TechnicalIssue business
  truth;
- is not the workflow engine.

Workspace:

- is the operation shell where queue items are worked;
- renders item lists and workflow actions produced by Blueprint/event binding;
- does not contain the Technical Bench board as an item tab;
- does not contain `SR Cases` as an item tab.

Service Operation workspace is hybrid by context:

- SR view: each workspace row represents one SR case. The row keeps the current
  SR operational columns such as service request, watch, creator, attention,
  technical progress, commercial, and updated time, but those fields are a
  workspace-row presentation hydrated from business truth.
- SR workspace detail: shows TechnicalIssue items belonging to that SR.
  The bound ServiceRequest identifies the SR workspace/case; it must not render
  as an item row. TechnicalIssue creation happens inside this SR workspace via
  a compact `Tao TI` action.
- Technical Bench view: represents technical operation workspaces, not a direct
  business-domain issue board. The accepted model is workspace grouping by
  operation role: Inspect, Processing, and Done/Follow-up.
- TI/technical workspace detail: shows TechnicalIssue operation items with
  stage and workflow actions.

TechnicalIssue still has operation stages such as `Inspect`, `Ready`,
`In Progress`, and `Done`, but they are not all workspace capacity boundaries.
`Ready -> In Progress -> Done` is the workflow inside the Processing workspace.
Runtime binding must still be explicit through Blueprint capacity and event
receiver semantics; UI/read code must not create missing technical workspaces.

## What Went Wrong

### 1. Technical Bench was treated as the workspace

Wrong direction:

- `Open issue` / `Open workspace` behavior blurred the distinction between the
  Technical Bench board and the workspace.
- The board started behaving like a replacement workspace/detail surface.

Correction:

- Technical Bench is now documented as a Space Management technical workspace
  index.
- The focus side panel was removed from
  `src/app/(admin)/admin/services/operation/page.tsx`.
- The board remains useful for overview, but workflow operation belongs to the
  workspace queue/item flow. It must not read as a replacement detail surface.

### 2. `SR Cases` and `Technical Bench` were added inside workspace tabs

Wrong direction:

- `SR Cases` and `Technical Bench` were temporarily pushed into the TaskItem
  workspace shell.
- That made workspace navigation imply there were separate workspace modes for
  these overview views.

Correction:

- Those tabs were removed from `TaskItemDetailClient`.
- They remain Space Management modes/views only.
- `SR Cases` should index SR workspaces.
- `Technical Bench` should index technical operation workspaces.
- The workspace item tab is labeled for TechnicalIssue operation and renders
  queue items, not the board.

### 3. Workspace capacity was almost created from detail/UI logic

Wrong direction:

- There was an attempt to auto-bind or ensure Service Operation queue items from
  the detail/read path.
- That violated the Blueprint capacity contract.

Correction:

- `task-item-detail.repo.ts` no longer imports Service Operation facade or
  `ensureTaskItemBusinessBinding`.
- Service Operation queue items are expected to come from Blueprint/event
  consumer behavior.
- Sprint 64 activated TechnicalIssue event keys for coordination.

### 4. Manual workflow advanced before Service truth

Wrong direction:

- Workflow runtime could move first, then the Service domain action could fail.
- That could leave workspace state ahead of TechnicalIssue business truth.

Correction:

- Sprint 63 added a non-mutating manual transition resolver.
- Service Operation manual actions now run the Service command before workflow
  runtime is written.
- `workspace-workflow-processor` no longer executes the Service Operation action
  adapter after the transition, avoiding double command execution.

### 5. Generic queue list rendered meaningless TI rows

Wrong direction:

- TechnicalIssue rows showed generic labels and empty progress values.
- The list looked like it could not actually render TI information.

Correction:

- `business-binding.service.ts` now hydrates `TECHNICAL_ISSUE` previews with
  summary, SR reference, product/watch context, image, area, owner/vendor, and
  priority.
- `QueueWorkQueue` renders `Issue detail` instead of generic `Progress` for
  Service Operation workspaces.

### 6. Event bindings were activated before runtime smoke was proven

Wrong risk:

- Sprint 64 activated the minimal TechnicalIssue coordination path, but runtime
  data had not yet been proven end to end.

Correction:

- Sprint 65 added `diagnoseBusinessEventForCoordination`.
- `scripts/smoke-service-operation-consumer.ts` provides dry-run, receiver
  diagnostics, explicit apply, and explicit receiver selection.
- Current DB smoke found duplicate Service Operation receiver candidates and
  correctly skipped with `DUPLICATE_BLUEPRINT_EVENT_BINDING`.

Runtime must not guess which receiver is correct.

## Current Implementation State

Completed first slices:

- Sprint 62: Service Operation action adapter and Service/Payment event key
  alignment.
- Sprint 63: workflow/domain consistency hardening and UI boundary cleanup.
- Sprint 64: minimal TechnicalIssue event consumer activation.
- Sprint 65: consumer smoke/diagnostic and action error UX.

Active TechnicalIssue binding events:

- `technical_issue.created`
- `technical_issue.confirmed`
- `technical_issue.started`
- `technical_issue.completed`

Inactive/draft for binding:

- `service_request.created`
- `service_request.status_changed`
- `technical_issue.reopened`
- `payment.created`
- `payment.status_updated`

Current DB blocker:

```text
DUPLICATE_BLUEPRINT_EVENT_BINDING
```

Cause:

- the current technical cycle has multiple Service Operation candidate work
  tickets;
- none was marked as the explicit auto-binding receiver.

Correct next operational step:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --receivers
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --select-receiver <taskItemId>
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts
```

Only after dry-run is green should an apply smoke be run:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --issue <technicalIssueId> --apply
```

## Non-Negotiable Guardrails

- Do not add `spaceId` or `workspaceId` to Service tables.
- Do not create queue bindings from workspace detail/read code.
- Do not put Technical Bench board inside workspace item tabs.
- Do not put SR Cases inside workspace tabs.
- Do not turn Space into a workflow engine.
- Do not use MaintenanceRecord as the Activity source.
- Do not activate SR/Payment/reopened bindings without a separate route and
  receiver review.
- Do not start ProjectionRecord Service Operation reads until the event-driven
  path is stable and measured.

### 7. Four technical stage workspaces were over-modeled

Wrong direction:

- Sprint 67 briefly modeled Technical Bench as four separate workspaces:
  Inspect, Ready, In Progress, and Done.
- That made workflow states look like workspace capacity and blurred where
  actual operation happens.

Correction:

- Technical Bench now indexes three operation workspaces:
  Inspect, Processing, and Done/Follow-up.
- Inspect is for classification/routing.
- Processing owns the internal workflow `Ready -> In Progress -> Done`.
- Done/Follow-up tracks completed issues, payment readiness, and possible
  send-back.
- TechnicalIssue events map current Service truth to those operation workspaces:
  `INSPECT` -> Inspect, `READY`/`IN_PROGRESS` -> Processing, `DONE` ->
  Done/Follow-up.

## Current Technical Workspace Model

Service Operation technical work is split into operation workspace roles:

```text
Inspect workspace -> Processing workspace -> Done / Follow-up workspace
```

The Processing workspace owns this internal workflow:

```text
Ready -> In Progress -> Done
```

This is implemented through workspace role markers on Technical cycle TaskItems:
`serviceOperationWorkspaceRole: INSPECT|PROCESSING|DONE`. The Space Management
view may present the groups as workspace index rows/cards, but runtime must not
create missing workspaces from UI/read code.
