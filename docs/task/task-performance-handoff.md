# Task Performance Handoff

Date: 2026-07-01

## Context

TaskItem is moving toward the central collaboration/work coordination unit. Recent work added a standalone Task Item list/detail flow, improved Task detail UI, removed inline timeline expansion from TaskItem rows, and started performance work because admin list/detail pages were taking several seconds to tens of seconds in local dev.

The current environment appears to be local Next.js dev server using a remote Supabase/Postgres database. The perf logs strongly suggest remote DB latency/connection serialization and shared admin layout queries were a major source of slowness, not just large data volume.

## Main Findings

### 1. Admin layout was blocking every admin page

`src/app/(admin)/admin/layout.tsx` used to call `getSideMenuNotificationCounts()` on every admin page render.

The attached perf log showed:

```txt
[perf:admin-layout] sidebarCounts=5750ms
[perf:admin-layout] sidebarCounts=8325ms
[perf:admin-layout] sidebarCounts=10881ms
[perf:admin-layout] sidebarCounts=13431ms
```

Inside sidebar counts, 8 DB count queries were running and appeared to serialize/queue with roughly 300ms increments. This made all admin pages slow.

Current state:

- `layout.tsx` no longer imports/calls `getSideMenuNotificationCounts`.
- `AdminSidebar` is rendered without `notifications`.
- `src/app/(admin)/admin/_server/sidebar-notifications.ts` still exists and is instrumented, but is no longer on the layout critical path.

Next option:

- Either keep sidebar badges disabled, or reintroduce them later through a lazy client fetch/cache endpoint, not server layout blocking.

### 2. Notification polling was spamming the API

`src/app/(admin)/admin/__hooks/useNotifications.ts` was polling:

```txt
/api/admin/notifications?take=6
```

every 15 seconds. The log showed repeated requests taking seconds.

Current state:

- Removed automatic mount fetch.
- Removed `setInterval`.
- Notification dropdown now fetches only when the bell is clicked.

### 3. Task list was over-fetching

Before optimization, `/admin/tasks` loaded all `taskItems`, `executions`, checklists, workflow/timeline hydrations for every task row. That caused extremely slow list renders, e.g. `30843ms`.

Current state:

- Added `src/domains/task/server/core/task-list.repo.ts`.
- Added `src/domains/task/server/core/task-list.service.ts`.
- `src/app/(admin)/admin/tasks/page.tsx` now imports from `task-list.service`, not the large `task.service`.
- Task list rows use a narrow `select`, not full `TASK_INCLUDE`.
- Initial task list response sets:
  - `taskItems: []`
  - `executions: []`
  - `_detailLoaded: false`
  - `taskProgressSummary`
- `TaskListTable` lazy-loads a single task via `getTaskDetailAction(row.id)` when expanding a task.

Important files:

- `src/domains/task/server/core/task-list.repo.ts`
- `src/domains/task/server/core/task-list.service.ts`
- `src/app/(admin)/admin/tasks/page.tsx`
- `src/domains/task/ui/list/TaskListTable.tsx`

### 4. TaskItem detail got a narrow path

TaskItem detail used to import the larger task service/repo path.

Current state:

- Added `src/domains/task/server/core/task-item-detail.repo.ts`.
- Added `src/domains/task/server/core/task-item-detail.service.ts`.
- `src/app/(admin)/admin/task-items/[id]/page.tsx` uses this narrow detail service.
- It avoids loading full `TaskExecution` rows unless needed.

### 5. TaskItem row no longer expands full timeline inline

The TaskItem row now shows compact chips outside:

- feedback count
- comment count
- activity count
- binding count

The full timeline/detail should be viewed inside TaskItem detail.

Current file:

- `src/domains/task/ui/task-work/TaskItemRow.tsx`

## Perf Instrumentation

Added helper:

```txt
src/lib/server-perf.ts
```

It logs only outside production:

```txt
[perf:<scope>] <label>=<ms>ms
```

Currently instrumented:

- `src/app/(admin)/admin/layout.tsx`
  - `admin-layout/getCurrentUser`
  - `admin-layout/totalBeforeRender`
- `src/app/(admin)/admin/tasks/page.tsx`
  - `tasks-page/requirePermission`
  - `tasks-page/getTaskListPageData`
  - `tasks-page/totalBeforeRender`
- `src/domains/task/server/core/task-list.service.ts`
  - `task-list-service/listRows`
  - `task-list-service/viewCounts`
  - `task-list-service/kindCounts`
  - `task-list-service/users`
  - `task-list-service/total`
- `src/domains/task/server/core/task-list.repo.ts`
  - `task-list-repo/taskFindMany`
  - `task-list-repo/taskCount`
  - `task-list-repo/progressTotalGroupBy`
  - `task-list-repo/progressDoneGroupBy`
  - `task-list-repo/countView*`
  - `task-list-repo/kindGroupBy`
  - `task-list-repo/assignableUsersFindMany`
- `src/app/(admin)/admin/_server/sidebar-notifications.ts`
  - still has per-count instrumentation, but is no longer called by layout.

When continuing, reload `/admin/tasks` twice. Ignore the first request if it includes Next dev compile. Use the second request to judge.

## Import/Compile Warnings Seen

The user supplied a full log with multiple warnings.

Fixed or partly addressed:

