import assert from "node:assert/strict";
import test from "node:test";

import { storefrontProjectionStatus } from "./watch-list-projection.mapper";

test("watch list projection distinguishes published and hidden storefront watches", () => {
  assert.deepEqual(storefrontProjectionStatus(new Date("2026-08-18T00:00:00Z")), {
    storefrontStatus: "PUBLISHED",
    storefrontStatusLabel: "Đã lên storefront",
  });
  assert.deepEqual(storefrontProjectionStatus(null), {
    storefrontStatus: "HIDDEN",
    storefrontStatusLabel: "Chưa lên storefront",
  });
});
