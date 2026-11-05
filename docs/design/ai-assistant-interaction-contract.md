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
