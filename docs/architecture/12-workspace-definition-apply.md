# Workspace Definition Apply V1

Sprint 35 connects authored Blueprint Workspace Definition to Workspace creation.

## Goal

When an operator creates a Workspace from a Blueprint, the creation flow uses
the Blueprint's authored Workspace Definition instead of treating Blueprint as
read-only reference text.

## Applied In V1

- Registry Blueprints remain available in the Space create flow.
- Draft Blueprints are also available unless archived.
- Workspace name defaults to `workspaceDefinition.defaultName`.
- Create preview shows Blueprint source, Workspace type, Item label, default
  view, enabled capabilities, default description, and instantiation notes.
- Created Workspace stores a snapshot note containing:
  - `blueprintKey`
  - `blueprintSource`
  - `workTypeKey`
  - `workflowKey`
  - `workspaceDefinition`
  - `enabledCapabilities`
  - `itemLabel`
  - `defaultView`
  - `workspaceType`
  - `instantiationNotes`
  - `snapshotAt`
- Workspace detail reads `blueprintSnapshot` from the note and displays it as
  Workspace Definition Snapshot.

## Snapshot Strategy

Current storage does not have a dedicated Workspace Definition snapshot table
or JSON column. V1 uses the existing `TaskItem.note` bridge because it is the
safest persistence surface already used by Workspace creation.

This keeps existing Workspaces independent: later Blueprint edits do not mutate
the snapshot stored on already-created Workspaces.

## Boundary

Unchanged:

- Business Domain.
- BusinessEvent emit logic.
- Router and consumers.
- Workflow Runtime.
- Item Runtime.

## Not Implemented

- Dedicated Workspace snapshot schema.
- Capability runtime enforcement.
- Layout or permission application.
- Blueprint publish/version/rollback.
- Item field model changes.
- Workflow runtime migration.

Recommended next schema step: add a dedicated Workspace Definition snapshot JSON
field or table before applying capabilities such as permissions, layout, and
default item fields at runtime.
