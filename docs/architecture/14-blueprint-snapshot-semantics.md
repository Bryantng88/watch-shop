# Blueprint Snapshot Semantics V1

This note documents the accepted relationship between Blueprint and Workspace.

## Decision

Blueprint changes do not mutate existing Workspaces.

A Blueprint is the design-time operating model. A Workspace is the runtime
instance created from that model. When a Workspace is created, it captures the
Blueprint intent as a snapshot and then becomes independent.

## Relationship

Current model:

- Blueprint defines how a Workspace should be created.
- Workspace stores the chosen Blueprint snapshot at creation time.
- Workspace executes through Items, Workflow Runtime, Activity, and Discussion.
- Blueprint never executes.
- Existing Workspaces do not read live Blueprint draft/registry values after
  creation.

## Expected Behavior

If an admin renames a Blueprint after a Workspace has been created:

- Existing Workspace title remains unchanged.
- Existing Workspace snapshot keeps the original Blueprint name.
- Existing Workspace type, Item label, default view, and capabilities remain
  unchanged.
- Newly created Workspaces use the latest Blueprint values.

If an admin enables or disables Blueprint capabilities after a Workspace has
already been created:

- Existing Workspace continues using its captured capability snapshot.
- Newly created Workspaces receive the updated capability set.

## Why

This prevents live operational Workspaces from changing unexpectedly when an
admin edits a Blueprint draft.

Without this rule, a Blueprint edit could silently hide tabs, remove manual
workflow actions, change Item surfaces, or alter the operator experience while
work is already in progress.

## Apply Changes Later

Updating existing Workspaces from a changed Blueprint should be a separate
future action, not automatic behavior.

Future candidate:

- Apply Blueprint Update
- Migrate Workspace
- Preview snapshot diff
- Confirm affected capabilities
- Record migration history

This should happen only after Blueprint versioning or publish semantics are
introduced.

## Current Implementation Notes

- Workspace creation writes `blueprintSnapshot` into the Workspace note.
- Workspace detail reads the snapshot from the note.
- Capability UI enforcement resolves capabilities from the Workspace snapshot.
- Draft Blueprint selection uses a distinct selection key so registry and draft
  Blueprints cannot be confused in the create flow.
- Manual workflow draft actions are normalized so authoring can validate older
  draft transitions that have labels but missing action keys.

## Not Implemented

- Automatic propagation from Blueprint to existing Workspaces.
- Blueprint versioning.
- Blueprint publish / rollback.
- Workspace migration flow.
- Dedicated snapshot table or JSON column.
- Runtime workflow migration.
- Server-side capability permission enforcement.

## Boundary

Unchanged:

- Business Domain.
- BusinessEvent emit logic.
- Router behavior.
- Workflow Runtime.
- Item Runtime.

