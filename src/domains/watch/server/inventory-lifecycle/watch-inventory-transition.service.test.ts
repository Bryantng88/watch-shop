import assert from "node:assert/strict";
import test from "node:test";
import type { Prisma } from "@prisma/client";
import { transitionWatchInventoryTx } from "./watch-inventory-transition.service";

test("HOLD transition updates Product and Watch as one canonical triple", async () => {
  const writes: Array<{ target: string; data: Record<string, unknown> }> = [];
  const tx = {
    watch: {
      findUnique: async () => ({
        productId: "product-1", currentInventoryCycleId: "cycle-1",
        saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "NOT_REQUIRED",
        product: { status: "AVAILABLE" },
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ target: "watch", data }); },
    },
    product: {
      update: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ target: "product", data }); },
    },
  } as unknown as Prisma.TransactionClient;

  const result = await transitionWatchInventoryTx(tx, { productId: "product-1", next: "HOLD" });
  assert.equal(result?.changed, true);
  assert.deepEqual(writes, [
    { target: "product", data: { status: "HOLD" } },
    { target: "watch", data: { saleStage: "HOLD", stockStage: "RESERVED" } },
  ]);
});

test("canonical transition is idempotent", async () => {
  let writes = 0;
  const tx = {
    watch: {
      findUnique: async () => ({
        productId: "product-1", currentInventoryCycleId: "cycle-1",
        saleStage: "SOLD", stockStage: "OUT_OF_STOCK", serviceStage: "NOT_REQUIRED",
        product: { status: "SOLD" },
      }),
      update: async () => { writes += 1; },
    },
    product: { update: async () => { writes += 1; } },
  } as unknown as Prisma.TransactionClient;
  const result = await transitionWatchInventoryTx(tx, { productId: "product-1", next: "SOLD" });
  assert.equal(result?.changed, false);
  assert.equal(writes, 0);
});

test("transition refuses a Watch without lifecycle identity", async () => {
  const tx = {
    watch: { findUnique: async () => ({ productId: "product-1", currentInventoryCycleId: null, saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "NOT_REQUIRED", product: { status: "AVAILABLE" } }) },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(() => transitionWatchInventoryTx(tx, { productId: "product-1", next: "HOLD" }), /no current inventory cycle/);
});

test("AVAILABLE preserves the IN_SERVICE overlay while service remains active", async () => {
  const writes: Array<{ target: string; data: Record<string, unknown> }> = [];
  const tx = {
    watch: {
      findUnique: async () => ({
        productId: "product-1", currentInventoryCycleId: "cycle-1",
        saleStage: "HOLD", stockStage: "RESERVED", serviceStage: "IN_SERVICE",
        product: { status: "HOLD" },
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ target: "watch", data }); },
    },
    product: {
      update: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ target: "product", data }); },
    },
  } as unknown as Prisma.TransactionClient;

  await transitionWatchInventoryTx(tx, { productId: "product-1", next: "AVAILABLE" });

  assert.deepEqual(writes, [
    { target: "product", data: { status: "IN_SERVICE" } },
    { target: "watch", data: { saleStage: "READY", stockStage: "IN_STOCK" } },
  ]);
});

test("AVAILABLE clears the service overlay when the workflow marks service done", async () => {
  const writes: Array<{ target: string; data: Record<string, unknown> }> = [];
  const tx = {
    watch: {
      findUnique: async () => ({
        productId: "product-1", currentInventoryCycleId: "cycle-1",
        saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "IN_SERVICE",
        product: { status: "IN_SERVICE" },
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ target: "watch", data }); },
    },
    product: {
      update: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ target: "product", data }); },
    },
  } as unknown as Prisma.TransactionClient;

  await transitionWatchInventoryTx(tx, {
    productId: "product-1",
    next: "AVAILABLE",
    serviceStageOverride: "DONE",
  });

  assert.deepEqual(writes, [
    { target: "product", data: { status: "AVAILABLE" } },
    { target: "watch", data: { saleStage: "READY", stockStage: "IN_STOCK", serviceStage: "DONE" } },
  ]);
});
