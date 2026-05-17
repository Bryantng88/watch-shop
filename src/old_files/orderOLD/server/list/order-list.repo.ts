import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { OrderListSort, OrderViewKey } from "../shared";

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

function buildViewWhere(base: Prisma.OrderWhereInput, view?: OrderViewKey): Prisma.OrderWhereInput {
  switch (view) {
    case "web_pending":
      return { AND: [base, { source: "WEB", verificationStatus: "PENDING" }] };
    case "need_action":
      return {
        AND: [
          base,
          { source: "ADMIN", status: { in: ["DRAFT", "RESERVED"] }, NOT: { verificationStatus: "PENDING" } },
        ],
      };
    case "processing":
      return { AND: [base, { status: "POSTED" }] };
    case "delivered":
      return { AND: [base, { status: "SHIPPED" }] };
    case "completed":
      return { AND: [base, { status: "COMPLETED" }] };
    case "cancelled":
      return {
        AND: [
          base,
          { OR: [{ status: "CANCELLED" }, { verificationStatus: "REJECTED" }, { verificationStatus: "EXPIRED" }] },
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
  reserveType: true,
  depositRequired: true,
  customerName: true,
  shipPhone: true,
  shipCity: true,
  shipDistrict: true,
  shipWard: true,
  notes: true,
  paymentMethod: true,
  paymentStatus: true,
  subtotal: true,
  shippingFee: true,
  source: true,
  quickFlowType: true,
  verificationStatus: true,
  hasShipment: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { orderItem: true } },
} satisfies Prisma.OrderSelect;

export async function listAdminOrdersRepo(
  db: DB,
  input: { q?: string; view?: OrderViewKey; sort?: OrderListSort; page: number; pageSize: number },
) {
  const client = dbOrTx(db);
  const base = buildBaseWhere(input.q);
  const where = buildViewWhere(base, input.view);
  const skip = (input.page - 1) * input.pageSize;
  const take = input.pageSize;

  const [totalAll, total, rows, webPending, needAction, processing, delivered, completed, cancelled] =
    await Promise.all([
      client.order.count({ where: base }),
      client.order.count({ where }),
      client.order.findMany({ where, orderBy: buildOrderBy(input.sort), skip, take, select: orderListSelect }),
      client.order.count({ where: buildViewWhere(base, "web_pending") }),
      client.order.count({ where: buildViewWhere(base, "need_action") }),
      client.order.count({ where: buildViewWhere(base, "processing") }),
      client.order.count({ where: buildViewWhere(base, "delivered") }),
      client.order.count({ where: buildViewWhere(base, "completed") }),
      client.order.count({ where: buildViewWhere(base, "cancelled") }),
    ]);

  return {
    rows,
    total,
    counts: { all: totalAll, web_pending: webPending, need_action: needAction, processing, delivered, completed, cancelled },
  };
}
