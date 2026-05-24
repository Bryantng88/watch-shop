import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { OrderListSort, OrderProcessingSubFilter, OrderViewKey } from "../shared";

function buildOrderBy(sort?: OrderListSort): Prisma.OrderOrderByWithRelationInput {
  switch (sort) {
    case "updatedAsc":
      return { updatedAt: "asc" };
    case "createdDesc":
      return { createdAt: "desc" };
    case "createdAsc":
      return { createdAt: "asc" };
    case "updatedDesc":
    default:
      return { updatedAt: "desc" };
  }
}

function buildBaseWhere(q?: string): Prisma.OrderWhereInput {
  const keyword = String(q ?? "").trim();
  if (!keyword) return {};

  return {
    OR: [
      { refNo: { contains: keyword, mode: "insensitive" } },
      { customerName: { contains: keyword, mode: "insensitive" } },
      { shipPhone: { contains: keyword, mode: "insensitive" } },
    ],
  };
}

function zeroOrNullDecimal(field: "depositPaid" | "depositRequired"): Prisma.OrderWhereInput {
  return {
    OR: [{ [field]: null }, { [field]: { lte: new Prisma.Decimal(0) } }],
  } as Prisma.OrderWhereInput;
}

function positiveDecimal(field: "depositPaid" | "depositRequired"): Prisma.OrderWhereInput {
  return { [field]: { gt: new Prisma.Decimal(0) } } as Prisma.OrderWhereInput;
}

function processingBaseWhere(): Prisma.OrderWhereInput {
  return {
    status: { in: ["POSTED", "PAID", "PROCESSING", "SHIPPED", "RESERVED"] as any },
  };
}

function buildProcessingSubFilterWhere(subFilter?: OrderProcessingSubFilter): Prisma.OrderWhereInput {
  switch (subFilter) {
    case "awaiting_payment":
      return {
        AND: [
          { paymentStatus: "UNPAID" },
          zeroOrNullDecimal("depositPaid"),
        ],
      };

    case "remaining_payment":
      return {
        AND: [
          { paymentStatus: "UNPAID" },
          positiveDecimal("depositPaid"),
          {
            OR: [
              { shipments: { none: {} } },
              { shipments: { some: { status: { not: "DELIVERED" } } } },
            ],
          },
        ],
      };

    case "awaiting_shipment":
      return {
        AND: [
          { hasShipment: true },
          { paymentStatus: "PAID" },
          {
            OR: [
              { shipments: { none: {} } },
              { shipments: { some: { status: { in: ["DRAFT", "READY"] as any } } } },
            ],
          },
        ],
      };

    case "shipping":
      return {
        AND: [
          { hasShipment: true },
          { shipments: { some: { status: "SHIPPED" as any } } },
        ],
      };

    case "delivered_remaining":
      return {
        AND: [
          { hasShipment: true },
          { shipments: { some: { status: "DELIVERED" as any } } },
          { paymentStatus: "UNPAID" },
        ],
      };

    default:
      return {};
  }
}

function buildViewWhere(
  base: Prisma.OrderWhereInput,
  view?: OrderViewKey,
  subFilter?: OrderProcessingSubFilter,
): Prisma.OrderWhereInput {
  switch (view) {
    case "pending":
      return { AND: [base, { source: "WEB", verificationStatus: "PENDING" }] };

    case "need_action":
      return {
        AND: [
          base,
          {
            OR: [
              { status: "DRAFT" },
              { source: "WEB", verificationStatus: "PENDING" },
              { status: "POSTED", paymentStatus: "UNPAID", shipments: { none: {} }, hasShipment: true },
            ],
          },
        ],
      };

    case "processing":
      return {
        AND: [
          base,
          processingBaseWhere(),
          buildProcessingSubFilterWhere(subFilter),
        ],
      };
    case "returning":
      return {
        AND: [
          base,
          {
            shipments: {
              some: {
                status: "RETURNING" as any,
              },
            },
          },
        ],
      };

    case "completed":
      return { AND: [base, { status: "COMPLETED" }] };

    case "returned":
      return { AND: [base, { status: "RETURNED" as any }] };

    case "cancelled":
      return {
        AND: [
          base,
          {
            OR: [
              { status: "CANCELLED" },
              { verificationStatus: "REJECTED" },
              { verificationStatus: "EXPIRED" },
            ],
          },
        ],
      };

    case "all":
    default:
      return base;
  }
}

const orderListSelect = {
  id: true,
  refNo: true,
  status: true,
  paymentStatus: true,
  reserveType: true,
  depositRequired: true,
  depositPaid: true,
  customerName: true,
  shipPhone: true,
  shipCity: true,
  shipDistrict: true,
  shipWard: true,
  notes: true,
  paymentMethod: true,
  subtotal: true,
  shippingFee: true,
  source: true,
  quickFlowType: true,
  verificationStatus: true,
  hasShipment: true,
  createdAt: true,
  updatedAt: true,
  shipments: {
    orderBy: [{ createdAt: "asc" }, { updatedAt: "asc" }],
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  _count: { select: { orderItem: true } },
} satisfies Prisma.OrderSelect;

type OrderListSelectedRow = Prisma.OrderGetPayload<{ select: typeof orderListSelect }>;

function resolveOrderShipmentStatus(row: OrderListSelectedRow) {
  const shipments = row.shipments ?? [];

  return (
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "RETURNING")?.status ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "SHIPPED")?.status ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "DELIVERED")?.status ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "RETURNED")?.status ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "READY")?.status ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "DRAFT")?.status ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "CANCELLED")?.status ??
    null
  );
}

