# Product customer assistant: staging handoff

Read AGENTS.md, staging-deployment-runbook.md and ../design/ai-assistant-interaction-contract.md first. This release has not been applied to NAS by the implementation task. The user authorized real technical issues/tasks **after explicit approval on staging**; production remains unauthorized.

## Runtime behavior

The shared Product assistant has separate live and local modes. Local retains deterministic browser-only fixtures. Live staging uses the existing ChatGPT-authenticated Codex CLI, not an OpenAI API key. It never falls back to mock responses on errors. New worker protocol is independent of the old Sales intake auto-apply protocol.

Live conversation history, pending plan, revision, lookup evidence, approval and condition results are stored in CustomerAssistantConversation. This is the durable pilot customer-request record, not a general CRM module. Only the requester can access/approve it. No shared conversation ACL has been added. Work recipients use the existing technical/Operation queues.

Chat gathers facts and corrects the pending plan. Missing/ambiguous watch, technical classification or recipient yields a short question with no Assign button. Customer identity is optional for pre-order preparation: customerId may be null and unknown/unregistered names stay in conversation text, without forcing registration. If an existing customer ID is explicitly linked, it still requires unique lookup evidence and freshness at approval. Watch/recipient/catalog IDs always require unique evidence; ambiguous matches cannot be selected arbitrarily. No employee/sample names are hardcoded in live mode. Active TechnicalDetailCatalog entries determine technical classification. Missing/uncertain registry mapping must be clarified, not silently turned into a task to bypass the technical workflow.

One approval posts only conversation ID and revision. The server rechecks actor/recipient rights, unique evidence, customer/watch/catalog freshness and existing open work. It creates all linked technical issues/tasks, notifications and approval state in one serializable transaction with retries. Concurrent/repeated approval returns existing links. Technical creation reuses the current active-service rules and technical issue command; **product/service stage can change according to those existing rules**. It does not confirm technical cost, approve payments or bypass downstream technical confirmations.

The pilot blocks new assignment when the watch is reserved/not in stock or has open watch work/technical issues. It does not automatically merge/reassign somebody else's work. Follow the normal workflow to reconcile those cases. No order, reservation, purchase, financial record or outbound customer message is created. After assignment, chat can explain current state but cannot silently change the approved plan. Progress is read from canonical TechnicalIssue/TaskItem records; purchase-condition outcome is separately recorded by the request owner. A completed work item does not automatically pass the purchase condition, and passing conditions never creates an order.

## Files and migration

- UI: src/domains/ai-assistant/AiAssistant.tsx and CustomerRequestDemo.tsx.
- Public authenticated API: /api/admin/customer-assistant (strict commands: send, cancel, approve, outcome).
- Worker API: /api/internal/customer-assistant/{claim,heartbeat,lookup,finish}; keep private.
- Backend: src/domains/ai-assistant/server and live-contract.ts.
- Worker: ops/codex-worker/customer-assistant-worker.mjs, customer-assistant-protocol.mjs, customer-turn-schema.json; container-start.mjs enables the extra loop.
- Additive migration: 20261104180000_customer_assistant_conversations. New table/FK/indexes only; no existing customer/order columns are rewritten.
- Worker Dockerfile includes the new files and keeps CLI 0.166.0 and existing isolation.

Deploy the complete branch, including its unmerged PR #38/#36 dependency chain. Do not cherry-pick only the panel or reuse production deployment scripts. Record exact Git revision and image digests before switching containers.

## Configuration changes (staging only)

| Target | Add/change |
| --- | --- |
| Admin app | CUSTOMER_AI_ENABLED=1 |
| Admin app | CUSTOMER_AI_MAX_TURNS_PER_HOUR=30 (optional, default 30; accepted range 1–100) |
| Existing worker | CUSTOMER_AI_WORKER=1 |

Keep existing PERSONAL_CODEX_ENABLED=1, PERSONAL_CODEX_ENVIRONMENT=staging and PERSONAL_CODEX_WORKER_TOKEN unchanged. Preserve APP_URL=https://admin-staging.vinticwatches.vn, exact Calendar callback, AUTH_SECRET, Calendar encryption/OAuth secrets, existing Personal/Order/Sales flags and unrelated env. The guard accepts only host watch-shop-staging-db/database watch_shop_storefront_staging and that exact HTTPS admin hostname (or the isolated loopback personal_codex_test fixture).

