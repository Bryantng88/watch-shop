import { PaymentDirection, PaymentStatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import type { OrderSearchInput } from "../shared";
import { toNumberPrice, toPlain } from "../shared";
import { listAdminOrdersRepo } from "./order-list.repo";
import { buildOrderPaymentFlow } from "../../shared";
function totalAmount(order: any) {
  return toNumberPrice(order.subtotal) + toNumberPrice(order.shippingFee);
}

function emptyPaymentSummary(total: number) {
  return {
    paidAmount: 0,
    collectedAmount: 0,
    unpaidAmount: 0,
    remainingAmount: total,
    hasPendingPayment: false,
    isFullyPaid: total <= 0,
  };
}

async function getPaymentSummaries(orderIds: string[], totalsByOrderId: Map<string, number>) {
  if (!orderIds.length) return new Map<string, ReturnType<typeof emptyPaymentSummary>>();

  const payments = await prisma.payment.findMany({
    where: {
      order_id: { in: orderIds },
      direction: PaymentDirection.IN,
    },
    select: {
      order_id: true,
      amount: true,
      status: true,
    },
  });

  const map = new Map<string, ReturnType<typeof emptyPaymentSummary>>();
  for (const id of orderIds) {
    map.set(id, emptyPaymentSummary(totalsByOrderId.get(id) ?? 0));
  }

  for (const payment of payments) {
    if (!payment.order_id) continue;
    const current = map.get(payment.order_id) ?? emptyPaymentSummary(totalsByOrderId.get(payment.order_id) ?? 0);
    const amount = toNumberPrice(payment.amount);
    const status = String(payment.status ?? "").toUpperCase();

    if (status === PaymentStatus.PAID) current.paidAmount += amount;
    else if (status === "COLLECTED") current.collectedAmount += amount;
    else if (status === PaymentStatus.UNPAID) current.unpaidAmount += amount;

    current.hasPendingPayment = current.hasPendingPayment || status === PaymentStatus.UNPAID || status === "COLLECTED";
    map.set(payment.order_id, current);
  }

  for (const [orderId, summary] of map.entries()) {
    const total = totalsByOrderId.get(orderId) ?? 0;
    summary.remainingAmount = Math.max(0, total - summary.paidAmount);
    summary.isFullyPaid = total > 0 && summary.paidAmount >= total;
  }

  return map;
}

export async function getAdminOrderList(input: OrderSearchInput) {
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));

  const { rows, total, counts } = await listAdminOrdersRepo(prisma, {
    q: input.q,
    view: input.view,
    subFilter: input.subFilter,
    sort: input.sort,
    page,
    pageSize,
  });

  const totalsByOrderId = new Map(rows.map((order) => [order.id, totalAmount(order)]));
  const paymentSummaries = await getPaymentSummaries(rows.map((order) => order.id), totalsByOrderId);

  const items = rows.map((order) => {
    const total = totalsByOrderId.get(order.id) ?? 0;
    const payment = paymentSummaries.get(order.id) ?? emptyPaymentSummary(total);
    const paymentFlow = buildOrderPaymentFlow({
      reserveType: order.reserveType,
      paymentMethod: order.paymentMethod,
      depositRequired: toNumberPrice(order.depositRequired),
      depositPaid: toNumberPrice(order.depositPaid),
    });
    return {
      id: order.id,
      refNo: order.refNo,
      customerName: order.customerName,
      customerPhone: order.shipPhone,
      shipPhone: order.shipPhone,

      status: order.status,
      paymentStatus: order.paymentStatus,
      shipmentStatus: (order as any).shipmentStatus ?? null,
      activeShipmentId: (order as any).activeShipmentId ?? null,
      fulfillmentStatus: order.hasShipment
        ? (order as any).shipmentStatus ?? "MISSING"
        : "NO_SHIPMENT",

      reserveType: order.reserveType,
      paymentMethod: order.paymentMethod,
      depositRequired: toNumberPrice(order.depositRequired),
      depositPaid: toNumberPrice(order.depositPaid),

      paymentFlowLabel: paymentFlow.label,
      paymentFlowTone: paymentFlow.tone,
      paymentFlowDescription: paymentFlow.description,

      paidAmount: payment.paidAmount,
      collectedAmount: payment.collectedAmount,
      unpaidPaymentAmount: payment.unpaidAmount,
      remainingAmount: payment.remainingAmount,

      subtotal: toNumberPrice(order.subtotal),
      totalAmount: total,
      currency: "VND",

      hasShipment: order.hasShipment,
      hasPendingPayment: payment.hasPendingPayment,
      isFullyPaid: payment.isFullyPaid,

      itemsCount: order._count?.orderItem ?? 0,
      itemCount: order._count?.orderItem ?? 0,

      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      source:
        order.quickFlowType === "QUICK_ORDER"
          ? "WATCH_QUICK_ORDER"
          : order.source,
      sourceLabel:
        order.quickFlowType === "QUICK_ORDER"
          ? "Tạo từ watch"
          : order.source === "WEB"
            ? "Web"
            : order.source === "ADMIN"
              ? "Nội bộ"
              : null,
      verificationStatus: order.verificationStatus,
    };
  });

  return toPlain({ items, total, counts, page, pageSize });
}
