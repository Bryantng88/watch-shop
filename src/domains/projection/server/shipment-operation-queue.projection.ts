import { Prisma } from "@prisma/client";

import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { SHIPMENT_OPERATION_EVENT_KEYS } from "@/domains/shipment/server/events/shipment-business-event.contract";
import { dbOrTx, type DB } from "@/server/db/client";
import { upsertProjectionRecord } from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const SHIPMENT_OPERATION_QUEUE_PROJECTION_KEY = "shipment-operation-queue";
export const SHIPMENT_OPERATION_QUEUE_PROJECTION_VERSION = 1;
const SHIPMENT_PAYMENT_EVENTS = [
  "payment.created",
  "payment.status_updated",
  "payment.paid",
] as const;

export type ShipmentOperationStage = "SHIPMENT_WAITING" | "SHIPMENT_PROCESSING" | "SHIPMENT_DONE";

export type ShipmentOperationQueueProjection = {
  shipmentId: string;
  shipmentRefNo: string | null;
  shipmentStatus: string;
  flowStage: ShipmentOperationStage;
  orderId: string;
  orderRefNo: string | null;
  orderStatus: string | null;
  paymentStatus: string | null;
  customerName: string | null;
  shipPhone: string | null;
  shipAddressLabel: string | null;
  carrier: string | null;
  trackingCode: string | null;
  shippingAmount: number;
  shippingFeePayer: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  updatedAt: string;
  itemCount: number;
  imageUrl: string | null;
  imageUrls: string[];
  feePaymentStatus: string | null;
  codPaymentStatus: string | null;
  source: "DOMAIN_EVENT" | "BACKFILL";
};

export function shipmentOperationStage(status: unknown): ShipmentOperationStage {
  const key = String(status ?? "").toUpperCase();
  if (key === "SHIPPED" || key === "RETURNING") return "SHIPMENT_PROCESSING";
  if (key === "DELIVERED" || key === "RETURNED" || key === "CANCELLED" || key === "CANCELED") {
    return "SHIPMENT_DONE";
  }
  return "SHIPMENT_WAITING";
}

function mediaUrl(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("/")) {
    return text;
  }
  return `/api/media/sign?key=${encodeURIComponent(text)}`;
}

