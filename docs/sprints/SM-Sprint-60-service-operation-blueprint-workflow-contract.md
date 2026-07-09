# SM Sprint 60 - Service Operation Blueprint and Workflow Contract

## Status

Implemented.

Sprint 60 should define the Service Operation Blueprint and Workflow contract
before wiring full UI, ProjectionRecord, or event consumers. Sprint 59 already
added the Service Operation read facade and status/stage policies; Sprint 60
turns that boundary into a Workspace/Blueprint contract.

Important correction:

- Service Operation Space does not have a workflow engine.
- Space is the operating scope/context: current week/range, active service work,
  receive previous period, rollover boundaries, and shared operational context.
- Workspace is the Blueprint-created work surface inside the Space.
- Item workflow belongs to Workspace items, not to Space.
- TechnicalIssue workflow governs the stage of individual bench work items.
- SR remains the Service case aggregate and mostly derives technical completion
  from its active TIs.

## Sprint Planning Rules

- Stay inside this sprint scope: Service Operation Workspace Blueprint,
  Technical Bench item workflow, capability, provisioning, and event-binding
  contract.
- Do not wire the prototype/UI to production routes in this sprint.
- Do not build ProjectionRecord-backed read models in this sprint.
- Do not add direct `spaceId` / `workspaceId` fields to ServiceRequest or
  TechnicalIssue.
- Do not change SR/TI enum values or make `TechnicalIssue.assessmentId`
  nullable.
- Make every implementation change concrete, reversible, and registry-backed.
- Stop and discuss before changing Service domain ownership, Payment ownership,
  MaintenanceRecord role, Blueprint snapshot semantics, or SR/TI cardinality.

## Scope Lock

Sprint 60 is a platform contract sprint, not a product UI sprint.

Do:

- register one Service Operation Workspace Blueprint;
- register one Technical Bench item workflow for TechnicalIssue items;
- document how SR case data appears as a read/collaboration surface;
- document event-binding intent without forcing runtime event emitters;
- keep all changes registry-backed and reversible.

Do not:

- model Space as a workflow runtime;
- add an SR Workspace workflow;
- create separate Approval or Payment Workspaces;
- wire the HTML prototype to production routes;
- move Service Operation reads to ProjectionRecord;
- add schema fields or migrations;
- expand MaintenanceRecord as an operational log.

Senior-dev rationale:

```text
Space scopes operation.
Workspace presents work.
Item workflow drives actionable items.
Service domain owns SR/TI truth.
```

## Senior-Dev Review

Sprint 60 should follow existing platform patterns instead of inventing a
Service-only path.

Existing platform facts:

- Blueprint registry is derived from registered work types and workflow
  definitions.
- Workspace creation stores a `blueprintSnapshot` in the Workspace note.
- Existing Workspaces do not follow live Blueprint changes.
- Workflow Runtime resolves from the Item applied snapshot first, then legacy
  keys for older Items.
- Event bindings currently live in
  `src/domains/blueprint/shared/event-bindings.ts`.
- Provisioning policy currently supports current active weekly spaces.
- Workspace workflow side effects belong behind the Workspace Workflow
  Processor boundary, not inside Service domain calls.

Therefore Sprint 60 should register Service Operation as a Workspace Blueprint
and Technical Bench item workflow contract only. It should not yet bind every
Service event into runtime side effects.

## Service Operation Workspace Blueprint

Blueprint identity:

```text
key: service-operation
name: Service Operation
businessContext: TECHNICAL
workflowKey: service-operation-technical-bench
workspaceType: service-operation
itemLabel: Technical Issues
defaultView: items
```

Purpose:

```text
Operate active service cases through SR case view and technical bench stages.
```

Default Workspace:

```text
Service Operation - Current Week
```

Core modes:

- SR Cases
- Technical Bench
- Stage Board
- Approval
- Payment
- Activity
- Info

Minimum capabilities:

- `workflow`
- `items`
- `activity`
- `discussion`
- `checklist`
- `dueDate`
- `assignee`
- `priority`

Service-specific capability notes for later UI gating:

- `service.sr_case_view`
- `service.technical_bench`
- `service.stage_board`
- `service.approval`
- `service.payment_request`
- `service.receive_previous_week`
- `service.activity`

Current Blueprint capability schema is generic boolean capability only, so
Sprint 60 should document Service-specific capability notes in metadata or
instantiation notes if needed. Do not force a schema change just to store these
notes.

## SR Case Surface Contract

SR Case is a surface inside Service Operation, not a new workflow runtime in
Sprint 60.

It should use Sprint 59 read contracts:

- SR list/case data comes from `listServiceOperationSrCases`;
- SR technical completion comes from active TI state;
- SR status remains `ServiceRequest.status`;
- payment, pickup, approval, and handover are attention/commercial surfaces;
- activity comes from Activity/Timeline later, not MaintenanceRecord.

Accepted rule:

```text
Any active TI not done -> SR IN_PROGRESS
All active TI done -> SR COMPLETED
Delivered/pickup remains delivery/commercial layer
Canceled remains terminal
```

Sprint 60 must not add a second SR workflow unless a later product decision
explicitly says SR needs independent operational routing.

## Workflow Layers

Sprint 60 must define the layers explicitly:

```text
Service Operation Space
  scope/context only; no workflow engine

Service Operation Workspace
  Blueprint-created work surface inside the Space

Technical Bench Item Workflow
  owns the stage movement of each TechnicalIssue inside that space
```

Space lifecycle phrases such as intake, active bench, approval, payment,
handover, rollover, and closed may appear as UI filters or operational labels
later. They must not be modeled as Workflow Runtime states in Sprint 60.

## Technical Bench Item Workflow

Workflow key:

```text
service-operation-technical-bench
```

Workflow title:

```text
Service Operation Technical Bench
```

This workflow wraps TechnicalIssue operation stages. It does not replace
TechnicalIssue execution status and it is not the Service Operation Space
workflow.

States:

```text
INSPECT
READY
IN_PROGRESS
DONE
```

Initial state:

```text
INSPECT
```

Terminal states:

```text
DONE
```

Manual transitions:

```text
INSPECT -> READY       confirm-issue
READY -> IN_PROGRESS   start-work
IN_PROGRESS -> DONE    mark-done
READY -> INSPECT       send-back-to-inspect
IN_PROGRESS -> READY   pause-or-return
DONE -> IN_PROGRESS    reopen-work
```

Event transitions to define as contract only:

```text
technical_issue.created          -> INSPECT
technical_issue.confirmed        -> READY
technical_issue.started          -> IN_PROGRESS
technical_issue.completed        -> DONE
technical_issue.reopened         -> IN_PROGRESS
```

Sprint 60 may register these event transitions in the workflow definition only
if validation passes and the runtime can safely ignore missing event producers.
Otherwise keep them as documented contract notes and implement emitters in
Sprint 61.

## Event Binding Contract

Candidate Blueprint event bindings:

```text
service_request.created
service_request.status_changed
technical_issue.created
technical_issue.confirmed
technical_issue.started
technical_issue.stage_changed
technical_issue.completed
technical_issue.reopened
payment.created
payment.status_updated
```

Recommended Sprint 60 implementation:

- register Service Operation binding contract notes in
  `src/domains/blueprint/shared/event-bindings.ts`;
- target type should be `SERVICE_REQUEST` or `TECHNICAL_ISSUE`;
- consumer should stay `coordination`;
- effects should remain `AUTO_BIND`, `APPLY_WORKFLOW`, `WRITE_ACTIVITY`;
- scope should remain `CURRENT_ACTIVE_WEEKLY_SPACE`;
- status must be `DRAFT` unless runtime emitters/consumers are wired in the
  same sprint.

Do not make Service call Workspace/Timeline/Notification directly.

## Files To Review Before Implementation

