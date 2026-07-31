import { getBusinessEventContract } from "@/domains/event/catalog/business-event-catalog";
import { dispatchBusinessEvent } from "@/domains/event/dispatcher/business-event-dispatcher";
import { listBusinessEventConsumers } from "@/domains/event/dispatcher/business-event-consumers.registry";
import {
  markProjectionDeliveryReady,
} from "@/domains/projection/server/projection-delivery.repo";
import { processProjectionDelivery } from "@/domains/projection/server/projection-delivery.service";
import { prisma, type DB } from "@/server/db/client";
import {
  businessEventConsumerDeliveryContext,
  claimBusinessEventConsumerDeliveries,
  getBusinessEventConsumerDeliverySummary,
  markBusinessEventConsumerDeliveryFailed,
  markBusinessEventConsumerDeliverySucceeded,
  type BusinessEventConsumerDeliveryRow,
} from "./business-event-consumer-delivery.repo";

const PROJECTION_BARRIER_CONSUMERS = ["coordination", "workflow"] as const;

async function releaseProjectionWhenBarriersComplete(
  db: DB,
  row: BusinessEventConsumerDeliveryRow,
) {
  const knownConsumers = getBusinessEventContract(row.eventKey)?.knownConsumers ?? [];
  const barriers = PROJECTION_BARRIER_CONSUMERS.filter((key) =>
    knownConsumers.includes(key),
  );
  if (!barriers.length) return false;

  const summary = await getBusinessEventConsumerDeliverySummary(db, row.operationKey);
  const statusByConsumer = new Map(
    summary.map((delivery) => [delivery.consumerKey, delivery.status]),
  );
  const complete = barriers.every((key) =>
    ["SUCCEEDED", "SKIPPED"].includes(statusByConsumer.get(key) ?? ""),
  );
  if (!complete) return false;

  await markProjectionDeliveryReady(db, row.operationKey);
  return true;
}

async function processClaimedBusinessEventConsumerDelivery(
  db: DB,
  row: BusinessEventConsumerDeliveryRow,
) {
  try {
    const consumer = listBusinessEventConsumers().find(
      (candidate) => candidate.key === row.consumerKey,
    );
    if (!consumer) throw new Error(`BUSINESS_EVENT_CONSUMER_NOT_FOUND:${row.consumerKey}`);

    const results = await dispatchBusinessEvent({
      client: db,
      context: businessEventConsumerDeliveryContext(row),
      consumers: [consumer],
    });
    const result = results[row.consumerKey];
    if (!result) throw new Error(`BUSINESS_EVENT_CONSUMER_RESULT_MISSING:${row.consumerKey}`);
    if (!result.ok) throw new Error(result.error ?? `BUSINESS_EVENT_CONSUMER_FAILED:${row.consumerKey}`);

    await markBusinessEventConsumerDeliverySucceeded(db, row.idempotencyKey, {
      skipped: result.skipped,
      result,
    });
    const projectionReleased = await releaseProjectionWhenBarriersComplete(db, row);
    return {
      ok: true,
      operationKey: row.operationKey,
      consumerKey: row.consumerKey,
      projectionReleased,
    };
  } catch (error) {
    await markBusinessEventConsumerDeliveryFailed(db, row.idempotencyKey, error);
    return {
      ok: false,
      operationKey: row.operationKey,
      consumerKey: row.consumerKey,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function processBusinessEventConsumerDeliveries(input?: {
  db?: DB;
  operationKey?: string;
  limit?: number;
  concurrency?: number;
  processProjection?: boolean;
}) {
  const db = input?.db ?? prisma;
  const rows = await claimBusinessEventConsumerDeliveries(db, {
    operationKey: input?.operationKey,
    limit: input?.limit ?? 20,
  });
  const concurrency = Math.max(1, Math.min(8, Math.trunc(input?.concurrency ?? 4)));
  const results: Array<
    Awaited<ReturnType<typeof processClaimedBusinessEventConsumerDelivery>>
  > = [];

  for (let index = 0; index < rows.length; index += concurrency) {
    results.push(
      ...await Promise.all(
        rows.slice(index, index + concurrency).map((row) =>
          processClaimedBusinessEventConsumerDelivery(db, row),
        ),
      ),
    );
  }

  const operationKeys = [...new Set(
    results.filter((result) => result.ok && result.projectionReleased)
      .map((result) => result.operationKey),
  )];
  if (input?.processProjection !== false) {
    for (const operationKey of operationKeys) {
      await processProjectionDelivery(operationKey, { db });
    }
  }

  return {
    claimed: rows.length,
    succeeded: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  };
}

export async function processBusinessEventOperation(
  operationKey: string,
  input?: { db?: DB },
) {
  const db = input?.db ?? prisma;
  const passes = [];
  for (let pass = 0; pass < 4; pass += 1) {
    const result = await processBusinessEventConsumerDeliveries({
      db,
      operationKey,
      limit: 20,
      concurrency: 4,
    });
    passes.push(result);
    if (!result.claimed || result.failed) break;
  }
  const projection = await processProjectionDelivery(operationKey, { db });
  return {
    consumers: {
      claimed: passes.reduce((total, pass) => total + pass.claimed, 0),
      succeeded: passes.reduce((total, pass) => total + pass.succeeded, 0),
      failed: passes.reduce((total, pass) => total + pass.failed, 0),
      passes,
    },
    projection,
  };
}
