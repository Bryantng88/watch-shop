# Operation and Domain Architecture Audit — 2026-07-30

Status: remediation in progress  
Environment audited: development  
Architecture baseline:

- `docs/architecture/15-event-driven-domain-boundary.md`
- `docs/architecture/23-list-projection-consistency-production-gate.md`
- `docs/architecture/27-watch-cost-ledger-projection.md`
- `docs/architecture/28-durable-business-event-consumer-outbox.md`

## Purpose

This document preserves the evidence and remediation history for the
cross-domain audit performed before production. Future audits should append a
dated result to the history section instead of replacing this baseline.

Machine handoff and the authoritative remaining-work checklist:

- `docs/audits/2026-07-30-operation-audit-handoff.md`

## Required architecture

```text
User command
-> owning domain validates and writes business truth
-> BusinessEventLog and durable projection delivery are persisted atomically
-> transaction commits
-> application scheduler runs consumers after commit
-> completion barriers succeed
-> projection delivery reaches SUCCEEDED
-> client reconciles list, board, counters, actor and last action
```

Rules:

- A domain must not write another domain's projection or Workspace runtime.
- GET/list/detail reads must not repair or rebuild populated projections.
- UI progress must distinguish command acceptance from projection completion.
- User-triggered events must preserve the current `actorUserId`.
- List, board, stage count and dashboard must use the same projection contract.

## Baseline evidence

### Healthy foundations

- Projection delivery: `242 SUCCEEDED`, no blocked, pending, processing,
  retryable failed or dead delivery.
- Projection versions: no stale registered version.
- Watch List: 437 rows.
- Watch Cost Ledger: 437 rows.
- Order List and Detail: 74 rows each.
- Payment List: 228 rows.
- Service Request List: 61 source / 61 projection.
- Operation smoke found no duplicate IDs and no item returned in a wrong stage.
- Canonical Flow and Board Query Gateways are active.
- Dashboard GET paths do not run reconciliation writes.

### Performance baseline

| Flow | Stage | Read duration |
| --- | --- | ---: |
| Technical | Inspect | 1531 ms |
| Technical | Ready | 832 ms |
| Technical | Processing | 852 ms |
| Technical | Done | 809 ms |
| Payment | Review | 1283 ms |
| Payment | Settled | 909 ms |
| Media | Photography | 1056 ms |
| Media | Processing | 904 ms |
| Media | Publish | 898 ms |
| Media | Done | 963 ms |
| Shipment | Waiting | 1050 ms |
| Shipment | Processing | 791 ms |
| Shipment | Done | 995 ms |

## Findings and remediation tracker

### A-01 — Domain write and event/outbox are not atomic

Severity: critical  
Status: code migration substantially complete; runtime matrix pending

Evidence:

- Order and Shipment emitters use global Prisma.
- Shipment and several Order commands publish events after the domain
  transaction commits.
- Payment commands also record events after their transaction.

Risk:

Business truth can commit while BusinessEventLog/projection delivery does not.
The visible symptom is a successful action whose item, counter or board remains
in the previous state.

Required remediation:

- Event/outbox persistence accepts and uses the command transaction.
- Consumer execution remains after commit and never retains a transaction
  client.
- Application entry points pass the runtime scheduler.

Implemented:

- Added durable per-consumer outbox rows for coordination, workflow, timeline
  and notification.
- Added independent claim, retry, exponential backoff, stale-lock recovery and
  dead-letter states.
- Coordination/workflow now gate projection release.
- Projection maintenance drains consumer deliveries before projections.
- `recordBusinessEvent` no longer retains a transaction client while executing
  downstream consumers.

Remaining:

- Execute and document the per-command runtime/idempotency matrix listed in
  the handoff document before marking this finding remediated.

### A-02 — Operation progress does not consistently track delivery

Severity: critical  
Status: partially remediated

Evidence:

- Watch Media polls `ProjectionEventDelivery`.
- Generic Payment, Shipment and Technical actions mark progress complete from
  the command response or a timer.

Risk:

