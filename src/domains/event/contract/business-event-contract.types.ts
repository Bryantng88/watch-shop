export const BUSINESS_EVENT_CONSUMERS = [
  "workflow",
  "notification",
  "timeline",
  "coordination",
] as const;

export type BusinessEventConsumerKey = typeof BUSINESS_EVENT_CONSUMERS[number];

export type BusinessEventTargetType =
  | "WATCH"
  | "ORDER"
  | "SHIPMENT"
  | "PAYMENT"
  | "SERVICE_REQUEST"
  | "TECHNICAL_ISSUE"
  | "ACQUISITION"
  | "WORK_CASE"
  | "TASK"
  | "TASK_ITEM"
  | "GENERAL";

export type BusinessEventLifecycle = "ACTIVE" | "DRAFT" | "DEPRECATED";

export type BusinessEventPayloadContract = {
  name?: string | null;
  version?: number;
  required?: string[];
  optional?: string[];
  description?: string | null;
};

export type BusinessEventDefinition = {
  key: string;
  label: string;
  targetType: BusinessEventTargetType;
  group: string;
  description?: string;
  status?: string;
  businessMeaning?: string;
  producer?: string | null;
  emitPoint?: string | null;
  targetIdPolicy?: string;
  targetAliasPolicy?: string;
  payloadContract?: string;
  knownConsumers?: string[];
  autoBindingScope?: string | null;
};

export type BusinessEventContract = BusinessEventDefinition & {
  version: number;
  lifecycle: BusinessEventLifecycle;
  payload?: BusinessEventPayloadContract;
  replacedBy?: string | null;
  tags?: string[];
};

