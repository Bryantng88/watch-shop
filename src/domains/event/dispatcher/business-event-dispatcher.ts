import type { DB } from "@/server/db/client";
import type { BusinessEventConsumerKey } from "@/domains/event/contract/business-event-contract.types";
import { isBusinessEventConsumerAllowed } from "@/domains/event/validator/business-event-validator";
import { perfLog, perfNow } from "@/lib/server-perf";
import { listBusinessEventConsumers } from "./business-event-consumers.registry";
import type {
  BusinessEventConsumer,
  BusinessEventConsumerContext,
  BusinessEventConsumerResult,
  BusinessEventDispatchPolicy,
  BusinessEventDispatchResult,
} from "./business-event-consumer.types";

const DEFAULT_CONSUMER_TIMEOUT_MS = 5000;

export const DEFAULT_BUSINESS_EVENT_DISPATCH_POLICY: BusinessEventDispatchPolicy = {
  defaultTimeoutMs: DEFAULT_CONSUMER_TIMEOUT_MS,
  orderedConsumers: ["coordination"],
  defaultRetry: { attempts: 0 },
};

function businessEventConsumerTimeoutMs() {
  const configured = Number(process.env.BUSINESS_EVENT_CONSUMER_TIMEOUT_MS);
  if (Number.isFinite(configured) && configured > 0) return configured;
  return DEFAULT_CONSUMER_TIMEOUT_MS;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function isTimeoutError(error: unknown) {
  return error instanceof Error && error.message.includes("timed out");
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function resultItems(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.map(asRecord).filter((item) => Object.keys(item).length > 0);
}

function textValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "").trim()).filter(Boolean).join(", ");
  }

  return String(value ?? "").trim();
}

function consumerResultOutcome(result: unknown): Pick<
  BusinessEventConsumerResult,
  "ok" | "status" | "skipped" | "reason" | "error"
> {
  const resultRecord = asRecord(result);

  if (resultRecord.ok === false || resultRecord.error) {
    return {
      ok: false,
      status: "failed",
      error: textValue(resultRecord.error) || textValue(resultRecord.reason) || "Consumer failed",
    };
  }

  if (resultRecord.skipped === true) {
    return {
      ok: true,
      status: "skipped",
      skipped: true,
      reason: textValue(resultRecord.reason) || "CONSUMER_SKIPPED",
    };
  }

  const items = resultItems(result);

  if (items.length) {
    const failedItem = items.find((item) => item.ok === false || item.error);
    if (failedItem) {
      return {
        ok: false,
        status: "failed",
        error: textValue(failedItem.error) || textValue(failedItem.reason) || "Consumer failed",
      };
    }

    const appliedItem = items.find((item) => item.ok === true && item.skipped !== true);
    if (appliedItem) {
      return { ok: true, status: "success" };
    }

    const skippedItem = items.find((item) => item.skipped === true);
    return {
      ok: true,
      status: "skipped",
      skipped: true,
      reason: textValue(skippedItem?.reason) || "CONSUMER_SKIPPED",
    };
  }

  if (Array.isArray(result)) {
    return {
      ok: true,
      status: "skipped",
      skipped: true,
      reason: "NO_CONSUMER_RESULT",
    };
  }

  return { ok: true, status: "success" };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function skippedConsumerResult(input: {
  consumer: BusinessEventConsumerKey;
  reason: string;
  startedAt: number;
}): BusinessEventConsumerResult {
  return {
    ok: true,
    consumer: input.consumer,
    status: "skipped",
    attempts: 0,
    durationMs: Math.max(0, perfNow() - input.startedAt),
    skipped: true,
    reason: input.reason,
  };
}

async function runConsumer(input: {
  client: DB;
  consumer: BusinessEventConsumer;
  context: BusinessEventConsumerContext;
  policy: BusinessEventDispatchPolicy;
}) {
  const { client, consumer, context, policy } = input;
  const consumerStartedAt = perfNow();
  const timeoutMs = consumer.timeoutMs ?? policy.defaultTimeoutMs;
  const maxRetries = consumer.retry?.attempts ?? policy.defaultRetry.attempts;
  let attempts = 0;

  try {
    if (!isBusinessEventConsumerAllowed(context.eventKey, consumer.key)) {
      return skippedConsumerResult({
        consumer: consumer.key,
        reason: "CONSUMER_NOT_ALLOWED",
        startedAt: consumerStartedAt,
      });
    }

    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      attempts = attempt + 1;

      try {
        const result = await withTimeout(
          consumer.consume(client, context),
          timeoutMs,
          `BusinessEvent consumer ${consumer.key} timed out after ${timeoutMs}ms`,
        );
        const outcome = consumerResultOutcome(result);

        return {
          ok: outcome.ok,
          consumer: consumer.key,
          status: outcome.status,
          attempts,
          durationMs: Math.max(0, perfNow() - consumerStartedAt),
          skipped: outcome.skipped,
          reason: outcome.reason,
          error: outcome.error,
          result,
        } satisfies BusinessEventConsumerResult;
      } catch (error) {
        lastError = error;
      }
    }

    const status = isTimeoutError(lastError) ? "timeout" : "failed";
    const message = errorMessage(lastError);

    console.error("[business-event] consumer failed", {
      consumer: consumer.key,
      eventKey: context.eventKey,
      targetType: context.targetType,
      targetId: context.targetId,
      attempts,
      status,
      error: message,
    });

    return {
      ok: false,
      consumer: consumer.key,
      status,
      attempts,
      durationMs: Math.max(0, perfNow() - consumerStartedAt),
      error: message,
    } satisfies BusinessEventConsumerResult;
  } finally {
    perfLog(
      "business-event",
      `${context.eventKey}:consumer:${consumer.key}`,
      consumerStartedAt,
    );
  }
}

