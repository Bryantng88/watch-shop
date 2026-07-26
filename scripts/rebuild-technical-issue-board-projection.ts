import { rebuildProjection } from "@/domains/projection/server/projection.runner";
import { prisma } from "@/server/db/client";

async function main() {
  const result = await rebuildProjection(prisma, {
    projectionKey: "technical-issue-board",
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
