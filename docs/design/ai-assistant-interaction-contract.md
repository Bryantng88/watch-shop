# AI assistant interaction contract

This contract governs all business-assistant UI and future extensions. It applies to the local simulator and the eventual live implementation. The agreed product direction is **conversation first, compact review, one explicit approval**.

## Required behavior

- The primary input and correction mechanism is natural-language chat.
- Do not embed business-data forms, metadata editors, multi-field cards, wizards, or per-field confirmation steps in the assistant. Do not hide a large form under an Edit/Details accordion as a workaround.
- The assistant gathers facts already provided in the conversation and the explicitly pinned, authorized product context. It asks concise questions only for facts that are missing, ambiguous or unsupported. Ask the most relevant missing question first; do not return a checklist for the user to fill out.
- Example: **“Bạn chưa cung cấp thông tin khách hàng. Khách tên hoặc mã gì?”** Then ask for SKU or recipient only if those remain missing. Do not repeat questions already answered.
- Missing customer, specific watch, condition, expected result or recipient means **no actionable review card and no Assign button**. Never display empty identities such as “Khách ·”. Recheck completeness from actual fields, not a cached ready flag; apply the same rule to old saved drafts.
- Never invent identities, recipients, conditions or business facts to complete a summary. Unsupported simulation input must be clarified, not presented as successful AI understanding.
- Once complete, show only a short customer/watch heading and lines of **condition/action → recipient**, with a brief technical-request/task label where needed. Avoid repeating the entire conversation or system implementation details.
- Offer one clear action such as **“Giao 2 việc”**. This is the single approval for the displayed request and assignments. Corrections such as “Giao mắt dây cho Minh” or “Bỏ chống nước” happen in chat and update the same pending summary. Corrections never create work by themselves.
- Approval must be idempotent. After approval, show compact progress/results; expand at most the item the user explicitly chooses to update. Optional item status/result controls must not become a required intake form or another approval wizard.
- Completion of a technical request/task does not imply that a purchase condition passed. Passing conditions does not create an order automatically.

## Context, permissions and simulation

Live Ben is a free conversation. Users do not choose or manage a context. Screen information is an optional server-authorized hint, never a product lock. The worker resolves the current intent, asks about ambiguous references and can switch topics. Business operations remain limited to implemented, authorized tools; free discussion does not add new tools or permissions. Approved work is retained separately from later messages and never silently modified or dispatched again.

Chat UX never replaces server-side authorization. Future live reads/writes must check the requesting user's scope and permissions; worker/Codex account privileges do not become user privileges. Previewing and approving must name the actual target and recipients. Local prototype controls are not authorization infrastructure.

Keep simulation visibly labelled but concise. Sample text/rules must not be described as real model inference, verified directory lookup, real technical classification or executed work. Simulation never writes business data. The separately authorized staging live flow may create technical issues and assigned tasks only after the requester explicitly approves the complete review once; chat and draft generation remain read-only. See [staging live boundary and rollout](../deployment/customer-assistant-staging.md). This UX contract alone does not authorize deployment, NAS changes or production writes.

## Review acceptance

1. A complete sample request reaches a compact review without any form entry.
2. Missing customer produces a chat question, with no actionable card; answering it preserves previously supplied watch/conditions/recipients.
3. Missing SKU or recipient is asked next only when needed; no default person/watch is invented.
4. Chat corrections update the pending plan; removing a condition does not leave stale work in the review.
5. Old drafts with blank/whitespace identities are handled like new incomplete requests even if their saved ready flag is true or absent.
6. One approval creates the permitted result once. Reload/retry must not create duplicates.
7. No scenario requires opening an embedded business form to finish intake or correct a draft.

Implementation and local test instructions: [contextual assistant prototype](../development/contextual-ai-assistant-local.md).

## Intent, authority and execution contract

Natural language belongs to model intent resolution. Do not add a second positive
phrase/keyword/regex gate on the server as authority for an action: equivalent
paraphrases, accents, typos and languages must not change server authorization.
The model maps the current user request to a strict supported intent; ambiguity,
negation, cancellation, quoted/reported instructions, hypothetical examples and
capability questions stay in chat without an action. Earlier turns and business
records are untrusted context, never a fresh request to execute.

