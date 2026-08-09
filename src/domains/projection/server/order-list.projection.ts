import { Prisma } from "@prisma/client";

import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { ORDER_BUSINESS_EVENT_KEYS } from "@/domains/order/server/events/order-business-event.contract";
import type { OrderSearchInput } from "@/domains/order/server/shared";
import type {
  OrderListProjectionResult,
  OrderListProjectionRow,
} from "@/domains/order/shared/order-list.projection";
import { buildOrderPaymentFlow } from "@/domains/order/shared";
import {
  buildPaymentOwnerSummary,
  getPaymentOwnerSummaryProjection,
} from "./payment-owner-summary.projection";
import { dbOrTx, type DB } from "@/server/db/client";
import {
  deleteProjectionRecords,
  upsertProjectionRecord,
} from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const ORDER_LIST_PROJECTION_KEY = "order-list";
export const ORDER_LIST_PROJECTION_VERSION = 3;
const RELATED_EVENTS = [
  "payment.created",
  "payment.status_updated",
  "payment.paid",
  "payment.refunded",
  "shipment.created",
  "shipment.updated",
  "shipment.shipped",
  "shipment.delivered",
  "shipment.returning",
  "shipment.returned",
  "shipment.cancelled",
] as const;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function mediaUrl(value: unknown) {
  const text = clean(value);
  if (!text) return null;
  if (/^(https?:\/\/|\/)/.test(text)) return text;
  return `/api/media/sign?key=${encodeURIComponent(text)}`;
}

function shipmentChain(status: unknown) {
  const key = clean(status).toUpperCase();
  if (key === "SHIPPED") return ["READY", "SHIPPED"];
  if (key === "DELIVERED") return ["READY", "SHIPPED", "DELIVERED"];
  if (key === "RETURNING") return ["READY", "SHIPPED", "RETURNING"];
  if (key === "RETURNED") return ["READY", "SHIPPED", "RETURNING", "RETURNED"];
  if (key === "CANCELLED") return ["CANCELLED"];
  return ["READY"];
}

function isTerminalShipment(status: unknown) {
  return ["RETURNED", "CANCELLED", "CANCELED"].includes(clean(status).toUpperCase());
}

