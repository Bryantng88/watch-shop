import { prisma } from "@/server/db/client";
import { getPaymentOwnerSummaryProjections } from "@/domains/projection/server/payment-owner-summary.projection";
import type { OrderSearchInput } from "../shared";
import { toNumberPrice, toPlain } from "../shared";
import { buildOrderPaymentFlow } from "../../shared";
import { listAdminOrdersRepo } from "./order-list.repo";
import { syncWatchInventoryFromOrderId } from "../order-watch-sync.service";
function totalAmount(order: any) {
  // Order total chỉ lấy giá trị order. Không cộng shipment fee / payment OUT / payment khác domain.
  return toNumberPrice(order.subtotal);
}

type PaymentSummary = ReturnType<typeof emptyPaymentSummary>;

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

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function isCancelledOrderStatus(status: unknown) {
  const key = normalizeStatus(status);
  return key === "CANCELLED" || key === "CANCELED";
}

function isDeliveredStatus(status: unknown) {
  return normalizeStatus(status) === "DELIVERED";
}

function hasRemainingAmount(value: unknown) {
  return toNumberPrice(value) > 0;
}
function resolveDerivedOrderStatus(order: any, payment: any) {
  const orderStatus = String(order.status ?? "").toUpperCase();

  if (orderStatus === "CANCELLED" || orderStatus === "CANCELED") {
    return order.status;
  }

  const shipmentStatus = String(
    order.shipmentStatus ??
    order.fulfillmentStatus ??
    ""
  ).toUpperCase();

  const shipmentDone = shipmentStatus === "DELIVERED";
  const fullyPaid = Boolean(payment?.isFullyPaid);

  if (shipmentDone && fullyPaid) {
    return "COMPLETED";
  }

  return order.status;
}
function isDeliveredRemainingItem(item: any) {
  return isDeliveredStatus(item.shipmentStatus ?? item.fulfillmentStatus) && hasRemainingAmount(item.remainingAmount);
}

function buildKeywordWhere(q?: string | null) {
  const keyword = String(q ?? "").trim();
  if (!keyword) return {};

  return {
    OR: [
      { refNo: { contains: keyword, mode: "insensitive" as const } },
      { customerName: { contains: keyword, mode: "insensitive" as const } },
      { shipPhone: { contains: keyword, mode: "insensitive" as const } },
    ],
  };
}

async function getPaymentSummaries(orderIds: string[], totalsByOrderId: Map<string, number>) {
  if (!orderIds.length) return new Map<string, PaymentSummary>();
  const projections = await getPaymentOwnerSummaryProjections(prisma, "ORDER", orderIds);
  const map = new Map<string, PaymentSummary>();
  for (const id of orderIds) {
    const projection = projections.get(id);
    const total = totalsByOrderId.get(id) ?? 0;
    map.set(id, projection ? {
      paidAmount: projection.paidTotal,
      collectedAmount: projection.collectedTotal,
      unpaidAmount: projection.unpaidTotal,
      remainingAmount: projection.remaining,
      hasPendingPayment: projection.pendingCount > 0,
      isFullyPaid: total > 0 && projection.remaining <= 0,
    } : emptyPaymentSummary(total));
  }
  return map;
}

