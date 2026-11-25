# Work Case usage review — 2026-11-23

Scope: static source review against PR #145 base/head `6b93c0a` / `5fb63df`. No database queries, data migration, permission changes or runtime retirement are included. A callable path proves code reachability, not that production contains records or that users currently exercise it.

## Finding

Work Case is still a reachable business feature. It is not interchangeable with TaskItem or a ServiceRequest. Retiring the Task/TaskItem detail routes did not retire the WorkCase model, actions, pages or links. Keep the feature intact in this UI PR and do not add a separate main-menu entry.

## Reachable paths and dependencies

| Entry / dependency | Evidence | Result |
| --- | --- | --- |
| Order list → “Tạo phiếu xử lý” | `src/domains/order/ui/list/OrderListRow.tsx`, `src/domains/order/client/OrderListClient.tsx` (`openWorkCaseFromOrder`, `RaiseWorkCaseModal`) | A visible row action still opens a real creation dialog. |
| Creation dialog → server action → repository | `src/domains/work-case/ui/RaiseWorkCaseModal.tsx`, `actions/work-case.actions.ts`, `server/work-case.service.ts`, `server/work-case.repo.ts` | `createWorkCaseAction` requires `WORK_CASE_MANAGE`; creates a WC reference, source links, raiser/assignee and RAISED activity. It does not itself create a TaskItem. |
| Work Case list / detail / settings | `src/app/(admin)/admin/work-cases/page.tsx`, `[id]/page.tsx`, `settings/page.tsx`; `WorkCaseListClient.tsx` | Still render components; list opens `/admin/work-cases/:id`. These are not redirect-only pages. |
| Work Case → task creation | `src/domains/work-case/client/WorkCaseDetailClient.tsx` (`openCreateTask`), `src/domains/task/ui/quick-create/TaskQuickCreateModal.tsx`, `src/domains/task/actions/task.actions.ts` | Passes `workCaseId`, watch, title and description to `createTaskAction`. Existing related tasks are loaded via `WORK_CASE_INCLUDE.tasks` and shown on the detail. |
| Task → Work Case navigation | `src/domains/task/server/core/task-query.repo.ts`, `task-item-detail.repo.ts`, `src/domains/task/ui/detail/TaskExecutionPanel.tsx`, `ui/execution/execution-ui.utils.ts` | WORK_CASE targets still resolve to the real detail route; relevant only when these adapters/records are used. |
| Work Case visibility / updates | `src/domains/work-case/server/work-case.service.ts`, `server/work-case.repo.ts`, `actions/work-case.actions.ts` | Access is checked against raiser/assignee or broad permissions; updates write status timestamps and activity. No access changes made here. |
| Support activity adapter | `src/domains/task/actions/task-support.actions.ts` | Can write WorkCase activity for a task with `workCaseId`. Source search found no caller of `requestSubtaskSupportAction`; do not count this as a proven current UI flow. |

## Current Work and Operations screens

- The main menu's “Quản lý công việc” points at `/admin/personal-work`. Personal work uses TaskItem/checklist/calendar infrastructure. Searches of `src/domains/personal-work` found no direct `workCase` / `WORK_CASE` / `/admin/work-cases` reference.
- Searches of `src/domains/coordination` found no direct WorkCase reference. Operations does actively read, create and update TaskItems and workspace bindings (`coordination-event-consumer.ts`, `coordination-cycle.service.ts`, `coordination-dashboard.service.ts`, `OperationCoordinationWorkspace.tsx`). Names such as `srCaseTaskItemId` refer to service-related tickets and are not proof of a WorkCase dependency.
- `/admin/tasks`, `/admin/tasks/:id` and `/admin/task-items/:id` are retired routes redirecting to Operations. This removes old screens, not TaskItem storage or operations logic.

## Inconsistencies requiring a separate decision

1. **Legacy task UX:** WorkCase still offers “Tạo task”, while old task detail routes redirect to Operations. Verify the generated task's destination and discoverability with an authenticated fixture before migrating or removing that action. Existence of the task relation alone does not prove current operations ingest all WorkCase work.
2. **Permission semantics differ:** the WorkCase list page considers `TASK_MANAGE`, `WORK_CASE_MANAGE` or a string ADMIN role for its UI controls; `authCanManageWorkCases` treats `WORK_CASE_VIEW_ALL` / `TASK_VIEW_ALL` as management capability; mutation actions separately require `WORK_CASE_MANAGE`. These definitions can disagree. Do not normalize them as part of a presentation change: deciding whether view-all grants editing is an access-policy decision.
3. **Creation entry visibility:** the Order list passes its creation callback into the row action. Server creation still enforces `WORK_CASE_MANAGE`; the entry does not establish that every viewer can create a record successfully. Align UI visibility only after checking the intended permission policy.
4. **No evidence for safe deletion:** no live record count, outstanding WorkCase task count, user usage or migration coverage has been inspected. Do not delete models/routes/actions, detach records or auto-convert them to service requests based on this static review.

## Recommended follow-up

Keep current data and routes. Decide whether “Phiếu xử lý” should remain a linked exception record or migrate into a current Operations workflow. Then verify WorkCase → created task → Operations/Personal Work navigation and permissions with seeded authenticated cases. Only after that should legacy task controls or links be changed. The acquisition UI migration in PR #145 does not depend on that decision.
