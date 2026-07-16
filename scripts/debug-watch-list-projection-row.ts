import { prisma } from "@/server/db/client";

const watchId = process.argv[2] ?? "";

async function main() {
  if (!watchId) throw new Error("Usage: npx tsx scripts/debug-watch-list-projection-row.ts <watchId>");

  const watch = await prisma.watch.findUnique({
    where: { id: watchId },
    select: {
      id: true,
      serviceStage: true,
      product: {
        select: {
          title: true,
          sku: true,
        },
      },
    },
  });

  const projection = await prisma.$queryRawUnsafe<Array<{
    rowKey: string;
    dataJson: Record<string, unknown> | null;
  }>>(
    'SELECT "rowKey", "dataJson" FROM "ProjectionRecord" WHERE "projectionKey" = $1 AND "rowKey" = $2',
    "watch-list",
    watchId,
  );

  console.log(JSON.stringify({
    watch,
    projection: projection.map((row) => ({
      rowKey: row.rowKey,
      keys: Object.keys(row.dataJson ?? {}),
      filters: row.dataJson?.filters ?? null,
      row: row.dataJson?.row
        ? {
          title: (row.dataJson.row as Record<string, unknown>).title,
          imageUrl: (row.dataJson.row as Record<string, unknown>).imageUrl,
          imageKey: (row.dataJson.row as Record<string, unknown>).imageKey,
          serviceState: (row.dataJson.row as Record<string, unknown>).serviceState,
          sku: (row.dataJson.row as Record<string, unknown>).sku,
        }
        : null,
      v2Row: row.dataJson?.v2Row
        ? {
          title: (row.dataJson.v2Row as Record<string, unknown>).title,
          imageUrl: (row.dataJson.v2Row as Record<string, unknown>).imageUrl,
          imageKey: (row.dataJson.v2Row as Record<string, unknown>).imageKey,
          serviceStatus: (row.dataJson.v2Row as Record<string, unknown>).serviceStatus,
          serviceStatusLabel: (row.dataJson.v2Row as Record<string, unknown>).serviceStatusLabel,
        }
        : null,
    })),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
