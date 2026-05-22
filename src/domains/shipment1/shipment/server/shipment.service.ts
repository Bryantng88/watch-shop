import {
  OrderStatus,
  PaymentDirection,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  ShipmentStatus,
  ShippingFeePayer,
} from "@prisma/client";
import { prisma } from "@/server/db/client";
import { recomputeOrderPaymentRollupTx } from "@/domains/payment/server";
import { syncWatchInventoryFromOrderId } from "@/domains/order/server/order-watch-sync.service";
import type {
  CompleteShipmentInput,
  CreateManualShipmentInput,
  CreateShipmentFeeInput,
  CreateShipmentFromOrderInput,
  ReceiveShipmentReturnInput,
  ShipmentListInput,
  UpdateShipmentInput,
} from "../shared";
import {
  cancelActiveShipmentCostPaymentsRepo,
  cancelActiveShipmentReturnCostPaymentsRepo,
  createCompletedShipmentCostPaymentRepo,
  createCompletedShipmentReturnCostPaymentRepo,
  createManualShipmentRepo,
  createShipmentFromOrderRepo,
  getShipmentByIdRepo,
  getShipmentListRepo,
  updateShipmentRepo,
} from "./shipment.repo";
import { money, toPlain, type Tx } from "./shipment.utils";

const SHIPMENT_STATUS_RETURNING = "RETURNING" as ShipmentStatus;
const ORDER_STATUS_RETURNED = "RETURNED" as OrderStatus;

function assertEditable(status: ShipmentStatus | string) {
  const editableStatuses: ShipmentStatus[] = [
    ShipmentStatus.READY,
    ShipmentStatus.SHIPPED,
    SHIPMENT_STATUS_RETURNING,
  ];

  if (editableStatuses.includes(status as ShipmentStatus)) return;

  throw new Error(`Shipment không thể chỉnh sửa ở trạng thái ${status}.`);
}

async function requireShipmentTx(tx: Tx, shipmentId: string) {
  const shipment = await getShipmentByIdRepo(tx as any, shipmentId);
  if (!shipment) throw new Error("Shipment không tồn tại.");
  return shipment;
}

async function hasPendingCodPaymentTx(tx: Tx, orderId: string) {
  const payment = await tx.payment.findFirst({
    where: {
      order_id: orderId,
      type: PaymentType.ORDER,
      direction: PaymentDirection.IN,
      method: PaymentMethod.COD,
      status: PaymentStatus.UNPAID,
    },
    select: { id: true },
  });

  return Boolean(payment);
}

export async function createFromOrderTx(tx: Tx, input: CreateShipmentFromOrderInput) {
  return createShipmentFromOrderRepo(tx, input);
}

export async function listShipments(input: ShipmentListInput) {
  return toPlain(await getShipmentListRepo(prisma as any, input));
}

export async function getShipmentDetail(shipmentId: string) {
  return toPlain(await getShipmentByIdRepo(prisma as any, shipmentId));
}

export async function updateShipment(input: { shipmentId: string; data: UpdateShipmentInput }) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);
    assertEditable(shipment.status);

    const updated = await updateShipmentRepo(tx, input.shipmentId, input.data);
    return toPlain(updated);
  });
}

export async function createShipmentFeeAndShip(input: CreateShipmentFeeInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);

    const updatableStatuses: ShipmentStatus[] = [
      ShipmentStatus.READY,
      ShipmentStatus.SHIPPED,
    ];

    if (!updatableStatuses.includes(shipment.status as ShipmentStatus)) {
      throw new Error(
        `Chỉ được cập nhật vận chuyển khi shipment READY/SHIPPED. Hiện tại: ${shipment.status}.`,
      );
    }

    if (shipment.Order?.status === OrderStatus.CANCELLED) {
      throw new Error("Không thể giao shipment của order đã hủy.");
    }

    const amount = Number(input.amount ?? 0);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Phí ship không hợp lệ.");
    }

    const payer =
      String(input.payer ?? ShippingFeePayer.BUSINESS).toUpperCase() ===
        ShippingFeePayer.CUSTOMER
        ? ShippingFeePayer.CUSTOMER
        : ShippingFeePayer.BUSINESS;

    await cancelActiveShipmentCostPaymentsRepo(tx, shipment.id);

    const payment =
      payer === ShippingFeePayer.BUSINESS && amount > 0
        ? await createCompletedShipmentCostPaymentRepo(tx, shipment, input)
        : null;

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: ShipmentStatus.SHIPPED,
        shippingFee: money(amount),
        shippingFeePayer: payer,
        carrier: input.carrier ?? shipment.carrier ?? null,
        trackingCode: input.trackingCode ?? shipment.trackingCode ?? null,
        shippedAt: shipment.shippedAt ?? new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: shipment.orderId },
      data: { status: OrderStatus.SHIPPED, updatedAt: new Date() },
    });

    const summary = await recomputeOrderPaymentRollupTx(tx, shipment.orderId);
    await syncWatchInventoryFromOrderId(tx, shipment.orderId);

    return toPlain({ shipment: updated, payment, summary });
  });
}

