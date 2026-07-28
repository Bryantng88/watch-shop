import { Prisma } from "@prisma/client";

import { dbOrTx, type DB } from "@/server/db/client";
import type {
  BusinessEventDispatchContext,
  BusinessEventEffect,
} from "@/domains/event/dispatcher/business-event-consumer.types";

export type ProjectionEventDeliveryRow = {
  id: string;
  idempotencyKey: string;
  businessEventLogId: string | null;
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
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectionDeliveryStatus = Pick<
  ProjectionEventDeliveryRow,
  "idempotencyKey" | "status" | "attempts" | "completedAt" | "lastError" | "updatedAt"
>;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : clean(error) || "UNKNOWN_PROJECTION_ERROR";
}

export async function enqueueProjectionDelivery(
  db: DB,
  input: {
    idempotencyKey: string;
    businessEventLogId?: string | null;
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
  await client.$executeRaw(Prisma.sql`
    INSERT INTO "ProjectionEventDelivery" (
      "idempotencyKey",
      "businessEventLogId",
      "eventKey",
      "targetType",
      "targetId",
      "actorUserId",
      "effect",
      "revokeEventKey",
      "targetAliasIds",
      "eventInstanceId",
      "payloadJson",
      "status",
      "nextAttemptAt",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${input.idempotencyKey},
      ${clean(input.businessEventLogId) || null},
      ${input.eventKey},
      ${input.targetType},
      ${input.targetId},
      ${clean(input.actorUserId) || null},
      ${input.effect},
      ${clean(input.revokeEventKey) || null},
      ${JSON.stringify(input.targetAliasIds ?? [])}::jsonb,
      ${clean(input.eventInstanceId) || null},
      ${JSON.stringify(input.payload ?? {})}::jsonb,
      'BLOCKED',
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT ("idempotencyKey") DO NOTHING
  `);
}

export async function getProjectionDeliveryStatus(
  db: DB,
  idempotencyKey: string,
) {
  const rows = await dbOrTx(db).$queryRaw<ProjectionDeliveryStatus[]>(Prisma.sql`
    SELECT
      "idempotencyKey",
      "status",
      "attempts",
      "completedAt",
      "lastError",
      "updatedAt"
    FROM "ProjectionEventDelivery"
    WHERE "idempotencyKey" = ${idempotencyKey}
    LIMIT 1
  `);
  return rows[0] ?? null;
}

export async function markProjectionDeliveryReady(db: DB, idempotencyKey: string) {
  await dbOrTx(db).$executeRaw(Prisma.sql`
    UPDATE "ProjectionEventDelivery"
    SET
      "status" = 'PENDING',
      "nextAttemptAt" = NOW(),
      "lockedAt" = NULL,
      "lastError" = NULL,
      "updatedAt" = NOW()
    WHERE "idempotencyKey" = ${idempotencyKey}
      AND "status" = 'BLOCKED'
  `);
}

export async function markProjectionDeliveryStarted(db: DB, idempotencyKey: string) {
  await dbOrTx(db).$executeRaw(Prisma.sql`
    UPDATE "ProjectionEventDelivery"
    SET
      "status" = 'PROCESSING',
      "attempts" = "attempts" + 1,
      "lockedAt" = NOW(),
      "lastError" = NULL,
      "updatedAt" = NOW()
    WHERE "idempotencyKey" = ${idempotencyKey}
      AND "status" <> 'SUCCEEDED'
  `);
}

export async function markProjectionDeliverySucceeded(db: DB, idempotencyKey: string) {
  await dbOrTx(db).$executeRaw(Prisma.sql`
    UPDATE "ProjectionEventDelivery"
    SET
      "status" = 'SUCCEEDED',
      "completedAt" = NOW(),
      "lockedAt" = NULL,
      "lastError" = NULL,
      "updatedAt" = NOW()
    WHERE "idempotencyKey" = ${idempotencyKey}
  `);
}

export async function markProjectionDeliveryFailed(
  db: DB,
  idempotencyKey: string,
  error: unknown,
) {
  const message = errorText(error).slice(0, 4000);
  await dbOrTx(db).$executeRaw(Prisma.sql`
    UPDATE "ProjectionEventDelivery"
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

export async function claimProjectionDeliveries(
  db: DB,
  input: { limit?: number; lockTimeoutMinutes?: number } = {},
) {
  const limit = Math.max(1, Math.min(100, Math.trunc(input.limit ?? 20)));
  const lockTimeoutMinutes = Math.max(
    1,
    Math.min(60, Math.trunc(input.lockTimeoutMinutes ?? 10)),
  );
  return dbOrTx(db).$queryRaw<ProjectionEventDeliveryRow[]>(Prisma.sql`
    WITH candidates AS (
      SELECT "id"
      FROM "ProjectionEventDelivery"
      WHERE (
        ("status" IN ('PENDING', 'FAILED') AND "nextAttemptAt" <= NOW())
        OR (
          "status" = 'PROCESSING'
          AND "lockedAt" < NOW() - (${lockTimeoutMinutes} * INTERVAL '1 minute')
        )
      )
      AND "attempts" < 8
      ORDER BY "nextAttemptAt" ASC, "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    UPDATE "ProjectionEventDelivery" AS delivery
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

export async function claimProjectionDeliveryByKey(
  db: DB,
  idempotencyKey: string,
) {
  const rows = await dbOrTx(db).$queryRaw<ProjectionEventDeliveryRow[]>(Prisma.sql`
    UPDATE "ProjectionEventDelivery"
    SET
      "status" = 'PROCESSING',
      "attempts" = "attempts" + 1,
      "lockedAt" = NOW(),
      "lastError" = NULL,
      "updatedAt" = NOW()
    WHERE "idempotencyKey" = ${idempotencyKey}
      AND "status" IN ('PENDING', 'FAILED')
      AND "nextAttemptAt" <= NOW()
      AND "attempts" < 8
    RETURNING *
  `);

  return rows[0] ?? null;
}

export function projectionDeliveryContext(
  row: ProjectionEventDeliveryRow,
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
    idempotencyKey: row.idempotencyKey,
  };
}