async function getDeliveredRemainingCount(input: OrderSearchInput) {
  const candidateOrders = await prisma.order.findMany({
    where: {
      AND: [
        buildKeywordWhere(input.q),
        {
          status: { in: ["POSTED", "PAID", "PROCESSING", "SHIPPED", "RESERVED"] as any },
        },
        { hasShipment: true },
        { shipments: { some: { status: "DELIVERED" as any } } },
      ],
    },
    select: {
      id: true,
      subtotal: true,
    },
  });

  const totalsByOrderId = new Map(candidateOrders.map((order) => [order.id, totalAmount(order)]));
  const summaries = await getPaymentSummaries(
    candidateOrders.map((order) => order.id),
    totalsByOrderId,
  );

  return candidateOrders.filter((order) => {
    const total = totalsByOrderId.get(order.id) ?? 0;
    const summary = summaries.get(order.id) ?? emptyPaymentSummary(total);
    return summary.remainingAmount > 0;
  }).length;
}
async function syncCompletedDeliveredOrders() {
  const candidateOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["POSTED", "PAID", "PROCESSING", "SHIPPED", "RESERVED"] as any,
      },
      hasShipment: true,
      shipments: {
        some: {
          status: "DELIVERED" as any,
        },
      },
    },
    select: {
      id: true,
      subtotal: true,
    },
  });

  if (!candidateOrders.length) return;

  const totalsByOrderId = new Map(
    candidateOrders.map((order) => [order.id, totalAmount(order)]),
  );

  const summaries = await getPaymentSummaries(
    candidateOrders.map((order) => order.id),
    totalsByOrderId,
  );

  const completedIds = candidateOrders
    .filter((order) => {
      const total = totalsByOrderId.get(order.id) ?? 0;
      const summary = summaries.get(order.id) ?? emptyPaymentSummary(total);

      return total > 0 && summary.isFullyPaid;
    })
    .map((order) => order.id);

  if (!completedIds.length) return;

  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: {
        id: { in: completedIds },
      },
      data: {
        status: "COMPLETED" as any,
        paymentStatus: "PAID" as any,
        updatedAt: new Date(),
      },
    });

    for (const orderId of completedIds) {
      await syncWatchInventoryFromOrderId(tx as any, orderId);
    }
  });
}
export async function getAdminOrderList(input: OrderSearchInput) {
  await syncCompletedDeliveredOrders();

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
  const paymentSummaries = await getPaymentSummaries(
    rows.map((order) => order.id),
    totalsByOrderId,
  );

  const items = rows.map((order) => {
    const orderStatus = normalizeStatus(order.status);
    const isCancelled = isCancelledOrderStatus(orderStatus);
    const total = totalsByOrderId.get(order.id) ?? 0;
    const payment = paymentSummaries.get(order.id) ?? emptyPaymentSummary(total);
    const derivedStatus = resolveDerivedOrderStatus(order, payment);
    const paidAmount = isCancelled ? 0 : payment.paidAmount;
    const collectedAmount = isCancelled ? 0 : payment.collectedAmount;
    const unpaidPaymentAmount = isCancelled ? 0 : payment.unpaidAmount;
    const remainingAmount = isCancelled ? 0 : payment.remainingAmount;
    const isFullyPaid = !isCancelled && payment.isFullyPaid;

    const paymentFlow = buildOrderPaymentFlow({
      reserveType: order.reserveType,
      paymentMethod: order.paymentMethod,
      depositRequired: toNumberPrice(order.depositRequired),
      depositPaid: toNumberPrice(order.depositPaid),
    });

    const shipmentStatus = (order as any).shipmentStatus ?? null;

    return {
      id: order.id,
      refNo: order.refNo,
      customerName: order.customerName,
      customerPhone: order.shipPhone,
      shipPhone: order.shipPhone,

      shipmentProgressEvents: (order as any).shipmentProgressEvents ?? [],
      status: derivedStatus,
      paymentStatus: isFullyPaid ? "PAID" : order.paymentStatus,
      shipmentStatus,
      activeShipmentId: (order as any).activeShipmentId ?? null,
      fulfillmentStatus: order.hasShipment ? shipmentStatus ?? "MISSING" : "NO_SHIPMENT",

      reserveType: order.reserveType,
      paymentMethod: order.paymentMethod,
      depositRequired: toNumberPrice(order.depositRequired),
      depositPaid: toNumberPrice(order.depositPaid),

      paymentFlowLabel: paymentFlow.label,
      paymentFlowTone: paymentFlow.tone,
      paymentFlowDescription: paymentFlow.description,

      paidAmount,
      collectedAmount,
      unpaidPaymentAmount,
      remainingAmount,
      hasPendingPayment: isCancelled ? false : payment.hasPendingPayment,
      isFullyPaid,

      subtotal: toNumberPrice(order.subtotal),
      totalAmount: total,
      currency: "VND",

      hasShipment: order.hasShipment,

      itemsCount: order._count?.orderItem ?? 0,
      itemCount: order._count?.orderItem ?? 0,

      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      source: order.quickFlowType === "QUICK_ORDER" ? "WATCH_QUICK_ORDER" : order.source,
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

  // Sub-filter này phải dựa vào remainingAmount sau khi cộng PAID + COLLECTED.
  // Nếu COD đã COLLECTED đủ tiền thì không còn nằm trong “Đã giao / còn phải thu”.
  const filteredItems =
    input.subFilter === "delivered_remaining"
      ? items.filter(isDeliveredRemainingItem)
      : items;

  const deliveredRemainingCount = await getDeliveredRemainingCount(input);

  const patchedCounts = {
    ...counts,
    processingSub: {
      ...(counts.processingSub ?? {}),
      delivered_remaining: deliveredRemainingCount,
    },
  };

  return toPlain({
    items: filteredItems,
    total: input.subFilter === "delivered_remaining" ? deliveredRemainingCount : total,
    counts: patchedCounts,
    page,
    pageSize,
  });
}
