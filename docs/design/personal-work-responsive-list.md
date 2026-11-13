# Responsive personal-work list

The mobile list clipped its horizontal filters and mixed time, category, progress,
update, weekday and duration into wrapping metadata. Long names and sharing/link
rows made every item a different height. Desktop calendar panes also exposed the
wide-screen controls even when their available list width was narrow.

The list now responds to its own container width:
- A compact view selector and scope/filter button fit narrow panes. Wide lists
  retain all six view tabs. Scope, category and category management remain in
  the filter panel with the same values and handlers.
- Category/event marker and the name occupy one title line. Full names remain
  in the title and open the existing editor. The CV/EV reference is at the end
  of the second line in quiet text.
- Time is neutral, dates are DD/MM when the active view needs them, and checklist
  bars stay visible on phones. Wide lists additionally show percentages and
  the update label. Overdue state has an explicit warning icon and readable
  text in the schedule disclosure.
- Shared work shows one avatar of the owner who shares it, between category
  and title. Click/tap opens the sharer and recipients with permissions; hover
  does not open the panel. Scoped recipients see only the sharer and their own
  entry access, using the existing projected data.
- Full schedule, end time and duration open from the time control. Tags, related
  links, assignee and sharing names open from the context control. The existing
  DTO remains the only source; scoped recipients receive no new data or access.
- Floating panels render outside scroll clipping, remain within the viewport,
  and close on outside pointer, Escape or scroll. Update tooltips keep a short
  latest-change line and relative time, with mouse hover, focus and touch toggle.
- Mobile header/back link and aggregate counts are compact. Existing create,
  edit, calendar, completion, event and permission behavior is preserved.

`scripts/smoke-work-responsive-ui.cjs` renders the actual PersonalWorkClient with
synthetic data and stubbed server actions. It checks 320/390/768/1440 widths,
filter values, event/viewer restrictions, row placement, accessible schedule and
context disclosures, update hint, completion payload, non-mutating open and the
calendar/desktop layout. Real application data and notifications are not used.

## Notification entry

The Ben worker canonicalizes personal-work destinations to
`/admin/personal-work?view=list&item=<id>` so a native notification opens the
standalone list and the authorized item dialog. Legacy assignment pushes and
already-displayed notifications without a route open the list. Operational task
notifications retain `/admin/ben/work/<id>`. Routes remain same-origin and
allowlisted; unrelated order/admin editing windows are never reused.

When resuming a PWA window, navigate and focus the returned WindowClient. If it
vanishes, returns null or rejects, try another Ben window and then openWindow.
VM worker tests cover cold launch, resume/focus failures, invalid routes and
private-free notification text. Browser smoke checks owner/scoped item deep links,
click/touch recipient disclosure, and responsive rows. Login return tests preserve
the list/item query. A physical device push/tap still needs validation after deploy;
these checks do not send real notifications or alter runtime push configuration.
