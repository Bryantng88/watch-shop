import assert from "node:assert/strict";
import test from "node:test";
import { ORDER_BUSINESS_EVENT_CONTRACTS } from "./order-business-event.contract";
import { validateBusinessEventInput } from "@/domains/event/validator/business-event-validator";

test("only order.created declares the notification consumer", () => {
  const notificationEvents = ORDER_BUSINESS_EVENT_CONTRACTS
    .filter((contract) => contract.knownConsumers?.includes("notification"))
    .map((contract) => contract.key);

  assert.deepEqual(notificationEvents, ["order.created"]);
});

test("order.created payload satisfies the registered event contract", () => {
  const result = validateBusinessEventInput({
    eventKey: "order.created",
    targetType: "ORDER",
    targetId: "order-1",
    payload: {
      eventInstanceId: "event-1",
      orderId: "order-1",
      refNo: "ORD-1",
      fromStatus: null,
      toStatus: "POSTED",
      source: "ORDER_CREATE",
      occurredAt: new Date().toISOString(),
    },
  });

  assert.equal(result.ok, true, JSON.stringify(result.issues));
});
