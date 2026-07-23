import { AudienceSegment } from "@prisma/client";
import { getAcquisitionListDashboard } from "../src/domains/acquisition/server/dashboard/acquisition-list-dashboard.service";
import { prisma } from "../src/server/db/client";

function metricValue(
  dashboard: Awaited<ReturnType<typeof getAcquisitionListDashboard>>,
  key: string,
) {
  return Number(dashboard.metrics.find((metric) => metric.key === key)?.value ?? -1);
}

async function main() {
  const [menWatch, womenWatch, menAcquisition, womenAcquisition, counts, genderCounts] =
    await Promise.all([
      prisma.watch.groupBy({
        by: ["audienceSegment"],
        where: { audienceSegment: AudienceSegment.MEN },
        _count: { _all: true },
      }),
      prisma.watch.groupBy({
        by: ["audienceSegment"],
        where: { audienceSegment: AudienceSegment.WOMEN },
        _count: { _all: true },
      }),
      getAcquisitionListDashboard("MEN"),
      getAcquisitionListDashboard("WOMEN"),
      Promise.all([
        prisma.watch.count({ where: { audienceSegment: AudienceSegment.MEN } }),
        prisma.watch.count({ where: { audienceSegment: AudienceSegment.WOMEN } }),
        prisma.acquisition.count({ where: { audienceSegment: AudienceSegment.MEN } }),
        prisma.acquisition.count({ where: { audienceSegment: AudienceSegment.WOMEN } }),
      ]),
      prisma.watch.groupBy({
        by: ["gender"],
        _count: { _all: true },
      }),
    ]);

  const actual = {
    menWatch: menWatch[0]?._count._all ?? 0,
    womenWatch: womenWatch[0]?._count._all ?? 0,
    menAcquisition: metricValue(menAcquisition, "all"),
    womenAcquisition: metricValue(womenAcquisition, "all"),
  };
  const expected = {
    menWatch: counts[0],
    womenWatch: counts[1],
    menAcquisition: counts[2],
    womenAcquisition: counts[3],
  };
  console.log(JSON.stringify({ actual, expected, genderCounts }, null, 2));
  if (JSON.stringify(actual) !== JSON.stringify(expected)) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