The UI reports completion before list/board/count projections are ready,
allowing duplicate user actions and stale refreshes.

Required remediation:

- All operation command results expose projection delivery keys.
- A shared delivery waiter drives progress and refresh.
- Optimistic removal remains allowed while reconciliation is pending.

Implemented:

- Added a shared operation delivery waiter with a 180-second bounded timeout.
- Payment and Shipment operation results now expose their projection delivery
  keys.
- Flow List and Payment Board wait for `SUCCEEDED` before reporting completion
  and refreshing.

Remaining:

- Technical actions must return their event delivery keys through the same
  adapter contract.
- Every remaining board/list action surface must adopt the shared waiter.

### A-03 — Direct projection writes outside the projection consumer

Severity: high  
Status: remediated in code; runtime verification pending

Evidence:

- Watch Workbench directly rebuilds Watch List after title/pricing saves.
- Payment core directly builds `payment-owner-summary`.

Required remediation:

- Emit catalogued domain events.
- Let registered projection builders update affected rows.

Implemented:

- Watch Workbench title saves now emit `watch.spec.updated`.
- Watch Workbench pricing saves now emit `watch.price.updated`.
- Payment command rollups now calculate source-domain settlement state and no
  longer invoke `payment-owner-summary` projection builders.

### A-04 — GET-time projection rebuild

Severity: high  
Status: remediated in code; runtime verification pending

Evidence:

- Order Detail builds a missing row during read.
- Payment owner summary builds missing rows during read.

Required remediation:

- Read returns projection state only.
- Missing rows are repaired through maintenance/backfill.

Implemented:

- Order Detail reads only the persistent `order-detail` projection.
- Single and batch Payment owner summary reads no longer build missing rows.
- Missing coverage is now a maintenance/backfill concern and cannot add write
  latency to GET requests.

### A-05 — Payment Operation uses a hybrid source read

Severity: high  
Status: open

Evidence:

- Payment Operation queries `Payment.findMany`, then joins bindings, activity
  and projection previews.
- `payment-list` already contains all 228 Payment rows.

Required remediation:

- Payment Operation pagination, filtering, sorting and stage counts read
  `payment-list`.
- Activity and binding hydration is limited to the current page.

### A-06 — Workspace runtime ownership leaks into business domains

Severity: high  
Status: open

Evidence:

- Watch Media writes `TaskExecution.metadataJson` directly.
- Order-from-task and Service-from-task create TaskExecution rows directly.
- Reshoot handling reads a coordination consumer result and then mutates its
  binding.

Required remediation:

- Domain events carry the required business payload.
- Workflow/Task application boundaries own TaskExecution mutation.
- Compatibility adapters must be explicit and centralized.

### A-07 — Actor propagation is incomplete

Severity: high  
Status: partially remediated

Fourteen-day event audit:

| Event | Missing actor |
| --- | ---: |
| `payment.status_updated` | 82 / 82 |
| `payment.paid` | 82 / 82 |
| `payment.created` | 21 / 21 |
| `acquisition.created` | 15 / 15 |
| `acquisition.posted` | 13 / 13 |
| `order.posted` | 3 / 3 |
| `shipment.created` | 2 / 2 |
| `watch.created` | 50 / 50 |
| `watch.publish.assets.downloaded` | 7 / 18 |

Required remediation:

- Shared command context requires actor for user-triggered commands.
- Only scheduled jobs, migrations and repair scripts may resolve to System.

Implemented for new operation mutations:

- Payment complete/split events now receive the authenticated actor from the
  operation adapter.
- Shipment-generated Payment events inherit the Shipment command actor.
- Watch Workbench title/pricing events preserve the authenticated actor.

Historical rows remain unchanged; the table above is retained as baseline
evidence.

### A-08 — Flow count contract is inconsistent

Severity: medium  
Status: remediated in code; runtime verification pending

Evidence:

- Technical and Media Flow Query responses contain stage counts.
- Payment and Shipment responses return an empty `stageCounts` object while
  their paginated totals are populated.

Required remediation:

