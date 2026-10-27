import assert from "node:assert/strict";
import test from "node:test";

import { convertWatchPriceVndToUsd, formatStorefrontMoney } from "./locale.utils";

test("USD watch price includes the VND adjustment and rounds up to the next ten dollars", () => {
  assert.equal(convertWatchPriceVndToUsd(42_248_000, 26_500), 1_640);
  assert.equal(convertWatchPriceVndToUsd(42_460_000, 26_500), 1_640);
  assert.equal(convertWatchPriceVndToUsd(42_460_001, 26_500), 1_650);
});

test("English storefront formats the adjusted rounded watch price", () => {
  assert.equal(formatStorefrontMoney(42_248_000, "en", 26_500), "$1,640");
});

test("Vietnamese storefront price is unchanged", () => {
  assert.equal(formatStorefrontMoney(42_248_000, "vi", 26_500), "42.248.000 ₫");
});
