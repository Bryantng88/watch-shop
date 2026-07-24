import {
  PaymentDirection,
  PaymentMethod,
  PaymentPurpose,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { buildPaymentOwnerSummary, getPaymentOwnerSummaryProjection } from "@/domains/projection/server/payment-owner-summary.projection";
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
  if (payment.shipment_id) return { ownerType: "SHIPMENT", ownerId: payment.shipment_id };
  if (payment.order_id) return { ownerType: "ORDER", ownerId: payment.order_id };
  if (payment.acquisition_id) return { ownerType: "ACQUISITION", ownerId: payment.acquisition_id };
  if (payment.technical_issue_id) return { ownerType: "TECHNICAL_ISSUE", ownerId: payment.technical_issue_id };
  if (payment.service_request_id) return { ownerType: "SERVICE", ownerId: payment.service_request_id }; // legacy only
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
    vendorId?: string | null;
  },
) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) return null;

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
      vendor_id: input.vendorId ?? null,
    } as any,
  });
}

export async function recomputePaymentOwnerRollupTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
) {
  return buildPaymentOwnerSummary(tx, ownerType, ownerId);
}

async function syncPaymentOwnerBusinessStateTx(
  tx: Tx,
  ownerType: PaymentOwnerType,
  ownerId: string,
  summary: PaymentSummary,
) {
  if (ownerType !== "ORDER") return;

  await tx.order.update({
    where: { id: ownerId },
    data: {
      depositPaid: money(summary.paidTotal + summary.collectedTotal),
      paymentStatus:
        summary.totalDue > 0 && summary.remaining <= 0
          ? PaymentStatus.PAID
          : PaymentStatus.UNPAID,
      updatedAt: new Date(),
    },
  });
}

export async function createPayment(input: CreatePaymentInput) {
  const payment = await prisma.$transaction(async (tx) => {
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

    return toPlain({
      ...payment,
      ...resolvePaymentOwner(payment),
    });
  });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.created",
    targetType: "PAYMENT",
    targetId: payment.id,
    payload: {
      ownerType: payment.ownerType ?? input.ownerType,
      ownerId: payment.ownerId ?? input.ownerId,
      status: payment.status ?? PaymentStatus.UNPAID,
      amount: payment.amount ?? null,
      direction: payment.direction ?? null,
      type: payment.type ?? null,
      purpose: payment.purpose ?? null,
      currency: payment.currency ?? "VND",
      sourceId: `${payment.id}:payment.created`,
    },
  });

  return payment;
}

function splitRemainderPurpose(purpose: PaymentPurpose) {
  if (purpose === PaymentPurpose.ORDER_FULL) return PaymentPurpose.ORDER_REMAIN;
  if (purpose === PaymentPurpose.ACQUISITION_FULL) return PaymentPurpose.ACQUISITION_REMAIN;
  return purpose;
}

function splitPaidPurpose(purpose: PaymentPurpose) {
  if (purpose === PaymentPurpose.ORDER_FULL) return PaymentPurpose.ORDER_DEPOSIT;
  if (purpose === PaymentPurpose.ACQUISITION_FULL) return PaymentPurpose.ACQUISITION_DEPOSIT;
  return purpose;
}

export async function splitPayment(input: {
  paymentId: string;
  paidAmount: number;
  paidAt?: Date | string | null;
  method?: string | null;
  reference?: string | null;
  note?: string | null;
  deferConsumers?: (work: () => Promise<void>) => void;
}) {
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: input.paymentId } });
    if (!payment) throw new Error("Payment không tồn tại.");
    if (payment.status !== PaymentStatus.UNPAID) {
      throw new Error("Chỉ có thể split Payment chưa thanh toán.");
    }

    const originalAmount = Number(payment.amount);
    const paidAmount = Number(input.paidAmount);
    if (!Number.isFinite(paidAmount) || paidAmount <= 0 || paidAmount >= originalAmount) {
      throw new Error("Số tiền split phải lớn hơn 0 và nhỏ hơn số tiền Payment dự kiến.");
    }

    const owner = resolvePaymentOwner(payment);
    const remainderAmount = originalAmount - paidAmount;
    const paidPurpose = splitPaidPurpose(payment.purpose);
    const remainderPurpose = splitRemainderPurpose(payment.purpose);

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        amount: money(paidAmount),
        purpose: paidPurpose,
        status: PaymentStatus.PAID,
        method: input.method ? (input.method as PaymentMethod) : payment.method,
        paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
        reference: input.reference ?? payment.reference,
        note: input.note ?? payment.note,
        updatedAt: new Date(),
      },
    });

    const remainder = await createPaymentRowTx(tx, {
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      amount: remainderAmount,
      direction: payment.direction ?? PaymentDirection.IN,
      type: payment.type,
      purpose: remainderPurpose,
      method: payment.method,
      status: PaymentStatus.UNPAID,
      vendorId: payment.vendor_id,
      note: `Phần còn lại sau khi split từ ${payment.refNo ?? payment.id}.`,
    });
    if (!remainder) throw new Error("Không thể tạo Payment phần còn lại.");

    const summary = await recomputePaymentOwnerRollupTx(
      tx,
      owner.ownerType,
      owner.ownerId,
    );
    await syncPaymentOwnerBusinessStateTx(
      tx,
      owner.ownerType,
      owner.ownerId,
      summary,
    );

    return toPlain({
      paymentId: payment.id,
      remainderPaymentId: remainder.id,
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      paidAmount,
      remainderAmount,
      direction: payment.direction,
      currency: payment.currency,
      method: input.method ?? payment.method,
      occurredAt: input.paidAt ? new Date(input.paidAt) : new Date(),
      purpose: paidPurpose,
      remainderPurpose,
      summary,
    });
  });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.created",
    targetType: "PAYMENT",
    targetId: result.remainderPaymentId,
    payload: {
      ownerType: result.ownerType,
      ownerId: result.ownerId,
      status: PaymentStatus.UNPAID,
      amount: result.remainderAmount,
      direction: result.direction,
      purpose: result.remainderPurpose,
      currency: result.currency,
      splitFromPaymentId: result.paymentId,
      sourceId: `${result.remainderPaymentId}:payment.created:split`,
    },
  }, { deferConsumers: input.deferConsumers });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.status_updated",
    targetType: "PAYMENT",
    targetId: result.paymentId,
    payload: {
      ownerType: result.ownerType,
      ownerId: result.ownerId,
      status: PaymentStatus.PAID,
      direction: result.direction,
      amount: result.paidAmount,
      currency: result.currency,
      method: result.method,
      occurredAt: result.occurredAt,
      summary: result.summary,
      splitRemainderPaymentId: result.remainderPaymentId,
      sourceId: `${result.paymentId}:payment.status_updated:PAID:SPLIT`,
    },
  }, { deferConsumers: input.deferConsumers });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.paid",
    targetType: "PAYMENT",
    targetId: result.paymentId,
    payload: {
      ownerType: result.ownerType,
      ownerId: result.ownerId,
      status: PaymentStatus.PAID,
      direction: result.direction,
      amount: result.paidAmount,
      currency: result.currency,
      method: result.method,
      occurredAt: result.occurredAt,
      summary: result.summary,
      splitRemainderPaymentId: result.remainderPaymentId,
      sourceId: `${result.paymentId}:payment.paid:SPLIT`,
    },
  }, { deferConsumers: input.deferConsumers });

  return result;
}

