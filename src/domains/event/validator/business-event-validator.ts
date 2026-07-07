import {
  BUSINESS_EVENT_CONSUMERS,
  type BusinessEventConsumerKey,
  type BusinessEventContract,
} from "@/domains/event/contract/business-event-contract.types";
import {
  isKnownBusinessEventConsumer,
  normalizeBusinessEventKey,
} from "@/domains/event/contract/business-event-contract.helpers";
import {
  getBusinessEventContract,
  listBusinessEventContracts,
} from "@/domains/event/catalog/business-event-catalog";

export type BusinessEventValidationSeverity = "error" | "warning";

export type BusinessEventValidationIssue = {
  code: string;
  severity: BusinessEventValidationSeverity;
  message: string;
  eventKey?: string;
  path?: string;
};

export type BusinessEventValidationResult = {
  ok: boolean;
  issues: BusinessEventValidationIssue[];
  contract: BusinessEventContract | null;
};

export type BusinessEventInputValidationSubject = {
  eventKey: unknown;
  targetType: unknown;
  targetId: unknown;
  payload?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasPayloadPath(payload: unknown, path: string) {
  if (!path) return false;

  let current: unknown = payload;
  for (const part of path.split(".")) {
    if (!isRecord(current) || !(part in current)) return false;
    current = current[part];
  }

  return current !== undefined && current !== null && current !== "";
}

function hasError(issues: BusinessEventValidationIssue[]) {
  return issues.some((issue) => issue.severity === "error");
}

export function validateBusinessEventInput(
  input: BusinessEventInputValidationSubject,
): BusinessEventValidationResult {
  const issues: BusinessEventValidationIssue[] = [];
  const eventKey = normalizeBusinessEventKey(input.eventKey);
  const targetType = String(input.targetType ?? "").trim();
  const targetId = String(input.targetId ?? "").trim();
  const contract = getBusinessEventContract(eventKey);

  if (!eventKey) {
    issues.push({
      code: "EVENT_KEY_REQUIRED",
      severity: "error",
      message: "Business event key is required.",
      path: "eventKey",
    });
  }

  if (!targetType) {
    issues.push({
      code: "TARGET_TYPE_REQUIRED",
      severity: "error",
      message: "Business event target type is required.",
      eventKey,
      path: "targetType",
    });
  }

  if (!targetId) {
    issues.push({
      code: "TARGET_ID_REQUIRED",
      severity: "error",
      message: "Business event target id is required.",
      eventKey,
      path: "targetId",
    });
  }

  if (eventKey && !contract) {
    issues.push({
      code: "EVENT_NOT_IN_CATALOG",
      severity: "error",
      message: `Business event "${eventKey}" is not registered in the event catalog.`,
      eventKey,
      path: "eventKey",
    });
  }

  if (contract && targetType && contract.targetType !== targetType) {
    issues.push({
      code: "TARGET_TYPE_MISMATCH",
      severity: "error",
      message: `Business event "${eventKey}" expects target type "${contract.targetType}", received "${targetType}".`,
      eventKey,
      path: "targetType",
    });
  }

  for (const requiredPath of contract?.payload?.required ?? []) {
    if (!hasPayloadPath(input.payload, requiredPath)) {
      issues.push({
        code: "PAYLOAD_FIELD_REQUIRED",
        severity: "error",
        message: `Business event "${eventKey}" requires payload field "${requiredPath}".`,
        eventKey,
        path: `payload.${requiredPath}`,
      });
    }
  }

  return {
    ok: !hasError(issues),
    issues,
    contract,
  };
}

export function validateBusinessEventCatalog(
  contracts = listBusinessEventContracts(),
): BusinessEventValidationIssue[] {
  const issues: BusinessEventValidationIssue[] = [];
  const keys = new Set<string>();
  const validConsumers = new Set<string>(BUSINESS_EVENT_CONSUMERS);

  for (const contract of contracts) {
    if (!contract.key) {
      issues.push({
        code: "CATALOG_EVENT_KEY_REQUIRED",
        severity: "error",
        message: "Catalog event key is required.",
      });
      continue;
    }

    if (keys.has(contract.key)) {
      issues.push({
        code: "CATALOG_DUPLICATE_EVENT_KEY",
        severity: "error",
        message: `Business event "${contract.key}" is registered more than once.`,
        eventKey: contract.key,
      });
    }
    keys.add(contract.key);

    if (contract.key !== normalizeBusinessEventKey(contract.key)) {
      issues.push({
        code: "CATALOG_EVENT_KEY_NOT_NORMALIZED",
        severity: "error",
        message: `Business event "${contract.key}" is not normalized.`,
        eventKey: contract.key,
      });
    }

    if (!Number.isInteger(contract.version) || contract.version < 1) {
      issues.push({
        code: "CATALOG_EVENT_VERSION_INVALID",
        severity: "error",
        message: `Business event "${contract.key}" must have a positive integer version.`,
        eventKey: contract.key,
        path: "version",
      });
    }

    for (const consumer of contract.knownConsumers ?? []) {
      if (!validConsumers.has(consumer)) {
        issues.push({
          code: "CATALOG_UNKNOWN_CONSUMER",
          severity: "error",
          message: `Business event "${contract.key}" references unknown consumer "${consumer}".`,
          eventKey: contract.key,
          path: "knownConsumers",
        });
      }
    }

    if (
      contract.autoBindingScope &&
      !contract.knownConsumers?.includes("coordination")
    ) {
      issues.push({
        code: "CATALOG_AUTOBINDING_WITHOUT_COORDINATION",
        severity: "warning",
        message: `Business event "${contract.key}" has auto binding scope but does not list coordination consumer.`,
        eventKey: contract.key,
        path: "autoBindingScope",
      });
    }
  }

  return issues;
}

export function isBusinessEventConsumerAllowed(
  eventKey: unknown,
  consumer: BusinessEventConsumerKey,
) {
  if (!isKnownBusinessEventConsumer(consumer)) return false;

  const contract = getBusinessEventContract(eventKey);
  if (!contract) return true;
  if (!Array.isArray(contract.knownConsumers)) return true;
  if (contract.knownConsumers.length === 0) return true;

  return contract.knownConsumers.includes(consumer);
}

