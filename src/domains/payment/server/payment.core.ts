import {
  OrderStatus,
  PaymentDirection,
  PaymentMethod,
  PaymentPurpose,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { syncWatchInventoryFromOrderId } from "@/domains/order/server/order-watch-sync.service";
import type {
  CreatePaymentInput,
  PaymentListItem,
  PaymentOwnerType,
  PaymentSummary,
} from "../shared";
import {
  assertPaymentStatusCollectedExists,
  buildPaymentRef,
  money,
  toNumber,
  toPlain,
  type Tx,
} from "./payment.utils";

export const COLLECTED = assertPaymentStatusCollectedExists();

export const ORDER_PAYMENT_PURPOSES = [
  PaymentPurpose.ORDER_DEPOSIT,
  PaymentPurpose.ORDER_REMAIN,
  PaymentPurpose.ORDER_FULL,
] as const;

export function normalizePaymentMethod(
  value: unknown,
  fallback: PaymentMethod = PaymentMethod.BANK_TRANSFER,
): PaymentMethod {
  const raw = String(value ?? "").trim().toUpperCase();
  if (raw === "CASH") return PaymentMethod.CASH;
  if (raw === "COD") return PaymentMethod.COD;
  if (raw === "BANK_TRANSFER") return PaymentMethod.BANK_TRANSFER;
  return fallback;
}

export function activePaymentStatuses() {
  return [PaymentStatus.UNPAID, COLLECTED, PaymentStatus.PAID] as any;
}

export function ownerWhere(ownerType: PaymentOwnerType, ownerId: string) {
  if (ownerType === "ORDER") return { order_id: ownerId };
  if (ownerType === "ACQUISITION") return { acquisition_id: ownerId };
  if (ownerType === "SERVICE" || ownerType === "TECHNICAL_ISSUE") return { technical_issue_id: ownerId };
  if (ownerType === "SHIPMENT") return { shipment_id: ownerId };
  throw new Error("Payment owner không hợp lệ.");
}

export function resolvePaymentOwner(payment: any): {
  ownerType: PaymentOwnerType;
  ownerId: string;
} {
  if (payment.order_id) return { ownerType: "ORDER", ownerId: payment.order_id };
  if (payment.acquisition_id) return { ownerType: "ACQUISITION", ownerId: payment.acquisition_id };
  if (payment.technical_issue_id) return { ownerType: "TECHNICAL_ISSUE", ownerId: payment.technical_issue_id };
  if (payment.service_request_id) return { ownerType: "SERVICE", ownerId: payment.service_request_id }; // legacy only
  if (payment.shipment_id) return { ownerType: "SHIPMENT", ownerId: payment.shipment_id };
  throw new Error("Payment chưa có owner.");
}

export function paymentScopeWhere(ownerType: PaymentOwnerType, ownerId: string) {
  const base = ownerWhere(ownerType, ownerId);

  if (ownerType === "ORDER") {
    return {
      ...base,
      type: PaymentType.ORDER,
      purpose: { in: ORDER_PAYMENT_PURPOSES as any },
    };
  }

  if (ownerType === "ACQUISITION") {
    return {
      ...base,
      type: PaymentType.ACQUISITION,
    };
  }

  if (ownerType === "SERVICE" || ownerType === "TECHNICAL_ISSUE") {
    return {
      ...base,
      type: PaymentType.SERVICE,
    };
  }

  return base;
}

export async function getPaymentOwnerSeedTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
) {
  if (ownerType === "ORDER") {
    const order = await tx.order.findUnique({
      where: { id: ownerId },
      select: {
        id: true,
        subtotal: true,
        shippingAmount: true,
        status: true,
        paymentMethod: true,
        depositRequired: true,
      },
    });
    if (!order) throw new Error("Order không tồn tại.");

    const totalDue = toNumber(order.subtotal);
    const depositAmount = Math.min(Math.max(0, toNumber(order.depositRequired)), totalDue);

    return {
      ownerType,
      ownerId: order.id,
      totalDue,
      depositAmount,
      direction: PaymentDirection.IN,
      defaultMethod: normalizePaymentMethod(order.paymentMethod, PaymentMethod.BANK_TRANSFER),
      status: String(order.status ?? ""),
    };
  }

  if (ownerType === "ACQUISITION") {
    const acquisition = await tx.acquisition.findUnique({
      where: { id: ownerId },
      select: { id: true, totalAmount: true, accquisitionStt: true },
    });
    if (!acquisition) throw new Error("Phiếu nhập không tồn tại.");

    return {
      ownerType,
      ownerId: acquisition.id,
      totalDue: toNumber(acquisition.totalAmount),
      depositAmount: 0,
      direction: PaymentDirection.OUT,
      defaultMethod: PaymentMethod.BANK_TRANSFER,
      status: String(acquisition.accquisitionStt ?? ""),
    };
  }

  if (ownerType === "SERVICE" || ownerType === "TECHNICAL_ISSUE") {
    const issue = await tx.technicalIssue.findUnique({
      where: { id: ownerId },
      select: {
        id: true,
        actualCost: true,
        executionStatus: true,
        serviceRequestId: true,
      } as any,
    });
    if (!issue) throw new Error("Technical issue không tồn tại.");

    return {
      ownerType: "TECHNICAL_ISSUE" as PaymentOwnerType,
      ownerId: issue.id,
      totalDue: toNumber(issue.actualCost),
      depositAmount: 0,
      direction: PaymentDirection.OUT,
      defaultMethod: PaymentMethod.BANK_TRANSFER,
      status: String((issue as any).executionStatus ?? ""),
    };
  }

  throw new Error(`Payment owner ${ownerType} chưa được hỗ trợ.`);
}

