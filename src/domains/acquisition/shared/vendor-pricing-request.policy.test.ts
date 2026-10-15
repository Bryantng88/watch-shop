import assert from "node:assert/strict";
import test from "node:test";

import { resolveVendorPricingRequestStatus, resolveVendorPricingSubmission } from "./vendor-pricing-request.policy";

test("vendor pricing submission preserves request order and calculates total", () => {
  const result = resolveVendorPricingSubmission(
    [{ id: "watch-a", title: "A" }, { id: "watch-b", title: "B" }],
    [{ id: "watch-b", unitCost: 20_000_000 }, { id: "watch-a", unitCost: 10_000_000 }],
  );
  assert.deepEqual(result.prices, [10_000_000, 20_000_000]);
  assert.equal(result.totalAmount, 30_000_000);
});

test("vendor pricing submission rejects missing, duplicate, and non-positive rows", () => {
  const request = [{ id: "watch-a", title: "A" }, { id: "watch-b", title: "B" }];
  assert.throws(() => resolveVendorPricingSubmission(request, [{ id: "watch-a", unitCost: 1 }]));
  assert.throws(() => resolveVendorPricingSubmission(request, [{ id: "watch-a", unitCost: 1 }, { id: "watch-a", unitCost: 2 }]));
  assert.throws(() => resolveVendorPricingSubmission(request, [{ id: "watch-a", unitCost: 1 }, { id: "watch-b", unitCost: 0 }]));
  assert.throws(() => resolveVendorPricingSubmission(request, [{ id: "watch-a", unitCost: 1.5 }, { id: "watch-b", unitCost: 2 }]));
  assert.throws(() => resolveVendorPricingSubmission(request, [{ id: "watch-a", unitCost: 10_000_000_000 }, { id: "watch-b", unitCost: 2 }]));
});

test("open request is exposed as expired after its deadline", () => {
  assert.equal(resolveVendorPricingRequestStatus({ status: "OPEN", expiresAt: new Date("2026-01-01T00:00:00Z") }, new Date("2026-01-02T00:00:00Z")), "EXPIRED");
  assert.equal(resolveVendorPricingRequestStatus({ status: "SUBMITTED", expiresAt: new Date("2026-01-01T00:00:00Z") }, new Date("2026-01-02T00:00:00Z")), "SUBMITTED");
});
