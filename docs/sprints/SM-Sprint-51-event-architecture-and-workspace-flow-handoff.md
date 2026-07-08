# SM Sprint 51 - Event Architecture and Workspace Flow Handoff

Type: SM Mode

M2 vertical slice:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Notification
```

## Mission

Stabilize the Watch Media to Publish flow and prepare the event system for the
next architecture sprints without expanding scope into a large rewrite.

This handoff covers:

- Sprint 1: Business Event Contract and Audit.
- Sprint 2: Event Dispatch Hardening.
- Recent performance and correctness fixes in event dispatch.
- Current Workspace flow rules for Media Processing, Photoshoot, and Publish.

## Current State

The system now has a lightweight event architecture split across focused
modules:

- `src/domains/event/contract`
- `src/domains/event/catalog`
- `src/domains/event/registry`
- `src/domains/event/validator`
- `src/domains/event/emitter`
- `src/domains/event/dispatcher`
- `src/domains/event/server`
- `src/domains/event/audit`

This is intentionally not a full domain migration. The goal is to stop adding
business-event behavior into one large service and make the contract testable,
versionable, and auditable.

## Sprint 1 - Business Event Contract and Audit

### Scope

- Normalize the Business Event contract.
- Audit existing event keys and consumers.
- Build a readable Event Catalog.
- Add validation around event key, target, payload, and allowed consumers.
- Keep domain migration out of scope.

### Expected Output

- Event contract is explicit and versionable.
- Event catalog is readable from one place.
- Validator catches invalid payload/consumer combinations early.
- Business logic no longer hardcodes scattered event assumptions.

### Engineering Rules

- Contract, catalog, validator, emitter, dispatcher, and audit stay separate.
- Do not create a single God service for event processing.
- Business modules emit events; consumers react to events.
- Event keys should come from catalog/registry APIs, not ad hoc strings in new
  code.
- New contract changes should be additive unless a migration plan exists.

### Done / In Progress

- Event modules have been split into focused folders.
- Business event registry and catalog exist.
- Validator exists.
- Watch media events now carry stable aliases and an event instance id through
  `sourceId`.
- Audit scaffolding exists.

### Remaining Follow-Up

- Add unit tests for validator/catalog edge cases.
- Document required payload fields per event in the catalog.
- Add a small admin/audit view if operating the catalog from UI becomes useful.
- Gradually replace hardcoded event strings in business logic as files are
  touched.

## Sprint 2 - Event Dispatch Hardening

### Scope

- Standardize dispatcher behavior.
- Add idempotency rules.
- Make retry/timeout policy explicit.
- Return meaningful consumer result status.
- Keep dispatcher independent from business logic.

### Expected Output

- Dispatcher is stable and consumer-agnostic.
- Duplicate event instances do not duplicate effects.
- Retry/timeout behavior is visible and safe.
- Consumer result can distinguish:
  - `success`
  - `skipped`
  - `failed`
  - `timeout`

### Engineering Rules

- Dispatcher must not know Watch, Task, Notification, or Workspace business
  rules.
- Consumers can be added or removed without editing dispatcher logic.
- Consumer-specific side effects belong in each consumer.
- Dispatcher may normalize consumer result shape, but not interpret domain
  meaning beyond generic success/skipped/failed/timeout.

### Implemented Fixes

- Dispatcher now runs ordered consumers first, then parallel consumers.
- `coordination` is ordered so Workspace creation/handoff finishes before
  non-critical projections.
- Consumer timeout policy is explicit.
- Notification consumer timeout is higher than the default.
- Timeline consumer timeout is now `15000ms` because activity projection can be
  slower than 5s on current DB conditions.
- Dispatcher now classifies returned consumer results:
  - arrays with real applied items become `success`;
  - arrays where every item is skipped become `skipped`;
  - arrays with failed items become `failed`;
  - thrown timeout remains `timeout`.
- Notification app progress now only marks notification done when a real
  dispatch id exists.

### Remaining Follow-Up

- Add tests for dispatcher result normalization.
- Consider per-consumer retry only for idempotent consumers.
- Add durable consumer-attempt logs if operational debugging needs more than
  server logs.
- Consider moving long-running consumers to background jobs if request time
  becomes a product problem.

## Event Performance Notes

Recent observed slow spots:

```text
watch.media.ready_for_publish:consumer:coordination ~= 2.5s
watch.media.ready_for_publish:consumer:notification ~= 4.0s
watch.media.ready_for_publish:consumer:timeline ~= 5.0s+
```

### Fixes Applied

- Timeline activity projection no longer creates many activities through nested
  transaction helpers.
- Timeline now uses a lighter activity write path for business-event
  projection.
- Timeline timeout increased from default 5s to 15s.
- Notification result is no longer treated as success when all rule results are
  skipped.
- Zalo rule for `watch.media.ready_for_publish` no longer uses unavailable
  placeholders such as actor name or route.

### Important Limitation

Current `appLoading` progress is result-based, not true realtime.

The client starts a single server action and receives the detailed result only
after the server returns. The UI can show elapsed time while waiting, and then
show accurate final step status, but it cannot truthfully show that step 2 has
started while the server is still inside one long action unless the flow is
split.

True realtime progress needs one of these designs:

```text
Option A: split client steps
approve workflow -> create publish item -> dispatch notification -> refresh
```

```text
Option B: background job
start job -> poll job progress -> refresh when done
```

Keep this out of Sprint 2 unless the current request time remains a major UX
problem.

## Workspace Flow Contract

### Photoshoot Workspace

Purpose:

- Receive watches that need photos.
- Mark photoshoot complete.
- Move the item into Media Processing.

Key event:

- `watch.media.photoshoot.completed`

Rules:

- Photoshoot completion should create or activate Media Processing work.
- Returning an item for reshoot should reopen/route it back to Photoshoot and
  make the media image part not done.
- Activity should clearly say why the item returned.

### Media Processing Workspace

Purpose:

- Complete information/spec.
- Complete content.
- Complete image review.
- Approve media and hand off to Publish.

Key event:

- `watch.media.ready_for_publish`

Rules:

- `Save draft` saves both the Watch fields and current media progress.
- `Approve media` does not save Watch fields anymore; Watch saving belongs to
  the explicit save action.
- Approve media should:
  - mark content/image review approved;
  - emit `watch.media.ready_for_publish`;
  - create/update the Publish Workspace item;
  - dispatch notification if a rule exists and template values are valid;
  - refresh the Workspace.
- Manual done buttons are the source of progress truth. The modal should not
  infer done state from random field edits.
- If notification is skipped or fails, app progress must show warning/error, not
  a fake done state.

### Publish Workspace

Purpose:

- Receive media-ready watches.
- Prepare final posting assets and publish.

Key event:

- `watch.media.ready_for_publish`

Rules:

- When Media Processing approves again after recall, the Publish item must move
  back from `RECALLED` or `FEEDBACK` into an actionable publish state.
- Repeated ready events must be idempotent by event instance id, not by the
  reused business event log id only.
- Recall from Publish should:
  - move Publish item to recalled/feedback state;
  - reopen Media Processing when needed;
  - keep Publish row non-actionable until Media re-approves;
  - write activity for traceability.

## Notification Contract

For `watch.media.ready_for_publish`, the Zalo rule should use fields that are
guaranteed by the event payload:

```text
watchTitle
sku
businessStatus
```

Avoid placeholders that are not guaranteed for this event:

```text
actorName
route
activityTitle
```

If those fields become necessary, enrich the event payload first and update the
event contract/catalog.

## Operational Debug Checklist

When Media approval looks wrong, check in this order:

1. Workflow result:
   - Was `approve-media` applied?
   - Did Media Processing reach `DONE`?
2. Business event:
   - Was `watch.media.ready_for_publish` emitted?
   - Does metadata include a new `eventInstanceId` / `sourceId`?
3. Coordination:
   - Did Publish Workspace receive or update the item?
4. Notification:
   - Did notification consumer return `success`, `skipped`, `failed`, or
     `timeout`?
   - If `skipped`, inspect missing template values.
   - If `success`, confirm a `notificationDispatch` row exists.
5. Timeline:
   - If timeline times out, workflow may still be correct, but activity may be
     missing or delayed.
   - Recheck server logs and activity rows before assuming business flow failed.

## Out Of Scope

- Full domain migration.
- Realtime progress/job queue implementation.
- Rewriting all Workspace UI.
- Replacing Prisma/Supabase connection strategy.
- Building a complete notification admin redesign.
- Moving bracelet/strap inventory into this sprint.

## Next Recommended Work

### Sprint 51A - Stabilization Tests

- Add tests for dispatcher result normalization.
- Add tests for notification missing-template skip.
- Add tests for media approve after recall.
- Add tests for Publish item state after re-approve.

### Sprint 52 - True Progress or Background Job

Choose only if approval/recall remains too slow for operators.

Recommended direction:

```text
start media approval job
-> persist job steps
-> poll progress from client
-> render real step progress
-> refresh Workspace on completion
```

Do not fake realtime progress inside one long server action.

## Acceptance

This handoff is valid if the next implementation keeps these guarantees:

- Event modules remain split by responsibility.
- Dispatcher stays consumer-agnostic.
- Consumer status reflects real side effects.
- Notification done means a dispatch was created/sent, not just that the
  consumer returned without throwing.
- Media approve can move a recalled item back into Publish actionably.
- Timeline failure does not hide the status of workflow, coordination, or
  notification.
- Workspace UI does not present actions that are invalid for the current
  Workspace state.
