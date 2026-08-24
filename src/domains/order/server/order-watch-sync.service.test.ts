import assert from "node:assert/strict";
import test from "node:test";

import type { Prisma } from "@prisma/client";
import { syncWatchInventoryFromOrders } from "./order-watch-sync.service";

test("old completed sale cannot override a hold after posted buy-back", async () => {
  const boundary = new Date("2026-08-24T03:07:05.960Z");
  let orderWhere: Record<string, unknown> | null = null;
  const writes: string[] = [];
  const tx = {
    acquisitionItem: {
      findMany: async () => [{
        id: "buy-back-item",
        productId: "watch-1",
        createdAt: new Date("2026-08-24T03:06:42.288Z"),
        acquisition: { acquiredAt: boundary, sentAt: null, updatedAt: boundary },
      }],
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
        watch: { productId: "watch-1", saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "NOT_REQUIRED" },
      }),
      update: async () => { writes.push("product:HOLD"); },
    },
    watch: { update: async () => { writes.push("watch:HOLD/RESERVED"); } },
  } as unknown as Prisma.TransactionClient;

  await syncWatchInventoryFromOrders(tx, ["watch-1"]);

  assert.ok(orderWhere);
  assert.deepEqual((orderWhere as unknown as { OR: unknown[] }).OR, [
    { productId: "watch-1", createdAt: { gte: boundary } },
  ]);
  assert.deepEqual(writes, ["product:HOLD", "watch:HOLD/RESERVED"]);
});

test("products without a return boundary retain full order history", async () => {
  let orderWhere: Record<string, unknown> | null = null;
  const tx = {
    acquisitionItem: { findMany: async () => [] },
    orderItem: {
      findMany: async (input: { where: Record<string, unknown> }) => {
        orderWhere = input.where;
        return [];
      },
    },
    product: {
      findUnique: async () => null,
    },
  } as unknown as Prisma.TransactionClient;

  await syncWatchInventoryFromOrders(tx, ["watch-1"]);
  assert.ok(orderWhere);
  assert.deepEqual((orderWhere as unknown as { OR: unknown[] }).OR, [{ productId: "watch-1" }]);
});
