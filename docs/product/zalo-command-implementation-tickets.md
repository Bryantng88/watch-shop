# Zalo Command Implementation Tickets

Status: Proposed backlog

Source: `docs/product/zalo-command-development-plan.md`

Architecture: `docs/architecture/decisions/ADR-004-zalo-command-channel-boundary.md`

## Delivery rules

- Use one feature branch and reviewed PR per independently releasable ticket or
  tightly coupled schema/service pair.
- Keep every new command disabled by default.
- Use an isolated database and test OA/connector. Do not use production
  credentials or production data for tests.
- Schema changes are additive and backward compatible.
- A merged PR does not authorize a production tag or deployment.
- Do not start a ticket whose listed decision dependency is unapproved.

## Milestone 0: Contract and architecture validation

### ZALO-001 — Approve command-channel ADR

Scope:

- review connector boundary, identity cardinality, conversation policy,
  confirmation expiry, and reply-outbox ownership;
- record owner approval by changing ADR-004 from `Proposed` to `Accepted` and
  resolving every approval gate.

Acceptance:

- no unresolved trust-boundary or access-control decision remains;
- any rejected recommendation is replaced with an explicit alternative and
  consequence analysis.

### ZALO-002 — Capture current official OA contracts

Scope:

- export sanitized contract notes from the authenticated Zalo developer
  console for webhook authentication, events, acknowledgement, retry, reply,
  addressing, and callbacks;
- record API versions and verification date without credentials or real user
  identifiers;
- add provider fixtures containing synthetic IDs only.

Acceptance:

- fixtures cover supported text and callback events plus invalid signature,
  duplicate delivery, unsupported event, and oversized payload;
- documentation identifies features unavailable to the target OA/app plan;
- no implementation relies on an undocumented field.

Dependencies: target test OA/app and console access.

### ZALO-003 — Produce connector contract v2

Scope:

- define normalized inbound-message and outbound-reply schemas;
- define canonical HMAC input, key rotation, timestamp, nonce, payload limits,
  error responses, and idempotency behavior;
- preserve the existing `watch.lookup` and `order.create` contract.

Acceptance:

- schemas reject unknown fields and unbounded strings;
- contract tests can be shared by connector and Watch Shop;
- provider-native data is absent from domain contracts.

Dependencies: ZALO-001, ZALO-002.

## Milestone 1: Durable command transport

### ZALO-101 — Add inbound message persistence

Scope:

- add additive models/migration for normalized inbound receipt and command
  execution state;
- implement atomic deduplication by connector/provider message identity;
- define processing lease, stale recovery, expiry, and retention cleanup.

Acceptance:

- concurrent duplicate delivery creates one execution;
- a crash during processing is recoverable after lease expiry;
- stored payloads contain no signature, token, or raw provider profile;
- old `IntegrationIngressReceipt` behavior remains compatible.

### ZALO-102 — Implement pure parser and command registry

Scope:

- parse strict `/help` and diagnostic commands first;
- register aliases, argument schemas, caller tier, permission, conversation
  policy, read/write classification, confirmation requirement, help text, and
  kill-switch key;
- return a non-mutating help response for unsupported input.

Acceptance:

- parser has no database/network dependency;
- unit tests cover whitespace, casing policy, malformed input, oversized
  arguments, unsupported commands, and callback versions;
- the registry rejects a write handler without confirmation metadata.

Dependencies: ZALO-003.

### ZALO-103 — Add durable reply outbox and worker

Scope:

- add reply-outbox model/migration, lease claiming, retry/backoff, terminal
  failure, and sanitized error storage;
- define stable idempotency and correlation keys;
- add connector reply adapter without changing `sendZaloTextToGroup` semantics.

Acceptance:

- business/command transactions never perform a provider network call;
- concurrent workers cannot claim the same live lease;
- transient failure retries are bounded and observable;
- permanent failure and safe manual retry eligibility are distinguishable.

Dependencies: ZALO-003.

### ZALO-104 — Wire versioned ingress, `/help`, and diagnostics

Scope:

- authenticate connector v2, validate/normalize message, persist receipt,
  dispatch `/help`, and enqueue a reply;
- acknowledge promptly and process slow work through a durable worker;
- add global/per-command disabled-by-default controls and structured logs.

Acceptance:

- one duplicated inbound event results in one execution and one reply row;
- unsupported, disabled, and invalid requests perform no domain mutation;
- logs expose correlation and latency but no content, identifiers requiring
  redaction, signatures, or credentials.

Dependencies: ZALO-101, ZALO-102, ZALO-103.

### ZALO-105 — Add Milestone 1 operations surface

Scope:

- expose readiness, execution status, delivery status, retry eligibility,
  latency, duplicate count, and kill-switch state to authorized Admin users;
- implement bounded filters and pagination.

Acceptance:

- secret/token values and raw payloads are never returned;
- Admin authorization is tested;
- manual retry cannot bypass idempotency or retry eligibility.

Dependencies: ZALO-104.

## Milestone 2: Public MVP

### ZALO-201 — Implement public `/watch`

Scope:

- map strict query/SKU arguments to the existing public catalog service;
- render bounded public-safe results for direct and group conversations.

Acceptance:

- response contains only storefront-public fields;
- pagination/result limits prevent oversized replies;
- no internal watch, inventory, cost, or workflow fields are exposed.

### ZALO-202 — Implement guided public `/order`

Scope:

- collect the minimum public order fields in a direct conversation;
- show a canonical preview and require confirmation before submission;
- call `submitPublicOrder` with stable channel/external idempotency keys.

Acceptance:

- group invocation performs no write and returns a direct-message handoff;
- duplicate confirm/delivery creates one order request;
- unavailable product and stale price/state are revalidated at confirmation;
- existing connector `order.create` clients remain compatible.

Dependencies: ZALO-201 and confirmation foundation from ZALO-401.

### ZALO-203 — Decide and implement request-status ownership proof

Scope:

- document the customer proof mechanism before implementation;
- return only public-safe request status.

Acceptance:

- knowing a public code alone is insufficient unless the owner explicitly
  approves that risk;
- enumeration and rate-limit tests pass.

Decision dependency: customer verification policy.

## Milestone 3: Staff identity and reads

### ZALO-301 — Add identity links and one-time codes

Scope:

- add additive link/code models and retention cleanup;
- allow an authenticated Admin user to issue a self-link code;
- atomically consume `/link` only in direct conversations;
- support revoke and immediate disabled-user enforcement.

Acceptance:

- codes are hashed, short-lived, attempt-limited, and single-use;
- profile name/phone/avatar never grants authorization;
- tests cover concurrent consumption, expired code, OA mismatch, revoked link,
  disabled user, and cardinality conflicts.

Dependencies: ADR identity policy approval.

### ZALO-302 — Add identity Admin operations

Scope:

- show safe link identity, status, timestamps, and audit correlation;
- add revoke action using existing Admin authorization patterns.

Acceptance:

- no linking code hash or provider credential is exposed;
- revoke takes effect for the next command and is audited.

### ZALO-303 — Add permission-aware staff read framework

Scope:

- resolve the active linked user for each execution;
- call the repository's server-side permission source;
- centralize direct/group redaction policy;
- implement one read command at a time, starting with `/task mine` or the
  owner-approved alternative.

Acceptance:

- anonymous, unlinked, linked, disabled, revoked, and insufficient-permission
  matrix tests pass;
- group staff reads remain denied by default;
- command responses match the permission scope of the equivalent Admin query.

Decision dependency: first staff read and permission mapping.

## Milestone 4: Confirmed write vertical slice

### ZALO-401 — Implement confirmation sessions

Scope:

- add durable confirmation model and hashed token lifecycle;
- bind token to sender, direct conversation, linked user, payload hash, target,
  target version/precondition, and expiry;
- atomically claim, reauthorize, revalidate, execute, and record result.

Acceptance:

- expiry, reuse, payload change, cross-user, cross-conversation, stale target,
  revoked link, and permission loss all fail without a mutation;
- concurrent confirms execute the domain command at most once;
- preview and stored audit payload are safe for the caller's permission.

Dependencies: ZALO-301, ADR confirmation policy approval.

### ZALO-402 — Select the first low-risk write

Produce a short decision note comparing candidate operations on reversibility,
financial/inventory impact, existing idempotency, permission clarity, event
coverage, and recovery. Do not select payment, expenditure, inventory ownership,
or shipment dispatch as the first slice unless the review explicitly accepts
the higher risk.

Recommended first candidate: accepting or completing a caller-assigned task
action whose canonical Task service already enforces transition permission and
idempotency.

### ZALO-403 — Implement the approved write command

Scope:

- add one registry entry, preview, permission mapping, canonical domain call,
  event/audit correlation, reply rendering, and recovery runbook;
- do not introduce a second business transition implementation.

Acceptance:

- all ZALO-401 security cases pass end to end;
- the command emits the same business event as the Admin action;
- retries and stale state have deterministic user-visible outcomes;
- kill switch blocks prepare and confirm paths.

Dependencies: ZALO-401, ZALO-402.

## Milestone 5: Hardening and rollout

### ZALO-501 — Complete retention and recovery jobs

- expire link codes and confirmations;
- archive or delete inbound/execution/reply data according to approved periods;
- recover stale leases and alert on terminal delivery failures;
- document safe replay and manual retry procedures.

### ZALO-502 — Run concurrency, outage, and privacy test matrix

- duplicate and reordered webhook delivery;
- concurrent confirmation and worker claims;
- connector timeout, OA timeout, token refresh failure, and prolonged outage;
- rate-limit exhaustion and kill-switch activation;
- structured-log and Admin-response privacy review.

### ZALO-503 — Stage rollout

- deploy only through the repository workflow to an authorized test target;
- enable `/help`, then `/watch`, then identity/read commands for an allow-list;
- observe error, latency, duplicate, retry, token, and privacy indicators;
- rehearse disable and rollback before any write-command rollout.

Production requires separate authorization for the exact `origin/main` commit
and `production-*` tag.

## Standard verification per implementation PR

Run the scoped unit/integration tests plus:

```text
npm run lint
npx tsc --noEmit
npm run build
npm run storefront:smoke-zalo
```

Database-bearing tickets also require isolated-database replay, concurrency,
and migration compatibility tests. Provider contract tests use only synthetic
fixtures and a test OA/connector.
