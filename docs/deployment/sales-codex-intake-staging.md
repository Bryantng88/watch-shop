# Sales AI intake — staging extension of PR #34

## Behavior

On the Sales coordination page, users with TASK_VIEW, TASK_MANAGE, PRODUCT_VIEW
and CUSTOMER_VIEW (or active ADMIN) can submit up to three inquiries together.
Before submission they explicitly choose Sales/Technical/Operation recipients.
Sales defaults to the requester; the other recipients are never guessed.
Submitting authorizes the creation of internal follow-up tasks and in-app
notifications when the entire request can be resolved. Unlike order proposals,
there is no second human approval of a complete, unambiguous intake plan.

The model can choose successive read-only lookups: customer search, watch search,
watch detail (stock/sale/service stages and active reservation count), accessory
catalog search and open-work search. Each result is persisted with the intake.
Accessory catalog reads additionally require ACCESSORY_VIEW (or ADMIN). Without
that permission, the tool returns a restricted/unknown result and does not query
the catalog; staff-verification work may still be proposed.
Customer results exclude phone/email/address; search can use an exact phone
provided in the input. Model input includes user-entered text and bounded lookup
results. Do not submit unnecessary personal information. Catalog matches do not
establish physical accessory stock or compatibility; an empty search is unknown,
not proof of absence.

There are only five permitted follow-up types: verify accessory compatibility,
investigate accessory sourcing, technical verification, supply verification and
Sales follow-up. The server owns task titles, metadata, recipient routing and
writes. The planner has no SQL, DB credentials, network tool, business-write tool,
GitHub credential or NAS key. Worker tools remain read-only and deny auth/proc,
worker secrets, repository, Personal Work worktrees and other result files.
The worker's authenticated host process performs lookups outside the model tool
environment and submits the final structured plan for guarded application.

Tasks go to the existing Operation **Việc phát sinh** queue with WATCH bindings,
customer ID and original department in metadata; Technical follow-ups do not
create Technical Issues or Service Requests. Fresh data and current privileges
are checked transactionally. The requester can inspect the summary, lookup names,
created/reused tasks, responsible people and clarification questions. No orders,
customers, reservations, payments, purchases, price promises or customer messages
are created. Dates are not guessed; deadlines remain unset in this first slice.
Dependencies and automatic progression after staff complete work are not included.

## Clarification and duplicate handling

- All selected customer/watch identities must have unambiguous search evidence.
  The server blocks arbitrary selection from multiple candidates, even if the
  model subsequently searches a picked ID. Ask the user to clarify in a new
  request. Unknown/new customers must be created through the normal customer UI.
- Missing evidence/recipient, changed customer/watch/reservation state or existing
  manual watch work needing reconciliation yields NEEDS_INFO with no tasks for
  the entire batch. There is no silent partial application.
- Active follow-ups are deduplicated by customer + watch + follow-up kind across
  requests/users. Reuse appends the new requirement as an activity, preserving the
  original owner; it does not send duplicate notifications. An inactive/missing
  owner requires manual repair. Completed/cancelled follow-ups may be opened as
  new work. This deliberately coarse key does not distinguish two accessory
  subtypes for the same customer/watch: staff review the combined task activity.
- The requester can cancel a queued/running intake. Cancellation revokes its lease;
  a late worker cannot create tasks. Once applied, use normal task actions rather
  than treating cancellation as an undo.
- Request keys, leased claims, current actor checks and serializable transactions
  fence retries/concurrent completion. All task/binding/activity/notification and
  result writes commit together. Expired runs fail terminally; retry explicitly.

## Local staging rollout (not performed by Cloud)

This branch depends on the unmerged PR #34/#32/#29 chain. Deploy the reviewed
full branch commit, not an individual feature file. Preserve existing app/worker
configuration, auth/token/work volumes, seccomp, private routes and production.
Read staging-deployment-runbook.md before any NAS change.

1. Rehearse additive migration `20261103180000_sales_codex_intake` on a disposable
   synthetic DB, then apply it to staging under the normal backup/runbook gates.
   Do not bootstrap/reset staging or copy customer data into tests.
2. Build the app and worker from the same exact commit. The image now includes
   sales-worker.mjs, sales-intake-protocol.mjs and sales-turn-schema.json.
3. Add `SALES_CODEX_ENABLED=1` to the staging admin app and
   `SALES_CODEX_WORKER=1` to its dedicated worker; retain all existing flags and
   token/auth settings. These flags default off. Existing Personal Codex staging
   readiness guards must pass. Do not grant new roles or permissions automatically.
4. Keep `/api/internal/sales-codex/*` inaccessible through admin/public ingress.
   No new host port, SSH tunnel or Docker socket is required.
5. Use synthetic customers/watches and selected test recipients for real CLI
   acceptance. Submit three independent inquiries, confirm tool evidence and
   automatic creation/notifications, repeat and confirm reuse, then exercise
   ambiguous customer, missing watch, manual work, inactive recipient, expired
   lease and permission-revocation cases. Verify order/reservation counts unchanged.
6. Verify the Sales form and Operation ad-hoc queue in a browser, and check the
   original Personal Work/order proposal/Calendar paths. Cancel synthetic tasks
   and deactivate synthetic users; retain audit records.

Disable the app flag to reject new requests and worker calls; stop the Sales
worker loop before rollback, preserve intake/task/notification history and keep
both new additive tables. Never restore a database over live data automatically.

## Verification scope

Local unit/protocol tests use scripted model turns, not real model execution.
DB smoke uses a fresh loopback PostgreSQL database initialized from the preceding
schema followed by this exact migration; it never restores customer data. This
is not proof the historical migration chain can bootstrap an empty database.
Real sandbox/CLI/API acceptance on NAS remains a separate staging gate.

Repeatable local checks (loopback synthetic DB only):

```sh
node --import tsx src/domains/sales-intake/intake-schema.test.ts
node ops/codex-worker/sales-intake-protocol.test.mjs
node --import tsx scripts/smoke-sales-codex-intake.ts
node --import tsx scripts/smoke-sales-codex-http.ts
```

The HTTP smoke requires an already running local production build with the same
synthetic DATABASE_URL, AUTH_SECRET, APP_URL and worker token as the smoke process,
plus the staging-only feature flags. It drives scripted worker lookups/completion
through real HTTP; it does not call a real model or validate browser clicks.
