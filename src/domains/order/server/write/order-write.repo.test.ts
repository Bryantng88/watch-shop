import assert from "node:assert/strict";
import test from "node:test";

import type { DB } from "@/server/db/client";
import { getActiveOrderLocksForProductsRepo } from "./order-write.repo";

test("terminal orders do not lock a bought-back watch", async () => {
  let query: Record<string, unknown> | null = null;
  const db = {
    orderItem: {
      findMany: async (input: Record<string, unknown>) => {
        query = input;
        return [];
      },
    },
  } as unknown as DB;

  await getActiveOrderLocksForProductsRepo(db, { productIds: ["product-1"] });

  assert.ok(query);
  const statuses = (query as unknown as {
    where: { order: { status: { notIn: string[] } } };
  }).where.order.status.notIn;
  assert.deepEqual(statuses, ["CANCELLED", "COMPLETED", "RETURNED"]);
});