Do not fetch Cloud private keys or introduce API credentials. Reuse the current worker's auth/work/secrets volumes, UID, token files, read-only rootfs, tmpfs, resource limits, restart policy, cap-drop ALL, no-new-privileges and reviewed seccomp profile. No Docker socket, database credentials or NAS SSH identity is added to worker/model. Model subprocess has no network or inherited application/worker/GitHub secrets; parent performs bounded read-only lookups. Other workspace/auth/proc/results paths remain denied.

Limits: 3 pending requests per requester, 38 stored messages before a new conversation is required, default 30 user turns/hour, 16 lookups/turn, 15-minute worker deadline and fenced 120-second renewable lease. Active polling refreshes the selected conversation, not all historic linked work. Closing a panel preserves the run/history; Cancel explicitly revokes the run token.

An active authenticated actor may chat without business permissions. Each business lookup requires its corresponding view permission. Task creation requires PRODUCT_VIEW, TASK_VIEW and TASK_MANAGE; technical creation requires PRODUCT_VIEW, TASK_VIEW and SERVICE_CREATE. Linking a customer additionally requires CUSTOMER_VIEW. Normal permission implications and the existing ADMIN policy apply. Technical reads/creation additionally require SERVICE_VIEW/SERVICE_CREATE; technical recipients must be active and able to update service work. Ordinary task recipients must be active and able to view tasks. Accessory lookups require ACCESSORY_VIEW. Worker account identity is not an authorization bypass for the requester.

## Controlled rollout

1. Recheck live staging source/digests and idle worker queues. Carry current Env/HostConfig in memory; never print whole docker inspect or env. Validate exact staging DB host/name. Do not read production configuration.
2. Create/verify a private NAS-only staging DB backup under the existing approved backup procedure. Keep the prior admin and worker containers/images available, with canonical names and IDs recorded.
3. Build new admin/ops and worker images from one recorded revision. In a worker overlay build, copy **all** new customer files plus updated container-start.mjs and retain existing worker modules. Rebuilding only admin is insufficient.
4. Apply `npx prisma migrate deploy` using the guarded staging ops env, then `npx prisma migrate status`. This adds the conversation table; the old app remains compatible with the additive schema.
5. Replace only the staging admin app and existing worker, preserving launch/security/network settings and adding the flags above. The public storefront need not be replaced for this admin-only feature. No DNS/proxy/Cloudflare/SSH changes are required.
6. Run `node --import tsx scripts/check-customer-assistant-configuration.ts` in the ops image with the current admin env internally. It reports booleans/catalog count, never credentials. Run the Calendar configuration checker as regression. Confirm admin health/readiness/login, worker restart count and existing Personal/Order functionality.
7. Confirm /api/internal/customer-assistant/claim is denied through both public and admin ingress; only the private worker network may call it. Do not add an ingress exception to make the worker work.
8. Test live through https://admin-staging.vinticwatches.vn/admin/watches. LAN origin is not the canonical APP_URL and is intentionally not a CSRF bypass.

When the new live assistant is enabled, the old Sales auto-apply panel is hidden to avoid two conflicting user flows; its existing worker/protocol is otherwise left intact for already queued jobs.

## Staging acceptance with real Codex (still required)

Use clearly identified staging fixtures and eligible real staging user accounts. Do not use literal local names Minh/An unless those are real unique accounts.

