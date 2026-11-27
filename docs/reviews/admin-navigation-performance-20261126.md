# Admin navigation performance review — 2026-11-26

Reported surface: production, switching between Mua bán, Vận hành and Sản phẩm.

## Verified findings

| Path | Existing behavior | Change |
| --- | --- | --- |
| Product menu | /admin/products authenticates/authorizes then redirects to first productEntries child | Navigate directly to /admin/watches or /admin/straps using the same existing permission helper |
| Trading menu | /admin/trading authenticates/authorizes then redirects to first tradingEntries child | Navigate directly to /admin/acquisitions or /admin/orders using the same existing permission helper |
| Admin content transition | No common admin loading.tsx; the previous content remains while dynamic page data resolves | Add the shared static loading boundary so the shell stays available while content streams |

The canonical menu destinations remove an avoidable redirect route read and its
middleware/auth lookup for normal Product/Trading navigation. Original alias routes
remain valid for bookmarks. No claim that all production navigation latency is fixed.

## Data/auth review

Middleware currently performs a live user/role/permission lookup. getCurrentUser
already uses React request deduplication and an existing 15-second user cache.
This change does not extend auth caching, change revocation behavior or skip guards.
Watch and acquisition pages already fetch list data and vendor options concurrently;
no new stale list/vendor cache is introduced.

Operations reads workspace summaries and access context on the server. Its TI board
is already excluded from the initial server page payload and read separately by the
client. These reads are not removed merely to show an empty or faster-looking page.
The new loading boundary improves transition feedback; it does not establish that
Operations database or NAS reads are faster.

## Verification and limits

The regression builds and runs real Next production routes, imports the actual
navigation/loading components, and supplies synthetic delayed pages. It checks
canonical destinations for normal and restricted permission sets, no requests to
Product/Trading redirect aliases, a visible loading stream before the delayed page,
persistent navigation/active state, and the mobile selector. The synthetic delay is
not a production speed benchmark. Existing flat-navigation checks are updated to
expect the canonical Product URL while retaining one top-level item per section.

No authenticated production trace, production query plan or NAS timing was available
in this task. Do not publish a before/after millisecond or percentage speed claim.
After a separately authorized release, compare authenticated RSC/document requests,
redirect chains, TTFB and transferred bytes on these three routes, on the same device
and connection. If server time remains high, profile the actual read/query stages
before changing indexes, projections, storage, auth policy or caching.

No production deployment, environment changes, schema migration or live data writes.
