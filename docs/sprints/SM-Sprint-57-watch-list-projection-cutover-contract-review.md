# SM Sprint 57 - Watch List Projection Cutover Contract Review

## Status

Draft for product/architecture review.

## Intent

Review the `/admin/watches` list contract before making `watch-list`
projection the default read source.

This sprint should not blindly copy the old `WatchRow` shape into the
projection forever. The goal is to decide what the Watch List should actually
show, filter, sort, and allow users to do.

## Current Implementation Snapshot

### Current Table Columns

The current Watch List table renders:

- Selection checkbox.
- Watch identity:
  - thumbnail;
  - title;
  - SKU;
  - product id;
  - compact content/image/service signal icons.
- Post readiness icon.
- Sale price.
- Created at.
- Updated at.
- Last updated by.
- Row actions.

### Current Top-Level Tabs

- Draft.
- Processing.
- Ready.
- Hold.
- Sold.
- All.

These map to Watch sale/list stage and are part of the current operational
navigation.

### Current Filters

Always visible:

- Search text.
- SKU.
- Brand.
- Vendor.
- Sort.

Advanced:

- Has content.
- Has image.
- Sale stage.
- Service/Ops stage.

Contextual mini-filters:

- Processing:
  - missing content;
  - missing image.
- Ready:
  - review draft;
  - review submitted;
  - partial approved;
  - approved;
  - posted.

### Current List Actions

Bulk actions:

- Send selected Watches without images to Photoshoot Workspace.
- Send selected Watches with images to Media Processing Workspace.

Row actions:

- View.
- Edit.
- Quick order.
- Service.
- Consign.
- Create task.
- Raise work case.
- Buy back, only for sold watches.
- Delete, currently still a TODO handler.

## Current Projection Shape

Projection key:

```text
watch-list
```

Current `ProjectionRecord.dataJson` stores:

- `row`: existing `WatchRow` compatibility shape.
- `filters`: query/filter fields.

Current filters include:

- `watchId`
- `productId`
- `sku`
- `title`
- `brandId`
- `brandName`
- `vendorId`
- `vendorName`
- `saleStage`
- `serviceStage`
- `stockStage`
- `hasContent`
- `hasImages`
- `isPosted`
- `reviewStatus`
- `contentStatus`
- `specStatus`
- `salePrice`
- `listPrice`
- `createdAt`
- `updatedAt`

## Review Findings

### 1. The UI Contract Is Smaller Than `WatchRow`

`WatchRow` currently contains more than the list renders directly. Some fields
exist for actions, filters, legacy display, or old readiness logic.

Directly rendered fields:

- `id`
- `productId`
- `sku`
- `title`
- `imageUrl`
- `hasContent`
- `hasImages`
- `imagesCount`
- `serviceIssuesCount`
- `reviewStatus` / `postReadiness` / `contentStatus`
- `salePrice`
- `createdAt`
- `updatedAt`
- `lastUpdatedBy`

Action/guard fields:

- `saleState`
- `productId`
- `id`
- `sku`
- `title`
- `imageUrl`

Mostly legacy or not currently rendered in the main table:

- `slug`
- `brandName`
- `vendorName`
- `isContentDownloaded`
- `isImageDownloaded`
- `isPosted`
- `serviceState`
- `stockState`
- `conditionGrade`
- `serviceLabel`
- `statusLabel`
- `listPrice`
- `costPrice`
- `minPrice`
- `contentReady`
- `imageReady`
- `serviceReady`
- `specStatus`

### 2. Operational Status Should Replace Post Readiness Guessing

`WatchListRow` normalizes readiness from multiple possible fields:

```text
reviewStatus -> postReadiness -> contentStatus -> contentStatusText()
```

This makes the client responsible for guessing operational meaning.

For projection cutover, readiness should become explicit operational projection
fields:

```ts
mediaStatus:
  | "NO_IMAGE"
  | "PHOTOSHOOT"
  | "MEDIA_PROCESSING"
  | "READY_TO_POST"
  | "POSTED"
  | "NEEDS_RESHOOT"
  | "NEEDS_MEDIA_REWORK";

serviceStatus:
  | "NOT_REQUIRED"
  | "WAITING"
  | "IN_SERVICE"
  | "DONE"
  | "ISSUE";

saleStatus:
  | "READY"
  | "DEPOSIT"
  | "SOLD"
  | "CONSIGNED";
```

The UI should render those values, not infer from several legacy fields.

### 3. Brand And Vendor Are Filtered But Not Rendered

