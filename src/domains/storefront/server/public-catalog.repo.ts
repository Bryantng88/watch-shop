import {
  ContentStatus,
  ProductStatus,
  ProductType,
  WatchSaleStage,
  WatchServiceStage,
  WatchStockStage,
  type Prisma,
} from "@prisma/client";

import { dbOrTx, type DB } from "@/server/db/client";
import type { PublicCatalogQuery } from "../contracts";

const publicImageSelect = {
  id: true,
  fileKey: true,
  alt: true,
  width: true,
  height: true,
} satisfies Prisma.ProductImageSelect;

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
    where: { isForStorefront: true, fileKey: { not: "" } },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: publicImageSelect,
    take: 1,
  },
} satisfies Prisma.ProductSelect;

export const publicWatchDetailSelect = {
  ...publicWatchCoreSelect,
  productImage: {
    where: { isForStorefront: true, fileKey: { not: "" } },
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

export function publicWatchEligibilityWhere(): Prisma.ProductWhereInput {
  return {
    AND: [
      {
        type: ProductType.WATCH,
        status: ProductStatus.AVAILABLE,
        slug: { not: "" },
        publishedAt: { not: null },
        contentStatus: ContentStatus.PUBLISHED,
        productImage: {
          some: {
            isForStorefront: true,
            fileKey: { not: "" },
          },
        },
        watch: {
          is: {
            saleStage: WatchSaleStage.READY,
            stockStage: WatchStockStage.IN_STOCK,
            serviceStage: {
              in: [WatchServiceStage.NOT_REQUIRED, WatchServiceStage.DONE],
            },
            watchContent: {
              is: { contentStatus: ContentStatus.PUBLISHED },
            },
          },
        },
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

  if (query.audience) {
    and.push({ watch: { is: { audienceSegment: query.audience } } });
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
    return [{ watch: { watchPrice: { salePrice: "asc" } } }, { id: "asc" }];
  }
  if (sort === "PRICE_DESC") {
    return [{ watch: { watchPrice: { salePrice: "desc" } } }, { id: "asc" }];
  }
  return [{ updatedAt: "desc" }, { id: "desc" }];
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
        publicWatchEligibilityWhere(),
        { id: { in: productIds }, priceVisibility: "SHOW" },
      ],
    },
    select: { id: true },
  });
  return rows.map((row) => row.id);
}
