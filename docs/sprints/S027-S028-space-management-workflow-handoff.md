# S027-S028: Space Management + Manual Workflow Handoff

Date: 2026-07-03

## Current Goal

Move the collaboration framework language to Space Management and continue with
Manual Workflow Engine V1.

Product hierarchy:

```text
Business
  -> BusinessEvent
  -> Space Management
  -> Space
  -> Workspace
  -> Items
  -> Workflow Runtime
  -> Activity
  -> Discussion
```

## Language Contract

Use the new language for all new product/application code:

| Legacy | New |
| --- | --- |
| Task | Space |
| TaskItem | Workspace |
| BusinessBinding | Item |
| Queue | Items |
| WorkType | WorkspaceTemplate |
| Coordination | Space Management |
| Reply | Discussion |

Prisma stays unchanged:

- `Task` persists Space.
- `TaskItem` persists Workspace.
- `TaskExecution` persists Item.
- `TaskItemActivity` persists Activity.
- `TaskItemActivityReply` persists Discussion.

Do not rename Prisma schema/models yet.

## Completed

### Space Management UI Language

- Sidebar group now uses `Space Management`.
- Context menu items are `Operations`, `Sales`, `Technical`, `General`.
- Workspace template settings label is `Workspace Templates`.
- Workspace detail UI uses `Workspace`, `Items`, `Activity`, `Discussion`
  wording where touched.

### Space Dashboard

The former Operations dashboard component is now reused for all four contexts:

- `/admin/coordination/operation`
- `/admin/coordination/sales`
- `/admin/coordination/technical`
- `/admin/coordination/general`

The dashboard service is generalized through:

- `getCoordinationDashboard({ context })`
- `getOperationCoordinationDashboard()` remains as compatibility wrapper.

Current Space dashboard display:

- Breadcrumb: `Space Management > Operations Spaces` etc.
- Header: `Space Vận hành tuần 27` etc.
- Table section header: `Space Vận hành tuần 27` etc.
- Rows: `Workspace Đăng bài`, `Workspace Photography`, user-created
  `Workspace ...`.
- Report cards: `Workspaces`, `Items`, `In Progress`, `Feedback`, `Done`,
  `Overdue`.

Important implementation note:

- Display prefixing happens in the UI only.
- Stored DB titles are not mutated.

### Space Management Alias Layer

Added application alias module:

- `src/domains/space-management/server/index.ts`
- `src/domains/space-management/server/space-management.types.ts`
- `src/domains/space-management/index.ts`

New code can prefer:

- `getSpaceDashboard`
- `getOperationsSpaceDashboard`
- `getSpaceDetail`
- `getWorkspaceDetail`
- `getWorkspaceListPageData`
- `listWorkspaceItems`
- `summarizeWorkspaceItems`
- `listWorkspaceTemplates`

### Manual Workflow Engine V1

Manual workflow runtime already had transition support. Sprint 28 normalized it
toward Manual Action language.

Runtime APIs:

- `listAvailableManualActions(itemId)`
- `applyManualWorkflowAction(input)`

Input shape:

- `itemId` is currently implemented as the persisted binding id.
- Server compatibility still uses `bindingId`.
- New action path accepts `actionKey`.
- `toState` remains as fallback for compatibility.

Manual action DTO now includes:

- `actionKey`
- `label`
- `toState`
- `fromState`
- `enabled`
- `reason`
- `metadata`

Manual transition rules:

- Only `triggerType = MANUAL` can be applied.
- The current runtime state must match transition `fromState`.
- No state jumping.
- No BusinessEvent is emitted.
- Activity is created after a successful manual transition.

Activity generated after manual transition:

- Source: system activity helper.
- Title: actor label + manual action label.
- Body: optional note.
- Metadata includes item/binding id, target type, target id, workflow key,
  from state, to state, action key, action label, and `triggerType = MANUAL`.

Manual action labels were made more user-facing:

