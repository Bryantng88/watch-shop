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
bounded open work through the end of today in Asia/Ho_Chi_Minh, including
overdue and unscheduled work, with no notes or actions. Empty results and
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
shares/Google sync. Viewer sharing is the default for an explicit share request;
EDITOR must be expressly requested. Reserved codex execution is not part of this
personal plan. EVENT requires a date, has no checklist/completion/progress and can
have a start-only time. All-day uses the existing local end-of-day date encoding.

A complete compact review is corrected in chat and approved once via the dedicated
button. Approval rechecks current authority/category/recipients and exact revision,
then atomically creates one canonical owner-scoped TaskItem plus checklist/shares
and a durable conversation receipt. Concurrent/replayed approvals return that
receipt, never create duplicates. No order, technical issue, product reservation
or notification dispatch is inferred from this plan. Business, personal, order,
permission, code and navigation proposals must not be mixed in a turn.

Google sync is a separately described optional result of that same approval. A
provider failure never loses the already-created item or repeats creation; show
saved-but-not-synced and link to the existing Personal Work sync control. Receipt
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

Customer repair progress uses customerRepairs.search under SERVICE_VIEW. The
lookup searches active and completed-but-not-delivered CUSTOMER_OWNED tickets
by watch identifiers without a date constraint or private customer fields.
Photo inventory search tries exact SKU before matching all identifying terms.
Image turns show bounded candidate cards using inline photo, title and selling
price. Ordinary requests for a product gallery still use the gallery card.
