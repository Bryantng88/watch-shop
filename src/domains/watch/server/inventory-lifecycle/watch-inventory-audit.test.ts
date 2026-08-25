import assert from "node:assert/strict";
import test from "node:test";

import { auditWatchInventoryState } from "./watch-inventory-audit";

test("IN_SERVICE can overlay sale-ready inventory without blocking release", () => {
  assert.deepEqual(auditWatchInventoryState({
    productStatus: "IN_SERVICE",
    saleStage: "READY",
    stockStage: "IN_STOCK",
    serviceStage: "IN_SERVICE",
  }), {
    severity: "WARNING",
    code: "SERVICE_STATUS_OVERLAY",
    detail: "IN_SERVICE/READY/IN_STOCK; serviceStage=IN_SERVICE",
  });
});

test("reserved stock without HOLD remains a release-blocking error", () => {
  assert.deepEqual(auditWatchInventoryState({
    productStatus: "IN_SERVICE",
    saleStage: "READY",
    stockStage: "RESERVED",
    serviceStage: "IN_SERVICE",
  }), {
    severity: "ERROR",
    code: "DIVERGENT_INVENTORY_PAIR",
    detail: "IN_SERVICE/READY/RESERVED",
  });
});

test("canonical inventory state has no audit finding", () => {
  assert.equal(auditWatchInventoryState({
    productStatus: "HOLD",
    saleStage: "HOLD",
    stockStage: "RESERVED",
    serviceStage: "NOT_REQUIRED",
  }), null);
});
