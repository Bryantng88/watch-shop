# SM Sprint 59 - Service Operation Read Facade and Boundary Cleanup

## Status

Implemented.

Sprint 59 implements the first Service Operation boundary over existing
ServiceRequest and TechnicalIssue truth. It does not redesign SR/TI, does not
add Service `spaceId` / `workspaceId`, and does not add a schema migration.

## Sprint Planning Rules

Use these rules for every Service Operation sprint after Sprint 59:

- Stay inside the accepted sprint scope. Do not expand into adjacent platform,
  payment, projection, activity, or UI work unless the sprint explicitly names
  that work.
- Make concrete, executable proposals. A proposal must name the target files,
  runtime boundary, expected behavior, validation, and rollback path.
- Act with senior-dev judgment: preserve domain ownership, avoid schema changes
  unless required, keep compatibility for existing screens, and prefer small
  adapters over rewrites.
- Treat SR/TI as Service business truth. Treat Space/Workspace as operational
  wrapper, Workflow as routing/state, Event as bridge, Activity as log, and
  Projection/read facade as read surface.
- Stop and discuss before changing a core assumption, especially SR/TI
  cardinality, required TechnicalAssessment coupling, direct Service-to-Space
  references, Payment ownership, MaintenanceRecord role, or Blueprint snapshot
  semantics.
- Each sprint doc must include explicit non-goals and "stop and discuss"
  bullets so another machine can continue without reopening old decisions.

## Product Decision Carried Forward

Service Operation is modeled as:

```text
Service domain
  SR / TI = business truth

Space / Workspace
  operational wrapper around SR / TI

Workflow
  flexible operational routing/state over wrapped SR / TI items

Event / Activity / Projection
  downstream collaboration and read surfaces
```

Activity/Timeline is the shared operational log. MaintenanceRecord must not be
expanded into a second WP/Space activity system.

SR technical workflow is derived mainly from TI state:

- active TI not all done -> SR `IN_PROGRESS`;
- all active TI done -> SR `COMPLETED`;
- payment, pickup, and delivery attention are separate operational/commercial
  states and do not keep SR technical workflow in progress;
- canceled or delivered SR remains terminal and is not revived by TI sync.

## Implemented

### 1. Service Operation read facade

Added:

- `src/domains/service/server/operation/service-operation.types.ts`
- `src/domains/service/server/operation/service-operation-read.service.ts`
- `src/domains/service/server/operation/index.ts`

Exported through:

- `src/domains/service/server/index.ts`

The new facade provides projection-ready contracts for:

- SR case rows;
- TI stage items;
- Service Operation counters.

It reads from current SR/TI/Payment truth and returns explicit Service
Operation fields such as attention, technical progress, commercial totals,
creator, owner kind, and operation stage.

### 2. SR status derivation policy

Added:

- `src/domains/service/server/shared/service-request-status.policy.ts`

Exported through:

- `src/domains/service/server/shared/service-request.rules.ts`

The policy centralizes SR status derivation from active TI state and fixes the
old invalid `DONE` write risk. `ServiceRequestStatus` has `COMPLETED`, not
`DONE`.

### 3. TI stage mapping policy

Added:

- `src/domains/service/server/shared/technical-issue-stage.policy.ts`

The policy maps existing TI execution status into the Service Operation stages:

```text
OPEN and not confirmed -> INSPECT
OPEN and confirmed / CONFIRMED -> READY
IN_PROGRESS -> IN_PROGRESS
DONE / COMPLETED -> DONE
```

The existing issue board can keep its legacy columns while the new Space UI
reads the operation-stage contract.

### 4. Existing issue board compatibility cleanup

Changed:

- `src/domains/service/server/issue-board/service-issue-board.service.ts`

The existing board now reuses the shared SR status and TI stage policies. The
old `serviceRequestReadyToClose` value is preserved for compatibility, and a
new `serviceRequestCompleted` flag is exposed for the clearer domain meaning.

Also fixed the maintenance approval casing bug risk by reading
`maintenanceRecord`, not `MaintenanceRecord`.

### 5. Payment boundary cleanup

Changed:

- `src/domains/payment/server/payment.core.ts`
- `src/domains/payment/server/service-issue-payment.service.ts`
- `src/domains/service/application/create-maintenance-record.application.ts`

Maintenance-cost payment creation now goes through the Payment server boundary
instead of a local Service-side `tx.payment.create` helper.

This keeps Payment ownership in the Payment domain while maintaining the legacy
MaintenanceRecord compatibility path.

## Explicit Non-Goals

Sprint 59 did not:

- add `spaceId` / `workspaceId` to Service rows;
- make `TechnicalIssue.assessmentId` nullable;
- change SR/TI enum values;
- replace existing admin Service screens;
- wire full Service event consumers;
- make MaintenanceRecord the operational log;
- build Payment Space or Payment workflow.

## Validation

Passed:

```bash
cmd /c npx eslint src/domains/service/server/operation src/domains/service/server/shared/service-request-status.policy.ts src/domains/service/server/shared/technical-issue-stage.policy.ts --max-warnings=0
cmd /c npx tsc --project tsconfig.sprint59.tmp.json --pretty false
```

The scoped TypeScript check used a temporary include-only config for the Sprint
59 facade/policy files and was removed after validation.

Whole-repo TypeScript check was attempted:

```bash
cmd /c npx tsc --noEmit --pretty false
```

It failed on pre-existing syntax errors outside this sprint, including:

- `component for chatGPT/old src/src/features/products/server/draft.ts`
- `component for chatGPT/old src/src/note.ts`
- `component for chatGPT/src/features/products/server/draft.ts`
- `component for chatGPT/src/note.ts`
- `src/note.ts`

No Sprint 59 file appeared in that failure output.

## Known Follow-Ups

Recommended Sprint 60:

- define the Service Operation Blueprint registry contract;
- define the Technical Bench workflow contract:
  `INSPECT -> READY -> IN_PROGRESS -> DONE`;
- define Service Operation event-binding contract as Blueprint metadata;
- keep UI/projection/event-consumer wiring for Sprint 61 after the Blueprint/WF
  contract is accepted.

Stop and discuss before:

- allowing multiple active SRs for one watch/product;
- allowing TI without SR;
- changing the required TechnicalAssessment coupling;
- storing direct Service row links to Space/Workspace;
- moving Payment lifecycle ownership into Service;
- expanding MaintenanceRecord as a WP/Space log.
