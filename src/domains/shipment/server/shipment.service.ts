import {
  OrderStatus,
  PaymentDirection,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  ShipmentStatus,
  ShippingFeePayer,
} from "@prisma/client";
import { buildPaymentRef } from "./shipment.utils";
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
const SHIPMENT_STATUS_RETURNED = "RETURNED" as ShipmentStatus;
const ORDER_STATUS_RETURNING = "RETURNING" as OrderStatus;
const ORDER_STATUS_RETURNED = "RETURNED" as OrderStatus;

function assertEditable(status: ShipmentStatus | string) {
  const editableStatuses: ShipmentStatus[] = [
    ShipmentStatus.READY,
    ShipmentStatus.SHIPPED,
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

    if (
      !([ShipmentStatus.READY, ShipmentStatus.SHIPPED] as ShipmentStatus[]).includes(
        shipment.status as ShipmentStatus,
      )
    ) {
      throw new Error(`Chỉ được cập nhật vận chuyển khi shipment READY/SHIPPED. Hiện tại: ${shipment.status}.`);
    }

    if (shipment.order?.status === OrderStatus.CANCELLED) {
      throw new Error("Không thể giao shipment của order đã hủy.");
    }

    const amount = Number(input.amount ?? 0);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Phí ship không hợp lệ.");
    }

    const payer =
      String(input.payer ?? ShippingFeePayer.BUSINESS).toUpperCase() === ShippingFeePayer.CUSTOMER
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
      throw new Error(`Chỉ được xác nhận đã giao khi shipment SHIPPED. Hiện tại: ${shipment.status}.`);
    }

    const isCod = shipment.order?.paymentMethod === PaymentMethod.COD || (await hasPendingCodPaymentTx(tx, shipment.orderId));

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
      const updateResult = await tx.payment.updateMany({
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

      if (updateResult.count === 0) {
        const summary = await recomputeOrderPaymentRollupTx(tx, shipment.orderId);
        const remainingCodAmount = Math.max(
          0,
          Number(summary.totalDue ?? 0) -
          Number(summary.paidTotal ?? 0) -
          Number(summary.collectedTotal ?? 0)
        );

        if (remainingCodAmount > 0) {
          await tx.payment.create({
            data: {
              refNo: await buildPaymentRef(tx),
              type: PaymentType.ORDER,
              direction: PaymentDirection.IN,
              purpose: "ORDER_REMAIN" as any,
              method: PaymentMethod.COD,
              amount: money(remainingCodAmount),
              currency: shipment.currency ?? "VND",
              status: "COLLECTED" as any,
              note:
                input.note ??
                "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
              order_id: shipment.orderId,
              updatedAt: new Date(),
            } as any,
          });
        }
      }

      await tx.order.update({
        where: { id: shipment.orderId },
        data: { status: OrderStatus.SHIPPED, updatedAt: new Date() },
      });
    }

    const summary = await recomputeOrderPaymentRollupTx(tx, shipment.orderId);
    await syncWatchInventoryFromOrderId(tx, shipment.orderId);
    return toPlain({ shipment: updated, isCod, summary });
  });
}

export async function markShipmentReturned(input: CompleteShipmentInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);
    const returnableStatuses: ShipmentStatus[] = [
      ShipmentStatus.SHIPPED,
      ShipmentStatus.DELIVERED,
    ];

    if (!returnableStatuses.includes(shipment.status as ShipmentStatus)) {
      throw new Error(`Chỉ được chuyển đang hoàn khi shipment đang giao/đã giao. Hiện tại: ${shipment.status}.`);
    }

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: SHIPMENT_STATUS_RETURNING,
        notes: input.note ?? shipment.notes ?? null,
        updatedAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: shipment.orderId },
      data: { status: ORDER_STATUS_RETURNING, updatedAt: new Date() },
    });

    // Không sync watch ở bước đang hoàn: watch vẫn HOLD theo order RETURNING.
    return toPlain({ shipment: updated });
  });
}

export async function receiveShipmentReturn(input: ReceiveShipmentReturnInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);

    if (shipment.status !== SHIPMENT_STATUS_RETURNING) {
      throw new Error(`Chỉ được nhận hàng hoàn khi shipment đang RETURNING. Hiện tại: ${shipment.status}.`);
    }

    const amount = Number(input.amount ?? 0);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Phí hoàn hàng không hợp lệ.");
    }

    await cancelActiveShipmentReturnCostPaymentsRepo(tx, shipment.id);

    const payment = amount > 0
      ? await createCompletedShipmentReturnCostPaymentRepo(tx, shipment, { ...input, amount })
      : null;

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: SHIPMENT_STATUS_RETURNED,
        notes: input.note ?? shipment.notes ?? null,
        updatedAt: new Date(),
      },
    });

    await tx.payment.updateMany({
      where: {
        order_id: shipment.orderId,
        type: PaymentType.ORDER,
        direction: PaymentDirection.IN,
        method: PaymentMethod.COD,
        status: "COLLECTED" as any,
      },
      data: {
        status: PaymentStatus.UNPAID,
        note: input.note ?? "Shipment đã nhận hàng hoàn, COD quay lại trạng thái chưa thu.",
        updatedAt: new Date(),
      } as any,
    });

    await tx.order.update({
      where: { id: shipment.orderId },
      data: { status: ORDER_STATUS_RETURNED, updatedAt: new Date() },
    });

    const summary = await recomputeOrderPaymentRollupTx(tx, shipment.orderId);
    await syncWatchInventoryFromOrderId(tx, shipment.orderId);

    return toPlain({ shipment: updated, payment, summary });
  });
}

// Backward-compatible name for code that already imports createShipmentReturnFee.
export async function createShipmentReturnFee(input: ReceiveShipmentReturnInput) {
  return receiveShipmentReturn(input);
}

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
