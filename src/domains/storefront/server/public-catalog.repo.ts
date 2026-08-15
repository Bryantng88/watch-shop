import {
  ImageRole,
  ProductStatus,
  ProductType,
  WatchSaleStage,
  WatchReviewStatus,
  WatchReviewTargetType,
  WatchServiceStage,
  WatchStockStage,
  type Prisma,
} from "@prisma/client";

import { dbOrTx, type DB } from "@/server/db/client";
import type { PublicCatalogQuery } from "../contracts";

const publicImageSelect = {
  id: true,
  fileKey: true,
  role: true,
  alt: true,
  width: true,
  height: true,
} satisfies Prisma.ProductImageSelect;

export function storefrontCoverImageRequired(
  configured = process.env.STOREFRONT_REQUIRE_COVER_IMAGE,
) {
  return configured !== "0";
}

export function localStorefrontCoverBypassEnabled(
  nodeEnv = process.env.NODE_ENV,
  configured = process.env.LOCAL_STOREFRONT_COVER_BYPASS,
) {
  return nodeEnv === "development" && configured === "1";
}

function storefrontImageWhere(requireCoverImage: boolean): Prisma.ProductImageWhereInput {
  return {
    isForStorefront: true,
    fileKey: { not: "" },
    ...(requireCoverImage ? { role: ImageRole.COVER } : {}),
  };
}

