import assert from "node:assert/strict";
import test from "node:test";

import type { DB } from "@/server/db/client";
import { getAdminWatchMediaEditDetail } from "./watch-detail.repo";

test("media edit detail selects persisted storefront state", async () => {
  let query: Record<string, unknown> | null = null;
  const db = {
    watch: {
      findUnique: async (input: Record<string, unknown>) => {
        query = input;
        return null;
      },
    },
  } as unknown as DB;

  await getAdminWatchMediaEditDetail(db, "product-1");

  assert.ok(query);
  const productSelect = (query as unknown as {
    select: { product: { select: Record<string, boolean> } };
  }).select.product.select;
  assert.equal(productSelect.publishedAt, true);
  assert.equal(productSelect.priceVisibility, true);
});