export async function buildOrderListProjectionRow(
  db: DB,
  orderId: string,
): Promise<OrderListProjectionRow | null> {
  const client = dbOrTx(db);
  const order = await client.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      refNo: true,
      status: true,
      paymentStatus: true,
      verificationStatus: true,
      customerName: true,
      shipPhone: true,
      notes: true,
      reserveType: true,
      paymentMethod: true,
      depositRequired: true,
      depositPaid: true,
      subtotal: true,
      hasShipment: true,
      source: true,
      quickFlowType: true,
      purchaseRequest: {
        select: { channel: true, reference: true },
      },
      createdAt: true,
      updatedAt: true,
      orderItem: {
        orderBy: { createdAt: "asc" },
        take: 4,
        select: {
          img: true,
          product: {
            select: {
              primaryImageUrl: true,
              storefrontImageKey: true,
              productImage: {
                where: { role: "INLINE" },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                take: 1,
                select: { fileKey: true },
              },
            },
          },
        },
      },
      shipments: {
        orderBy: [{ createdAt: "asc" }, { updatedAt: "asc" }],
        select: { id: true, status: true, createdAt: true, updatedAt: true },
      },
      _count: { select: { orderItem: true } },
    },
  });
  if (!order) return null;

  const total = Number(order.subtotal ?? 0);
  const payment =
    await getPaymentOwnerSummaryProjection(db, "ORDER", order.id) ??
    await buildPaymentOwnerSummary(db, "ORDER", order.id);
  const paidAmount = Number(payment.paidTotal ?? 0);
  const collectedAmount = Number(payment.collectedTotal ?? 0);
  const unpaidPaymentAmount = Number(payment.unpaidTotal ?? 0);
  const remainingAmount = Math.max(0, Number(payment.remaining ?? total));
  const isFullyPaid = total <= 0 || remainingAmount <= 0;
  const shipments = order.shipments;
  const activeShipment =
    [...shipments].reverse().find((shipment) => !isTerminalShipment(shipment.status)) ?? null;
  const latestShipment = [...shipments].reverse()[0] ?? null;
  const shipmentStatus = activeShipment?.status ?? latestShipment?.status ?? null;
  const normalizedOrderStatus = clean(order.status).toUpperCase();
  const derivedStatus = ["CANCELLED", "CANCELED"].includes(normalizedOrderStatus)
    ? "CANCELLED"
    : clean(shipmentStatus).toUpperCase() === "RETURNED"
      ? "RETURNED"
      : clean(shipmentStatus).toUpperCase() === "DELIVERED" && isFullyPaid
        ? "COMPLETED"
        : normalizedOrderStatus;
  const paymentFlow = buildOrderPaymentFlow({
    reserveType: order.reserveType,
    paymentMethod: order.paymentMethod,
    depositRequired: Number(order.depositRequired ?? 0),
    depositPaid: Number(order.depositPaid ?? 0),
  });
  const images = order.orderItem
    .map((item) =>
      mediaUrl(
        item.product?.productImage[0]?.fileKey ??
          item.product?.primaryImageUrl ??
          item.product?.storefrontImageKey ??
          item.img,
      ),
    )
    .filter((value): value is string => Boolean(value));
  const shipmentProgressEvents = shipments.flatMap((shipment, shipmentIndex) =>
    shipmentChain(shipment.status).map((status, statusIndex) => ({
      key: `${shipment.id}-${shipmentIndex}-${statusIndex}-${status}`,
      status,
      at: (shipment.updatedAt ?? shipment.createdAt).toISOString(),
    })),
  );

  return {
    id: order.id,
    refNo: order.refNo,
    customerName: order.customerName,
    customerPhone: order.shipPhone,
    shipPhone: order.shipPhone,
    orderStatus: normalizedOrderStatus,
    status: derivedStatus,
    verificationStatus: String(order.verificationStatus),
    paymentStatus: isFullyPaid ? "PAID" : String(order.paymentStatus),
    fulfillmentStatus: order.hasShipment ? shipmentStatus ?? "MISSING" : "NO_SHIPMENT",
    shipmentStatus: shipmentStatus ? String(shipmentStatus) : null,
    activeShipmentId: activeShipment?.id ?? null,
    shipmentProgressEvents,
    source: order.quickFlowType === "QUICK_ORDER" ? "WATCH_QUICK_ORDER" : String(order.source),
    sourceLabel:
      order.quickFlowType === "QUICK_ORDER"
        ? "Tạo từ watch"
        : order.purchaseRequest?.channel === "STOREFRONT"
          ? "Yêu cầu Storefront"
          : order.purchaseRequest?.channel === "ZALO"
            ? "Yêu cầu Zalo"
            : order.purchaseRequest
              ? "Yêu cầu mua hàng"
        : order.source === "WEB"
          ? "Website"
          : order.source === "ADMIN"
            ? "Admin tạo trực tiếp"
            : null,
    notes: order.notes,
    itemsCount: order._count.orderItem,
    totalAmount: total,
    paidAmount,
    collectedAmount,
    unpaidPaymentAmount,
    remainingAmount,
    depositRequired: Number(order.depositRequired ?? 0),
    depositPaid: Number(order.depositPaid ?? 0),
    reserveType: String(order.reserveType),
    paymentMethod: String(order.paymentMethod),
    paymentFlowLabel: paymentFlow.label,
    paymentFlowTone: paymentFlow.tone,
    paymentFlowDescription: paymentFlow.description,
    hasShipment: order.hasShipment,
    hasPendingPayment: payment.pendingCount > 0,
    isFullyPaid,
    previewImageUrl: images[0] ?? null,
    previewImageUrls: images,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

async function upsertRow(db: DB, row: OrderListProjectionRow) {
  await upsertProjectionRecord(db, {
    projectionKey: ORDER_LIST_PROJECTION_KEY,
    projectionVersion: ORDER_LIST_PROJECTION_VERSION,
    rowKey: row.id,
    entityType: "ORDER",
    entityId: row.id,
    status: row.status,
    searchText: [row.refNo, row.customerName, row.shipPhone, row.notes].filter(Boolean).join(" "),
    sortAt: row.updatedAt,
    sourceUpdatedAt: row.updatedAt,
    dataJson: row,
  });
}

async function resolveOrderId(db: DB, targetType: unknown, targetId: unknown) {
  const client = dbOrTx(db);
  const type = clean(targetType).toUpperCase();
  const id = clean(targetId);
  if (!id) return null;
  if (type === "ORDER") return id;
  if (type === "PAYMENT") {
    return (await client.payment.findUnique({
      where: { id },
      select: { order_id: true },
    }))?.order_id ?? null;
  }
  if (type === "SHIPMENT") {
    return (await client.shipment.findUnique({
      where: { id },
      select: { orderId: true },
    }))?.orderId ?? null;
  }
  return null;
}

export async function rebuildOrderListProjectionRows(
  db: DB,
  input: { orderIds?: string[]; limit?: number | null } = {},
) {
  const client = dbOrTx(db);
  const ids = [...new Set((input.orderIds ?? []).map(clean).filter(Boolean))];
  if (!ids.length) await deleteProjectionRecords(db, { projectionKey: ORDER_LIST_PROJECTION_KEY });
  const orders = await client.order.findMany({
    where: ids.length ? { id: { in: ids } } : undefined,
    select: { id: true },
    orderBy: { updatedAt: "desc" },
    take: input.limit ? Math.min(10000, Math.max(1, input.limit)) : undefined,
  });
  for (let index = 0; index < orders.length; index += 10) {
    await Promise.all(orders.slice(index, index + 10).map(async (order) => {
      const row = await buildOrderListProjectionRow(db, order.id);
      if (row) await upsertRow(db, row);
    }));
  }
  return orders.length;
}

function result(
  context: ProjectionBuildContext,
  scope: ProjectionScope,
  applied: number,
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
    reason: applied ? undefined : "ORDER_NOT_FOUND",
  };
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const orderId = await resolveOrderId(db, context.scope.targetType, context.scope.targetId);
  const scoped = Boolean(clean(context.scope.targetType) || clean(context.scope.targetId));
  if (scoped && !orderId) return result(context, context.scope, 0);
  const applied = await rebuildOrderListProjectionRows(db, {
    orderIds: orderId ? [orderId] : [],
    limit: context.scope.limit,
  });
  return result(context, context.scope, applied);
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  return rebuild(db, {
    ...context,
    scope: {
      targetType: context.sourceEvent.targetType,
      targetId: context.sourceEvent.targetId,
      limit: 1,
    },
  });
}

