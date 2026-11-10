# Technical issue Board / List

The operational technical flow has one Board / List switch. Both layouts use
the technical board DTO and canonical technical workflow; List does not use the
generic coordination task list.

Open `/admin/coordination/operation?view=technical-issue-flow&tiLayout=list`.
Retain the current cycle/context query parameters when copying an existing link.

## UI contract

- Follow `docs/design/admin-ui-language-contract.md`: white, flat rows, light
  dividers, restrained status colors, shared avatars, no nested row cards.
- Show issue/watch identity first, followed by stage, handling unit, deadline,
  cost and actions. Label the updater explicitly; they are not an assignee.
- Default to all open stages. Offer stage, attention and sort controls without
  another Board / List switch. Keep scope, sort, attention and local page when
  switching layouts within the same technical flow.
- The primary row action is the nearest permitted forward workflow transition.
  Additional transitions and preview belong in the overflow menu. Transitions
  retain existing classification, cost, maintenance and approval dialogs.
- Priority writes use shared scoped mutation feedback and suppress duplicate
  submissions per issue. An unrelated row remains usable while one is pending.
- On narrow screens, stack the same row fields without horizontal page overflow.
  Overflow menus remain within the viewport and support Escape/outside click.

## Data limits

The existing API pages each stage separately. Text search, attention filters and
sorting apply to **loaded TI**, not the whole database. List shows loaded/total
counts and an explicit next-stage load button, including when filtered results
are empty. Open scope loads INSPECT, READY, then PROCESSING; it excludes DONE.
The Done range uses the existing 14-day / 30-day / all API control.

This change adds no endpoint, migration or permission. Board drag/drop and the
canonical technical issue mutation actions remain the source of truth.

## Verification

```sh
node --import tsx --test src/domains/coordination/shared/technical-issue-list.test.ts
npx tsc --noEmit
npm run build
```

`scripts/smoke-technical-issue-list-browser.cjs` bundles the actual List and
shared view switch with `tests/browser/technical-issue-list.fixture.tsx`.
It needs esbuild, Playwright and Chromium available on the host (the script
defaults to `/usr/bin/chromium`). It exercises paging/filter retention,
row callbacks, priority pending, menu keyboard dismissal, partial loading,
search, Done range, focus handling, and mobile overflow. Its parent Board,
API callbacks and images are fixtures; it does not verify live API writes or
the complete admin shell. The fixture server and temporary build are cleaned
up after the run. No production data is needed.