- Publish: `Đã đăng bài`
- Quotation: `Đã báo giá`, `Đang thương lượng`, `Khách đồng ý`,
  `Khách từ chối`
- Repair: `Kiểm tra`, `Đang sửa`, `Hoàn tất sửa`, `Đã bàn giao`
- General/simple: `Bắt đầu xử lý`, `Hoàn tất`

Items UI:

- Items tab shows workflow state.
- Manual actions render as small action chips/buttons.
- UI sends `actionKey` instead of only `toState`.
- No dropdown was added.

## Files Most Relevant Tomorrow

Space dashboard:

- `src/domains/coordination/server/coordination-dashboard.service.ts`
- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `src/app/(admin)/admin/coordination/operation/page.tsx`
- `src/app/(admin)/admin/coordination/sales/page.tsx`
- `src/app/(admin)/admin/coordination/technical/page.tsx`
- `src/app/(admin)/admin/coordination/general/page.tsx`

Manual workflow:

- `src/domains/task/server/business-binding-workflow.service.ts`
- `src/domains/task/server/business-binding.types.ts`
- `src/domains/task/actions/task.actions.ts`
- `src/domains/task/client/TaskItemDetailClient.tsx`
- `src/domains/workflow-definition/server/workflow-definition.registry.ts`

Language docs:

- `docs/architecture/07-space-management-language.md`
- `docs/architecture/06-item-runtime-contract.md`
- `docs/product/business-collaboration-platform.md`

## Validation Done

Targeted ESLint passed for:

```text
src/domains/coordination/server/coordination-dashboard.service.ts
src/domains/coordination/server/coordination-dashboard.types.ts
src/domains/coordination/server/index.ts
src/domains/coordination/ui/OperationCoordinationWorkspace.tsx
src/domains/space-management/server/index.ts
src/app/(admin)/admin/coordination/operation/page.tsx
src/app/(admin)/admin/coordination/sales/page.tsx
src/app/(admin)/admin/coordination/technical/page.tsx
src/app/(admin)/admin/coordination/general/page.tsx
src/domains/task/server/business-binding-workflow.service.ts
src/domains/task/server/business-binding.types.ts
src/domains/task/actions/task.actions.ts
src/domains/task/client/TaskItemDetailClient.tsx
src/domains/workflow-definition/server/workflow-definition.registry.ts
```

Full `tsc --noEmit` was not clean because of unrelated pre-existing parse
errors in old note/draft files, including:

- `src/note.ts`
- `component for chatGPT/...`

## Tomorrow Suggested Order

1. Open the four Space dashboards and visually confirm:
   - header title prefix `Space ...`
   - table rows prefix `Workspace ...`
   - week selector keeps the current context route.
2. Open a Workspace detail Items tab.
3. Trigger one manual workflow action.
4. Confirm:
   - workflow state changes.
   - Activity is created.
   - no BusinessEvent is created.
   - no duplicate Activity on repeated click/refresh.
5. Decide whether to rename UI component names from `Queue*` to `Item*`.
   This is internal cleanup only; product UI is already using Items wording.
6. Decide whether to add note input for manual action. Current path is low-click
   and direct, with optional note supported at API level.

## Known Legacy Names Still Present

Intentional compatibility names remain:

- `src/domains/task`
- `src/domains/coordination`
- `TaskItemDetailClient`
- `BusinessBinding`
- `QueueItem`
- `TaskItemActivityReply`
- routes such as `/admin/coordination/*` and `/admin/task-items/*`

Do not big-bang rename these unless a dedicated rename sprint is planned.

## Architecture Reminders

- Business Domain only emits `BusinessEvent`.
- Manual workflow action is a Workspace Action, not a BusinessEvent.
- Workflow Definition belongs to WorkspaceTemplate.
- Workflow Runtime belongs to Item.
- Activity owns Discussion.
- No Prisma schema changes for this phase.