export const orderListProjectionBuilder: ProjectionBuilder = {
  key: ORDER_LIST_PROJECTION_KEY,
  version: ORDER_LIST_PROJECTION_VERSION,
  description: "Persistent event-driven read model for Admin Order List.",
  sourceEvents: [...ORDER_BUSINESS_EVENT_KEYS, ...RELATED_EVENTS],
  targetTypes: ["ORDER", "PAYMENT", "SHIPMENT"],
  dependsOnProjectionKeys: ["payment-owner-summary"],
  buildFromEvent,
  rebuild,
};

type JsonRow = { dataJson: OrderListProjectionRow };
type FilteredSummaryRow = {
  count: bigint | number;
  totalValue: Prisma.Decimal | number | string | null;
};
type AggregateCountRow = {
  all: bigint | number;
  pending: bigint | number;
  needAction: bigint | number;
  processing: bigint | number;
  returning: bigint | number;
  completed: bigint | number;
  returned: bigint | number;
  cancelled: bigint | number;
  awaitingPayment: bigint | number;
  remainingPayment: bigint | number;
  awaitingShipment: bigint | number;
  shipping: bigint | number;
  deliveredRemaining: bigint | number;
  paymentFull: bigint | number;
  paymentCod: bigint | number;
  paymentDeposit: bigint | number;
};

function viewCondition(input: OrderSearchInput) {
  const view = clean(input.view).toLowerCase();
  if (view === "pending") return Prisma.sql`"dataJson"->>'verificationStatus' = 'PENDING'`;
  if (view === "need_action") return Prisma.sql`(
    "dataJson"->>'orderStatus' = 'DRAFT' OR
    "dataJson"->>'verificationStatus' = 'PENDING' OR
    ("dataJson"->>'orderStatus' = 'POSTED' AND "dataJson"->>'paymentStatus' = 'UNPAID' AND "dataJson"->>'fulfillmentStatus' = 'MISSING')
  )`;
  if (view === "processing") return Prisma.sql`
    "dataJson"->>'orderStatus' IN ('POSTED', 'PAID', 'PROCESSING', 'SHIPPED', 'RESERVED')
    AND "status" NOT IN ('COMPLETED', 'RETURNED', 'CANCELLED')
  `;
  if (view === "returning") return Prisma.sql`"dataJson"->>'shipmentStatus' = 'RETURNING'`;
  if (view === "completed") return Prisma.sql`"status" = 'COMPLETED'`;
  if (view === "returned") return Prisma.sql`"status" = 'RETURNED'`;
  if (view === "cancelled") return Prisma.sql`(
    "status" = 'CANCELLED' OR "dataJson"->>'verificationStatus' IN ('REJECTED', 'EXPIRED')
  )`;
  return null;
}

