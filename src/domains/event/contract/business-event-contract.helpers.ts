import {
  BUSINESS_EVENT_CONSUMERS,
  type BusinessEventConsumerKey,
  type BusinessEventContract,
  type BusinessEventDefinition,
} from "@/domains/event/contract/business-event-contract.types";

const consumerSet = new Set<string>(BUSINESS_EVENT_CONSUMERS);

export function normalizeBusinessEventKey(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export function isKnownBusinessEventConsumer(
  value: unknown,
): value is BusinessEventConsumerKey {
  return consumerSet.has(String(value ?? ""));
}

export function normalizeKnownConsumers(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .map((consumer) => String(consumer ?? "").trim())
        .filter(Boolean),
    ),
  );
}

export function defineBusinessEventContract(
  input: BusinessEventDefinition & Partial<BusinessEventContract>,
): BusinessEventContract {
  const key = normalizeBusinessEventKey(input.key);
  const knownConsumers = normalizeKnownConsumers(input.knownConsumers);
  const lifecycle =
    input.lifecycle ??
    (input.status === "DRAFT" || input.status === "DEPRECATED"
      ? input.status
      : "ACTIVE");

  return {
    ...input,
    key,
    version: input.version ?? 1,
    lifecycle,
    status: input.status ?? lifecycle,
    knownConsumers,
    payload:
      input.payload ??
      (input.payloadContract
        ? { name: input.payloadContract, version: 1 }
        : undefined),
    replacedBy: input.replacedBy ?? null,
    tags: input.tags ?? [],
  };
}

export function definitionToBusinessEventContract(
  definition: BusinessEventDefinition,
): BusinessEventContract {
  return defineBusinessEventContract(definition);
}

export function contractToBusinessEventDefinition(
  contract: BusinessEventContract,
): BusinessEventDefinition {
  return {
    key: contract.key,
    label: contract.label,
    targetType: contract.targetType,
    group: contract.group,
    description: contract.description,
    status: contract.status,
    businessMeaning: contract.businessMeaning,
    producer: contract.producer,
    emitPoint: contract.emitPoint,
    targetIdPolicy: contract.targetIdPolicy,
    targetAliasPolicy: contract.targetAliasPolicy,
    payloadContract: contract.payloadContract ?? contract.payload?.name ?? undefined,
    knownConsumers: contract.knownConsumers,
    autoBindingScope: contract.autoBindingScope,
  };
}

