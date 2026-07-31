import { OrderStatus, OrderVerificationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import * as serviceRequestService from "@/app/(admin)/admin/services/_server/service_request.service";
import { createFromOrderTx } from "@/domains/shipment/server";
import { createInitialPaymentsForOrderApplicationTx } from "@/domains/payment/application";
import {
  cancelPendingOwnerPaymentsTx,
  recordPaymentMutations,
  type PaymentMutation,
} from "@/domains/payment/server";
import { toPlain } from "../shared";
import {
  cancelOrderRepo,
  getOrderForPostRepo,
  getOrdersForPostRepo,
  markOrderPostedRepo,
  updateOrderVerificationRepo,
} from "./order-post.repo";
import { syncWatchInventoryFromOrderId } from "../order-watch-sync.service";
import {
  recordShipmentMutation,
  recordShipmentMutations,
  type ShipmentMutation,
} from "@/domains/shipment/server/events";
import {
  recordOrderMutation,
  recordOrderMutations,
  type OrderMutation,
} from "../events";
import { processBusinessEventOperation } from "@/domains/event/delivery";

async function processRecordedOperations(
  events: Array<{ projectionDeliveryKey?: string | null }>,
) {
  for (const key of [...new Set(
    events.map((event) => String(event.projectionDeliveryKey ?? "").trim()).filter(Boolean),
  )]) {
    await processBusinessEventOperation(key);
  }
}
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

  const initialPayments = await createInitialPaymentsForOrderApplicationTx(tx, order.id);

  const shipment = order.hasShipment
    ? await createFromOrderTx(tx as any, {
      id: order.id,
      orderRefNo: refNo,
      customerName: order.customerName,
      shipPhone: order.shipPhone,
      shipAddress: order.shipAddress,
      shipCity: order.shipCity ?? null,
      shipDistrict: order.shipDistrict ?? null,
      shipWard: order.shipWard ?? null,
    })
    : null;

  if (order.orderItem.some((item) => item.kind === "SERVICE")) {
    await serviceRequestService.createFromOrderTx(tx as any, { ...order, items: order.orderItem } as any);
  }

  return { id: order.id, status: "POSTED" as const, refNo, shipment, initialPayments };
}

export async function postOneOrder(orderId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const posted = await postOneOrderTx(tx, orderId);
    const events = [];
    if (posted.shipment) {
      events.push(await recordShipmentMutation(tx, {
      eventKey: "shipment.created",
      shipmentId: posted.shipment.id,
      orderId: posted.id,
      orderRefNo: posted.refNo,
      shipmentRefNo: posted.shipment.refNo,
      fromStatus: null,
      toStatus: String(posted.shipment.status),
      carrier: posted.shipment.carrier,
      trackingCode: posted.shipment.trackingCode,
      note: posted.shipment.notes,
      source: "ORDER_POST",
      }));
    }
    events.push(...await recordPaymentMutations(
      tx,
      posted.initialPayments.map((payment) => ({
      paymentId: payment.id,
      eventKey: "payment.created",
      })),
    ));
    events.push(await recordOrderMutation(tx, {
      eventKey: "order.posted",
      orderId: posted.id,
      refNo: posted.refNo,
      fromStatus: "DRAFT",
      toStatus: "POSTED",
      source: "ORDER_POST",
    }));
    return {
      ...posted,
      events: events.map((event) => ({
        projectionDeliveryKey: event.projectionDeliveryKey,
      })),
    };
  });
  await processRecordedOperations(result.events);
  return result;
}

