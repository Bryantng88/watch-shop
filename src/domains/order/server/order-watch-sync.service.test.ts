import assert from "node:assert/strict";
import test from "node:test";

import type { Prisma } from "@prisma/client";
import { syncWatchInventoryFromOrders } from "./order-watch-sync.service";

function currentCycleWatch() {
  return {
    productId: "watch-1",
    currentInventoryCycleId: "cycle-current",
    createdAt: new Date("2026-08-24T03:07:05.960Z"),
  };
}

test("old completed sale cannot override a hold in the current buy-back cycle", async () => {
  let orderWhere: Record<string, unknown> | null = null;
  const writes: Array<{ target: string; data: Record<string, unknown> }> = [];
  const tx = {
    watch: {
      findMany: async () => [currentCycleWatch()],
      findUnique: async () => ({
        productId: "watch-1",
        currentInventoryCycleId: "cycle-current",
        saleStage: "READY",
        stockStage: "IN_STOCK",
        serviceStage: "NOT_REQUIRED",
        product: { status: "AVAILABLE" },
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => {
        writes.push({ target: "watch", data });
      },
    },
    orderItem: {
      findMany: async (input: { where: Record<string, unknown> }) => {
        orderWhere = input.where;
        return [{ productId: "watch-1", order: { status: "POSTED" } }];
      },
    },
    product: {
      findUnique: async () => ({
        id: "watch-1",
        status: "AVAILABLE",
        watch: {
          productId: "watch-1",
          saleStage: "READY",
          stockStage: "IN_STOCK",
          serviceStage: "NOT_REQUIRED",
        },
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => {
        writes.push({ target: "product", data });
      },
    },
  } as unknown as Prisma.TransactionClient;

  await syncWatchInventoryFromOrders(tx, ["watch-1"]);

  assert.ok(orderWhere);
  assert.deepEqual(orderWhere, {
    productId: { in: ["watch-1"] },
    inventoryCycleId: { in: ["cycle-current"] },
    order: { status: { not: "CANCELLED" } },
  });
  assert.deepEqual(writes, [
    { target: "product", data: { status: "HOLD" } },
    { target: "watch", data: { saleStage: "HOLD", stockStage: "RESERVED" } },
  ]);
});

test("order reconciliation only reads the current inventory cycle", async () => {
  let orderWhere: Record<string, unknown> | null = null;
  const tx = {
    watch: { findMany: async () => [currentCycleWatch()] },
    orderItem: {
      findMany: async (input: { where: Record<string, unknown> }) => {
        orderWhere = input.where;
        return [];
      },
    },
    product: { findUnique: async () => null },
  } as unknown as Prisma.TransactionClient;

  await syncWatchInventoryFromOrders(tx, ["watch-1"]);

  assert.ok(orderWhere);
  assert.deepEqual(orderWhere, {
    productId: { in: ["watch-1"] },
    inventoryCycleId: { in: ["cycle-current"] },
    order: { status: { not: "CANCELLED" } },
  });
});
