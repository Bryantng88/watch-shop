import { rebuildProjection } from "@/domains/projection/server/projection.runner";
import { prisma } from "@/server/db/client";

const projectionKeys = [
  "watch-media-queue",
  "media-operation-board",
  "payment-owner-summary",
  "payment-list",
] as const;

async function main() {
  const results = [];
  for (const projectionKey of projectionKeys) {
    results.push(await rebuildProjection(prisma, { projectionKey }));
  }
  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
