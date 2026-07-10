# Sprint 71 - Operational Blueprint Core

Status: closed.

## Goal

Stop patching Service Operation one surface at a time and upgrade Blueprint so
it can describe a complete Space/Workspace business operation model.

This sprint treats Service Operation as the first reference operational
Blueprint.

The upgrade roadmap is tracked in:

- `docs/sprints/SM-Operational-Blueprint-roadmap.md`

## Architecture Decision

Blueprint now has an operational contract layer in addition to:

- workspace definition;
- workflow capability;
- provisioning policy;
- event bindings.

The operational contract describes:

- business object roles;
- workspace roles and cardinality;
- event routes;
- workspace actions;
- action form fields;
- domain command adapters;
- expected emitted events;
- workflow ownership by workspace role;
- projection subscriptions.

Business domains still own truth. Blueprint owns how that truth is operated
inside Space/Workspace.

## First Implementation Slice

Added:

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `OperationalBlueprintContract` and related types.
- Service Operation contract version 2.
- Service Operation core flow:
  `SR_CASE -> INSPECT -> PROCESSING -> DONE`.
- Blueprint library wiring so registry Blueprints can expose `operation`.
- Workspace snapshot note now includes the selected operation contract.
- Coordination dashboard DTO exposes `operation`.
- Coordination Workspace UI shows operation model summary, roles, actions,
  event routes, and projection subscriptions when creating a Workspace.

## Runtime Resolution Slice

Added:

- Contract helpers to resolve an event route and validate workspace roles from
  an Operational Blueprint.
- Coordination consumer now resolves Service Operation TechnicalIssue
  workspace roles from the operation contract event routes:
  - `technical_issue.created` -> `INSPECT`;
  - `technical_issue.confirmed` -> `PROCESSING`;
  - `technical_issue.started` -> `PROCESSING`;
  - `technical_issue.completed` -> `DONE`.
- Legacy workspace receiver markers remain supported, but the target role is
  no longer invented from local consumer stage rules.

## Service Operation Contract V2

Workspace roles:

- `SR_CASE`
- `INSPECT`
- `PROCESSING`
- `DONE` (`Done/Follow-up` label)

Main events:

- `service_request.created`
- `technical_issue.created`
- `technical_issue.confirmed`
- `technical_issue.started`
- `technical_issue.completed`
- `payment.created`

Main actions:

- `watch_intake_with_suspicion`
- `create_technical_issue`
- `classify_technical_issue`
- `start_processing`
- `complete_processing`
- `raise_follow_up_issue`

Projection subscription:

- `watch-list` must listen to Service Operation events because Watch List shows
  service state.

## Next Implementation Slices

Continue in:

- `docs/sprints/SM-Sprint-72-workspace-action-contract-runtime.md`

## Verification

- Passed scoped ESLint:
  `cmd /c npx eslint src/domains/blueprint/shared/operational-blueprint.ts src/domains/blueprint/server/index.ts src/domains/coordination/server/coordination-event-consumer.ts --max-warnings=0`
- Targeted TypeScript check was attempted with a temporary tsconfig, but this
  checkout still pulls existing type debt from the coordination/task/watch
  import graph. No new Sprint 71 lint issues remain in the edited files.

## Guardrails

- Do not move SR/TI/Payment truth into Blueprint.
- Do not add Service `spaceId` or `workspaceId`.
- Do not create workspace capacity from UI/read paths.
- Do not let consumer behavior drift away from the operation contract.
- Existing Workspace snapshots remain independent; changing the Blueprint does
  not mutate old Workspaces.

## Close Notes

Sprint 71 is complete as the Operational Blueprint core foundation. It does not
claim to finish the full Service Operation flow.

The closing acceptance is:

- Blueprint can describe Service Operation's operation model without moving
  SR/TI/Payment truth into Blueprint.
- Runtime now reads an important routing behavior from the operation contract:
  TechnicalIssue event routes resolve to operation workspace roles from
  `OperationalBlueprint.eventRoutes`.
- The next needed runtime gap is Workspace shell discovery/rendering from
  `OperationalBlueprint.coreFlows` and `OperationalBlueprint.actions`, tracked
  as Sprint 72.
