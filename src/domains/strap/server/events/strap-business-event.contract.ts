import { defineBusinessEventContract } from "@/domains/event/contract/business-event-contract.helpers";
import type { BusinessEventContract } from "@/domains/event/contract/business-event-contract.types";

export const STRAP_BUSINESS_EVENT_KEYS = [
  "strap.created",
  "strap.updated",
  "strap.intake.requested",
  "strap.received",
  "strap.stock.adjusted",
  "strap.installed",
  "strap.removed",
  "strap.clasp.updated",
  "strap.links.adjusted",
  "strap.processing.completed",
] as const;

export const STRAP_BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] =
  STRAP_BUSINESS_EVENT_KEYS.map((key) =>
    defineBusinessEventContract({
      key,
      label: key.split(".").join(" "),
      targetType: "STRAP",
      group: "Strap",
      knownConsumers: key === "strap.intake.requested"
        ? ["coordination", "workflow", "timeline", "projection"]
        : ["timeline", "projection"],
      payload: {
        name: "StrapBusinessEventPayload",
        version: 1,
        required: ["productId", "variantId"],
        optional: ["watchId", "orderId", "quantity", "note"],
      },
    }),
  );
