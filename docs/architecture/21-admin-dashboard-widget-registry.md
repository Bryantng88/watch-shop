# Admin Dashboard Widget Registry

## Purpose

Admin list and workspace pages may display up to four dashboard widgets. Pages
select widgets by key; they do not own dashboard layout or copy shared widget
markup.

Current consumers:

- Watch List;
- Acquisition List;
- Technical Space.

## Shared contracts

`DashboardWidgetDefinition` declares:

- `key`: stable configuration key;
- `label`: user-facing widget name;
- `scope`: `SHARED`, `WATCH`, `ACQUISITION`, or `SPACE`;
- `size`: `1x1` or `2x1`;
- `component`: the widget renderer.

`DashboardWidgetGrid` and `DashboardWidgetCard` own shared layout and card
presentation. A registry resolves a configured key to its definition and
renderer.

## Initial registry

The business-list registry contains four shared widgets:

- `overview`;
- `value-trend`;
- `status-breakdown`;
- `recent-activity`.

Each renderer is an independent component. `BusinessListDashboard` only
deduplicates the page configuration, limits it to four entries, resolves the
registry, and renders the selected components in order.

## Ownership rules

- Shared layout stays under `src/domains/shared/ui/dashboard`.
- Shared list widget renderers stay under
  `src/domains/shared/ui/business-list/widgets`.
- A domain-specific widget keeps its query/data meaning in that domain and may
  reuse shared dashboard layout primitives.
- Adding a domain widget must not expand a central switch statement.
- Page configuration remains code-owned in this phase. No database preference
  is introduced yet.

## Customization UI

`BusinessListDashboard` may receive a page-specific `storageKey`. When present,
the dashboard renders a customization control that allows the user to:

- select one to four available widgets;
- move selected widgets up or down;
- save the selection and order;
- restore the page-owned default configuration.

Preferences are stored in browser `localStorage`, isolated by screen:

- `admin-dashboard:watch-list`;
- `admin-dashboard:acquisition-list`;
- `admin-dashboard:technical-space`.

This is device/browser-local preference only. Server persistence by user or role
remains a later phase.
