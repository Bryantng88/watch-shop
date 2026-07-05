# SM M1: Blueprint Completion Handoff

Date: 2026-07-03

Status: PASS

## Milestone Result

Blueprint Milestone M1 is closed.

Blueprint is now the source of truth for how a Workspace is created, what a
Workspace exposes, and which Workflow an Item executes inside that Workspace.

The M1 boundary is application-layer only. Prisma model names remain unchanged.

## Completed Sprint Chain

- Sprint 34: Blueprint Authoring V1.
- Sprint 35: Workspace Definition Apply V1.
- Sprint 36: Workspace Capability Enforcement V1.
- Sprint 37: Blueprint Workflow Integration V1.
- Sprint 38: Blueprint Source of Truth Audit.
- Sprint 38A: Blueprint Presentation Completion.

## Source Of Truth Contract

Blueprint defines:

- Workspace identity.
- Workspace Definition.
- Workspace type.
- Item label.
- Default view.
- Enabled capabilities.
- Workflow definition.
- Manual actions.
- BusinessEvent transitions.

Workspace owns:

- Applied Blueprint snapshot captured at creation.
- Applied Workspace Definition snapshot.
- Applied Workflow snapshot.
- Runtime Items, Activity, Discussion, and UI presentation from the snapshot.

Item owns:

- Workflow Runtime state.
- Current state.
- Runtime metadata such as last trigger and last event log.

Blueprint never executes. Workspace executes through Items. Item Runtime executes
the Workspace applied Workflow snapshot.

## Snapshot Independence

Changing a Blueprint after a Workspace has been created does not mutate that
Workspace.

Existing Workspace keeps:

- Original Blueprint name and source.
- Workspace type.
- Item label.
- Default view.
- Capabilities.
- Applied Workflow snapshot.

New Workspaces use the latest Blueprint values.

## Capability Rules

Workspace UI resolves capabilities from the applied snapshot.

Implemented capability behavior:

- `items=false`: hide Items tab, Items summary, and manual item intake.
- `workflow=false`: hide Workflow tab, Workflow column, and manual workflow actions.
- `activity=false`: hide Activity tab and activity summary.
- `discussion=false`: hide Discussion tab and discussion composers/actions.
- `checklist=false`: hide Checklist tab and checklist summary.
- `priority=false`: hide priority badge and priority surfaces.
- `dueDate=false`: hide due date surfaces.
- `assignee=false`: hide owner/share surfaces.
- `attachments=false`: hide Attachments tab.

Dependency:

- Workflow requires Items.
- If `items=false`, normalized capabilities force `workflow=false`.
- In Blueprint authoring, Item Workflow is disabled until Items is enabled.

## Workspace Presentation

Workspace detail presentation now reads from the applied Blueprint snapshot:

- Initial tab uses `workspaceDefinition.defaultView`.
- Workspace badge uses `workspaceDefinition.workspaceType`.
- Item tab and item surfaces use `workspaceDefinition.itemLabel`.
- Header description can use `workspaceDefinition.defaultDescription`.
- Detail panel displays Workspace type, Item label, and Default view from the
  snapshot.
- Tabs and panels are exposed only when the matching capability is enabled.

Default view supports:

- `items`
- `activity`
- `workflow`
- `discussion`
- `attachments`
- `checklist`
- `priority`
- `info`

If a default view points to a disabled capability, Workspace falls back to
Overview.

## Workflow Integration

Workspace creation stores `appliedWorkflowSnapshot` inside `blueprintSnapshot`.

When a new Item is created inside a Workspace, Item metadata copies the applied
Workflow snapshot from the Workspace snapshot.

Workflow resolution order:

1. Item `metadataJson.appliedWorkflowSnapshot`.
2. Legacy `metadataJson.workflowKey`.
3. Legacy `metadataJson.workTypeKey`.

Manual actions and BusinessEvent transitions use the same resolver, so new
Items execute the applied Workspace Workflow snapshot instead of live registry
definitions.

Legacy fallback remains only for older Items without an applied snapshot.

## Validation Summary

Expected validation:

- Blueprint A with `itemLabel=Posts`, `defaultView=checklist`,
  `checklist=true`, `discussion=false` creates a Workspace that opens on
  Checklist, displays Posts for item surfaces, hides Discussion, and shows
  Checklist summary.
- Blueprint B with `itemLabel=Tickets`, `defaultView=items`,
  `discussion=true`, `checklist=false` creates a Workspace that opens on
  Tickets, shows Discussion, and hides Checklist.
- Editing Blueprint A afterward does not mutate existing Workspace A.
- Newly created Workspaces use the updated Blueprint values.

## Files Most Relevant

Blueprint:

- `src/domains/blueprint/server/blueprint-library.service.ts`
- `src/domains/blueprint/server/blueprint.types.ts`
- `src/domains/blueprint/shared/workspace-capabilities.ts`

Blueprint authoring:

- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`

Workspace detail:

- `src/domains/task/client/TaskItemDetailClient.tsx`

Item Runtime / Workflow:

- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/business-binding-workflow.service.ts`

Workspace creation:

- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `src/domains/coordination/server/coordination-dashboard.service.ts`

## Validation Done

Targeted ESLint passed for:

```text
src/domains/task/client/TaskItemDetailClient.tsx
src/domains/blueprint/server/blueprint.types.ts
src/domains/workflow-definition/client/WorkflowAdminClient.tsx
src/domains/blueprint/shared/workspace-capabilities.ts
src/domains/blueprint/server/blueprint-library.service.ts
src/domains/task/server/business-binding-workflow.service.ts
src/domains/task/server/business-binding.service.ts
```

Full `tsc --noEmit` remains blocked by pre-existing parse errors in old
note/draft files such as:

- `src/note.ts`
- `component for chatGPT/...`

## Explicitly Not Implemented

M1 did not implement:

- Automation.
- Notification.
- Permission system.
- Workspace lifecycle.
- Workspace Runtime as a new product object.
- Blueprint versioning.
- Publish / rollback.
- Analytics.
- Prisma model rename.
- Dedicated Blueprint snapshot table.
- Dedicated Blueprint persistence schema.

## M2 Starting Point

M2 should begin after this contract, not by reopening M1.

Recommended M2 candidates:

- Blueprint persistence and publish/version semantics.
- Dedicated Workspace Blueprint Snapshot persistence.
- Apply Blueprint Update / migration preview.
- Permission or notification capability engines.
- Attachment runtime surface if attachments becomes an active operational
  capability.

Do not change the M1 rule:

Blueprint defines. Workspace snapshots. Item Runtime executes.