- `src/domains/task/server/work-type.registry.ts`
- `src/domains/workflow-definition/server/workflow-definition.registry.ts`
- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/blueprint/shared/workspace-provisioning.ts`
- `src/domains/blueprint/server/blueprint-library.service.ts`
- `src/domains/task/server/workspace-workflow-processor.ts`
- `src/domains/service/server/operation/service-operation-read.service.ts`
- `src/domains/service/server/shared/service-request-status.policy.ts`
- `src/domains/service/server/shared/technical-issue-stage.policy.ts`

## Proposed Implementation Slice

### Add / Change

- Add a `service-operation` work type in
  `src/domains/task/server/work-type.registry.ts`.
- Add `SERVICE_OPERATION_TECHNICAL_BENCH_WORKFLOW` in
  `src/domains/workflow-definition/server/workflow-definition.registry.ts`.
- Add Service Operation event-binding contract in
  `src/domains/blueprint/shared/event-bindings.ts`.
- Ensure Blueprint library lists the new registry Blueprint with valid workflow
  validation.
- Keep Sprint 59 read facade unchanged.

### Avoid

- No Service schema migration.
- No ProjectionRecord implementation.
- No UI production route wiring.
- No Space workflow.
- No SR workflow.
- No Payment Space build.
- No MaintenanceRecord expansion.
- No BusinessEvent producer implementation unless the event API is already
  obviously reusable and the change stays tiny.

## Validation Plan

Targeted validation:

```bash
cmd /c npx eslint src/domains/task/server/work-type.registry.ts src/domains/workflow-definition/server/workflow-definition.registry.ts src/domains/blueprint/shared/event-bindings.ts --max-warnings=0
```

Optional scoped TypeScript check:

```bash
cmd /c npx tsc --project tsconfig.sprint60.tmp.json --pretty false
```

If whole-repo `tsc --noEmit` is attempted, record unrelated checkout errors
instead of treating them as Sprint 60 failures.

## Implementation Result

Implemented files:

- `src/domains/task/server/work-type.registry.ts`
  - added `service-operation` work type under `TECHNICAL`;
  - bound it to `service-operation-technical-bench`;
  - stored Service Operation surfaces and Service-specific capability notes in
    metadata.
- `src/domains/workflow-definition/server/workflow-definition.registry.ts`
  - added `SERVICE_OPERATION_TECHNICAL_BENCH_WORKFLOW`;
  - states are `INSPECT`, `READY`, `IN_PROGRESS`, `DONE`;
  - manual transitions cover confirm, start, complete, return, pause, reopen;
  - event transitions are present as contract metadata only.
- `src/domains/blueprint/shared/event-bindings.ts`
  - added Service Operation binding contract;
  - bindings target `SERVICE_REQUEST` or `TECHNICAL_ISSUE`;
  - bindings remain `DRAFT`;
  - effects stay `AUTO_BIND`, `APPLY_WORKFLOW`, `WRITE_ACTIVITY`.
- `src/domains/blueprint/server/blueprint-library.service.ts`
  - added Service Operation experience seed;
  - Blueprint preview item label is `Technical Issues`.

Validation performed:

```bash
cmd /c npx eslint src/domains/task/server/work-type.registry.ts src/domains/workflow-definition/server/workflow-definition.registry.ts src/domains/blueprint/shared/event-bindings.ts src/domains/blueprint/server/blueprint-library.service.ts --max-warnings=0
```

Result: pass.

Scoped TypeScript check was attempted with a temporary `tsconfig.sprint60.tmp.json`.
It was blocked by existing type errors pulled through imported server modules,
including coordination event consumer, event dispatcher metadata, timeline
renderer, business binding service, workspace workflow processor, watch media
work, watch review repo, and workflow-definition draft service. The temporary
config was removed after the check.

No schema migration, production UI wiring, ProjectionRecord implementation,
Space workflow, SR workflow, Payment workspace, or MaintenanceRecord expansion
was added.

## Rollback Plan

- Remove the `service-operation` work type.
- Remove the `service-operation-technical-bench` workflow definition.
- Remove Service Operation event-binding entries.
- No data migration or schema rollback should be needed.
- Existing Service admin screens and Sprint 59 read facade remain usable.

## Acceptance Criteria

Sprint 60 passes when:

- Blueprint library can expose a Service Operation registry Blueprint.
- The Blueprint has a valid Workflow capability.
- The doc explicitly states that Space has no workflow engine.
- The Service Operation Workspace Blueprint uses item workflow, not Space
  workflow.
- SR Case is explicitly documented as a read/collaboration surface with no
  workflow runtime in Sprint 60.
- The TI workflow has `INSPECT`, `READY`, `IN_PROGRESS`, and `DONE` states.
- Service Operation event-binding contract exists as `DRAFT` or documented notes
  without forcing runtime event wiring.
- The sprint doc clearly defers UI/projection/event-consumer wiring to Sprint
  61.

## Stop And Discuss

Stop before implementation if any of these become necessary:

- modeling Space with workflow runtime;
- adding SR workflow runtime;
- changing `ServiceRequest.status` semantics;
- changing `TechnicalIssue.executionStatus` enum;
- adding Service `spaceId` / `workspaceId`;
- making TechnicalIssue independent from ServiceRequest;
- moving Payment lifecycle into Service;
- storing Service-specific capability booleans in schema;
- making MaintenanceRecord the Activity source.

## Sprint 61 Preview

Sprint 61 should wire the prototype/UI and runtime surfaces:

- SR Cases view -> `listServiceOperationSrCases`;
- Technical Bench view -> `listServiceOperationTiStageItems`;
- Dashboard counters -> `getServiceOperationCounters`;
- event emitters/consumers -> Activity/Timeline;
- decide whether the read facade remains source-query backed or moves to
  ProjectionRecord.