export async function completePayment(input: {
  paymentId: string;
  paidAt?: Date | string | null;
  method?: string | null;
  reference?: string | null;
  note?: string | null;
  deferConsumers?: (work: () => Promise<void>) => void;
}) {
  const result = await prisma.$transaction(async (tx) => {
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
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        method: input.method ? (input.method as PaymentMethod) : undefined,
        paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
        reference: input.reference ?? undefined,
        note: input.note ?? undefined,
        updatedAt: new Date(),
      },
    });

    const summary = await recomputePaymentOwnerRollupTx(tx, owner.ownerType, owner.ownerId);
    await syncPaymentOwnerBusinessStateTx(
      tx,
      owner.ownerType,
      owner.ownerId,
      summary,
    );
    return toPlain({
      paymentId: payment.id,
      ownerType: owner.ownerType,
      ownerId: owner.ownerId,
      direction: updatedPayment.direction,
      amount: updatedPayment.amount,
      currency: updatedPayment.currency,
      method: updatedPayment.method,
      occurredAt: updatedPayment.paidAt,
      summary,
    });
  });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.status_updated",
    targetType: "PAYMENT",
    targetId: result.paymentId,
    payload: {
      ownerType: result.ownerType,
      ownerId: result.ownerId,
      status: PaymentStatus.PAID,
      direction: result.direction,
      amount: result.amount,
      currency: result.currency,
      method: result.method,
      occurredAt: result.occurredAt,
      summary: result.summary,
      sourceId: `${result.paymentId}:payment.status_updated:PAID`,
    },
  }, { deferConsumers: input.deferConsumers });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.paid",
    targetType: "PAYMENT",
    targetId: result.paymentId,
    payload: {
      ownerType: result.ownerType,
      ownerId: result.ownerId,
      status: PaymentStatus.PAID,
      direction: result.direction,
      amount: result.amount,
      currency: result.currency,
      method: result.method,
      occurredAt: result.occurredAt,
      summary: result.summary,
      sourceId: `${result.paymentId}:payment.paid`,
    },
  }, { deferConsumers: input.deferConsumers });

  return result;
}

export async function cancelPayment(input: { paymentId: string; note?: string | null }) {
  const result = await prisma.$transaction(async (tx) => {
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
    await syncPaymentOwnerBusinessStateTx(
      tx,
      owner.ownerType,
      owner.ownerId,
      summary,
    );
    return toPlain({ paymentId: payment.id, ownerType: owner.ownerType, ownerId: owner.ownerId, summary });
  });

  await recordBusinessEvent(prisma, {
    eventKey: "payment.status_updated",
    targetType: "PAYMENT",
    targetId: result.paymentId,
    payload: {
      ownerType: result.ownerType,
      ownerId: result.ownerId,
      status: "CANCELED",
      summary: result.summary,
      sourceId: `${result.paymentId}:payment.status_updated:CANCELED`,
    },
  });

  return result;
}

export async function listPayments(ownerType: PaymentOwnerType, ownerId: string) {
  return prisma.$transaction(async (tx) => toPlain(await listPaymentsTx(tx, ownerType, ownerId)));
}

export async function getPaymentSummary(ownerType: PaymentOwnerType, ownerId: string) {
  return toPlain(await getPaymentOwnerSummaryProjection(prisma, ownerType, ownerId));
}
