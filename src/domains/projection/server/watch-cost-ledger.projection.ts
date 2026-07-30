import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { ORDER_BUSINESS_EVENT_KEYS } from "@/domains/order/server/events/order-business-event.contract";
import { SHIPMENT_OPERATION_EVENT_KEYS } from "@/domains/shipment/server/events/shipment-business-event.contract";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  deleteProjectionRecords,
  listProjectionRecords,
  upsertProjectionRecord,
} from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const WATCH_COST_LEDGER_PROJECTION_KEY = "watch-cost-ledger";
export const WATCH_COST_LEDGER_PROJECTION_VERSION = 1;

const PAYMENT_EVENTS = [
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
  "payment.exception_marked",
] as const;

const ACQUISITION_EVENTS = [
  "acquisition.created",
  "acquisition.updated",
  "acquisition.items.updated",
  "acquisition.posted",
  "acquisition.canceled",
] as const;

const SERVICE_EVENTS = [
  "service_request.created",
  "service_request.status_changed",
  "service_request.completed",
  "technical_issue.created",
  "technical_issue.updated",
  "technical_issue.confirmed",
  "technical_issue.started",
  "technical_issue.completed",
  "technical_issue.canceled",
  "technical_issue.reopened",
] as const;

const SOURCE_EVENTS = [
  ...PAYMENT_EVENTS,
  ...ACQUISITION_EVENTS,
  ...SERVICE_EVENTS,
  ...ORDER_BUSINESS_EVENT_KEYS,
  ...SHIPMENT_OPERATION_EVENT_KEYS,
] as const;

