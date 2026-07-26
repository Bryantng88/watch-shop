import {
  ORDER_LIST_PROJECTION_KEY,
  rebuildOrderListProjectionRows,
} from "../src/domains/projection/server/order-list.projection";
import {
  ORDER_DETAIL_PROJECTION_KEY,
  rebuildOrderDetailProjectionRows,
} from "../src/domains/projection/server/order-detail.projection";
import { prisma } from "../src/server/db/client";

async function main() {
  const before = await prisma.projectionRecord.count({
    where: { projectionKey: ORDER_LIST_PROJECTION_KEY },
  });
  const applied = await rebuildOrderListProjectionRows(prisma);
  const after = await prisma.projectionRecord.count({
    where: { projectionKey: ORDER_LIST_PROJECTION_KEY },
  });
  const detailBefore = await prisma.projectionRecord.count({
    where: { projectionKey: ORDER_DETAIL_PROJECTION_KEY },
  });
  const detailApplied = await rebuildOrderDetailProjectionRows(prisma);
  const detailAfter = await prisma.projectionRecord.count({
    where: { projectionKey: ORDER_DETAIL_PROJECTION_KEY },
  });
  console.log(JSON.stringify({
    list: { projectionKey: ORDER_LIST_PROJECTION_KEY, before, applied, after },
    detail: {
      projectionKey: ORDER_DETAIL_PROJECTION_KEY,
      before: detailBefore,
      applied: detailApplied,
      after: detailAfter,
    },
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
