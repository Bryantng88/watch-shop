import { defineBusinessEventContract } from "@/domains/event/contract/business-event-contract.helpers";
import type { BusinessEventContract } from "@/domains/event/contract/business-event-contract.types";

export const SHIPMENT_OPERATION_EVENT_KEYS = [
  "shipment.created",
  "shipment.updated",
  "shipment.shipped",
  "shipment.delivered",
  "shipment.returning",
  "shipment.returned",
  "shipment.cancelled",
] as const;

const SHIPMENT_OPERATION_CONSUMERS = [
  "timeline",
  "coordination",
  "projection",
] as const;

export const SHIPMENT_BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] = [
  defineBusinessEventContract({
    key: "shipment.created",
    label: "Shipment created",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: [...SHIPMENT_OPERATION_CONSUMERS],
    autoBindingScope: "CURRENT_ACTIVE_WEEKLY_SPACE:OPERATION:shipment-operation",
  }),
  defineBusinessEventContract({
    key: "shipment.updated",
    label: "Shipment updated",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: ["timeline", "projection"],
  }),
  defineBusinessEventContract({
    key: "shipment.shipped",
    label: "Shipment shipped",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: [...SHIPMENT_OPERATION_CONSUMERS, "notification"],
  }),
  defineBusinessEventContract({
    key: "shipment.delivered",
    label: "Shipment delivered",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: [...SHIPMENT_OPERATION_CONSUMERS, "notification"],
  }),
  defineBusinessEventContract({
    key: "shipment.returning",
    label: "Shipment returning",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: [...SHIPMENT_OPERATION_CONSUMERS, "notification"],
  }),
  defineBusinessEventContract({
    key: "shipment.returned",
    label: "Shipment returned",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: [...SHIPMENT_OPERATION_CONSUMERS, "notification"],
  }),
  defineBusinessEventContract({
    key: "shipment.cancelled",
    label: "Shipment cancelled",
    targetType: "SHIPMENT",
    group: "Shipment",
    knownConsumers: [...SHIPMENT_OPERATION_CONSUMERS],
  }),
];