export async function markShipmentDelivered(input: CompleteShipmentInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);

    if (shipment.status !== ShipmentStatus.SHIPPED) {
      throw new Error(
        `Chỉ được xác nhận đã giao khi shipment SHIPPED. Hiện tại: ${shipment.status}.`,
      );
    }

    const isCod =
      shipment.Order?.paymentMethod === PaymentMethod.COD ||
      (await hasPendingCodPaymentTx(tx, shipment.orderId));

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: ShipmentStatus.DELIVERED,
        deliveredAt: new Date(),
        notes: input.note ?? shipment.notes ?? null,
        updatedAt: new Date(),
      },
    });

    if (isCod) {
      await tx.payment.updateMany({
        where: {
          order_id: shipment.orderId,
          type: PaymentType.ORDER,
          direction: PaymentDirection.IN,
          method: PaymentMethod.COD,
          status: PaymentStatus.UNPAID,
        },
        data: {
          status: "COLLECTED" as any,
          note:
            input.note ??
            "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
          updatedAt: new Date(),
        } as any,
      });

      await tx.order.update({
        where: { id: shipment.orderId },
        data: { status: OrderStatus.SHIPPED, updatedAt: new Date() },
      });
    } else {
      await tx.order.update({
        where: { id: shipment.orderId },
        data: { status: OrderStatus.COMPLETED, updatedAt: new Date() },
      });
    }

    const summary = await recomputeOrderPaymentRollupTx(tx, shipment.orderId);
    await syncWatchInventoryFromOrderId(tx, shipment.orderId);

    return toPlain({ shipment: updated, isCod, summary });
  });
}

/**
 * Step 1 of return flow:
 * Logistics reports the shipment is being returned.
 *
 * Only shipment status changes to RETURNING.
 * Order and watch inventory stay unchanged so the watch remains held by this order.
 */
export async function markShipmentReturned(input: CompleteShipmentInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);

    const returnableStatuses: ShipmentStatus[] = [
      ShipmentStatus.SHIPPED,
      ShipmentStatus.DELIVERED,
    ];

    if (!returnableStatuses.includes(shipment.status as ShipmentStatus)) {
      throw new Error(
        `Chỉ được đánh dấu hoàn khi shipment đang giao/đã giao. Hiện tại: ${shipment.status}.`,
      );
    }

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: SHIPMENT_STATUS_RETURNING,
        notes: input.note ?? shipment.notes ?? null,
        updatedAt: new Date(),
      },
    });

    return toPlain({ shipment: updated });
  });
}

/**
 * Step 2 of return flow:
 * Sale has received the returned item and now knows the exact return shipping cost.
 *
 * This finalizes the current shipment as RETURNED, moves the order to RETURNED,
 * records optional shipment return cost as OUT payment, and keeps watch HOLD
 * because ORDER_STATUS_RETURNED is still an active hold status.
 */
export async function receiveShipmentReturn(input: ReceiveShipmentReturnInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);

    const receivableStatuses: ShipmentStatus[] = [
      SHIPMENT_STATUS_RETURNING,
      ShipmentStatus.RETURNED,
    ];

    if (!receivableStatuses.includes(shipment.status as ShipmentStatus)) {
      throw new Error(
        `Chỉ được nhận hàng hoàn khi shipment đang RETURNING/RETURNED. Hiện tại: ${shipment.status}.`,
      );
    }

    const amount = Number(input.amount ?? 0);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Phí hoàn hàng không hợp lệ.");
    }

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: ShipmentStatus.RETURNED,
        notes: input.note ?? shipment.notes ?? null,
        updatedAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: shipment.orderId },
      data: {
        status: ORDER_STATUS_RETURNED,
        updatedAt: new Date(),
      } as any,
    });

    let payment = null;

    if (amount > 0) {
      await cancelActiveShipmentReturnCostPaymentsRepo(tx, shipment.id);
      payment = await createCompletedShipmentReturnCostPaymentRepo(tx, shipment, input);
    }

    const summary = await recomputeOrderPaymentRollupTx(tx, shipment.orderId);
    await syncWatchInventoryFromOrderId(tx, shipment.orderId);

    return toPlain({ shipment: updated, payment, summary });
  });
}

// Backward-compatible alias while old imports/routes are being removed.
export const createShipmentReturnFee = receiveShipmentReturn;

export async function createManualShipment(input: CreateManualShipmentInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await createManualShipmentRepo(tx, input);

    await tx.order.update({
      where: { id: input.orderId },
      data: { status: OrderStatus.PROCESSING, updatedAt: new Date() },
    });

    await syncWatchInventoryFromOrderId(tx, input.orderId);

    return toPlain(shipment);
  });
}
