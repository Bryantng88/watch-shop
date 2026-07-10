# Sprint 78 - Payment Operation Proof

Status: closed.

## Goal

Prove Operational Blueprint is no longer Service Operation-specific by modeling
a second operation: Payment Collection.

## Why Payment

Payment is a good proof because it is a different business context from
Technical Service Operation, already has domain truth in `Payment`, and already
has business events such as:

- `payment.created`
- `payment.status_updated`
- `payment.paid`

Blueprint must describe how the Payment team operates those records inside
Space/Workspace. It must not own amount, method, direction, status, settlement,
or accounting truth.

## Scope

- Add a Payment Collection `OperationalBlueprintContract`.
- Expose it through the existing `payment` work type in the Payment context.
- Validate it with the Sprint 76 validator.
- Make it visible in the Sprint 77 Blueprint Library Operation Model tab.
- Keep payment command execution behind future Payment domain adapters.

## Files Touched

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `scripts/verify-sprint-78-payment-operation-proof.ts`

## Implemented

- Added `PAYMENT_COLLECTION_CONTRACT`.
- `operationalBlueprintForWorkType` now returns the Payment operation contract
  for:
  - `workTypeKey: "payment"`
  - `coordinationContext: "PAYMENT"`
- Payment operation declares:
  - object type: `PAYMENT`;
  - workspace roles: `PAYMENT_INBOX`, `PAYMENT_REVIEW`,
    `PAYMENT_SETTLED`;
  - core flow: Inbox -> Review -> Settled / Exception;
  - event routes for `payment.created`, `payment.status_updated`, and
    `payment.paid`;
  - actions: `review_payment`, `mark_payment_paid`,
    `mark_payment_exception`;
  - workflow ownership for payment review and settlement states.
- Payment operation passes structural validation with zero issues.
- Payment registry Blueprint exposes `operationValidation.ok`.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-78-payment-operation-proof.ts` passed.
- `cmd /c npx eslint scripts/verify-sprint-78-payment-operation-proof.ts src/domains/blueprint/shared/operational-blueprint.ts --quiet --rule "@typescript-eslint/no-explicit-any: off"` passed.

## Boundary

This sprint intentionally stops at operation proof and metadata/runtime
visibility. The declared payment actions use command keys such as
`payment.completePayment`, but actual command execution should be added as a
Payment domain adapter later. That keeps the generic Blueprint runtime separate
from Payment business truth.

## Result

Operational Blueprint now has two modeled operations:

- Service Operation in Technical context.
- Payment Collection in Payment context.

The same validation and authoring surfaces from Sprints 76 and 77 can inspect
both contracts without adding a Service Operation-specific branch.
