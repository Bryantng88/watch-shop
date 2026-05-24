import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
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
  buildWatchListWhere,
  mergeWatchWhere,
} from "./watch-list.query";

type NormalizedWatchListInput = WatchListFilters & {
  view: ReturnType<typeof normalizeWatchListView>;
  subFilter: WatchListSubFilter;
  page: number;
  pageSize: number;
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

function toPositiveInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
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

function normalizeInput(input: WatchListFilters): NormalizedWatchListInput {
  const view = normalizeWatchListView(input.view);

  return {
    ...input,
    view,
    subFilter: sanitizeSubFilterForView(view, normalizeSubFilter(input.subFilter)),
    page: toPositiveInt(input.page, 1),
    pageSize: Math.min(toPositiveInt(input.pageSize, 20), 100),
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
function buildCountWhere(input: NormalizedWatchListInput, view: NormalizedWatchListInput["view"]) {
  return mergeWatchWhere(
    buildWatchListBaseWhere(input),
    buildWatchListSegmentWhere(view)
  );
}

function buildSubCountWhere(input: NormalizedWatchListInput, subFilter: WatchListSubFilter) {
  return mergeWatchWhere(
    buildCurrentSegmentWhere(input),
    buildWatchListSubFilterWhere(subFilter)
  );
}

function getSubFiltersForView(view: NormalizedWatchListInput["view"]): WatchListSubFilter[] {
  if (view === "processing") {
    return ["MISSING_CONTENT", "MISSING_IMAGE"];
  }

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

async function countListGalleryImages(productIds: string[]) {
  if (!productIds.length) return new Map<string, number>();

  const grouped = await prisma.productImage.groupBy({
    by: ["productId"],
    where: {
      productId: { in: productIds },
      role: { in: ["GALLERY"] as any },
    },
    _count: { _all: true },
  });

  return new Map(grouped.map((item) => [item.productId, item._count._all]));
}

async function getReviewActors(rows: any[]) {
  const actorIds = Array.from(
    new Set(
      rows
        .flatMap((row: any) =>
          (row.reviewStates ?? []).flatMap((state: any) => [
            state.reviewedById,
            state.submittedById,
          ])
        )
        .filter(Boolean)
    )
  );

  if (!actorIds.length) return new Map<string, any>();

  const users = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, name: true, email: true },
  });

  return new Map(users.map((user) => [user.id, user]));
}

async function getWatchListCounts(input: NormalizedWatchListInput): Promise<WatchListCounts> {
  const [draft, processing, ready, hold, sold, all] = await Promise.all([
    prisma.watch.count({ where: buildCountWhere(input, "draft") }),
    prisma.watch.count({ where: buildCountWhere(input, "processing") }),
    prisma.watch.count({ where: buildCountWhere(input, "ready") }),
    prisma.watch.count({ where: buildCountWhere(input, "hold") }),
    prisma.watch.count({ where: buildCountWhere(input, "sold") }),
    prisma.watch.count({ where: buildCountWhere(input, "all") }),
  ]);

  return { draft, processing, ready, hold, sold, all };
}

async function getWatchListSubCounts(
  input: NormalizedWatchListInput
): Promise<WatchListSubCounts> {
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

export async function listAdminWatches(
  input: WatchListFilters
): Promise<WatchListResult> {
  const normalizedInput = normalizeInput(input);
  const skip = (normalizedInput.page - 1) * normalizedInput.pageSize;
  const currentSegmentWhere = buildCurrentSegmentWhere(normalizedInput);
  const listWhere = buildCurrentListWhere(normalizedInput);
  const orderBy = buildSort(normalizedInput.sort);

  const [rows, total, segmentTotal, counts, subCounts, hasContent, hasImages] = await Promise.all([
    prisma.watch.findMany({
      where: listWhere,
      skip,
      take: normalizedInput.pageSize,
      orderBy,
      include: {
        product: {
          include: {
            brand: { select: { id: true, name: true } },
            vendor: { select: { id: true, name: true } },
            productImage: {
              where: { role: "INLINE" as any },
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
            serviceRequest: {
              select: {
                id: true,
                technicalIssue: {
                  select: { id: true, executionStatus: true },
                },
              },
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
      },
    }),
    prisma.watch.count({ where: listWhere }),
    prisma.watch.count({ where: currentSegmentWhere }),
    getWatchListCounts(normalizedInput),
    getWatchListSubCounts(normalizedInput),
    prisma.watch.count({
      where: buildWatchListSummaryWhere(currentSegmentWhere, "content"),
    }),
    prisma.watch.count({
      where: buildWatchListSummaryWhere(currentSegmentWhere, "image"),
    }),
  ]);

  const productIds = rows
    .map((row: any) => row.productId ?? row.product?.id)
    .filter(Boolean);

  const [imageCountMap, userMap] = await Promise.all([
    countListGalleryImages(productIds),
    getReviewActors(rows as any[]),
  ]);

  const items = rows.map((row: any) =>
    mapWatchRow({
      ...row,
      __imagesCount: imageCountMap.get(row.productId ?? row.product?.id) ?? 0,
      __userMap: userMap,
    })
  );

  return {
    items,
    total,
    page: normalizedInput.page,
    pageSize: normalizedInput.pageSize,
    totalPages: Math.max(1, Math.ceil(total / normalizedInput.pageSize)),
    counts,
    summary: {
      items: segmentTotal,
      hasContent,
      hasImages,
      subCounts,
    },
  };
}
