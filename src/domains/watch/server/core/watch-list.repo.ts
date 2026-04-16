import type { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import { WatchListFilters } from "../shared/watch.types";


function buildOrderBy(sort?: string): Prisma.WatchOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ product: { createdAt: "asc" } }];
    case "priceAsc":
      return [{ watchPrice: { salePrice: "asc" } }, { product: { updatedAt: "desc" } }];
    case "priceDesc":
      return [{ watchPrice: { salePrice: "desc" } }, { product: { updatedAt: "desc" } }];
    case "titleAsc":
      return [{ product: { title: "asc" } }];
    default:
      return [{ product: { updatedAt: "desc" } }];
  }
}

function buildWhere(input: WatchListFilters): Prisma.WatchWhereInput {
  const q = input.q?.trim();

  const productIs: Prisma.ProductWhereInput = {
    type: "WATCH",
  };

  if (input.brandIds?.length) {
    productIs.brandId = { in: input.brandIds };
  }

  if (input.vendorId) {
    productIs.vendorId = input.vendorId;
  }

  if (input.sku?.trim()) {
    productIs.sku = {
      contains: input.sku.trim(),
      mode: "insensitive",
    };
  }

  if (input.updatedFrom || input.updatedTo) {
    productIs.updatedAt = {
      ...(input.updatedFrom ? { gte: input.updatedFrom } : {}),
      ...(input.updatedTo ? { lte: input.updatedTo } : {}),
    };
  }

  if (input.view === "draft") {
    productIs.contentStatus = "DRAFT";
  } else if (input.view === "sold") {
    productIs.status = "SOLD";
  }

  const where: Prisma.WatchWhereInput = {
    product: {
      is: productIs,
    },
  };

  if (q) {
    where.OR = [
      { product: { is: { title: { contains: q, mode: "insensitive" } } } },
      { product: { is: { sku: { contains: q, mode: "insensitive" } } } },
      { watchSpecV2: { is: { model: { contains: q, mode: "insensitive" } } } },
      { watchSpecV2: { is: { referenceNumber: { contains: q, mode: "insensitive" } } } },
      { watchSpecV2: { is: { nickname: { contains: q, mode: "insensitive" } } } },
    ];
  }

  if (input.gender) {
    where.gender = input.gender;
  }

  if (input.siteChannel) {
    where.siteChannel = input.siteChannel;
  }

  if (input.saleStage) {
    where.saleState = input.saleStage;
  }

  if (input.opsStage) {
    where.serviceState = input.opsStage;
  }

  if (input.materialFamily) {
    where.watchSpecV2 = {
      is: {
        OR: [
          { primaryCaseMaterial: input.materialFamily },
          { secondaryCaseMaterial: input.materialFamily },
        ],
      },
    };
  }

  if (input.hasImages === "yes") {
    where.watchMedia = { some: {} };
  } else if (input.hasImages === "no") {
    where.watchMedia = { none: {} };
  }

  if (input.hasContent === "yes") {
    where.watchContent = {
      is: {
        OR: [
          { body: { not: null } },
          { summary: { not: null } },
          { bulletSpecs: { isEmpty: false } },
        ],
      },
    };
  } else if (input.hasContent === "no") {
    where.OR = [
      ...(where.OR ?? []),
      { watchContent: { is: null } },
      {
        watchContent: {
          is: {
            body: null,
            summary: null,
            bulletSpecs: { isEmpty: true },
          },
        },
      },
    ];
  }

  return where;
}
export async function listAdminWatches(db: DB, input: WatchListFilters) {
  const client = dbOrTx(db);
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 30));
  const skip = (page - 1) * pageSize;

  const where = buildWhere(input);
  const orderBy = buildOrderBy(input.sort);

  const [items, total] = await Promise.all([
    client.watch.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        product: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        watchSpecV2: {
          select: {
            primaryCaseMaterial: true,
            secondaryCaseMaterial: true,
            materialProfile: true,
            goldTreatment: true,
            goldColors: true,
            goldKarat: true,
            brand: true,
          },
        },
        watchPrice: {
          select: {
            salePrice: true,
            listPrice: true,
            costPrice: true,
          },
        },
        watchContent: {
          select: {
            body: true,
            summary: true,
            bulletSpecs: true,
          },
        },
        watchMedia: {
          select: {
            id: true,
          },
        },
      },
    }),
    client.watch.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function searchWatches(db: DB, q: string) {
  const client = dbOrTx(db);
  const keyword = q.trim();

  if (!keyword) return [];

  return client.watch.findMany({
    where: {
      product: {
        is: {
          type: "WATCH",
        },
      },
      OR: [
        { product: { is: { title: { contains: keyword, mode: "insensitive" } } } },
        { product: { is: { sku: { contains: keyword, mode: "insensitive" } } } },
        { watchSpecV2: { is: { model: { contains: keyword, mode: "insensitive" } } } },
        { watchSpecV2: { is: { referenceNumber: { contains: keyword, mode: "insensitive" } } } },
      ],
    },
    take: 20,
    orderBy: [{ product: { updatedAt: "desc" } }],
    include: {
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          status: true,
        },
      },
      watchPrice: {
        select: {
          salePrice: true,
        },
      },
    },
  });
}