export async function getPaymentExposureTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
) {
  const seed = await getPaymentOwnerSeedTx(tx, ownerType, ownerId);
  const aggregate = await tx.payment.aggregate({
    where: {
      ...paymentScopeWhere(seed.ownerType, seed.ownerId),
      direction: seed.direction,
      status: { in: activePaymentStatuses() },
    } as any,
    _sum: { amount: true },
  });

  const activeTotal = toNumber(aggregate._sum.amount);
  return {
    ...seed,
    activeTotal,
    availableToCreate: Math.max(0, seed.totalDue - activeTotal),
  };
}

export async function getPaymentSummaryTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
): Promise<PaymentSummary> {
  const seed = await getPaymentOwnerSeedTx(tx, ownerType, ownerId);
  const [paid, collected, unpaid] = await Promise.all([
    tx.payment.aggregate({
      where: {
        ...paymentScopeWhere(seed.ownerType, seed.ownerId),
        direction: seed.direction,
        status: PaymentStatus.PAID,
      } as any,
      _sum: { amount: true },
    }),
    tx.payment.aggregate({
      where: {
        ...paymentScopeWhere(seed.ownerType, seed.ownerId),
        direction: seed.direction,
        status: COLLECTED,
      } as any,
      _sum: { amount: true },
    }),
    tx.payment.aggregate({
      where: {
        ...paymentScopeWhere(seed.ownerType, seed.ownerId),
        direction: seed.direction,
        status: PaymentStatus.UNPAID,
      } as any,
      _sum: { amount: true },
    }),
  ]);

  const paidTotal = toNumber(paid._sum.amount);
  const collectedTotal = toNumber(collected._sum.amount);
  const unpaidTotal = toNumber(unpaid._sum.amount);

  return {
    totalDue: seed.totalDue,
    paidTotal,
    collectedTotal,
    unpaidTotal,
    remaining: Math.max(0, seed.totalDue - paidTotal),
    depositRequired: seed.depositAmount,
    depositPaid: seed.depositAmount > 0 ? Math.min(seed.depositAmount, paidTotal) : 0,
  };
}

