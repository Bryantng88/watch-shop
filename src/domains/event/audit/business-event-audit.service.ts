import { listBusinessEventContracts } from "@/domains/event/catalog/business-event-catalog";
import type { BusinessEventContract } from "@/domains/event/contract/business-event-contract.types";
import {
  validateBusinessEventCatalog,
  type BusinessEventValidationIssue,
} from "@/domains/event/validator/business-event-validator";

export type BusinessEventAuditItem = {
  eventKey: string;
  targetType: string;
  version: number;
  lifecycle: string;
  group: string;
  producer: string | null;
  emitPoint: string | null;
  consumers: string[];
  issues: BusinessEventValidationIssue[];
};

export type BusinessEventAuditResult = {
  total: number;
  errors: number;
  warnings: number;
  items: BusinessEventAuditItem[];
  issues: BusinessEventValidationIssue[];
};

export function auditBusinessEventCatalog(
  contracts: BusinessEventContract[] = listBusinessEventContracts(),
): BusinessEventAuditResult {
  const issues = validateBusinessEventCatalog(contracts);
  const issuesByKey = new Map<string, BusinessEventValidationIssue[]>();

  for (const issue of issues) {
    const key = issue.eventKey ?? "";
    issuesByKey.set(key, [...(issuesByKey.get(key) ?? []), issue]);
  }

  const items = contracts.map((contract) => ({
    eventKey: contract.key,
    targetType: contract.targetType,
    version: contract.version,
    lifecycle: contract.lifecycle,
    group: contract.group,
    producer: contract.producer ?? null,
    emitPoint: contract.emitPoint ?? null,
    consumers: contract.knownConsumers ?? [],
    issues: issuesByKey.get(contract.key) ?? [],
  }));

  return {
    total: contracts.length,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    items,
    issues,
  };
}

