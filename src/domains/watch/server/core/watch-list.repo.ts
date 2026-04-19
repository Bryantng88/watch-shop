import type { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import prisma from "component for chatGPT/src/server/db/client";
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

function buildBaseProductWhere(input: WatchListFilters): Prisma.ProductWhereInput {
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

  return productIs;
}

function buildCommonWhere(input: WatchListFilters): Prisma.WatchWhereInput {
  const q = input.q?.trim();

  const where: Prisma.WatchWhereInput = {
    product: {
      is: buildBaseProductWhere(input),
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

  if (input.gender) where.gender = input.gender;
  if (input.siteChannel) where.siteChannel = input.siteChannel;
  if (input.saleStage) where.saleState = input.saleStage;
  if (input.opsStage) where.serviceState = input.opsStage;

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
    where.product = {
      is: {
        ...buildBaseProductWhere(input),
        productImage: {
          some: {
            role: "GALLERY",
          },
        },
      },
    };
  } else if (input.hasImages === "no") {
    where.product = {
      is: {
        ...buildBaseProductWhere(input),
        productImage: {
          none: {
            role: "GALLERY",
          },
        },
      },
    };
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
    where.AND = [
      ...(where.AND ?? []),
      {
        OR: [
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
        ],
      },
    ];
  }

  return where;
}

function buildReadinessWhere(view: string | undefined): Prisma.WatchWhereInput {
  if (view === "sold") {
    return {
      product: {
        is: {
          status: "SOLD",
        },
      },
    };
  }

  if (view === "hold") {
    return {
      product: {
        is: {
          status: {
            in: ["HOLD", "CONSIGNED_FROM", "CONSIGNED_TO"],
          },
        },
      },
    };
  }

  if (view === "draft") {
    return {
      AND: [
        {
          product: {
            is: {
              status: {
                notIn: ["SOLD", "HOLD", "CONSIGNED_FROM", "CONSIGNED_TO"],
              },
              productImage: {
                none: { role: "GALLERY" },
              },
            },
          },
        },
        {
          OR: [
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
          ],
        },
      ],
    };
  }

  if (view === "ready") {
    return {
      AND: [
        {
          product: {
            is: {
              status: {
                notIn: ["SOLD", "HOLD", "CONSIGNED_FROM", "CONSIGNED_TO"],
              },
              productImage: {
                some: { role: "GALLERY" },
              },
            },
          },
        },
        {
          watchContent: {
            is: {
              OR: [
                { body: { not: null } },
                { summary: { not: null } },
                { bulletSpecs: { isEmpty: false } },
              ],
            },
          },
        },
      ],
    };
  }

  if (view === "processing") {
    return {
      AND: [
        {
          product: {
            is: {
              status: {
                notIn: ["SOLD", "HOLD", "CONSIGNED_FROM", "CONSIGNED_TO"],
              },
            },
          },
        },
        {
          OR: [
            {
              product: {
                is: {
                  productImage: {
                    some: { role: "GALLERY" },
                  },
                },
              },
            },
            {
              watchContent: {
                is: {
                  OR: [
                    { body: { not: null } },
                    { summary: { not: null } },
                    { bulletSpecs: { isEmpty: false } },
                  ],
                },
              },
            },
          ],
        },
        {
          NOT: {
            AND: [
              {
                product: {
                  is: {
                    productImage: {
                      some: { role: "GALLERY" },
                    },
                  },
                },
              },
              {
                watchContent: {
                  is: {
                    OR: [
                      { body: { not: null } },
                      { summary: { not: null } },
                      { bulletSpecs: { isEmpty: false } },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    };
  }

  return {};
}

function buildWhere(input: WatchListFilters): Prisma.WatchWhereInput {
  const commonWhere = buildCommonWhere(input);
  const readinessWhere = buildReadinessWhere(input.view);

  if (!Object.keys(readinessWhere).length) {
    return commonWhere;
  }

  return {
    AND: [commonWhere, readinessWhere],
  };
}

async function countByView(client: ReturnType<typeof dbOrTx>, input: WatchListFilters, view: string) {
  return client.watch.count({
    where: buildWhere({ ...input, view }),
  });
}

export async function listAdminWatches(db: DB, input: WatchListFilters) {
  const client = dbOrTx(db);
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 30));
  const skip = (page - 1) * pageSize;

  const where = buildWhere(input);
  const orderBy = buildOrderBy(input.sort);

  const [items, total, draft, processing, ready, hold, sold, all] = await Promise.all([
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
            vendor: {
              select: {
                id: true,
                name: true,
              },
            },
            productImage: {
              select: {
                id: true,
                fileKey: true,
                role: true,
                isForAdmin: true,
                isForStorefront: true,
                sortOrder: true,
                createdAt: true,
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
          },
        },
        watchSpecV2: {
          select: {
            model: true,
            referenceNumber: true,
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
            minPrice: true,
          },
        },
        watchContent: {
          select: {
            body: true,
            summary: true,
            bulletSpecs: true,
          },
        },
      },
    }),
    client.watch.count({ where }),
    countByView(client, input, "draft"),
    countByView(client, input, "processing"),
    countByView(client, input, "ready"),
    countByView(client, input, "hold"),
    countByView(client, input, "sold"),
    countByView(client, input, "all"),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    counts: {
      draft,
      processing,
      ready,
      hold,
      sold,
      all,
    },
  };
}

export async function searchWatches(db: DB, q: string) {
  const client = dbOrTx(db);
  const keyword = q.trim();

  if (!keyword) return [];

  return client.watch.findMany({
    where: {
      AND: [
        { product: { is: { type: "WATCH" } } },
        {
          OR: [
            { product: { is: { title: { contains: keyword, mode: "insensitive" } } } },
            { product: { is: { sku: { contains: keyword, mode: "insensitive" } } } },
            { watchSpecV2: { is: { model: { contains: keyword, mode: "insensitive" } } } },
            { watchSpecV2: { is: { referenceNumber: { contains: keyword, mode: "insensitive" } } } },
          ],
        },
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
        },
      },
      watchSpecV2: {
        select: {
          model: true,
          referenceNumber: true,
        },
      },
    },
  });
}
