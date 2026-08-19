import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

import { syncWatchInventoryFromOrderId } from "./order-watch-sync.service";
import { recordOrderMutation } from "./events/order-business-event.emitter";

type Tx = Prisma.TransactionClient;

export type OrderSettlementSnapshot = {
  totalDue: number;
  paidTotal: number;
  collectedTotal?: number | null;
  depositPaid?: number | null;
};

export type OrderSettlementResult = {
  completed: boolean;
  fullyPaid: boolean;
  shipmentCompleted: boolean;
  status: OrderStatus;
};

export function evaluateOrderSettlement(input: {
  currentStatus: string;
  hasShipment: boolean;
  shipmentStatuses: string[];
  totalDue: number;
  paidTotal: number;
  collectedTotal?: number | null;
}) {
  const currentStatus = String(input.currentStatus ?? "").toUpperCase();
  const locked = ["CANCELLED", "CANCELED", "RETURNING", "RETURNED"].includes(currentStatus);
  const totalDue = Math.max(0, Number(input.totalDue) || 0);
  const paidTotal = Math.max(0, Number(input.paidTotal) || 0);
  const collectedTotal = Math.max(0, Number(input.collectedTotal) || 0);
  const fullyPaid = totalDue > 0 && paidTotal + collectedTotal >= totalDue;
  const shipmentCompleted = !input.hasShipment || input.shipmentStatuses.some((status) => String(status).toUpperCase() === "DELIVERED");
  return { locked, fullyPaid, shipmentCompleted, completed: fullyPaid && shipmentCompleted && !locked };
}

function money(value: number) {
  return new Prisma.Decimal(Math.max(0, Number(value) || 0));
}

/**
 * The single completion gate shared by Payment and Shipment mutations.
 */
export async function reconcileOrderSettlementTx(
  tx: Tx,
  orderId: string,
  snapshot: OrderSettlementSnapshot,
): Promise<OrderSettlementResult> {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      refNo: true,
      hasShipment: true,
      shipments: { select: { status: true } },
    },
  });

  if (!order) throw new Error("Order không tồn tại.");

  const { fullyPaid, shipmentCompleted, completed } = evaluateOrderSettlement({
    currentStatus: String(order.status),
    hasShipment: order.hasShipment,
    shipmentStatuses: order.shipments.map((shipment) => String(shipment.status)),
    totalDue: snapshot.totalDue,
    paidTotal: snapshot.paidTotal,
    collectedTotal: snapshot.collectedTotal,
  });
  const nextStatus = completed ? OrderStatus.COMPLETED : order.status;
  const statusChanged = nextStatus !== order.status;

  await tx.order.update({
    where: { id: orderId },
    data: {
      ...(snapshot.depositPaid === undefined
        ? {}
        : { depositPaid: money(snapshot.depositPaid ?? 0) }),
      paymentStatus: fullyPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
      status: nextStatus,
      updatedAt: new Date(),
    },
  });

  if (statusChanged) {
    await syncWatchInventoryFromOrderId(tx, orderId);
    await recordOrderMutation(tx, {
      eventKey: "order.completed",
      orderId,
      refNo: order.refNo,
      fromStatus: String(order.status),
      toStatus: String(OrderStatus.COMPLETED),
      source: "ORDER_SETTLEMENT",
    });
  }

  return {
    completed,
    fullyPaid,
    shipmentCompleted,
    status: nextStatus,
  };
}
