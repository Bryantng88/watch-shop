import { runProjectionMaintenance } from "@/domains/projection/server/projection-maintenance.service";
import { prisma } from "@/server/db/client";

async function main() {
  const result = await runProjectionMaintenance({
    db: prisma,
    deliveryLimit: 20,
    deliveryConcurrency: 4,
    repairLimit: 2,
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.deliveryHealthAfter.healthy) {
    throw new Error("PROJECTION_DELIVERY_LIVENESS_GATE_FAILED");
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
