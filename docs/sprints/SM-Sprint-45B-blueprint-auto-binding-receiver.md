# SM Sprint 45B: Blueprint Auto-Binding Receiver

Type: SM Mode

## Mission

Allow a Blueprint to show which Workspaces currently use it and decide which
Workspace receives auto-binding requests from business domains.

This keeps duplicate Blueprint Workspaces valid while removing runtime
ambiguity.

## Implemented

- Coordination dashboard Blueprint options now expose:
  - total Workspace usage
  - active Workspace usage
  - active Workspace candidates
  - selected auto-binding receiver
- Space Management UI now shows a Blueprint auto-binding control panel.
- User can select which active Workspace receives business-domain auto-binding.
- Selection is stored in the Workspace snapshot note:

```text
blueprintAutoBindingReceiver: true
```

- Coordination event consumer now resolves duplicate Blueprint event bindings by
  selecting the Workspace marked as receiver.
- If multiple Workspaces match and no single receiver is selected, runtime still
  skips with `DUPLICATE_BLUEPRINT_EVENT_BINDING`.

## Rules

- Receiver is scoped to the current Space cycle and Blueprint identity.
- Only one active Workspace per Blueprint should be receiver in a Space.
- DONE and CANCELLED Workspaces are not receiver candidates.
- The business domain still emits events only; it does not choose Workspace.

## Files Changed

- `src/domains/coordination/actions/coordination.actions.ts`
- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/domains/coordination/server/coordination-dashboard.service.ts`
- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`

## Acceptance

PASS.

