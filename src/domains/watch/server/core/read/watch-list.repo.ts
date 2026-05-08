import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { normalizeWatchListView } from "../../../shared/watch-status";
import type { WatchListFilters, WatchListResult } from "../../../ui/list/types";
import { mapWatchRow } from "../../../ui/list/helpers";
import {
  buildWatchListBaseWhere,
  buildWatchListSegmentWhere,
  buildWatchListSummaryWhere,
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

export async function listAdminWatches(
  input: WatchListFilters
): Promise<WatchListResult> {
  const page = toPositiveInt(input.page, 1);
  const pageSize = toPositiveInt(input.pageSize, 20);
  const skip = (page - 1) * pageSize;
  const activeView = normalizeWatchListView(input.view);

  const baseWhere = buildWatchListBaseWhere(input);
  const listWhere = buildWatchListWhere(input, activeView);
  const orderBy = buildSort(input.sort);

  const buildCountWhere = (view: typeof activeView) =>
    mergeWatchWhere(baseWhere, buildWatchListSegmentWhere(view));

  const [
    rows,
    total,
    draft,
    processing,
    ready,
    hold,
    sold,
    all,
    hasContent,
    hasImages,
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
    prisma.watch.count({ where: buildCountWhere("draft") }),
    prisma.watch.count({ where: buildCountWhere("processing") }),
    prisma.watch.count({ where: buildCountWhere("ready") }),
    prisma.watch.count({ where: buildCountWhere("hold") }),
    prisma.watch.count({ where: buildCountWhere("sold") }),
    prisma.watch.count({ where: buildCountWhere("all") }),
    prisma.watch.count({ where: buildWatchListSummaryWhere(listWhere, "content") }),
    prisma.watch.count({ where: buildWatchListSummaryWhere(listWhere, "image") }),
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
      items: total,
      hasContent,
      hasImages,
    },
  };
}