function buildResult(
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

export async function buildShipmentOperationQueueRow(
  db: DB,
  shipmentId: string,
  source: "DOMAIN_EVENT" | "BACKFILL" = "DOMAIN_EVENT",
) {
  const client = dbOrTx(db);
  const shipment = await client.shipment.findUnique({
    where: { id: shipmentId },
    select: {
      id: true,
      refNo: true,
      status: true,
      orderId: true,
      orderRefNo: true,
      customerName: true,
      shipPhone: true,
      shipAddress: true,
      shipWard: true,
      shipDistrict: true,
      shipCity: true,
      carrier: true,
      trackingCode: true,
      shippingAmount: true,
      shippingFeePayer: true,
      shippedAt: true,
      deliveredAt: true,
      updatedAt: true,
      order: {
        select: {
          refNo: true,
          status: true,
          paymentStatus: true,
          customerName: true,
          shipPhone: true,
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
          _count: { select: { orderItem: true } },
        },
      },
    },
  });
  if (!shipment) return null;

  const payments = await client.payment.findMany({
    where: { shipment_id: shipment.id },
    select: { purpose: true, method: true, status: true },
  });
  const images = shipment.order.orderItem
    .map((item) =>
      mediaUrl(
        item.product?.productImage[0]?.fileKey ??
          item.product?.primaryImageUrl ??
          item.product?.storefrontImageKey ??
          item.img,
      ),
    )
    .filter((value): value is string => Boolean(value));
  const address = [
    shipment.shipAddress,
    shipment.shipWard,
    shipment.shipDistrict,
    shipment.shipCity,
  ].filter(Boolean).join(", ");
  const stage = shipmentOperationStage(shipment.status);
  const data: ShipmentOperationQueueProjection = {
    shipmentId: shipment.id,
    shipmentRefNo: shipment.refNo,
    shipmentStatus: String(shipment.status),
    flowStage: stage,
    orderId: shipment.orderId,
    orderRefNo: shipment.orderRefNo ?? shipment.order.refNo,
    orderStatus: String(shipment.order.status ?? ""),
    paymentStatus: String(shipment.order.paymentStatus ?? ""),
    customerName: shipment.customerName ?? shipment.order.customerName,
    shipPhone: shipment.shipPhone ?? shipment.order.shipPhone,
    shipAddressLabel: address || null,
    carrier: shipment.carrier,
    trackingCode: shipment.trackingCode,
    shippingAmount: Number(shipment.shippingAmount),
    shippingFeePayer: shipment.shippingFeePayer ? String(shipment.shippingFeePayer) : null,
    shippedAt: shipment.shippedAt?.toISOString() ?? null,
    deliveredAt: shipment.deliveredAt?.toISOString() ?? null,
    updatedAt: shipment.updatedAt.toISOString(),
    itemCount: shipment.order._count.orderItem,
    imageUrl: images[0] ?? null,
    imageUrls: images,
    feePaymentStatus:
      payments.find((payment) =>
        String(payment.purpose) === "SHIPMENT_COST" ||
        String(payment.purpose) === "SHIPMENT_RETURN_COST"
      )?.status ?? null,
    codPaymentStatus:
      payments.find((payment) => String(payment.method) === "COD")?.status ?? null,
    source,
  };
  await upsertProjectionRecord(db, {
    projectionKey: SHIPMENT_OPERATION_QUEUE_PROJECTION_KEY,
    projectionVersion: SHIPMENT_OPERATION_QUEUE_PROJECTION_VERSION,
    rowKey: shipment.id,
    entityType: "SHIPMENT",
    entityId: shipment.id,
    status: stage,
    searchText: [
      data.shipmentRefNo,
      data.orderRefNo,
      data.customerName,
      data.shipPhone,
      data.carrier,
      data.trackingCode,
    ].filter(Boolean).join(" "),
    sortAt: shipment.updatedAt,
    sourceUpdatedAt: shipment.updatedAt,
    dataJson: data,
  });
  return data;
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  let shipmentId = context.sourceEvent.targetId;
  if (String(context.sourceEvent.targetType).toUpperCase() === "PAYMENT") {
    const payment = await dbOrTx(db).payment.findUnique({
      where: { id: context.sourceEvent.targetId },
      select: { shipment_id: true, order_id: true },
    });
    shipmentId = payment?.shipment_id ?? (
      payment?.order_id
        ? (await dbOrTx(db).shipment.findFirst({
            where: {
              orderId: payment.order_id,
              status: { notIn: ["RETURNED", "CANCELLED"] },
            },
            orderBy: { updatedAt: "desc" },
            select: { id: true },
          }))?.id ?? ""
        : ""
    );
  }
  const scope = {
    targetType: context.sourceEvent.targetType,
    targetId: shipmentId || context.sourceEvent.targetId,
  };
  const row = shipmentId
    ? await buildShipmentOperationQueueRow(db, shipmentId)
    : null;
  return buildResult(context, scope, row ? 1 : 0, row ? undefined : "SHIPMENT_NOT_FOUND");
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const client = dbOrTx(db);
  const targetId = String(context.scope.targetId ?? "").trim();
  const rows = await client.shipment.findMany({
    where: targetId ? { id: targetId } : undefined,
    select: { id: true },
    orderBy: { updatedAt: "desc" },
    take: context.scope.limit ? Math.max(1, Math.min(5000, context.scope.limit)) : undefined,
  });
  for (const row of rows) {
    await buildShipmentOperationQueueRow(db, row.id, "BACKFILL");
  }
  return buildResult(context, context.scope, rows.length, rows.length ? undefined : "NO_SHIPMENTS");
}

export const shipmentOperationQueueProjectionBuilder: ProjectionBuilder = {
  key: SHIPMENT_OPERATION_QUEUE_PROJECTION_KEY,
  version: SHIPMENT_OPERATION_QUEUE_PROJECTION_VERSION,
  description: "Shipment operational flow read model with Order identity, preview and Payment signals.",
  sourceEvents: [...SHIPMENT_OPERATION_EVENT_KEYS, ...SHIPMENT_PAYMENT_EVENTS],
  targetTypes: ["SHIPMENT", "PAYMENT"],
  buildFromEvent,
  rebuild,
};

export async function listShipmentOperationQueueProjection(
  db: DB,
  input: {
    stage: ShipmentOperationStage;
    page: number;
    pageSize: number;
    query?: string | null;
  },
) {
  const client = dbOrTx(db);
  const offset = (input.page - 1) * input.pageSize;
  const query = String(input.query ?? "").trim();
  const rows = await client.$queryRaw<Array<{ dataJson: unknown }>>(Prisma.sql`
    SELECT "dataJson"
    FROM "ProjectionRecord"
    WHERE "projectionKey" = ${SHIPMENT_OPERATION_QUEUE_PROJECTION_KEY}
      AND "status" = ${input.stage}
      AND (${query || null}::text IS NULL OR "searchText" ILIKE ${query ? `%${query}%` : null})
    ORDER BY "sortAt" DESC NULLS LAST, "updatedAt" DESC
    LIMIT ${input.pageSize}
    OFFSET ${offset}
  `);
  const totals = await client.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    SELECT COUNT(*) AS "count"
    FROM "ProjectionRecord"
    WHERE "projectionKey" = ${SHIPMENT_OPERATION_QUEUE_PROJECTION_KEY}
      AND "status" = ${input.stage}
      AND (${query || null}::text IS NULL OR "searchText" ILIKE ${query ? `%${query}%` : null})
  `);
  return {
    rows: rows.map((row) => row.dataJson as ShipmentOperationQueueProjection),
    total: Number(totals[0]?.count ?? 0),
  };
}
