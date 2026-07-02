# Space And Workspace

`Space` is a container, cycle, epic, or case. It groups Workspaces and provides
ownership, status, and context.

`Workspace` is the primary collaboration surface:

- The unit people discuss and execute.
- The aggregate root for collaboration UX.
- The issue-like surface where Activity, Discussion, feedback, and business
  events are rendered.

Business domains must not depend on Workspace. A Watch review action should
update Watch state and emit a `BusinessEvent`; it should not know which
Workspace is watching it.

Workspace discovers business context through Items, not through domain-specific
coupling.

Implementation note:

- Prisma `Task` persists Space.
- Prisma `TaskItem` persists Workspace.
- Application code should prefer Space/Workspace vocabulary for new APIs.