function resolveDispatchPolicy(
  policy?: Partial<BusinessEventDispatchPolicy>,
): BusinessEventDispatchPolicy {
  return {
    ...DEFAULT_BUSINESS_EVENT_DISPATCH_POLICY,
    defaultTimeoutMs:
      policy?.defaultTimeoutMs ?? businessEventConsumerTimeoutMs(),
    orderedConsumers:
      policy?.orderedConsumers ??
      DEFAULT_BUSINESS_EVENT_DISPATCH_POLICY.orderedConsumers,
    defaultRetry:
      policy?.defaultRetry ??
      DEFAULT_BUSINESS_EVENT_DISPATCH_POLICY.defaultRetry,
  };
}

function orderConsumers(
  consumers: BusinessEventConsumer[],
  orderedKeys: BusinessEventConsumerKey[],
) {
  const orderedKeySet = new Set(orderedKeys);

  return {
    ordered: orderedKeys
      .map((key) => consumers.find((consumer) => consumer.key === key))
      .filter((consumer): consumer is BusinessEventConsumer => Boolean(consumer)),
    parallel: consumers.filter((consumer) => !orderedKeySet.has(consumer.key)),
  };
}

export async function dispatchBusinessEvent(input: {
  client: DB;
  context: BusinessEventConsumerContext;
  consumers?: BusinessEventConsumer[];
  policy?: Partial<BusinessEventDispatchPolicy>;
}): Promise<BusinessEventDispatchResult> {
  const policy = resolveDispatchPolicy(input.policy);
  const consumers = input.consumers ?? listBusinessEventConsumers();
  const { ordered, parallel } = orderConsumers(
    consumers,
    policy.orderedConsumers,
  );
  const results: BusinessEventDispatchResult = {
    workflow: undefined,
    notification: undefined,
    timeline: undefined,
    coordination: undefined,
  };

  for (const consumer of ordered) {
    results[consumer.key] = await runConsumer({
      client: input.client,
      consumer,
      context: input.context,
      policy,
    });
  }

  const parallelResults = await Promise.all(
    parallel.map((consumer) =>
      runConsumer({
        client: input.client,
        consumer,
        context: input.context,
        policy,
      }),
    ),
  );

  for (const result of parallelResults) {
    results[result.consumer] = result;
  }

  return results;
}
