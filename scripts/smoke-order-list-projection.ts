import { getBusinessEventContract } from "../src/domains/event/catalog/business-event-catalog";
import {
  ORDER_LIST_PROJECTION_KEY,
  queryOrderListProjection,
} from "../src/domains/projection/server/order-list.projection";
import { prisma } from "../src/server/db/client";
import {
  getOrderDetailProjection,
  ORDER_DETAIL_PROJECTION_KEY,
} from "../src/domains/projection/server/order-detail.projection";

async function main() {
  const startedAt = Date.now();
  const result = await queryOrderListProjection(prisma, {
    view: "all",
    page: 1,
    pageSize: 20,
    sort: "updatedDesc",
  });
  const sourceCount = await prisma.order.count();
  const detailCount = await prisma.projectionRecord.count({
    where: { projectionKey: ORDER_DETAIL_PROJECTION_KEY },
  });
  const detailStartedAt = Date.now();
  const detail = result.items[0]
    ? await getOrderDetailProjection(prisma, result.items[0].id)
    : null;
  console.log(JSON.stringify({
    elapsedMs: Date.now() - startedAt,
    projectionKey: ORDER_LIST_PROJECTION_KEY,
    sourceCount,
    projectionCount: result.projectionRowCount,
    detailProjectionCount: detailCount,
    detailReadMs: Date.now() - detailStartedAt,
    detailLoaded: Boolean(detail),
    loaded: result.items.length,
    withImages: result.items.filter((item) => Boolean(item.previewImageUrl)).length,
    counts: result.counts,
    eventContracts: [
      "order.created",
      "order.updated",
      "order.posted",
      "order.verified",
      "order.rejected",
      "order.cancelled",
      "order.paid",
      "order.completed",
    ].map((key) => ({ key, registered: Boolean(getBusinessEventContract(key)) })),
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
