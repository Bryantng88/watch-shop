import assert from "node:assert/strict";
import test from "node:test";
import { evaluateOrderSettlement } from "./order-completion.service";

test("completes a delivered COD order when paid plus collected covers the total", () => {
  assert.deepEqual(evaluateOrderSettlement({
    currentStatus: "SHIPPED", hasShipment: true, shipmentStatuses: ["DELIVERED"],
    totalDue: 10_000_000, paidTotal: 2_000_000, collectedTotal: 8_000_000,
  }), { locked: false, fullyPaid: true, shipmentCompleted: true, completed: true });
});

test("does not complete before delivery or when settlement is insufficient", () => {
  assert.equal(evaluateOrderSettlement({ currentStatus: "SHIPPED", hasShipment: true, shipmentStatuses: ["SHIPPED"], totalDue: 10, paidTotal: 10 }).completed, false);
  assert.equal(evaluateOrderSettlement({ currentStatus: "SHIPPED", hasShipment: true, shipmentStatuses: ["DELIVERED"], totalDue: 10, paidTotal: 9 }).completed, false);
});

test("never completes a locked return or cancelled order", () => {
  for (const currentStatus of ["RETURNING", "RETURNED", "CANCELLED"]) {
    assert.equal(evaluateOrderSettlement({ currentStatus, hasShipment: false, shipmentStatuses: [], totalDue: 10, paidTotal: 10 }).completed, false);
  }
});
