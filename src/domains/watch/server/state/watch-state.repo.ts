import type { Prisma } from "@prisma/client";

import type { WatchStatePatch, WatchStateSnapshot } from "./watch-state.types";

type Tx = Prisma.TransactionClient;

const WATCH_STATE_SELECT = {
  productId: true,
  saleState: true,
  serviceState: true,
  stockState: true,
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
      ...(patch.saleState !== undefined ? { saleState: patch.saleState } : {}),
      ...(patch.serviceState !== undefined
        ? { serviceState: patch.serviceState }
        : {}),
      ...(patch.stockState !== undefined ? { stockState: patch.stockState } : {}),
      updatedAt: new Date(),
    },
    select: WATCH_STATE_SELECT,
  });
}
