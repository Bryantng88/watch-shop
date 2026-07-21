import { PaymentDirection, PaymentMethod, PaymentPurpose, PaymentStatus, PaymentType } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { getPaymentOwnerSummaryProjection } from "@/domains/projection/server/payment-owner-summary.projection";
import { normalizePaymentMethod, resolvePaymentOwner } from "./payment.core";
import { buildPaymentRef, money, toNumber, type Tx } from "./payment.utils";

export type PaymentMutation = { paymentId: string; eventKey: "payment.created" | "payment.status_updated" | "payment.paid" };

export async function publishPaymentMutations(mutations: PaymentMutation[]) {
  for (const mutation of mutations) {
    const payment = await prisma.payment.findUnique({ where: { id: mutation.paymentId } });
    if (!payment) continue;
    const owner = resolvePaymentOwner(payment);
    const summary = await getPaymentOwnerSummaryProjection(prisma, owner.ownerType, owner.ownerId);
    await recordBusinessEvent(prisma, {
      eventKey: mutation.eventKey,
      targetType: "PAYMENT",
      targetId: payment.id,
      payload: {
        ...owner,
        status: payment.status,
        direction: payment.direction,
        type: payment.type,
        purpose: payment.purpose,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        occurredAt: payment.paidAt ?? payment.updatedAt,
        summary,
        sourceId: `${payment.id}:${mutation.eventKey}:${payment.updatedAt.getTime()}`,
      },
    });
  }
}

