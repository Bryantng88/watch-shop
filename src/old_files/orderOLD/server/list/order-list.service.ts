import { prisma } from "@/server/db/client";
import type { OrderSearchInput } from "../shared";
import { toNumberPrice, toPlain } from "../shared";
import { listAdminOrdersRepo } from "./order-list.repo";

export async function getAdminOrderList(input: OrderSearchInput) {
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));

  const { rows, total, counts } = await listAdminOrdersRepo(prisma, {
    q: input.q,
    view: input.view,
    sort: input.sort,
    page,
    pageSize,
  });

  const items = rows.map((order) => ({
    id: order.id,
    refNo: order.refNo,
    customerName: order.customerName,
    shipPhone: order.shipPhone,
    customerPhone: order.shipPhone,
    status: order.status,
    paymentStatus: order.paymentStatus,
    reserveType: order.reserveType,
    depositRequired: toNumberPrice(order.depositRequired),
    subtotal: toNumberPrice(order.subtotal),
    totalAmount: toNumberPrice(order.subtotal) + toNumberPrice(order.shippingFee),
    currency: "VND",
    hasShipment: order.hasShipment,
    itemCount: order._count?.orderItem ?? 0,
    itemsCount: order._count?.orderItem ?? 0,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    source: order.quickFlowType === "QUICK_ORDER" ? "WATCH_QUICK_ORDER" : order.source,
    verificationStatus: order.verificationStatus,
  }));

  return toPlain({ items, total, counts, page, pageSize });
}
