import { getOrderDetailProjection } from "@/domains/projection/server/order-detail.projection";
import { prisma } from "@/server/db/client";
import { toNumberPrice, toPlain } from "../shared";
import { getOrderDraftForEditRepo } from "./order-detail.repo";

export async function getAdminOrderDetail(id: string) {
  const row = await getOrderDetailProjection(prisma, id);
  if (!row) throw new Error("Order không tồn tại");
  return toPlain(row);
}

// Edit remains source-backed because it is a command preparation surface.
export async function getOrderDraftForEdit(orderId: string) {
  const row = await getOrderDraftForEditRepo(prisma, orderId);
  if (!row) throw new Error("Order không tồn tại");

  return toPlain({
    ...row,
    reserve: row.reserveType
      ? {
        type: row.reserveType,
        amount: toNumberPrice(row.depositRequired),
        expiresAt: row.reserveUntil,
      }
      : null,
    items: row.orderItem.map((item) => ({
      ...item,
      listPrice: toNumberPrice(item.listPrice),
      unitPriceAgreed: toNumberPrice(item.unitPriceAgreed),
      taxRate: item.taxRate == null ? null : toNumberPrice(item.taxRate),
    })),
    OrderItem: undefined,
  });
}