- Each flow gateway returns stage counts from the same projection/filter scope
  as its list and board.

Implemented:

- Non-Media/Technical flows now aggregate stage counts from the same canonical
  Workspace queue count map used by their flow response.

### A-09 — Coordination summary coverage is incomplete

Severity: medium  
Status: open

Evidence:

- Non-cancelled TaskItem source: 324.
- `coordination-workspace-summary`: 320.

Required remediation:

- Identify four missing rows.
- Repair projection rows without replaying business side effects.
- Add coverage to the production gate.

### A-10 — Payment implementation is fragmented

Severity: medium  
Status: open

Evidence:

- `src/domains/payment/server`
- `src/domains/payment/payment/server`
- `src/app/(admin)/admin/payments/_server`
- legacy `payment.service copy.ts`

Required remediation:

- Select one canonical Payment application boundary.
- Convert remaining imports to compatibility re-exports before deleting legacy
  implementations.

## Production gate

Production is not approved while any critical finding is open.

Minimum gate:

- atomic domain write/event/outbox on all operation-visible commands;
- delivery-aware progress for all flow actions;
- zero direct projection writes from domain/UI code;
- zero GET-time projection rebuild;
- zero stale/failed projection delivery;
- source/projection coverage passes;
- actor is present for user-triggered smoke actions;
- list, board and stage counts reconcile after each smoke mutation.

## Audit history

### 2026-07-30 — Initial baseline

- Static architecture audit completed.
- Read-only database projection and flow smoke completed.
- Findings A-01 through A-10 recorded.
- Remediation started.

### 2026-07-30 — Remediation pass 1

- Removed Watch Workbench direct Watch List rebuilds.
- Removed Payment command calls into projection builders.
- Removed Order Detail and Payment owner summary GET-time repair writes.
- Targeted ESLint passed for all changed projection/workbench files.
- Full TypeScript validation remains blocked by pre-existing invalid
  `src/note.ts` and `component for chatGPT/**/note.ts` source files; those files
  were not changed by this audit.
- A-01 requires a durable after-commit consumer-delivery design. Moving the
  current synchronous consumer fan-out into a Prisma transaction would extend
  locks and reintroduce timeout risk, so that shortcut was explicitly rejected.

### 2026-07-30 — Remediation pass 2

- Added shared operation projection-delivery polling.
- Payment completion/split and Shipment operational commands return delivery
  handles to the UI.
- Shipment actions now pass the Next after-commit scheduler to event dispatch.
- Flow List and Payment Board reconcile only after tracked deliveries succeed.
- Added Payment/Shipment stage counts to the common Flow Query response.
- Propagated authenticated actors through Payment, Shipment-payment and Watch
  Workbench events.
- Targeted ESLint passed for all pass-2 files.

### 2026-07-30 — Durable consumer outbox foundation

- Accepted architecture decision 28.
- Added `BusinessEventConsumerDelivery` schema and migration.
- Applied development migrations successfully.
- Added durable consumer worker and projection barrier release.
- Integrated consumer draining into projection maintenance.
- Prisma schema validation and targeted ESLint passed.
- A-01 remains open for producer-by-producer atomic transaction migration.

### 2026-07-30 — Atomic producer migration pass 1

- Payment create, split, complete and cancel now persist event/outbox rows in
  the Payment transaction.
- Shipment update, dispatch, delivered, returning, returned and manual-create
  now persist Shipment and related Payment event/outbox rows in the Shipment
  transaction.
- Order single/bulk post, cancel and verify now persist Order, Shipment and
  Payment event/outbox rows in the Order transaction.
- Compatibility entry points without `after()` process durable deliveries only
  after commit.
- Consumer outbox smoke passed:
  - duplicate enqueue produced one row;
  - terminal delivery was not claimed twice;
  - a transaction rollback left zero delivery rows.
  - coordination was claimed in pass 1 and the remaining consumer in pass 2.
- The smoke was repeated after the producer payload was reduced to delivery
  handles and passed against the development database.