export async function postOrders(orderIds: string[]) {
  const result = await prisma.$transaction(async (tx) => {
    const orders = await getOrdersForPostRepo(tx as any, orderIds);
    if (!orders.length) throw new Error("Không có order DRAFT nào để post");

    let posted = 0;
    const shipmentMutations: ShipmentMutation[] = [];
    const paymentMutations: PaymentMutation[] = [];
    for (const order of orders) {
      const postedOrder = await postOneOrderTx(tx, order.id);
      if (postedOrder.shipment) {
        shipmentMutations.push({
          eventKey: "shipment.created",
          shipmentId: postedOrder.shipment.id,
          orderId: postedOrder.id,
          orderRefNo: postedOrder.refNo,
          shipmentRefNo: postedOrder.shipment.refNo,
          fromStatus: null,
          toStatus: String(postedOrder.shipment.status),
          carrier: postedOrder.shipment.carrier,
          trackingCode: postedOrder.shipment.trackingCode,
          note: postedOrder.shipment.notes,
          source: "ORDER_POST_BULK",
        });
      }
      paymentMutations.push(
        ...postedOrder.initialPayments.map((payment) => ({
          paymentId: payment.id,
          eventKey: "payment.created" as const,
        })),
      );
      posted += 1;
    }

    const orderMutations: OrderMutation[] = orders.map((order) => ({
      eventKey: "order.posted",
      orderId: order.id,
      refNo: order.refNo,
      fromStatus: "DRAFT",
      toStatus: "POSTED",
      source: "ORDER_POST_BULK",
    }));
    const events = [
      ...await recordPaymentMutations(tx, paymentMutations),
      ...await recordShipmentMutations(tx, shipmentMutations),
      ...await recordOrderMutations(tx, orderMutations),
    ];
    return {
      count: posted,
      shipmentMutations,
      paymentMutations,
      orderMutations,
      events: events.map((event) => ({
        projectionDeliveryKey: event.projectionDeliveryKey,
      })),
    };
  });
  await processRecordedOperations(result.events);
  return result;
}

async function cancelOrderSideEffectsTx(
  tx: Prisma.TransactionClient,
  orderId: string,
  reason?: string | null,
): Promise<{ paymentMutations: PaymentMutation[]; shipmentMutations: ShipmentMutation[] }> {
  const shipments = await tx.shipment.findMany({
    where: {
      orderId,
      status: { notIn: ["DELIVERED", "RETURNED", "CANCELLED"] as any },
    },
    select: {
      id: true,
      orderId: true,
      orderRefNo: true,
      refNo: true,
      status: true,
      carrier: true,
      trackingCode: true,
    },
  });
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
  return {
    paymentMutations,
    shipmentMutations: shipments.map((shipment) => ({
      eventKey: "shipment.cancelled",
      shipmentId: shipment.id,
      orderId: shipment.orderId,
      orderRefNo: shipment.orderRefNo,
      shipmentRefNo: shipment.refNo,
      fromStatus: String(shipment.status),
      toStatus: "CANCELLED",
      carrier: shipment.carrier,
      trackingCode: shipment.trackingCode,
      note: reason,
      source: "ORDER_CANCEL",
    })),
  };
}

export async function cancelOrder(input: { id: string; reason?: string | null }) {
  const result = await prisma.$transaction(async (tx) => {
    const updated = await cancelOrderRepo(tx as any, input.id, input.reason ?? null);

    const sideEffects = await cancelOrderSideEffectsTx(tx, input.id, input.reason ?? null);

    await syncWatchInventoryFromOrderId(tx, input.id);

    const orderMutation = {
      eventKey: "order.cancelled",
      orderId: input.id,
      fromStatus: "POSTED",
      toStatus: "CANCELLED",
      note: input.reason,
      source: "ORDER_CANCEL",
    } satisfies OrderMutation;
    const events = [
      ...await recordPaymentMutations(tx, sideEffects.paymentMutations),
      ...await recordShipmentMutations(tx, sideEffects.shipmentMutations),
      await recordOrderMutation(tx, orderMutation),
    ];
    return {
      updated: toPlain(updated),
      ...sideEffects,
      events: events.map((event) => ({
        projectionDeliveryKey: event.projectionDeliveryKey,
      })),
    };
  });
  await processRecordedOperations(result.events);
  return result.updated;
}

export async function verifyOrder(input: { id: string; status: "VERIFIED" | "REJECTED" }) {
  const result = await prisma.$transaction(async (tx) => {
    const updated = toPlain(
      await updateOrderVerificationRepo(
        tx,
        input.id,
        input.status as OrderVerificationStatus,
      ),
    );
    const event = await recordOrderMutation(tx, {
      eventKey: input.status === "VERIFIED" ? "order.verified" : "order.rejected",
      orderId: input.id,
      toStatus: input.status,
      source: "ORDER_VERIFY",
    });
    return { updated, event };
  });
  await processRecordedOperations([result.event]);
  return result.updated;
}
