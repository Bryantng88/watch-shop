# Ben personal task assignment and updates

Previously Ben could create only an owner's personal task/event, with no assigned
colleague and no personal update tool. These were real tool gaps, even when
personal creation from PR66 was deployed. New web + customer worker/protocol/schema
must be rolled out together; changing only chat wording cannot add API behavior.

Examples in Vietnam time using referenceTime 2026-11-10:

- “Mang đồng hồ cho Nam xong rồi”: search/read the actual personal task and prepare
  DONE; one Lưu cập nhật click writes it. Multiple matches need clarification.
- “Tạo cho Vi việc cập nhật giá dịch vụ vệ sinh sửa chữa, bắt đầu hôm nay, deadline
  thứ 5 tuần này”: resolve Vi, prepare an assigned personal task, planned start
  10/11 and deadline end-of-day 12/11. Owner stays the requester and Vi receives
  EDITOR access to this item. Assigned work appears in the colleague’s default
  Của tôi filter and names its assignee. Assignment requires TASK_MANAGE, not a product or
  customer. The task remains TODO; a planned start does not record actual work.

The existing personal-work schedule fields hold start (dueAt) and end/deadline
(scheduledEndAt). The UI uses the end when present for overdue badges/counts;
ordinary work with no end still uses dueAt. No migration. User-mentioned names in
an errand title do not automatically gain access or become assigned users.

Updates support title, note, schedule and manual status on owned/editor-shared
personal work. They do not bypass checklist finalization, complete events, change
assignment or mutate regular workspace tasks. Calendar changes retain existing
manual synchronization behavior; no new automatic Google/external notifications.

Validation: 89 app/personal tests and 26 worker/PWA tests passed; ESLint, tsc and
production build passed. scripts/smoke-ben-task-lifecycle.ts uses an idle isolated
loopback personal_codex_test DB and scripted worker outputs: assignment, exact
schedule, no write before approval, concurrent replay, shared editor versus
viewer/other owner, revoked shares, stale target, missing assignment authority,
checklist guard, and no order/TI side effects. Synthetic accounts are deactivated.
Chromium against the built local app verified a 390px compact review without
embedded fields or overflow, authenticated real API approval, replay and reload.

These checks do not establish real model semantic understanding or live runtime
version. After authorized rollout, run both examples with a real model, verify
ambiguous Vi names, negated/quoted/hypothetical completion, unspecified fields,
checklist and permission denial, then confirm the exact canonical item and task
history. Confirm both app and worker expose/use personalWork.search/detail,
canUpdatePersonalWork, canAssignPersonalWork, assigneeUserId and the update plan.
This coding task does not authorize merge, deploy or production writes.
