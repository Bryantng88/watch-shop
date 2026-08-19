import { prisma } from "../src/server/db/client";
import { ORDER_ACTIVE_HOLD_STATUSES, ORDER_ACTIVE_SOLD_STATUSES } from "../src/domains/order/shared/order-status";

type Segment = "MEN" | "WOMEN" | "UNISEX";
const segments: Segment[] = ["MEN", "WOMEN", "UNISEX"];
const counter = () => Object.fromEntries(segments.map((segment) => [segment, 0])) as Record<Segment, number>;

async function main() {
  const watches = await prisma.watch.findMany({
    select: {
      id: true, audienceSegment: true, saleStage: true, stockStage: true,
      product: { select: { status: true, orderItem: { select: { order: { select: { status: true } } } } } },
    },
  });
  const projections = await prisma.projectionRecord.findMany({
    where: { projectionKey: "watch-list", rowKey: { in: watches.map((watch) => watch.id) } },
    select: { rowKey: true, dataJson: true },
  });
  const projected = new Map(projections.map((item) => {
    const data = item.dataJson as { filters?: { saleStatus?: unknown } };
    return [item.rowKey, String(data.filters?.saleStatus ?? "")];
  }));
  const sourceMismatch = counter();
  const projectionMismatch = counter();

  for (const watch of watches) {
    const statuses = watch.product.orderItem.map((item) => String(item.order.status));
    const expected = statuses.some((status) => (ORDER_ACTIVE_SOLD_STATUSES as readonly string[]).includes(status))
      ? "SOLD"
      : statuses.some((status) => (ORDER_ACTIVE_HOLD_STATUSES as readonly string[]).includes(status))
        ? "HOLD"
        : null;
    if (!expected) continue;
    const segment = watch.audienceSegment as Segment;
    const sourceConsistent = expected === "SOLD"
      ? String(watch.product.status) === "SOLD" && String(watch.saleStage) === "SOLD" && String(watch.stockStage) === "OUT_OF_STOCK"
      : String(watch.product.status) === "HOLD" && String(watch.saleStage) === "HOLD" && String(watch.stockStage) === "RESERVED";
    if (!sourceConsistent) sourceMismatch[segment] += 1;
    if (projected.get(watch.id) !== expected) projectionMismatch[segment] += 1;
  }

  const result = { sourceMismatch, projectionMismatch };
  console.log(JSON.stringify(result, null, 2));
  if ([...Object.values(sourceMismatch), ...Object.values(projectionMismatch)].some((value) => value > 0)) {
    throw new Error("ORDER_WATCH_CONSISTENCY_AUDIT_FAILED");
  }
}

main().finally(() => prisma.$disconnect());
