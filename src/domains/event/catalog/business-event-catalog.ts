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

const WATCH_BUSINESS_EVENT_CONTRACTS = WATCH_BUSINESS_EVENT_DEFINITIONS.map(
  definitionToBusinessEventContract,
);

export const BUSINESS_EVENT_CONTRACTS: BusinessEventContract[] = [
  ...WATCH_BUSINESS_EVENT_CONTRACTS,
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

