import { ImageRole, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { perfStep } from "@/lib/server-perf";
import { normalizeWatchListView } from "../../shared/watch-status";
import type {
  WatchListCounts,
  WatchListFilters,
  WatchListResult,
  WatchListSubCounts,
  WatchListSubFilter,
} from "../../ui/list/types";
import { mapWatchRow } from "../../ui/list/helpers";
import {
  buildWatchListBaseWhere,
  buildWatchListSegmentWhere,
  buildWatchListSubFilterWhere,
  buildWatchListSummaryWhere,
  mergeWatchWhere,
  WATCH_LIST_THUMBNAIL_IMAGE_ROLES,
} from "./watch-list.query";

type WatchListMetaMode = "full" | "lite";

type NormalizedWatchListInput = WatchListFilters & {
  view: ReturnType<typeof normalizeWatchListView>;
  subFilter: WatchListSubFilter;
  page: number;
  pageSize: number;
  meta: WatchListMetaMode;
  withTotal: boolean;
};

type WatchListRawRow = Prisma.WatchGetPayload<{
  select: typeof WATCH_LIST_ROW_SELECT;
}>;

type ServiceRequestPreview = Prisma.ServiceRequestGetPayload<{
  select: typeof SERVICE_REQUEST_PREVIEW_SELECT;
}>;

type ListImagePreview = {
  id: string;
  productId: string;
  role: ImageRole | string;
  fileKey: string;
  sortOrder: number;
  createdAt: Date;
};

type UserPreview = {
  id: string;
  name: string | null;
  email: string | null;
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

type CacheItem<T> = { expiresAt: number; value: T | Promise<T> };
const COUNT_CACHE_TTL_MS = 30_000;
const countCache = new Map<string, CacheItem<unknown>>();

export function invalidateWatchListCountCache() {
  countCache.clear();
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const input = value as Record<string, unknown>;
  return `{${Object.keys(input)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(input[key])}`)
    .join(",")}}`;
}

async function getCachedCountValue<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = countCache.get(key) as CacheItem<T> | undefined;
  if (cached && cached.expiresAt > now) return cached.value;

  const pending = loader().catch((error) => {
    countCache.delete(key);
    throw error;
  });
  countCache.set(key, { value: pending, expiresAt: now + COUNT_CACHE_TTL_MS });

  const value = await pending;
  countCache.set(key, { value, expiresAt: Date.now() + COUNT_CACHE_TTL_MS });
  return value;
}

function buildCountCacheKey(name: string, input: NormalizedWatchListInput, extra?: unknown) {
  const baseInput = {
    q: input.q ?? "",
    sku: input.sku ?? "",
    brandId: input.brandId ?? "",
    vendorId: input.vendorId ?? "",
    hasContent: input.hasContent ?? "",
    hasImages: input.hasImages ?? "",
    saleStage: input.saleStage ?? "",
    opsStage: input.opsStage ?? "",
    duplicateScope: input.duplicateScope ?? "ACTIVE",
  };

  return `${name}:${stableStringify(baseInput)}:${stableStringify(extra ?? {})}`;
}

/**
 * List page chỉ cần dữ liệu hiển thị trực tiếp trên bảng.
 * Những relation nặng như acquisition siblings / service issues được bulk-load ở dưới
 * để tránh Prisma tạo 1 query include quá sâu cho mỗi lần load list.
 */
const WATCH_LIST_ROW_SELECT = {
  id: true,
  productId: true,
  saleStage: true,
  serviceStage: true,
  stockStage: true,
  conditionGrade: true,
  specStatus: true,
  isContentDownloaded: true,
  isImageDownloaded: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      title: true,
      sku: true,
      slug: true,
      brand: { select: { id: true, name: true } },
      vendor: { select: { id: true, name: true } },
      postTargets: {
        orderBy: { createdAt: "asc" },
        select: {
          createdAt: true,
          postTargetId: true,
          postTarget: {
            select: {
              id: true,
              name: true,
              platform: true,
            },
          },
        },
      },
      productImage: {
        where: { role: { in: [...WATCH_LIST_THUMBNAIL_IMAGE_ROLES] as ImageRole[] } },
        select: {
          id: true,
          role: true,
          fileKey: true,
          sortOrder: true,
          createdAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
      },
    },
  },
  watchSpecV2: {
    select: {
      id: true,
      brand: true,
      model: true,
      referenceNumber: true,
    },
  },
  watchPrice: {
    select: {
      salePrice: true,
      listPrice: true,
      costPrice: true,
      minPrice: true,
    },
  },
  watchContent: {
    select: {
      id: true,
      titleOverride: true,
      hookText: true,
      body: true,
      summary: true,
      bulletSpecs: true,
    },
  },
  reviewStates: {
    select: {
      id: true,
      targetType: true,
      status: true,
      reviewedAt: true,
      reviewedById: true,
      submittedAt: true,
      submittedById: true,
    },
  },
} satisfies Prisma.WatchSelect;

const SERVICE_REQUEST_PREVIEW_SELECT = {
  id: true,
  productId: true,
  technicalIssue: {
    select: {
      id: true,
      executionStatus: true,
    },
  },
} satisfies Prisma.ServiceRequestSelect;

function toPositiveInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean).map(String)));
}

function buildSort(sort?: string): Prisma.WatchOrderByWithRelationInput[] {
  switch (sort) {
    case "updated_asc":
    case "updatedAsc":
      return [{ updatedAt: "asc" }];

    case "created_asc":
    case "createdAsc":
      return [{ createdAt: "asc" }];

    case "created_desc":
    case "createdDesc":
      return [{ createdAt: "desc" }];

    case "price_asc":
    case "priceAsc":
      return [{ watchPrice: { salePrice: "asc" } }, { updatedAt: "desc" }];

    case "price_desc":
    case "priceDesc":
      return [{ watchPrice: { salePrice: "desc" } }, { updatedAt: "desc" }];

    case "title_asc":
    case "titleAsc":
      return [{ product: { title: "asc" } }];

    case "title_desc":
    case "titleDesc":
      return [{ product: { title: "desc" } }];

    default:
      return [{ updatedAt: "desc" }];
  }
}

function normalizeSubFilter(value: unknown): WatchListSubFilter {
  const text = normalizeText(value).toUpperCase();

  const aliasMap: Record<string, WatchListSubFilter> = {
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

  return aliasMap[text] ?? "";
}

function sanitizeSubFilterForView(
  view: ReturnType<typeof normalizeWatchListView>,
  subFilter: WatchListSubFilter
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

function normalizeMetaMode(input: WatchListFilters): WatchListMetaMode {
  const value = String(input.meta ?? "full").trim().toLowerCase();
  return value === "lite" ? "lite" : "full";
}

function normalizeInput(input: WatchListFilters): NormalizedWatchListInput {
  const view = normalizeWatchListView(input.view);
  const withTotal =
    input.withTotal === true ||
    String(input.withTotal ?? "").trim().toLowerCase() === "true";

  return {
    ...input,
    view,
    subFilter: sanitizeSubFilterForView(view, normalizeSubFilter(input.subFilter)),
    page: toPositiveInt(input.page, 1),
    pageSize: Math.min(toPositiveInt(input.pageSize, 20), 100),
    meta: normalizeMetaMode(input),
    withTotal,
  };
}

function buildCurrentSegmentWhere(input: NormalizedWatchListInput) {
  return mergeWatchWhere(
    buildWatchListBaseWhere(input),
    buildWatchListSegmentWhere(input.view)
  );
}

function buildCurrentListWhere(input: NormalizedWatchListInput) {
  return mergeWatchWhere(
    buildCurrentSegmentWhere(input),
    buildWatchListSubFilterWhere(input.subFilter)
  );
}

function buildSubCountWhere(input: NormalizedWatchListInput, subFilter: WatchListSubFilter) {
  return mergeWatchWhere(
    buildCurrentSegmentWhere(input),
    buildWatchListSubFilterWhere(subFilter)
  );
}

function getSubFiltersForView(view: NormalizedWatchListInput["view"]): WatchListSubFilter[] {
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

function subFilterToSummaryKey(subFilter: WatchListSubFilter): keyof WatchListSubCounts | null {
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

async function getListImageMap(productIds: string[], options?: { exactGalleryCount?: boolean }) {
  const result = new Map<string, { images: ListImagePreview[]; galleryCount: number }>();
  if (!productIds.length) return result;

  const shouldLoadExactGalleryCount = Boolean(options?.exactGalleryCount);
  const [galleryCounts, inlineRows, galleryRows] = await Promise.all([
    shouldLoadExactGalleryCount
      ? prisma.productImage.groupBy({
        by: ["productId"],
        where: {
          productId: { in: productIds },
          role: ImageRole.GALLERY,
        },
        _count: { _all: true },
      })
      : Promise.resolve(null),
    prisma.$queryRaw<ListImagePreview[]>`
      SELECT DISTINCT ON ("productId")
        "id",
        "productId",
        "role",
        "fileKey",
        "sortOrder",
        "createdAt"
      FROM "ProductImage"
      WHERE "productId" IN (${Prisma.join(productIds)})
        AND "role" = ${ImageRole.INLINE}::"ImageRole"
      ORDER BY
        "productId",
        "sortOrder",
        "createdAt"
    `,
    prisma.$queryRaw<ListImagePreview[]>`
      SELECT DISTINCT ON ("productId")
        "id",
        "productId",
        "role",
        "fileKey",
        "sortOrder",
        "createdAt"
      FROM "ProductImage"
      WHERE "productId" IN (${Prisma.join(productIds)})
        AND "role" = ${ImageRole.GALLERY}::"ImageRole"
      ORDER BY
        "productId",
        "sortOrder",
        "createdAt"
    `,
  ]);

  for (const item of galleryCounts ?? []) {
    result.set(item.productId, {
      images: [],
      galleryCount: item._count._all,
    });
  }

  for (const row of galleryRows) {
    const current = result.get(row.productId) ?? { images: [], galleryCount: 0 };
    if (!shouldLoadExactGalleryCount) current.galleryCount = 1;
    current.images.push(row);
    result.set(row.productId, current);
  }

  for (const row of inlineRows) {
    const current = result.get(row.productId) ?? { images: [], galleryCount: 0 };
    current.images = [row];
    result.set(row.productId, current);
  }

  return result;
}

async function getReviewActors(rows: WatchListRawRow[]): Promise<Map<string, UserPreview>> {
  const actorIds = uniqueStrings(
    rows.flatMap((row) =>
      (row.reviewStates ?? []).flatMap((state) => [
        state.reviewedById,
        state.submittedById,
      ])
    )
  );

  if (!actorIds.length) return new Map<string, UserPreview>();

  const users = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, name: true, email: true },
  });

  return new Map(users.map((user) => [user.id, user]));
}

async function getWatchListCounts(input: NormalizedWatchListInput): Promise<WatchListCounts> {
  return getCachedCountValue(
    buildCountCacheKey("watch-list-counts", input),
    async () => {
      const baseWhere = buildWatchListBaseWhere(input);
      const grouped = await prisma.watch.groupBy({
        by: ["saleStage"],
        where: baseWhere,
        _count: { _all: true },
      });

      const result: WatchListCounts = { ...EMPTY_COUNTS };
      for (const item of grouped) {
        const key = String(item.saleStage ?? "").toLowerCase() as keyof WatchListCounts;
        if (key in result) result[key] = item._count._all;
        result.all += item._count._all;
      }

      return result;
    }
  );
}

async function getWatchListSubCounts(
  input: NormalizedWatchListInput
): Promise<WatchListSubCounts> {
  return getCachedCountValue(
    buildCountCacheKey("watch-list-sub-counts", input, { view: input.view }),
    async () => {
      const targets = getSubFiltersForView(input.view);
      if (!targets.length) return { ...EMPTY_SUB_COUNTS };

      const values = await Promise.all(
        targets.map((subFilter) =>
          prisma.watch.count({ where: buildSubCountWhere(input, subFilter) })
        )
      );

      const result = { ...EMPTY_SUB_COUNTS };

      targets.forEach((subFilter, index) => {
        const key = subFilterToSummaryKey(subFilter);
        if (key) result[key] = values[index] ?? 0;
      });

      return result;
    }
  );
}

async function getWatchListSummary(input: NormalizedWatchListInput, currentSegmentWhere: Prisma.WatchWhereInput) {
  return getCachedCountValue(
    buildCountCacheKey("watch-list-summary", input, { view: input.view }),
    async () => {
      const [segmentTotal, hasContent, hasImages] = await Promise.all([
        prisma.watch.count({ where: currentSegmentWhere }),
        prisma.watch.count({
          where: buildWatchListSummaryWhere(currentSegmentWhere, "content"),
        }),
        prisma.watch.count({
          where: buildWatchListSummaryWhere(currentSegmentWhere, "image"),
        }),
      ]);

      return { segmentTotal, hasContent, hasImages };
    }
  );
}

async function getServiceRequestMap(productIds: string[]) {
  const result = new Map<string, ServiceRequestPreview[]>();
  if (!productIds.length) return result;

  const serviceRequests = await prisma.serviceRequest.findMany({
    where: { productId: { in: productIds } },
    select: SERVICE_REQUEST_PREVIEW_SELECT,
  });

  for (const request of serviceRequests) {
    const productId = String(request.productId ?? "");
    if (!productId) continue;

    const current = result.get(productId) ?? [];
    current.push(request);
    result.set(productId, current);
  }

  return result;
}

function attachBulkLoadedRelations(
  row: WatchListRawRow,
  input: {
    imageMap: Map<string, { images: ListImagePreview[]; galleryCount: number }>;
    serviceRequestMap: Map<string, ServiceRequestPreview[]>;
  }
) {
  const productId = String(row.productId ?? row.product?.id ?? "");
  const imageInfo = input.imageMap.get(productId);

  return {
    ...row,
    __imagesCount: imageInfo?.galleryCount ?? 0,
    product: row.product
      ? {
        ...row.product,
        productImage: imageInfo?.images ?? row.product.productImage ?? [],
        serviceRequest: input.serviceRequestMap.get(productId) ?? [],
      }
      : row.product,
  };
}

export async function listAdminWatches(
  input: WatchListFilters
): Promise<WatchListResult> {
  const normalizedInput = normalizeInput(input);
  const skip = (normalizedInput.page - 1) * normalizedInput.pageSize;
  const currentSegmentWhere = buildCurrentSegmentWhere(normalizedInput);
  const listWhere = buildCurrentListWhere(normalizedInput);
  const orderBy = buildSort(normalizedInput.sort);

  const shouldLoadMeta = normalizedInput.meta === "full";
  const shouldLoadTotal = shouldLoadMeta || normalizedInput.withTotal;
  const rowTake = shouldLoadMeta
    ? normalizedInput.pageSize
    : normalizedInput.pageSize + 1;

  const [rawRows, total, summaryMeta, counts, subCounts] = await Promise.all([
    perfStep("watch-list-repo", "watchFindMany", () =>
      prisma.watch.findMany({
        where: listWhere,
        skip,
        take: rowTake,
        orderBy,
        select: WATCH_LIST_ROW_SELECT,
      })
    ),
    shouldLoadTotal
      ? perfStep("watch-list-repo", "watchCount", () =>
        prisma.watch.count({ where: listWhere })
      )
      : Promise.resolve(null),
    shouldLoadMeta
      ? perfStep("watch-list-repo", "summaryCounts", () =>
        getWatchListSummary(normalizedInput, currentSegmentWhere)
      )
      : Promise.resolve(null),
    shouldLoadMeta
      ? perfStep("watch-list-repo", "viewCounts", () =>
        getWatchListCounts(normalizedInput)
      )
      : Promise.resolve(null),
    shouldLoadMeta
      ? perfStep("watch-list-repo", "subCounts", () =>
        getWatchListSubCounts(normalizedInput)
      )
      : Promise.resolve(null),
  ]);

  const hasNextPage = !shouldLoadMeta && rawRows.length > normalizedInput.pageSize;
  const rows = hasNextPage ? rawRows.slice(0, normalizedInput.pageSize) : rawRows;
  const liteTotal = skip + rows.length + (hasNextPage ? 1 : 0);
  const resolvedTotal = total ?? liteTotal;

  const productIds = uniqueStrings(
    rows.map((row) => row.productId ?? row.product?.id)
  );

  const [imageMap, userMap, serviceRequestMap] = await Promise.all([
    shouldLoadMeta
      ? perfStep("watch-list-repo", "imagePreview", () =>
        getListImageMap(productIds, { exactGalleryCount: true })
      )
      : Promise.resolve(new Map<string, { images: ListImagePreview[]; galleryCount: number }>()),
    shouldLoadMeta
      ? perfStep("watch-list-repo", "reviewActors", () =>
        getReviewActors(rows)
      )
      : Promise.resolve(new Map<string, UserPreview>()),
    shouldLoadMeta
      ? perfStep("watch-list-repo", "servicePreview", () =>
        getServiceRequestMap(productIds)
      )
      : Promise.resolve(new Map<string, ServiceRequestPreview[]>()),
  ]);

  const items = rows.map((row) => {
    const enrichedRow = attachBulkLoadedRelations(row, {
      imageMap,
      serviceRequestMap,
    });

    return mapWatchRow({
      ...enrichedRow,
      __userMap: userMap,
    });
  });

  return {
    items,
    total: resolvedTotal,
    page: normalizedInput.page,
    pageSize: normalizedInput.pageSize,
    totalPages: shouldLoadTotal
      ? Math.max(1, Math.ceil(resolvedTotal / normalizedInput.pageSize))
      : Math.max(normalizedInput.page, normalizedInput.page + (hasNextPage ? 1 : 0)),
    counts: counts ?? (undefined as unknown as WatchListCounts),
    summary: summaryMeta
      ? {
        items: summaryMeta.segmentTotal,
        hasContent: summaryMeta.hasContent,
        hasImages: summaryMeta.hasImages,
        subCounts: subCounts ?? { ...EMPTY_SUB_COUNTS },
      }
      : (undefined as unknown as WatchListResult["summary"]),
  };
}