- Prisma schema validation, targeted ESLint, the operation read-architecture
  audit and `git diff --check` passed. Full repository TypeScript validation
  remains outside this pass because of the pre-existing invalid note sources
  recorded above.

### 2026-07-30 — Atomic producer migration pass 2

- The canonical `recordBusinessEvent(prisma, ...)` boundary now writes the
  event log and both delivery outboxes in one short transaction.
- Watch content saves, Workbench pricing/title updates, publish-asset usage and
  Watch form content/spec/pricing changes now record their events in the same
  database transaction as their domain mutation.
- Technical movement/calibre updates, technical assessment saves and Technical
  Issue completion/payment creation now record their events in the owning
  transaction.
- Media attachment actions finalize queue metadata/activity/event atomically
  after canonical ingest, and reshoot metadata is seeded by the durable
  coordination consumer rather than by reading an after-commit binding during
  the request.
- Publish confirmation now passes the after-commit consumer scheduler through
  the common Media workflow processor.
- The outbox smoke passed again after the canonical event boundary change.
- Remaining Media review/save consolidation is intentionally not wrapped in a
  long transaction: current Review helpers still use the global Prisma client
  and canonical ingest performs NAS I/O. Holding a transaction around either
  path would exhaust the development pool and violate architecture decisions
  25 and 28. These helpers must first accept the caller's `DB`, while NAS work
  remains a journaled `MediaOperation` outside the database transaction.

### 2026-07-30 — Atomic producer migration pass 3

- Watch Review state, logs, rejection feedback, notifications, Watch state and
  event/outbox writes now share the caller's short transaction.
- Review HTTP entry points pass the Next `after()` scheduler; Media composite
  actions propagate the same scheduler while retaining their canonical
  composite event.
- Canonical Media ingest is split into an external, idempotent
  `MediaOperation` phase and a short database-finalize phase. Finalize writes
  Media bindings, ProductImage references, sale-stage truth and event outboxes
  atomically.
- Media release/attach helpers now accept the caller's `DB`; NAS operations
  are never run through a Prisma `TransactionClient`.
- Technical Issue create, confirm, start, update, complete, no-issue close and
  cancel commands now write state, task synchronization and event outboxes in
  the owning transaction.
- Quick Service intake now creates Service Request, assessment and event
  atomically. Initial/quick issue creation and Service Request status changes
  also share one transaction.
- Maintenance rejection now uses the transaction client for vendor lookup and
  records the corresponding Technical Issue task/event transition.
- Added
  `docs/operations/business-event-media-recovery-runbook.md` covering durable
  delivery diagnosis, safe retry, projection barriers, and the Media case
  where NAS succeeds before DB finalize.
- Targeted ESLint passed for the changed Event, Review, Media, Service and
  route boundaries.
- Prisma schema validation, durable consumer outbox smoke, operation
  read-architecture audit and `git diff --check` passed. Full repository
  TypeScript validation remains blocked first by the pre-existing invalid
  `src/note.ts` and `component for chatGPT/**` sources recorded in pass 1;
  the targeted compiler also reports existing cross-domain type debt outside
  this migration, retained as audit evidence rather than hidden or patched
  locally.

### 2026-07-31 - Runtime reconciliation and common flow pass

- Added `operation:audit-runtime-matrix`. It audits Payment, Shipment, Order,
  Watch, Technical Issue and Service Request against consumer outbox and
  projection-delivery state without mutating business data.
- Current development data has no post-migration domain-command sample for
  those six families. The matrix therefore reports
  `NO_POST_MIGRATION_SAMPLE` instead of incorrectly treating old
  projection-only deliveries as current evidence. A-01 remains open until
  representative commands are exercised.
- Projection runtime smoke found four missing
  `coordination-workspace-summary` rows (320/324) and repaired them through the
  canonical projection-maintenance path. Coverage is now 324/324.
- Payment and Shipment stage counters now use their canonical projections and
  the same predicates as their lists. The operation-flow smoke is now a
  failing gate for duplicate IDs, wrong-stage items and stage-count/list-total
  mismatch. Current Payment, Shipment, Technical and Media flows reconcile.
