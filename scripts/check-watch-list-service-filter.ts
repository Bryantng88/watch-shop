import { getAdminWatchList } from "@/domains/watch/server/list/watch-list.service";
import { prisma } from "@/server/db/client";

const WATCH_ID = "aa2d6484-c931-4987-8de5-33595f172efa";

async function main() {
  const watch = await prisma.watch.findUnique({
    where: { id: WATCH_ID },
    select: {
      id: true,
      serviceStage: true,
      updatedAt: true,
      product: {
        select: {
          title: true,
        },
      },
    },
  });

  const projectionRows = await prisma.$queryRaw<
    Array<{ dataJson: unknown }>
  >`SELECT "dataJson" FROM "ProjectionRecord" WHERE "projectionKey" = 'watch-list' AND "rowKey" = ${WATCH_ID} LIMIT 1`;
  const projection = projectionRows[0] ?? null;

  const data = projection?.dataJson as
    | {
        filters?: Record<string, unknown>;
        row?: Record<string, unknown>;
        v2Row?: Record<string, unknown>;
      }
    | null
    | undefined;

  const list = await getAdminWatchList({
    serviceStatus: "IN_SERVICE",
    page: 1,
    pageSize: 10,
    withTotal: false,
    meta: "lite",
  });

  console.log(
    JSON.stringify(
      {
        watch,
        projection: {
          filters: {
            serviceStage: data?.filters?.serviceStage,
            serviceStatus: data?.filters?.serviceStatus,
          },
          row: {
            serviceState: data?.row?.serviceState,
            serviceStatus: data?.row?.serviceStatus,
          },
          v2Row: {
            serviceStatus: data?.v2Row?.serviceStatus,
            serviceStatusLabel: data?.v2Row?.serviceStatusLabel,
          },
        },
        inServiceList: {
          count: list.items.length,
          containsWatch: list.items.some((item) => item.id === WATCH_ID),
          items: list.items.map((item) => ({
            id: item.id,
            title: item.title,
            serviceState: item.serviceState,
            serviceStatus: item.v2Row?.serviceStatus,
            serviceStatusLabel: item.v2Row?.serviceStatusLabel,
          })),
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
