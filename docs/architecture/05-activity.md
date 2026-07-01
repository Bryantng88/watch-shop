# Activity

Activity is the conversation unit inside a TaskItem.

TaskItem is the collaboration ticket / phieu xu ly. Activity is where users can
open a discussion, follow an important business event, and read replies in one
thread.

TimelineEntry still exists as a projection/log record. It is useful for audit
and read projections, but it is not the primary collaboration model.

## Model

- `TaskItemActivity` is the root conversation unit.
- `TaskItemActivityReply` belongs to one Activity.
- Replies are one-level only: Activity -> Replies.
- Nested replies are out of scope.

## Sources

Activity sources:

- `BUSINESS_EVENT`: created from important business events.
- `DISCUSSION`: created directly by a user.
- `SYSTEM`: created by system-side coordination when needed.

BusinessEvent will create Business Activity in a later sprint. This sprint does
not migrate existing TimelineEntry records into Activity.

## Timeline Relationship

TimelineEntry is still kept as projection/log storage.

Activity is higher level than TimelineEntry:

- TimelineEntry records what happened.
- Activity represents what people work around and reply to.

## Rules

- User creates Discussion Activity.
- BusinessEvent creates Business Activity.
- Reply belongs to Activity only.
- No schema or consumer change is required for TimelineEntry projection.
