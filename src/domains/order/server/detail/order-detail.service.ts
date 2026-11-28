import { getOrderDetailProjection } from "@/domains/projection/server/order-detail.projection";
import { prisma } from "@/server/db/client";
import { toNumberPrice, toPlain } from "../shared";
import { getOrderDraftForEditRepo, getOrderTradeInForEditRepo } from "./order-detail.repo";

export async function getAdminOrderDetail(id: string) {
  const row = await getOrderDetailProjection(prisma, id);
  if (!row) throw new Error("Order không tồn tại");
  return toPlain(row);
}

// Edit remains source-backed because it is a command preparation surface.
export async function getOrderDraftForEdit(orderId: string) {
  const [row, tradeIn] = await Promise.all([
    getOrderDraftForEditRepo(prisma, orderId),
    getOrderTradeInForEditRepo(prisma, orderId),
  ]);
  if (!row) throw new Error("Order không tồn tại");

  return toPlain({
    ...row,
    tradeIn: tradeIn
      ? {
        productId: tradeIn.acquisitionItem[0]?.productId ?? null,
        sku: tradeIn.acquisitionItem[0]?.product?.sku ?? null,
        title: tradeIn.acquisitionItem[0]?.productTitle ?? "Đồng hồ trade-in",
        amount: toNumberPrice(tradeIn.acquisitionItem[0]?.unitCost ?? tradeIn.totalAmount),
        notes: tradeIn.notes ?? "",
        audienceSegment: tradeIn.audienceSegment === "WOMEN" ? "WOMEN" as const : "MEN" as const,
      }
      : null,
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
