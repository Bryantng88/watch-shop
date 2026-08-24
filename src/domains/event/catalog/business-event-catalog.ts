import { WATCH_BUSINESS_EVENT_DEFINITIONS } from "@/domains/watch/server/events/watch-business-event.contract";
import {
  contractToBusinessEventDefinition,
  definitionToBusinessEventContract,
  normalizeBusinessEventKey,
} from "@/domains/event/contract/business-event-contract.helpers";
import type {
  BusinessEventContract,
  BusinessEventDefinition,
} from "@/domains/event/contract/business-event-contract.types";
import { LEGACY_BUSINESS_EVENT_CONTRACTS } from "@/domains/event/catalog/legacy-business-events.catalog";
import { SHIPMENT_BUSINESS_EVENT_CONTRACTS } from "@/domains/shipment/server/events/shipment-business-event.contract";
import { ORDER_BUSINESS_EVENT_CONTRACTS } from "@/domains/order/server/events/order-business-event.contract";
import { STRAP_BUSINESS_EVENT_CONTRACTS } from "@/domains/strap/server/events/strap-business-event.contract";
import { PURCHASE_REQUEST_BUSINESS_EVENT_CONTRACTS } from "@/domains/purchase-request/server/events/purchase-request-business-event.contract";
import { MEDIA_POST_BUSINESS_EVENT_CONTRACTS } from "@/domains/media-post/server/events/media-post-business-event.contract";

const WATCH_BUSINESS_EVENT_CONTRACTS = WATCH_BUSINESS_EVENT_DEFINITIONS.map(
  definitionToBusinessEventContract,
);

export const BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] = [
  ...WATCH_BUSINESS_EVENT_CONTRACTS,
  ...SHIPMENT_BUSINESS_EVENT_CONTRACTS,
  ...ORDER_BUSINESS_EVENT_CONTRACTS,
  ...STRAP_BUSINESS_EVENT_CONTRACTS,
  ...PURCHASE_REQUEST_BUSINESS_EVENT_CONTRACTS,
  ...MEDIA_POST_BUSINESS_EVENT_CONTRACTS,
  ...LEGACY_BUSINESS_EVENT_CONTRACTS,
];

export const BUSINESS_EVENTS: BusinessEventDefinition[] =
  BUSINESS_EVENT_CONTRACTS.map(contractToBusinessEventDefinition);

export { normalizeBusinessEventKey };

export function listBusinessEventContracts() {
  return BUSINESS_EVENT_CONTRACTS;
}

export function getBusinessEventContract(key: unknown) {
  const normalized = normalizeBusinessEventKey(key);
  if (!normalized) return null;

  return (
    BUSINESS_EVENT_CONTRACTS.find((event) => event.key === normalized) ?? null
  );
}

export function getBusinessEventDefinition(key: unknown) {
  const contract = getBusinessEventContract(key);
  return contract ? contractToBusinessEventDefinition(contract) : null;
}
