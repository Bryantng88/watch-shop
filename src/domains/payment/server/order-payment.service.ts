import {
  OrderStatus,
  PaymentDirection,
  PaymentMethod,
  PaymentPurpose,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { syncWatchInventoryFromOrderId } from "@/domains/order/server/order-watch-sync.service";
import {
  COLLECTED,
  createPaymentRowTx,
  getPaymentOwnerSeedTx,
  getPaymentSummary,
  getPaymentSummaryTx,
  listPayments,
  paymentScopeWhere,
  recomputePaymentOwnerRollupTx,
} from "./payment.core";
import { money, toNumber, toPlain, type Tx } from "./payment.utils";

export async function createInitialPaymentsForOrderTx(tx: Tx, orderId: string) {
  const seed = await getPaymentOwnerSeedTx(tx, "ORDER", orderId);
  if (seed.totalDue <= 0) return [];

  const existing = await tx.payment.findFirst({
    where: {
      order_id: orderId,
      type: PaymentType.ORDER,
      purpose: {
        in: [
          PaymentPurpose.ORDER_DEPOSIT,
          PaymentPurpose.ORDER_FULL,
          PaymentPurpose.ORDER_REMAIN,
        ],
      },
    },
    select: { id: true },
  });
  if (existing) return [existing];

  const rows = [];
  const hasDeposit = seed.depositAmount > 0 && seed.depositAmount < seed.totalDue;
  const isCod = seed.defaultMethod === PaymentMethod.COD;

  if (!hasDeposit && !isCod) {
    const full = await createPaymentRowTx(tx, {
      ownerType: "ORDER",
      ownerId: orderId,
      amount: seed.totalDue,
      direction: PaymentDirection.IN,
      type: PaymentType.ORDER,
      purpose: PaymentPurpose.ORDER_FULL,
      method: seed.defaultMethod,
      note: "Payment toàn bộ đơn hàng",
    });
    if (full) rows.push(full);
    return rows;
  }

  if (seed.depositAmount > 0) {
    const deposit = await createPaymentRowTx(tx, {
      ownerType: "ORDER",
      ownerId: orderId,
      amount: seed.depositAmount,
      direction: PaymentDirection.IN,
      type: PaymentType.ORDER,
      purpose: PaymentPurpose.ORDER_DEPOSIT,
      method: PaymentMethod.BANK_TRANSFER,
      note: isCod ? "Payment cọc đơn COD" : "Payment cọc đơn hàng",
    });
    if (deposit) rows.push(deposit);
  }

  if (isCod) {
    const remainingAmount = Math.max(0, seed.totalDue - seed.depositAmount);
    if (remainingAmount > 0) {
      const codRemain = await createPaymentRowTx(tx, {
        ownerType: "ORDER",
        ownerId: orderId,
        amount: remainingAmount,
        direction: PaymentDirection.IN,
        type: PaymentType.ORDER,
        purpose: PaymentPurpose.ORDER_REMAIN,
        method: PaymentMethod.COD,
        note: "Phần còn lại thu COD khi giao hàng.",
      });
      if (codRemain) rows.push(codRemain);
    }
  }

  return rows;
}

export async function markOrderShipmentDeliveredAndCollectCod(input: {
  orderId: string;
  note?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: { id: true, status: true, hasShipment: true, paymentMethod: true },
    });

    if (!order) throw new Error("Order không tồn tại.");
    if (order.status === OrderStatus.DRAFT) throw new Error("Cần post order trước khi giao hàng.");
    if (order.status === OrderStatus.CANCELLED) throw new Error("Không thể giao order đã hủy.");
    if (!order.hasShipment) throw new Error("Order này không có shipment.");

    await (tx as any).shipment.upsert({
      where: { orderId: order.id },
      create: { orderId: order.id, status: "DELIVERED", deliveredAt: new Date(), updatedAt: new Date() },
      update: { status: "DELIVERED", deliveredAt: new Date(), updatedAt: new Date() },
    });

    const summary = await getPaymentSummaryTx(tx, "ORDER", order.id);

    const remainingCodAmount = Math.max(0, summary.totalDue - summary.paidTotal - summary.collectedTotal);

    if (order.paymentMethod === PaymentMethod.COD && remainingCodAmount > 0) {
      const existingCodRemain = await tx.payment.findFirst({
        where: {
          order_id: order.id,
          type: PaymentType.ORDER,
          direction: PaymentDirection.IN,
          purpose: PaymentPurpose.ORDER_REMAIN,
          method: PaymentMethod.COD,
          status: { in: [PaymentStatus.UNPAID, COLLECTED] as any },
        },
        select: { id: true },
      });

      if (existingCodRemain) {
        await tx.payment.update({
          where: { id: existingCodRemain.id },
          data: {
            status: COLLECTED,
            note: input.note ?? "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
            updatedAt: new Date(),
          } as any,
        });
      } else {
        await createPaymentRowTx(tx, {
          ownerType: "ORDER",
          ownerId: order.id,
          amount: remainingCodAmount,
          direction: PaymentDirection.IN,
          type: PaymentType.ORDER,
          purpose: PaymentPurpose.ORDER_REMAIN,
          method: PaymentMethod.COD,
          status: COLLECTED,
          note: input.note ?? "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
        });
      }
    }

    const nextSummary = await recomputePaymentOwnerRollupTx(tx, "ORDER", order.id);

    const shouldCompleteOrder = Number(nextSummary.remaining ?? 0) <= 0;

    if (shouldCompleteOrder) {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.COMPLETED,
          paymentStatus: PaymentStatus.PAID,
          updatedAt: new Date(),
        },
      });

      await syncWatchInventoryFromOrderId(tx, order.id);
    }
    return toPlain({ orderId: order.id, summary: nextSummary });
  });
}

