# Personal calendar scheduling and preview

The calendar creation dialog includes the selected default group's work types
(for example WORK → General task / Meeting / Planning / Administrative work).
Custom groups do not inherit unrelated default work types. The same choice can
be changed in the task detail form.

New and edited events can be all-day or have start/end hours in Asia/Bangkok.
Both creation entry points show start/end hours immediately (09:00?10:00 by
default). All-day selection disables the visible hours. The quick toolbar keeps
the time range inline and wraps on smaller screens.
`TaskItem.dueAt` holds the start instant for timed events; nullable
`scheduledEndAt` distinguishes them from all-day work. Existing records remain
all-day. The additive migration is `20261029080000_personal_work_scheduled_end`.
This session applies it only to the local database.

End times must be after start times. For multi-day work, the end hour belongs
to the last selected calendar day. The service validates instants and caps the
occupied range at 365 days. Calendar grouping respects exclusive end instants,
including midnight, and clips ranges to the visible window.

Google sends/receives `dateTime` for timed work and exclusive `date` bounds for
all-day work. Import retains the existing edit-access and concurrent-update
guards. An unchanged import does not modify the task timestamp.

Hovering or keyboard-focusing a calendar item, including the overflow day list,
shows a compact portal preview with group, work type, time range, status, checklist
count and a short note. Escape closes it; clicking the event opens task detail.
Preview interactions do not trigger the underlying day's create handler.

New personal work is standalone and has a direct owner; creation no longer uses
weekly parent tasks. Existing PERSONAL parents remain only as historical
references with their previous creator/assignee access semantics preserved.
See `personal-work-task-audit.md` for migration and compatibility details.

Verification:

- `tsx --test src/domains/personal-work/shared/personal-work-schedule.test.ts src/domains/personal-work/shared/personal-calendar.test.ts`
- `tsx scripts/smoke-personal-work-schedule.ts` against a guarded loopback local
  test database. Synthetic users and fixture item IDs are tracked explicitly;
  cleanup removes only those items, and only empty parents owned by the synthetic
  users. Google responses are mocked.
- The existing `smoke-personal-calendar.ts` checks no-op/concurrent/access guards.
- Browser: create a WORK meeting with hours, reopen/edit, reload, inspect hover
  and keyboard preview, dismiss with Escape, and verify original task IDs remain.
