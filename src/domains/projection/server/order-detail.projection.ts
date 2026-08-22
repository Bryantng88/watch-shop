import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { ORDER_BUSINESS_EVENT_KEYS } from "@/domains/order/server/events/order-business-event.contract";
import { getOrderDetailRepo } from "@/domains/order/server/detail/order-detail.repo";
import { toNumberPrice, toPlain } from "@/domains/order/server/shared";
import { dbOrTx, type DB } from "@/server/db/client";
import { deleteProjectionRecords, listProjectionRecords, upsertProjectionRecord } from "./projection-record.repo";
import type { ProjectionBuildContext, ProjectionBuildResult, ProjectionBuilder, ProjectionScope } from "./projection.types";

export const ORDER_DETAIL_PROJECTION_KEY = "order-detail";
export const ORDER_DETAIL_PROJECTION_VERSION = 1;
const RELATED_EVENTS = [
  "payment.created", "payment.status_updated", "payment.paid", "payment.refunded",
  "shipment.created", "shipment.updated", "shipment.shipped", "shipment.delivered",
  "shipment.returning", "shipment.returned", "shipment.cancelled",
] as const;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function buildOrderDetailProjectionRow(db: DB, orderId: string) {
  const row = await getOrderDetailRepo(db, orderId);
  if (!row) return null;
  const subtotal = toNumberPrice(row.subtotal);
  const shippingAmount = toNumberPrice(row.shippingAmount);
  const depositPaid = toNumberPrice(row.depositPaid);
  const depositRequired = toNumberPrice(row.depositRequired);
  const data = toPlain({
    ...row,
    currency: "VND",
    subtotal,
    shippingAmount,
    depositPaid,
    depositRequired,
    totalAmount: subtotal,
    remainingAmount: Math.max(0, subtotal - depositPaid),
    items: row.orderItem.map((item) => ({
      ...item,
      listPrice: toNumberPrice(item.listPrice),
      unitPriceAgreed: toNumberPrice(item.unitPriceAgreed),
      subtotal: toNumberPrice(item.subtotal),
      linkedProductTitle: item.linkedOrderItem?.title ?? null,
    })),
    orderItem: undefined,
    OrderItem: undefined,
  });
  await upsertProjectionRecord(db, {
    projectionKey: ORDER_DETAIL_PROJECTION_KEY,
    projectionVersion: ORDER_DETAIL_PROJECTION_VERSION,
    rowKey: orderId,
    entityType: "ORDER",
    entityId: orderId,
    status: String(row.status),
    searchText: [row.refNo, row.customerName, row.shipPhone].filter(Boolean).join(" "),
    sortAt: row.updatedAt,
    sourceUpdatedAt: row.updatedAt,
    dataJson: data,
  });
  return data;
}

export async function getOrderDetailProjection(db: DB, orderId: string) {
  const rows = await listProjectionRecords(db, {
    projectionKey: ORDER_DETAIL_PROJECTION_KEY,
    entityType: "ORDER",
    entityId: orderId,
    limit: 1,
  });
  return rows[0]?.dataJson;
}

export async function rebuildOrderDetailProjectionRows(db: DB, orderIds?: string[]) {
  const ids = [...new Set((orderIds ?? []).map(clean).filter(Boolean))];
  if (!ids.length) {
    await deleteProjectionRecords(db, { projectionKey: ORDER_DETAIL_PROJECTION_KEY });
  }
  const orders = await dbOrTx(db).order.findMany({
    where: ids.length ? { id: { in: ids } } : undefined,
    select: { id: true },
    orderBy: { updatedAt: "desc" },
  });
  for (const order of orders) await buildOrderDetailProjectionRow(db, order.id);
  return orders.length;
}

async function resolveOrderId(db: DB, targetType: unknown, targetId: unknown) {
  const type = clean(targetType).toUpperCase();
  const id = clean(targetId);
  if (!id) return null;
  if (type === "ORDER") return id;
  if (type === "PAYMENT") {
    return (await dbOrTx(db).payment.findUnique({ where: { id }, select: { order_id: true } }))?.order_id ?? null;
  }
  if (type === "SHIPMENT") {
    return (await dbOrTx(db).shipment.findUnique({ where: { id }, select: { orderId: true } }))?.orderId ?? null;
  }
  return null;
}

function result(context: ProjectionBuildContext, scope: ProjectionScope, applied: number): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason: applied ? undefined : "ORDER_NOT_FOUND",
  };
}

async function rebuild(db: DB, context: ProjectionBuildContext & { scope: ProjectionScope }) {
  const orderId = await resolveOrderId(db, context.scope.targetType, context.scope.targetId);
  if (clean(context.scope.targetId) && !orderId) return result(context, context.scope, 0);
  const orders = orderId
    ? [{ id: orderId }]
    : await dbOrTx(db).order.findMany({
        select: { id: true },
        orderBy: { updatedAt: "desc" },
        take: context.scope.limit ?? undefined,
      });
  if (!orderId) await deleteProjectionRecords(db, { projectionKey: ORDER_DETAIL_PROJECTION_KEY });
  let applied = 0;
  for (const order of orders) if (await buildOrderDetailProjectionRow(db, order.id)) applied += 1;
  return result(context, context.scope, applied);
}

async function buildFromEvent(db: DB, context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext }) {
  return rebuild(db, {
    ...context,
    scope: { targetType: context.sourceEvent.targetType, targetId: context.sourceEvent.targetId, limit: 1 },
  });
}

export const orderDetailProjectionBuilder: ProjectionBuilder = {
  key: ORDER_DETAIL_PROJECTION_KEY,
  version: ORDER_DETAIL_PROJECTION_VERSION,
  description: "Persistent event-driven read model for Admin Order Detail.",
  sourceEvents: [...ORDER_BUSINESS_EVENT_KEYS, ...RELATED_EVENTS],
  targetTypes: ["ORDER", "PAYMENT", "SHIPMENT"],
  buildFromEvent,
  rebuild,
};
