import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

import { syncWatchInventoryFromOrderId } from "./order-watch-sync.service";

type Tx = Prisma.TransactionClient;

export type OrderSettlementSnapshot = {
  totalDue: number;
  paidTotal: number;
  depositPaid?: number | null;
};

export type OrderSettlementResult = {
  completed: boolean;
  fullyPaid: boolean;
  shipmentCompleted: boolean;
  status: OrderStatus;
};

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
      hasShipment: true,
      shipments: { select: { status: true } },
    },
  });

  if (!order) throw new Error("Order không tồn tại.");

  const currentStatus = String(order.status ?? "").toUpperCase();
  const locked = ["CANCELLED", "CANCELED", "RETURNING", "RETURNED"].includes(currentStatus);
  const totalDue = Math.max(0, Number(snapshot.totalDue) || 0);
  const paidTotal = Math.max(0, Number(snapshot.paidTotal) || 0);
  const fullyPaid = totalDue > 0 && paidTotal >= totalDue;
  const shipmentCompleted =
    !order.hasShipment ||
    order.shipments.some(
      (shipment) => String(shipment.status ?? "").toUpperCase() === "DELIVERED",
    );
  const completed = fullyPaid && shipmentCompleted && !locked;
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
  }

  return {
    completed,
    fullyPaid,
    shipmentCompleted,
    status: nextStatus,
  };
}
