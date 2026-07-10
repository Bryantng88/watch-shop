# Sprint 67 - Service Operation Workspace Cardinality

## Superseded By Sprint 68

This sprint captured an important correction toward workspace-first Service
Operation, but its four-technical-stage-workspace model was later rejected.
Sprint 68 replaces it with three technical operation workspaces:

- `Service Operation - Inspect`
- `Service Operation - Processing`
- `Service Operation - Done / Follow-up`

`Ready`, `In Progress`, and `Done` remain TechnicalIssue workflow states inside
the Processing/operation flow, not separate workspace capacity by themselves.

## Decision

Service Operation is workspace-first.

- `SR Cases` indexes SR workspaces. Each SR workspace represents one
  ServiceRequest case and is hydrated with SR/watch/creator/attention/progress/
  commercial columns for the Space Management row.
- `Technical Bench` indexes four technical stage workspaces:
  - `Service Operation - Inspect`
  - `Service Operation - Ready`
  - `Service Operation - In Progress`
  - `Service Operation - Done`
- TechnicalIssue bindings move between those stage workspaces as the Service
  truth changes stage.

Business domain remains truth. Space Management must not create workspace
capacity from read/UI code.

## Implemented

- Activated `service_request.created` for coordination binding.
- Added a coordination route for `service_request.created`.
- Added SR workspace intake in the coordination consumer:
  `service_request.created` creates or reuses one TaskItem workspace for that
  SR, then binds the SR to that workspace.
- Added technical stage receiver markers:
  `serviceOperationReceiverStage: INSPECT|READY|IN_PROGRESS|DONE`.
- Updated technical event receiver resolution so TechnicalIssue events route to
  the stage workspace matching current Service truth.
- Updated coordination cycle provisioning to create the four Service Operation
  stage workspaces for the Technical cycle.
- Added legacy binding adoption/move:
  if a TechnicalIssue already has a binding in the old receiver, the next
  Service Operation event moves that binding into the correct stage workspace
  instead of creating a duplicate.
- Updated the Service Operation Space UI:
  `Technical Bench` headers now open the stage workspace itself; item-level
  `Open workspace` still opens the bound workspace for the item.
- Extended the smoke script with `--sr` / `--service-request` support.

## Smoke

Commands:

```bash
cmd /c npx eslint src/domains/coordination/server/coordination-event-consumer.ts src/domains/coordination/server/coordination-cycle.service.ts src/domains/coordination/server/coordination-router.registry.ts
cmd /c npx eslint src/domains/blueprint/shared/event-bindings.ts src/domains/event/catalog/legacy-business-events.catalog.ts scripts/smoke-service-operation-consumer.ts
cmd /c npx eslint "src/app/(admin)/admin/services/operation/page.tsx" src/domains/service/server/operation/service-operation-read.service.ts src/domains/service/server/operation/service-operation.types.ts
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --receivers
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --event service_request.created --sr
```

Observed:

- Technical cycle now has stage receiver workspaces for Inspect, Ready, In
  Progress, and Done.
- Current sample TechnicalIssue resolves to Inspect because current Service
  truth is still OPEN/unconfirmed.
- Legacy binding `d2a85489-3756-4a98-ac1a-7cad2c0f17b9` is detected and would
  be adopted/moved instead of duplicated.
- Sample SR `9ee1770c-045a-489a-a3bc-4c51c91cb648` resolves to SR workspace
  `a9431f33-0f03-4d8f-b209-f9fc273850e2`.

## Correction During Sprint

An intermediate patch accidentally placed SR workspace creation in the diagnostic
path. A dry-run SR smoke created the sample SR workspace above. The branch was
corrected immediately:

- `consumeBusinessEventForCoordination` may create/reuse SR workspace.
- `diagnoseBusinessEventForCoordination` only reads existing SR workspace
  binding.

The created SR workspace matches the desired runtime contract, so no destructive
rollback was performed.

## Remaining Work

- Add controlled ServiceRequest event producers for all SR creation entry
  points. The consumer route is ready, but not every SR creation path emits
  `service_request.created` yet.
- Design SR workspace detail so it shows TechnicalIssue items belonging to that
  SR, not a generic SR queue row.
- Add explicit apply smoke for SR creation with a disposable SR fixture, if a
  safe fixture path is available.
