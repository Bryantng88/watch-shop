# Cancellation and restoration

Only owners cancel active personal work, events or continuous responsibilities.
Cancellation requires a reason, preserves checklist state/history/images and moves
the parent into CANCELLED without counting a completed task. Merged sources stay
hidden behind their destination; they are not cancelled/archive entries.

The shared view navigation includes Đã hủy. Archived rows show cancellation time
and actor where the reader has full access. Detail is read-only, with the audit
reason and history. Owner-only Mở lại retains entries, completed substeps, sharing
and history. A new optional date is date-only; blank restores an unscheduled task.
Events require a date. Fixed daily-media roots retain their original day; continuous
responsibilities resume without scheduling. Old worker runs never restart implicitly.

Cancellation and restoration share the parent-row lock with edits, shares, merge,
media and Codex requests. Stale writes are rejected. Repeated lifecycle commands
do not create duplicate audit entries or notifications. Running Codex work requires
explicit confirmation before cancellation revokes its lease and active run slot.
This prevents further result writes; it does not undo effects already performed.

Notifications are queued transactionally for full-work recipients and entry-only
recipients. A recipient gets one event even with multiple shares. Full recipients
see the actor, task and reason. Entry-only recipients get a permitted entry title
and actor, without private parent title/reason/history; their page projection is
redacted too. The actor is excluded. In-app notifications are created even without
a browser push subscription. Both cancellation and restoration use the same policy.

Pending reminders/assignment pushes are retired. Internal calendar entries exclude
cancelled parents. Google cleanup runs after the database commit; provider failure
does not roll back cancellation and is reported separately. Failed cleanup links
are marked and retried on a subsequent authenticated calendar refresh. A late sync
checks parent state before recording its link and cleans up if cancellation won.

Existing cancelled rows remain accessible through the archive with whatever audit
data already exists. No schema migration or rewrite of historical records is needed.
