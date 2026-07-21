import { OrderStatus, OrderVerificationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import * as serviceRequestService from "@/app/(admin)/admin/services/_server/service_request.service";
import { createFromOrderTx } from "@/domains/shipment/server";
import { createInitialPaymentsForOrderApplicationTx } from "@/domains/payment/application";
import { cancelPendingOwnerPaymentsTx, publishPaymentMutations, type PaymentMutation } from "@/domains/payment/server";
import { toPlain } from "../shared";
import {
  cancelOrderRepo,
  getOrderForPostRepo,
  getOrdersForPostRepo,
  markOrderPostedRepo,
  updateOrderVerificationRepo,
} from "./order-post.repo";
import { syncWatchInventoryFromOrderId } from "../order-watch-sync.service";
function assertPositiveOrderSubtotal(order: { subtotal?: unknown; orderItem?: any[] }) {
  const subtotal = Number(order.subtotal ?? 0);

  const itemSubtotal = (order.orderItem ?? []).reduce(
    (sum, item) => sum + Number(item.subtotal ?? 0),
    0,
  );

  const finalSubtotal = subtotal > 0 ? subtotal : itemSubtotal;

  if (!Number.isFinite(finalSubtotal) || finalSubtotal <= 0) {
    throw new Error("Không thể post đơn hàng có giá trị bằng 0. Vui lòng nhập giá chốt trước khi post.");
  }
}
export async function postOneOrderTx(tx: Prisma.TransactionClient, orderId: string) {
  const order = await getOrderForPostRepo(tx as any, orderId);
  if (!order) throw new Error("Order không tồn tại");
  if (order.status !== OrderStatus.DRAFT) {
    throw new Error(`Chỉ được post order ở trạng thái DRAFT. Hiện tại: ${order.status}`);
  }
  assertPositiveOrderSubtotal(order);
  const refNo =
    order.refNo ??
    (await genRefNo(tx, {
      model: tx.order,
      prefix: "OD",
      field: "refNo",
      padding: 6,
    }));

  await markOrderPostedRepo(tx as any, order.id, refNo);
  await syncWatchInventoryFromOrderId(tx, order.id);

  if (order.verificationStatus === OrderVerificationStatus.PENDING) {
    await updateOrderVerificationRepo(tx as any, order.id, OrderVerificationStatus.VERIFIED);
  }

  await createInitialPaymentsForOrderApplicationTx(tx, order.id);

  if (order.hasShipment) {
    await createFromOrderTx(tx as any, {
      id: order.id,
      orderRefNo: refNo,
      customerName: order.customerName,
      shipPhone: order.shipPhone,
      shipAddress: order.shipAddress,
      shipCity: order.shipCity ?? null,
      shipDistrict: order.shipDistrict ?? null,
      shipWard: order.shipWard ?? null,
    });
  }

  if (order.orderItem.some((item) => item.kind === "SERVICE")) {
    await serviceRequestService.createFromOrderTx(tx as any, { ...order, items: order.orderItem } as any);
  }

  return { id: order.id, status: "POSTED" as const, refNo };
}

export async function postOneOrder(orderId: string) {
  return prisma.$transaction((tx) => postOneOrderTx(tx, orderId));
}

export async function postOrders(orderIds: string[]) {
  return prisma.$transaction(async (tx) => {
    const orders = await getOrdersForPostRepo(tx as any, orderIds);
    if (!orders.length) throw new Error("Không có order DRAFT nào để post");

    let posted = 0;
    for (const order of orders) {
      await postOneOrderTx(tx, order.id);
      posted += 1;
    }

    return { count: posted };
  });
}

async function cancelOrderSideEffectsTx(
  tx: Prisma.TransactionClient,
  orderId: string,
  reason?: string | null,
): Promise<PaymentMutation[]> {
  await tx.shipment.updateMany({
    where: {
      orderId,
      status: {
        notIn: ["DELIVERED", "RETURNED", "CANCELLED"] as any,
      },
    },
    data: {
      status: "CANCELLED" as any,
      notes: reason ?? undefined,
      updatedAt: new Date(),
    },
  });

  const paymentMutations = await cancelPendingOwnerPaymentsTx(tx as any, { ownerType: "ORDER", ownerId: orderId, note: reason });

  await tx.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "UNPAID" as any,
      depositPaid: new Prisma.Decimal(0),
      updatedAt: new Date(),
    },
  });
  return paymentMutations;
}

export async function cancelOrder(input: { id: string; reason?: string | null }) {
  const result = await prisma.$transaction(async (tx) => {
    const updated = await cancelOrderRepo(tx as any, input.id, input.reason ?? null);

    const paymentMutations = await cancelOrderSideEffectsTx(tx, input.id, input.reason ?? null);

    await syncWatchInventoryFromOrderId(tx, input.id);

    return { updated: toPlain(updated), paymentMutations };
  });
  await publishPaymentMutations(result.paymentMutations);
  return result.updated;
}

export async function verifyOrder(input: { id: string; status: "VERIFIED" | "REJECTED" }) {
  return toPlain(await updateOrderVerificationRepo(prisma, input.id, input.status as OrderVerificationStatus));
}
