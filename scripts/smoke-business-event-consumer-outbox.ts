import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";

import {
  enqueueBusinessEventConsumerDeliveries,
  getBusinessEventConsumerDeliverySummary,
  processBusinessEventConsumerDeliveries,
  processBusinessEventOperation,
} from "../src/domains/event/delivery";
import { prisma } from "../src/server/db/client";

async function main() {
  const operationKey = `consumer-outbox-smoke:${randomUUID()}`;
  const rollbackOperationKey = `${operationKey}:rollback`;
  const orderedOperationKey = `${operationKey}:ordered`;
  try {
    const input = {
      operationKey,
      consumerKeys: ["notification"] as const,
      eventKey: "audit.consumer_delivery.smoke",
      targetType: "GENERAL",
      targetId: operationKey,
      effect: "ASSERT" as const,
      payload: { sourceId: operationKey },
    };
    await enqueueBusinessEventConsumerDeliveries(prisma, {
      ...input,
      consumerKeys: [...input.consumerKeys],
    });
    await enqueueBusinessEventConsumerDeliveries(prisma, {
      ...input,
      consumerKeys: [...input.consumerKeys],
    });

    const before = await getBusinessEventConsumerDeliverySummary(prisma, operationKey);
    if (before.length !== 1 || before[0]?.status !== "PENDING") {
      throw new Error(`Expected one PENDING idempotent row, received ${JSON.stringify(before)}`);
    }

    const first = await processBusinessEventConsumerDeliveries({
      db: prisma,
      operationKey,
      limit: 5,
      concurrency: 1,
      processProjection: false,
    });
    const after = await getBusinessEventConsumerDeliverySummary(prisma, operationKey);
    if (first.claimed !== 1 || after[0]?.status !== "SKIPPED") {
      throw new Error(`Expected one SKIPPED delivery, received ${JSON.stringify({ first, after })}`);
    }

    const second = await processBusinessEventConsumerDeliveries({
      db: prisma,
      operationKey,
      limit: 5,
      concurrency: 1,
      processProjection: false,
    });
    if (second.claimed !== 0) {
      throw new Error(`Succeeded/skipped delivery was claimed twice: ${JSON.stringify(second)}`);
    }

    try {
      await prisma.$transaction(async (tx) => {
        await enqueueBusinessEventConsumerDeliveries(tx, {
          ...input,
          operationKey: rollbackOperationKey,
          targetId: rollbackOperationKey,
          consumerKeys: [...input.consumerKeys],
        });
        throw new Error("EXPECTED_ROLLBACK");
      });
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "EXPECTED_ROLLBACK") throw error;
    }
    const rolledBack = await getBusinessEventConsumerDeliverySummary(
      prisma,
      rollbackOperationKey,
    );
    if (rolledBack.length !== 0) {
      throw new Error(`Consumer delivery escaped transaction rollback: ${JSON.stringify(rolledBack)}`);
    }

    await enqueueBusinessEventConsumerDeliveries(prisma, {
      ...input,
      operationKey: orderedOperationKey,
      targetId: orderedOperationKey,
      consumerKeys: ["coordination", "notification"],
    });
    const ordered = await processBusinessEventOperation(orderedOperationKey);
    const claimedByPass = ordered.consumers.passes.map((pass) => pass.claimed);
    if (claimedByPass[0] !== 1 || claimedByPass[1] !== 1) {
      throw new Error(`Coordination ordering was not preserved: ${JSON.stringify(claimedByPass)}`);
    }

    console.info(JSON.stringify({
      ok: true,
      operationKey,
      idempotentRows: before.length,
      firstClaimed: first.claimed,
      terminalStatus: after[0]?.status,
      secondClaimed: second.claimed,
      rollbackRows: rolledBack.length,
      orderedClaimedByPass: claimedByPass,
    }, null, 2));
  } finally {
    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM "BusinessEventConsumerDelivery"
      WHERE "operationKey" IN (
        ${operationKey},
        ${rollbackOperationKey},
        ${orderedOperationKey}
      )
    `);
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
