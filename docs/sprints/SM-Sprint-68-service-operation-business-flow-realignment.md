# Sprint 68 - Service Operation Business Flow Realignment

## Decision

Service Operation remains workspace-first and event-driven.

The corrected flow is:

```text
Watch List action
-> service_request.created
-> one SR workspace
-> user creates TechnicalIssue inside SR workspace
-> technical_issue.created
-> Inspect workspace item
-> Processing workspace workflow
-> Done / Follow-up workspace
```

ServiceRequest and TechnicalIssue remain Service business truth. Space and
workspace surfaces hydrate from that truth, but workspace capacity and bindings
must come from Blueprint/event-consumer routes.

## Workspace Model

`SR Cases` view:

- one row equals one SR workspace;
- each row keeps the current operational columns: SR, watch, creator,
  attention, workspace items, commercial, and updated time;
- the row opens the SR workspace detail;
- the SR workspace detail is where TI items for that SR are created/managed.

`Technical Bench` view:

- indexes technical operation workspaces;
- does not directly render raw Service domain rows as replacement workspace
  detail;
- does not live inside workspace item tabs.

Technical operation workspaces:

- `INSPECT`: triage/classification/vendor routing.
- `PROCESSING`: owns the internal workflow `Ready -> In Progress -> Done`.
- `DONE`: follow-up, send-back, and payment readiness.

TechnicalIssue event routing:

- `INSPECT` stage -> Inspect workspace.
- `READY` or `IN_PROGRESS` stage -> Processing workspace.
- `DONE` stage -> Done / Follow-up workspace.

## Implemented

- Replaced the Sprint 67 four-stage technical workspace model with three
  operation workspace roles.
- Coordination cycle provisioning now ensures:
  - `Service Operation - Inspect`;
  - `Service Operation - Processing`;
  - `Service Operation - Done / Follow-up`.
- TechnicalIssue coordination routing now resolves a workspace role instead of
  a receiver stage:
  - `serviceOperationWorkspaceRole: INSPECT|PROCESSING|DONE`.
- Service Operation read facade exposes `listServiceOperationTechnicalWorkspaces`.
- Space Management `Technical Bench` renders three workspace columns/cards and
  groups TI items by their current Service stage.
- Smoke diagnostics now report `workspaceRole`.
- Current and retrospective docs record the earlier over-modeling mistake.

## Guardrails

- Do not create workspace capacity from UI/read paths.
- Do not put `SR Cases` or `Technical Bench` inside a workspace detail tab.
- Do not model `Ready` and `In Progress` as separate workspace capacity unless
  the business flow is explicitly changed again.
- Do not add `workspaceId` or `spaceId` to Service tables.
- Do not bypass Business Event -> Dispatcher -> Consumer -> Workspace binding.

## Next Work

- Wire controlled `service_request.created` producers from Watch List / SR
  creation entry points.
- Add the Watch List "create technical service case" action with existing-active
  workspace detection.
- Build SR workspace detail so creating a TI emits the expected TechnicalIssue
  event and lands in Inspect.
- Build Processing workspace actions around Ready/In Progress/Done with domain
  preflight before workflow runtime writes.
