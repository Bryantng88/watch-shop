import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { normalizeWatchListView } from "../../../shared/watch-status";
import type {
  WatchListFilters,
  WatchListResult,
  WatchListSubFilter,
} from "../../../ui/list/types";
import { mapWatchRow } from "../../../ui/list/helpers";
import {
  buildWatchListBaseWhere,
  buildWatchListSegmentWhere,
  buildWatchListSubFilterWhere,
  buildWatchListWhere,
  mergeWatchWhere,
} from "./watch-list.query";

function toPositiveInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
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
  const text = String(value ?? "").trim().toUpperCase();

  const allowed: WatchListSubFilter[] = [
    "",
    "MISSING_CONTENT",
    "MISSING_IMAGE",
    "REVIEW_DRAFT",
    "REVIEW_SUBMITTED",
    "PARTIAL_APPROVED",
    "APPROVED",
    "POSTED",
  ];

  return allowed.includes(text as WatchListSubFilter)
    ? (text as WatchListSubFilter)
    : "";
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

export async function listAdminWatches(
  input: WatchListFilters
): Promise<WatchListResult> {
  const page = toPositiveInt(input.page, 1);
  const pageSize = toPositiveInt(input.pageSize, 20);
  const skip = (page - 1) * pageSize;

  const activeView = normalizeWatchListView(input.view);
  const activeSubFilter = sanitizeSubFilterForView(
    activeView,
    normalizeSubFilter(input.subFilter)
  );

  const normalizedInput: WatchListFilters = {
    ...input,
    subFilter: activeSubFilter,
  };

  const baseWhere = buildWatchListBaseWhere(normalizedInput);
  const segmentWhere = buildWatchListSegmentWhere(activeView);
  const listWhere = buildWatchListWhere(normalizedInput, activeView);
  const orderBy = buildSort(normalizedInput.sort);

  const currentSegmentWhere = mergeWatchWhere(baseWhere, segmentWhere);

  const buildCountWhere = (view: typeof activeView) =>
    mergeWatchWhere(baseWhere, buildWatchListSegmentWhere(view));

  const buildSubCountWhere = (subFilter: WatchListSubFilter) =>
    mergeWatchWhere(
      currentSegmentWhere,
      buildWatchListSubFilterWhere(subFilter)
    );

  const [
    rows,
    total,
    segmentTotal,
    draft,

    processing,
    ready,
    hold,
    sold,
    all,
    missingContent,
    missingImage,
    reviewDraft,
    reviewSubmitted,
    partialApproved,
    approved,
    posted,
  ] = await Promise.all([
    prisma.watch.findMany({
      where: listWhere,
      skip,
      take: pageSize,
      orderBy,
      include: {
        product: {
          include: {
            brand: true,
            vendor: true,
            productImage: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            serviceRequest: {
              include: {
                technicalIssue: true,
              },
            },
          },
        },
        watchSpecV2: true,
        watchPrice: true,
        watchContent: true,
        reviewStates: true,
      },
    }),

    prisma.watch.count({ where: listWhere }),
    prisma.watch.count({ where: currentSegmentWhere }),

    prisma.watch.count({ where: buildCountWhere("draft") }),
    prisma.watch.count({ where: buildCountWhere("processing") }),
    prisma.watch.count({ where: buildCountWhere("ready") }),
    prisma.watch.count({ where: buildCountWhere("hold") }),
    prisma.watch.count({ where: buildCountWhere("sold") }),
    prisma.watch.count({ where: buildCountWhere("all") }),

    prisma.watch.count({
      where: buildSubCountWhere("MISSING_CONTENT"),
    }),
    prisma.watch.count({
      where: buildSubCountWhere("MISSING_IMAGE"),
    }),
    prisma.watch.count({
      where: buildSubCountWhere("REVIEW_DRAFT"),
    }),
    prisma.watch.count({
      where: buildSubCountWhere("REVIEW_SUBMITTED"),
    }),
    prisma.watch.count({
      where: buildSubCountWhere("PARTIAL_APPROVED"),
    }),
    prisma.watch.count({
      where: buildSubCountWhere("APPROVED"),
    }),
    prisma.watch.count({
      where: buildSubCountWhere("POSTED"),
    }),
  ]);

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

  const users = actorIds.length
    ? await prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, email: true },
    })
    : [];

  const userMap = new Map(users.map((u) => [u.id, u]));

  const items = rows.map((row: any) =>
    mapWatchRow({
      ...row,
      __userMap: userMap,
    })
  );

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    counts: {
      draft,
      processing,
      ready,
      hold,
      sold,
      all,
    },
    summary: {
      items: segmentTotal,
      hasContent: 0,
      hasImages: 0,
      subCounts: {
        missingContent,
        missingImage,
        reviewDraft,
        reviewSubmitted,
        partialApproved,
        approved,
        posted,
      },
    },
  };
}