- `task.actions.ts` imported missing `quickCreateTaskItem`.
  - `quickCreateTaskItem` was restored in `src/domains/task/server/core/task.service.ts`.
- Missing task setting exports:
  - `TASK_DOMAIN_LABEL`
  - `TASK_COMPLETION_MODE_LABEL`
  - `listTaskCompletionRuleOptions`
  - Added in:
    - `src/domains/task/utils/task-labels.ts`
    - `src/domains/task/server/task-rule-keys.ts`

Still likely unresolved from the log:

- `src/domains/media/server/media-asset.service.ts`
  - missing `organizeActiveLooseNasFiles` from `./nas-media.service`
- `src/domains/order/server/payment/order-payment.service.ts`
  - missing/reexport mismatch:
    - `getOrderPaymentSummaryTx`
    - `recomputeOrderPaymentRollupTx` / `recomputeOrderOperationalStateTx`
- `src/domains/watch/server/bridge/watch-bridge.service.ts`
  - missing `createConsignToFromProduct` from acquisition server
- `src/domains/watch/server/index.ts`
  - conflicting star exports for `updateWatchPricing`

These warnings are not necessarily blocking Task list, but they keep the dev compiler noisy and can cause extra compile work, especially when `/admin/watches` is touched.

## Current Dirty/Important Files

New files:

- `src/app/(admin)/admin/task-items/page.tsx`
- `src/domains/task/client/TaskItemListClient.tsx`
- `src/domains/task/server/core/task-item-detail.repo.ts`
- `src/domains/task/server/core/task-item-detail.service.ts`
- `src/domains/task/server/core/task-list.repo.ts`
- `src/domains/task/server/core/task-list.service.ts`
- `src/lib/server-perf.ts`
- `docs/task/task-performance-handoff.md`

Modified files include:

- `src/app/(admin)/admin/layout.tsx`
- `src/app/(admin)/admin/tasks/page.tsx`
- `src/app/(admin)/admin/task-items/[id]/page.tsx`
- `src/app/(admin)/admin/__hooks/useNotifications.ts`
- `src/app/(admin)/admin/_client/AdminTopBar.tsx`
- `src/app/(admin)/admin/_client/AdmidSideBar.tsx`
- `src/app/(admin)/admin/_server/sidebar-notifications.ts`
- `src/domains/task/actions/task.actions.ts`
- `src/domains/task/client/TaskDetailClient.tsx`
- `src/domains/task/client/TaskItemDetailClient.tsx`
- `src/domains/task/server/core/task-query.repo.ts`
- `src/domains/task/server/core/task.service.ts`
- `src/domains/task/server/business-binding.repo.ts`
- `src/domains/task/server/business-binding.types.ts`
- `src/domains/task/server/task-rule-keys.ts`
- `src/domains/task/server/task.types.ts`
- `src/domains/task/ui/list/TaskListTable.tsx`
- `src/domains/task/ui/task-work/TaskItemRow.tsx`
- `src/domains/task/utils/task-labels.ts`

There is also a generated manifest dirty file:

- `src/features/__generated__/zod/.prisma-zod-generator-manifest.json`

Do not revert it blindly unless you confirm it is unwanted generated churn.

## Verification Already Run

Lint passes for the main touched paths, sometimes with old `no-explicit-any` disabled where files already had type debt:

```txt
npx eslint src/lib/server-perf.ts "src/app/(admin)/admin/layout.tsx" "src/app/(admin)/admin/_server/sidebar-notifications.ts" "src/app/(admin)/admin/tasks/page.tsx" src/domains/task/server/core/task-list.service.ts src/domains/task/server/core/task-list.repo.ts --max-warnings=0
```

```txt
npx eslint src/domains/task/server/core/task.service.ts --rule "@typescript-eslint/no-explicit-any: off" --rule "@typescript-eslint/no-unused-vars: off" --max-warnings=0
```

```txt
npx eslint src/domains/task/utils/task-labels.ts src/domains/task/server/task-rule-keys.ts src/domains/task/client/TaskTypeSettingsClient.tsx src/domains/task/ui/settings/TaskActionFormModal.tsx src/domains/task/ui/settings/TaskTypeFormModal.tsx --rule "@typescript-eslint/no-explicit-any: off" --max-warnings=0
```

Full `tsc --noEmit` was not reliable earlier because the repo already has unrelated type debt in old files.

## Recommended Next Steps

1. Restart dev server on the next machine to clear stale compile state.
2. Reload `/admin/tasks` twice.
3. Check that no `[perf:sidebar-counts]` logs appear for normal admin page loads.
4. Look at:
   - `[perf:admin-layout] getCurrentUser`
   - `[perf:tasks-page] requirePermission`
   - `[perf:task-list-service] listRows/viewCounts/kindCounts/users`
   - `[perf:task-list-repo] taskFindMany/taskCount/countView*/kindGroupBy`
5. If DB timings still climb in ~300ms increments, investigate Supabase connection pooling / Prisma connection string:
   - pooled vs direct URL
   - pgbouncer setting
   - SSL/TLS remote latency
   - whether dev server creates too many Prisma clients
6. Clean remaining import warnings from Watch/media/order barrels to reduce dev compile noise.
7. Once performance is stable, remove or gate perf logs behind an env flag such as `PERF_LOG=1` instead of always logging in dev.
