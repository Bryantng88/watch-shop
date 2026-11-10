import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import type { Evidence } from "../live-contract";
import { assistantLookupSchema } from "../live-contract";
import { assistantCapabilities, lookupAllowed } from "../capabilities";
import {
  selectPriceGroup,
  watchSelectionSchema,
  mediaPostProposalSchema,
} from "../media-post-contract";
import {
  lookupMediaWatches,
  lookupStockReceipts,
  prepareMediaPost,
  recheckMediaPost,
  selectionWhere,
} from "./media-post-plan";
const source = "00000000-0000-4000-8000-000000000001";
const selection = watchSelectionSchema.parse({
  brand: "Seiko",
  keywords: ["diver"],
  count: 10,
  similarPrices: true,
});
const row = (id: string, price = 4000000) => ({
  id,
  productId: "product-" + id,
  updatedAt: new Date("2026-11-10T00:00:00Z"),
  watchPrice: { salePrice: { toString: () => String(price) } },
  product: {
    title: "Seiko diver " + id,
    sku: id,
    productImage: [{ fileKey: id + ".jpg" }],
  },
});
const authority = (...permissions: string[]) => ({
  admin: false,
  permissions: new Set(permissions),
});

test("similar-price selection finds the fullest tight group, preserves input and never pads or uses invalid prices", () => {
  const prices = [1, 10, 10.1, 10.2, 10.3, 10.4, 30, 31];
  const rows = prices.map((price, i) => ({
    watchId: String(i),
    price: String(price),
  }));
  const before = structuredClone(rows);
  assert.deepEqual(
    selectPriceGroup(rows, 4, true).map((r) => r.price),
    ["10.1", "10.2", "10.3", "10.4"],
  );
  assert.equal(selectPriceGroup(rows, 10, true).length, 5);
  assert.deepEqual(
    selectPriceGroup(
      [
        { watchId: "bad", price: "NaN" },
        { watchId: "zero", price: "0" },
      ],
      10,
      true,
    ),
    [],
  );
  assert.deepEqual(rows, before);
  assert.equal(
    selectPriceGroup(
      [
        { watchId: "a", price: "100" },
        { watchId: "b", price: "125" },
        { watchId: "c", price: "126" },
      ],
      3,
      true,
    ).length,
    2,
  );
});
test("strict contracts bound count, prices, duplicate IDs and separate media access from receipt access", () => {
  assert.equal(
    watchSelectionSchema.safeParse({ ...selection, count: 21 }).success,
    false,
  );
  assert.equal(
    watchSelectionSchema.safeParse({ ...selection, priceMin: 10, priceMax: 5 })
      .success,
    false,
  );
  assert.equal(
    mediaPostProposalSchema.safeParse({
      sourceMessageId: source,
      watchIds: ["a", "a"],
      caption: "Caption đủ dài",
      brief: "Seiko diver",
    }).success,
    false,
  );
  assert.equal(
    lookupAllowed(authority("PRODUCT_VIEW"), "media.posts.draft"),
    false,
  );
  assert.equal(
    lookupAllowed(
      authority("PRODUCT_VIEW", "MEDIA_VIEW", "PRODUCT_UPDATE"),
      "media.posts.draft",
    ),
    true,
  );
  assert.equal(
    lookupAllowed(
      authority("PRODUCT_VIEW", "MEDIA_VIEW", "PRODUCT_UPDATE"),
      "stock.receipts",
    ),
    false,
  );
  assert.equal(
    lookupAllowed(
      authority("PRODUCT_VIEW", "WATCH_ACQUISITION_VIEW"),
      "stock.receipts",
    ),
    true,
  );
  assert.equal(
    assistantCapabilities(
      authority("PRODUCT_VIEW", "MEDIA_VIEW", "PRODUCT_UPDATE"),
    ).canCreateMediaPosts,
    true,
  );
  assert.equal(
    assistantLookupSchema.safeParse({
      tool: "media.posts.draft",
      query: "{}",
      productId: "injected",
    }).success,
    false,
  );
  const where = selectionWhere(selection);
  assert.equal(where.stockStage, "IN_STOCK");
  assert.deepEqual(where.saleStage, {
    notIn: ["SOLD", "HOLD", "CONSIGNED_TO"],
  });
  assert.equal(where.AND instanceof Array && where.AND.length, 1);
});
test("selection reports exact matching count and scan truncation; draft rejects incomplete evidence, off-list IDs and old messages", async () => {
  const args: unknown[] = [];
  const db = {
    watch: {
      count: async () => 1001,
      findMany: async (input: unknown) => {
        args.push(input);
        return [row("a")];
      },
    },
  } as unknown as DB;
  const result = await lookupMediaWatches(db, JSON.stringify(selection));
  assert.equal(result.truncated, true);
  assert.equal(result.total, 1001);
  assert.equal(result.matches.length, 1);
  const request = {
    tool: "media.watches.select" as const,
    query: JSON.stringify(selection),
  };
  const query = JSON.stringify({
    sourceMessageId: source,
    watchIds: ["a"],
    caption: "Một nhóm Seiko diver",
    brief: "Seiko diver giá tương đương",
  });
  await assert.rejects(
    prepareMediaPost(db, query, 1, source, [{ request, result }]),
    /tra đủ/,
  );
  const complete = { ...result, truncated: false, total: 1 };
  await assert.rejects(
    prepareMediaPost(db, query, 1, "different", [
      { request, result: complete },
    ]),
    /lượt chat/,
  );
  await assert.rejects(
    prepareMediaPost(db, query.replace('["a"]', '["unseen"]'), 1, source, [
      { request, result: complete },
    ]),
    /kết quả tra cứu/,
  );
  await assert.rejects(
    prepareMediaPost(db, query, 1, source, [
      { request, result: complete },
      { request, result },
    ]),
    /tra đủ/,
  );
  const entries: Evidence[] = [{ request, result: complete }];
  const draft = await prepareMediaPost(db, query, 1, source, entries);
  assert.equal(draft.watches[0].price, "4000000");
  await assert.rejects(
    recheckMediaPost(
      { watch: { findMany: async () => [row("a", 5000000)] } } as unknown as DB,
      draft,
    ),
    /thay đổi/,
  );
  await assert.rejects(
    recheckMediaPost(
      { watch: { findMany: async () => [] } } as unknown as DB,
      draft,
    ),
    /thay đổi/,
  );
  assert.ok(args.length > 0);
});
test("receipt lookup uses receipt creation time, bounds children and applies watch-only receipt scope without exposing costs/vendors", async () => {
  let find: Record<string, unknown> | undefined;
  const db = {
    acquisition: {
      count: async () => 25,
      findMany: async (input: Record<string, unknown>) => {
        find = input;
        return [
          {
            id: "r",
            refNo: "PN-1",
            createdAt: new Date("2026-11-10T01:00:00Z"),
            acquisitionItem: Array.from({ length: 21 }, () => ({
              product: { id: "p", title: "Seiko", sku: "S" },
            })),
          },
        ];
      },
    },
  } as unknown as DB;
  const result = await lookupStockReceipts(
    db,
    JSON.stringify({ brand: "Seiko", count: 10 }),
    false,
  );
  assert.equal(result.dateField, "createdAt");
  assert.equal(result.truncated, true);
  assert.equal(result.items[0].watchesTruncated, true);
  assert.equal(result.items[0].watches.length, 20);
  assert.equal(result.items[0].importedAt, "2026-11-10T01:00:00.000Z");
  assert.deepEqual(find?.orderBy, [{ createdAt: "desc" }, { id: "asc" }]);
  assert.deepEqual(
    (find?.where as { acquisitionItem: { every: unknown } }).acquisitionItem
      .every,
    { productType: "WATCH" },
  );
  assert.equal(JSON.stringify(find).includes("unitCost"), false);
  assert.equal(JSON.stringify(find).includes("vendor"), false);
});
