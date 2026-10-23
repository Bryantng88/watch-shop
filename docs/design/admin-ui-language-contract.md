# Admin UI language contract

Status: accepted reference for new admin surfaces and incremental modernization.

Reference implementation: `/admin/personal-work`, implemented by
`src/domains/personal-work/ui/PersonalWorkClient.tsx`.

This contract defines presentation and interaction language. It does not move
domain ownership, change permissions, or replace existing workflow contracts.

## Design intent

The admin should feel like a focused workspace: high information density,
quiet visual hierarchy, and obvious actions without decorative noise. Users
should understand the page structure from spacing, typography, and alignment
before borders or color are needed.

## Required rules

### Canvas and hierarchy

- Use a white page canvas. Do not wrap the whole page in a card.
- Use spacing and a `slate-100` divider to separate major regions.
- Page header order is eyebrow, title, short description, then compact metrics.
- Keep primary working content visible without a decorative hero.
- On desktop, independent high-volume panes may scroll within a bounded height.
  On mobile, return to a natural single-column document flow.

### Surfaces

- Default content is flat on the canvas.
- Use a subtle `slate-50` surface and `slate-200/80` border for toolbars and
  grouped input controls.
- Individual list rows are not cards. Use spacing, optional hairline dividers,
  and a light hover state.
- Shadows are reserved for modal, popover, dropdown, and other floating layers.
  Dashboard summary tiles may use one very soft ambient shadow without a border
  when they need separation from the page canvas. Do not combine that shadow
  with a visible outline or hover-lift animation.
- Avoid nested cards and repeated rounded containers.

### Typography

- Page title: 24px, bold, `slate-950`. It describes the workspace, not the
  current record count.
- Section title: 14px, bold, `slate-950`; section description: 12px,
  `slate-500`.
- Row title: 14px semibold. Metadata is 12px and uses `slate-500`; tertiary
  metadata may use `slate-400` but must remain readable.
- Supporting copy is smaller and slate. Keep line-height compact but do not
  compress labels below 12px except short badges and chart annotations.
- Labels and metadata use size and weight before color.
- Uppercase tracking is reserved for the page eyebrow and short semantic labels.
- Do not reduce operational warnings below readable metadata size merely to fit.

### Color semantics

Domain color identifies ownership and stays stable everywhere:

| Domain | Tone |
| --- | --- |
| General / personal | Slate |
| Media | Violet |
| Technical | Blue |
| Sales | Emerald |
| Order | Amber |
| Acquisition | Rose |

Warning color communicates state, not domain. Use amber/orange for attention,
rose/red for destructive or critical state, and emerald for success. Preserve
the domain color and add a small warning signal rather than recoloring the
whole item. Source or synchronization state should use an icon, label, or
secondary marker; it must not override domain identity.

Use `ADMIN_DOMAIN_TONE` from
`src/domains/shared/ui/admin-design-contract` instead of creating local color
mappings.

### Actions and forms

- One primary action per context uses slate/navy with white text. Default height
  is 40px; compact table/list actions may be 32px.
- Secondary actions are neutral or lightly tinted. A success/synchronization
  action may use a quiet emerald tint. Destructive actions are rose.
- Button text is 14px semibold by default. Compact actions use 12px semibold.
  Icon-only buttons keep at least a 32px target and require an accessible label.
- A badge reports identity or state; it is not a button. Domain badges use the
  shared domain tone. Status badges use semantic amber, rose, emerald, or slate
  and remain compact (`10–12px`, semibold).
- Whole action bars are clickable; do not place a dark circle around only the
  arrow.
- Controls must expose hover, focus-visible, disabled, and pending states.
- Inputs use a quiet neutral border and blue focus ring.
- Destructive actions require confirmation and must state downstream effects.

### Lists and data density

- Render rows directly on the canvas, not as a stack of mini cards.
- Use tabular numerals for counts, money, dates, times, percentages, and other
  values that users compare vertically. Keep the value visually stronger than
  its unit or label.
