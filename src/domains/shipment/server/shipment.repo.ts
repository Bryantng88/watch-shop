import { PaymentDirection, PaymentPurpose, PaymentStatus, PaymentType, Prisma, ShipmentStatus, ShippingFeePayer, } from "@prisma/client";
import type { DB } from "@/server/db/client";
import type { CreateShipmentFromOrderInput, CreateShipmentFeeInput, ShipmentListInput, UpdateShipmentInput, ReceiveShipmentReturnInput } from "../shared";
import { buildPaymentRef, money, normalizePaymentMethod, normalizeShipmentStatus, nullableText, toNumber, type Tx } from "./shipment.utils";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";

function genShipmentRefNo(tx: Tx) {
  return genRefNo(tx, {
    model: (tx as any).shipment,
    prefix: "SH",
  });
}

export async function getShipmentByIdRepo(db: DB | Tx, shipmentId: string) {
  return (db as any).shipment.findUnique({
    where: { id: shipmentId },
    include: {
      order: {
        select: {
          id: true,
          refNo: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          reserveType: true,
          source: true,
          customerName: true,
          subtotal: true,
          shippingAmount: true,
          hasShipment: true,
          quickFromProductId: true,
          quickFlowType: true,
        },
      },
    },
  });
}

export async function getShipmentListRepo(db: DB | Tx, input: ShipmentListInput) {
  const page = Math.max(1, Number(input.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));
  const status = normalizeShipmentStatus(input.status);
  const q = nullableText(input.q);

  const where: any = {
    ...(status ? { status } : {}),
    ...(q
      ? {
        OR: [
          { refNo: { contains: q, mode: "insensitive" } },
          { orderRefNo: { contains: q, mode: "insensitive" } },
          { customerName: { contains: q, mode: "insensitive" } },
          { shipPhone: { contains: q, mode: "insensitive" } },
          { carrier: { contains: q, mode: "insensitive" } },
          { trackingCode: { contains: q, mode: "insensitive" } },
        ],
      }
      : {}),
  };

  const countWhereBase: any = q
    ? {
      OR: [
        { refNo: { contains: q, mode: "insensitive" } },
        { orderRefNo: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { shipPhone: { contains: q, mode: "insensitive" } },
        { carrier: { contains: q, mode: "insensitive" } },
        { trackingCode: { contains: q, mode: "insensitive" } },
      ],
    }
    : {};

  const [
    rows,
    total,
    all,
    ready,
    shipping,
    returning,
    delivered,
    returned,
    cancelled,
  ] = await Promise.all([
    (db as any).shipment.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        order: {
          select: {
            id: true,
            refNo: true,
            status: true,
            paymentStatus: true,
            paymentMethod: true,
            reserveType: true,
            source: true,
            quickFromProductId: true,
            quickFlowType: true,
            subtotal: true,
            shippingAmount: true,
          },
        },
      },
    }),
    (db as any).shipment.count({ where }),
    (db as any).shipment.count({ where: countWhereBase }),
    (db as any).shipment.count({ where: { ...countWhereBase, status: ShipmentStatus.READY } }),
    (db as any).shipment.count({ where: { ...countWhereBase, status: ShipmentStatus.SHIPPED } }),
    (db as any).shipment.count({ where: { ...countWhereBase, status: "RETURNING" as any } }),
    (db as any).shipment.count({ where: { ...countWhereBase, status: ShipmentStatus.DELIVERED } }),
    (db as any).shipment.count({ where: { ...countWhereBase, status: "RETURNED" as any } }),
    (db as any).shipment.count({ where: { ...countWhereBase, status: ShipmentStatus.CANCELLED } }),
  ]);

  return {
    rows,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
    counts: {
      all,
      ready,
      shipping,
      returning,
      delivered,
      returned,
      cancelled,
    },
  };
}

