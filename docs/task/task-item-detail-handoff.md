# TaskItem Detail / Business Collaboration Handoff

Date: 2026-06-30

## Goal

TaskItem is becoming the collaboration ticket / work unit.

Task remains the container. TaskItem Detail is the place to view:

- ticket metadata
- activity feed
- checklist
- business bindings

Current scope is still V1/read-only:

- no comment input
- no edit workflow
- no workflow action buttons
- no notification action buttons
- no TaskItem status mutation
- no Prisma schema change

## Route

Added route:

- `/admin/task-items/[id]`
- file: `src/app/(admin)/admin/task-items/[id]/page.tsx`

The page is intentionally server-only now:

1. read route param
2. `requirePermission("TASK_VIEW")`
3. load detail with `getTaskItemDetail(prisma, id, auth)`
4. `notFound()` if missing
5. serialize and render `TaskItemDetailClient`

UI lives in:

- `src/domains/task/client/TaskItemDetailClient.tsx`

## TaskItem Loading

Service:

- `src/domains/task/server/core/task.service.ts`
- `getTaskItemDetail(db, id, auth)`

Repo:

- `src/domains/task/server/core/task-query.repo.ts`
- `getTaskItemDetailRepo(db, id)`

The detail repo loads:

- TaskItem core fields
- assigned user
- parent task summary
- checklist rows
- timeline view models
- business bindings with readonly href

Important fix already made:

- `TASK_ITEM_INCLUDE` must be imported before spreading it in `getTaskItemDetailRepo`.
- This fixed runtime error: `TASK_ITEM_INCLUDE is not defined`.

## Navigation

TaskItem row / expanded task-work UI links to the detail page:

- `src/domains/task/ui/task-work/TaskItemRow.tsx`
- added link/button text like `Mo ticket` / `Chi tiet`
- existing inline expand/modal/actions remain unchanged

## Activity Feed V1

Timeline storage is unchanged.

View model files:

- `src/domains/shared/timeline/server/timeline-renderer.types.ts`
- `src/domains/shared/timeline/server/timeline-renderer.service.ts`
- exported from `src/domains/shared/timeline/server/index.ts`

Activity grouping rule:

- main block is `BUSINESS_EVENT`
- `BUSINESS_FEEDBACK` is rendered inside the related event block when `metadata.businessEventLogId` matches
- `USER_COMMENT` can stand alone
- fallback entries render as their own block
- order is ascending by activity time

There is one extra guard for feedback grouping:

- a feedback is not grouped into an older event if it happened after a later business event
- this prevents a third rejection from being attached to the first rejection thread after a later submit event

Current UI grouping is also mirrored inside `TaskItemDetailClient.tsx` so the client component does not import runtime code from `shared/timeline/server`.

## Timeline Consumer / Projection

File:

- `src/domains/shared/timeline/server/timeline-event-consumer.ts`

Changes made:

- projects `BUSINESS_EVENT`
- projects `BUSINESS_FEEDBACK`
- relates business events/feedback back to TaskItems through binding target aliases
- for watch events, aliases include watch id and product id where available
- feedback activity time uses `metadata.feedbackCreatedAt` when available

Reason:

- TaskItem activity feed must show events emitted from the linked business object, even when the business binding stores product id but the event payload references watch id, or vice versa.

## Watch Review Events

File:

- `src/domains/watch/server/review/watch-review.service.ts`

Changes made:

- submitting content/image review emits business events:
  - `watch.content.submitted`
  - `watch.image.submitted`
- rejecting content/image emits business feedback plus business event data needed by the timeline
- reject event target id includes feedback id:
  - `${watch.id}:${targetType}:${feedback.id}`

Reason:

- repeated rejections must become separate event occurrences
- the third rejection should appear after the later submit event, not inside the first rejection thread

Registry:

- `src/domains/event/registry/business-event-registry.ts`
- added submitted event keys

## Business Binding

Files touched:

