import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

export async function createWatchDraftRepo(
  tx: Tx,
  input: {
    productId: string;
    acquisitionId?: string | null;
    gender?: any;
    siteChannel?: any;
    conditionGrade?: string | null;
    stockState?: string | null;
    saleState?: string | null;
    serviceState?: string | null;
    notes?: string | null;
  }
) {
  return tx.watch.create({
    data: {
      productId: input.productId,
      acquisitionId: input.acquisitionId ?? null,
      gender: input.gender ?? "MEN",
      siteChannel: input.siteChannel ?? "AFFORDABLE",
      conditionGrade: input.conditionGrade ?? null,
      stockState: input.stockState ?? "IN_STOCK",
      saleState: input.saleState ?? "DRAFT",
      serviceState: input.serviceState ?? "DRAFT",
      notes: input.notes ?? null,
      updatedAt: new Date(),
    } as any,
  });
}

export async function updateWatchCoreRepo(
  tx: Tx,
  productId: string,
  input: {
    gender?: any;
    siteChannel?: any;
    conditionGrade?: string | null;
    stockState?: string | null;
    saleState?: string | null;
    serviceState?: string | null;
    serialNumber?: string | null;
    yearText?: string | null;
    movementType?: any;
    movementCalibre?: string | null;
    hasBox?: boolean;
    hasPapers?: boolean;
    specStatus?: any;
    notes?: string | null;
  }
) {
  return tx.watch.update({
    where: { productId },
    data: {
      ...(input.gender !== undefined ? { gender: input.gender } : {}),
      ...(input.siteChannel !== undefined ? { siteChannel: input.siteChannel } : {}),
      ...(input.conditionGrade !== undefined
        ? { conditionGrade: input.conditionGrade ?? null }
        : {}),
      ...(input.stockState !== undefined ? { stockState: input.stockState ?? null } : {}),
      ...(input.saleState !== undefined ? { saleState: input.saleState ?? null } : {}),
      ...(input.serviceState !== undefined
        ? { serviceState: input.serviceState ?? null }
        : {}),
      ...(input.serialNumber !== undefined
        ? { serialNumber: input.serialNumber ?? null }
        : {}),
      ...(input.yearText !== undefined ? { yearText: input.yearText ?? null } : {}),
      ...(input.movementType !== undefined
        ? { movementType: input.movementType ?? null }
        : {}),
      ...(input.movementCalibre !== undefined
        ? { movementCalibre: input.movementCalibre ?? null }
        : {}),
      ...(input.hasBox !== undefined ? { hasBox: Boolean(input.hasBox) } : {}),
      ...(input.hasPapers !== undefined ? { hasPapers: Boolean(input.hasPapers) } : {}),
      ...(input.specStatus !== undefined ? { specStatus: input.specStatus } : {}),
      ...(input.notes !== undefined ? { notes: input.notes ?? null } : {}),
      updatedAt: new Date(),
    } as any,
  });
}

export async function removeWatchRepo(tx: Tx, productId: string) {
  return tx.watch.delete({
    where: { productId },
  });
}

export async function upsertWatchPriceRepo(
  tx: Tx,
  watchId: string,
  input: {
    costPrice?: number | null;
    salePrice?: number | null;
    listPrice?: number | null;
    minPrice?: number | null;
  }
) {
  return tx.watchPrice.upsert({
    where: { watchId },
    create: {
      watchId,
      costPrice: input.costPrice ?? null,
      salePrice: input.salePrice ?? null,
      listPrice: input.listPrice ?? null,
      minPrice: input.minPrice ?? null,
      updatedAt: new Date(),
    } as any,
    update: {
      ...(input.costPrice !== undefined ? { costPrice: input.costPrice ?? null } : {}),
      ...(input.salePrice !== undefined ? { salePrice: input.salePrice ?? null } : {}),
      ...(input.listPrice !== undefined ? { listPrice: input.listPrice ?? null } : {}),
      ...(input.minPrice !== undefined ? { minPrice: input.minPrice ?? null } : {}),
      updatedAt: new Date(),
    } as any,
  });
}

export async function getWatchForDerivedRepo(tx: Tx, productId: string) {
  return tx.watch.findUnique({
    where: { productId },
    include: {
      product: {
        include: {
          brand: true,
        },
      },
      watchSpecV2: true,
    },
  });
}

export async function listProductSkusByPrefixRepo(
  tx: Tx,
  prefix: string,
  datePart: string
) {
  const base = `${prefix}-${datePart}`;

  return tx.product.findMany({
    where: {
      sku: {
        startsWith: `${base}-`,
      },
    },
    select: {
      sku: true,
    },
    orderBy: {
      sku: "desc",
    },
  });
}

export async function updateProductTitleSkuRepo(
  tx: Tx,
  input: {
    productId: string;
    title: string;
    sku?: string;
    brandId?: string | null;
  }
) {
  return tx.product.update({
    where: { id: input.productId },
    data: {
      title: input.title,
      ...(input.sku ? { sku: input.sku } : {}),
      ...(input.brandId ? { brandId: input.brandId } : {}),
    },
  });
}