# Technical Issue list view

The technical operation board supports **Board / List**. List is an alternative
presentation of the same authorized technical-issue board payload. The chosen
layout is stored as `tiLayout=list` in the current URL, preserving other query
parameters. Board remains the default. Media and other operation views are unchanged.

List has stage tabs, urgent-first/recent-update/due-date sorting, compact rows,
25 loaded matches per page, quick preview, priority toggles, and valid stage
transitions. Transition buttons reuse the board's action lookup, required-input
modal, cost approval, server commands and reconciliation. No direct status writes
or bulk transitions are introduced. Rows without a current workspace cannot
start a transition. Completed rows remain available for preview.

The existing board endpoint loads a bounded number of issues per stage. List
shows the server's loaded/total counts and offers **Tải thêm TI của stage này**.
Sorting and priority/comment filters apply to loaded data, not the entire server
result. The UI explicitly states this scope. An empty filtered page does not mean
there are no matches among unloaded issues. Search, period and other shared
filters keep their existing board behavior. Done history uses the existing
14-day/30-day/all retention selector.

No migration, new permissions, credentials or NAS setup are required. Deployment
is separate and is performed from Local. Do not merge or deploy production based
on this document.

## Staging acceptance

- Open the technical operation flow and switch Board → List → Board. Existing
  filters and underlying issue states must stay intact. Reload a URL containing
  `tiLayout=list` and confirm List is selected.
- Select each stage, load additional records and paginate beyond 25 loaded
  matches. Verify counts distinguish loaded records from server totals. Use a
  priority/comment filter with no loaded matches and confirm load-more remains
  available when the server reports more data.
- Verify sorting with urgent/normal rows and missing due dates; view zero cost,
  missing watch image, vendor/internal ownership and unread mentions.
- Open a row preview and update comments. Confirm existing preview/activity
  reconciliation still updates the list.
- Perform classify/start/complete actions on synthetic issues. Required fields,
  cost approvals, authorization and invalid-transition rejection must match
  Board. A moved issue must appear under its new stage, with no second workflow.
- Confirm media and other operation views still render their existing layouts.
