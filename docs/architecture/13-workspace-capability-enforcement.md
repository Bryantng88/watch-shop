# Workspace Capability Enforcement V1

Sprint 36 makes Workspace UI obey the Blueprint snapshot captured at creation.

## Goal

If a Blueprint disables a capability, the created Workspace should stop exposing
that capability in the user interface.

## Capability Resolver

`resolveWorkspaceCapabilities` lives in:

- `src/domains/blueprint/shared/workspace-capabilities.ts`

It reads capabilities from `blueprintSnapshot` stored on the Workspace note.
Existing Workspaces without a snapshot receive backward-compatible defaults.

## Enforced In V1

- `items=false`
  - Hide the Items tab.
  - Hide Items summary.
  - Hide manual item intake surface.
- `workflow=false`
  - Hide Workflow tab.
  - Hide Workflow column.
  - Hide manual workflow action controls inside Items.
- `activity=false`
  - Hide Activity tab and activity summary surfaces.
- `discussion=false`
  - Hide discussion composer/add discussion controls.
- `checklist=false`
  - Hide Checklist tab and checklist summary.
- `priority=false`
  - Hide priority badge and priority summary.
- `dueDate=false`
  - Hide due date header metric.
- `assignee=false`
  - Hide owner/assignee header and summary surfaces.
- `attachments=false`
  - Hide Attachments tab.

Dependency:

- Workflow requires Items.
- If `items=false`, normalized capabilities force `workflow=false`.
- In Blueprint authoring, Item Workflow is disabled until Items is enabled.

## Snapshot Source

Workspace reads from its applied snapshot only. It does not read live Blueprint
registry or draft values after creation.

## Not Implemented

- Server-side permission enforcement.
- Capability inheritance.
- Automation.
- Notification changes.
- Workspace lifecycle.
- Blueprint publish, versioning, or rollback.
- Prisma schema changes.

## Boundary

Unchanged:

- Business Domain.
- BusinessEvent emit logic.
- Router behavior.
- Workflow Runtime.
- Item Runtime.