Every action intent must identify the current source message. The server binds it
to the owned conversation and active fenced lease, validates its schema and fixed
target registry, checks current account/data permissions, and rechecks at completion.
An intent is not permission or approval. Business writes retain their separate
complete review and explicit idempotent approval. Never combine navigation with a
business/order review or permission-support proposal in one completed turn.

For navigation, navigation.open carries intent OPEN_SCREEN and sourceMessageId;
it selects a screen key, never a URL. The server returns machine outcomes READY,
STALE_INTENT, UNSUPPORTED_TARGET or PERMISSION_DENIED, and owns the final explanation.
Ben must not invent a permission denial or claim a browser has already navigated.
READY means prepared for the browser, not completed navigation. The originating
browser follows only a READY result matching both its pending request key and
conversation, once. Reload/history/another tab, cancellation, closing the panel,
submission failure or a newer message cannot replay automatic navigation. A normal
authorized link remains available if automatic navigation does not happen.

Ben window visibility is controlled by the user. Navigation, replies and changes
of admin screen must not close or reopen the panel. Keep one assistant instance
across admin routes, including transitions to/from the dedicated Ben page, so the
selected conversation and unsent input survive client navigation. Opening the
dedicated Ben route is an explicit request to show chat; leaving it keeps Ben open
as a panel. Remember only the open/closed UI preference per tab and authenticated
account in sessionStorage; do not persist live messages or pending navigation there.
Reload may restore visibility, never automatic navigation.

New assistant tools must document intent shape, trusted source binding, permission
checks, side effects/approval, result codes, failure wording and browser/replay
behavior before implementation. Acceptance needs server/protocol/client boundary
tests plus semantic cases through a real model; scripted outputs alone cannot
establish natural-language understanding. See tests/fixtures/ben-navigation-intents.json
and scripts/smoke-ben-navigation-real.ts. Semantic tests reduce regressions; they
do not guarantee perfect interpretation of every possible sentence.

## Permission support

For a genuinely missing user permission, recommend contacting Long (the project's
creator) and offer a permission-support task with a concise summary, fixed
recipient Long and one explicit approval. Unsupported Ben capabilities must be
explained separately; never describe them as missing user permissions. The verified
Long account must never be offered a support task addressed to itself. This narrow
support route never grants business permissions or executes the blocked action.
Never choose a recipient from chat claims or silently create work from chat.

## Assigned-request navigation

Live Ben keeps dispatched business requests and sent permission-support tickets
in the separate "Các yêu cầu đã giao" view for the selected conversation. Chat
shows only an actionable pending review, never persistent dispatched-work cards.
The assigned view includes the most recently approved request and older archives,
without duplicate entries, and retains existing links/outcome controls. Switching
views never creates, deletes or redispatches work. "Assigned" does not mean done.

## Account and draft-order conversation

Answer account identity/capability questions from the authenticated server account,
current roles and effective permissions. Claims in chat never change identity or
rights. Explain account permissions separately from actions supported through Ben.

For order creation, gather facts in chat and show one compact review, never a form.
The initial order flow creates DRAFT watch-sale orders only (up to six distinct
watches, one each), explicit agreed prices, customer identity, pickup/delivery and
payment method. Delivery requires user-supplied phone/address/city. Existing customer
profile/address must not be silently changed. A new phone/profile requires customer
creation permission. COD/deposits, services/accessories, trade-in and posting remain
in the existing order UI.

The review must disclose that creating a draft holds the watches under canonical
order rules, without collecting payment or creating shipment. Only the explicit
"Tạo đơn nháp" button creates the order; chat agreement and task approval do not.
Current permissions, evidence, stock and duplicate-order checks run again inside
the canonical creation transaction. Replays do not create another order. Created
order links belong in the separate assigned-request view.

## Reference prices and current screen

