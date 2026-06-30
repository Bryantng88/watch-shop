# Vision

The repository is moving toward a business collaboration engine.

Core idea:
- `Task` is a container, epic, or case.
- `TaskItem` is the primary collaboration ticket, work unit, and aggregate root for day-to-day execution.
- Business domains such as Watch, Order, Shipment, and Service remain independent from TaskItem.
- Business domains emit `BusinessEvent`; they do not call TaskItem, Timeline, Workflow, or Notification directly.

The collaboration layer reacts to business facts:
- `BusinessEvent` is the source of truth for business state transitions.
- `BusinessFeedback` is an independent feedback/thread artifact.
- `BusinessBinding` maps TaskItem to business objects.
- `Timeline` is a read model projected from events, feedback, comments, workflow actions, and notifications.

Rejected/deferred:
- Passing `taskItemId` through Watch URL/API for Timeline routing.
- Direct Watch -> Timeline calls.
- Renaming Prisma `TaskExecution` to `BusinessBinding`.

