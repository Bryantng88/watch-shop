import { prisma, type DB } from "@/server/db/client";
import { processPendingProjectionDeliveries } from "./projection-delivery.service";
import { getProjectionDeliveryHealth } from "./projection-delivery.repo";
import { repairDriftedProjections } from "./projection-observability.service";
import { processBusinessEventConsumerDeliveries } from "@/domains/event/delivery";

export async function runProjectionMaintenance(input: {
  db?: DB;
  deliveryLimit?: number;
  deliveryConcurrency?: number;
  repairLimit?: number;
} = {}) {
  const db = input.db ?? prisma;
  const deliveryHealthBefore = await getProjectionDeliveryHealth(db);
  const consumerDelivery = await processBusinessEventConsumerDeliveries({
    db,
    limit: input.deliveryLimit ?? 40,
    concurrency: input.deliveryConcurrency ?? 4,
    processProjection: false,
  });
  const delivery = await processPendingProjectionDeliveries({
    db,
    limit: input.deliveryLimit ?? 40,
    concurrency: input.deliveryConcurrency ?? 4,
  });
  const consistency = await repairDriftedProjections(db, {
    limit: input.repairLimit ?? 2,
  });
  const deliveryHealthAfter = await getProjectionDeliveryHealth(db);

  return {
    consumerDelivery,
    delivery,
    deliveryHealthBefore,
    deliveryHealthAfter,
    consistency,
  };
}
