import { prisma } from "@/server/db/client";
import { rebuildProjection } from "@/domains/projection/server/projection.runner";

async function main() {
  const result = await rebuildProjection(prisma, {
    projectionKey: "watch-list",
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
