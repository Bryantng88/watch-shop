import assert from "node:assert/strict";
import test from "node:test";

import { watchPoolDispositionBlockReason } from "./watch-media-disposition.service";

test("Watch pool disposition allows only completely unreferenced media", () => {
  assert.equal(watchPoolDispositionBlockReason({
    productReferenceCount: 0,
    otherActiveBindingCount: 0,
    derivativeCount: 0,
  }), null);
});

test("Watch pool disposition blocks every downstream reference type", () => {
  assert.match(watchPoolDispositionBlockReason({
    productReferenceCount: 1,
    otherActiveBindingCount: 0,
    derivativeCount: 0,
  }) ?? "", /sản phẩm/);
  assert.match(watchPoolDispositionBlockReason({
    productReferenceCount: 0,
    otherActiveBindingCount: 1,
    derivativeCount: 0,
  }) ?? "", /vị trí khác/);
  assert.match(watchPoolDispositionBlockReason({
    productReferenceCount: 0,
    otherActiveBindingCount: 0,
    derivativeCount: 1,
  }) ?? "", /bản xử lý/);
});
