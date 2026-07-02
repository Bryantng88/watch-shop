# Activity And Discussion

Activity is the conversation/work unit inside a Workspace.

Workspace is the collaboration surface. Activity is where users can open a
discussion, follow an important business event, and read Discussion entries in
one thread.

TimelineEntry still exists as a projection/log record. It is useful for audit
and read projections, but it is not the primary collaboration model.

## Model

- `TaskItemActivity` persists Activity.
- `TaskItemActivityReply` persists Discussion.
- Discussion is one-level only: Activity -> Discussion.
- Nested discussion threads are out of scope.

## Sources

Activity sources:

- `BUSINESS_EVENT`: created from important business events.
- `DISCUSSION`: created directly by a user.
- `SYSTEM`: created by system-side Space Management when needed.

## Timeline Relationship

TimelineEntry is still kept as projection/log storage.

Activity is higher level than TimelineEntry:

- TimelineEntry records what happened.
- Activity represents what people work around and discuss.

## Rules

- User creates Discussion Activity.
- BusinessEvent creates Business Activity.
- Discussion belongs to Activity only.
- No schema or consumer change is required for TimelineEntry projection.
