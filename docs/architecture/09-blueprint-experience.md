# Blueprint Experience V1

Sprint 32 makes Blueprint understandable as a business object before it is
understood as JSON or Workflow.

## Product Object

Blueprint remains the aggregate administrators manage.

Workflow is one capability inside Blueprint.

Blueprint defines. Workspace executes. Item runtime still owns Workflow state.

```text
Blueprint Library
  -> Blueprint
  -> Workspace Preview
  -> Capabilities
  -> Workflow capability
  -> Developer details
```

## Admin Experience

The first read of a Blueprint should answer:

- Why this Blueprint exists.
- What business context owns it.
- When it should be used.
- What result the Workspace should produce.
- What kind of Workspace it creates.

The UI therefore prioritizes Purpose, Workspace Preview, Capabilities, Workflow,
and Developer in that order.

## Workspace Preview

Workspace Preview is descriptive only.

It explains the shape:

```text
Workspace -> Items -> Activity -> Discussion
```

It does not hydrate runtime Items, Activity, Discussion, or Business objects.

## Capability Model

V1 has one active capability:

- Workflow

Future capability placeholders:

- Permissions
- Notifications
- Automation
- Layout
- Metrics

These placeholders are product model anchors, not engines.

## Developer Tab

Developer information stays available but is no longer the primary experience:

- Registry Source
- Definition JSON
- Validation
- Metadata
- BusinessEvent catalog guardrail

## Boundaries

Unchanged:

- Business Domain.
- BusinessEvent emit logic.
- Router and consumer behavior.
- Workflow Runtime.
- Item Runtime.
- Workspace snapshot bridge from Sprint 31.

Not implemented:

- Blueprint publish.
- Versioning.
- Rollback.
- Automation engine.
- Notification engine.
- Analytics.
- Drag and drop builder.
- Workflow visual designer.
