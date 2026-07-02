# S011-S014: Coordination Platform Handoff

## Purpose

This document records what was implemented after the Product Bible so work can continue on another machine without relying on chat history.

Product source of truth:

- `docs/product/business-collaboration-platform.md`

Architecture decisions preserved:

- `Task` = Coordination Cycle / Dieu phoi.
- `TaskItem` = Work Ticket / Phieu xu ly.
- `BusinessBinding` = queue persistence between Work Ticket and Business Object, backed by existing `TaskExecution`.
- `Activity` = Conversation Unit.
- `BusinessEvent` = source of truth from Business Domain.
- Business Domain does not know Coordination.
- Coordination Router only resolves route; consumers create bindings/activities.

## Sprint 11 - Coordination Router Framework

Added module:

- `src/domains/coordination/server/coordination-router.types.ts`
- `src/domains/coordination/server/coordination-router.registry.ts`
- `src/domains/coordination/server/coordination-router.service.ts`
- `src/domains/coordination/server/index.ts`

Main APIs:

- `registerCoordinationRoute()`
- `registerCoordinationRoutes()`
- `getCoordinationRoute()`
- `listCoordinationRoutes()`
- `resolveRoute()`
- `resolveWorkType()`
- `routeBusinessEvent()`

Route shape:

```ts
type CoordinationRoute = {
  eventKey: string;
  targetType: string;
  coordinationType: string;
  workTypeKey: string;
  enabled: boolean;
  metadata?: Record<string, unknown> | null;
};
```

Sample routes:

- `watch.content.submitted -> WATCH -> operation -> publish`, enabled.
- `watch.content.rejected -> WATCH -> operation -> publish`, disabled.

Boundary:

- Router does not import Watch, Order, Service, UI, Prisma, BusinessBinding, Activity, Workflow, or Notification.
- Router only resolves.

## Sprint 12 - Coordination Event Consumer V1

Added:

- `src/domains/coordination/server/coordination-event-consumer.ts`

Updated:

- `src/domains/event/server/business-event.service.ts`
- `src/domains/task/server/business-binding.repo.ts`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/business-binding.types.ts`
- `src/domains/task/server/activity/task-item-activity.service.ts`

Consumer flow:

```text
BusinessEventLog
  -> consumeBusinessEventForCoordination()
  -> routeBusinessEvent()
  -> find active Coordination Cycle
  -> find Work Ticket
  -> ensure AUTO BusinessBinding
  -> ensure BUSINESS_EVENT Activity
```

Skip reasons:

- `NO_ROUTE`
- `ROUTE_DISABLED`
- `UNSUPPORTED_COORDINATION_TYPE`
- `UNSUPPORTED_TARGET_TYPE`
- `MISSING_BUSINESS_EVENT_LOG_ID`
- `MISSING_TARGET_ID`
- `NO_ACTIVE_COORDINATION_CYCLE`
- `NO_WORK_TICKET`

Idempotency:

- Binding: checks existing `taskItemId + targetType + targetId` before creating.
- Activity: existing service idempotency by `taskItemId + BUSINESS_EVENT + sourceId`.

Pipeline:

- Added Coordination consumer after Workflow, Notification, and Timeline.
- Coordination consumer errors are caught and logged.
- Coordination failure does not block `recordBusinessEvent()`.

Important boundary:

- Timeline projection remains untouched.
- Workflow and Notification remain untouched.

## Sprint 13 - Coordination Cycle And Fixed Work Tickets

Added:

- `src/domains/coordination/server/coordination-cycle.types.ts`
- `src/domains/coordination/server/coordination-cycle.service.ts`
- `src/domains/coordination/server/coordination-work-type.registry.ts`

Coordination contexts:

- `OPERATION`
- `SALES`
- `TECHNICAL`
- `GENERAL`

Fixed Work Type registry:

```text
OPERATION
- publish: Đăng bài
- review-content: Review Content
- review-image: Review Image
- photo-shoot: Chụp hình
- strap-change: Thay dây
- other: Khác

SALES
- quote: Báo giá
- price-adjustment: Điều chỉnh giá
- sale: Sale
- marketing: Marketing
- other: Khác

TECHNICAL
- inspection: Kiểm tra
- repair: Sửa chữa
- warranty: Bảo hành
- other: Khác

GENERAL
- other: Khác
```

Main APIs:

- `getWeekRange(date?)`
- `resolveCoordinationCycle(db, input)`
- `ensureCoordinationCycle(db, input)`
- `ensureWorkTickets(db, input)`
- `listWorkTypes(context)`
- `getWorkTypeDefinition(context, key)`
- `getWorkTypeKeyFromTicketNote(note)`

Cycle title mapping:

- `OPERATION -> Vận hành tuần {weekNumber}`
- `SALES -> Bán hàng tuần {weekNumber}`
- `TECHNICAL -> Kỹ thuật tuần {weekNumber}`
- `GENERAL -> Khác tuần {weekNumber}`

Idempotency:

- Coordination Cycle uses existing Task fields:
  - `title`
  - `kind`
  - `periodType = WEEKLY`
  - `periodKey = YYYY-W##`
  - not cancelled
- Work Ticket uses:
  - `taskId + title`
- Work Type marker is stored in `TaskItem.note`:
  - `workTypeKey: publish`

No Prisma schema change was made.

TaskItem ownership note:

- Product direction changed from Creator/Assignee to Owner/Shared Users.
- Existing schema does not have Owner/Shared Users fields yet.
- V1 leaves `assignedToUserId = null` when auto-creating fixed Work Tickets.

