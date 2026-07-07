import type { DB } from "@/server/db/client";
import type { BusinessEventConsumerKey } from "@/domains/event/contract/business-event-contract.types";

export type BusinessEventEffect = "ASSERT" | "REVOKE";

export type BusinessEventConsumerContext = {
  eventLog: unknown;
  eventKey: string;
  targetType: string;
  targetId: string;
  actorUserId?: string | null;
  effect: BusinessEventEffect;
  revokeEventKey?: string | null;
  targetAliasIds?: string[];
};

export type BusinessEventConsumerRetryPolicy = {
  attempts: number;
};

export type BusinessEventConsumer = {
  key: BusinessEventConsumerKey;
  consume: (
    client: DB,
    context: BusinessEventConsumerContext,
  ) => Promise<unknown>;
  timeoutMs?: number;
  retry?: BusinessEventConsumerRetryPolicy;
};

export type BusinessEventConsumerStatus =
  | "success"
  | "skipped"
  | "failed"
  | "timeout";

export type BusinessEventConsumerResult = {
  ok: boolean;
  consumer: BusinessEventConsumerKey;
  status: BusinessEventConsumerStatus;
  attempts: number;
  durationMs: number;
  skipped?: boolean;
  reason?: string;
  error?: string;
  result?: unknown;
};

export type BusinessEventDispatchPolicy = {
  defaultTimeoutMs: number;
  orderedConsumers: BusinessEventConsumerKey[];
  defaultRetry: BusinessEventConsumerRetryPolicy;
};

export type BusinessEventDispatchResult = Record<
  BusinessEventConsumerKey,
  BusinessEventConsumerResult | undefined
>;

