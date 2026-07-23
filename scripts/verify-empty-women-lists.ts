import { getAcquisitionListProjection } from "../src/domains/acquisition/server/list/acquisition-list.service";
import { getAdminWatchList } from "../src/domains/watch/server/list/watch-list.service";
import { prisma } from "../src/server/db/client";

async function main() {
  const [watchResult, acquisitionResult, allAcquisitionResult] = await Promise.all([
    getAdminWatchList({
      audienceSegment: "WOMEN",
      view: "all",
      page: 1,
      pageSize: 20,
      withTotal: true,
      meta: "lite",
    }),
    getAcquisitionListProjection({
      audienceSegment: "WOMEN",
      view: "all",
      page: 1,
      pageSize: 20,
    }),
    getAcquisitionListProjection({
      view: "all",
      page: 1,
      pageSize: 20,
    }),
  ]);

  const result = {
    watches: {
      items: watchResult.items.length,
      total: watchResult.total,
    },
    acquisitions: {
      items: acquisitionResult.items.length,
      total: acquisitionResult.total,
    },
    allAcquisitions: {
      items: allAcquisitionResult.items.length,
      total: allAcquisitionResult.total,
    },
  };
  console.log(JSON.stringify(result, null, 2));
  if (result.watches.items !== 0 || result.acquisitions.items !== 0) {
    throw new Error("Expected empty WOMEN lists for the current dataset.");
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
