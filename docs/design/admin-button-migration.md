# Admin button migration

The shared action system is `AdminButton` plus `AdminAnchorAction`,
`AdminLinkAction`, `AdminDisclosureSummary` and the existing async/form adapters.
The admin layout provides the scope, including dialog/toast portals. Public
storefront consumers keep their previous classes and inline presentation.

The migration traverses every file under `src/app/(admin)` and all local imports,
re-exports and literal dynamic imports. At this revision the graph has 1,190 files
and 1,037 button/action-link references, including wrapper implementations. All
native button and summary nodes in that graph live in the primitive. Generated
code, external packages and public-only components are outside the admin graph.

Contextual variants intentionally preserve tabs, navigation, calendar cells,
record/image selection, menu items and text/close controls. Raised variants own
appearance; page classes still supply layout. Existing primary/outline/ghost and
async pending semantics are mapped by adapters. See the button section in
[the UI contract](admin-ui-language-contract.md) for tokens and usage.

## Verification

- `npm run check:admin-buttons`: import graph, native control and action-link drift,
  and client directive placement.
- `node scripts/smoke-admin-buttons-browser.cjs`: real primitives and portal menu;
  variants, hover/press/focus, native submit/ref, disabled/pending, link props,
  disclosure, mobile/coarse targets and public isolation. Uses Playwright;
  optional `PLAYWRIGHT_MODULE_PATH` and `CHROMIUM_PATH` select installed tools.
- Existing directory/library/home and TI browser fixtures now wrap the button
  provider and exercise actual management/list components with synthetic APIs.
- `.github/workflows/admin-buttons-contract.yml` runs the scanner, primitive lint,
  type checking and browser assertions in CI.

Local scanner, new-source lint and browser suites passed. Full application type
checking/build remain blocked by unavailable `react-markdown`, `web-push` and its
types: Cloud VPN enrollment failed and npm registry connections returned 503.
The full lint run also reports existing repository errors; comparison of the 236
modified tracked source files retained the same error/warning counts (136/72).
No production API, database write, merge or deployment is part of this check.
