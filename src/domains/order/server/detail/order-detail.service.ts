import { prisma } from "@/server/db/client";
import { toNumberPrice, toPlain } from "../shared";
import { getOrderDetailRepo, getOrderDraftForEditRepo } from "./order-detail.repo";

export async function getAdminOrderDetail(id: string) {
  const row = await getOrderDetailRepo(prisma, id);
  if (!row) throw new Error("Order không tồn tại");

  const subtotal = toNumberPrice(row.subtotal);
  const shippingAmount = toNumberPrice((row as any).shippingAmount);
  const depositPaid = toNumberPrice(row.depositPaid);

  return toPlain({
    ...row,
    currency: "VND",
    subtotal,
    shippingAmount,
    totalAmount: subtotal + shippingAmount,
    remainingAmount: Math.max(0, subtotal + shippingAmount - depositPaid),
    items: row.orderItem.map((item) => ({
      ...item,
      listPrice: toNumberPrice(item.listPrice),
      unitPriceAgreed: toNumberPrice(item.unitPriceAgreed),
      subtotal: toNumberPrice(item.subtotal),
      taxRate: toNumberPrice(item.taxRate),
      linkedProductTitle: item.linkedOrderItem?.title ?? null,
    })),
    OrderItem: undefined,
  });
}

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