1. Open a specific watch. Describe preparation for an unregistered prospect with clear conditions and recipients. Expect a reviewable proposal without requiring a customer profile, and zero work before approval.
2. Optionally link an existing customer profile; only explicit linked IDs need unique evidence. Technical catalog and recipients remain required. Ambiguous watch/recipient matches must be clarified. Correct/remove a pending condition through chat.
3. Expect a compact summary with real labels, technical/task classification and recipients, no intake form. Assert **zero** new issues/tasks/notifications before approval.
4. Approve once. Verify assigned TechnicalIssue with the selected active technical-detail catalog, a canonical Operation ad-hoc task with watch binding, notifications, and stable links in the customer request. Reload/repeat approval: no duplicate records.
5. Update work through the normal technical/Operation UI. Refresh assistant: it must show actual progress. Record purchase-condition pass/fail separately. No order or stock hold may appear automatically.
6. Check wrong user/role, revoked/inactive recipient, stale revision/watch data, existing open work, quota, Cancel and late worker completion. Failures must not partially create linked work.
7. Confirm production source/state and ingress limits unchanged. Record real CLI run/conversation IDs and acceptance outcome before declaring live CLI acceptance complete.

## Rollback

Disable CUSTOMER_AI_ENABLED and CUSTOMER_AI_WORKER, or restore the retained previous admin/worker containers with their exact configurations. Check active customer runs first; cancel or let them finish before stopping worker. Preserve all existing auth/secret volumes. Keep the additive table/history; do not drop it or restore an old DB automatically.

Disabling UI or rolling back images does **not** undo real approved issues/tasks. Manage those through the normal authorized workflows. Database restore would discard subsequent writes and requires a separate decision. Recheck health, Calendar, old worker loops and private-route denial after rollback.

## Verification already done / limits

Local automated testing uses an isolated loopback personal_codex_test database with synthetic fixtures, never a NAS data copy. Source/contract tests, read-only worker protocol tests, exact migration SQL in a rolled-back temporary schema, transaction smoke and authenticated HTTP smoke cover the chat/approval boundary. The model's outputs in these tests are scripted, not live CLI calls. Existing Linux-only worker lifecycle tests were not claimed as Windows successes. See the PR for final command results. Actual ChatGPT-authenticated CLI and visual browser acceptance are staging checks above, not inferred from a healthy build.

Customer-optional follow-up: deploy app and updated customer worker/schema together. No new migration is required for nullable customerId in the JSON plan. A profile is a reference, not a prerequisite to pre-order work; no profile or order is automatically created.

### Product photos in chat

The customer worker supports the bounded read-only `watches.images(productId)`
lookup after a product appears in this turn's `watches.search` evidence. Photo
browsing can show multiple search candidates; this does not satisfy or weaken
unique-watch evidence required for approving work. A successful reply attaches
up to six product cards with up to four admin-visible INLINE/GALLERY photos each.
Cards use one fixed-size main photo beside the title/SKU, thumbnail selection and
a full-size image link, rather than expanding every photo in the conversation.
Only product IDs are stored in messages; the server refreshes titles and image
sources from ProductImage when loading history. Model-generated image URLs are
never rendered. Photos use the application's existing authenticated media route.
The worker receives photo metadata, not pixels, and must not claim visual analysis.

Deploy the updated web app **and customer worker** from the same PR revision to
use this lookup. No migration or new credentials are needed. Local verification
uses synthetic database/image metadata and a scripted model; actual storage reads
and a real Codex photo conversation still need staging acceptance.

### Assistant identity: Ben

Ben is the fixed user-facing name in the launcher, panel and customer worker
instructions. The worker supplies this identity on every model invocation,
including lookup rounds and resumed history. Addressing Ben does not identify a
customer or assignee. Existing history is preserved; old messages are not rewritten.
Deploy web and worker together to apply both the display name and model identity.

### Free conversation and current-user authorization

Any active authenticated account may chat with Ben. This does not grant business
access. Server-owned capabilities enumerate allowed lookups and action types;
the server rechecks current permissions before cache reads, lookups, completion
and approval. Task reads reuse the existing task-item detail authorization policy.
Permission-denied lookups return a safe explanation, not data. Revoked access
also redacts saved assistant messages, cards and linked work on history refresh.
Current-user identity comes from the application session; worker credentials
never substitute for requester authority.

Live chat has no visible context selector/product pin or 38-message cutoff.
Full messages remain in the existing conversation JSON. Worker input uses the
last 12 messages and bounded older user notes, explicitly untrusted and not
evidence or approval. Fresh lookups remain necessary for business actions.
Approved requests are archived in the server-owned JSON by approval revision;
old approval replays do not dispatch again, and later chat can prepare a new
request with a fresh explicit approval. No database migration or new secret is
needed. Deploy app and worker from the same revision and preserve all volumes.

