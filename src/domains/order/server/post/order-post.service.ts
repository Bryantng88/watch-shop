import { OrderStatus, OrderVerificationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import * as serviceRequestService from "@/app/(admin)/admin/services/_server/service_request.service";
import * as shipmentService from "@/app/(admin)/admin/shipments/_server/shipment.service";
import { createInitialPaymentsForOrderApplicationTx } from "@/domains/payment/application";
import { toPlain } from "../shared";
import {
  cancelOrderRepo,
  getOrderForPostRepo,
  getOrdersForPostRepo,
  markOrderPostedRepo,
  updateOrderVerificationRepo,
} from "./order-post.repo";
import { syncWatchInventoryFromOrderId } from "../order-watch-sync.service";

export async function postOneOrderTx(tx: Prisma.TransactionClient, orderId: string) {
  const order = await getOrderForPostRepo(tx as any, orderId);
  if (!order) throw new Error("Order không tồn tại");
  if (order.status !== OrderStatus.DRAFT) {
    throw new Error(`Chỉ được post order ở trạng thái DRAFT. Hiện tại: ${order.status}`);
  }

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
    await shipmentService.createFromOrderTx(tx as any, {
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

export async function cancelOrder(input: { id: string; reason?: string | null }) {
  return prisma.$transaction(async (tx) => {
    const updated = await cancelOrderRepo(tx as any, input.id, input.reason ?? null);
    await syncWatchInventoryFromOrderId(tx, input.id);
    return toPlain(updated);
  });
}

export async function verifyOrder(input: { id: string; status: "VERIFIED" | "REJECTED" }) {
  return toPlain(await updateOrderVerificationRepo(prisma, input.id, input.status as OrderVerificationStatus));
}
