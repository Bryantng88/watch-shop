# Work saves and Google synchronization

Work edits and checklist finalization commit through their existing canonical
services and permission checks. Only after that commit, an existing Calendar link
may be synchronized. Google failures (including expired connections) return a
separate FAILED status; they cannot turn a committed work save into a thrown
failure. Unlinked work returns NOT_LINKED and makes no Google request.

The edit closes after a successful work save. UI distinguishes saved work from
successful Google sync, preserves a visible per-task retry, and retries only the
existing calendar command, never the work edit/activity. Finalization retains its
completed checklist and reports sync failure separately. Validation, authorization
and database failures still reject the save; UI keeps entered data and shows the
error inside the editor. Masked production errors ask users to reload and inspect
the result before saving again. Token refresh is bounded by an eight-second timeout.

The calendar loading warning remains independent. A screenshot alone does not
prove a production task failed to persist or establish the exact Google error.
No production data, connection credentials, sharing rules or sync recipient policy
are changed. There is no new background queue or automatic retry on reload.

Regression coverage extends smoke-ben-auto-calendar.ts (real local PostgreSQL,
synthetic Google) and smoke-work-responsive-ui.cjs (actual work client with stubbed
actions), including saved activity exactly once, failed sync/retry, no-link and
revoked access/validation, checklist completion and an expired connection.