function resolveActiveShipmentId(row: OrderListSelectedRow) {
  const shipments = row.shipments ?? [];

  return (
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "RETURNING")?.id ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "SHIPPED")?.id ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "DELIVERED")?.id ??
    shipments.find((shipment) => String(shipment.status).toUpperCase() === "READY")?.id ??
    null
  );
}
function shipmentStatusChain(status: string | null | undefined) {
  const key = String(status ?? "").toUpperCase();

  if (key === "DRAFT" || key === "PENDING" || key === "READY") {
    return ["READY"];
  }

  if (key === "SHIPPED") {
    return ["READY", "SHIPPED"];
  }

  if (key === "DELIVERED") {
    return ["READY", "SHIPPED", "DELIVERED"];
  }

  if (key === "RETURNING") {
    return ["READY", "SHIPPED", "RETURNING"];
  }

  if (key === "RETURNED") {
    return ["READY", "SHIPPED", "RETURNING", "RETURNED"];
  }

  if (key === "CANCELLED") {
    return ["CANCELLED"];
  }

  return ["READY"];
}

function resolveShipmentProgressEvents(row: OrderListSelectedRow) {
  const shipments = [...(row.shipments ?? [])].sort((a, b) => {
    const aTime = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
    const bTime = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
    return aTime - bTime;
  });

  const events: { key: string; status: string; at: Date | null }[] = [];
  let allowRepeatAfterReturn = false;

  function push(status: string, shipment: (typeof shipments)[number], index: number) {
    const normalized = String(status).toUpperCase();

    if (normalized === "READY" && events.some((event) => event.status === "READY")) return;

    const last = events[events.length - 1];
    if (last?.status === normalized) return;

    if (!allowRepeatAfterReturn && events.some((event) => event.status === normalized)) return;

    events.push({
      key: `${shipment.id}-${index}-${normalized}`,
      status: normalized,
      at: shipment.updatedAt ?? shipment.createdAt ?? null,
    });

    if (normalized === "RETURNED") {
      allowRepeatAfterReturn = true;
    }
  }

  shipments.forEach((shipment, shipmentIndex) => {
    shipmentStatusChain(shipment.status).forEach((status, statusIndex) => {
      push(status, shipment, shipmentIndex * 10 + statusIndex);
    });
  });

  return events;
}
export async function listAdminOrdersRepo(
  db: DB,
  input: {
    q?: string;
    view?: OrderViewKey;
    subFilter?: OrderProcessingSubFilter;
    sort?: OrderListSort;
    page: number;
    pageSize: number;
  },
) {
  const client = dbOrTx(db);
  const base = buildBaseWhere(input.q);
  const where = buildViewWhere(base, input.view, input.subFilter);
  const skip = (input.page - 1) * input.pageSize;
  const take = input.pageSize;

  const [
    totalAll,
    total,
    rows,
    pending,
    needAction,
    processing,
    returning,
    completed,
    returned,
    cancelled,
    awaitingPayment,
    remainingPayment,
    awaitingShipment,
    shipping,
    deliveredRemaining,
  ] = await Promise.all([
    client.order.count({ where: base }),
    client.order.count({ where }),
    client.order.findMany({ where, orderBy: buildOrderBy(input.sort), skip, take, select: orderListSelect }),
    client.order.count({ where: buildViewWhere(base, "pending") }),
    client.order.count({ where: buildViewWhere(base, "need_action") }),
    client.order.count({ where: buildViewWhere(base, "processing") }),
    client.order.count({ where: buildViewWhere(base, "returning") }),
    client.order.count({ where: buildViewWhere(base, "completed") }),
    client.order.count({ where: buildViewWhere(base, "returned") }),
    client.order.count({ where: buildViewWhere(base, "cancelled") }),
    client.order.count({ where: buildViewWhere(base, "processing", "awaiting_payment") }),
    client.order.count({ where: buildViewWhere(base, "processing", "remaining_payment") }),
    client.order.count({ where: buildViewWhere(base, "processing", "awaiting_shipment") }),
    client.order.count({ where: buildViewWhere(base, "processing", "shipping") }),
    client.order.count({ where: buildViewWhere(base, "processing", "delivered_remaining") }),
  ]);

  return {
    rows: rows.map((row) => ({
      ...row,
      shipmentStatus: resolveOrderShipmentStatus(row),
      activeShipmentId: resolveActiveShipmentId(row),
      shipmentProgressEvents: resolveShipmentProgressEvents(row),
    })),
    total,
    counts: {
      all: totalAll,
      pending,
      need_action: needAction,
      processing,
      returning,
      completed,
      returned,
      cancelled,
      processingSub: {
        awaiting_payment: awaitingPayment,
        remaining_payment: remainingPayment,
        awaiting_shipment: awaitingShipment,
        shipping,
        delivered_remaining: deliveredRemaining,
      },
    },
  };
}
