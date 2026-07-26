import { prisma, type DB } from "@/server/db/client";
import { processPendingProjectionDeliveries } from "./projection-delivery.service";
import { repairDriftedProjections } from "./projection-observability.service";

export async function runProjectionMaintenance(input: {
  db?: DB;
  deliveryLimit?: number;
  deliveryConcurrency?: number;
  repairLimit?: number;
} = {}) {
  const db = input.db ?? prisma;
  const delivery = await processPendingProjectionDeliveries({
    db,
    limit: input.deliveryLimit ?? 40,
    concurrency: input.deliveryConcurrency ?? 4,
  });
  const consistency = await repairDriftedProjections(db, {
    limit: input.repairLimit ?? 2,
  });

  return { delivery, consistency };
}
