# SM Sprint 62 - Service Operation Action Adapter and Event Key Alignment

## Status

Implemented first slice.

Sprint 62 connects the Service Operation Technical Bench manual workflow actions
to the existing Service domain commands and registers the Service/Payment event
keys needed before Service Operation event bindings can be safely activated.

This sprint intentionally keeps Service Operation event bindings as `DRAFT`.

## Scope Rules

Do:

- map Technical Bench manual workflow actions to existing TechnicalIssue
  commands;
- keep ServiceRequest and TechnicalIssue as Service business truth;
- emit lightweight Service/Payment business events after domain writes;
- align Payment event binding target type with the event catalog;
- keep ProjectionRecord-backed Service Operation reads deferred.

Do not:

- add Service `spaceId` or `workspaceId`;
- add an SR workflow engine;
- make MaintenanceRecord the Activity source;
- activate Service Operation event bindings in this slice;
- build a Payment Workspace;
- make ProjectionRecord the Service Operation read source.

## Implemented

### 1. Service Operation action adapter

Added:

- `src/domains/service/server/operation/service-operation-action-adapter.ts`

Changed:

- `src/domains/service/server/operation/index.ts`
- `src/domains/service/server/operation/service-operation.types.ts`
- `src/domains/service/server/operation/service-operation-read.service.ts`
- `src/app/(admin)/admin/services/operation/page.tsx`
- `src/domains/task/server/business-binding-workflow.service.ts`
- `src/domains/task/server/workspace-workflow-processor.ts`
- `src/domains/task/actions/task.actions.ts`

Manual action mapping:

```text
confirm-issue -> confirmTechnicalIssue
start-work    -> startTechnicalIssue
mark-done     -> completeTechnicalIssue
```

The adapter runs only for:

```text
workflowKey = service-operation-technical-bench
targetType  = TECHNICAL_ISSUE
```

It stays thin and calls existing Service commands. It does not write Service
truth directly and does not introduce a Service Operation-specific state model.

Correction after UI review: Service Operation must open as a real workspace
shell, like Media. The Technical Bench board is a workspace view/option, not a
replacement for the workspace container:

```text
/admin/coordination/technical
-> ensure/resolve current Technical weekly space
-> open Service Operation TaskItem workspace
-> render Technical Bench / SR Cases inside the workspace shell
```

TechnicalIssue remains the flow unit inside that workspace. A TI card may link
to the issue detail/issue board, but it is not itself a workspace.

Correction after Service workspace review:

- The Space Management Service Operation surface keeps the two external modes:
  `SR Cases` and `TI list`/Technical Bench.
- Service workspace detail is hybrid by context. An SR workspace should show the
  TI items for that SR. A TI workspace should show TI operation items with stage
  and workflow actions.
- `Technical Bench` is a separate Space Management view, not a tab rendered
  inside a workspace.
- `SR Cases` is also a Space Management mode, not a tab rendered inside a
  workspace.

### 2. Event catalog alignment

Changed:

- `src/domains/event/catalog/legacy-business-events.catalog.ts`

Registered event keys:

```text
service_request.created
service_request.status_changed
technical_issue.created
technical_issue.confirmed
technical_issue.started
technical_issue.completed
technical_issue.reopened
payment.created
payment.status_updated
```

Legacy keys remain available:

```text
service_request.completed
technical_issue.done
payment.paid
```

New Service/Payment keys currently list `timeline` as the known consumer. This
keeps coordination/workflow activation explicit for a later pass instead of
accidentally turning draft Blueprint bindings into runtime behavior.

### 3. Event producers

Changed:

- `src/domains/service/server/issue-board/service-issue-board.service.ts`
- `src/domains/payment/server/payment.core.ts`

Service now emits after these TechnicalIssue milestones:

```text
technical_issue.created
technical_issue.confirmed
technical_issue.started
technical_issue.completed
```

Payment now emits:

```text
payment.created
payment.status_updated
```

Payment events use `PAYMENT` as target type. Owner context is included in the
payload.

### 4. Payment binding target alignment

Changed:

- `src/domains/blueprint/shared/event-bindings.ts`

Service Operation draft bindings now target Payment events as:

```text
payment.created        targetType PAYMENT
payment.status_updated targetType PAYMENT
```

This matches the event catalog and producer target.

## Known Limitations

The existing manual workflow path applies the workflow runtime transition before
the workspace workflow processor runs domain effects. If a Service command fails
after the workflow transition, the processor returns a failed
`service-operation-action` effect, but this slice does not roll back the
workflow runtime state.

Practical implication:

- `mark-done` requires the TechnicalIssue to already have a valid `actualCost`
  and technical detail, because `completeTechnicalIssue` enforces those Service
  rules.

Recommended follow-up:

- add a preflight/domain-action-before-transition path for Service Operation
  manual actions, or add a workflow rollback helper for failed processor
  effects.

## Validation

Passed:

```bash
cmd /c npx eslint src/domains/service/server/operation/service-operation-action-adapter.ts src/domains/task/server/workspace-workflow-processor.ts src/domains/task/server/business-binding-workflow.service.ts src/domains/task/actions/task.actions.ts src/domains/event/catalog/legacy-business-events.catalog.ts src/domains/blueprint/shared/event-bindings.ts --max-warnings=0
cmd /c npx eslint "src/app/(admin)/admin/services/operation/page.tsx" src/domains/service/server/operation/service-operation.types.ts src/domains/service/server/operation/service-operation-read.service.ts --max-warnings=0
```

Attempted:

```bash
cmd /c npx eslint src/domains/service/server/operation/service-operation-action-adapter.ts src/domains/task/server/workspace-workflow-processor.ts src/domains/task/server/business-binding-workflow.service.ts src/domains/task/actions/task.actions.ts src/domains/event/catalog/legacy-business-events.catalog.ts src/domains/blueprint/shared/event-bindings.ts src/domains/payment/server/payment.core.ts src/domains/service/server/issue-board/service-issue-board.service.ts --max-warnings=0
cmd /c npx tsc --project tsconfig.sprint62.tmp.json --pretty false
```

The broader lint includes pre-existing `no-explicit-any` debt in
`payment.core.ts` and `service-issue-board.service.ts`.

The scoped TypeScript check is still blocked by existing imported-module errors
outside this sprint path, including coordination event consumer, task core repos,
watch media work, watch review, timeline renderer, and workflow-definition draft
service. It also surfaces pre-existing type debt inside `payment.core.ts`.

## Acceptance

Sprint 62 first slice passes because:

- Technical Bench workflow actions now have a Service command adapter;
- action mapping uses existing Service domain commands;
- Service/Payment event keys are registered in the catalog;
- Service/Payment producers emit the aligned keys after domain writes;
- Payment event targets are aligned to `PAYMENT`;
- Service Operation bindings remain `DRAFT`;
- no schema migration or ProjectionRecord Service Operation read model was
  introduced.

## Recommended Sprint 63

Harden Service Operation workflow/domain consistency:

- add preflight for Service Operation manual actions before workflow state
  transition, or rollback workflow runtime when processor effects fail;
- decide whether Service Operation event keys can allow `coordination` and
  `workflow` consumers;
- only then consider switching selected Service Operation bindings from `DRAFT`
  to `ACTIVE`;
- add smoke tests around `confirm-issue`, `start-work`, and `mark-done`.

Stop and discuss before:

- making Service Operation event bindings active;
- adding Service row links to Space/Workspace;
- introducing SR workflow runtime;
- moving Payment lifecycle ownership into Service;
- expanding MaintenanceRecord into Activity;
- starting ProjectionRecord reads for Service Operation.