function subFilterCondition(input: OrderSearchInput) {
  if (input.view !== "processing") return null;
  if (input.subFilter === "awaiting_payment") {
    return Prisma.sql`("dataJson"->>'paidAmount')::numeric <= 0 AND ("dataJson"->>'remainingAmount')::numeric > 0`;
  }
  if (input.subFilter === "remaining_payment") {
    return Prisma.sql`("dataJson"->>'paidAmount')::numeric > 0 AND ("dataJson"->>'remainingAmount')::numeric > 0 AND COALESCE("dataJson"->>'shipmentStatus', '') <> 'DELIVERED'`;
  }
  if (input.subFilter === "awaiting_shipment") {
    return Prisma.sql`"dataJson"->>'hasShipment' = 'true' AND COALESCE("dataJson"->>'shipmentStatus', 'MISSING') IN ('MISSING', 'DRAFT', 'READY')`;
  }
  if (input.subFilter === "shipping") return Prisma.sql`"dataJson"->>'shipmentStatus' = 'SHIPPED'`;
  if (input.subFilter === "delivered_remaining") {
    return Prisma.sql`"dataJson"->>'shipmentStatus' = 'DELIVERED' AND ("dataJson"->>'remainingAmount')::numeric > 0`;
  }
  return null;
}

function whereConditions(input: OrderSearchInput) {
  const conditions = [Prisma.sql`"projectionKey" = ${ORDER_LIST_PROJECTION_KEY}`];
  if (clean(input.q)) {
    conditions.push(Prisma.sql`COALESCE("searchText", '') ILIKE ${`%${clean(input.q)}%`}`);
  }
  const view = viewCondition(input);
  if (view) conditions.push(view);
  const subFilter = subFilterCondition(input);
  if (subFilter) conditions.push(subFilter);
  if (input.paymentType === "full") {
    conditions.push(Prisma.sql`COALESCE("dataJson"->>'reserveType', 'NONE') = 'NONE'`);
  } else if (input.paymentType === "cod") {
    conditions.push(Prisma.sql`"dataJson"->>'reserveType' = 'COD'`);
  } else if (input.paymentType === "deposit") {
    conditions.push(Prisma.sql`"dataJson"->>'reserveType' = 'DEPOSIT'`);
  }
  return conditions;
}

function orderBy(sort: OrderSearchInput["sort"]) {
  if (sort === "updatedAsc") return Prisma.sql`"sortAt" ASC NULLS LAST`;
  if (sort === "createdDesc") return Prisma.sql`("dataJson"->>'createdAt')::timestamptz DESC`;
  if (sort === "createdAsc") return Prisma.sql`("dataJson"->>'createdAt')::timestamptz ASC`;
  return Prisma.sql`"sortAt" DESC NULLS LAST`;
}

async function summarizeFilteredOrders(db: DB, input: OrderSearchInput) {
  const where = Prisma.join(whereConditions(input), " AND ");
  const rows = await dbOrTx(db).$queryRaw<FilteredSummaryRow[]>(Prisma.sql`
    SELECT
      COUNT(*) AS "count",
      COALESCE(SUM(COALESCE(("dataJson"->>'totalAmount')::numeric, 0)), 0) AS "totalValue"
    FROM "ProjectionRecord"
    WHERE ${where}
  `);
  return {
    count: Number(rows[0]?.count ?? 0),
    totalValue: Number(rows[0]?.totalValue ?? 0),
  };
}