- Technical manual, bulk and board actions now return/collect projection
  delivery handles and wait on the shared delivery barrier before moving an
  item or reporting completion.
- Technical classification fields and the confirm event are now committed by
  the Technical Issue command in one transaction. The adapter no longer
  performs a separate pre-command mutation.
- Payment review, exception and follow-up mutations now commit their event and
  outbox rows in the same short transaction and return a projection delivery
  handle to the common progress waiter.
- Targeted ESLint passed for the changed adapters, actions and Coordination UI.
  `service-issue-board.service.ts` still carries pre-existing repository lint
  debt (`no-explicit-any` throughout the legacy file); no new lint exception
  was introduced.

### 2026-07-31 - Actor and last-action pass

- Authenticated manual and Blueprint operation actions now reject a missing
  actor instead of silently recording the operation as System.
- Coordination List/Board last action now treats the latest BusinessEvent as
  canonical. A delayed, older Task activity can no longer overwrite the
  newest event title, timestamp or actor.
- The operation-flow smoke now compares every loaded item with the latest
  BusinessEvent actor. Payment, Shipment, Technical and Media stages passed
  with zero actor mismatches, zero wrong-stage items and reconciled counts.
- Technical Issue Board projection now derives `lastUpdatedBy` and `updatedAt`
  from the latest Technical Issue event before using compatibility fallbacks.
- Legacy Service Request post, complete, vendor assignment and bulk vendor
  assignment commands were found mutating domain state without an event.
  They now write `service_request.status_changed` or
  `service_request.completed`, actor and delivery outbox in the owning
  transaction. Their server actions require the authenticated user and pass
  the standard after-commit consumer scheduler.
- No domain fixture was inserted into the shared development data. Runtime
  matrix closure still requires representative authenticated operations or a
  disposable test database; modifying real orders, payments, shipments or
  watches solely to manufacture audit evidence is prohibited.

## 2026-07-31 - Audit cycle closure

Status: **temporarily closed with runtime-evidence exceptions**.

### 2026-07-31 follow-up: Watch duplicate quarantine projection gap

- Finding: `confirmDuplicateWatchAction` updated the Watch source row and
  cancelled related Task executions, but the active `watch-list` projection
  retained its previous snapshot. The normal Watch list could therefore keep
  rendering a quarantined duplicate while the duplicate view (source read)
  already contained it.
- Root cause: duplicate quarantine/restore had no business event subscription,
  and a scoped Watch projection rebuild only upserted rows; it did not remove a
  row that had become ineligible for the read model.
- Resolution:
  - added `watch.duplicate.confirmed` and `watch.duplicate.restored`;
  - command state and event/outbox are recorded in the same transaction;
  - delivery is processed after commit;
  - active Watch projection sources exclude `duplicateConfirmedAt != null`;
  - scoped rebuild deletes the previous row before conditionally rebuilding it.
- Contract: confirm removes the Watch from the active projection and exposes it
  through the duplicate source view; restore performs the inverse. UI-side row
  hiding is not part of correctness.
- Validation: targeted ESLint passed. Repository-wide TypeScript remains blocked
  by pre-existing parse errors under `component for chatGPT/**` and
  `src/note.ts`. The legacy Sprint 75 verifier also currently fails on the
  unrelated pre-existing `service_request.created` subscription expectation.

### 2026-07-31 temporary maintenance: repair missing Watch INLINE media

- Purpose: allow an operator to click a Watch-list thumbnail and select the
  correct image from the current segment INLINE source folder while legacy
  missing references are being repaired.
- This is only a new UI entry point. It does not introduce a separate image
  write path: selection uses the shared Media browser and
  `ingestSelectedMedia`, replaces the Watch `INLINE` image and binding in one
  transaction, emits `watch.media.asset.attached`, and waits for the normal
  consumer/projection operation.
- Acquisition and Watch-creation behavior are not invoked or duplicated.
- Permission remains `PRODUCT_UPDATE`; AppLoading covers ingest, binding,
  event and projection completion.
