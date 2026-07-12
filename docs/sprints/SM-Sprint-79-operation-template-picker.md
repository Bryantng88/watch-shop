# Sprint 79 - Operation Template Picker

Status: closed.

## Goal

Make the Blueprint Operation Model authoring screen usable when a draft has no
operation yet.

After Sprints 71-78, Blueprint has enough contract language to model real
operations such as Service Operation and Payment Collection. The remaining UX
gap is that a new draft still shows `operation: null` and expects the user to
paste raw JSON.

Sprint 79 turns that empty state into an intentional starting point.

## User Problem

Current behavior:

- Open a new Workflow Draft.
- Go to the Operation Model tab.
- The main panel says the Blueprint has no Operation Model.
- The authoring editor shows `null`.

That is technically correct, but not useful for an operator. The user needs a
clear way to start from a known operation template.

## Scope

Add an Operation Template Picker to the Operation Model tab.

The picker should let the user choose:

- Start from Service Operation.
- Start from Payment Collection.
- Start blank Operation.

Choosing a template should copy a valid `OperationalBlueprintContract` into the
draft's `blueprintJson.operation`, then show the existing Sprint 77 validation
feedback.

## Expected UX

When `blueprintJson.operation` is empty:

- Show a focused empty state, not just `null`.
- Explain that this draft has no Operation Model yet.
- Offer template choices.
- Each choice should show a short summary:
  - operation key;
  - context;
  - workspace roles;
  - routed events;
  - action count;
  - validation status if available.

When a template is selected:

- Populate the operation editor with that template.
- Render the structured Operation Model preview.
- Run the Sprint 76 validator.
- Keep changes in draft JSON only.
- Do not publish/version.

## Suggested Implementation Files

- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
  - current Operation Model tab and raw JSON editing surface.
- `src/domains/blueprint/shared/operational-blueprint.ts`
  - source of existing operation templates:
    - Service Operation;
    - Payment Collection.
- `src/domains/blueprint/server/blueprint-library.service.ts`
  - registry payload already exposes operation and validation status.
- `scripts/verify-sprint-79-operation-template-picker.ts`
  - add a focused verification script for the template-picker behavior.

## Implementation Notes

- Prefer reusing registry Blueprint operations instead of duplicating template
  JSON in the client.
- Keep raw JSON editing as a developer escape hatch.
- Do not introduce publish/version semantics in this sprint.
- Do not execute domain commands from the picker.
- Do not move Payment, ServiceRequest, TechnicalIssue, Watch, Order, or Product
  truth into Blueprint.
- Keep the current invariant: Blueprint declares how domain truth is operated
  inside Space/Workspace; domains own the truth.

## Acceptance Criteria

- A new draft with `operation: null` presents a template picker.
- The picker includes Service Operation and Payment Collection.
- Selecting Service Operation copies a valid Service operation contract into
  the draft operation JSON.
- Selecting Payment Collection copies a valid Payment operation contract into
  the draft operation JSON.
- Selecting Blank Operation initializes a minimal editable operation shell or
  leaves the editor intentionally blank with clear validation guidance.
- Existing Sprint 76 validation runs after selection.
- Existing Sprint 77 structured preview can render the selected operation.
- The user no longer needs to manually paste JSON just to start authoring.

## Suggested Verification

Add and run:

```bash
cmd /c npx tsx scripts/verify-sprint-79-operation-template-picker.ts
cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx scripts/verify-sprint-79-operation-template-picker.ts --quiet
```

If a browser smoke is available, also verify:

- New Workflow Draft -> Operation Model tab shows template picker.
- Payment Collection template populates the authoring editor.
- Validate shows zero structural issues.

## Files Touched

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/blueprint/server/index.ts`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-79-operation-template-picker.ts`

## Implemented

- Added shared Operation Model templates:
  - Service Operation;
  - Payment Collection;
  - Blank Operation shell.
- Template reads return cloned contracts so draft editing cannot mutate shared
  registry contracts.
- Operation Model tab now shows a focused template picker when a draft has
  `blueprintJson.operation: null`.
- Selecting a template copies the contract into draft JSON and immediately
  updates the existing structured preview and Sprint 76 validation output.
- Raw JSON editing remains available as the developer escape hatch.
- Draft operation preview no longer falls back to the source registry operation
  when the draft operation is still null; this preserves the intentional empty
  state required by this sprint.
- Source Blueprint operation lookup now matches both registry key and workflow
  key before offering the legacy copy-source action.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-79-operation-template-picker.ts` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx scripts/verify-sprint-79-operation-template-picker.ts src/domains/blueprint/shared/operational-blueprint.ts src/domains/blueprint/server/index.ts --quiet` passed.

## Out Of Scope

- Field-by-field structured operation editing.
- Generated workspace map preview.
- Creating real Spaces from the operation contract.
- Payment command execution adapter.
- Blueprint publish/version/rollback.

Those should follow after this picker makes Operation authoring approachable.

## Next Likely Sprints

- Sprint 80 - Structured Operation Authoring UI.
- Sprint 81 - Operation Preview / Generated Workspace Map.
- Sprint 82 - Create Space From Operation Blueprint.
- Sprint 83 - Domain Adapter Binding UI.
- Sprint 84 - Publish / Version / Snapshot UX.
