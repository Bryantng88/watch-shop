# Task And TaskItem

`Task` is a container, epic, or case. It groups work and provides ownership, status, and context.

`TaskItem` is the primary collaboration ticket:
- The unit people discuss and execute.
- The aggregate root for collaboration UX.
- The Jira-like issue surface where timeline, comments, feedback, and business events are rendered.

Business domains must not depend on TaskItem. A Watch Review action should update Watch state and emit a `BusinessEvent`; it should not know which TaskItem is watching it.

TaskItem discovers business context through `BusinessBinding`, not through domain-specific coupling.