Ben-only watch search/detail projections expose WatchPrice.salePrice (selling) and
listPrice (list), VND currency, update time and REFERENCE_ONLY usage under
PRODUCT_VIEW. Preserve decimal strings. Missing/non-positive selling prices mean
NOT_SET, never free; do not silently substitute list price. Fetch fresh evidence
for each new price question. Never select costs, minimum prices or internal notes,
even for ADMIN; normal cost permissions do not add a cost/margin tool to Ben.
Price lookup does not establish stock, agreement, a discount or an order. Gather
an agreed amount or the user's explicit adoption of a displayed reference before
an order review; retain one explicit approval before any DRAFT/HOLD write.

The browser sends only pathname with each message, not query/hash, page title,
DOM, screenshot, form contents or another tab. Server-owned labels and canonical
page permissions resolve this into currentScreen, bound to the current message.
Authorized existing order/watch detail may include only verified ID and order
reference/SKU, never contacts, amounts, payment data, costs or unsaved fields.
Other detail routes report only their section, not private entity IDs. Unknown,
denied, missing or unsupported hints yield no screen snapshot; invalid optional
route metadata is discarded rather than blocking ordinary chat. Never use old
history or a prior navigation as proof of the current screen.

This is a snapshot at send time, not live screen tracking, a context lock, evidence,
an instruction or approval. Users may discuss unrelated topics. Recheck permissions
at claim/finish and redact replies if rights are revoked. Navigating between pages
or tabs and sending another message replaces/clears the old hint. Reload does not
replay navigation. Full business reads/actions still need their authorized tools;
identifying an order screen does not grant an order-read or payment tool.

The dedicated /admin/ben route is named "Ben mở riêng". This identifies the chat
view, not hardware: desktop and mobile may both open it. Never infer "phone" or
another app/tab's current page from this mode. Older already-open clients that
omit screenPath may recover only this fixed route from a same-origin Referer;
discard query/hash and do not overwrite explicit/null client metadata. Referrer
never grants permissions or selects a business record.

## Reviewed repository code jobs

For verified Long only, a fresh successful pinned repository.file read may produce
a strict codePlan {title, request}. The server binds the draft to that owned
conversation revision and configured source SHA/ref/PR base. Chat remains read-only;
no business/customer identity is required for a coding request. A compact code
review exposes one explicit Start action, which idempotently queues a separate
code worker. Code plans cannot accompany business/order/navigation proposals.

The worker edits an isolated checkout and reports independently executed named
checks, immutable commit and draft PR. Chat output is never execution evidence.
Merge and staging deploy each require their own explicit exact-commit command;
no free-text statement, history replay or poll can authorize either. Private
leases never reach browsers. Current active Long authority is rechecked on
claims/heartbeats/completion. Revoked, expired or cancelled work cannot publish
a successful API result. Uncertain remote mutations require operator reconciliation.
Capabilities default off; unsupported/unconfigured execution must be explained
as unavailable rather than a successful action. The browser displays authoritative
job state and links, never autonomously replays commands. Production is excluded.
See [code execution and staging integration](../development/ben-code-execution.md).

## Tìm đồng hồ trong kho bằng ảnh

`BEN_IMAGE_SEARCH_ENABLED=1` mở đính kèm ảnh cho người có quyền xem sản phẩm.
Triển khai app và customer worker cùng phiên bản trước khi bật cờ. Mỗi lượt
nhận một ảnh JPG, PNG hoặc WebP tĩnh tối đa 4 MB. Server giải mã và thu nhỏ,
bỏ metadata, rồi chuyển ảnh cho worker qua lượt xử lý riêng. Ảnh gửi không
xuất hiện trong API lịch sử. App xóa dữ liệu ảnh khi hoàn tất, hủy hoặc hết
lease. Worker xóa file tạm khi dọn lượt.

Worker đính kèm ảnh vào Codex để đọc dấu hiệu nhìn thấy. Ben tra kho theo
logo, chữ và mã đọc được, trả ứng viên có dữ liệu tra cứu hoặc hỏi thêm góc
chụp. Lượt có ảnh chỉ dùng tra cứu đồng hồ và không sinh đề xuất ghi dữ liệu.

## Media content draft

