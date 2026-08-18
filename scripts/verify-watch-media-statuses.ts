import "dotenv/config";
import { Prisma } from "@prisma/client";

import { prisma } from "../src/server/db/client";
import { WATCH_LIST_PROJECTION_VERSION } from "../src/domains/projection/server/watch-list";

type StatusCount = {
  status: string | null;
  count: bigint | number;
};

async function main() {
  const counts = await prisma.$queryRaw<StatusCount[]>(Prisma.sql`
    SELECT
      "dataJson"->'filters'->>'mediaStatus' AS "status",
      COUNT(*) AS "count"
    FROM "ProjectionRecord"
    WHERE "projectionKey" = 'watch-list'
      AND "projectionVersion" = ${WATCH_LIST_PROJECTION_VERSION}
    GROUP BY "dataJson"->'filters'->>'mediaStatus'
    ORDER BY COUNT(*) DESC
  `);

  console.log(JSON.stringify(
    counts.map((row) => ({ status: row.status, count: Number(row.count) })),
    null,
    2,
  ));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
