import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import type {
  WatchListFilters,
  WatchListResult,
  WatchListView,
} from "../../ui/list/types";
import { mapWatchRow } from "../../ui/list/helpers";

function toPositiveInt(value: any, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function buildBaseWhere(input: WatchListFilters): Prisma.WatchWhereInput {
  const and: Prisma.WatchWhereInput[] = [];

  if (input.q?.trim()) {
    const q = input.q.trim();

    and.push({
      OR: [
        {
          product: {
            is: {
              title: { contains: q, mode: "insensitive" },
            },
          },
        },
        {
          product: {
            is: {
              brand: {
                is: {
                  name: { contains: q, mode: "insensitive" },
                },
              },
            },
          },
        },
        {
          watchSpecV2: {
            is: {
              model: { contains: q, mode: "insensitive" },
            },
          },
        },
        {
          watchSpecV2: {
            is: {
              referenceNumber: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
        },
        {
          product: {
            is: {
              sku: { contains: q, mode: "insensitive" },
            },
          },
        },
      ],
    });
  }

  if (input.sku?.trim()) {
    and.push({
      product: {
        is: {
          sku: {
            contains: input.sku.trim(),
            mode: "insensitive",
          },
        },
      },
    });
  }

  if (input.brandId) {
    and.push({
      product: {
        is: {
          brandId: input.brandId,
        },
      },
    });
  }

  if (input.vendorId) {
    and.push({
      product: {
        is: {
          vendorId: input.vendorId,
        },
      },
    });
  }

  return and.length ? { AND: and } : {};
}

function buildSegmentWhere(view?: WatchListView): Prisma.WatchWhereInput {
  switch (view) {
    case "draft":
      return {
        OR: [
          { serviceState: "DRAFT" as any },
          { saleState: "DRAFT" as any },
        ],
      };

    case "processing":
      return {
        OR: [
          { serviceState: "IN_PROGRESS" as any },
          { stockState: "PROCESSING" as any },
          { saleState: "PROCESSING" as any },
        ],
      };

    case "ready":
      return {
        saleState: "READY" as any,
      };

    case "hold":
      return {
        saleState: "HOLD" as any,
      };

    case "sold":
      return {
        saleState: "SOLD" as any,
      };

    case "all":
    default:
      return {};
  }
}

function buildSort(sort?: string): Prisma.WatchOrderByWithRelationInput[] {
  switch (sort) {
    case "updated_asc":
      return [{ updatedAt: "asc" }];
    case "title_asc":
      return [{ product: { title: "asc" } }];
    case "title_desc":
      return [{ product: { title: "desc" } }];
    case "price_desc":
      return [{ watchPrice: { salePrice: "desc" } }];
    case "price_asc":
      return [{ watchPrice: { salePrice: "asc" } }];
    case "updated_desc":
    default:
      return [{ updatedAt: "desc" }];
  }
}

function mergeWhere(
  baseWhere: Prisma.WatchWhereInput,
  segmentWhere: Prisma.WatchWhereInput
): Prisma.WatchWhereInput {
  const hasBase = Object.keys(baseWhere).length > 0;
  const hasSegment = Object.keys(segmentWhere).length > 0;

  if (hasBase && hasSegment) {
    return {
      AND: [baseWhere, segmentWhere],
    };
  }

  if (hasBase) return baseWhere;
  if (hasSegment) return segmentWhere;
  return {};
}

export async function listAdminWatches(
  input: WatchListFilters
): Promise<WatchListResult> {
  const page = toPositiveInt(input.page, 1);
  const pageSize = toPositiveInt(input.pageSize, 20);
  const skip = (page - 1) * pageSize;

  const baseWhere = buildBaseWhere(input);
  const listWhere = mergeWhere(baseWhere, buildSegmentWhere(input.view));
  const orderBy = buildSort(input.sort);

  const [rows, total, draft, processing, ready, hold, sold, all, hasContent, hasImages] =
    await Promise.all([
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
            },
          },
          watchSpecV2: true,
          watchPrice: true,
          watchContent: true,
        },
      }),

      prisma.watch.count({
        where: listWhere,
      }),

      prisma.watch.count({
        where: mergeWhere(baseWhere, buildSegmentWhere("draft")),
      }),

      prisma.watch.count({
        where: mergeWhere(baseWhere, buildSegmentWhere("processing")),
      }),

      prisma.watch.count({
        where: mergeWhere(baseWhere, buildSegmentWhere("ready")),
      }),

      prisma.watch.count({
        where: mergeWhere(baseWhere, buildSegmentWhere("hold")),
      }),

      prisma.watch.count({
        where: mergeWhere(baseWhere, buildSegmentWhere("sold")),
      }),

      prisma.watch.count({
        where: baseWhere,
      }),

      prisma.watch.count({
        where: {
          AND: [
            listWhere,
            {
              watchContent: {
                is: {
                  OR: [
                    { hookText: { not: null } },
                    { body: { not: null } },
                    { summary: { not: null } },
                    { bulletSpecs: { isEmpty: false } },
                  ],
                },
              },
            },
          ],
        },
      }),

      prisma.watch.count({
        where: {
          AND: [
            listWhere,
            {
              product: {
                is: {
                  productImage: {
                    some: {},
                  },
                },
              },
            },
          ],
        },
      }),
    ]);

  const items = rows.map(mapWatchRow);

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