The active same-origin media editor exposes its product and section to the Ben
panel only while that editor is mounted. Chat sends the editor pathname as the
existing server-verified screen hint. The explicit “Tra cứu và viết nội dung”
control calls the existing product research action under PRODUCT_UPDATE. It
returns a title, body, source links and uncertainty notes without changing the
form. “Duyệt và điền vào Content” applies the displayed title and body to the
same editor snapshot once. A different editor or changed form requires a new
draft. Drafts stay in browser memory and cannot be replayed from chat history.
The existing media save and publish controls retain their separate semantics.

## Personal work today

For a request to list today's personal work, the worker calls
`personalWork.today` with no arguments. The leased conversation owner is
the only account used by the server. The lookup requires TASK_VIEW and
uses the same owner/share scope as the Personal Work page. It returns
only bounded open tasks/events scheduled or still ongoing today in Asia/Ho_Chi_Minh.
Overdue and unscheduled work is returned as counts, never historical titles in
this lookup. Today-only replies list today's items first and mention overdue
work in one brief count sentence. Do not fetch/list overdue titles from history
or another tool unless explicitly requested. `personalWork.overdue` is a separate
zero-argument read for that explicit request, with the same scope. Scan schedule
metadata only (at most 10,000 active records); fetch titles only for the selected
day/bucket's first 12 items. When countsExact is false, counts are lower bounds
and an empty scanned selection cannot establish no work exists. Empty results and
truncation are distinct. Existing permission checks apply to the reply
and its task references before delivery and history display.

## Media requests from chat

The worker resolves explicit requests to draft content for the open media editor
as media.draft, with query equal to the latest user message ID. The server binds
the request to the leased turn, the verified watch edit screen and PRODUCT_UPDATE.
The result authorizes preparation only. Only the originating browser may start
research, once, while the same editor is open. Historical results cannot trigger
research. The editor supplies its inline photo and applies the draft only after
the existing explicit review.

Media inspection uses media.inspect with the same turn binding and permissions.
It sends only the inline photo for visual observations. It does not run web
research or create an editable draft. Content research keeps source links out
of the body and separates uncertain facts from approved copy.

Media content generation separates research from copy. Research selects an
evidence-led angle and a bounded brief that distinguishes visible details,
inventory facts and exact-reference research. A separate writing pass receives
only that brief, with one of several opening approaches. Sources and uncertainty
notes remain outside the copy. Approval still applies the displayed text once.

Before drafting, Ben asks for one optional editorial impression using the
existing composer. The impression shapes the angle and does not establish a
technical fact. The draft opens in the active product's Content tab with
sources and review notes collapsed. The existing one-click approval still
fills the form and does not save or publish it.

## Group Media posts and stock receipts

`media.watches.select` reads catalog candidates using a strict JSON-string query
with brand, keywords, count (1–20), optional sale-price bounds and similarPrices.
It requires PRODUCT_VIEW + MEDIA_VIEW. Candidates must be available, in stock,
not sold/held/consigned, have a positive sale price and a Gallery image. Match
keywords against catalog title/model/reference/tags; never infer diver capability
from appearance or substitute unknown technical specifications. No cost/minimum
price or customer/vendor data is returned. Scan coverage is explicit; a truncated
scan cannot produce a post draft and must be narrowed.

For “prices roughly alike”, use the largest group up to the requested count whose
maximum sale price is at most 125% of its minimum, then the tightest relative
spread. Show the actual selected count, price range and the 25% rule. Shortages
remain visible and never authorize substituting unrelated watches.

`media.posts.draft` accepts a strict JSON-string query with current user message
ID, selected watch IDs, caption and brief. Only watches from the latest complete
selection in this leased turn are eligible. It requires PRODUCT_UPDATE in
addition to the read permissions. This lookup prepares conversation state only;
finish carries no other plan, support request or navigation. Drafts and corrections
do not create business records. Model-written copy must be grounded in the
returned inventory facts and is displayed for review.

The compact review lists the exact watches/prices, full caption and one
“Tạo post nháp” action. Chat remains the correction mechanism. Approval rechecks
the owner, revision, current authority, inherited read scope and exact current
stock/price/title/Gallery snapshot. The existing Media Post command copies one
Gallery image per watch, binds all watches and creates a single DRAFT post. The
conversation lock and durable receipt are in that same transaction. Concurrent
clicks, retries and post-commit delivery failures return the receipt without
creating another post. Gallery copy failure rolls back records and cleans copied
files through the existing command. This never schedules, publishes or sends
anything to social accounts. Current permissions gate restored drafts/receipts.

