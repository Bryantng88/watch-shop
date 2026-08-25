# Production release handoff — 2026-08-24

## Current state

- Release commit `30aa1a6a` is on `main`.
- The production release archive was built and copied to the NAS.
- Production database backup completed at:
  `/share/WatchShopBackup/database/watch-shop-20260824T125853Z.dump`.
- Migrations `20260824150000_add_watch_inventory_cycles` and
  `20260824170000_add_media_posts` were applied successfully.
- The application container was **not** recreated. Production is still serving the
  previous application image.

## Intentional deployment stop

The pre-release audits found existing production data drift. Do not repair these
records automatically or bypass the audit merely to finish the deployment.

### Watch inventory lifecycle

Follow-up code review changed the audit contract: storefront publication is independent of
sellability, and `Product.status=IN_SERVICE` is a non-blocking operational overlay when the
Watch inventory pair is otherwise valid. The audit now reports these rows as warnings and exits
non-zero only for lifecycle/cycle errors, invalid sale/stock pairs, or multiple active orders.
The production audit must be rerun with this revision before deployment resumes.

The earlier version of `scripts/audit-watch-inventory-lifecycle.ts` reported 21
`DIVERGENT_STATE_TRIPLE` findings:

- 20 watches: `Product.status=IN_SERVICE`, `Watch.saleStatus=READY`,
  `Watch.stockStatus=IN_STOCK`.
- 1 watch: `Product.status=IN_SERVICE`, `Watch.saleStatus=READY`,
  `Watch.stockStatus=RESERVED`.

No watch was changed on 2026-08-24. Under the revised contract, the 20
`READY/IN_STOCK` rows are warnings and do not block storefront publication or deployment.
The `READY/RESERVED` row remains a blocking invalid inventory pair and needs its active
order/reservation checked.

Before applying any repair:

1. Inspect the service case/history for every affected watch.
2. Inspect active order and reservation state, especially the reserved watch.
3. Classify the authoritative business state per watch.
4. Apply changes through the inventory lifecycle domain service, not raw SQL.
5. Re-run `npm run audit:watch-inventory-lifecycle` and require zero unexplained
   findings before replacing the production app container.

Potential impact of an incorrect repair includes storefront visibility, sale and
reservation eligibility, service workflow membership, inventory filters/reports,
and order return/cancellation synchronization.

### Permission catalog

The permission audit also found role `SALE` drift:

- Missing: `REPORT_SALES_VIEW`.
- Unexpected: `ORDER_PAYMENT_VIEW`, `ORDER_PAYMENT_CREATE`,
  `ORDER_PAYMENT_UPDATE`, `ORDER_PAYMENT_DELETE`.

Confirm the intended production permission policy before mutating role grants,
then re-run the permission audit.

## Resume checklist

1. Confirm and repair the permission drift.
2. Investigate and repair any remaining audit errors; service-overlay warnings are informational.
3. Re-run both production audits.
4. Only when the release gates pass, recreate the app container.
5. Verify compose status, application logs, `/api/health`, and `/api/ready`.