export type WatchCostLedgerProjection = {
  productId: string;
  currency: string;
  acquisitionAmount: number;
  serviceAmount: number;
  shipmentAmount: number;
  otherAmount: number;
  landedCost: number;
  costLedger: Array<{
    id: string;
    refNo: string | null;
    type: string;
    purpose: string;
    status: string;
    amount: number;
    currency: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    acquisitionId: string | null;
    orderId: string | null;
    shipmentId: string | null;
    serviceRequestId: string | null;
    technicalIssueId: string | null;
    note: string | null;
    allocationDivisor: number;
  }>;
  serviceFees: Array<{
    id: string;
    serviceRequestId: string;
    summary: string | null;
    status: string;
    amount: number | null;
    source: "ACTUAL" | "ESTIMATED" | "NONE";
    createdAt: string;
    updatedAt: string;
  }>;
  shipmentFees: Array<{
    id: string;
    orderId: string;
    refNo: string | null;
    status: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  sourceUpdatedAt: string | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function toNumber(value: unknown) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function maxDate(values: Array<Date | null | undefined>) {
  const timestamps = values
    .filter((value): value is Date => value instanceof Date)
    .map((value) => value.getTime());
  return timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null;
}

export async function buildWatchCostLedgerProjectionRow(db: DB, productId: string) {
  const client = dbOrTx(db);
  const [acquisitionItems, orderItems, serviceRequests] = await Promise.all([
    client.acquisitionItem.findMany({
      where: { productId },
      select: {
        id: true,
        acquisitionId: true,
        unitCost: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    client.orderItem.findMany({
      where: { productId },
      select: {
        orderId: true,
        createdAt: true,
        updatedAt: true,
        order: {
          select: {
            _count: { select: { orderItem: true } },
            shipments: {
              select: {
                id: true,
                refNo: true,
                status: true,
                shippingAmount: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    }),
    client.serviceRequest.findMany({
      where: { productId },
      select: {
        id: true,
        updatedAt: true,
        technicalIssue: {
          select: {
            id: true,
            summary: true,
            executionStatus: true,
            actualCost: true,
            estimatedCost: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    }),
  ]);

  const acquisitionIds = [...new Set(acquisitionItems.map((item) => item.acquisitionId))];
  const orderIds = [...new Set(orderItems.map((item) => item.orderId))];
  const shipmentIds = [...new Set(
    orderItems.flatMap((item) => item.order.shipments.map((shipment) => shipment.id)),
  )];
  const serviceRequestIds = serviceRequests.map((request) => request.id);
  const technicalIssueIds = serviceRequests.flatMap((request) =>
    request.technicalIssue.map((issue) => issue.id),
  );
  const paymentScopes = [
    acquisitionIds.length ? { acquisition_id: { in: acquisitionIds } } : null,
    orderIds.length ? { order_id: { in: orderIds } } : null,
    shipmentIds.length ? { shipment_id: { in: shipmentIds } } : null,
    serviceRequestIds.length ? { service_request_id: { in: serviceRequestIds } } : null,
    technicalIssueIds.length ? { technical_issue_id: { in: technicalIssueIds } } : null,
  ].filter((scope): scope is NonNullable<typeof scope> => Boolean(scope));
  const payments = paymentScopes.length
    ? await client.payment.findMany({
        where: { direction: "OUT", OR: paymentScopes },
        orderBy: [{ paidAt: "desc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          refNo: true,
          type: true,
          purpose: true,
          status: true,
          amount: true,
          currency: true,
          paidAt: true,
          createdAt: true,
          updatedAt: true,
          acquisition_id: true,
          order_id: true,
          shipment_id: true,
          service_request_id: true,
          technical_issue_id: true,
          note: true,
        },
      })
    : [];
  const orderItemCountByOrderId = new Map(
    orderItems.map((item) => [item.orderId, Math.max(1, item.order._count.orderItem)]),
  );
  const costLedger = payments.map((payment) => ({
    id: payment.id,
    refNo: payment.refNo,
    type: String(payment.type),
    purpose: String(payment.purpose),
    status: String(payment.status),
    amount: toNumber(payment.amount),
    currency: payment.currency,
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
    acquisitionId: payment.acquisition_id,
    orderId: payment.order_id,
    shipmentId: payment.shipment_id,
    serviceRequestId: payment.service_request_id,
    technicalIssueId: payment.technical_issue_id,
    note: payment.note,
    allocationDivisor: payment.order_id
      ? orderItemCountByOrderId.get(payment.order_id) ?? 1
      : 1,
  }));
  const serviceFees = serviceRequests.flatMap((request) =>
    request.technicalIssue.map((issue) => ({
      id: issue.id,
      serviceRequestId: request.id,
      summary: issue.summary,
      status: String(issue.executionStatus),
      amount: issue.actualCost != null
        ? toNumber(issue.actualCost)
        : issue.estimatedCost != null
          ? toNumber(issue.estimatedCost)
          : null,
      source: issue.actualCost != null
        ? "ACTUAL" as const
        : issue.estimatedCost != null
          ? "ESTIMATED" as const
          : "NONE" as const,
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
    })),
  );
  const shipmentFees = orderItems.flatMap((item) =>
    item.order.shipments.map((shipment) => ({
      id: shipment.id,
      orderId: item.orderId,
      refNo: shipment.refNo,
      status: String(shipment.status),
      amount: toNumber(shipment.shippingAmount) /
        (orderItemCountByOrderId.get(item.orderId) ?? 1),
      createdAt: shipment.createdAt.toISOString(),
      updatedAt: shipment.updatedAt.toISOString(),
    })),
  );
  const paymentAmount = (type: string) =>
    costLedger
      .filter((payment) => payment.type === type)
      .reduce((total, payment) => total + payment.amount / payment.allocationDivisor, 0);
  const linkedIssueIds = new Set(
    costLedger.map((payment) => payment.technicalIssueId).filter(Boolean),
  );
  const linkedServiceRequestIds = new Set(
    costLedger.map((payment) => payment.serviceRequestId).filter(Boolean),
  );
  const linkedShipmentIds = new Set(
    costLedger.map((payment) => payment.shipmentId).filter(Boolean),
  );
  const acquisitionAmount = toNumber(acquisitionItems[0]?.unitCost);
  const serviceAmount = paymentAmount("SERVICE") + serviceFees
    .filter((fee) =>
      !linkedIssueIds.has(fee.id) &&
      !linkedServiceRequestIds.has(fee.serviceRequestId),
    )
    .reduce((total, fee) => total + toNumber(fee.amount), 0);
  const shipmentAmount = paymentAmount("SHIPMENT") + shipmentFees
    .filter((fee) => !linkedShipmentIds.has(fee.id))
    .reduce((total, fee) => total + fee.amount, 0);
  const otherAmount = costLedger
    .filter((payment) => !["ACQUISITION", "SERVICE", "SHIPMENT"].includes(payment.type))
    .reduce((total, payment) => total + payment.amount / payment.allocationDivisor, 0);
  const sourceUpdatedAt = maxDate([
    ...acquisitionItems.map((item) => item.updatedAt),
    ...orderItems.map((item) => item.updatedAt),
    ...serviceRequests.map((item) => item.updatedAt),
    ...serviceRequests.flatMap((item) => item.technicalIssue.map((issue) => issue.updatedAt)),
    ...payments.map((payment) => payment.updatedAt),
  ]);
  const projection: WatchCostLedgerProjection = {
    productId,
    currency: acquisitionItems[0]?.currency ?? payments[0]?.currency ?? "VND",
    acquisitionAmount,
    serviceAmount,
    shipmentAmount,
    otherAmount,
    landedCost: acquisitionAmount + serviceAmount + shipmentAmount + otherAmount,
    costLedger,
    serviceFees,
    shipmentFees,
    sourceUpdatedAt,
  };

  await upsertProjectionRecord(db, {
    projectionKey: WATCH_COST_LEDGER_PROJECTION_KEY,
    projectionVersion: WATCH_COST_LEDGER_PROJECTION_VERSION,
    rowKey: productId,
    entityType: "PRODUCT",
    entityId: productId,
    status: "READY",
    sortAt: sourceUpdatedAt,
    sourceUpdatedAt,
    dataJson: projection,
  });
  return projection;
}

async function resolveProductIds(
  db: DB,
  targetType: unknown,
  targetId: unknown,
): Promise<string[]> {
  const client = dbOrTx(db);
  const type = clean(targetType).toUpperCase();
  const id = clean(targetId);
  if (!id) return [];
  if (type === "PRODUCT" || type === "WATCH") {
    if (type === "PRODUCT") return [id];
    const watch = await client.watch.findUnique({ where: { id }, select: { productId: true } });
    return watch?.productId ? [watch.productId] : [];
  }
  if (type === "ACQUISITION") {
    return (await client.acquisitionItem.findMany({
      where: { acquisitionId: id, productId: { not: null } },
      select: { productId: true },
    })).map((row) => row.productId).filter((value): value is string => Boolean(value));
  }
  if (type === "ORDER") {
    return (await client.orderItem.findMany({
      where: { orderId: id, productId: { not: null } },
      select: { productId: true },
    })).map((row) => row.productId).filter((value): value is string => Boolean(value));
  }
  if (type === "SHIPMENT") {
    const shipment = await client.shipment.findUnique({ where: { id }, select: { orderId: true } });
    return shipment ? resolveProductIds(db, "ORDER", shipment.orderId) : [];
  }
  if (type === "SERVICE_REQUEST") {
    const request = await client.serviceRequest.findUnique({
      where: { id },
      select: { productId: true },
    });
    return request?.productId ? [request.productId] : [];
  }
  if (type === "TECHNICAL_ISSUE") {
    const issue = await client.technicalIssue.findUnique({
      where: { id },
      select: { serviceRequest: { select: { productId: true } } },
    });
    return issue?.serviceRequest.productId ? [issue.serviceRequest.productId] : [];
  }
  if (type === "PAYMENT") {
    const payment = await client.payment.findUnique({
      where: { id },
      select: {
        acquisition_id: true,
        order_id: true,
        shipment_id: true,
        service_request_id: true,
        technical_issue_id: true,
      },
    });
    if (!payment) return [];
    if (payment.technical_issue_id) {
      return resolveProductIds(db, "TECHNICAL_ISSUE", payment.technical_issue_id);
    }
    if (payment.service_request_id) {
      return resolveProductIds(db, "SERVICE_REQUEST", payment.service_request_id);
    }
    if (payment.shipment_id) return resolveProductIds(db, "SHIPMENT", payment.shipment_id);
    if (payment.order_id) return resolveProductIds(db, "ORDER", payment.order_id);
    if (payment.acquisition_id) {
      return resolveProductIds(db, "ACQUISITION", payment.acquisition_id);
    }
  }
  return [];
}

function result(
  context: ProjectionBuildContext,
  scope: ProjectionScope,
  applied: number,
  reason?: string,
): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason,
  };
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  const productIds = [...new Set(await resolveProductIds(
    db,
    context.sourceEvent.targetType,
    context.sourceEvent.targetId,
  ))];
  for (const productId of productIds) {
    await buildWatchCostLedgerProjectionRow(db, productId);
  }
  return result(
    context,
    { targetType: "PRODUCT", targetId: productIds[0] ?? null },
    productIds.length,
    productIds.length ? undefined : "WATCH_COST_PRODUCT_NOT_FOUND",
  );
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const scopedIds = await resolveProductIds(
    db,
    context.scope.targetType,
    context.scope.targetId,
  );
  const hasTarget = Boolean(clean(context.scope.targetId));
  if (hasTarget && !scopedIds.length) {
    return result(context, context.scope, 0, "WATCH_COST_PRODUCT_NOT_FOUND");
  }
  const productIds = hasTarget
    ? scopedIds
    : (await dbOrTx(db).product.findMany({
        where: { type: "WATCH" },
        select: { id: true },
        orderBy: { updatedAt: "desc" },
        take: context.scope.limit ?? undefined,
      })).map((row) => row.id);
  if (!hasTarget) {
    await deleteProjectionRecords(db, {
      projectionKey: WATCH_COST_LEDGER_PROJECTION_KEY,
    });
  }
  for (let index = 0; index < productIds.length; index += 4) {
    await Promise.all(
      productIds.slice(index, index + 4).map((productId) =>
        buildWatchCostLedgerProjectionRow(db, productId),
      ),
    );
  }
  return result(
    context,
    context.scope,
    productIds.length,
    productIds.length ? undefined : "NO_WATCH_PRODUCTS",
  );
}

export async function getWatchCostLedgerProjection(db: DB, productId: string) {
  const rows = await listProjectionRecords(db, {
    projectionKey: WATCH_COST_LEDGER_PROJECTION_KEY,
    projectionVersion: WATCH_COST_LEDGER_PROJECTION_VERSION,
    entityType: "PRODUCT",
    entityId: productId,
    limit: 1,
  });
  return rows[0]?.dataJson as WatchCostLedgerProjection | undefined;
}

export const watchCostLedgerProjectionBuilder: ProjectionBuilder = {
  key: WATCH_COST_LEDGER_PROJECTION_KEY,
  version: WATCH_COST_LEDGER_PROJECTION_VERSION,
  description: "Event-driven per-Watch rollup for acquisition, service, shipment and other OUT costs.",
  sourceEvents: [...SOURCE_EVENTS],
  targetTypes: [
    "PAYMENT",
    "ACQUISITION",
    "ORDER",
    "SHIPMENT",
    "SERVICE_REQUEST",
    "TECHNICAL_ISSUE",
  ],
  buildFromEvent,
  rebuild,
};