The current list filters by brand/vendor, but the table does not show brand or
vendor as standalone columns.

This is acceptable if the list is optimized for scanning item identity and
workflow readiness, but it should be a deliberate decision.

Product decision needed:

- Keep brand/vendor filter-only?
- Show brand inline under title?
- Show vendor only in detail/edit?

### 4. Product Id Is Probably Too Noisy For Daily Use

The row displays:

```text
PID: <productId>
```

This is useful for debugging, but it is not a daily operator-facing identity
field. It also makes the Watch cell visually dense.

Proposal:

- Hide product id by default.
- Keep it in tooltip, copy action, debug mode, or detail page.

### 5. Last Updated By Is Expensive And Ambiguous

`lastUpdatedBy` is derived from review actor records, not necessarily the
latest business update actor for the Watch row.

It currently requires review actor lookup in full meta mode.

Proposal:

- Do not keep it as a primary list column unless operators actively use it.
- If needed, rename the meaning to something specific such as `Latest review
  actor`.
- Otherwise move it to detail/activity.

### 6. Current Actions Are Too Broad For A List

The list currently exposes many row actions:

- quick order;
- service;
- consign;
- task;
- work case;
- buy back;
- delete.

Some are useful quick starts. Some are domain transitions that should validate
source truth through commands. Some may belong better in detail/workspace.

Proposal:

- Keep only high-frequency, low-risk row actions visible.
- Move advanced actions into detail or a secondary menu.
- Remove `Delete` from list until it has a real, reviewed behavior.

### 7. Posting Targets Belong In Detail

Posting targets / `Page đăng` should not be a default Watch List column.

Decision:

- Remove `Page đăng` from the list contract.
- Keep posting targets in Watch detail/edit or Publish Workspace context.
- Do not include `postTargets` in the minimal list projection row unless a
  later search/filter requirement explicitly needs it.

### 8. Bulk Workspace Actions Are Valid But Need Source-Truth Validation

Bulk Photoshoot and Media Processing actions are useful from Watch List because
operators naturally start from search/filter results.

They should remain, but projection eligibility should only be a UI hint. The
server action must continue validating current truth.

Proposal:

- Keep bulk actions.
- Keep eligibility counts as hints.
- Ensure action response clearly reports requested/skipped/reason.

## Proposed Watch List Contract

### Primary Row Fields

Recommended required projection row fields:

```ts
type WatchListProjectionRow = {
  watchId: string;
  productId: string;
  sku: string;
  title: string;
  imageUrl: string | null;
  imageKey: string | null;

  brandName: string | null;
  vendorName: string | null;

  mediaStatus:
    | "NO_IMAGE"
    | "PHOTOSHOOT"
    | "MEDIA_PROCESSING"
    | "READY_TO_POST"
    | "POSTED"
    | "NEEDS_RESHOOT"
    | "NEEDS_MEDIA_REWORK";
  mediaStatusLabel: string;

  serviceStatus:
    | "NOT_REQUIRED"
    | "WAITING"
    | "IN_SERVICE"
    | "DONE"
    | "ISSUE";
  serviceStatusLabel: string;

  saleStatus:
  | "READY"
  | "HOLD"
  | "SOLD"
  | "CONSIGNED";
  saleStatusLabel: string;

  salePrice: number | null;
  updatedAt: string | null;
};
```

Compatibility can remain during migration:

```ts
ProjectionRecord.dataJson = {
  row: WatchRow,
  v2Row?: WatchListProjectionRow,
  filters: ...
}
```

Then the UI can move from `row` to `v2Row` after product approval.

### Primary Columns

Recommended default columns:

- Watch:
  - thumbnail;
  - title;
  - SKU;
  - optional brand inline.
- Signals:
  - content;
  - image;
  - service issue.
- Media status.
- Service status.
- Sale status.
- Sale price.
- Updated at.
- Actions.

Recommended to remove or hide by default:

- Product id.
- Created at.
- Last updated by.
- Page đăng / posting targets.

Reason:

- Product id is debug-oriented.
- Created at is less operational than updated at for list triage.
- Last updated by is ambiguous and expensive unless it becomes a clear activity
  field.
- Posting targets belong in detail/publish context.

### Filter / Tab Direction

Product direction:

- Remove the top-level status tabs.
- Remove contextual subfilters.
- Keep the list as one operational table.
- Represent operational state through columns instead of tabs/subtabs.

Recommended lightweight filters:

- Search.
- SKU.
- Brand, if still useful for operators.
- Vendor, if still useful for sourcing/ops.
- Sort.

Remove from default UI:

- Sale stage filter, because Sale status becomes a visible operational column.
- Has content.
- Has image.
- Ready/review subfilters.
- Service/Ops stage filter, unless operators still need a narrow service queue
  view from this list.

Projection should still store normalized operational statuses so future filters
can be added cheaply without reintroducing tab complexity:

- `mediaStatus`
- `serviceStatus`
- `saleStatus`

Sale status label mapping:

- `READY` -> `Sẵn sàng`
- `HOLD` -> `Giữ hàng`
- `SOLD` -> `Đã bán`
- `CONSIGNED_TO` -> `Consigned`

Temporary architecture note:

- Media status can follow the newer Media Workspace/event flow because that
  architecture already exists.
- Order and Service workflow boundaries are not implemented yet.
- Until Order/Service are migrated to the same event/dispatch/consumer
  architecture, Watch List projection should derive sale/service labels from
  the current Watch/Product logic.
- `HOLD -> Giữ hàng` is therefore a compatibility mapping, not the final Order
  source-of-truth design.
- Do not introduce Order/Service workflow refactors in Sprint 57.

## Watch Inventory Query Contract Architecture

### Why This Layer Exists

Watch List filters should not be treated as UI-only state.

The same query intent will later be needed by:

- Admin Watch List.
- Saved views / bookmarked operational lists.
- Sales planning and inventory reports.
- Zalo OA / intake command queries, for example:
  - `Seiko dưới 5 triệu`;
  - `automatic mặt trắng`;
  - `watch chưa có giá`;
  - `đã đủ ảnh/content và sẵn sàng đăng`.
- Public catalog filtering on the sales website.

To avoid rewriting query rules in every consumer, Watch uses a dedicated
Query Contract layer:

```text
UI / Zalo / Report / Public Catalog
  -> WatchInventoryQueryInput
  -> WatchInventoryQueryMapper
  -> Projection Query Input
  -> ProjectionRecord read model
```

The query contract is not a workflow engine and does not mutate data.
It only describes read intent in a stable, versionable shape.

### Current Contract Boundary

Implementation location:

```text
src/domains/watch/server/inventory-query/
  watch-inventory-query.types.ts
  watch-inventory-query.mapper.ts
  watch-inventory-query.service.ts
```

Responsibilities:

- Define `WatchInventoryQueryInput`.
- Normalize flat Watch List URL/form filters into structured query intent.
- Normalize price filters, including range presets, into min/max boundaries.
- Convert query intent into the current projection query input.
- Keep `getAdminWatchList` from calling projection internals directly.

Non-responsibilities:

- No write operations.
- No workflow transition.
- No notification dispatch.
- No report insight calculation.
- No UI rendering.
- No generic cross-domain query abstraction yet.

### Contract v1 Shape

The current direction is:

```ts
type WatchInventoryQueryInput = {
  text?: string;
  sku?: string;

  brandIds?: string[];
  vendorIds?: string[];

  operation?: {
    mediaStatuses?: string[];
    serviceStatuses?: string[];
    saleStatuses?: string[];
  };

  price?: {
    status?: "MISSING" | "HAS_PRICE";
    preset?:
      | "UNDER_3M"
      | "UNDER_5M"
      | "FIVE_TO_TEN"
      | "TEN_TO_TWENTY"
      | "OVER_TWENTY";
    min?: number;
    max?: number;
  };

  sort?: string;
  page?: number;
  pageSize?: number;
  withTotal?: boolean;
  meta?: "lite" | "full" | string;
};
```

Flat URL/UI params remain acceptable at the boundary:

```text
q
sku
brandId
vendorId
mediaStatus
serviceStatus
saleStatus
priceStatus
pricePreset
priceMin
priceMax
sort
page
pageSize
```

But those params should be normalized before reaching projection read logic.

### Price Filtering Rule

Price filtering must go through the Query Contract, not directly from UI to
projection.

Rules:

- `price.status = MISSING` means only watches without sale price.
- `price.status = HAS_PRICE` means only watches with sale price.
- `price.preset` is a user-facing shortcut and is normalized to `min/max`.
- `price.min/max` are the durable query shape for future Zalo/report/public
  catalog use.
- If `status = MISSING`, range filters are ignored.
- If a preset or custom range is present, the query implies `HAS_PRICE`.

Preset mapping:

