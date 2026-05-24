import {
  OrderStatus,
  Prisma,
  ProductStatus,
  WatchSaleStage,
  WatchStockStage,
} from "@prisma/client";

import {
  ORDER_ACTIVE_HOLD_STATUSES,
  ORDER_ACTIVE_SOLD_STATUSES,
} from "../shared/order-status";

type Tx = Prisma.TransactionClient;

type InventoryEffect = "RESTORE" | "HOLD" | "SOLD";

type Snapshot = {
  productStatus?: ProductStatus | null;
  saleStage?: WatchSaleStage | null;
  stockStage?: WatchStockStage | null;
  serviceStage?: string | null;
};

function uniqueClean(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  );
}

async function resolveEffectByProductId(tx: Tx, productIds: string[]) {
  const map = new Map<string, InventoryEffect>();
  const ids = uniqueClean(productIds);

  if (!ids.length) return map;

  const rows = await tx.orderItem.findMany({
    where: {
      productId: { in: ids },
      order: {
        status: {
          not: OrderStatus.CANCELLED,
        },
      },
    },
    select: {
      productId: true,
      order: {
        select: {
          status: true,
        },
      },
    },
  });

  for (const productId of ids) map.set(productId, "RESTORE");

  for (const row of rows) {
    if (!row.productId) continue;

    const status = row.order?.status;

    if ((ORDER_ACTIVE_SOLD_STATUSES as readonly string[]).includes(status)) {
      map.set(row.productId, "SOLD");
      continue;
    }

    const current = map.get(row.productId);
    if (
      current !== "SOLD" &&
      (ORDER_ACTIVE_HOLD_STATUSES as readonly string[]).includes(status)
    ) {
      map.set(row.productId, "HOLD");
    }
  }

  return map;
}

async function getSnapshotFromOrderItem(
  tx: Tx,
  input: { orderId?: string | null; productId: string },
): Promise<Snapshot | null> {
  if (!input.orderId) return null;

  const row = await tx.orderItem.findFirst({
    where: {
      orderId: input.orderId,
      productId: input.productId,
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      previousProductStatus: true,
      previousSaleStage: true,
      previousStockStage: true,
      previousServiceStage: true,
    } as any,
  } as any);

  if (!row) return null;

  return {
    productStatus: (row as any).previousProductStatus ?? null,
    saleStage: (row as any).previousSaleStage ?? null,
    stockStage: (row as any).previousStockStage ?? null,
    serviceStage: (row as any).previousServiceStage ?? null,
  };
}

async function applyInventoryEffect(
  tx: Tx,
  productId: string,
  effect: InventoryEffect,
  opts?: { restoreFromOrderId?: string | null },
) {
  const current = await tx.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      status: true,
      watch: {
        select: {
          productId: true,
          saleStage: true,
          stockStage: true,
          serviceStage: true,
        },
      },
    },
  });

  if (!current?.watch) return;

  if (effect === "SOLD") {
    await tx.product.update({
      where: { id: productId },
      data: { status: ProductStatus.SOLD },
    });

    await tx.watch.update({
      where: { productId },
      data: {
        saleStage: WatchSaleStage.SOLD,
        stockStage: WatchStockStage.OUT_OF_STOCK,
      },
    });

    return;
  }

  if (effect === "HOLD") {
    await tx.product.update({
      where: { id: productId },
      data: { status: ProductStatus.HOLD },
    });

    await tx.watch.update({
      where: { productId },
      data: {
        saleStage: WatchSaleStage.HOLD,
        stockStage: WatchStockStage.RESERVED,
      },
    });

    return;
  }

  const snapshot = await getSnapshotFromOrderItem(tx, {
    orderId: opts?.restoreFromOrderId ?? null,
    productId,
  });

  await tx.product.update({
    where: { id: productId },
    data: {
      status: snapshot?.productStatus ?? ProductStatus.AVAILABLE,
    },
  });

  await tx.watch.update({
    where: { productId },
    data: {
      saleStage: snapshot?.saleStage ?? WatchSaleStage.READY,
      stockStage: snapshot?.stockStage ?? WatchStockStage.IN_STOCK,
      ...(snapshot?.serviceStage
        ? { serviceStage: snapshot.serviceStage as any }
        : {}),
    },
  });
}

export async function syncWatchInventoryFromOrders(
  tx: Tx,
  productIds: Array<string | null | undefined>,
) {
  const ids = uniqueClean(productIds);
  if (!ids.length) return { count: 0 };

  const effectByProductId = await resolveEffectByProductId(tx, ids);

  for (const productId of ids) {
    await applyInventoryEffect(
      tx,
      productId,
      effectByProductId.get(productId) ?? "RESTORE",
    );
  }

  return { count: ids.length };
}

export async function syncWatchInventoryFromOrderId(tx: Tx, orderId: string) {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: { productId: true },
  });

  const ids = uniqueClean(items.map((item) => item.productId));
  const effectByProductId = await resolveEffectByProductId(tx, ids);

  for (const productId of ids) {
    await applyInventoryEffect(
      tx,
      productId,
      effectByProductId.get(productId) ?? "RESTORE",
      { restoreFromOrderId: orderId },
    );
  }

  return { count: ids.length };
}
