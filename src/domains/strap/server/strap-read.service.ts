import { prisma } from "@/server/db/client";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import { listProjectionRecords } from "@/domains/projection/server/projection-record.repo";
import {
  STRAP_LIST_PROJECTION_KEY,
  STRAP_LIST_PROJECTION_VERSION,
  type StrapListProjectionRow,
} from "@/domains/projection/server/strap-list";

export async function listStraps() {
  await ensureProjectionReady(prisma, STRAP_LIST_PROJECTION_KEY);
  const records = await listProjectionRecords(prisma, {
    projectionKey: STRAP_LIST_PROJECTION_KEY,
    projectionVersion: STRAP_LIST_PROJECTION_VERSION,
    limit: 500,
  });
  return records.map((record) => record.dataJson as StrapListProjectionRow);
}

export async function listAvailableClasps() {
  return prisma.productVariant.findMany({
    where: {
      stockQty: { gt: 0 },
      Product: { type: "WATCH_CLASP" },
      ClaspVariantSpec: { isNot: null },
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      sku: true,
      stockQty: true,
      Product: { select: { title: true } },
      ClaspVariantSpec: true,
    },
  });
}

export async function getStrapDetail(variantId: string) {
  const id = String(variantId ?? "").trim();
  if (!id) return null;
  return prisma.productVariant.findUnique({
    where: { id },
    select: {
      id: true,
      sku: true,
      stockQty: true,
      price: true,
      costPrice: true,
      availabilityStatus: true,
      updatedAt: true,
      Product: {
        select: {
          id: true,
          title: true,
          status: true,
          primaryImageUrl: true,
          brand: { select: { name: true } },
          vendor: { select: { name: true } },
        },
      },
      StrapVariantSpec: true,
      strapInstallations: {
        orderBy: { installedAt: "desc" },
        take: 20,
        select: {
          id: true,
          ownershipMode: true,
          installedAt: true,
          removedAt: true,
          installedFullLinks: true,
          installedHalfLinks: true,
          spareFullLinks: true,
          spareHalfLinks: true,
          endLinkCount: true,
          wristSizeMM: true,
          note: true,
          watch: {
            select: {
              id: true,
              productId: true,
              product: { select: { title: true, sku: true } },
            },
          },
        },
      },
      strapMovements: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export async function listStrapCatalogOptions() {
  return prisma.strapCatalogOption.findMany({
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}