export function mapPaymentListItem(row: any): PaymentListItem {
  const resolvedOwner = resolvePaymentOwner(row);
  return {
    id: row.id,
    refNo: row.refNo ?? null,
    ownerType: resolvedOwner.ownerType,
    ownerId: resolvedOwner.ownerId,
    type: row.type,
    direction: row.direction,
    purpose: row.purpose ?? null,
    method: row.method ?? null,
    status: row.status,
    amount: toNumber(row.amount),
    currency: row.currency ?? "VND",
    paidAt: row.paidAt ?? null,
    reference: row.reference ?? null,
    note: row.note ?? null,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export async function listPaymentsTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
): Promise<PaymentListItem[]> {
  const seedOwnerType = ownerType === "SERVICE" ? "TECHNICAL_ISSUE" : ownerType;
  const rows = await tx.payment.findMany({
    where: paymentScopeWhere(seedOwnerType as PaymentOwnerType, ownerId) as any,
    orderBy: [{ createdAt: "asc" }],
  });
  return rows.map(mapPaymentListItem);
}

export async function createPaymentRowTx(
  tx: Tx,
  input: {
    ownerType: PaymentOwnerType;
    ownerId: string;
    amount: number;
    direction: PaymentDirection;
    type: PaymentType | string;
    purpose: PaymentPurpose | string;
    method: PaymentMethod;
    note?: string | null;
    status?: PaymentStatus | string;
  },
) {
  if (input.amount < 0) return null;

  return tx.payment.create({
    data: {
      refNo: await buildPaymentRef(tx),
      ...ownerWhere(input.ownerType, input.ownerId),
      type: input.type as any,
      direction: input.direction,
      purpose: input.purpose as any,
      method: input.method,
      amount: money(input.amount),
      currency: "VND",
      status: (input.status ?? PaymentStatus.UNPAID) as any,
      paidAt: null,
      note: input.note ?? null,
    } as any,
  });
}

async function recomputeOrderPaymentRollupTx(tx: Tx, orderId: string) {
  const summary = await getPaymentSummaryTx(tx, "ORDER", orderId);

  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      hasShipment: true,
      shipments: {
        orderBy: { updatedAt: "desc" },
        select: { status: true },
      },
    },
  });

  if (!order) throw new Error("Order không tồn tại.");
  if (order.status === OrderStatus.CANCELLED) return summary;

  const status = String(order.status ?? "").toUpperCase();
  const lockedStatuses = ["RETURNING", "RETURNED"];
  const fullyPaid = summary.totalDue > 0 && summary.paidTotal >= summary.totalDue;
  const shipmentCompleted =
    !order.hasShipment ||
    (order.shipments ?? []).some(
      (shipment) => String(shipment.status ?? "").toUpperCase() === "DELIVERED",
    );

  const completed = fullyPaid && shipmentCompleted && !lockedStatuses.includes(status);

  await tx.order.update({
    where: { id: orderId },
    data: {
      depositPaid: summary.depositRequired > 0 ? money(summary.depositPaid) : null,
      paymentStatus: fullyPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
      status: completed ? OrderStatus.COMPLETED : order.status,
      updatedAt: new Date(),
    },
  });

  await syncWatchInventoryFromOrderId(tx, orderId);
  return getPaymentSummaryTx(tx, "ORDER", orderId);
}

export async function recomputePaymentOwnerRollupTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
) {
  if (ownerType === "ORDER") return recomputeOrderPaymentRollupTx(tx, ownerId);
  return getPaymentSummaryTx(tx, ownerType, ownerId);
}

export async function createPayment(input: CreatePaymentInput) {
  return prisma.$transaction(async (tx) => {
    const normalizedOwnerType = input.ownerType === "SERVICE" ? "TECHNICAL_ISSUE" : input.ownerType;
    const exposure = await getPaymentExposureTx(tx, normalizedOwnerType, input.ownerId);

    if (exposure.ownerType === "ORDER") {
      if (exposure.status === "DRAFT") throw new Error("Cần post order trước khi tạo payment.");
      if (exposure.status === "CANCELLED") throw new Error("Không thể tạo payment cho order đã hủy.");
    }

    if (exposure.ownerType === "ACQUISITION" && exposure.status !== "POSTED") {
      throw new Error("Chỉ tạo payment cho phiếu nhập đã POSTED.");
    }

    if (exposure.availableToCreate <= 0) {
      throw new Error("Owner đã có đủ payment đang mở. Vui lòng hoàn tất hoặc hủy payment hiện có trước khi tạo thêm.");
    }

    const method = normalizePaymentMethod(input.method, exposure.defaultMethod);
    if (exposure.ownerType === "ORDER" && method === PaymentMethod.COD) {
      throw new Error("COD không tạo payment thủ công.");
    }

    const amount = input.amount == null ? exposure.availableToCreate : Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Số tiền payment không hợp lệ.");
    if (amount > exposure.availableToCreate) {
      throw new Error(
        `Số tiền payment vượt quá số còn được tạo: ${Math.round(exposure.availableToCreate).toLocaleString("vi-VN")} VND.`,
      );
    }

    const serviceOwner = exposure.ownerType === "SERVICE" || exposure.ownerType === "TECHNICAL_ISSUE";
    const payment = await createPaymentRowTx(tx, {
      ownerType: exposure.ownerType,
      ownerId: exposure.ownerId,
      amount,
      direction: exposure.direction,
      type: serviceOwner ? PaymentType.SERVICE : (exposure.ownerType as any),
      purpose:
        (input.purpose as any) ??
        (exposure.ownerType === "ACQUISITION"
          ? "ACQUISITION_FULL"
          : serviceOwner
            ? PaymentPurpose.MAINTENANCE_COST
            : PaymentPurpose.ORDER_REMAIN),
      method,
      note:
        input.note ??
        (exposure.ownerType === "ACQUISITION"
          ? "Payment bổ sung cho phiếu nhập."
          : serviceOwner
            ? "Payment bổ sung cho technical issue."
            : "Payment bổ sung cho đơn hàng."),
      status: PaymentStatus.UNPAID,
    });

    if (!payment) throw new Error("Không thể tạo payment.");

    // Service/TI payment luôn tạo UNPAID. Hoàn tất PAID phải xử lý trong quản lý payment.
    if (input.markPaidNow && !serviceOwner) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PAID, paidAt: new Date(), updatedAt: new Date() },
      });
      await recomputePaymentOwnerRollupTx(tx, exposure.ownerType, exposure.ownerId);
    }

    return toPlain(payment);
  });
}

