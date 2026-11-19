# Operation workspace navigation — Media-first rollout

This implements the left navigation / right working-content pattern from the
home website editor, under the existing admin UI language contract.

## Scope

- Enabled only in `/admin/coordination/operation` (`context: OPERATION`).
- Group labels and availability come from the existing server-provided
  `viewConfig.modes`; no client-created permission or workflow catalog.
- Media list is the first reference surface. Other configured groups can still
  be selected and retain their existing working views and actions.
- Dedicated media/technical/payment routes and the technician workspace retain
  their existing layout. They are not silently redirected to the unified hub.
- No database, permission, workflow transition, event or query-schema changes.

## Layout

The page has one stable “Vận hành” header. The selected working area has its own
short title and existing actions on the right, without repeating a view picker.
The left menu selects an area, and the active area's list stages expand below it.
Do not repeat the same stages as horizontal tabs above the right-hand list.

Use a 220px local navigation and a flexible working pane, separated by a quiet
slate-100 line and 28px gap. Selectable rows are flat with blue-50 selection,
neutral text, readable counts and visible focus. There are no navigation cards,
step numbers, checkboxes, drag handles or stage mutation commands in this menu.

Use the layout's own available width, not device detection. At 960px of available
width the local menu is visible. Below that width use labeled native area/stage
selects, retaining the same value and callbacks. Under 440px they stack. This
also handles a narrow pane inside a wide desktop window. Width is observed without
CSS layout containment so fixed-position editors and overlays remain attached to
the viewport rather than being trapped inside the working pane.

## Existing state and behavior

- Area selection calls the existing `changeActiveViewMode`; stage selection calls
  `changeFlowListStage` or the typed task-stage selector. Selecting navigation
  never starts/completes/moves an item.
- Existing URL `view`, `flowStage`, pagination, loading, abort and history handling
  remain domain-owned. This change does not promise new per-area filter/draft
  persistence; changing modes retains the existing reset semantics.
- Flow counts use `flowListStageCounts`, not the visible page length. Missing or
  loading counts keep the existing `—`/`…` meaning; don't replace them with zero.
- Inactive group totals are intentionally omitted until a suitable authoritative
  aggregate exists. Do not add counts across incompatible business item types.
- Board views keep their all-column behavior. Their navigation has area selection
  only; list-stage selection must not silently filter a board or switch engines.
- Technical coordination has its own list/board state and pagination. Its internal
  controls remain until a dedicated technical migration is reviewed.
- Existing preview/edit dialogs and mutation callbacks stay in the working pane.
  Nothing automatically saves a record on area/stage selection.
- The obsolete week picker is removed through the shared filter adapter already
  proposed in PR #120. Internal reporting/date DTOs are not rewritten here.

## Dependencies and rollout

This PR targets main independently. It includes the minimal flat workspace-header
and week-free filter adapters also proposed by PR #120; it does not include that
PR's technician, home-editor or product-summary changes. Review overlapping shared
files when merging either PR. PR #121's detailed contract remains separate.

Accept Media navigation, empty/loading/error states, keyboard use, narrow panes
and return navigation before redesigning each remaining area's working content.
Authenticated database/action acceptance and whole-app checks remain required for
a release; fixture preview checks alone do not establish production behavior.
