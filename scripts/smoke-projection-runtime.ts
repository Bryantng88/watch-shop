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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
