# Zalo Command Development Plan

Status: Draft for implementation planning  
Last updated: 2026-10-06  
Target repository: Watch Shop  
Target branch for implementation work: create one feature branch per milestone

## 1. Purpose

This document defines the preliminary plan for turning the existing Zalo
integration into a safe, auditable command channel for customers and internal
operators.

The intended outcome is not a general-purpose conversational AI. It is a
deterministic Zalo command surface that:

- reuses existing Watch Shop domain services instead of duplicating business
  logic;
- separates public customer actions from authenticated staff operations;
- requires explicit confirmation before any sensitive write;
- records the caller, command, target, result, and business events;
- remains idempotent when Zalo retries a webhook or the application retries a
  delivery;
- can be operated, observed, disabled, and recovered from the Admin UI.

## 2. Current state

### 2.1 Inbound connector contract

The repository currently exposes:

```text
POST /api/integrations/zalo/events
```

The endpoint accepts an owned Watch Shop HMAC contract. It is not a native
Zalo OA webhook adapter. The allow-listed event types are:

- `watch.lookup`, backed by the public catalog query;
- `order.create`, backed by the public order request flow with channel `ZALO`.

Relevant code:

- `src/app/api/integrations/zalo/events/route.ts`
- `src/domains/storefront/contracts/zalo-ingress.contract.ts`
- `src/domains/storefront/server/zalo-ingress-auth.ts`
- `src/domains/storefront/server/zalo-ingress.service.ts`
- `scripts/smoke-zalo-ingress-contract.ts`

Existing safeguards include HMAC-SHA256 verification, a five-minute timestamp
window, strict schemas, a 64 KiB application payload limit, durable event
receipts, replay detection, and order idempotency.

### 2.2 Outbound Zalo OA notifications

The notification domain already supports:

- Zalo OA access-token refresh and persisted token status;
- sending text messages to a configured Zalo group;
- notification rules driven by business events;
- recipient groups and Admin configuration;
- dispatch and delivery status tracking.

Relevant code:

- `src/domains/notification/server/channels/zalo/`
- `src/domains/notification/server/channel-settings.service.ts`
- `src/domains/notification/server/notification-event-consumer.ts`
- `src/app/(admin)/admin/system/channels/`

### 2.3 Missing capabilities

The current system does not yet provide:

- a verified native Zalo OA webhook adapter;
- deterministic parsing of Zalo text or button interactions;
- `/help`, `/watch`, `/order`, or staff command syntax;
- a durable Zalo conversation/message model;
- Zalo-user-to-Watch-Shop-user identity linking;
- permission checks based on the linked internal user;
- confirmation sessions for write commands;
- responses sent back to the originating Zalo conversation;
- command-level operations, audit views, rate limiting, or recovery controls;
- end-to-end HTTP/database tests against an isolated environment.

## 3. Architectural decisions

These decisions should be confirmed before implementation begins.

### 3.1 Adapter boundary

Keep the existing Watch Shop ingress contract as an internal integration
boundary. Add a native Zalo OA adapter in front of it rather than placing Zalo
payload details inside Storefront or Order services.

```text
Zalo OA webhook
  -> native Zalo verification and normalization
  -> Zalo command parser
  -> identity and permission policy
  -> command application service
  -> existing domain command/query
  -> durable reply outbox
  -> Zalo OA reply adapter
```

Official Zalo webhook signature, event, button, and reply contracts must be
verified against the current official documentation immediately before coding.
Do not infer them from old examples or replace the existing owned HMAC verifier
without a migration plan.

### 3.2 Deterministic commands first

Phase 1 must use explicit commands, buttons, and typed schemas. Natural-language
classification may be added later for discovery, but it must never directly
execute a payment, inventory, order, shipment, or approval write.

### 3.3 Domain ownership

Zalo is an input/output channel only. Business mutations remain owned by their
existing domains. The Zalo layer may call public application services or
permission-checked domain commands, but must not write business tables directly.

### 3.4 Confirmation policy

Every sensitive write follows this sequence:

```text
prepare -> show canonical preview -> confirm -> reauthorize -> revalidate state
-> execute domain command -> emit/audit -> enqueue reply
```

Confirmation tokens must be short-lived, single-use, bound to the Zalo sender,
conversation, exact normalized command payload, and current target/version.

### 3.5 Identity tiers

- Anonymous or unlinked users may access public catalog lookup and public order
  request intake only.
- Linked staff users may access read commands permitted by their internal role.
- Write commands require both a linked active user and the same permission used
  by the equivalent Admin action.
- Names, phone numbers, display names, and Zalo profile fields must never grant
  authorization by themselves.

## 4. Proposed command catalog

### 4.1 MVP public commands

| Command | Example | Behavior | Confirmation |
| --- | --- | --- | --- |
| Help | `/help` | Lists available commands for the caller | No |
| Watch lookup | `/watch Omega` or `/watch <SKU>` | Searches the public catalog | No |
| Order request | `/order <SKU>` | Starts a guided public order request | Yes, before submit |
| Request status | `/request <public-code>` | Returns a public-safe status | No, ownership proof required |