export async function queryOrderListProjection(
  db: DB,
  input: OrderSearchInput,
): Promise<OrderListProjectionResult & { projectionRowCount: number }> {
  const client = dbOrTx(db);
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));
  const where = Prisma.join(whereConditions(input), " AND ");
  const [rows, filteredSummary, aggregateRows] =
    await Promise.all([
      client.$queryRaw<JsonRow[]>(Prisma.sql`
        SELECT "dataJson" FROM "ProjectionRecord" WHERE ${where}
        ORDER BY ${orderBy(input.sort)}
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `),
      summarizeFilteredOrders(db, input),
      client.$queryRaw<AggregateCountRow[]>(Prisma.sql`
        SELECT
          COUNT(*) AS "all",
          COUNT(*) FILTER (WHERE "dataJson"->>'verificationStatus' = 'PENDING') AS "pending",
          COUNT(*) FILTER (WHERE
            "dataJson"->>'orderStatus' = 'DRAFT' OR
            "dataJson"->>'verificationStatus' = 'PENDING' OR
            ("dataJson"->>'orderStatus' = 'POSTED' AND "dataJson"->>'paymentStatus' = 'UNPAID' AND "dataJson"->>'fulfillmentStatus' = 'MISSING')
          ) AS "needAction",
          COUNT(*) FILTER (WHERE
            "dataJson"->>'orderStatus' IN ('POSTED', 'PAID', 'PROCESSING', 'SHIPPED', 'RESERVED') AND
            "status" NOT IN ('COMPLETED', 'RETURNED', 'CANCELLED')
          ) AS "processing",
          COUNT(*) FILTER (WHERE "dataJson"->>'shipmentStatus' = 'RETURNING') AS "returning",
          COUNT(*) FILTER (WHERE "status" = 'COMPLETED') AS "completed",
          COUNT(*) FILTER (WHERE "status" = 'RETURNED') AS "returned",
          COUNT(*) FILTER (WHERE "status" = 'CANCELLED' OR "dataJson"->>'verificationStatus' IN ('REJECTED', 'EXPIRED')) AS "cancelled",
          COUNT(*) FILTER (WHERE
            "dataJson"->>'orderStatus' IN ('POSTED', 'PAID', 'PROCESSING', 'SHIPPED', 'RESERVED') AND
            "status" NOT IN ('COMPLETED', 'RETURNED', 'CANCELLED') AND
            ("dataJson"->>'paidAmount')::numeric <= 0 AND
            ("dataJson"->>'remainingAmount')::numeric > 0
          ) AS "awaitingPayment",
          COUNT(*) FILTER (WHERE
            "dataJson"->>'orderStatus' IN ('POSTED', 'PAID', 'PROCESSING', 'SHIPPED', 'RESERVED') AND
            "status" NOT IN ('COMPLETED', 'RETURNED', 'CANCELLED') AND
            ("dataJson"->>'paidAmount')::numeric > 0 AND
            ("dataJson"->>'remainingAmount')::numeric > 0 AND
            COALESCE("dataJson"->>'shipmentStatus', '') <> 'DELIVERED'
          ) AS "remainingPayment",
          COUNT(*) FILTER (WHERE
            "dataJson"->>'orderStatus' IN ('POSTED', 'PAID', 'PROCESSING', 'SHIPPED', 'RESERVED') AND
            "status" NOT IN ('COMPLETED', 'RETURNED', 'CANCELLED') AND
            "dataJson"->>'hasShipment' = 'true' AND
            COALESCE("dataJson"->>'shipmentStatus', 'MISSING') IN ('MISSING', 'DRAFT', 'READY')
          ) AS "awaitingShipment",
          COUNT(*) FILTER (WHERE "dataJson"->>'shipmentStatus' = 'SHIPPED') AS "shipping",
          COUNT(*) FILTER (WHERE
            "dataJson"->>'shipmentStatus' = 'DELIVERED' AND
            ("dataJson"->>'remainingAmount')::numeric > 0
          ) AS "deliveredRemaining",
          COUNT(*) FILTER (WHERE COALESCE("dataJson"->>'reserveType', 'NONE') = 'NONE') AS "paymentFull",
          COUNT(*) FILTER (WHERE "dataJson"->>'reserveType' = 'COD') AS "paymentCod",
          COUNT(*) FILTER (WHERE "dataJson"->>'reserveType' = 'DEPOSIT') AS "paymentDeposit"
        FROM "ProjectionRecord"
        WHERE "projectionKey" = ${ORDER_LIST_PROJECTION_KEY}
      `),
    ]);
  const aggregate = aggregateRows[0];
  const number = (value: bigint | number | undefined) => Number(value ?? 0);
  const total = filteredSummary.count;
  return {
    items: rows.map((row) => row.dataJson),
    total,
    totalValue: filteredSummary.totalValue,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    projectionRowCount: number(aggregate?.all),
    counts: {
      all: number(aggregate?.all),
      pending: number(aggregate?.pending),
      need_action: number(aggregate?.needAction),
      processing: number(aggregate?.processing),
      returning: number(aggregate?.returning),
      completed: number(aggregate?.completed),
      returned: number(aggregate?.returned),
      cancelled: number(aggregate?.cancelled),
      processingSub: {
        awaiting_payment: number(aggregate?.awaitingPayment),
        remaining_payment: number(aggregate?.remainingPayment),
        awaiting_shipment: number(aggregate?.awaitingShipment),
        shipping: number(aggregate?.shipping),
        delivered_remaining: number(aggregate?.deliveredRemaining),
      },
      paymentType: {
        full: number(aggregate?.paymentFull),
        cod: number(aggregate?.paymentCod),
        deposit: number(aggregate?.paymentDeposit),
      },
    },
  };
}
