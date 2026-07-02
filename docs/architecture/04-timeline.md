# Timeline

Timeline is a projection/read model. It is not the source of truth.

Timeline entries can reference source records such as:

- `BusinessEvent`
- `BusinessFeedback`
- `UserComment`
- `WorkflowAction`
- `Notification`
- `System`

`BusinessFeedback` remains independent. It can be projected into Workspace
Activity, but Timeline does not own the feedback.

Workspace renders Activity as the primary collaboration surface. Timeline stays
as an audit/projection layer.

Projection rule:

- Business domains emit `BusinessEvent`.
- Timeline consumer reads event metadata.
- Timeline consumer resolves related Workspaces through Items.
- Timeline consumer upserts `TimelineEntry`.

Out of scope:

- Direct Watch -> Timeline calls.
- Passing Workspace ids through Watch URL/API.
- Treating Timeline as source of truth.
