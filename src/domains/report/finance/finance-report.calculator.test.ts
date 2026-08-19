import assert from "node:assert/strict";
import test from "node:test";
import {
  allocateAmountByChannel,
  allocateOrderContributions,
  channelWeightsFromContributions,
} from "./finance-report.calculator";

test("allocates a shared order discount across MEN and WOMEN line items", () => {
  const contributions = allocateOrderContributions([
    { id: "men", channel: "MEN", kind: "PRODUCT", revenue: 30_000_000, cost: 20_000_000 },
    { id: "women", channel: "WOMEN", kind: "PRODUCT", revenue: 20_000_000, cost: 12_000_000 },
    { id: "discount", channel: null, kind: "DISCOUNT", revenue: -5_000_000, cost: 0 },
  ]);

  assert.deepEqual(contributions.map((item) => item.allocatedRevenue), [27_000_000, 18_000_000]);
  assert.equal(contributions.reduce((sum, item) => sum + item.allocatedRevenue, 0), 45_000_000);
});

test("allocates a mixed-order payment without losing rounding remainder", () => {
  const contributions = allocateOrderContributions([
    { id: "men", channel: "MEN", kind: "PRODUCT", revenue: 30_000_000, cost: 0 },
    { id: "women", channel: "WOMEN", kind: "PRODUCT", revenue: 20_000_000, cost: 0 },
  ]);
  const weights = channelWeightsFromContributions(contributions);
  const allocations = allocateAmountByChannel(12_345_679, weights);

  assert.equal(allocations.reduce((sum, item) => sum + item.amount, 0), 12_345_679);
  assert.deepEqual(allocations.map((item) => item.channel), ["MEN", "WOMEN"]);
});
