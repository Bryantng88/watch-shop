# Technician mobile workspace

`/admin/services/technician` is a compact service workspace, reachable from the
“Kỹ thuật” menu with existing SERVICE_VIEW permission. Technicians manage all
issues, not just their assignments. It does not change role permissions or the
existing desktop coordination board/list. The route uses a standalone canvas
with an Admin return link; other admin routes keep their shell.

The shared admin UI contract applies: flat rows, compact header, one grouped
search/status toolbar, technical blue for domain identity and amber overdue
warnings. Every status (including cancelled/history) remains available through
the selector. Default is active issues. Search covers summary, product title,
SKU and service reference. Reads are server-filtered and limited to 25 items,
with matching counts and stable pagination. No loading every issue into a client
and filtering by technician ID.

A native modal dialog contains the actual workflow: confirm, start (technical
detail, duration, performer/vendor and required replacement parts), complete
(actual cost and resolution), or save a note. Cost input is explicitly in
thousands of VND; the domain receives full VND. Ending an issue keeps the
existing payment/event rules and displays that effect before submission.
Edited notes are saved in the same transaction when confirming, starting or completing, so the main action does not discard pending note edits. View-only users see no mutating controls. On failure, inputs remain available
and the user can reload the list, including uncertain or stale results.

Server actions require SERVICE_UPDATE, validate a strict command and derive the
actor on the server. A PostgreSQL row lock, version check and lifecycle state
check prevent stale overwrites/replayed completion before delegating to the
existing domain services inside the same transaction. No domain service or
permission policy is replaced. No migrations or production writes are part of
this PR.

Validation: actual browser component with synthetic data checks 320/390/768/1440,
filters/search/history, dialogs, required start inputs, notes, money conversion,
blocked-completion feedback, double-submit guard and view-only controls. Server
boundary tests cover permissions, forged input, stale/ended state, lock/write
order, replay blocking, authenticated actor, mandatory start inputs and bounded
all-issue reads. These fixtures do not prove production data or a physical
technician phone; device acceptance is still required after deployment.
