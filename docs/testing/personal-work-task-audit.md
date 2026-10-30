# Personal work and task audit

## Findings and changes

Personal work previously called the generic `createTask(PERSONAL)` service. That
looked up or created a weekly parent, looked up the last sibling sort order,
created an item, and sometimes updated the same item again for scheduling.
Ownership and visibility were inferred from the parent instead of the work.

New personal work is now a standalone `TaskItem`: `taskId` is null and
`personalOwnerUserId` is the authenticated owner. Schedule, progress, checklist,
watch links, shares and Google link all remain attached to that same item ID.
Creation no longer imports parent-task services or creates a weekly container.
Standalone business-object links also omit the parent Task ID. Tags for new
work are scoped to the owner and reused across dates rather than recreated for
each weekly parent.

`personal-work-access.ts` centralizes personal scope, ownership and view/edit
filters. Assignment alone does not grant ownership. Owner-only sharing remains
owner-only; editor/viewer access is retained. The dashboard, SQL stage insight
query, Google sync, category reassignment and local seeds support standalone
items. Auth ID extraction no longer pulls the task service into personal work.

Legacy generic task mutations reject personal work before modifying it. This
prevents bypassing personal share and checklist-finalization rules through the
older action endpoints. Workspace projections and technical issue synchronization
require a real workspace parent and ignore standalone links.

The two generic task list paths now share their count implementation and apply
the same access filter to both lists and counts. Legacy PERSONAL containers are
excluded. Unrelated private FREE tasks no longer appear in those lists/counts;
shared business/operation/service task visibility is retained.

Additional personal update fixes: changing only tags preserves the domain;
changing category preserves tags unless the caller replaces them; target-only
updates use the current domain; subtype-only updates persist; blank titles are
rejected; repeated IN_PROGRESS updates preserve the original start time.

## Migration and compatibility

`20261029093000_standalone_personal_work` adds an indexed direct owner relation
and relaxes the parent Task requirement for items/bindings. Database checks
still require every item to have an owner or parent, and every execution to
have an item or parent. Personal owners use a restrictive FK: disable a user
account rather than silently orphan its work.

The migration backfills owners from existing PERSONAL parents. It does not
delete, detach, regroup or rename existing tasks or items. IDs, tags, shares,
checklists, activities and Google links remain unchanged. Legacy creator and
parent-assignee ownership continues through the compatibility reader, including
the two-owner case. New work cannot be created through that legacy parent path.
Do not manually delete legacy parents: their old items still refer to them.

Only the guarded local test database has been migrated in this session. A
production release must generate the Prisma client and apply the migration
before starting the new application. The schema expansion keeps old records
readable and older writers valid. Once standalone records have been created,
an older application that queries only PERSONAL parents will not display those
new records. Rollback planning must therefore use a reader-compatible image;
for a staged production rollout, release the nullable-parent/direct-owner reader
first, then the standalone writer. Do not undo the migration or delete records
to roll back an image.

## Validation

- `npm run check:personal-work-boundary` rejects imports of generic parent-task
  core services/repositories from the personal-work domain.
- `npm run personal-work:smoke-standalone` checks creation across different weeks,
  no new parent tasks, ownership/shares, checklist locks, watch bindings,
  custom-category deletion, legacy co-owners, workspace guards, private task
  list isolation and shared list/count behavior. Cleanup uses only exact fixture
  IDs and verifies a digest of all pre-existing personal rows is unchanged.
- Scheduling and calendar smoke checks cover work types, times, invalid ranges,
  viewer/concurrent/no-op guards and mocked Google round trips.
- Stage-insight SQL fixtures check both legacy and standalone owner visibility.
- Browser CRUD checks create, reopen/edit/reload, hover and keyboard previews;
  they verify a null parent, unchanged original item IDs and unchanged parent
  count. No Google requests are sent.

## Watch photo review and daily shoot planning

Watch quick preview now separates Pool and Selected, with counts, selected
checkmarks and a full-size viewer. Pool membership (`SELECTED` lifecycle) is
distinct from final gallery selection (`ATTACHED`/`APPROVED`/`PUBLISHED` and
current ProductImage rows). Missing, quarantined and deleted assets are excluded
from both lists, including stale legacy references. The unselected count uses
the intersection by storage key; a separate cover cannot distort the count.
Photo quality remains a human decision. The single Xử lý media action reuses
the list's existing OpenTargetAction on Media Processing, including its exact
workspace binding/state and embedded route; other entry points use the existing
watch Media route. There is no separate Select photos action or gallery-write
path. Quick preview follows the admin UI language contract: flat metadata,
hairline section dividers, domain tones, shared avatar, one primary Media action
and secondary service/pricing/content actions. Shoot planning uses useUiMutation
and AsyncActionButton for scoped pending state and duplicate-submission guards.

Create Media task schedules a standalone personal MEDIA / PHOTOGRAPHY item for
the current owner on the selected Bangkok date. One open session is reused;
multiple sessions require a choice. Other media subtypes, other owners and
closed sessions are not silently reused. Existing hours, notes, progress and
shares are preserved. Watch bindings are idempotent, with per-watch shooting
instructions and private activity. A day-scoped transaction lock prevents
concurrent duplicate creation; a row lock and second scope check protect against
concurrent task edits. No weekly parent, Google request or business pipeline
transition is needed to plan the work. The receipt links directly to that item.
Private personal bindings/activities cannot become the context or content of
the global watch discussion.

## Responsiveness findings

Personal forms write directly to DB and refresh server data; checklist changes
also use optimistic UI with rollback. Some linked-calendar mutations still wait
for Google sync. Business Media mutations have durable events and consumers,
and workspace callers wait for projection delivery before refreshing. Event
creation itself is not evidence of a bottleneck; these are different paths.

Previously the watch preview waited for activity/mention-user reads alongside
its metadata. The watch UI now requests metadata first and discussion separately,
with independent loading/error state. Switching or closing previews aborts stale
requests. Thumbnail strips use the existing versioned 320px WebP thumbnail route,
with original-image fallback on thumbnail failure; full-size originals load on
opening the viewer. Per-request Server-Timing exposes metadata and activity time.
Read-only target searches no longer trigger a full personal-page refresh.

Validation adds `npm run personal-work:smoke-photoshoot`: concurrent creation,
same-day reuse, duplicate watch prevention, changed instructions, retained hours,
owner/date/status guards, multiple-session selection, private activity isolation,
zero business events/parent tasks and no network requests. Synthetic users and
their exact records are cleaned; a baseline digest verifies original personal
rows remain unchanged. Run DB fixture suites sequentially because their global
baseline checks intentionally detect other fixture mutations too.

Chrome verification uses controlled photo bytes on the real popup and holds
discussion for five seconds: photos/tabs/viewer remain usable first. Real server
actions append to an exact fixture session, preserve its schedule/note, and the
receipt opens the edit form. The fixture is removed and original owner item IDs
remain unchanged. This proves request independence, not production NAS latency.
