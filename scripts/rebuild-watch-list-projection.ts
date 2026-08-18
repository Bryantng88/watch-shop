import { rebuildWatchListProjectionRows } from "../src/domains/projection/server/watch-list";
import { prisma } from "../src/server/db/client";

async function main() {
  const result = await rebuildWatchListProjectionRows(prisma);
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