Ben is named after a cat Long deeply loves. Long created the entire project.
Explain simply if asked without mentioning death/loss, inventing details,
sentimental storytelling or claiming the cat is physically alive. An invalid model format receives at most
one strict-format correction; invalid tool calls are never executed.

### Permission support for Long

Account identity/capabilities now include server-owned role names, effective
permission codes and the verified Long-account flag. Exact account questions
are answered directly from the current authenticated account without queuing a
model job. Unsupported capabilities are separate from actual absent permissions;
support drafts need a real missing permission and never target the requester
when it is the configured Long account.

When an action exceeds user permissions, recommend contacting Long and offer a
permission-support task. The worker only drafts a concise issue summary. One
explicit approval creates a normal ad-hoc task assigned to Long, with activity
and an internal notification. Chat agreement alone does not create work.

Set CUSTOMER_AI_PERMISSION_CONTACT_USER_ID on the admin app to the verified
Long account ID. The server requires that exact account to be active with ADMIN
role; names/chat claims never establish identity. Missing/invalid configuration
fails closed and recommends direct contact. Preserve other env and worker volumes;
deploy app and worker together. No new credential or migration is needed.

This narrow route is available to active chat users without TASK_MANAGE, but
never grants permissions or executes the original blocked action. It accepts
only conversation ID and review revision, derives the requester from the session,
rechecks ownership and source-data scope, and serializes/idempotently creates
one task per revision. Each requester may have at most three open support tasks.
It exposes confirmation references rather than private task IDs/content; sensitive
summaries are hidden and approval rejected if source access is revoked.

### Draft orders through Ben

Deploy app and customer worker together for the updated order JSON schema.
No migration or credential change is needed. Ben creates DRAFT watch-sale orders
after one explicit compact-review approval, using the existing canonical
createOrderWithItems command. It does not post orders, record payments or create
shipments; canonical draft inventory HOLD behavior is disclosed in the review.
COD/deposit, trade-in and non-watch lines remain in the order UI.

The canonical create command has optional server-only transaction hooks so Ben
can lock/recheck the owned review, current permissions, evidence/customer version
and product state, and commit the resulting order reference atomically with the
order. Existing callers omit the hooks and retain their behavior. Existing
customer profiles are preserved; a new profile requires CUSTOMER_CREATE.
Replayed approvals and competing drafts cannot create duplicate watch orders.

Verification: account/order-contract unit tests, worker protocol tests,
scripts/smoke-ben-order-draft.ts on an isolated loopback personal_codex_test DB,
and authenticated HTTP tests. All write probes must use synthetic fixtures.

### Selling-price references and current-screen hints

Deploy app and customer worker instructions together. Browser reload is needed
for the new optional send.screenPath field. No migration, new flag or credential.
Keep all existing env/OAuth/Calendar settings, worker volumes and private ingress.

Only Ben's watch search/detail results gain the bounded reference-price projection;
legacy Sales intake lookups and order-write commands are unchanged. PRODUCT_VIEW
permits salePrice/listPrice; no costs/minimums/notes are selected even for ADMIN.
Prices stay decimal strings with VND, update time and REFERENCE_ONLY usage.

screenPath is pathname only. Resolve canonical page policy and minimal existing
order/watch identity on claim; include its read permissions in the finish/history
redaction scope. Raw screenHint never appears in public conversation DTOs. Each
new message replaces or clears it. It is a client-route snapshot, not a screenshot,
live tracking, automatic context selection or business-tool evidence.

Regression: scripts/smoke-ben-prices-screen.ts on an isolated loopback
personal_codex_test DB. Real-model acceptance: scripts/smoke-ben-prices-screen-real.ts
with BEN_REAL_PRICE_SCREEN_EVAL=1 and the separate synthetic fixture worker. It
checks fresh/missing prices, current order/screen changes, missing hints and no
cost disclosure or business writes. Never use production/staging business data
for the model acceptance fixtures.
