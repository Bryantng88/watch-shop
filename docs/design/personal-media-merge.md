# Personal media work merge

Stage-only candidate, 2026-11-26. No production release authorization.

The quiet “Gộp media” action opens selection, then a server-generated preview with
editable title, source list, completed/open checklist counts and explicit warnings.
No merge badge appears in lists. Detail reveals source titles on demand.

First release accepts 2–30 open personal work items owned and performed by the
actor, identical category/type and identical full-work sharing. Every checklist
entry must parse as WATCH_MEDIA_DAILY. Mixed WatchShop work, locked/finished or
cancelled parents, active Codex runs and Google-linked work are refused. Entry
shares may differ; they retain their IDs and access levels without expanding
full-work access. At least one entry must be open, with at most 500 total entries.
Tasks still tagged Codex are blocked; completed Codex history can move only after
the tag is removed and no run is active. Business-workflow children are excluded.

A Serializable transaction takes deterministic parent locks and a request lock.
The preview hash includes parents, entries, shares, activities, executions,
calendar links, active runs and work image bindings. Stale confirmations fail.
A stable per-request target ID and command hash protect replay and lost responses.

Checklist IDs, doneAt, shares, notes/Watch contexts remain. Activities and replies
retain IDs, actors and occurredAt; work image bindings and executions follow the
new parent. Original parents retain their state/note and merge pointer; an audit
receipt records actor, time, sources, deadlines, priorities and entry membership.
The earliest deadline and highest priority win. Duplicate work image bindings,
pending uploads and more than 20 work-level images block instead of dropping data.

Merged parents are excluded by the shared personal-work scope, generic task list,
dashboard SQL and reminder scanner. Sources remain uncompleted, so completion
reports count the new item once. Checklist completion dates do not change.
Old item URLs resolve through authorized merge chains; partial recipients only
receive redirects for their own entry provenance. Daily-media idempotency and
new requests follow the current parent, including subsequent merges.
Pending assignment/share pushes follow the new parent; obsolete source reminders
are suppressed. Concurrent request replay retries PostgreSQL serialization and
deadlock outcomes using the same request identity.

Calendar sync reserves its link under the same parent lock before contacting
Google. A merge either sees the link and refuses, or wins and prevents sync.
Stale tabs recheck access under the lock before updating/finalizing/sharing.

The additive migration requires staging backup/restore rehearsal and previous-image
compatibility verification before activation. Keep the old app/container and all
worker configuration for rollback. Never reverse the migration automatically.