`stock.receipts` requires WATCH_ACQUISITION_VIEW + PRODUCT_VIEW and accepts brand
and a bounded receipt count. Shop convention: creating a receipt means stocking
in, so importedAt is Acquisition.createdAt, not acquiredAt or Product timestamps.
Return only receipt reference/date, watch identities and an admin link. Watch-only
viewers cannot inspect mixed receipts; ACQUISITION_VIEW_ALL may. Both receipt and
child-watch truncation remain explicit. Receipt reads and group-post proposals
are separate turns. Deploy the app and updated worker protocol/schema together;
scripted tests do not establish live natural-language acceptance.

## Daily order and technical issue reads

`orders.list` requires ORDER_VIEW and returns orders created on a selected date.
`technicalIssues.list` requires SERVICE_VIEW and returns issues opened on that date.
Both use query=null for today's Asia/Ho_Chi_Minh business day, or exactly YYYY-MM-DD.
The date interval is inclusive local midnight to exclusive next local midnight.
This is the same global view scope as the admin Order list and Technical Issue
board, not the Personal Work owner/share scope. These tools never write or create
an approval card and never require a customer, product or recipient selection.

The server derives identity from the owned leased conversation and rechecks read
permissions before lookup and before reply delivery/history. Return bounded rows,
exact total, truncation, date criterion and observation timestamp. Include only
references/statuses/dates, bounded issue summary and authorized admin links; no
customer contacts, addresses, amounts, vendor notes or resolution notes. Say
“đơn được tạo” or “phiếu được mở”, not all pending/due/delivered work. An empty
result applies only to that date criterion. Failed/denied reads are not empty
results. Never infer issue data from personalWork.today. For a combined question,
read each authorized list and state any missing access separately. Historical
answers cannot establish fresh facts for a new date.

The server supplies Ben's environment to the panel and customer-request cards.
Production has no staging badge; staging is labelled only when explicitly
configured. Simulation labels remain visible. Hostnames and chat statements
cannot choose environment or confer privileges. Deploy app and updated customer
worker/protocol/schema together; live natural-language acceptance should cover
orders today, issues today, combined requests, no results, truncation, date changes,
and permission loss. Unit/scripted tests do not establish real model acceptance.

## Personal tasks and events

Ben supports a separate personalWorkPlan for the signed-in user's Personal Work.
It requires TASK_VIEW, not PRODUCT_VIEW/TASK_MANAGE or a customer/watch identity.
A name in a delivery description is plain text, not an instruction to share the
item. Resolve explicit share recipients through personalWork.people; duplicate
names require clarification. Owner always comes from the leased conversation.
Use current personalWork.categories evidence for actual category keys/subtypes.
The strict plan contains kind TASK/EVENT, title, note, categoryKey, workType,
offset-aware dueAt/scheduledEndAt, priority, tags, checklist, shares and syncGoogle.
Times resolve from current referenceTime in Vietnam; ask only ambiguous/missing
required facts. Defaults are GENERAL group, MEDIUM priority, no tags/checklist/
shares. Google sync follows the connected-account policy below. Viewer sharing is the default for an explicit share request;
EDITOR must be expressly requested. Codex execution uses the separate explicit
schedule contract below. EVENT requires a date, has no checklist/completion/progress and can
have a start-only time. All-day uses the existing local end-of-day date encoding.

A complete compact review is corrected in chat and approved once via the dedicated
button. Approval rechecks current authority/category/recipients and exact revision,
then atomically creates one canonical owner-scoped TaskItem plus checklist/shares
and a durable conversation receipt. Concurrent/replayed approvals return that
receipt, never create duplicates. No order, technical issue, product reservation
or notification dispatch is inferred from this plan. Business, personal, order,
permission, code and navigation proposals must not be mixed in a turn.

