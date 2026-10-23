import assert from "node:assert/strict";
import test from "node:test";
import { reconcilePersonalWorkBindings } from "./personal-work-bindings";

test("binding reconciliation preserves unchanged targets", () => {
  const watch = { id: "execution-1", targetType: "WATCH", targetId: "watch-1" };
  const order = { id: "execution-2", targetType: "ORDER", targetId: "order-1" };
  const result = reconcilePersonalWorkBindings(
    [watch, order],
    [{ type: "WATCH", id: "watch-1" }, { type: "ORDER", id: "order-2" }],
  );

  assert.deepEqual(result.removed, [order]);
  assert.deepEqual(result.added, [{ type: "ORDER", id: "order-2" }]);
});