export async function finalizeOrderByPaidAmount(input: { orderId: string; note?: string | null }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        refNo: true,
        status: true,
        hasShipment: true,
        subtotal: true,
        notes: true,
        shipments: {
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          select: { id: true, status: true },
        },
      },
    });

    if (!order) throw new Error("Order không tồn tại.");
    const orderStatus = String(order.status ?? "").toUpperCase();
    if (orderStatus === "DRAFT") throw new Error("Cần post order trước khi chốt theo tiền đã nhận.");
    if (orderStatus === "CANCELLED" || orderStatus === "CANCELED") throw new Error("Không thể chốt order đã hủy.");
    if (orderStatus === "RETURNING" || orderStatus === "RETURNED") throw new Error("Không thể chốt order đang/đã hoàn.");

    const shipmentDelivered =
      !order.hasShipment ||
      (order.shipments ?? []).some((shipment) => String(shipment.status ?? "").toUpperCase() === "DELIVERED");
    if (!shipmentDelivered) throw new Error("Chỉ chốt theo tiền đã nhận khi order không cần giao hàng hoặc shipment đã DELIVERED.");

    const paid = await tx.payment.aggregate({
      where: {
        ...paymentScopeWhere("ORDER", order.id),
        direction: PaymentDirection.IN,
        status: PaymentStatus.PAID,
      } as any,
      _sum: { amount: true },
    });

    const paidTotal = toNumber(paid._sum.amount);
    if (paidTotal <= 0) throw new Error("Order chưa có payment đã nhận tiền để chốt.");

    await tx.payment.updateMany({
      where: {
        ...paymentScopeWhere("ORDER", order.id),
        direction: PaymentDirection.IN,
        status: { in: [PaymentStatus.UNPAID, COLLECTED] as any },
      } as any,
      data: {
        status: PaymentStatus.CANCELED,
        note: input.note ?? "Payment còn mở đã được hủy khi chốt order theo tiền đã nhận.",
        updatedAt: new Date(),
      },
    });

    const currentNote = String(input.note ?? "").trim();
    const finalizedNote = currentNote || `Chốt order theo tiền đã nhận: ${Math.round(paidTotal).toLocaleString("vi-VN")} VND.`;

    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        subtotal: money(paidTotal),
        depositPaid: money(paidTotal),
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.COMPLETED,
        notes: [order.notes, finalizedNote].filter(Boolean).join("\n") || finalizedNote,
        updatedAt: new Date(),
      },
    });

    await syncWatchInventoryFromOrderId(tx, order.id);
    const summary = await getPaymentSummaryTx(tx, "ORDER", order.id);
    return toPlain({ order: updated, summary });
  });
}

export async function listOrderPayments(orderId: string) {
  return listPayments("ORDER", orderId);
}

export async function getOrderPaymentSummary(orderId: string) {
  return getPaymentSummary("ORDER", orderId);
}