The existing `watch.lookup` and `order.create` services should remain the
canonical implementation for the first two business capabilities.

### 4.2 Staff read commands

| Command | Result |
| --- | --- |
| `/watch <SKU>` | Internal watch summary allowed by permission |
| `/order <code>` | Order, payment, and shipment summary |
| `/payment <code>` | Payment status and outstanding amount |
| `/shipment <code>` | Shipment status and carrier reference |
| `/task mine` | Caller-assigned actionable work |

Responses must minimize customer and financial data based on caller permission
and conversation type. Sensitive details should not be emitted into a group
conversation by default.

### 4.3 Staff write commands

Candidate commands, implemented only after identity and confirmation are live:

- confirm payment receipt or expenditure;
- confirm customer email verification outcome when the domain permits it;
- dispatch or update a shipment through shipment domain commands;
- accept, assign, or complete supported task actions;
- transition an order only through its canonical operation adapter.

Each command needs a separate permission matrix, precondition policy,
confirmation preview, idempotency key, audit payload, and rollback/recovery
story. Implement one vertical slice at a time.

## 5. Proposed components

Names are provisional and should follow existing repository conventions.

### 5.1 Contracts

- Native webhook envelope schemas.
- Normalized `ZaloInboundMessage`.
- Discriminated `ZaloCommand` union.
- Typed command result and reply payloads.
- Versioned callback/button payloads.

### 5.2 Native ingress adapter

- Validate the current official Zalo signature contract.
- Reject unsupported events and oversized payloads before processing.
- Normalize text, sender, conversation, message, timestamp, and reply context.
- Persist a receipt before dispatch.
- Acknowledge within Zalo's required response window; defer slow work safely.

### 5.3 Parser and command registry

The registry should define, per command:

- aliases and strict argument schema;
- anonymous/linked-user policy;
- required permission;
- conversation policy: direct, group, or both;
- read/write classification;
- confirmation requirement;
- handler and help text.

Parsing should be pure and unit-testable. Unsupported input returns help or a
clarifying choice and performs no mutation.

### 5.4 Identity linking

Recommended flow:

1. A signed-in Admin user requests a short-lived one-time linking code.
2. The user sends `/link <code>` to the OA in a direct conversation.
3. The server atomically consumes the code and stores the Zalo identity link.
4. The Admin UI shows linked identity, time, status, and revoke action.
5. Disabling the Watch Shop user or revoking the link immediately blocks staff
   commands.

Store only identifiers needed for operation and auditing. Define retention and
redaction rules before storing profile payloads.

### 5.5 Confirmation sessions

A durable confirmation record should contain:

- command type and normalized payload hash;
- sender, conversation, linked user, target type/id;
- prepared target version or business precondition;
- expiry, consumed timestamp, and status;
- safe preview and resulting operation/event references.

Confirmation must execute atomically or idempotently. Expired, reused, changed,
or cross-user confirmation tokens are rejected.

### 5.6 Reply outbox

Do not send Zalo replies inside business transactions. Persist an outbox item
and deliver asynchronously with:

- deterministic idempotency key;
- bounded retry with backoff;
- terminal failure and sanitized error;
- correlation to inbound message, command execution, and business event;
- manual retry where safe;
- token refresh through the existing Zalo token service.

Extend the outbound adapter beyond group text only after confirming official
support for user/conversation replies and interactive messages.

### 5.7 Operations and Admin UI

Add an operational view showing:

- token/webhook readiness without exposing secrets;
- inbound command counts and latency;
- `RECEIVED`, `PROCESSING`, `AWAITING_CONFIRMATION`, `SUCCEEDED`, `FAILED`, and
  `EXPIRED` executions;
- delivery status and retry eligibility;
- identity links and revocation;
- command-level kill switches and rate-limit status;
- safe event/operation correlation for investigation.

## 6. Data model outline

Do not finalize migrations until names and retention rules are reviewed. Likely
entities are:

- `ZaloIdentityLink`
- `ZaloIdentityLinkCode`
- `ZaloInboundMessage` or a generalized integration message receipt
- `ZaloCommandExecution`
- `ZaloCommandConfirmation`
- `ZaloReplyOutbox`

Reuse `IntegrationIngressReceipt`, `NotificationDispatch`,
`NotificationChannelDelivery`, Business Events, and operation records where
their semantics fit. Do not overload notification delivery records to represent
inbound command execution.

All migrations must be additive and backward compatible with the previously
deployed application.

## 7. Security and privacy requirements

- Verify native webhook authenticity before JSON dispatch.
- Keep owned connector keys and native Zalo credentials separate and rotatable.
- Never log signatures, tokens, raw credentials, or complete customer payloads.
- Rate-limit by connector, sender, conversation, command, and IP where useful.
- Enforce replay protection on both inbound messages and confirmations.
- Use the existing server-side permission source; never trust a permission in a
  webhook payload.
- Recheck authorization and business state at confirmation time.
- Default group replies to non-sensitive summaries.
- Sanitize error responses and store bounded error messages.
- Define data retention, expiration, cleanup, and unlink behavior.
- Provide global and per-command kill switches.