- Removal gate: set `NEXT_PUBLIC_WATCH_INLINE_REPAIR=0` after the production
  media migration is complete. The dedicated application command and client
  entry point can then be removed without affecting normal Media flows.

### Architecture work closed in this cycle

- Payment Operation List now reads Payment rows, stage state, filters,
  pagination, sorting and totals from `payment-list` projection version 2.
  Binding, activity and business preview hydration is limited to the current
  projection page. The direct `Payment.findMany` list path and cash-flow
  source fallback were removed.
- Payment projection version 2 sorts canonically by `updatedAt`, supports
  positive-amount, status inclusion/exclusion, type, direction and query
  predicates, and has complete source coverage: 229/229.
- Watch Media metadata writes now cross the Task-owned
  `BusinessBinding` repository boundary. Order-from-task and
  Service-from-task create bindings through the same boundary instead of
  writing `TaskExecution` directly.
- The only remaining direct `TaskExecution` mutations outside Task are in the
  authenticated Watch duplicate quarantine/restore/delete maintenance tool.
  They intentionally cancel, restore or remove the complete binding set as
  part of destructive duplicate cleanup and are recorded as an explicit
  maintenance exception, not a normal operation flow.

### Final sweep evidence

- Projection runtime: 258/258 succeeded deliveries, zero stale, failed or dead
  deliveries, nine consistency checks and zero drift.
- Operation flows: Payment, Shipment, Technical and Media all have matching
  stage/list totals, zero duplicate IDs, zero wrong-stage items and zero actor
  mismatches.
- Payment projection: 229 source rows / 229 projection rows; compare passed.
- Order projection: 74 source / 74 list / 74 detail rows; image hydration and
  payment-type/progress counters passed.
- Service Request projection: 61 source / 61 projection rows.
- Coordination summary: 324 source / 324 projection rows.
- Media: 437 watches, 1,744 MediaObjects, 404 bindings, zero unavailable
  objects, zero pipeline/segment/cross-segment mismatches; sampled storage
  misses 0/25. Men/Women Watch and Acquisition dashboard counts match source.
- Board gateway, Flow gateway, stale-request rejection, inflight dedupe and
  refresh read architecture passed.
- Durable outbox idempotency, terminal claiming, ordered consumers and
  transaction rollback smoke passed.

### Explicit closure exceptions

- Runtime matrix has a post-migration PASS for Watch
  (`watch.saleStage.posted`) with actor, terminal consumer and successful
  projection delivery.
- Payment, Shipment, Order, Technical Issue and Service Request have no fresh
  authenticated post-migration command sample in the shared development
  database. They remain `NO_POST_MIGRATION_SAMPLE`; no real business record was
  mutated solely to manufacture audit evidence.
- Full repository `tsc --noEmit` remains outside the closure gate because of
  the pre-existing invalid note sources and legacy cross-domain type debt
  already documented in this audit. Targeted ESLint, Prisma validation and
  `git diff --check` are the applicable code gates for this cycle.

This audit cycle is closed for implementation work. Reopen it only if a fresh
runtime sample fails, a projection-health gate reports drift, or the explicit
duplicate-maintenance exception is redesigned.

## 2026-07-31 — Durable consumer envelope regression

Status: adapter corrected; historical delivery recovery remains a separate,
scoped operation.

A fresh `watch.media.ready_for_publish` runtime sample reopened the audit. The
durable delivery row contained the complete event identity, but
`businessEventConsumerDeliveryContext` reconstructed `eventLog` with only
`id`, `metadataJson` and `createdAt`. Timeline therefore observed the event as
`unknown`; Notification returned `INVALID_EVENT_LOG`.

The correction is made once at the durable delivery adapter:

- reconstruct the canonical event log envelope with `id`, `eventKey`,
  `targetType`, `targetId`, `actorUserId`, `metadataJson` and `createdAt`;
- reject an incomplete delivery identity before dispatch so it becomes a
  retryable delivery failure instead of a contract-invalid terminal skip;