export async function createShipmentFromOrderRepo(tx: Tx, input: CreateShipmentFromOrderInput) {
  const existing = await (tx as any).shipment.findFirst({
    where: {
      orderId: input.id,
      status: { notIn: ["RETURNED", ShipmentStatus.CANCELLED] as any },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    if (!existing.refNo) {
      return (tx as any).shipment.update({
        where: { id: existing.id },
        data: {
          refNo: await genShipmentRefNo(tx),
          updatedAt: new Date(),
        },
      });
    }

    return existing;
  }

  return (tx as any).shipment.create({
    data: {
      refNo: await genShipmentRefNo(tx),
      orderId: input.id,
      orderRefNo: input.orderRefNo ?? null,
      customerName: input.customerName ?? null,
      shipPhone: input.shipPhone ?? null,
      shipAddress: input.shipAddress ?? null,
      shipCity: input.shipCity ?? null,
      shipDistrict: input.shipDistrict ?? null,
      shippingFeePayer: ShippingFeePayer.BUSINESS,
      shipWard: input.shipWard ?? null,
      shippingAmount: money(0),
      currency: "VND",
      status: ShipmentStatus.READY,
      updatedAt: new Date(),
    },
  });
}

export async function updateShipmentRepo(tx: Tx, shipmentId: string, input: UpdateShipmentInput) {
  return (tx as any).shipment.update({
    where: { id: shipmentId },
    data: {
      shipPhone: input.shipPhone ?? undefined,
      shipAddress: input.shipAddress ?? undefined,
      shipCity: input.shipCity ?? undefined,
      shipDistrict: input.shipDistrict ?? undefined,
      shipWard: input.shipWard ?? undefined,
      carrier: input.carrier ?? undefined,
      trackingCode: input.trackingCode ?? undefined,
      notes: input.notes ?? undefined,
      updatedAt: new Date(),
    },
  });
}

export async function createCompletedShipmentCostPaymentRepo(tx: Tx, shipment: any, input: CreateShipmentFeeInput) {
  const amount = toNumber(input.amount);
  if (amount <= 0) throw new Error("Phí ship phải lớn hơn 0.");
  return tx.payment.create({
    data: {
      refNo: await buildPaymentRef(tx),
      type: PaymentType.SHIPMENT,
      direction: PaymentDirection.OUT,
      purpose: PaymentPurpose.SHIPMENT_COST,
      method: normalizePaymentMethod(input.method, undefined as any) || normalizePaymentMethod(null),
      amount: money(amount),
      currency: shipment.currency ?? "VND",
      status: PaymentStatus.PAID,
      paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
      reference: input.reference ?? null,
      note: input.note ?? "Chi phí vận chuyển đã thanh toán",
      order_id: shipment.orderId,
      shipment_id: shipment.id,
      updatedAt: new Date(),
    },
  });
}

export async function createManualShipmentRepo(tx: Tx, input: import("../shared").CreateManualShipmentInput) {
  const order = await tx.order.findUnique({
    where: { id: input.orderId },
    select: {
      id: true,
      refNo: true,
      customerName: true,
      shipPhone: true,
      shipAddress: true,
      shipCity: true,
      shipDistrict: true,
      shipWard: true,
      status: true,
      hasShipment: true,
    },
  });

  if (!order) throw new Error("Order không tồn tại.");
  if (!order.hasShipment) throw new Error("Order này không có giao hàng.");

  const activeShipment = await (tx as any).shipment.findFirst({
    where: {
      orderId: input.orderId,
      status: { in: [ShipmentStatus.READY, ShipmentStatus.SHIPPED, "RETURNING", ShipmentStatus.DELIVERED] as any },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true },
  });

  if (activeShipment) {
    throw new Error("Order đang có shipment chưa hoàn trả/hủy. Chỉ tạo shipment giao lại sau khi shipment cũ đã RETURNED/CANCELLED.");
  }

  return (tx as any).shipment.create({
    data: {
      refNo: await genShipmentRefNo(tx),
      orderId: input.orderId,
      orderRefNo: order.refNo ?? null,
      customerName: order.customerName ?? null,
      shipPhone: input.shipPhone ?? order.shipPhone ?? null,
      shipAddress: input.shipAddress ?? order.shipAddress ?? null,
      shipCity: input.shipCity ?? order.shipCity ?? null,
      shipDistrict: input.shipDistrict ?? order.shipDistrict ?? null,
      shipWard: input.shipWard ?? order.shipWard ?? null,
      carrier: input.carrier ?? null,
      trackingCode: input.trackingCode ?? null,
      notes: input.notes ?? null,
      shippingAmount: money(0),
      shippingFeePayer: ShippingFeePayer.BUSINESS,
      currency: "VND",
      status: ShipmentStatus.READY,
      updatedAt: new Date(),
    },
  });
}
export async function cancelActiveShipmentCostPaymentsRepo(tx: Tx, shipmentId: string) {
  return tx.payment.updateMany({
    where: {
      shipment_id: shipmentId,
      type: PaymentType.SHIPMENT,
      purpose: PaymentPurpose.SHIPMENT_COST,
      status: { not: PaymentStatus.CANCELED },
    },
    data: {
      status: PaymentStatus.CANCELED,
      note: "Payment phí ship đã bị hủy do cập nhật lại phí ship/người chịu phí.",
      updatedAt: new Date(),
    },
  });
}
export async function cancelActiveShipmentReturnCostPaymentsRepo(tx: Tx, shipmentId: string) {
  return tx.payment.updateMany({
    where: {
      shipment_id: shipmentId,
      type: PaymentType.SHIPMENT,
      purpose: PaymentPurpose.SHIPMENT_RETURN_COST,
      status: { not: PaymentStatus.CANCELED },
    },
    data: {
      status: PaymentStatus.CANCELED,
      note: "Payment phí hoàn hàng đã bị hủy do cập nhật lại phí hoàn.",
      updatedAt: new Date(),
    },
  });
}

export async function createCompletedShipmentReturnCostPaymentRepo(
  tx: Tx,
  shipment: any,
  input: ReceiveShipmentReturnInput
) {
  const amount = toNumber(input.amount);
  if (amount <= 0) throw new Error("Phí hoàn hàng phải lớn hơn 0.");

  return tx.payment.create({
    data: {
      refNo: await buildPaymentRef(tx),
      type: PaymentType.SHIPMENT,
      direction: PaymentDirection.OUT,
      purpose: PaymentPurpose.SHIPMENT_RETURN_COST,
      method: normalizePaymentMethod(input.method, undefined as any) || normalizePaymentMethod(null),
      amount: money(amount),
      currency: shipment.currency ?? "VND",
      status: PaymentStatus.PAID,
      paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
      reference: input.reference ?? null,
      note: input.note ?? "Chi phí vận chuyển hoàn hàng đã thanh toán",
      order_id: shipment.orderId,
      shipment_id: shipment.id,
      updatedAt: new Date(),
    },
  });
}