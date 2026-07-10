# Sprint 69 - Watch List Service Operation Intake

## Goal

Create the correct Service Operation entry point from Watch List.

The action must create or open an SR workspace. It must not create a
TechnicalIssue directly.

## Implemented

- Added `getOrCreateServiceOperationWorkspaceForWatch`.
- Added `POST /api/admin/service-operation` action `watch_intake`.
- Watch List row action now calls Service Operation intake instead of opening
  the quick-service modal.
- If a watch already has an active SR workspace, the UI asks before opening the
  existing workspace.
- If a watch has an active SR without workspace binding, the endpoint emits
  `service_request.created` so the coordination consumer can bind/create the SR
  workspace.
- If a watch has no active SR, the endpoint creates a ServiceRequest, emits
  `service_request.created`, then returns the created SR workspace URL.

## Runtime Contract

```text
Watch List
-> watch_intake command
-> ServiceRequest exists
-> service_request.created event
-> Coordination consumer
-> SR workspace TaskItem
-> open /admin/task-items/:id
```

This keeps Service Operation aligned with the event-driven direction:

```text
Business command -> Business Event -> Dispatcher -> Consumer -> Workspace
```

## Still Deferred

- SR workspace detail creating TechnicalIssue items. Implemented in
  `SM-Sprint-70-sr-workspace-technical-issue-creation.md`.
- `technical_issue.created` producer from the SR workspace detail action.
  Implemented in Sprint 70 through the existing `createTechnicalIssue` command.
- Inspect workspace actions for classification/routing.
- Processing workspace workflow actions.
