# SM Sprint 45A: Workspace Creation Guardrails

Date: 2026-07-04

Status: Implemented

## Mission

Prevent uncontrolled Workspace creation from Blueprint snapshots.

This protects auto-binding runtime from ambiguous cases such as:

```text
two active Photoshoot Workspaces in the same Media weekly Space
```

If two active Workspaces claim the same Blueprint/event binding, runtime skips
with `DUPLICATE_BLUEPRINT_EVENT_BINDING`. Sprint 45A adds creation guardrails
before that ambiguity is created.

## Implemented

- Dashboard Blueprint options now include usage counts in the current Space:
  - `active`
  - `total`
- Workspace create form shows Blueprint usage count.
- If the selected Blueprint already has active Workspace usage, UI asks for
  explicit confirmation.
- Server-side guard blocks duplicate Workspace names in the same Space.
- Server-side guard blocks duplicate active Blueprint creation unless the UI
  explicitly confirms duplicate Blueprint creation.
- Guards only apply to TaskItems created from Blueprint snapshot notes, not
  regular task items.

## Rules

Duplicate name:

```text
Same Space + same Workspace title + not CANCELLED => blocked
```

Duplicate Blueprint:

```text
Same Space + same blueprintKey + same blueprintSource + active Workspace
=> confirmation required
```

Active means:

```text
not DONE and not CANCELLED
```

Usage count includes:

```text
all non-CANCELLED Workspaces in the current Space
```

## Files Changed

- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/domains/coordination/server/coordination-dashboard.service.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `src/domains/task/actions/task.actions.ts`
- `docs/sprints/CURRENT.md`

## Acceptance

Sprint 45A passes if:

- User can see how many Workspaces already use a Blueprint.
- Creating a duplicate Blueprint Workspace requires explicit confirmation.
- Duplicate Workspace names are rejected server-side.
- Runtime ambiguity is reduced before events are routed.

Status: PASS.