- Put compact aggregate metrics in the page header or section header. Do not
  create a metric card when the value does not lead to a decision or action.
- Counts use locale formatting; money always includes its currency; dates and
  times use the product timezone and one consistent display format per page.
- Present row information in this order: primary title, domain/status markers,
  actionable state or deadline, then supporting reference/source metadata.
- Reveal low-frequency row actions on hover, but keep them keyboard-focusable.
- Use a bounded scroll pane when a list competes with a fixed visual such as a
  calendar. The scroll region must not hide or truncate the underlying dataset.
- Filters remain visible while their result pane scrolls when practical.
- Empty states explain what is absent without adding a large decorative panel.
- Shared records use one quiet access badge (`Chỉ xem` or `Có thể sửa`) beside
  the primary title. Do not add a separate card or duplicate the owner name in
  every metadata position.
- Scope filters use a compact segmented control in this order: `Của tôi`,
  `Được chia sẻ`, `Tất cả`. `Tất cả` means all records the current user may
  access, never an implicit bypass of private-record permissions.

- User identity is represented by `AdminUserAvatar`; compact groups use
  `AdminUserAvatarStack`, while contexts that communicate ownership or sharing
  use `AdminUserInlineList` so each visible avatar retains its user name. Prefer the stored
  avatar, fall back to initials, keep the full name in an accessible label and
  tooltip, and add visible name text only when it resolves ambiguity or is
  required to complete the action.

### Modals and floating layers

- Use a restrained overlay, white surface, 16px-equivalent radius, and one
  strong shadow.
- Header, fields, and footer actions follow a stable order.
- Close on explicit close/cancel and backdrop click; preserve keyboard focus.
- Place destructive action apart from save/cancel.
- Put sharing controls in the existing edit/detail modal as a quiet subsection;
  do not introduce a second modal when the recipient list is short.

### Responsive and accessibility

- Desktop may use split panes; mobile stacks content in task order.
- Every icon-only action requires an accessible label.
- Keyboard focus must be visible. Hover-only actions must also appear on focus.
- Do not encode meaning with color alone.
- Maintain usable targets and readable contrast at normal browser zoom.

## Shared implementation

Import from `@/domains/shared/ui/admin-design-contract`:

- `ADMIN_UI`: canonical class tokens for canvas, typography, toolbar, inputs,
  rows, modal surfaces, and actions.
- `ADMIN_DOMAIN_TONE`: canonical domain colors.
- `AdminPageCanvas`: white page canvas and standard page rhythm.
- `AdminPageHeader`: standard page title hierarchy and compact metrics.
- `AdminFlatToolbar`: grouped control surface.

Canonical tokens include page and section typography, metadata and numeric
values, flat and elevated surfaces, badges, interactive hover/focus treatment,
form controls, and primary/secondary/compact actions. Add a shared token before
introducing a repeated local visual rule.

- `AdminUserAvatar`, `AdminUserAvatarStack`, and `AdminUserInlineList` provide
  canonical user identity and compact multi-user presentation.

The primitives intentionally stay small. Domain components own data and
behavior; shared UI owns repeatable presentation. Do not grow this module into
a second business component framework.

## Review checklist

Before accepting a new or modernized admin page, verify:

1. It uses the shared canvas/header/tokens where applicable.
2. Domain colors come from the shared mapping.
3. Status colors do not replace domain identity.
4. Rows are not unnecessarily wrapped as cards.
5. Borders and shadows have a structural purpose.
6. Primary and destructive actions are unambiguous.
7. Dense regions have deliberate overflow behavior.
8. Hover, focus, disabled, loading, empty, and error states are covered.
9. Desktop and mobile reading order remain correct.
10. The change does not alter domain permissions or workflow semantics.

## Migration policy

- New admin surfaces follow this contract immediately.
- Existing pages migrate when touched for material UI work; do not perform a
  repository-wide visual rewrite.
- Reuse existing shared components when they already satisfy the contract.
- Any intentional exception should be documented in the pull request with the
  operational reason.