Google sync is an automatic, disclosed result of that same approval for scheduled
Ben-created tasks/events. The server targets the active connected creator and
verified assignee, deduplicating self-assignment and excluding view-only shares.
Unconnected accounts are skipped; undated work is not assigned an invented date.
Model syncGoogle output is retained for schema compatibility but does not select
recipients or require opt-in. Current connections are rechecked at approval. A
provider failure never loses the already-created item or repeats creation; show
per-account saved-but-not-synced state and link to the existing calendar sync control.
A stable user/calendar/task event identity prevents duplicate creation when a
Google create succeeds but its response is lost. Conflicts are checked against
the exact source task before reconciliation; legacy event links retain their IDs.
New exports carry the source task version and a semantic schedule fingerprint.
Unchanged exports cannot round-trip a less precise Google representation into
the task; a stale participant calendar cannot overwrite a newer canonical
schedule. An actual Google date edit imports only against its published task
version, with an exact version predicate protecting concurrent task edits. Receipt
and draft history require TASK_VIEW; current revocation redacts both. The server
keeps private leases out of browser data. Pending drafts are context, never
consent; old results never authorize another write. No offline/background replay.

Event occurrence is derived from its schedule (upcoming/ongoing/past); internal
TODO storage is not an instruction to complete it. The personal page excludes
events from open/overdue counts, completion controls/checklists, and Done view;
calendar/local/Google surfaces keep their times and allow editing/cancellation.
A point event uses a technical one-minute Google interval because Google requires
an end, while the local item and UI retain a start-only schedule. The metadata
round-trip preserves that distinction. Existing tasks keep their prior semantics.
Start-only tasks with a clock time use the same technical point interval without
creating a completion/end time in Watch Shop. Existing midnight date-only task
encoding and end-of-day all-day encoding remain date-only for compatibility.

Customer repair progress uses customerRepairs.search under SERVICE_VIEW. The
lookup searches active and completed-but-not-delivered CUSTOMER_OWNED tickets
by watch identifiers without a date constraint or private customer fields.
Photo inventory search tries exact SKU before matching all identifying terms.
Image turns show bounded candidate cards using inline photo, title and selling
price. Ordinary requests for a product gallery still use the gallery card.

## Multiple personal tasks/events in one command

For 2–8 independently requested items, finish with `personalWorkPlans` containing
every complete plan and `personalWorkPlan=null`; single-item output remains
backward compatible. Never convert independent items into a checklist, omit later
lines or show a partial actionable review when an item needs clarification. Ask
about missing facts in chat; corrections preserve unmentioned items in the
pending `personalWorkDraft.items` batch. More than eight requires splitting the
request explicitly, never silent truncation. Mixed business/update/code/Media
plans are invalid.

Display a flat compact review with each item's title, schedule, assignee, shares,
Google destinations and Codex gate as applicable, plus one “Tạo N mục” button.
One owned-conversation revision approval revalidates every item and creates all
canonical tasks/events, checklists/shares, optional Codex runs and receipts in the
same serializable transaction. Failure of any item rolls back the entire group.
Concurrent/replayed approval returns all receipts without recreating or repeating
Google sync. Receipt identity is revision + item ID, not revision alone. After
commit, calendar sync/status is handled separately for each created item, preserving
already-created tasks when a provider fails. Assignment notification scheduling
remains post-commit. No new completion, publication or deployment approval is added.

## Scheduled Codex dispatch from personal task creation

Only an explicit current request and an available `canSchedulePersonalCodex`
capability allow `personalWorkPlan.codex={startAt}`. `startAt` is an offset-aware
execution start gate; null means explicitly approved run-now. Omitted/null codex
means no dispatch. It is independent of dueAt/scheduledEndAt; date-only requests
must ask the execution hour, never use 23:59 or a deadline silently. A raw codex
tag without this object is invalid. Server adds the canonical tag on approval.
TASK only, owner execution only: no EVENT or different assignee. This extends the
existing ADMIN/staging personal worker boundary; production remains disabled and
worker unavailability is explained instead of silently dropping execution intent.

