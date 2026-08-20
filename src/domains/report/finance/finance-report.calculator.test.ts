import assert from "node:assert/strict";
import test from "node:test";
import {
  allocateAmountByChannel,
  allocateOrderContributions,
  channelWeightsFromContributions,
  summarizeCashLedger,
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

test("opening balance resets historical cash without becoming income", () => {
  const startAt = new Date("2026-08-01T00:00:00.000Z");
  const endAt = new Date("2026-08-31T23:59:59.999Z");
  const date = (value: string) => new Date(value);
  const summary = summarizeCashLedger([
    { direction: "IN", purpose: "ORDER_FULL", status: "PAID", amount: 900, paidAt: date("2026-06-01T00:00:00.000Z"), updatedAt: date("2026-06-01T00:00:00.000Z") },
    { direction: "IN", purpose: "OPENING_BALANCE", status: "PAID", amount: 1_000, paidAt: date("2026-07-31T23:00:00.000Z"), updatedAt: date("2026-07-31T23:00:00.000Z") },
    { direction: "IN", purpose: "OTHER_INCOME", status: "PAID", amount: 200, paidAt: date("2026-08-05T00:00:00.000Z"), updatedAt: date("2026-08-05T00:00:00.000Z") },
    { direction: "OUT", purpose: "OPERATING_EXPENSE", status: "PAID", amount: 300, paidAt: date("2026-08-10T00:00:00.000Z"), updatedAt: date("2026-08-10T00:00:00.000Z") },
  ], startAt, endAt);

  assert.deepEqual(summary, {
    openingBalance: 1_000,
    cashIn: 200,
    cashOut: 300,
    netCashFlow: -100,
    closingBalance: 900,
  });
});

test("settled payment date falls back to updatedAt deterministically", () => {
  const summary = summarizeCashLedger([
    { direction: "IN", purpose: "ORDER_FULL", status: "COLLECTED", amount: 500, paidAt: null, updatedAt: new Date("2026-08-05T00:00:00.000Z") },
  ], new Date("2026-08-01T00:00:00.000Z"), new Date("2026-08-31T23:59:59.999Z"));
  assert.equal(summary.cashIn, 500);
  assert.equal(summary.closingBalance, 500);
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
