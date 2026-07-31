import { Prisma } from "@prisma/client";

import type { BusinessEventConsumerKey } from "@/domains/event/contract/business-event-contract.types";
import type {
  BusinessEventDispatchContext,
  BusinessEventEffect,
} from "@/domains/event/dispatcher/business-event-consumer.types";
import { dbOrTx, type DB } from "@/server/db/client";

export const DURABLE_BUSINESS_EVENT_CONSUMERS = [
  "coordination",
  "workflow",
  "timeline",
  "notification",
] as const satisfies readonly BusinessEventConsumerKey[];

export type DurableBusinessEventConsumerKey =
  (typeof DURABLE_BUSINESS_EVENT_CONSUMERS)[number];

export type BusinessEventConsumerDeliveryRow = {
  id: string;
  idempotencyKey: string;
  operationKey: string;
  businessEventLogId: string | null;
  consumerKey: DurableBusinessEventConsumerKey;
  eventKey: string;
  targetType: string;
  targetId: string;
  actorUserId: string | null;
  effect: string;
  revokeEventKey: string | null;
  targetAliasIds: unknown;
  eventInstanceId: string | null;
  payloadJson: unknown;
  status: string;
  attempts: number;
  nextAttemptAt: Date;
  lockedAt: Date | null;
  completedAt: Date | null;
  lastError: string | null;
  resultJson: unknown;
  createdAt: Date;
  updatedAt: Date;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function enqueueBusinessEventConsumerDeliveries(
  db: DB,
  input: {
    operationKey: string;
    businessEventLogId?: string | null;
    consumerKeys: DurableBusinessEventConsumerKey[];
    eventKey: string;
    targetType: string;
    targetId: string;
    actorUserId?: string | null;
    effect: BusinessEventEffect;
    revokeEventKey?: string | null;
    targetAliasIds?: string[];
    eventInstanceId?: string | null;
    payload?: unknown;
  },
) {
  const client = dbOrTx(db);
  for (const consumerKey of [...new Set(input.consumerKeys)]) {
    const idempotencyKey = `${input.operationKey}:${consumerKey}`;
    await client.$executeRaw(Prisma.sql`
      INSERT INTO "BusinessEventConsumerDelivery" (
        "idempotencyKey", "operationKey", "businessEventLogId", "consumerKey",
        "eventKey", "targetType", "targetId", "actorUserId", "effect",
        "revokeEventKey", "targetAliasIds", "eventInstanceId", "payloadJson",
        "status", "nextAttemptAt", "createdAt", "updatedAt"
      )
      VALUES (
        ${idempotencyKey}, ${input.operationKey},
        ${clean(input.businessEventLogId) || null}, ${consumerKey},
        ${input.eventKey}, ${input.targetType}, ${input.targetId},
        ${clean(input.actorUserId) || null}, ${input.effect},
        ${clean(input.revokeEventKey) || null},
        ${JSON.stringify(input.targetAliasIds ?? [])}::jsonb,
        ${clean(input.eventInstanceId) || null},
        ${JSON.stringify(input.payload ?? {})}::jsonb,
        'PENDING', NOW(), NOW(), NOW()
      )
      ON CONFLICT ("idempotencyKey") DO NOTHING
    `);
  }
}

export async function claimBusinessEventConsumerDeliveries(
  db: DB,
  input: { operationKey?: string; limit?: number; lockTimeoutMinutes?: number } = {},
) {
  const limit = Math.max(1, Math.min(100, Math.trunc(input.limit ?? 20)));
  const lockTimeoutMinutes = Math.max(
    1,
    Math.min(60, Math.trunc(input.lockTimeoutMinutes ?? 10)),
  );
  const operationKey = clean(input.operationKey);
  return dbOrTx(db).$queryRaw<BusinessEventConsumerDeliveryRow[]>(Prisma.sql`
    WITH candidates AS (
      SELECT "id"
      FROM "BusinessEventConsumerDelivery"
      WHERE (
        ("status" IN ('PENDING', 'FAILED') AND "nextAttemptAt" <= NOW())
        OR (
          "status" = 'PROCESSING'
          AND "lockedAt" < NOW() - (${lockTimeoutMinutes} * INTERVAL '1 minute')
        )
      )
      AND "attempts" < 8
      AND NOT (
        "consumerKey" <> 'coordination'
        AND EXISTS (
          SELECT 1
          FROM "BusinessEventConsumerDelivery" AS coordination
          WHERE coordination."operationKey" =
            "BusinessEventConsumerDelivery"."operationKey"
            AND coordination."consumerKey" = 'coordination'
            AND coordination."status" NOT IN ('SUCCEEDED', 'SKIPPED')
        )
      )
      ${operationKey ? Prisma.sql`AND "operationKey" = ${operationKey}` : Prisma.empty}
      ORDER BY "nextAttemptAt" ASC, "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    UPDATE "BusinessEventConsumerDelivery" AS delivery
    SET
      "status" = 'PROCESSING',
      "attempts" = delivery."attempts" + 1,
      "lockedAt" = NOW(),
      "lastError" = NULL,
      "updatedAt" = NOW()
    FROM candidates
    WHERE delivery."id" = candidates."id"
    RETURNING delivery.*
  `);
}

export async function markBusinessEventConsumerDeliverySucceeded(
  db: DB,
  idempotencyKey: string,
  input: { skipped?: boolean; result?: unknown } = {},
) {
  await dbOrTx(db).$executeRaw(Prisma.sql`
    UPDATE "BusinessEventConsumerDelivery"
    SET
      "status" = ${input.skipped ? "SKIPPED" : "SUCCEEDED"},
      "completedAt" = NOW(),
      "lockedAt" = NULL,
      "lastError" = NULL,
      "resultJson" = ${JSON.stringify(input.result ?? {})}::jsonb,
      "updatedAt" = NOW()
    WHERE "idempotencyKey" = ${idempotencyKey}
  `);
}

export async function markBusinessEventConsumerDeliveryFailed(
  db: DB,
  idempotencyKey: string,
  error: unknown,
) {
  const message = (error instanceof Error ? error.message : clean(error) || "UNKNOWN_CONSUMER_ERROR")
    .slice(0, 4000);
  await dbOrTx(db).$executeRaw(Prisma.sql`
    UPDATE "BusinessEventConsumerDelivery"
    SET
      "status" = CASE WHEN "attempts" >= 8 THEN 'DEAD' ELSE 'FAILED' END,
      "nextAttemptAt" = NOW() + (
        LEAST(900, GREATEST(5, POWER(2, LEAST("attempts", 9))::int * 5))
        * INTERVAL '1 second'
      ),
      "lockedAt" = NULL,
      "lastError" = ${message},
      "updatedAt" = NOW()
    WHERE "idempotencyKey" = ${idempotencyKey}
  `);
}

export async function getBusinessEventConsumerDeliverySummary(
  db: DB,
  operationKey: string,
) {
  const rows = await dbOrTx(db).$queryRaw<Array<{
    consumerKey: string;
    status: string;
    attempts: number;
    lastError: string | null;
    completedAt: Date | null;
  }>>(Prisma.sql`
    SELECT "consumerKey", "status", "attempts", "lastError", "completedAt"
    FROM "BusinessEventConsumerDelivery"
    WHERE "operationKey" = ${operationKey}
    ORDER BY "consumerKey" ASC
  `);
  return rows;
}

export function businessEventConsumerDeliveryContext(
  row: BusinessEventConsumerDeliveryRow,
): BusinessEventDispatchContext {
  const aliases = Array.isArray(row.targetAliasIds)
    ? row.targetAliasIds.map(String).filter(Boolean)
    : [];
  return {
    eventLog: {
      id: row.businessEventLogId,
      metadataJson: row.payloadJson,
      createdAt: row.createdAt,
    },
    eventKey: row.eventKey,
    targetType: row.targetType,
    targetId: row.targetId,
    actorUserId: row.actorUserId,
    effect: row.effect === "REVOKE" ? "REVOKE" : "ASSERT",
    revokeEventKey: row.revokeEventKey,
    targetAliasIds: aliases,
    eventInstanceId: row.eventInstanceId,
    idempotencyKey: row.operationKey,
  };
}