export async function completePayment(input: {
  paymentId: string;
  paidAt?: Date | string | null;
  reference?: string | null;
  note?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    if (!input.paymentId) throw new Error("Thiếu paymentId.");

    const payment = await tx.payment.findUnique({
      where: { id: input.paymentId },
      select: {
        id: true,
        order_id: true,
        acquisition_id: true,
        service_request_id: true,
        technical_issue_id: true,
        shipment_id: true,
        status: true,
      },
    });

    if (!payment) throw new Error("Payment không tồn tại.");
    if (payment.status === PaymentStatus.PAID) throw new Error("Payment này đã hoàn tất.");
    if (["CANCELED", "CANCELLED"].includes(String(payment.status))) {
      throw new Error("Không thể hoàn tất payment đã hủy.");
    }

    const owner = resolvePaymentOwner(payment);
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
        reference: input.reference ?? undefined,
        note: input.note ?? undefined,
        updatedAt: new Date(),
      },
    });

    const summary = await recomputePaymentOwnerRollupTx(tx, owner.ownerType, owner.ownerId);
    return toPlain({ paymentId: payment.id, ownerType: owner.ownerType, ownerId: owner.ownerId, summary });
  });
}

export async function cancelPayment(input: { paymentId: string; note?: string | null }) {
  return prisma.$transaction(async (tx) => {
    if (!input.paymentId) throw new Error("Thiếu paymentId để hủy payment.");

    const payment = await tx.payment.findUnique({
      where: { id: input.paymentId },
      select: {
        id: true,
        order_id: true,
        acquisition_id: true,
        service_request_id: true,
        technical_issue_id: true,
        shipment_id: true,
        status: true,
      },
    });

    if (!payment) throw new Error("Payment không tồn tại.");
    const status = String(payment.status ?? "").toUpperCase();
    if (status === "PAID") throw new Error("Không thể hủy payment đã hoàn tất. Cần xử lý refund/điều chỉnh riêng.");
    if (status === "CANCELED" || status === "CANCELLED") throw new Error("Payment này đã bị hủy.");

    const owner = resolvePaymentOwner(payment);
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "CANCELED" as any, note: input.note ?? "Payment bị hủy.", updatedAt: new Date() },
    });

    const summary = await recomputePaymentOwnerRollupTx(tx, owner.ownerType, owner.ownerId);
    return toPlain({ paymentId: payment.id, ownerType: owner.ownerType, ownerId: owner.ownerId, summary });
  });
}

export async function listPayments(ownerType: PaymentOwnerType, ownerId: string) {
  return prisma.$transaction(async (tx) => toPlain(await listPaymentsTx(tx, ownerType, ownerId)));
}

export async function getPaymentSummary(ownerType: PaymentOwnerType, ownerId: string) {
  return prisma.$transaction(async (tx) => toPlain(await getPaymentSummaryTx(tx, ownerType, ownerId)));
}
