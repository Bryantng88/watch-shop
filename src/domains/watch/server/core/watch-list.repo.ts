import type { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type { WatchListFilters } from "../shared";

function buildOrderBy(sort?: string): Prisma.WatchOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ product: { createdAt: "asc" } }];
    case "priceAsc":
      return [{ price: { salePrice: "asc" } }, { product: { updatedAt: "desc" } }];
    case "priceDesc":
      return [{ price: { salePrice: "desc" } }, { product: { updatedAt: "desc" } }];
    case "titleAsc":
      return [{ product: { title: "asc" } }];
    default:
      return [{ product: { updatedAt: "desc" } }];
  }
}

function buildWhere(input: WatchListFilters): Prisma.WatchWhereInput {
  const q = input.q?.trim();
  const where: Prisma.WatchWhereInput = {
    product: {
      type: "WATCH",
    },
  };

  const productWhere = where.product as Prisma.ProductRelationFilter;

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

  if (q) {
    where.OR = [
      { product: { is: { title: { contains: q, mode: "insensitive" } } } },
      { product: { is: { sku: { contains: q, mode: "insensitive" } } } },
      { specV2: { is: { model: { contains: q, mode: "insensitive" } } } },
      { specV2: { is: { referenceNumber: { contains: q, mode: "insensitive" } } } },
      { specV2: { is: { nickname: { contains: q, mode: "insensitive" } } } },
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
    where.specV2 = {
      is: {
        OR: [
          { primaryCaseMaterial: input.materialFamily },
          { secondaryCaseMaterial: input.materialFamily },
        ],
      },
    };
  }

  if (input.hasImages === "yes") {
    where.mediaV2 = { some: {} };
  } else if (input.hasImages === "no") {
    where.mediaV2 = { none: {} };
  }

  if (input.hasContent === "yes") {
    where.contentV2 = {
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
      { contentV2: { is: null } },
      {
        contentV2: {
          is: {
            body: null,
            summary: null,
            bulletSpecs: { isEmpty: true },
          },
        },
      },
    ];
  }

  if (input.view === "draft") {
    productIs.status = "DRAFT";
  } else if (input.view === "sold") {
    productIs.status = "SOLD";
  }

  productWhere.is = productIs;

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
        specV2: {
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
        price: {
          select: {
            salePrice: true,
            listPrice: true,
            costPrice: true,
          },
        },
        contentV2: {
          select: {
            body: true,
            summary: true,
            bulletSpecs: true,
          },
        },
        mediaV2: {
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
        { specV2: { is: { model: { contains: keyword, mode: "insensitive" } } } },
        { specV2: { is: { referenceNumber: { contains: keyword, mode: "insensitive" } } } },
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
      price: {
        select: {
          salePrice: true,
        },
      },
    },
  });
}