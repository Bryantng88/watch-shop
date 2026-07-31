import { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";

const FAMILIES = [
  { key: "PAYMENT", eventLike: "payment.%" },
  { key: "SHIPMENT", eventLike: "shipment.%" },
  { key: "ORDER", eventLike: "order.%" },
  { key: "WATCH", eventLike: "watch.%" },
  { key: "TECHNICAL_ISSUE", eventLike: "technical_issue.%" },
  { key: "SERVICE_REQUEST", eventLike: "service_request.%" },
] as const;

type MatrixRow = {
  family: string;
  eventKey: string | null;
  eventLogId: string | null;
  targetType: string | null;
  targetId: string | null;
  actorUserId: string | null;
  eventCreatedAt: Date | null;
  operationKey: string | null;
  consumerTotal: bigint;
  consumerTerminal: bigint;
  consumerUnhealthy: bigint;
  consumerInvalidTerminal: bigint;
  projectionTotal: bigint;
  projectionSucceeded: bigint;
  projectionUnhealthy: bigint;
};

async function latestFamilySample(family: typeof FAMILIES[number]) {
  const rows = await prisma.$queryRaw<MatrixRow[]>(Prisma.sql`
    WITH latest_event AS (
      SELECT
        ${family.key}::text AS "family",
        event."id",
        event."eventKey",
        event."targetType",
        event."targetId",
        event."actorUserId",
        event."createdAt"
      FROM "BusinessEventLog" event
      WHERE event."eventKey" LIKE ${family.eventLike}
        AND EXISTS (
          SELECT 1
          FROM "BusinessEventConsumerDelivery" delivery
          WHERE delivery."businessEventLogId" = event."id"
        )
      ORDER BY event."createdAt" DESC
      LIMIT 1
    ),
    consumer_summary AS (
      SELECT
        delivery."businessEventLogId",
        MIN(delivery."operationKey") AS "operationKey",
        COUNT(*) AS "consumerTotal",
        COUNT(*) FILTER (
          WHERE delivery."status" IN ('SUCCEEDED', 'SKIPPED')
        ) AS "consumerTerminal",
        COUNT(*) FILTER (
          WHERE delivery."status" NOT IN ('SUCCEEDED', 'SKIPPED')
        ) AS "consumerUnhealthy",
        COUNT(*) FILTER (
          WHERE delivery."status" = 'SKIPPED'
            AND delivery."resultJson"->>'reason' IN (
              'INVALID_EVENT_LOG',
              'INVALID_BUSINESS_EVENT_CONSUMER_DELIVERY_CONTEXT'
            )
        ) AS "consumerInvalidTerminal"
      FROM "BusinessEventConsumerDelivery" delivery
      JOIN latest_event event ON event."id" = delivery."businessEventLogId"
      GROUP BY delivery."businessEventLogId"
    ),
    projection_summary AS (
      SELECT
        delivery."businessEventLogId",
        COUNT(*) AS "projectionTotal",
        COUNT(*) FILTER (
          WHERE delivery."status" = 'SUCCEEDED'
        ) AS "projectionSucceeded",
        COUNT(*) FILTER (
          WHERE delivery."status" <> 'SUCCEEDED'
        ) AS "projectionUnhealthy"
      FROM "ProjectionEventDelivery" delivery
      JOIN latest_event event ON event."id" = delivery."businessEventLogId"
      GROUP BY delivery."businessEventLogId"
    )
    SELECT
      event."family",
      event."eventKey",
      event."id" AS "eventLogId",
      event."targetType",
      event."targetId",
      event."actorUserId",
      event."createdAt" AS "eventCreatedAt",
      consumer."operationKey",
      COALESCE(consumer."consumerTotal", 0) AS "consumerTotal",
      COALESCE(consumer."consumerTerminal", 0) AS "consumerTerminal",
      COALESCE(consumer."consumerUnhealthy", 0) AS "consumerUnhealthy",
      COALESCE(consumer."consumerInvalidTerminal", 0) AS "consumerInvalidTerminal",
      COALESCE(projection."projectionTotal", 0) AS "projectionTotal",
      COALESCE(projection."projectionSucceeded", 0) AS "projectionSucceeded",
      COALESCE(projection."projectionUnhealthy", 0) AS "projectionUnhealthy"
    FROM latest_event event
    LEFT JOIN consumer_summary consumer
      ON consumer."businessEventLogId" = event."id"
    LEFT JOIN projection_summary projection
      ON projection."businessEventLogId" = event."id"
  `);
  return rows[0] ?? null;
}

async function latestLegacyFamilyEvent(family: typeof FAMILIES[number]) {
  const rows = await prisma.businessEventLog.findMany({
    where: { eventKey: { startsWith: family.eventLike.replace(".%", ".") } },
    orderBy: { createdAt: "desc" },
    take: 1,
    select: {
      id: true,
      eventKey: true,
      targetType: true,
      targetId: true,
      actorUserId: true,
      createdAt: true,
    },
  });
  return rows[0] ?? null;
}

async function main() {
  const [samples, legacyEvents] = await Promise.all([
    Promise.all(FAMILIES.map(latestFamilySample)),
    Promise.all(FAMILIES.map(latestLegacyFamilyEvent)),
  ]);
  const matrix = samples.map((sample, index) => {
    const family = FAMILIES[index].key;
    if (!sample) {
      const legacy = legacyEvents[index];
      return {
        family,
        status: "NO_POST_MIGRATION_SAMPLE" as const,
        latestLegacyEvent: legacy
          ? {
              eventKey: legacy.eventKey,
              eventLogId: legacy.id,
              targetType: legacy.targetType,
              targetId: legacy.targetId,
              actorUserId: legacy.actorUserId,
              eventCreatedAt: legacy.createdAt.toISOString(),
            }
          : null,
      };
    }
    const consumerTotal = Number(sample.consumerTotal);
    const consumerUnhealthy = Number(sample.consumerUnhealthy);
    const consumerInvalidTerminal = Number(sample.consumerInvalidTerminal);
    const projectionTotal = Number(sample.projectionTotal);
    const projectionUnhealthy = Number(sample.projectionUnhealthy);
    const status =
      consumerTotal > 0 &&
      projectionTotal > 0 &&
      consumerUnhealthy === 0 &&
      consumerInvalidTerminal === 0 &&
      projectionUnhealthy === 0
        ? "PASS"
        : "FAIL";
    return {
      family,
      status,
      eventKey: sample.eventKey,
      eventLogId: sample.eventLogId,
      operationKey: sample.operationKey,
      targetType: sample.targetType,
      targetId: sample.targetId,
      actorUserId: sample.actorUserId,
      actorPresent: Boolean(sample.actorUserId),
      eventCreatedAt: sample.eventCreatedAt?.toISOString() ?? null,
      consumers: {
        total: consumerTotal,
        terminal: Number(sample.consumerTerminal),
        unhealthy: consumerUnhealthy,
        invalidTerminal: consumerInvalidTerminal,
      },
      projections: {
        total: projectionTotal,
        succeeded: Number(sample.projectionSucceeded),
        unhealthy: projectionUnhealthy,
      },
    };
  });

  const deliveryHealth = await prisma.$queryRaw<Array<{
    status: string;
    count: bigint;
  }>>(Prisma.sql`
    SELECT "status", COUNT(*) AS "count"
    FROM "BusinessEventConsumerDelivery"
    GROUP BY "status"
    ORDER BY "status"
  `);
  const unhealthyDeliveryCount = deliveryHealth
    .filter((row) => !["SUCCEEDED", "SKIPPED"].includes(row.status))
    .reduce((sum, row) => sum + Number(row.count), 0);
  const invalidTerminalRows = await prisma.$queryRaw<Array<{
    operationKey: string;
    businessEventLogId: string | null;
    consumerKey: string;
    eventKey: string;
    targetType: string;
    targetId: string;
    reason: string | null;
    completedAt: Date | null;
  }>>(
    Prisma.sql`
      SELECT
        "operationKey",
        "businessEventLogId",
        "consumerKey",
        "eventKey",
        "targetType",
        "targetId",
        "resultJson"->>'reason' AS "reason",
        "completedAt"
      FROM "BusinessEventConsumerDelivery"
      WHERE "status" = 'SKIPPED'
        AND "resultJson"->>'reason' IN (
          'INVALID_EVENT_LOG',
          'INVALID_BUSINESS_EVENT_CONSUMER_DELIVERY_CONTEXT'
        )
      ORDER BY "createdAt" ASC
    `,
  );
  const invalidTerminalDeliveryCount = invalidTerminalRows.length;

  const result = {
    auditedAt: new Date().toISOString(),
    matrix,
    consumerDeliveryHealth: Object.fromEntries(
      deliveryHealth.map((row) => [row.status, Number(row.count)]),
    ),
    unhealthyDeliveryCount,
    invalidTerminalDeliveryCount,
    invalidTerminalDeliveries: invalidTerminalRows.map((row) => ({
      ...row,
      completedAt: row.completedAt?.toISOString() ?? null,
    })),
  };
  console.log(JSON.stringify(result, null, 2));

  const failed = matrix.filter((row) => row.status === "FAIL");
  if (failed.length || unhealthyDeliveryCount || invalidTerminalDeliveryCount) {
    throw new Error(
      `OPERATION_RUNTIME_MATRIX_FAILED: ${JSON.stringify({
        failedFamilies: failed.map((row) => row.family),
        unhealthyDeliveryCount,
        invalidTerminalDeliveryCount,
      })}`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