```text
UNDER_3M      -> max 3,000,000
UNDER_5M      -> max 5,000,000
FIVE_TO_TEN   -> min 5,000,000  max 10,000,000
TEN_TO_TWENTY -> min 10,000,000 max 20,000,000
OVER_TWENTY   -> min 20,000,000
```

### Projection Read Model Relationship

Projection remains a read model, not a business-rule owner.

Projection should store only fields needed for fast query and display:

- identity fields;
- operational status fields;
- price fields;
- search text;
- sort timestamp;
- lightweight filter fields.

The Query Contract decides what the user is asking for.
The Projection Query decides how to read that intent efficiently from
`ProjectionRecord`.

### Total Count Rule

Watch List uses `withTotal=true` when the UI needs a real query total.

This should count from projection only:

```text
ProjectionRecord WHERE normalized query filters
```

It must not fall back to deep source joins unless projection read is disabled or
missing. This keeps filter totals usable for operations and future saved views.

### Saved View Direction

Saved views should save query intent, not UI component state.

Recommended future shape:

```ts
type SavedQueryView = {
  id: string;
  scope: "WATCH_INVENTORY";
  name: string;
  ownerUserId: string;
  queryJson: WatchInventoryQueryInput;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Current UI may start with localStorage, but the durable model should store the
normalized query contract.

### Extension Rules

Future filters should be added in this order:

1. Add structured field to `WatchInventoryQueryInput`.
2. Normalize flat UI/URL params in the mapper.
3. Add projection query support.
4. Add UI controls.
5. Add smoke tests for projection read and total count.

Do not add new filter logic directly inside UI components.
Do not make projection own business decisions.
Do not create a generic all-domain query system before Watch Inventory Query is
stable.

### Actions To Keep / Review

Recommended keep:

- View.
- Edit.
- Bulk send to Photoshoot.
- Bulk send to Media Processing.
- Service, if service is a frequent operational shortcut.

Recommended keep but secondary:

- Quick order.
- Consign.
- Create task.
- Raise work case.
- Buy back.

Recommended remove from list for now:

- Delete, because the handler is currently TODO and deletion policy is not
  defined.

## Product Decisions Needed

| Area | Recommendation | Product decision |
| --- | --- | --- |
| Product id display | Hide from default row, keep in detail/debug | TBD |
| Created at column | Remove from default table | TBD |
| Last updated by | Move to detail/activity unless clearly needed | TBD |
| Page đăng | Remove from list, keep in detail/publish context | Approved |
| Tabs/subfilters | Remove; use one operational table with status columns | Approved |
| Brand display | Show inline under title if operators need it | TBD |
| Vendor display | Keep filter-only or move to detail | TBD |
| Operational status | Replace client inference with explicit media/service/sale status fields | Approved |
| Delete action | Remove from list until deletion policy exists | TBD |
| Quick order / Consign | Keep in secondary actions if used often | TBD |
| Task / Work case | Keep secondary, or move to detail | TBD |

## Suggested Sprint 57 Implementation Plan

### Step 1 - Product Review

Review the Product Decisions table with the product owner and mark each item as:

- keep;
- remove;
- move to detail;
- keep as secondary;
- defer.

### Step 2 - Add Contract Types Only

Add `WatchListProjectionRow` as a smaller read contract without replacing the
existing `WatchRow` immediately.

No UI cutover yet.

### Step 3 - Compare Current Projection

Use projection observability:

```text
POST /api/admin/system/projections
{
  "action": "compare",
  "projectionKey": "watch-list",
  "scope": {
    "limit": 20,
    "filters": {
      "view": "all",
      "meta": "lite"
    }
  }
}
```

Run compare for common views:

- draft;
- processing;
- ready;
- sold;
- all.

### Step 4 - Prepare UI Cutover Behind Flag

Only after contract approval:

- render from the smaller projection row;
- keep fallback source query;
- keep `WATCH_LIST_PROJECTION_READ` flag;
- do not remove old `WatchRow` compatibility yet.

## Out Of Scope

- Removing source-query fallback.
- Making projection default without compare.
- Rewriting the whole Watch List UI.
- Building new dashboard/analytics.
- Moving Order/Service/Inventory to projection.
- Implementing deletion policy.
- Moving all actions out of the list immediately.

## Acceptance

Sprint 57 passes when:

- Product owner has approved which columns/actions stay on Watch List.
- A smaller Watch List read contract is documented.
- Fields to keep/remove/move are explicit.
- Projection compare has been run for agreed views/filters.
- A reversible cutover plan exists.
- No business rule is moved into projection.
