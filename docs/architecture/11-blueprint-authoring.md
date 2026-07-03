# Blueprint Authoring V1

Sprint 34 makes Blueprint drafts authorable without editing JSON.

## Goal

System Admin can create and edit a Blueprint draft through business-oriented
forms:

- Identity.
- Purpose.
- Workspace Definition.
- Capability configuration.
- Workflow stages and transitions.

Developer JSON remains visible for debugging only.

## Draft Persistence

The existing file-backed workflow draft store now supports optional
`blueprintJson`.

This keeps Sprint 34 out of Prisma migration scope and remains compatible with
existing drafts.

`blueprintJson` stores:

- `purpose`
- `businessContext`
- `typicalUsage`
- `expectedResult`
- `ownerLabel`
- `workspaceDefinition`

## Authoring Scope

Editable in V1:

- Blueprint name and description.
- Purpose, usage, expected result, owner.
- Workspace default name, description, type, item label, default view, notes.
- Capability toggles.
- Workflow stages: add, rename, delete.
- Workflow transitions: add, edit, delete.
- BusinessEvent trigger selection from the catalog.

## Developer Tab

Developer tab is debug-only:

- Definition JSON.
- Workspace Definition JSON.
- Validation.
- Registry source.
- BusinessEvent catalog.

## Boundary

Unchanged:

- Business Domain.
- BusinessEvent emit logic.
- Router and consumers.
- Workflow Runtime.
- Item Runtime.

## Not Implemented

- Publish.
- Versioning.
- Rollback.
- Runtime apply of capabilities.
- Workspace lifecycle changes.
- Automation engine.
- Notification engine.
- Permission system.
- Layout builder.
- Visual workflow designer.

Runtime apply belongs to later sprints.
