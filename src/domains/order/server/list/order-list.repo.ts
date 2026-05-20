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
              {
                shipments: {
                  some: {
                    status: { not: "DELIVERED" as any },
                  },
                },
              },
            ]
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
              {
                shipments: {
                  some: {
                    status: {
                      in: ["DRAFT", "READY"] as any,
                    },
                  },
                },
              },
            ]
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
              { status: "POSTED", paymentStatus: "UNPAID" },
              {
                shipments: { none: {} },
                hasShipment: true,
              },
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

    case "completed":
      return { AND: [base, { status: "COMPLETED" }] };

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
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  }, _count: { select: { orderItem: true } },
} satisfies Prisma.OrderSelect;
type OrderListSelectedRow = Prisma.OrderGetPayload<{
  select: typeof orderListSelect;
}>;

function resolveOrderShipmentStatus(row: OrderListSelectedRow) {
  const shipments = row.shipments ?? [];

  return (
    shipments.find((shipment) => shipment.status === "SHIPPED")?.status ??
    shipments.find((shipment) => shipment.status === "DELIVERED")?.status ??
    shipments.find((shipment) => shipment.status === "READY")?.status ??
    shipments.find((shipment) => shipment.status === "DRAFT")?.status ??
    shipments.find((shipment) => shipment.status === "RETURNED")?.status ??
    shipments.find((shipment) => shipment.status === "CANCELLED")?.status ??
    null
  );
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
    completed,
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
    client.order.count({ where: buildViewWhere(base, "completed") }),
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
    })),
    total,
    counts: {
      all: totalAll,
      pending,
      need_action: needAction,
      processing,
      completed,
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
