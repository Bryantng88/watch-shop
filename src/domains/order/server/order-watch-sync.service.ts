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
import {
  ensureCurrentInventoryCycles,
  transitionWatchInventoryTx,
} from "@/domains/watch/server/inventory-lifecycle";

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

  const currentCycles = await ensureCurrentInventoryCycles(tx, ids);
  const cycleIds = Array.from(currentCycles.values());
  const rows = await tx.orderItem.findMany({
    where: {
      productId: { in: ids },
      inventoryCycleId: { in: cycleIds },
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
    },
  });

  if (!row) return null;

  return {
    productStatus: row.previousProductStatus ?? null,
    saleStage: row.previousSaleStage ?? null,
    stockStage: row.previousStockStage ?? null,
    serviceStage: row.previousServiceStage ?? null,
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
    await transitionWatchInventoryTx(tx, { productId, next: "SOLD" });
    return;
  }

  if (effect === "HOLD") {
    await transitionWatchInventoryTx(tx, { productId, next: "HOLD" });
    return;
  }

  const snapshot = await getSnapshotFromOrderItem(tx, {
    orderId: opts?.restoreFromOrderId ?? null,
    productId,
  });

  await transitionWatchInventoryTx(tx, {
    productId,
    next: "AVAILABLE",
    saleStageOverride: snapshot?.saleStage ?? WatchSaleStage.READY,
    serviceStageOverride: snapshot?.serviceStage ?? null,
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
