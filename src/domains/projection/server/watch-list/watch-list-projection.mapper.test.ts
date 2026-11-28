import assert from "node:assert/strict";
import test from "node:test";

import { storefrontProjectionStatus, mapWatchListSourceRowToProjectionData, watchListProjectionSearchText } from "./watch-list-projection.mapper";
import type { WatchListProjectionSourceRow } from "./watch-list-projection.types";

test("watch list projection reflects canonical storefront eligibility", () => {
  assert.deepEqual(storefrontProjectionStatus(true), {
    storefrontStatus: "PUBLISHED",
    storefrontStatusLabel: "Đã lên storefront",
  });
  assert.deepEqual(storefrontProjectionStatus(false), {
    storefrontStatus: "HIDDEN",
    storefrontStatusLabel: "Chưa lên storefront",
  });
});

test("admin suffix is searchable in compact/original forms without changing the clean product title", () => {
  const source = {
    id: "watch", productId: "product", product: { id: "product", title: "IWC Automatic", productImage: [], postTargets: [] },
    createdAt: new Date(), updatedAt: new Date(), reviewStates: [],
    __adminIdentitySuffix: "NHAT-PN281126-000001",
  } as unknown as WatchListProjectionSourceRow;
  const data = mapWatchListSourceRowToProjectionData(source);
  assert.equal(data.row.title, "IWC Automatic · NHAT-PN281126-000001");
  assert.equal(source.product.title, "IWC Automatic");
  assert.ok(watchListProjectionSearchText(data).includes("nhat-pn281126-000001"));
  assert.ok(watchListProjectionSearchText(data).includes("pn-281126-000001"));
});
