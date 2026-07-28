import type { DB } from "@/server/db/client";
import type { BusinessEventConsumerKey } from "@/domains/event/contract/business-event-contract.types";

export type BusinessEventEffect = "ASSERT" | "REVOKE";

export type BusinessEventDispatchContext = {
  eventLog: unknown;
  eventKey: string;
  targetType: string;
  targetId: string;
  actorUserId?: string | null;
  effect: BusinessEventEffect;
  revokeEventKey?: string | null;
  targetAliasIds?: string[];
  eventInstanceId?: string | null;
  idempotencyKey?: string | null;
  projectionDeliveryKey?: string | null;
  abortSignal?: AbortSignal;
};

export type BusinessEventConsumerContext = BusinessEventDispatchContext;

export type BusinessEventConsumerRetryPolicy = {
  attempts: number;
};

export type BusinessEventConsumer = {
  key: BusinessEventConsumerKey;
  consume: (
    client: DB,
    context: BusinessEventDispatchContext,
  ) => Promise<unknown>;
  /**
   * `null` marks a commit barrier. The dispatcher must await the real result
   * because timing it out would let dependent read models observe half-written
   * business state while the underlying database work keeps running.
   */
  timeoutMs?: number | null;
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