export async function syncAcquisitionPaymentDueTx(
  tx: Tx,
  input: { acquisitionId: string; totalAmount: number; currency?: string | null },
): Promise<PaymentMutation[]> {
  const payments = await tx.payment.findMany({
    where: { acquisition_id: input.acquisitionId, direction: PaymentDirection.OUT, status: { in: [PaymentStatus.PAID, PaymentStatus.UNPAID, PaymentStatus.COLLECTED] } },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  const paidTotal = payments.filter((row) => row.status === PaymentStatus.PAID || row.status === PaymentStatus.COLLECTED).reduce((sum, row) => sum + toNumber(row.amount), 0);
  const total = Math.max(0, Number(input.totalAmount) || 0);
  if (paidTotal > total) throw new Error("Tổng đã thanh toán lớn hơn giá trị phiếu mới. Hãy xử lý hoàn tiền trước khi giảm giá trị phiếu.");
  const target = Math.max(0, total - paidTotal);
  const [primary, ...extras] = payments.filter((row) => row.status === PaymentStatus.UNPAID);
  const mutations: PaymentMutation[] = [];
  if (primary) {
    await tx.payment.update({ where: { id: primary.id }, data: { amount: money(target), currency: input.currency ?? primary.currency ?? "VND", status: target > 0 ? PaymentStatus.UNPAID : PaymentStatus.CANCELED, updatedAt: new Date() } });
    mutations.push({ paymentId: primary.id, eventKey: "payment.status_updated" });
  } else if (target > 0) {
    const created = await tx.payment.create({ data: { refNo: await buildPaymentRef(tx), acquisition_id: input.acquisitionId, direction: PaymentDirection.OUT, type: PaymentType.ACQUISITION, purpose: PaymentPurpose.ACQUISITION_FULL, method: PaymentMethod.BANK_TRANSFER, amount: money(target), currency: input.currency ?? "VND", status: PaymentStatus.UNPAID } });
    mutations.push({ paymentId: created.id, eventKey: "payment.created" });
  }
  for (const extra of extras) {
    await tx.payment.update({ where: { id: extra.id }, data: { status: PaymentStatus.CANCELED, note: "Khoản chờ chi dư được Payment tự hủy khi đồng bộ phiếu nhập.", updatedAt: new Date() } });
    mutations.push({ paymentId: extra.id, eventKey: "payment.status_updated" });
  }
  return mutations;
}

export async function replaceShipmentExpenseTx(tx: Tx, input: { shipmentId: string; orderId: string; amount: number; currency?: string | null; purpose: PaymentPurpose; method?: unknown; paidAt?: Date | string | null; reference?: string | null; note?: string | null }) {
  const existing = await tx.payment.findMany({ where: { shipment_id: input.shipmentId, type: PaymentType.SHIPMENT, purpose: input.purpose, status: { not: PaymentStatus.CANCELED } }, select: { id: true } });
  const mutations: PaymentMutation[] = [];
  for (const row of existing) {
    await tx.payment.update({ where: { id: row.id }, data: { status: PaymentStatus.CANCELED, note: "Khoản chi vận chuyển được thay thế trong Payment Workspace.", updatedAt: new Date() } });
    mutations.push({ paymentId: row.id, eventKey: "payment.status_updated" });
  }
  if (input.amount > 0) {
    const created = await tx.payment.create({ data: { refNo: await buildPaymentRef(tx), shipment_id: input.shipmentId, order_id: input.orderId, type: PaymentType.SHIPMENT, direction: PaymentDirection.OUT, purpose: input.purpose, method: normalizePaymentMethod(input.method), amount: money(input.amount), currency: input.currency ?? "VND", status: PaymentStatus.PAID, paidAt: input.paidAt ? new Date(input.paidAt) : new Date(), reference: input.reference ?? null, note: input.note ?? null } });
    mutations.push({ paymentId: created.id, eventKey: "payment.paid" });
    return { payment: created, mutations };
  }
  return { payment: null, mutations };
}

export async function setOrderCodCollectedTx(tx: Tx, input: { orderId: string; amountIfMissing: number; currency?: string | null; note?: string | null; collected: boolean }) {
  const rows = await tx.payment.findMany({ where: { order_id: input.orderId, type: PaymentType.ORDER, direction: PaymentDirection.IN, method: PaymentMethod.COD, status: input.collected ? PaymentStatus.UNPAID : PaymentStatus.COLLECTED }, select: { id: true } });
  const mutations: PaymentMutation[] = [];
  for (const row of rows) {
    await tx.payment.update({ where: { id: row.id }, data: { status: input.collected ? PaymentStatus.COLLECTED : PaymentStatus.UNPAID, note: input.note ?? null, updatedAt: new Date() } });
    mutations.push({ paymentId: row.id, eventKey: "payment.status_updated" });
  }
  if (input.collected && rows.length === 0 && input.amountIfMissing > 0) {
    const created = await tx.payment.create({ data: { refNo: await buildPaymentRef(tx), order_id: input.orderId, type: PaymentType.ORDER, direction: PaymentDirection.IN, purpose: PaymentPurpose.ORDER_REMAIN, method: PaymentMethod.COD, amount: money(input.amountIfMissing), currency: input.currency ?? "VND", status: PaymentStatus.COLLECTED, note: input.note ?? null } });
    mutations.push({ paymentId: created.id, eventKey: "payment.created" });
  }
  return mutations;
}

export async function cancelPendingOwnerPaymentsTx(tx: Tx, input: { ownerType: "ORDER" | "ACQUISITION" | "SHIPMENT" | "SERVICE" | "TECHNICAL_ISSUE"; ownerId: string; note?: string | null }) {
  const field = input.ownerType === "ORDER" ? "order_id" : input.ownerType === "ACQUISITION" ? "acquisition_id" : input.ownerType === "SHIPMENT" ? "shipment_id" : input.ownerType === "SERVICE" ? "service_request_id" : "technical_issue_id";
  const rows = await tx.payment.findMany({ where: { [field]: input.ownerId, status: { notIn: [PaymentStatus.PAID, PaymentStatus.CANCELED] } }, select: { id: true } });
  for (const row of rows) await tx.payment.update({ where: { id: row.id }, data: { status: PaymentStatus.CANCELED, note: input.note ?? null, updatedAt: new Date() } });
  return rows.map((row) => ({ paymentId: row.id, eventKey: "payment.status_updated" as const }));
}
