# Timeline

Timeline is a projection/read model. It is not the source of truth.

Timeline entries can reference source records such as:
- `BusinessEvent`
- `BusinessFeedback`
- `UserComment`
- `WorkflowAction`
- `Notification`
- `System`

`BusinessFeedback` remains independent. It can be projected into a TaskItem timeline, but Timeline does not own the feedback.

TaskItem renders Timeline to behave like a lightweight Jira ticket.

Projection rule:
- Business domains emit `BusinessEvent`.
- Timeline consumer reads the event metadata.
- Timeline consumer resolves related TaskItems through `BusinessBinding`.
- Timeline consumer upserts `TimelineEntry`.

Out of scope:
- Direct Watch -> Timeline calls.
- Passing `taskItemId` through Watch URL/API.
- Treating Timeline as source of truth.

