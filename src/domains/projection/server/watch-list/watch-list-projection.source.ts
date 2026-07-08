import { ImageRole, Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { WatchListProjectionSourceRow } from "./watch-list-projection.types";

const WATCH_LIST_SOURCE_SELECT = {
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
      brandId: true,
      vendorId: true,
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
        where: { role: { in: [ImageRole.INLINE, ImageRole.GALLERY] } },
        select: {
          id: true,
          role: true,
          fileKey: true,
          sortOrder: true,
          createdAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 4,
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

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function loadWatchListProjectionSourceRows(
  db: DB,
  input: {
    watchIds?: string[] | null;
    productIds?: string[] | null;
    limit?: number | null;
    offset?: number | null;
  } = {},
): Promise<WatchListProjectionSourceRow[]> {
  const client = dbOrTx(db);
  const watchIds = Array.from(new Set((input.watchIds ?? []).map(clean).filter(Boolean)));
  const productIds = Array.from(new Set((input.productIds ?? []).map(clean).filter(Boolean)));
  const limit = Math.min(1000, Math.max(1, Number(input.limit || 500)));
  const offset = Math.max(0, Number(input.offset || 0));

  const where: Prisma.WatchWhereInput = {
    ...(watchIds.length ? { id: { in: watchIds } } : {}),
    ...(productIds.length ? { productId: { in: productIds } } : {}),
  };

  const rows = await client.watch.findMany({
    where,
    select: WATCH_LIST_SOURCE_SELECT,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: offset,
    take: limit,
  });

  return rows as WatchListProjectionSourceRow[];
}

export async function resolveWatchIdsForProjectionTarget(
  db: DB,
  input: {
    targetType?: string | null;
    targetId?: string | null;
  },
) {
  const targetType = clean(input.targetType).toUpperCase();
  const targetId = clean(input.targetId);
  if (!targetId) return [];

  if (targetType === "WATCH") return [targetId];

  if (targetType === "PRODUCT") {
    const row = await dbOrTx(db).watch.findUnique({
      where: { productId: targetId },
      select: { id: true },
    });
    return row?.id ? [row.id] : [];
  }

  return [];
}
