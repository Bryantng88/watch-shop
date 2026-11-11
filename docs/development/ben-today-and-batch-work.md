# Ben: today focus and multiple personal items

## Today

`personalWork.today` lists only today's active tasks/events and multi-day items
still overlapping today in Asia/Ho_Chi_Minh. It returns overdue/unscheduled counts
without historical titles. The worker lists today's items first and says only,
for example, “Ngoài ra có 8 việc quá hạn.” It must not re-fetch old titles from
history or search unless the user explicitly asks. `personalWork.overdue` is the
separate zero-argument tool for that request under the same TASK_VIEW and
owner/share scope.

The lookup scans schedule metadata in pages of 500, at most 10,000 active items.
Only the selected bucket's first 12 identities/titles are fetched for the model.
An overdue backlog cannot consume the display limit. `countsExact=false` means
lower-bound counts; `truncated=true` means partial coverage. An empty partial
scan cannot prove no work exists. Events are not counted as overdue; midnight
boundaries are half-open and multi-day spans are included only while overlapping.

## Multiple items

`personalWorkPlans` is a nullable finish field containing 2–8 complete normal
personal-work plans. It is mutually exclusive with the legacy single plan and
every other review/update/business/code plan. The existing strict per-item
schedule, assignee, share, category, Google and Codex contracts remain in force.
Missing facts require chat clarification for the entire request, not creation of
just the first ready item. More than eight requires an explicit split. Independent
items are not converted to checklist entries. Pending batch corrections preserve
unmentioned items via `personalWorkDraft.items`.

The compact review displays all items and one approval. The existing owned
conversation/revision lock and serializable transaction revalidate all plans,
then create all canonical tasks/events, checklists/shares, optional Codex runs
and receipts atomically. Any item failure rolls back the group. Replay returns
all existing receipts for that revision and does not repeat Google sync. Receipt
keys and calendar updates use revision + task ID so one item's provider result
cannot overwrite another's status. Calendar sync and existing assignment
notification scheduling occur after the creation transaction.

No migration, deployment authorization, permission expansion, merge or publish
action is introduced. Deploy app plus updated customer worker/schema together.

## Verification and rollout acceptance

Automated tests exercise day boundaries/overlap, a 520-item overdue backlog,
privacy of today's result, bounded scan reporting, strict batch validation,
full array forwarding through the worker, legacy single drafts, and a real
React review with one button. Browser QA uses actual review rendering with
fixture callbacks; it does not create business records.

On an authorized test environment, approve two different scheduled tasks in one
command and verify two canonical records, correct schedules and per-item Google
destinations. Replay/concurrently approve and confirm no duplicates. Invalidate
the second item's recipient/permission/category before approval and confirm zero
new records. Simulate a calendar failure for one item and confirm both local tasks
survive with independent sync statuses. Confirm a correction to item 2 preserves
item 1, incomplete requests have no partial approval, and all old single-task,
event and scheduled-Codex behavior remains. Live model, database transactions,
Google delivery and notification behavior need these rollout checks.