const publicWatchCoreSelect = {
  id: true,
  slug: true,
  title: true,
  priceVisibility: true,
  tag: true,
  updatedAt: true,
  brand: { select: { name: true } },
  watch: {
    select: {
      saleStage: true,
      style: true,
      isCollectible: true,
      stockStage: true,
      audienceSegment: true,
      conditionGrade: true,
      watchPrice: {
        select: {
          salePrice: true,
        },
      },
      watchContent: {
        select: {
          titleOverride: true,
          summary: true,
          bulletSpecs: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      watchSpecV2: {
        select: {
          model: true,
          referenceNumber: true,
          caseShape: true,
          caseSizeMM: true,
          primaryCaseMaterial: true,
          dialColor: true,
          dialFinish: true,
          crystal: true,
          movementType: true,
          calibre: true,
          powerReserve: true,
          waterResistance: true,
          braceletType: true,
          strapMaterialText: true,
          buckleType: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export const publicWatchListSelect = {
  ...publicWatchCoreSelect,
  productImage: {
    where: {
      isForStorefront: true,
      fileKey: { not: "" },
      role: { in: [ImageRole.COVER, ImageRole.GALLERY] },
    },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: publicImageSelect,
    take: 2,
  },
} satisfies Prisma.ProductSelect;

export const publicWatchDetailSelect = {
  ...publicWatchCoreSelect,
  productImage: {
    where: {
      isForStorefront: true,
      fileKey: { not: "" },
      role: { in: [ImageRole.COVER, ImageRole.GALLERY] },
    },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: publicImageSelect,
    take: 24,
  },
} satisfies Prisma.ProductSelect;

export type PublicWatchListRow = Prisma.ProductGetPayload<{
  select: typeof publicWatchListSelect;
}>;

export type PublicWatchDetailRow = Prisma.ProductGetPayload<{
  select: typeof publicWatchDetailSelect;
}>;

export function publicWatchEligibilityWhere(options?: {
  requireCoverImage?: boolean;
}): Prisma.ProductWhereInput {
  const enforceCover = options?.requireCoverImage ?? storefrontCoverImageRequired();
  if (localStorefrontCoverBypassEnabled()) {
    return {
      type: ProductType.WATCH,
      slug: { not: "" },
      productImage: {
        some: storefrontImageWhere(true),
      },
    };
  }
  return {
    AND: [
      {
        type: ProductType.WATCH,
        slug: { not: "" },
        productImage: {
          some: storefrontImageWhere(enforceCover),
        },
        AND: [
          {
            OR: [
              { storefrontVisible: null },
              { storefrontVisible: true },
            ],
          },
          {
            OR: [
              { storefrontVisible: true },
              {
                status: { in: [ProductStatus.AVAILABLE, ProductStatus.HOLD, ProductStatus.SOLD] },
                watch: {
                  is: {
                    saleStage: { in: [WatchSaleStage.READY, WatchSaleStage.HOLD, WatchSaleStage.SOLD] },
                    serviceStage: {
                      in: [WatchServiceStage.NOT_REQUIRED, WatchServiceStage.DONE],
                    },
                    AND: [
                      {
                        reviewStates: {
                          some: {
                            targetType: WatchReviewTargetType.CONTENT,
                            status: WatchReviewStatus.APPROVED,
                          },
                        },
                      },
                      {
                        reviewStates: {
                          some: {
                            targetType: WatchReviewTargetType.IMAGE,
                            status: WatchReviewStatus.APPROVED,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        OR: [
          { priceVisibility: "HIDE" },
          { watch: { is: { watchPrice: { is: { salePrice: { gt: 0 } } } } } },
        ],
      },
    ],
  };
}

export function publicWatchOrderableWhere(): Prisma.ProductWhereInput {
  return {
    AND: [
      publicWatchEligibilityWhere(),
      {
        status: ProductStatus.AVAILABLE,
        watch: {
          is: {
            saleStage: WatchSaleStage.READY,
            stockStage: WatchStockStage.IN_STOCK,
          },
        },
      },
    ],
  };
}

function publicWatchFilterWhere(query: PublicCatalogQuery): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [publicWatchEligibilityWhere()];

  if (query.q) {
    and.push({
      OR: [
        { title: { contains: query.q, mode: "insensitive" } },
        { brand: { is: { name: { contains: query.q, mode: "insensitive" } } } },
        {
          watch: {
            is: {
              watchSpecV2: {
                is: {
                  referenceNumber: { contains: query.q, mode: "insensitive" },
                },
              },
            },
          },
        },
      ],
    });
  }

  if (query.brand) {
    and.push({ brand: { is: { slug: query.brand } } });
  }

  if (query.style) {
    and.push({ watch: { is: { style: query.style } } });
  }

  if (query.audience) {
    and.push({ watch: { is: { audienceSegment: query.audience } } });
  }

  if (query.collection === "COLLECTIBLE") {
    and.push({ watch: { is: { isCollectible: true } } });
  }

  if (query.movement) {
    and.push({ watch: { is: { watchSpecV2: { is: { movementType: query.movement } } } } });
  }

  if (query.caseMaterial) {
    and.push({ watch: { is: { watchSpecV2: { is: { primaryCaseMaterial: query.caseMaterial } } } } });
  }

  if (query.strapType) {
    and.push({ watch: { is: { watchSpecV2: { is: { braceletType: query.strapType } } } } });
  }

  if (query.size) {
    and.push({
      watch: {
        is: {
          watchSpecV2: {
            is: {
              caseSizeMM: query.size === "SMALL"
                ? { lt: 34 }
                : query.size === "MEDIUM"
                  ? { gte: 34, lte: 38 }
                  : { gt: 38 },
            },
          },
        },
      },
    });
  }

  if (query.priceMin !== undefined || query.priceMax !== undefined) {
    and.push({
      priceVisibility: "SHOW",
      watch: {
        is: {
          watchPrice: {
            is: {
              salePrice: {
                ...(query.priceMin !== undefined ? { gte: query.priceMin } : {}),
                ...(query.priceMax !== undefined ? { lte: query.priceMax } : {}),
              },
            },
          },
        },
      },
    });
  }

  return { AND: and };
}

function publicWatchOrderBy(sort: PublicCatalogQuery["sort"]): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "PRICE_ASC") {
    return [{ watch: { saleStage: "asc" } }, { watch: { watchPrice: { salePrice: "asc" } } }, { id: "asc" }];
  }
  if (sort === "PRICE_DESC") {
    return [{ watch: { saleStage: "asc" } }, { watch: { watchPrice: { salePrice: "desc" } } }, { id: "asc" }];
  }
  return [{ watch: { saleStage: "asc" } }, { updatedAt: "desc" }, { id: "desc" }];
}

export async function listPublicWatchRows(
  db: DB,
  query: PublicCatalogQuery,
  cursorProductId: string | null,
) {
  return dbOrTx(db).product.findMany({
    where: publicWatchFilterWhere(query),
    orderBy: publicWatchOrderBy(query.sort),
    ...(cursorProductId ? { cursor: { id: cursorProductId }, skip: 1 } : {}),
    take: query.limit + 1,
    select: publicWatchListSelect,
  });
}

export async function findPublicWatchRowBySlug(db: DB, slug: string) {
  return dbOrTx(db).product.findFirst({
    where: {
      AND: [publicWatchEligibilityWhere(), { slug }],
    },
    select: publicWatchDetailSelect,
  });
}

export async function findOrderablePublicWatchIds(db: DB, productIds: string[]) {
  const rows = await dbOrTx(db).product.findMany({
    where: {
      AND: [
        publicWatchOrderableWhere(),
        { id: { in: productIds }, priceVisibility: "SHOW" },
      ],
    },
    select: { id: true },
  });
  return rows.map((row) => row.id);
}

export async function listPublicCatalogFacetRows(db: DB) {
  return dbOrTx(db).product.findMany({
    where: publicWatchEligibilityWhere(),
    select: {
      priceVisibility: true,
      brand: { select: { slug: true, name: true } },
      watch: {
        select: {
          saleStage: true,
          style: true,
          watchPrice: { select: { salePrice: true } },
          watchSpecV2: { select: { caseSizeMM: true, movementType: true, primaryCaseMaterial: true, braceletType: true } },
        },
      },
    },
  });
}