The compact review shows task/calendar time and Codex start time in Vietnam, with
one “Tạo việc và giao Codex” approval. That transaction creates the canonical task,
tags/checklist/shares, a PersonalCodexRun and durable conversation receipt together.
Failure rolls back all of them; replay returns the receipt. It grants no merge,
deploy or task-completion approval. Corrections before approval happen in chat.

PersonalCodexRun.notBefore is nullable. Old/manual unscheduled jobs remain
immediately eligible. Worker discovery and conditional claim both require null
or notBefore <= server now. Future jobs do not block ready jobs. At claim, recheck
owner/admin, active task, tag, non-event kind and approved prompt fingerprint;
changed content is cancelled rather than executed under old consent. Existing
lease/heartbeat/cancel behavior remains. A late/offline/busy worker may start
after the gate, never promise exact-second execution. Existing cancellation is
available from the task's Codex panel. Rescheduling an existing approved run is
not supported by personal-work updates; cancel it and approve a new run instead.

## Personal work assignment and updates

For creation, recognize category labels in parentheses, after an explicit category
marker, or immediately after a creation phrase. Preserve unrelated title text.
Ask only for a missing or ambiguous category or time window. A date alone needs
a time, unless the user explicitly chooses all day or no schedule. Classification
as Codex does not authorize worker execution.

Show a stable sequential CV code (such as CV-42) before each personal work title and in Ben's lookup
results. Resolve old UUID-based codes for compatibility. A single message may propose updates to up to eight distinct items.
Read fresh detail for each item, clarify unresolved references in chat, and
show one review with a single approval. Recheck permissions and item versions
for the whole batch at approval and commit the updates together.

A personal-work creation may carry nullable `assigneeUserId`. The signed-in user
remains the owner; assignment requires TASK_VIEW + TASK_MANAGE and a fresh uniquely
resolved personalWork.people recipient with task access. The review names the
assignee and that they may edit this item. Approval atomically sets the assigned
user and grants an EDITOR share on this item only. Do not transfer ownership or
expose other private tasks. A delivery recipient in a title is not an assignee.
Events do not accept assignees. Sharing alone does not mean task assignment.

`personalWork.search(query)` and `personalWork.detail(query=id)` read only owned or
explicitly shared personal items under TASK_VIEW, including an exact updatedAt
version in detail and no free-form notes. Search results are bounded/partial;
clarify ambiguity and read exact fresh detail before an update. The requester
must be an owner or EDITOR for writes; TASK_VIEW_ALL never grants personal edits.

`personalWorkUpdatePlan` is bound to the owned conversation revision and current
fenced worker lease, using the current user message as intent (history/records are
not consent). Shape: itemId, expectedUpdatedAt, fields, changes. Changes has nullable
title/note/dueAt/scheduledEndAt/status; fields selects the explicit changes. Unused
values must be null, selected title/status non-null. No owner/assignee/checklist
or progress injection in this update contract. Normal language interpretation is
by the model; there is no server keyword gate. Only current user-requested fields
are proposed; preserve unmentioned schedule values and all unrelated data.

One compact review identifies the actual existing task and the requested edits;
`update-personal-work` with conversation id/revision is the sole write approval.
A serializable transaction rechecks active actor, current personal edit access,
source permissions/task scope, exact row version and canonical checklist/event
rules, applies the canonical personal-work service edit plus activity and durable
receipt atomically. No automatic completion from chat. Events cannot be completed
and checklist completion cannot be bypassed. Stale target/revision returns 409,
lost scope/authority returns 403 and requires a fresh review. Replay returns the
prior receipt without applying an edit again. Receipt/draft visibility is checked
again on reload and worker handoff. Nothing executes on browser reload/history.

These tools do not modify regular workspace business tasks, technical issues,
orders or purchase-condition results. Existing personal calendar update behavior
is retained: no implicit Google or external notification send is added here.

## Ben push notifications

Signed-in Ben users opt in on each device. Subscription endpoints are accepted
only from supported browser push services. Delivery is post-commit, best effort,
for a newly approved task assigned to another user through Ben. Notifications
carry a fixed message and open /admin/ben. They contain no task or customer
details. Expired browser subscriptions are removed. Existing approval and
authorization checks remain in effect.
