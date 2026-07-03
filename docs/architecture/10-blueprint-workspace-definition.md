# Blueprint Workspace Definition V1

Sprint 33 makes Blueprint define the Workspace it creates, not only the
Workflow capability it contains.

## Product Model

Blueprint is a Workspace blueprint.

```text
Blueprint
  -> Identity
  -> Workspace Definition
  -> Workflow Capability
  -> Developer
  -> Future Capabilities
```

Workspace Definition is design-time intent. It is not runtime state.

Workspace executes. Blueprint never executes.

## Workspace Definition

V1 exposes:

- `defaultName`
- `defaultDescription`
- `workspaceType`
- `itemLabel`
- `defaultView`
- `enabledCapabilities`
- `instantiationNotes`

The default active capabilities are:

- Workflow
- Items
- Activity
- Discussion
- Priority

Future/disabled capability anchors:

- Attachments
- Checklist
- Due Date
- Assignee

## DTO Strategy

Registry Blueprints derive Workspace Definition from WorkType and Blueprint
Experience.

Draft Blueprints derive Workspace Definition in the admin client until draft
persistence has a first-class Blueprint schema.

This avoids a Prisma migration and keeps Sprint 33 safely in the application
layer.

## Workspace Creation

Create Workspace from Blueprint now uses Workspace Definition for:

- Default workspace name.
- Workspace type preview.
- Item label preview.
- Default view preview.
- Enabled capability summary.

The user can still override the workspace name before creation.

## Snapshot Strategy

Workspace creation still stores a V1 snapshot note.

The snapshot now includes:

- `blueprintKey`
- `workflowKey`
- `workspaceDefinition`
- `enabledCapabilities`
- `itemLabel`
- `defaultView`

This keeps existing Workspaces independent from later Blueprint changes as much
as the current storage model allows.

## Future Schema Step

Future persistence should introduce:

- Blueprint table.
- Blueprint version table.
- Workspace Blueprint Snapshot table.
- Workspace Definition JSON column.
- Published version references.

Do not force these into Sprint 33.

## Boundaries

Unchanged:

- Business Domain.
- BusinessEvent emit logic.
- Router and consumer behavior.
- Workflow Runtime.
- Item Runtime.
- Existing Workspace execution.

Not implemented:

- Blueprint versioning.
- Publish and rollback.
- Automation engine.
- Notification engine.
- Analytics.
- Full layout builder.
- Complex permissions.
- Visual workflow designer.
