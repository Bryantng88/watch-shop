import assert from "node:assert/strict";
import test from "node:test";
import { listProjectionBuildersForEvent } from "../projection.registry";

function keys(eventKey: string, targetType: string) {
  return listProjectionBuildersForEvent({ eventKey, targetType }).map((builder) => builder.key);
}

test("watch list rebuilds from canonical order completion", () => {
  assert.ok(keys("order.completed", "ORDER").includes("watch-list"));
});

test("watch list has shipment and payment recovery paths", () => {
  assert.ok(keys("shipment.delivered", "SHIPMENT").includes("watch-list"));
  assert.ok(keys("payment.paid", "PAYMENT").includes("watch-list"));
});
