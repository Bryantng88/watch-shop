# Space Management Language Contract

Sprint 27 is the final product-language migration.

New application code must use Space Management vocabulary.

## Rename Map

| Legacy | New |
| --- | --- |
| Task | Space |
| TaskItem | Workspace |
| BusinessBinding | Item |
| Queue | Items |
| WorkType | WorkspaceTemplate |
| Coordination Module | Space Management |
| Coordination Context | Operations / Sales / Technical / General |
| Reply | Discussion |

## Product Hierarchy

```text
Space Management
  -> Operations
    -> Operation Week 27 (Space)
      -> Publish Workspace
        -> Items
          -> Activity
            -> Discussion
```

## Prisma Compatibility

Do not rename Prisma models in this migration.

Persisted model mapping:

| Prisma model | Product concept |
| --- | --- |
| Task | Space |
| TaskItem | Workspace |
| TaskExecution | Item |
| TaskItemActivity | Activity |
| TaskItemActivityReply | Discussion |

Repositories may still query:

- `prisma.task`
- `prisma.taskItem`
- `prisma.taskExecution`
- `prisma.taskItemActivity`
- `prisma.taskItemActivityReply`

## Application Layer

New application-layer imports should prefer:

- `src/domains/space-management`
- `getOperationsSpaceDashboard()`
- `getSpaceDetail()`
- `getWorkspaceDetail()`
- `listWorkspaceItems()`
- `summarizeWorkspaceItems()`
- `listWorkspaceTemplates()`

Legacy Task/Coordination modules remain as compatibility implementation until a
safe folder-level migration is scheduled.

## UI Language

UI must not display:

- Task
- Task Item
- Business Binding
- Queue
- Coordination
- Dieu phoi
- Phieu xu ly

UI should display:

- Space Management
- Space
- Workspace
- Items
- Activity
- Discussion
- Workspace Templates

## Boundary

Business:

```text
Business
  -> BusinessEvent
  -> Space Management
  -> Space
  -> Workspace
  -> Items
  -> Activity
  -> Discussion
```

Business domains only emit `BusinessEvent`.

Space Management consumes events, aggregates Items, exposes Activity, and
coordinates Workflow runtime. It does not own business aggregates.