## Sprint 14 - Operation Coordination Workspace

Added route:

- `/admin/coordination/operation`
- File: `src/app/(admin)/admin/coordination/operation/page.tsx`

Added server DTO/query:

- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/domains/coordination/server/coordination-dashboard.service.ts`

Added UI:

- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`

Updated menu:

- `src/app/(admin)/admin/_client/AdmidSideBar.tsx`
- Added menu item under Coordination:
  - label: `Vận hành`
  - href: `/admin/coordination/operation`

Workspace behavior:

- Requires `TASK_VIEW`.
- Ensures the current Operation Coordination Cycle exists.
- Ensures fixed OPERATION Work Tickets exist.
- Shows weekly Operation workspace.
- Clicking a Work Ticket opens:
  - `/admin/task-items/{id}`

UI sections:

- Header: `Điều phối Vận hành`
- Filters:
  - week select
  - date input
- Report cards:
  - Phiếu xử lý
  - Queue
  - Đang xử lý
  - Feedback
  - Hoàn thành
  - Quá hạn
- Work Ticket list:
  - Tên
  - Owner
  - Queue Count
  - Need Attention
  - Feedback Count
  - Last Activity
  - Updated At
  - Progress

Product wording:

- UI calls `BusinessBinding` count `Queue`.
- UI does not show BusinessBinding.
- UI does not show direct Business links.

## Sprint 15 - Queue Summary

Goal:

- Do not build Queue Detail.
- Upgrade only the per Work Ticket summary.
- Replace single `Queue` count in the Work Ticket row with:
  - `Ready`
  - `Review`
  - `Feedback`
  - `Done`
- Do not use charts.
- Do not add heavy color treatment.
- Do not hydrate Business objects.
- Do not change Business Logic, Activity, or Workflow.

Updated DTO:

- `QueueSummaryDTO`
- `CoordinationWorkTicketSummaryDTO.queueSummary`

Queue summary mapping:

- `Ready`: queue count when Work Ticket status is `TODO`.
- `Review`: queue count when Work Ticket status is `IN_PROGRESS`.
- `Feedback`: `BUSINESS_EVENT` activity count.
- `Done`: queue count when Work Ticket status is `DONE`.

Aggregation strategy:

- Keep `taskExecution.groupBy({ by: ["taskItemId"] })` for queue counts.
- Keep `taskItemActivity.groupBy({ by: ["taskItemId"] })` for feedback counts.
- No Queue Detail query.
- No Business object include/hydration.
- No N+1 query added.

Updated files:

- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/domains/coordination/server/coordination-dashboard.service.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `docs/sprints/CURRENT.md`
- `docs/sprints/S011-S014-coordination-handoff.md`

Validation:

- Scoped ESLint passed for the updated Coordination DTO/service/UI files.

## Dashboard Query Strategy

File:

- `src/domains/coordination/server/coordination-dashboard.service.ts`

Strategy:

- Load only the Operation cycle and its TaskItems.
- Do not include full queue detail.
- Do not include Activity detail/replies.
- Use aggregation:
  - `taskExecution.groupBy({ by: ["taskItemId"] })` for Queue Count.
  - `taskItemActivity.groupBy({ by: ["taskItemId"] })` for Activity/Feedback summary.
  - One small projection query for latest activity title.
- Avoid N+1.

Current Progress calculation:

```text
Queue Summary =
queue: total bindings for ticket
waiting: queue count if ticket is not DONE
feedback: BUSINESS_EVENT activity count
done: queue count if ticket is DONE
```

Known limitation:

- There is no per-binding queue status yet, so waiting/done are derived from Work Ticket status.
- Feedback count currently uses `BUSINESS_EVENT` activity count as a lightweight V1 signal.

## Validation Already Run

Targeted ESLint passed for changed Coordination/UI files.

Scoped TypeScript checks passed using temporary `tsconfig` files that were deleted after validation.

Full repo typecheck was not clean before this work. Known out-of-scope failures mentioned during implementation:

- `src/note.ts`
- `component for chatGPT/...`
- `src/domains/shared/timeline/server/timeline-renderer.service.ts`

## Current Working Tree Notes

Expected changed/untracked paths from this work:

- `docs/product/business-collaboration-platform.md`
- `docs/product/01-coordination.md` deleted
- `docs/sprints/S011-S014-coordination-handoff.md`
- `src/domains/coordination/**`
- `src/app/(admin)/admin/coordination/operation/page.tsx`
- `src/app/(admin)/admin/_client/AdmidSideBar.tsx`
- `src/domains/event/server/business-event.service.ts`
- `src/domains/task/server/business-binding.repo.ts`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/business-binding.types.ts`
- `src/domains/task/server/activity/task-item-activity.service.ts`

## How To Continue On Another Machine

1. Pull or copy the working tree.
2. Run `npm install` if dependencies are missing.
3. Run `npx prisma generate` if generated Prisma client is stale.
4. Read:
   - `docs/product/business-collaboration-platform.md`
   - this handoff file
5. Start app:
   - `npm run dev`
6. Open:
   - `/admin/coordination/operation`

## Next Suggested Sprint

Recommended next work:

- Add real Owner / Shared Users model or abstraction for Work Tickets.
- Add explicit queue status if progress must be per Business Object instead of per ticket.
- Add more Coordination Router routes mapping events to fixed Work Types.
- Consider creating Sales/Technical/General workspaces using the same dashboard query pattern.
- Clean existing global TypeScript failures before broad CI enforcement.
