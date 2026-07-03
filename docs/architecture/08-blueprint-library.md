# Blueprint Library

Sprint 31 moves the administrator-facing product model from Workflow Definition
to Blueprint.

## Product Model

Blueprint is the aggregate administrators manage.

Workflow is one capability inside a Blueprint.

Blueprint defines how a Workspace should operate. Blueprint does not execute.
Workspace executes.

```text
Blueprint Library
  -> Blueprint
  -> Instantiate
  -> Space
  -> Workspace
  -> Items
  -> Workflow Runtime
  -> Activity
  -> Discussion
```

## Runtime Boundary

Runtime source remains the static registry in this sprint.

Workflow Runtime still belongs to Item.

Business domains still only emit BusinessEvent.

## Snapshot Strategy

When a Workspace is created from a Blueprint, the Workspace stores a lightweight
snapshot note containing:

- `blueprintKey`
- `workTypeKey`
- `workflowKey`
- `blueprintSnapshot`

This is a V1 bridge. Future schema should persist a dedicated Workspace
Blueprint Snapshot so existing Workspaces stay independent from later Blueprint
changes.

## Future Persistence

Future Blueprint persistence should support:

- Blueprint versions.
- Published immutable Blueprint versions.
- Workspace snapshot records.
- Rollback.
- Compatibility checks before activating a Blueprint version.
