import assert from "node:assert/strict";
import test from "node:test";

import { storefrontProjectionStatus } from "./watch-list-projection.mapper";

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