- keep Coordination, Workflow, Timeline and Notification on the same durable
  context instead of adding consumer-specific fallbacks.

The durable outbox smoke now uses a real `BusinessEventLog`, asserts the full
adapter envelope and rejects `INVALID_EVENT_LOG` as a valid terminal result.
The runtime matrix also treats contract-invalid terminal skips as unhealthy.
The smoke passed with `NO_NOTIFICATION_RULE`, proving that Notification
received and validated the event identity.

Existing terminal deliveries created while the adapter was defective are not
automatically reclaimed. Recovery must first inventory affected Timeline and
Notification deliveries, then replay only those deliveries with their
original operation keys. It must not emit a new business event or write a
projection directly.

Read-only runtime inventory at `2026-07-31T03:39:49Z` found four confirmed
contract-invalid terminal deliveries, all Notification:

- one `task.item.activity.commented`;
- two `watch.saleStage.posted`;
- one `watch.media.ready_for_publish`.

The runtime matrix intentionally fails while these four historical rows remain
terminal with `INVALID_EVENT_LOG`. This is a production gate, not evidence that
the corrected adapter still emits invalid envelopes.

### 2026-07-31 — Shared operation List preview

- Coordination operation Lists now open the same shared
  `BusinessEntityPreview` used by Media and Technical Issue boards.
- Row selection, action buttons, menus, and explicit activity links remain
  isolated from row-preview clicks.
- Watch, Order, Shipment, Service Request, Payment, and Acquisition resolve
  discussion through one target-scoped activity loader. Technical Issue keeps
  its SR-specific sections while using the same preview/activity shell.
- `SERVICE` UI identity is canonically mapped to the
  `SERVICE_REQUEST` activity target; no alternate activity namespace was
  introduced.
- Preview requests are versioned client-side so a slower response for an old
  row cannot overwrite the newly selected item.
- A comment refreshes the preview and requests the common List reload so
  comment counts remain synchronized.
# 2026-07-31 — Việc phát sinh trong Unified Operation Space

- Giữ nguyên invariant: toàn hệ thống chỉ có **một** Operation Space (`Task`).
- “Việc phát sinh” là một `SpaceViewMode`, không phải Space/domain mới.
- Mỗi dòng việc phát sinh là một Workspace (`TaskItem`) với:
  - `workspaceKind: STANDALONE_WORKSPACE`
  - `operationWorkspaceRole: AD_HOC_WORK`
  - `workTypeKey/blueprintKey: ad-hoc-work`
- Trạng thái dùng trực tiếp `TaskItem.status`: `TODO` tương ứng **Chưa làm**, `DONE` tương ứng **Đã xong**. Không tạo state machine riêng.
- Đối tượng nghiệp vụ được gắn bằng `TaskExecution`/BusinessBinding; đợt đầu gồm `WATCH`, `ACQUISITION`, `ORDER`.
- Binding của Workspace độc lập là **reference binding**, không khởi tạo workflow runtime. Chỉ `FLOW_STAGE_WORKSPACE` mới dùng queue/workflow binding adapter.
- `ad-hoc-work` là Work Type được đăng ký và bật để tham gia read/access filtering, nhưng dùng provisioning `MANUAL/FIRST_INTAKE_EVENT`; registry không được tự tạo một Workspace rỗng khi mở Space.
- Dashboard metrics phải scope theo `SpaceViewMode` đang chọn, không đổi nhãn rồi tiếp tục tổng hợp toàn Operation Space.
- Projection `coordination-workspace-summary` thực hiện bounded read-repair theo `rowKey/sourceUpdatedAt`: bổ sung row thiếu, rebuild row stale và loại row đã bị cancel. Projection có dữ liệu không còn đồng nghĩa projection đã đầy đủ.
- Refresh ở mode Workspace không có Core Flow phải refresh dashboard/Workspace summary; không gọi nhầm Flow Item loader.
- Command tạo Workspace, binding và `task.item.created` event chạy trong cùng transaction.
- UI dùng một modal/action chung tại các list Watch (Sản phẩm), Phiếu nhập và Đơn hàng; submit dùng AppLoading toàn cục.
- List Vận hành lọc theo `workTypeKeys`, tránh trộn các `STANDALONE_WORKSPACE` khác.
- Preview, activity, comment, mention và thao tác hoàn tất tiếp tục dùng TaskItem detail/runtime chung; không tạo implementation riêng cho “Việc phát sinh”.

