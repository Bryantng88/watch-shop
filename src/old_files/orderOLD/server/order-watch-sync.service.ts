import {
  OrderStatus,
  Prisma,
  ProductStatus,
  WatchSaleState,
  WatchStockState,
} from "@prisma/client";

import {
  ORDER_ACTIVE_HOLD_STATUSES,
  ORDER_ACTIVE_SOLD_STATUSES,
} from "../shared/order-status";

type Tx = Prisma.TransactionClient;

type InventoryEffect = "READY" | "HOLD" | "SOLD";

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
      Order: {
        status: {
          not: OrderStatus.CANCELLED,
        },
      },
    },
    select: {
      productId: true,
      Order: {
        select: {
          status: true,
        },
      },
    },
  });

  for (const productId of ids) map.set(productId, "READY");

  for (const row of rows) {
    if (!row.productId) continue;

    const status = row.Order?.status;

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

async function applyInventoryEffect(tx: Tx, productId: string, effect: InventoryEffect) {
  const current = await tx.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      status: true,
      watch: {
        select: {
          productId: true,
          saleState: true,
          stockState: true,
          serviceState: true,
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
        saleState: WatchSaleState.SOLD,
        stockState: WatchStockState.OUT_OF_STOCK,
      },
    });

    return;
  }

  if (effect === "HOLD") {
    if (
      current.status === ProductStatus.SOLD ||
      current.status === ProductStatus.CONSIGNED_TO ||
      current.status === ProductStatus.IN_SERVICE ||
      current.status === ProductStatus.NEED_SERVICE ||
      current.watch.saleState === WatchSaleState.SOLD ||
      current.watch.saleState === WatchSaleState.CONSIGNED_TO ||
      current.watch.saleState === WatchSaleState.IN_SERVICE
    ) {
      return;
    }

    await tx.product.update({
      where: { id: productId },
      data: { status: ProductStatus.HOLD },
    });

    await tx.watch.update({
      where: { productId },
      data: {
        saleState: WatchSaleState.HOLD,
        stockState: WatchStockState.RESERVED,
      },
    });

    return;
  }

  // READY: chỉ release những watch đang HOLD do order. Không đụng service/consign/sold.
  if (
    current.status === ProductStatus.HOLD &&
    current.watch.saleState === WatchSaleState.HOLD
  ) {
    await tx.product.update({
      where: { id: productId },
      data: { status: ProductStatus.AVAILABLE },
    });

    await tx.watch.update({
      where: { productId },
      data: {
        saleState: WatchSaleState.READY,
        stockState: WatchStockState.IN_STOCK,
      },
    });
  }
}

export async function syncWatchInventoryFromOrders(
  tx: Tx,
  productIds: Array<string | null | undefined>,
) {
  const ids = uniqueClean(productIds);
  if (!ids.length) return { count: 0 };

  const effectByProductId = await resolveEffectByProductId(tx, ids);

  for (const productId of ids) {
    await applyInventoryEffect(tx, productId, effectByProductId.get(productId) ?? "READY");
  }

  return { count: ids.length };
}

export async function syncWatchInventoryFromOrderId(tx: Tx, orderId: string) {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: { productId: true },
  });

  return syncWatchInventoryFromOrders(
    tx,
    items.map((item) => item.productId),
  );
}
