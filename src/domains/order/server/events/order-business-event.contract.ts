import { defineBusinessEventContract } from "@/domains/event/contract/business-event-contract.helpers";
import type { BusinessEventContract } from "@/domains/event/contract/business-event-contract.types";

export const ORDER_BUSINESS_EVENT_KEYS = [
  "order.created",
  "order.updated",
  "order.posted",
  "order.verified",
  "order.rejected",
  "order.cancelled",
  "order.paid",
  "order.completed",
] as const;

export const ORDER_BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] = [
  defineBusinessEventContract({
    key: "order.created",
    label: "Đơn hàng được tạo",
    targetType: "ORDER",
    group: "Order",
    producer: "order",
    emitPoint: "createOrderWithItems after committed create transaction",
    targetIdPolicy: "Order.id",
    knownConsumers: ["timeline", "projection", "notification"],
    payload: {
      name: "OrderCreatedV1",
      version: 1,
      required: ["eventInstanceId", "orderId", "occurredAt"],
      optional: ["refNo", "fromStatus", "toStatus", "actorUserId", "note", "source"],
    },
  }),
  ...ORDER_BUSINESS_EVENT_KEYS.filter((key) => key !== "order.created").map((key) =>
    defineBusinessEventContract({
      key,
      label: key.split(".").join(" "),
      targetType: "ORDER",
      group: "Order",
      knownConsumers: ["timeline", "projection"],
    }),
  ),
];
