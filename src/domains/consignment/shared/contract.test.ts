import assert from "node:assert/strict";
import { test } from "node:test";
import {
  consignmentAmounts,
  termsSchema,
  createConsignmentSchema,
  readConsignment,
} from "./contract";
test("negotiated fee modes retain exact VND totals", () => {
  assert.deepEqual(
    consignmentAmounts(10000001, { mode: "PERCENT", value: 10 }),
    { saleAmount: 10000001, fee: 1000000, net: 9000001 },
  );
  assert.equal(
    consignmentAmounts(10000000, { mode: "FIXED", value: 1200000 }).net,
    8800000,
  );
  assert.equal(
    consignmentAmounts(10000000, { mode: "NET", value: 8500000 }).fee,
    1500000,
  );
  for (const mode of ["FIXED", "NET"] as const)
    assert.throws(() => consignmentAmounts(100, { mode, value: 101 }));
  assert.equal(
    termsSchema.safeParse({ mode: "PERCENT", value: 101 }).success,
    false,
  );
  assert.equal(
    termsSchema.safeParse({ mode: "FIXED", value: 0.5 }).success,
    false,
  );
  assert.equal(readConsignment({ direction: "OUT" }), null);
});
test("inbound requires a new watch identity; outbound requires an existing watch", () => {
  assert.equal(
    createConsignmentSchema.safeParse({
      requestId: "11111111-1111-4111-8111-111111111111",
      direction: "IN",
      vendorId: "v",
      terms: { mode: "NET", value: 0 },
    }).success,
    false,
  );
  assert.equal(
    createConsignmentSchema.safeParse({
      requestId: "11111111-1111-4111-8111-111111111111",
      direction: "OUT",
      vendorId: "v",
      terms: { mode: "FIXED", value: 0 },
    }).success,
    false,
  );
});
