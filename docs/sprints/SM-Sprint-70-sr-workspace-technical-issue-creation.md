# Sprint 70 - SR Workspace TechnicalIssue Creation

## Goal

Complete the first usable SR workspace operation slice.

The Watch List entry creates or opens an SR workspace only. TechnicalIssue
creation belongs inside that SR workspace, because the SR workspace is the case
container and TechnicalIssue rows are the operation items inside that case.

## Implemented

- SR workspace detail now resolves its bound `SERVICE_REQUEST` from workspace
  note or business binding.
- The `Technical Issue Operation` item tab shows a compact `Tao TI` action when
  the workspace is a Service Operation workspace bound to a ServiceRequest.
- `Tao TI` opens a compact modal with:
  - summary;
  - area;
  - owner hint (`INTERNAL` or `VENDOR`);
  - note.
- The modal posts to the existing `POST /api/admin/technical-issues` endpoint.
- The endpoint uses the existing Service domain `createTechnicalIssue` command,
  which records `technical_issue.created`.
- After creation, the workspace refreshes and the SR workspace item list is
  hydrated from TechnicalIssues belonging to that ServiceRequest.

## Runtime Contract

```text
Watch List
-> watch_intake
-> ServiceRequest exists
-> service_request.created
-> Coordination consumer creates/reuses SR workspace
-> user opens SR workspace
-> Tao TI modal
-> createTechnicalIssue
-> technical_issue.created
-> Coordination consumer binds/moves TI to Inspect workspace
-> SR workspace Items shows TI rows for that SR
```

The SR itself is workspace identity, not an item row.

## Corrected Mistake

An earlier implementation briefly allowed the SR workspace item list to render
the bound ServiceRequest as an item. That was wrong.

Correct behavior:

- SR workspace detail shows TechnicalIssue items for that SR.
- The `SERVICE_REQUEST` binding identifies the workspace/case.
- Technical Bench / Inspect / Processing / Done workspaces show TechnicalIssue
  operation items.
- Space Management remains an index/read surface; it is not where TI is created
  for a specific SR case.

## Boundaries

- No Service `spaceId` or `workspaceId`.
- No workspace capacity creation from UI/read code.
- No Technical Bench board inside workspace detail.
- No direct TI creation from Watch List.
- No ProjectionRecord Service Operation read source yet.

## Validation

```text
cmd /c npx eslint src/domains/task/client/TaskItemDetailClient.tsx src/domains/task/ui/task-work/QueueWorkQueue.tsx src/domains/task/server/core/task-item-detail.repo.ts
```

Result: no errors. Existing `<img>` warnings remain in shared preview UI.

The tested SR workspace route returned HTTP 200:

```text
/admin/task-items/4552c66a-8b97-46ff-a393-ad26998773ab
```

## Next

- Add Inspect workspace classification actions:
  - classify area/type;
  - choose internal/vendor route;
  - mark no-issue and move directly to Done;
  - send to Processing.
- Add Processing workspace actions for Ready -> In Progress -> Done using
  Service domain commands before workspace workflow transitions.
