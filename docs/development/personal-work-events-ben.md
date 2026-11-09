# Personal events and Ben scheduling

Personal Work has a separate Loại mục selector in quick create and calendar
create: Công việc or Sự kiện. Groups/categories stay independent. EVENT is stored
in the existing TaskItem.workTypeId string, including custom categories; no schema
migration or new permission. Existing work subtype strings are unchanged.

Events require a date. They can be timed intervals, start-only points or all-day.
They stay on the calendar and in history after their scheduled time, without
becoming overdue or requiring completion. Occurrence labels are time-derived.
Event editing keeps the event type; converting an existing task/event across
kinds is rejected to preserve existing checklist/worker semantics. Cancel/delete
and shares use the existing owner/editor rules. Checklist/progress/completion and
Codex execution are rejected server-side for events, not merely hidden in UI.

Ben: “Mai 8–9h mang đồng hồ Tissot đưa cho Nam” prepares a personal task with
that title/time without customer/product lookups. “Tạo sự kiện họp lúc 10h” prepares
an EVENT. Ben can include a group, notes, priority, explicit checklist, tags and
explicit shares. It asks when ambiguous, shows one compact review and creates
only after the dedicated click. Sharing defaults to read-only when explicitly
requested without editing rights; a name in a task is not implicitly a share.
Google synchronization is opt-in and shown in the review. A sync error retains
the created task/event and its idempotent receipt, with a retry link through the
existing Personal Work UI. Opening a receipt link selects the owned/shared item.

Validation should cover event date/point/all-day/interval, custom groups, time
labels, no completion controls/counts, Google read/write payloads, normal task
regression, no write before Ben approval, concurrent replay, stale revision,
cross-owner denial, sharing evidence, permission revocation and sync failure.
The loopback-only scripts/smoke-ben-personal-work.ts covers real DB/service flows
with scripted model outputs and deliberate Google configuration failure. It does
not establish live model time interpretation or live Google consent/provider
acceptance. Device/model/Google smoke remains necessary after deploying app and
updated customer worker/protocol/schema together. Keep current OAuth/secrets,
worker volumes/security and ingress; no production deployment is performed by
this coding task. Existing pending tagged tasks are not bulk-dispatched.

Local validation: 85 app/personal tests, 25 worker/PWA tests, scoped lint, TypeScript and production build passed. Chromium verified authenticated event creation, event filters/no completion or overdue state, Ben approval through the real API, idempotent approval replay, receipt deep-link/checklist and a 390px viewport. Browser used synthetic local accounts and a scripted model seed without live Google access.
