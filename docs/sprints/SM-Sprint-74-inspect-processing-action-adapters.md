# Sprint 74 - Inspect And Processing Action Adapters

Status: closed.

## Goal

Make Inspect and Processing actions execute real Service domain commands through
the Operational Blueprint action adapter.

Sprint 72 rendered the action forms from `OperationalBlueprint.actions`. Sprint
74 closes the command path behind those forms.

## Scope

- `classify_technical_issue` updates TechnicalIssue classification fields and
  calls `confirmTechnicalIssue`.
- `start_processing` requires a technical detail catalog id and calls
  `startTechnicalIssue`.
- `complete_processing` records actual cost/resolution and calls
  `completeTechnicalIssue`.
- `raise_follow_up_issue` creates another TechnicalIssue through
  `createTechnicalIssue`.
- Service command behavior stays in the Service domain. Workspace/Task UI only
  renders and submits the contract action.

## Files Touched

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/service/server/operation/service-operation-action-adapter.ts`
- `src/domains/service/server/issue-board/service-issue-board.service.ts`

## Implemented

- Adapter now validates money fields and `TechnicalActionMode` before writing
  Service data.
- `classify_technical_issue` requires `technicalArea` and `actionMode`.
- Vendor is required for `VENDOR` action mode.
- Switching a classified issue back to non-vendor mode clears vendor ownership.
- `start_processing` passes actor id into Service command/event sync.
- `complete_processing` passes actor id and respects the `createPayment`
  contract checkbox:
  - Blueprint action can request unpaid payment creation;
  - legacy/manual callers keep the previous default payment behavior.
- `completeTechnicalIssue` now records whether payment creation was requested in
  the `technical_issue.completed` event payload.
- When `complete_processing` requests a new unpaid payment and the Service
  helper creates one, Service now emits `payment.created` after the transaction.

## Acceptance Status

- `classify_technical_issue` emits `technical_issue.confirmed`: implemented via
  `confirmTechnicalIssue`.
- `start_processing` emits `technical_issue.started`: implemented via
  `startTechnicalIssue`.
- `complete_processing` emits `technical_issue.completed`: implemented via
  `completeTechnicalIssue`.
- `complete_processing` can request payment follow-up: implemented through the
  `createPayment` flag and existing Service issue payment helper.
- `complete_processing` emits `payment.created` only when a new payment is
  created; existing technical-issue payments are not double-emitted.
- `raise_follow_up_issue` emits `technical_issue.created`: already implemented
  through the shared `service.createTechnicalIssue` branch.

## Validation

- `cmd /c npx eslint src/domains/blueprint/shared/operational-blueprint.ts src/domains/service/server/operation/service-operation-action-adapter.ts src/domains/service/server/issue-board/service-issue-board.service.ts --quiet --rule "@typescript-eslint/no-explicit-any: off"` passed.
- `cmd /c npx eslint scripts/verify-sprint-74-operational-actions.ts src/domains/blueprint/shared/operational-blueprint.ts src/domains/service/server/operation/service-operation-action-adapter.ts src/domains/service/server/issue-board/service-issue-board.service.ts --quiet --rule "@typescript-eslint/no-explicit-any: off"` passed.
- `cmd /c npx tsx scripts/verify-sprint-74-operational-actions.ts` passed.
- `cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --receivers`
  reached the database and resolved the current TECHNICAL coordination cycle.
- Dry-run event smoke could not proceed because the connected database has no
  `TechnicalIssue` or `ServiceRequest` seed rows:
  - `technical_issue.completed`: `No TechnicalIssue found.`
  - `service_request.created`: `No ServiceRequest found.`
- Whole-repo `cmd /c npx tsc --noEmit --pretty false` still fails on existing
  unrelated checkout issues under `component for chatGPT/...`, `src/note.ts`,
  coordination/payment/task/watch modules, and generated/legacy typing drift.

## Close Notes

- Sprint 74 is closed because the command adapter contract, Service command
  calls, actor propagation, validation, payment event parity, and repeatable
  static verification are implemented.
- Live workspace smoke should be run once seed data/session exists:
  - classify an Inspect TI;
  - start a Ready TI with technical detail catalog id;
  - complete an In Progress TI with and without payment request;
  - raise a follow-up TI from Processing.
- Next sprint: Sprint 75 - Operation Projection Subscription Runtime.