## Boundary giữa Workspace mode và Core Flow reader

- `SpaceViewMode` chỉ được tải Flow Item khi mode khai báo `coreFlowKey` hợp lệ. Mode dạng Workspace/Case không được suy diễn thành generic flow chỉ vì `includeFlowItems` đang bật.
- `flowLoadTaskItems` phải rỗng khi không có active Core Flow; dashboard của mode không-flow đọc Workspace summary/projection làm nguồn dữ liệu.
- Work Type có thể tồn tại hợp lệ mà không sở hữu `workflowKey`. Binding workflow resolver phải trả về `null` cho trường hợp này; API bắt buộc-workflow vẫn giữ fail-fast qua `getWorkTypeWorkflowDefinition`.
- Rule này ngăn binding tham chiếu của `ad-hoc-work` bị đưa qua queue/workflow runtime, đồng thời giữ kiểm tra chặt cho các Work Type thực sự thuộc Core Flow.

## Read model của danh sách Việc phát sinh

- Operation Space vẫn là một Space duy nhất; `ad-hoc-work` không tạo thêm Space hoặc Core Flow.
- Mode `ad-hoc-work` dùng `rowModel: TASK_ITEM`: mỗi dòng UI là một TaskItem, không phải một Workspace summary.
- Hai stage `OPEN/DONE` ánh xạ trực tiếp từ `TaskItem.status` thành “Chưa làm/Đã xong”. Không suy trạng thái từ số BusinessBinding hoặc queue count vì TaskItem tự do có thể không gắn business object.
- Chuyển stage dùng TaskItem mutation chung, app-loading chung, optimistic removal khỏi stage hiện tại và refresh projection/dashboard sau khi lưu thành công.
- Dashboard của mode TASK_ITEM đếm trực tiếp TaskItem theo status và chỉ biểu diễn hai trạng thái; không dùng bốn bucket của Core Flow.
- Cột chuẩn của TASK_ITEM list: `Item → Yêu cầu → Đối tượng → Người tạo → Người xử lý → Cập nhật → Thao tác cuối → Thao tác`. Mutation chuyển stage nằm ở cột Thao tác riêng, không trộn vào nội dung Yêu cầu hoặc lịch sử Thao tác cuối.
- Item có BusinessBinding dùng chính identity projection của business object (title/ref/image); TaskItem tự do dùng icon trung tính và nhãn “Việc tự do”. UI không truy vấn riêng từng domain để dựng lại ảnh.
- “Việc tự do/phát sinh” là loại công việc, không đồng nghĩa “không có đối tượng”: công việc được tạo từ Watch/Order/... phải giữ reference binding và render chính business object đó ở cột Item. Chỉ TaskItem được tạo độc lập, không có binding, mới mang identity “Việc tự do”.
- TASK_ITEM list vẫn tải identity và activity projection khi dashboard chạy chế độ payload nhẹ (`includeDashboardDetails=false`); đây là dữ liệu cốt lõi của row, không phải dashboard enrichment tùy chọn.
- Assignment dùng `TaskItem.assignedToUserId`, độc lập với share và mention:
  - assignee có quyền truy cập đúng Workspace được giao;
  - share Workspace/flow/Space tiếp tục quyết định phạm vi cộng tác rộng hơn;
  - mention chỉ tạo ngữ cảnh trao đổi/notification, không thay đổi người chịu trách nhiệm.
- Modal mặc định gán cho người tạo, đồng thời hỗ trợ chọn user active khác hoặc để `Chưa gán`. Server luôn xác thực lại user active trước khi ghi.
