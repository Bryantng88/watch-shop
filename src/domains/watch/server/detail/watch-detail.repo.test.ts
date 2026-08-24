import assert from "node:assert/strict";
import test from "node:test";

import type { DB } from "@/server/db/client";
import { getAdminWatchMediaEditDetail, getWatchTradeHistory } from "./watch-detail.repo";

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

test("trade history exposes the buy-back customer for the watch timeline", async () => {
  const db = {
    acquisitionItem: {
      findMany: async () => [{
        id: "acquisition-item-1",
        acquisitionId: "acquisition-1",
        status: "SENT",
        unitCost: 8_800_000,
        createdAt: new Date("2026-08-24T03:06:42.288Z"),
        updatedAt: new Date("2026-08-24T03:07:05.609Z"),
        acquisition: {
          refNo: "PN-240826-000001",
          accquisitionStt: "POSTED",
          type: "BUY_BACK",
          createdAt: new Date("2026-08-24T03:06:42.183Z"),
          updatedAt: new Date("2026-08-24T03:07:05.960Z"),
          vendor: null,
          customer: { id: "customer-1", name: "Bùi Trí" },
        },
      }],
    },
    orderItem: { findMany: async () => [] },
  } as unknown as DB;

  const history = await getWatchTradeHistory(db, "product-1");

  assert.equal(history.acquisitions[0]?.acquisitionType, "BUY_BACK");
  assert.equal(history.acquisitions[0]?.customerName, "Bùi Trí");
});
