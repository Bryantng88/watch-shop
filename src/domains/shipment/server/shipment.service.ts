import { OrderStatus, PaymentDirection, PaymentMethod, PaymentStatus, PaymentType, ShipmentStatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { recomputeOrderPaymentRollupTx } from "@/domains/payment/server";
import { syncWatchInventoryFromOrderId } from "@/domains/order/server/order-watch-sync.service";
import type { CompleteShipmentInput, CreateShipmentFeeInput, CreateShipmentFromOrderInput, ShipmentListInput, UpdateShipmentInput, CreateManualShipmentInput } from "../shared";
import {
  createCompletedShipmentCostPaymentRepo,
  createShipmentFromOrderRepo,
  getShipmentByIdRepo,
  getShipmentListRepo,
  updateShipmentRepo,
  createManualShipmentRepo,
} from "./shipment.repo";
import { money, toPlain, type Tx } from "./shipment.utils";

function assertEditable(status: ShipmentStatus | string) {
  if (![ShipmentStatus.READY, ShipmentStatus.SHIPPED].includes(status as ShipmentStatus)) {
    throw new Error(`Shipment không thể chỉnh sửa ở trạng thái ${status}.`);
  }
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
    if (shipment.status !== ShipmentStatus.READY) {
      throw new Error(`Chỉ được tạo phí ship khi shipment READY. Hiện tại: ${shipment.status}.`);
    }
    if (shipment.Order?.status === OrderStatus.CANCELLED) {
      throw new Error("Không thể giao shipment của order đã hủy.");
    }

    const payment = await createCompletedShipmentCostPaymentRepo(tx, shipment, input);

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: ShipmentStatus.SHIPPED,
        shippingFee: money(Number(input.amount)),
        carrier: input.carrier ?? shipment.carrier ?? null,
        trackingCode: input.trackingCode ?? shipment.trackingCode ?? null,
        shippedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: shipment.orderId },
      data: { status: OrderStatus.SHIPPED, updatedAt: new Date() },
    });

    await syncWatchInventoryFromOrderId(tx, shipment.orderId);
    return toPlain({ shipment: updated, payment });
  });
}

export async function markShipmentDelivered(input: CompleteShipmentInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);
    if (shipment.status !== ShipmentStatus.SHIPPED) {
      throw new Error(`Chỉ được xác nhận đã giao khi shipment SHIPPED. Hiện tại: ${shipment.status}.`);
    }

    const isCod = shipment.Order?.paymentMethod === PaymentMethod.COD || (await hasPendingCodPaymentTx(tx, shipment.orderId));

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
          note: input.note ?? "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
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

export async function markShipmentReturned(input: CompleteShipmentInput) {
  return prisma.$transaction(async (tx) => {
    const shipment = await requireShipmentTx(tx, input.shipmentId);
    if (![ShipmentStatus.SHIPPED, ShipmentStatus.DELIVERED].includes(shipment.status as ShipmentStatus)) {
      throw new Error(`Chỉ được trả về khi shipment đang giao/đã giao. Hiện tại: ${shipment.status}.`);
    }

    const updated = await (tx as any).shipment.update({
      where: { id: shipment.id },
      data: {
        status: "RETURNED" as any,
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
        note: input.note ?? "Shipment bị trả về, COD quay lại trạng thái chưa thu.",
        updatedAt: new Date(),
      } as any,
    });

    await tx.order.update({
      where: { id: shipment.orderId },
      data: { status: OrderStatus.PROCESSING, updatedAt: new Date() },
    });

    await syncWatchInventoryFromOrderId(tx, shipment.orderId);
    return toPlain({ shipment: updated });
  });
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
