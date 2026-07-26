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

export const ORDER_BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] =
  ORDER_BUSINESS_EVENT_KEYS.map((key) =>
    defineBusinessEventContract({
      key,
      label: key.split(".").join(" "),
      targetType: "ORDER",
      group: "Order",
      knownConsumers: ["timeline", "projection"],
    }),
  );