## 8. Delivery milestones

### Milestone 0: Contract and architecture validation

- Confirm native Zalo OA webhook and reply contracts from current official docs.
- Decide direct native integration versus an external connector deployment.
- Approve identity-linking and group-conversation policies.
- Produce threat model and sequence diagrams.

Exit criteria: architecture decision record and reviewed contracts.

### Milestone 1: Native ingress and durable replies

- Implement native adapter and normalized inbound schema.
- Add durable message receipt and reply outbox.
- Implement `/help` and echo-safe diagnostic handling in a test OA.
- Add command kill switch, rate limit, metrics, and structured sanitized logs.

Exit criteria: duplicate webhook delivery produces one execution and one reply;
retries are observable and safe.

### Milestone 2: Public MVP

- Implement `/watch` using the public catalog service.
- Implement guided `/order` using the existing public order service.
- Add public request-status ownership proof if approved.
- Preserve existing connector contract compatibility.

Exit criteria: end-to-end test OA flow works without admin privileges and cannot
access internal-only data.

### Milestone 3: Staff identity and read commands

- Implement one-time linking, revoke, disable, and audit.
- Add permission-aware staff read commands.
- Add direct/group response redaction policy.
- Add Admin identity and execution views.

Exit criteria: permission matrix tests cover anonymous, linked, disabled,
revoked, and insufficient-permission callers.

### Milestone 4: Confirmed write command vertical slice

- Choose one low-risk operational write command.
- Implement prepare/confirm/revalidate/execute flow.
- Reuse the canonical domain command and business events.
- Add idempotency, stale-state handling, audit, and recovery tests.

Exit criteria: no write can occur without a valid linked user, permission, and
single-use confirmation.

### Milestone 5: Operational hardening and expansion

- Add further write commands one at a time.
- Complete dashboards, alerts, retention cleanup, and runbooks.
- Load-test duplicate/concurrent deliveries and Zalo outages.
- Complete staged rollout and rollback exercises.

Exit criteria: agreed SLOs, alerts, incident procedure, and production readiness
review are complete.

## 9. Verification strategy

### Unit tests

- native signature and timestamp verification;
- strict event normalization;
- parser and argument schemas;
- registry permission and conversation policies;
- confirmation expiry, binding, and one-time use;
- redaction and reply rendering.

### Integration tests

- HTTP ingress with an isolated database;
- replay, duplicate nonce/message, concurrency, and stale processing recovery;
- identity linking and revocation;
- outbox retry and terminal failure;
- domain command idempotency and business-event emission.

### End-to-end smoke tests

- Test OA `/help`, `/watch`, and `/order` flows;
- invalid signature and unsupported command;
- Zalo timeout/token refresh;
- linked/unlinked permission boundaries;
- confirmation success, expiry, reuse, and stale target;
- global and per-command kill switches.

Repository checks for each implementation PR should include the relevant domain
tests plus:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run storefront:smoke-zalo
```

Do not claim a production integration is ready based only on contract smoke
tests.

## 10. Rollout and production gates

1. Develop each milestone on a dedicated branch and merge through a reviewed PR.
2. Use an isolated database and Zalo test OA/connector first.
3. Keep all new commands disabled by default.
4. Enable read-only commands for a small allow-list.
5. Observe duplicate rate, latency, errors, reply failures, and token refresh.
6. Enable the first write command only after confirmation and permission gates
   pass the readiness review.
7. Deploy production only through the repository production workflow and an
   explicitly authorized `production-*` tag.

Merging an implementation PR does not authorize a production deployment.

## 11. Open decisions

- Will Watch Shop receive native Zalo OA webhooks directly, or will an external
  connector translate them to the owned ingress contract?
- Are commands intended for direct messages, groups, or both?
- Which OA/group is the test environment?
- Which internal permission corresponds to each future staff command?
- What is the first low-risk staff write command?
- What customer verification is required for public request status?
- What retention period applies to inbound messages, identity links, command
  payloads, and replies?
- Are interactive buttons available and approved for the target OA API plan?

These decisions should be captured in an ADR before Milestone 1 changes schema
or access-control behavior.

## 12. Codex Cloud continuation guide

Codex Cloud should start from the latest `main`, read `AGENTS.md`, and use this
document as the planning source. It must not assume access to uncommitted local
files, production credentials, the NAS, or prior chat history.

Recommended first Cloud task:

```text
Read AGENTS.md and docs/product/zalo-command-development-plan.md. Audit the
current Zalo ingress and notification implementation against Milestone 0.
Create a dedicated branch and prepare an ADR covering native webhook boundary,
identity linking, conversation policy, confirmation security, and reply outbox.
Do not change production configuration, access control, or deploy. Open a PR
with the ADR and an implementation ticket breakdown.
```

For later implementation, create separate PRs for the native adapter, identity
linking, command registry, public MVP, and each write-command vertical slice.
Avoid a single cross-domain PR that mixes schema, authentication, parser,
business mutations, and operations UI.
