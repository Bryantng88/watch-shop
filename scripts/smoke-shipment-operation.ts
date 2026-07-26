import { PaymentMethod, PaymentStatus, PaymentType } from "@prisma/client";

import { ensureCoordinationCycle } from "../src/domains/coordination/server/coordination-cycle.service";
import {
  listShipmentOperationQueueProjection,
} from "../src/domains/projection/server/shipment-operation-queue.projection";
import { prisma } from "../src/server/db/client";

async function main() {
  const cycle = await ensureCoordinationCycle(prisma, {
    context: "OPERATION",
    provisionWorkTickets: true,
  });
  const stages = await Promise.all(
    (["SHIPMENT_WAITING", "SHIPMENT_PROCESSING", "SHIPMENT_DONE"] as const)
      .map(async (stage) => ({
        stage,
        ...(await listShipmentOperationQueueProjection(prisma, {
          stage,
          page: 1,
          pageSize: 20,
        })),
      })),
  );
  const shipmentFees = await prisma.payment.count({
    where: { type: PaymentType.SHIPMENT, shipment_id: { not: null } },
  });
  const codPayments = await prisma.payment.count({
    where: {
      type: PaymentType.ORDER,
      method: PaymentMethod.COD,
      status: { in: [PaymentStatus.UNPAID, PaymentStatus.COLLECTED] },
    },
  });
  console.log(JSON.stringify({
    taskId: cycle.task.id,
    stages: stages.map((stage) => ({
      stage: stage.stage,
      total: stage.total,
      loaded: stage.rows.length,
      withImage: stage.rows.filter((row) => Boolean(row.imageUrl)).length,
    })),
    payments: { shipmentFees, codPayments },
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
