import type { Prisma } from "@prisma/client";

import type { WatchStatePatch, WatchStateSnapshot } from "./watch-state.types";

type Tx = Prisma.TransactionClient;

const WATCH_STATE_SELECT = {
  productId: true,
  saleStage: true,
  serviceStage: true,
  stockStage: true,
  product: {
    select: {
      id: true,
      status: true,
    },
  },
} satisfies Prisma.WatchSelect;
export async function getWatchStateSnapshotRepo(
  tx: Tx,
  productId: string
): Promise<WatchStateSnapshot | null> {
  return tx.watch.findUnique({
    where: { productId },
    select: WATCH_STATE_SELECT,
  });
}

export async function applyWatchStatePatchRepo(
  tx: Tx,
  productId: string,
  patch: WatchStatePatch
): Promise<WatchStateSnapshot> {
  if (patch.productStatus !== undefined) {
    await tx.product.update({
      where: { id: productId },
      data: {
        status: patch.productStatus,
        updatedAt: new Date(),
      },
    });
  }

  return tx.watch.update({
    where: { productId },
    data: {
      ...(patch.saleStage !== undefined ? { saleStage: patch.saleStage } : {}),
      ...(patch.serviceStage !== undefined
        ? { serviceStage: patch.serviceStage }
        : {}),
      ...(patch.stockStage !== undefined ? { stockStage: patch.stockStage } : {}),
      updatedAt: new Date(),
    },
    select: WATCH_STATE_SELECT,
  });
}
