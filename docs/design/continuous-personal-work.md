# Continuous personal work

PR155 adds CONTINUOUS as a work mode, independent of its category. This is one
ongoing responsibility, not a daily recurrence, a deadline-free finite task or
an automatically generated daily occurrence. No resets, duplicate tasks or
daily completion records are created.

Creation uses the “Duy trì” quick-create tab. The parent starts IN_PROGRESS,
without dueAt, scheduledEndAt, date reminders or a finite duration. Existing
finite tasks/events cannot be converted, preserving their completion history.

Today/All show active continuous work first with an infinity symbol rather than
a completion checkbox. Continuous work is shown in the work list, without a strip above the calendar
or repeated day-cell events. Google
event export and automatic Codex execution are refused. Normal work counts,
overdue/unscheduled buckets and daily completion totals exclude this mode;
Ben's daily summary exposes a separate continuousCount.

Subtasks can be assigned/shared and completed once, retaining their state across
days. Even when all subtasks are done the parent remains active and unlocked.
Updates and work attachments retain the existing permission model and history.
Only the owner may stop/resume the responsibility; stopping soft-archives it
using CANCELLED, never DONE, preserving history and completedAt=null. The UI
provides “Dừng duy trì” under other information. There is no daily tick or reset.

Server validation and an additive SQL check constraint reject scheduled or
completed continuous parents, including stale clients. Merge of continuous
parents is blocked so finite media-merge counting remains unambiguous. Existing
full/partial sharing is preserved without exposing private parent metadata.
