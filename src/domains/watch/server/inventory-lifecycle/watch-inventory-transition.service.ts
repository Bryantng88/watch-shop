import { Prisma, ProductStatus, WatchSaleStage, WatchStockStage } from "@prisma/client";

type Tx = Prisma.TransactionClient;
export type WatchInventoryCanonicalState = "AVAILABLE" | "HOLD" | "SOLD";

const CANONICAL_PATCH = {
  AVAILABLE: {
    productStatus: ProductStatus.AVAILABLE,
    saleStage: WatchSaleStage.READY,
    stockStage: WatchStockStage.IN_STOCK,
  },
  HOLD: {
    productStatus: ProductStatus.HOLD,
    saleStage: WatchSaleStage.HOLD,
    stockStage: WatchStockStage.RESERVED,
  },
  SOLD: {
    productStatus: ProductStatus.SOLD,
    saleStage: WatchSaleStage.SOLD,
    stockStage: WatchStockStage.OUT_OF_STOCK,
  },
} as const;

/** The only writer for the three sales-inventory fields used by lifecycle flows. */
export async function transitionWatchInventoryTx(
  tx: Tx,
  input: {
    productId: string;
    next: WatchInventoryCanonicalState;
    saleStageOverride?: WatchSaleStage;
    serviceStageOverride?: string | null;
  },
) {
  const current = await tx.watch.findUnique({
    where: { productId: input.productId },
    select: {
      productId: true,
      currentInventoryCycleId: true,
      saleStage: true,
      stockStage: true,
      serviceStage: true,
      product: { select: { status: true } },
    },
  });
  if (!current) return null;
  if (!current.currentInventoryCycleId) {
    throw new Error(`Watch ${input.productId} has no current inventory cycle.`);
  }

  const patch = CANONICAL_PATCH[input.next];
  const saleStage = input.saleStageOverride ?? patch.saleStage;
  const unchanged = current.product.status === patch.productStatus &&
    current.saleStage === saleStage && current.stockStage === patch.stockStage &&
    (input.serviceStageOverride == null || String(current.serviceStage) === input.serviceStageOverride);
  if (unchanged) return { changed: false, currentInventoryCycleId: current.currentInventoryCycleId };

  await tx.product.update({ where: { id: input.productId }, data: { status: patch.productStatus } });
  await tx.watch.update({
    where: { productId: input.productId },
    data: {
      saleStage,
      stockStage: patch.stockStage,
      ...(input.serviceStageOverride ? { serviceStage: input.serviceStageOverride as never } : {}),
    },
  });
  return { changed: true, currentInventoryCycleId: current.currentInventoryCycleId };
}
