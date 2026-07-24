import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  normalizeWatchListView,
  type WatchListView,
} from "@/domains/watch/shared/watch-status";
import type {
  WatchListCounts,
  WatchListResult,
  WatchListSubCounts,
  WatchListSubFilter,
} from "@/domains/watch/ui/list/types";
import {
  WATCH_LIST_PROJECTION_KEY,
} from "./watch-list-projection.constants";
import {
  asWatchListProjectionData,
} from "./watch-list-projection.mapper";
import type {
  WatchListProjectionData,
  WatchListProjectionQueryInput,
} from "./watch-list-projection.types";

type NormalizedProjectionInput = WatchListProjectionQueryInput & {
  view: WatchListView;
  subFilter: WatchListSubFilter;
  page: number;
  pageSize: number;
  withTotal: boolean;
  meta: "full" | "lite";
};

const EMPTY_SUB_COUNTS: WatchListSubCounts = {
  missingContent: 0,
  missingImage: 0,
  reviewDraft: 0,
  reviewSubmitted: 0,
  partialApproved: 0,
  approved: 0,
  posted: 0,
};

const EMPTY_COUNTS: WatchListCounts = {
  draft: 0,
  processing: 0,
  ready: 0,
  hold: 0,
  sold: 0,
  all: 0,
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function toPositiveInt(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function normalizeSubFilter(value: unknown): WatchListSubFilter {
  const text = clean(value).toUpperCase();
  const map: Record<string, WatchListSubFilter> = {
    DRAFT: "REVIEW_DRAFT",
    REVIEW_DRAFT: "REVIEW_DRAFT",
    PENDING: "REVIEW_SUBMITTED",
    SUBMITTED: "REVIEW_SUBMITTED",
    REVIEW_SUBMITTED: "REVIEW_SUBMITTED",
    PARTIAL: "PARTIAL_APPROVED",
    PARTIAL_APPROVED: "PARTIAL_APPROVED",
    APPROVED: "APPROVED",
    POSTED: "POSTED",
    MISSING_CONTENT: "MISSING_CONTENT",
    MISSING_IMAGE: "MISSING_IMAGE",
  };
  return map[text] ?? "";
}

function sanitizeSubFilter(
  view: WatchListView,
  subFilter: WatchListSubFilter,
): WatchListSubFilter {
  if (view === "processing") {
    return subFilter === "MISSING_CONTENT" || subFilter === "MISSING_IMAGE"
      ? subFilter
      : "";
  }

  if (view === "ready") {
    return [
      "REVIEW_DRAFT",
      "REVIEW_SUBMITTED",
      "PARTIAL_APPROVED",
      "APPROVED",
      "POSTED",
    ].includes(subFilter)
      ? subFilter
      : "";
  }

  return "";
}

function normalizeInput(
  input: WatchListProjectionQueryInput,
): NormalizedProjectionInput {
  const view = normalizeWatchListView(input.view);
  return {
    ...input,
    view,
    subFilter: sanitizeSubFilter(view, normalizeSubFilter(input.subFilter)),
    page: toPositiveInt(input.page, 1),
    pageSize: Math.min(toPositiveInt(input.pageSize, 20), 100),
    withTotal: input.withTotal === true || clean(input.withTotal).toLowerCase() === "true",
    meta: clean(input.meta).toLowerCase() === "lite" ? "lite" : "full",
  };
}

function statusForView(view: WatchListView) {
  return view === "all" ? null : view.toUpperCase();
}

function jsonText(path: string) {
  return Prisma.raw(`"dataJson"->'filters'->>'${path}'`);
}

function jsonBool(path: string) {
  return Prisma.raw(`(("dataJson"->'filters'->>'${path}')::boolean)`);
}

function jsonNumber(path: string) {
  return Prisma.raw(`(("dataJson"->'filters'->>'${path}')::numeric)`);
}

function projectionMediaCondition(status: string) {
  switch (status) {
    case "POSTED":
    case "NO_IMAGE":
    case "PHOTOSHOOT":
    case "MEDIA_READY":
    case "READY_TO_PUBLISH":
    case "MEDIA_PROCESSING":
    case "NEEDS_REWORK":
      return Prisma.sql`${jsonText("mediaStatus")} = ${status}`;
    default:
      return null;
  }
}

function projectionServiceCondition(status: string) {
  switch (status) {
    case "DONE":
      return Prisma.sql`(${jsonText("serviceStatus")} = 'DONE' OR ${jsonText("serviceStage")} = 'DONE')`;
    case "IN_SERVICE":
      return Prisma.sql`(${jsonText("serviceStatus")} = 'IN_SERVICE' OR ${jsonText("serviceStage")} = 'IN_SERVICE')`;
    case "WAITING":
      return Prisma.sql`(${jsonText("serviceStatus")} = 'WAITING' OR ${jsonText("serviceStage")} = 'PENDING')`;
    case "NOT_REQUIRED":
      return Prisma.sql`(${jsonText("serviceStatus")} = 'NOT_REQUIRED' OR ${jsonText("serviceStage")} = 'NOT_REQUIRED')`;
    case "ISSUE":
      return Prisma.sql`${jsonText("serviceStatus")} = 'ISSUE'`;
    default:
      return null;
  }
}

function projectionSaleCondition(status: string) {
  switch (status) {
    case "SOLD":
      return Prisma.sql`(${jsonText("saleStatus")} = 'SOLD' OR ${jsonText("saleStage")} = 'SOLD')`;
    case "HOLD":
      return Prisma.sql`(${jsonText("saleStatus")} = 'HOLD' OR ${jsonText("saleStage")} = 'HOLD')`;
    case "CONSIGNED":
      return Prisma.sql`(${jsonText("saleStatus")} = 'CONSIGNED' OR ${jsonText("saleStage")} = 'CONSIGNED_TO')`;
    case "READY":
      return Prisma.sql`(${jsonText("saleStatus")} = 'READY' OR COALESCE(${jsonText("saleStage")}, '') NOT IN ('HOLD', 'SOLD', 'CONSIGNED_TO'))`;
    default:
      return null;
  }
}

function projectionPriceCondition(status: string) {
  switch (status) {
    case "MISSING":
      return Prisma.sql`${jsonNumber("salePrice")} IS NULL`;
    case "HAS_PRICE":
      return Prisma.sql`${jsonNumber("salePrice")} IS NOT NULL`;
    default:
      return null;
  }
}

function projectionPriceRangeCondition(input: NormalizedProjectionInput) {
  const rawMin = clean(input.priceMin);
  const rawMax = clean(input.priceMax);
  const min = Number(rawMin);
  const max = Number(rawMax);
  const hasMin = rawMin !== "" && Number.isFinite(min) && min >= 0;
  const hasMax = rawMax !== "" && Number.isFinite(max) && max >= 0;

  if (!hasMin && !hasMax) return null;

  const conditions: Prisma.Sql[] = [
    Prisma.sql`${jsonNumber("salePrice")} IS NOT NULL`,
  ];

  if (hasMin) conditions.push(Prisma.sql`${jsonNumber("salePrice")} >= ${min}`);
  if (hasMax) conditions.push(Prisma.sql`${jsonNumber("salePrice")} <= ${max}`);

  return Prisma.sql`(${Prisma.join(conditions, " AND ")})`;
}

function projectionQuickFilterCondition(quickFilter: string) {
  switch (quickFilter) {
    case "missingPrice":
      return Prisma.sql`${jsonNumber("salePrice")} IS NULL`;
    case "missingImage":
      return Prisma.sql`${jsonBool("hasImages")} = false`;
    case "missingContent":
      return Prisma.sql`${jsonBool("hasContent")} = false`;
    case "photoshoot":
      return projectionMediaCondition("PHOTOSHOOT");
    case "mediaProcessing":
      return projectionMediaCondition("MEDIA_PROCESSING");
    case "readyToPublish":
      return projectionMediaCondition("READY_TO_PUBLISH");
    case "readyToSell":
      return projectionSaleCondition("READY");
    case "hasIssue":
      return Prisma.sql`(${jsonText("serviceStatus")} = 'ISSUE' OR ${jsonText("mediaStatus")} = 'NEEDS_REWORK')`;
    default:
      return null;
  }
}

function filterConditions(input: NormalizedProjectionInput) {
  const conditions: Prisma.Sql[] = [
    Prisma.sql`"projectionKey" = ${WATCH_LIST_PROJECTION_KEY}`,
  ];
  const viewStatus = statusForView(input.view);

  if (viewStatus) conditions.push(Prisma.sql`"status" = ${viewStatus}`);
  if (clean(input.saleStage)) conditions.push(Prisma.sql`"status" = ${clean(input.saleStage).toUpperCase()}`);
  if (clean(input.opsStage)) conditions.push(Prisma.sql`${jsonText("serviceStage")} = ${clean(input.opsStage).toUpperCase()}`);
  const mediaCondition = projectionMediaCondition(clean(input.mediaStatus).toUpperCase());
  const serviceCondition = projectionServiceCondition(clean(input.serviceStatus).toUpperCase());
  const saleCondition = projectionSaleCondition(clean(input.saleStatus).toUpperCase());
  const priceCondition = projectionPriceCondition(clean(input.priceStatus).toUpperCase());
  const priceRangeCondition = projectionPriceRangeCondition(input);
  const quickFilterCondition = projectionQuickFilterCondition(clean(input.quickFilter));
  if (mediaCondition) conditions.push(mediaCondition);
  if (serviceCondition) conditions.push(serviceCondition);
  if (saleCondition) conditions.push(saleCondition);
  if (priceCondition) conditions.push(priceCondition);
  if (priceRangeCondition) conditions.push(priceRangeCondition);
  if (quickFilterCondition) conditions.push(quickFilterCondition);
  if (clean(input.brandId)) conditions.push(Prisma.sql`${jsonText("brandId")} = ${clean(input.brandId)}`);
  if (clean(input.vendorId)) conditions.push(Prisma.sql`${jsonText("vendorId")} = ${clean(input.vendorId)}`);
  if (clean(input.audienceSegment)) {
    conditions.push(
      Prisma.sql`COALESCE(${jsonText("audienceSegment")}, 'MEN') = ${clean(input.audienceSegment).toUpperCase()}`,
    );
  }
  if (clean(input.q)) conditions.push(Prisma.sql`"searchText" ILIKE ${`%${clean(input.q).toLowerCase()}%`}`);
  if (clean(input.sku)) conditions.push(Prisma.sql`"searchText" ILIKE ${`%${clean(input.sku).toLowerCase()}%`}`);

  if (input.hasContent === "yes") conditions.push(Prisma.sql`${jsonBool("hasContent")} = true`);
  if (input.hasContent === "no") conditions.push(Prisma.sql`${jsonBool("hasContent")} = false`);
  if (input.hasImages === "yes") conditions.push(Prisma.sql`${jsonBool("hasImages")} = true`);
  if (input.hasImages === "no") conditions.push(Prisma.sql`${jsonBool("hasImages")} = false`);

  if (input.subFilter === "MISSING_CONTENT") {
    conditions.push(Prisma.sql`${jsonBool("hasContent")} = false`);
    conditions.push(Prisma.sql`${jsonBool("hasImages")} = true`);
  }
  if (input.subFilter === "MISSING_IMAGE") {
    conditions.push(Prisma.sql`${jsonBool("hasContent")} = true`);
    conditions.push(Prisma.sql`${jsonBool("hasImages")} = false`);
  }
  if (input.subFilter === "REVIEW_DRAFT") conditions.push(Prisma.sql`${jsonText("reviewStatus")} = 'DRAFT'`);
  if (input.subFilter === "REVIEW_SUBMITTED") conditions.push(Prisma.sql`${jsonText("reviewStatus")} = 'SUBMITTED'`);
  if (input.subFilter === "PARTIAL_APPROVED") conditions.push(Prisma.sql`${jsonText("reviewStatus")} = 'PARTIAL_APPROVED'`);
  if (input.subFilter === "APPROVED") conditions.push(Prisma.sql`${jsonText("reviewStatus")} = 'APPROVED'`);
  if (input.subFilter === "POSTED") conditions.push(Prisma.sql`${jsonBool("isPosted")} = true`);

  return conditions;
}

function whereSql(input: NormalizedProjectionInput) {
  return Prisma.join(filterConditions(input), " AND ");
}

function orderBySql(sort?: string) {
  switch (sort) {
    case "updated_asc":
    case "updatedAsc":
      return Prisma.sql`"sortAt" ASC NULLS LAST, "rowKey" ASC`;
    case "created_asc":
    case "createdAsc":
      return Prisma.sql`("dataJson"->'filters'->>'createdAt') ASC NULLS LAST, "rowKey" ASC`;
    case "created_desc":
    case "createdDesc":
      return Prisma.sql`("dataJson"->'filters'->>'createdAt') DESC NULLS LAST, "rowKey" ASC`;
    case "price_asc":
    case "priceAsc":
      return Prisma.sql`${jsonNumber("salePrice")} ASC NULLS LAST, "sortAt" DESC NULLS LAST`;
    case "price_desc":
    case "priceDesc":
      return Prisma.sql`${jsonNumber("salePrice")} DESC NULLS LAST, "sortAt" DESC NULLS LAST`;
    case "title_asc":
    case "titleAsc":
      return Prisma.sql`LOWER("dataJson"->'filters'->>'title') ASC NULLS LAST, "rowKey" ASC`;
    case "title_desc":
    case "titleDesc":
      return Prisma.sql`LOWER("dataJson"->'filters'->>'title') DESC NULLS LAST, "rowKey" ASC`;
    default:
      return Prisma.sql`"sortAt" DESC NULLS LAST, "rowKey" ASC`;
  }
}

function subCountFiltersForView(view: WatchListView): WatchListSubFilter[] {
  if (view === "processing") return ["MISSING_CONTENT", "MISSING_IMAGE"];
  if (view === "ready") {
    return [
      "REVIEW_DRAFT",
      "REVIEW_SUBMITTED",
      "PARTIAL_APPROVED",
      "APPROVED",
      "POSTED",
    ];
  }
  return [];
}

function subCountKey(subFilter: WatchListSubFilter): keyof WatchListSubCounts | null {
  switch (subFilter) {
    case "MISSING_CONTENT":
      return "missingContent";
    case "MISSING_IMAGE":
      return "missingImage";
    case "REVIEW_DRAFT":
      return "reviewDraft";
    case "REVIEW_SUBMITTED":
      return "reviewSubmitted";
    case "PARTIAL_APPROVED":
      return "partialApproved";
    case "APPROVED":
      return "approved";
    case "POSTED":
      return "posted";
    default:
      return null;
  }
}

function dataFromRows(rows: Array<{ dataJson: unknown }>) {
  return rows
    .map((row) => asWatchListProjectionData(row.dataJson))
    .filter((item): item is WatchListProjectionData => Boolean(item));
}

async function countRows(db: DB, input: NormalizedProjectionInput) {
  const rows = await dbOrTx(db).$queryRaw<Array<{ count: bigint }>>(
    Prisma.sql`
      SELECT COUNT(*)::bigint AS count
      FROM "ProjectionRecord"
      WHERE ${whereSql(input)}
    `,
  );
  return Number(rows[0]?.count ?? 0);
}

async function viewCounts(db: DB, input: NormalizedProjectionInput): Promise<WatchListCounts> {
  const rows = await dbOrTx(db).$queryRaw<Array<{ status: string | null; count: bigint }>>(
    Prisma.sql`
      SELECT "status", COUNT(*)::bigint AS count
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${WATCH_LIST_PROJECTION_KEY}
        AND (${clean(input.q)}::text = '' OR "searchText" ILIKE ${`%${clean(input.q).toLowerCase()}%`})
        AND (${clean(input.sku)}::text = '' OR "searchText" ILIKE ${`%${clean(input.sku).toLowerCase()}%`})
        AND (${clean(input.brandId)}::text = '' OR ${jsonText("brandId")} = ${clean(input.brandId)})
        AND (${clean(input.vendorId)}::text = '' OR ${jsonText("vendorId")} = ${clean(input.vendorId)})
        AND COALESCE(${jsonText("audienceSegment")}, 'MEN') = ${clean(input.audienceSegment || "MEN").toUpperCase()}
      GROUP BY "status"
    `,
  );
  const counts = { ...EMPTY_COUNTS };

  for (const row of rows) {
    const key = clean(row.status).toLowerCase() as keyof WatchListCounts;
    if (key in counts) counts[key] = Number(row.count ?? 0);
    counts.all += Number(row.count ?? 0);
  }

  return counts;
}

async function summaryCounts(
  db: DB,
  input: NormalizedProjectionInput,
): Promise<WatchListResult["summary"]> {
  const segmentInput = {
    ...input,
    subFilter: "" as WatchListSubFilter,
    hasContent: "" as const,
    hasImages: "" as const,
  };
  const [items, hasContent, hasImages] = await Promise.all([
    countRows(db, segmentInput),
    countRows(db, { ...segmentInput, hasContent: "yes" }),
    countRows(db, { ...segmentInput, hasImages: "yes" }),
  ]);
  const subCounts = { ...EMPTY_SUB_COUNTS };

  await Promise.all(
    subCountFiltersForView(input.view).map(async (subFilter) => {
      const key = subCountKey(subFilter);
      if (!key) return;
      subCounts[key] = await countRows(db, {
        ...segmentInput,
        subFilter,
      });
    }),
  );

  return {
    items,
    hasContent,
    hasImages,
    subCounts,
  };
}

export async function listWatchListProjection(
  db: DB,
  input: WatchListProjectionQueryInput,
): Promise<WatchListResult> {
  const normalized = normalizeInput(input);
  const offset = (normalized.page - 1) * normalized.pageSize;
  const take = normalized.meta === "lite"
    ? normalized.pageSize + 1
    : normalized.pageSize;
  const shouldCount = normalized.withTotal || normalized.meta === "full";
  const [rows, exactTotal] = await Promise.all([
    dbOrTx(db).$queryRaw<Array<{ dataJson: unknown }>>(
      Prisma.sql`
        SELECT "dataJson"
        FROM "ProjectionRecord"
        WHERE ${whereSql(normalized)}
        ORDER BY ${orderBySql(normalized.sort)}
        LIMIT ${take}
        OFFSET ${offset}
      `,
    ),
    shouldCount ? countRows(db, normalized) : Promise.resolve(null),
  ]);
  const data = dataFromRows(rows);
  const hasNextPage = normalized.meta === "lite" && data.length > normalized.pageSize;
  const pageData = hasNextPage ? data.slice(0, normalized.pageSize) : data;
  const total = shouldCount
    ? exactTotal ?? 0
    : normalized.meta === "lite"
    ? offset + pageData.length + (hasNextPage ? 1 : 0)
    : await countRows(db, normalized);
  const [counts, summary] = normalized.meta === "full"
    ? await Promise.all([
      viewCounts(db, normalized),
      summaryCounts(db, normalized),
    ])
    : [undefined, undefined] as const;

  return {
    items: pageData.map((item) => ({
      ...item.row,
      ...(item.v2Row ? { v2Row: item.v2Row } : {}),
    })),
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
    totalPages: normalized.withTotal || normalized.meta === "full"
      ? Math.max(1, Math.ceil(total / normalized.pageSize))
      : Math.max(normalized.page, normalized.page + (hasNextPage ? 1 : 0)),
    counts: counts ?? (undefined as unknown as WatchListCounts),
    summary: summary ?? (undefined as unknown as WatchListResult["summary"]),
  };
}
