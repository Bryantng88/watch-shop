import { prisma } from "../src/server/db/client";
import { runBusinessEventTransaction } from "../src/domains/event/server/business-event-transaction";
import { recordOrderMutation } from "../src/domains/order/server/events/order-business-event.emitter";
import { syncWatchInventoryFromOrders } from "../src/domains/order/server/order-watch-sync.service";
import { ORDER_ACTIVE_HOLD_STATUSES, ORDER_ACTIVE_SOLD_STATUSES } from "../src/domains/order/shared/order-status";

async function main() {
  if (process.env.CONFIRM_REPAIR_ORDER_WATCH_CONSISTENCY !== "YES") {
    throw new Error("Set CONFIRM_REPAIR_ORDER_WATCH_CONSISTENCY=YES to run this repair.");
  }
  const watches = await prisma.watch.findMany({
    where: { product: { orderItem: { some: {} } } },
    select: {
      productId: true, saleStage: true, stockStage: true,
      product: { select: { status: true, orderItem: { select: { orderId: true, order: { select: { status: true } } } } } },
    },
  });
  const affected = watches.filter((watch) => {
    const statuses = watch.product.orderItem.map((item) => String(item.order.status));
    const expected = statuses.some((status) => (ORDER_ACTIVE_SOLD_STATUSES as readonly string[]).includes(status))
      ? "SOLD"
      : statuses.some((status) => (ORDER_ACTIVE_HOLD_STATUSES as readonly string[]).includes(status)) ? "HOLD" : null;
    if (expected === "SOLD") return String(watch.product.status) !== "SOLD" || String(watch.saleStage) !== "SOLD" || String(watch.stockStage) !== "OUT_OF_STOCK";
    if (expected === "HOLD") return String(watch.product.status) !== "HOLD" || String(watch.saleStage) !== "HOLD" || String(watch.stockStage) !== "RESERVED";
    return false;
  });
  const productIds = affected.map((watch) => watch.productId);
  const orderIds = Array.from(new Set(affected.flatMap((watch) => watch.product.orderItem.map((item) => item.orderId))));
  if (!productIds.length) {
    console.log(JSON.stringify({ reconciledProducts: 0, refreshedOrders: 0 }, null, 2));
    return;
  }

  await runBusinessEventTransaction(async (tx, delivery) => {
    await syncWatchInventoryFromOrders(tx, productIds);
    for (const orderId of orderIds) {
      delivery.track(await recordOrderMutation(tx, {
        eventKey: "order.updated",
        orderId,
        source: "ORDER_WATCH_CONSISTENCY_REPAIR",
        note: "Reconciled Product/Watch inventory state from canonical Order state.",
      }));
    }
  }, { timeout: 120_000 });
  console.log(JSON.stringify({ reconciledProducts: productIds.length, refreshedOrders: orderIds.length }, null, 2));
}

main().finally(() => prisma.$disconnect());
