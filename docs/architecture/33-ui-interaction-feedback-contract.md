# UI Interaction and Mutation Feedback Contract

Status: active for new and materially changed interactive UI.

## Why this contract exists

The repository already has shared toast, dialog, and application-progress
providers, plus durable projection consistency rules. What was missing was the
interaction layer between a user's click and the authoritative server result.
As a consequence, screens independently implemented `loading`, `pending`,
spinners, disabling, success messages, and rollback.

An inventory on 2026-10-27 found:

- 29 TypeScript UI files using `useTransition`;
- 32 files manually calling `setLoading`;
- 7 files manually calling `setPending`;
- 39 files rendering `Loader2`;
- no application UI using `aria-busy`;
- no shared optimistic-mutation hook.

The existing infrastructure is retained. This contract defines when and how
to use it.

## Current-system disposition

Retain:

- `AppToastProvider` for non-blocking outcomes;
- `AppDialogProvider` for confirmations and consequential decisions;
- `AppProgressProvider` for one foreground bulk or multi-step operation;
- the existing projection-delivery and post-mutation consistency contracts;
- admin design tokens for visual styling.

Consolidate:

- manual `loading`/`pending` state and duplicate guards into `useUiMutation`;
- repeated button spinner markup into `AsyncActionButton`;
- React notification calls on `useNotify`; keep the event-bus `notify` helper
  only for code that cannot consume React context.

Deprecate or avoid:

- loading toasts as a pending indicator;
- unscoped `useTransition` state that disables unrelated controls;
- blocking application progress for small row or toggle mutations;
- simultaneous inline, toast, and progress success messages for one outcome;
- `window.confirm` where the shared accessible dialog is available.

Known follow-up:

- `AppProgressProvider` is intentionally a single foreground channel. If the
  product later permits concurrent background operations, add operation IDs
  and a queue rather than allowing callers to overwrite each other's progress;
- migrate existing screens incrementally according to risk instead of a single
  repository-wide visual rewrite.

## Interaction states

Every state-changing control has four observable states:

1. `idle`: ready to accept an action;
2. `pending`: the command has been submitted and its final outcome is unknown;
3. `success`: the authoritative command completed successfully;
4. `error`: the command failed or authoritative reconciliation failed.

The state is scoped to the smallest affected control or entity. A row action
must not disable an entire modal, and one checklist item must not make every
other item appear busy, unless the business operation truly locks that whole
surface.

## Immediate acknowledgement

Every accepted interaction must produce visible feedback in the same render:

- set the affected control to `pending`;
- expose `aria-busy="true"`;
- prevent a duplicate submission for the same mutation key;
- keep the control's dimensions stable;
- show an inline spinner or pending label when the operation is not safely
  optimistic.

Do not wait for `router.refresh()`, a toast, or a server response before
acknowledging the click.

## Route navigation

Sidebar navigation uses `AdminActiveLink` and Next.js `useLinkStatus` to show a
spinner on the destination item and an indeterminate top loading bar. Keep this
feedback visible until navigation commits or is cancelled; never hide it after
a fixed delay. Cached navigation that commits immediately needs no artificial
loading delay. Preserve modified-click and new-tab behavior.

Use `Link.onNavigate` for navigation side effects such as closing the mobile
menu. Do not detect accepted navigation from a wrapper's bubbling click handler:
Next.js may already have prevented the event's browser default by that point.
Do not use the application mutation-progress modal or a loading toast for
ordinary route changes.

## Optimistic updates

Use an optimistic update when the provisional state is obvious and safely
reversible, for example toggles, checklist completion, local ordering, or
removing a row from its current filter.

Optimistic state is presentation feedback, not proof of completion:

- retain a snapshot or inverse patch before changing UI state;
- roll back on command failure;
- keep the affected control pending until the command finishes;
- reconcile with the authoritative response or scoped reload;
- follow the projection-delivery contract when a command updates an eventual
  read model.

Do not optimistically present irreversible financial, inventory, permission,
or destructive outcomes as complete.

## Feedback levels

Choose the least disruptive feedback that still explains the operation:

| Scope | Feedback |
| --- | --- |
| Toggle or row-local action | optimistic state or inline spinner on the control |
| Form submit or modal action | pending button label and disabled affected fields |
| Important result outside the control | success/error toast |
| Multi-step, bulk, or long blocking operation | `AppProgressProvider` |
| Destructive or consequential action | `AppDialogProvider` before submission |

Do not show application-level progress for a small row mutation. Do not use a
transient "loading" toast as the only pending indicator.

## Success and error

On success:

- reconcile authoritative state before unlocking when required;
- clear pending state;
- use a toast only when the result is important or not visible at the action
  location;
- avoid duplicate inline, toast, and progress success messages.

On error:

- roll back optimistic state;
- preserve user input;
- clear pending state;
- show a useful error near the action when possible;
- use the shared error toast as a fallback;
- allow retry without reloading the entire page.

## Shared implementation

New or materially changed UI should use:

- `useUiMutation` for keyed pending state, duplicate suppression, optimistic
  application, rollback, and error feedback;
- `AsyncActionButton` for stable button loading semantics and accessibility;
- `useNotify` inside React components;
- `notify` only at non-React boundaries that cannot access context;
- `useAppProgress` only for multi-step or genuinely blocking work.

The hook does not replace domain consistency. Server actions still own
validation and authorization, and projection-backed UI still waits for its
exact durable delivery before treating the read model as authoritative.

## Migration policy

Migration is incremental:

1. new UI must follow this contract;
2. touched mutation flows must be upgraded in the same change;
3. prioritize silent controls and controls with duplicate-write risk;
4. migrate row/toggle actions before already well-signaled long operations;
5. remove local loading code only after equivalent scoped behavior is covered.

The personal-work checklist is the first reference implementation.
