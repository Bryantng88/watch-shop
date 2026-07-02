# Vision

The repository is moving toward Space Management.

Core idea:

- `Space` is the operating container, cycle, epic, or case.
- `Workspace` is the primary collaboration surface inside a Space.
- `Item` is a business object placed inside a Workspace.
- `Activity` is the work/conversation unit created around a Workspace or Item.
- `Discussion` is a one-level response inside an Activity.

Business domains such as Watch, Order, Shipment, and Service remain
independent from Space Management.

Business domains emit `BusinessEvent`; they do not call Workspace, Activity,
Workflow, or Notification directly.

The Space Management layer reacts to business facts:

- `BusinessEvent` is the source of truth for business state transitions.
- `BusinessFeedback` is an independent feedback artifact.
- `Item` maps Workspace to business objects.
- `Activity` is the collaboration read/work surface projected from events,
  feedback, comments, workflow actions, and notifications.

Prisma compatibility:

- Prisma `Task` remains the persisted table for Space.
- Prisma `TaskItem` remains the persisted table for Workspace.
- Prisma `TaskExecution` remains the persisted table for Item.
- Do not rename Prisma models in this migration.

Rejected/deferred:

- Passing Workspace ids through business-domain URLs/APIs for routing.
- Direct Watch -> Activity calls.
- Prisma model renames.