- `src/domains/task/server/business-binding.repo.ts`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/business-binding.types.ts`
- `src/domains/task/server/core/task-query.repo.ts`

Readonly detail page uses existing BusinessBinding abstraction.

Important behavior:

- Business binding cards show target type, target id, action type, and href when available.
- WATCH binding href must open `/admin/watches/[productId]`, not `/admin/watches/[watchId]`.
- `getTaskItemDetailRepo` resolves watch product ids for binding hrefs.

This fixed runtime error:

- opening a binding previously could throw `Khong tim thay watch` because watch id was sent to a route expecting product id.

## Client UI

File:

- `src/domains/task/client/TaskItemDetailClient.tsx`

Current design direction:

- header similar to ticket workspace
- breadcrumb: Tasks > parent task > task item > ticket ref
- back link to parent Task when available
- metadata grid:
  - assignee
  - due date
  - checklist count
  - parent task
  - ref
  - created time
- section nav uses real anchor links:
  - Tong quan
  - Activity
  - Checklist
  - Lien ket nghiep vu
  - Thong tin
- no fake buttons
- no fake filters
- no fake menu buttons

Activity card visuals:

- rejected event uses red `XCircle`
- submitted event uses green `Send`
- updated event uses blue `PencilLine`
- feedback/reason is shown inside a highlighted reason box
- removed the heartbeat-style icon

## Validation Already Run

These lint checks passed:

```bash
npx eslint 'src/app/(admin)/admin/task-items/[id]/page.tsx' src/domains/task/client/TaskItemDetailClient.tsx
npx eslint src/domains/task/server/core/task.service.ts
npx eslint src/domains/task/server/core/task-query.repo.ts
npx eslint src/domains/event/registry/business-event-registry.ts
npx eslint src/domains/watch/server/review/watch-review.service.ts
npx eslint src/domains/shared/timeline/server/timeline-event-consumer.ts
```

## Dirty Worktree Notes

Main intentional files from this work:

- `src/app/(admin)/admin/task-items/[id]/page.tsx`
- `src/domains/task/client/TaskItemDetailClient.tsx`
- `src/domains/task/server/core/task-query.repo.ts`
- `src/domains/task/server/core/task.service.ts`
- `src/domains/task/ui/task-work/TaskItemRow.tsx`
- `src/domains/shared/timeline/server/index.ts`
- `src/domains/shared/timeline/server/timeline-renderer.types.ts`
- `src/domains/shared/timeline/server/timeline-renderer.service.ts`
- `src/domains/shared/timeline/server/timeline-event-consumer.ts`
- `src/domains/event/registry/business-event-registry.ts`
- `src/domains/watch/server/review/watch-review.service.ts`
- `src/domains/task/server/business-binding.repo.ts`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/business-binding.types.ts`

There are also many generated zod files currently dirty under:

- `src/features/__generated__/zod/...`

Those should be reviewed separately before commit. Do not assume they are all part of TaskItem Detail UI.

## Recommended Next Steps

1. Run the app and manually open:
   - `/admin/task-items/[id]`
   - parent Task page
   - a business binding link from the TaskItem detail page
2. Test watch content review loop:
   - submit content
   - reject with reason
   - user updates content
   - submit again
   - reject again
3. Confirm Activity Feed order:
   - submit event appears before the later rejection
   - each rejection has its own event block
   - feedback reason is nested in the matching rejection block
4. Decide whether Business Binding card should show real watch thumbnail/title.
   - Current UI has a simple placeholder because the detail repo only returns binding/basic target data.
   - To show rich previews, reuse existing business entity preview abstraction instead of adding ad hoc watch queries.

## Constraints To Preserve

- Do not move UI back into `page.tsx`.
- Do not mutate TaskItem from the detail page in V1.
- Do not add Prisma schema changes for this sprint.
- Do not change Task/Watch/Order/Service domain logic unless the Activity Feed mapping truly requires it.
- Keep timeline storage as `TimelineEntry`; grouping belongs in view model/UI layer.
