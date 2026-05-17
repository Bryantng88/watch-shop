import {
  OrderStatus,
  PaymentDirection,
  PaymentMethod,
  PaymentPurpose,
  PaymentStatus,
  PaymentType,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/server/db/client";
import { syncWatchInventoryFromOrderId } from "@/domains/order/server/order-watch-sync.service";
import type { CreatePaymentInput, PaymentListItem, PaymentSummary } from "../shared";
import { assertPaymentStatusCollectedExists, buildPaymentRef, money, toNumber, toPlain, type Tx } from "./payment.utils";

const COLLECTED = assertPaymentStatusCollectedExists();

type OrderPaymentSeed = {
  orderId: string;
  totalDue: number;
  depositAmount: number;
  depositMethod: PaymentMethod;
  remainingMethod: PaymentMethod;
};

function normalizePaymentMethod(value: unknown, fallback: PaymentMethod = PaymentMethod.BANK_TRANSFER): PaymentMethod {
  const raw = String(value ?? "").trim().toUpperCase();
  if (raw === "CASH") return PaymentMethod.CASH;
  if (raw === "COD") return PaymentMethod.COD;
  if (raw === "BANK_TRANSFER") return PaymentMethod.BANK_TRANSFER;
  return fallback;
}

function normalizePaidStatuses() {
  return [PaymentStatus.PAID];
}

function normalizeCollectedStatuses() {
  return [COLLECTED];
}

async function getOrderPaymentSeedTx(tx: Tx, orderId: string): Promise<OrderPaymentSeed> {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      subtotal: true,
      shippingFee: true,
      paymentMethod: true,
      depositRequired: true,
    },
  });

  if (!order) throw new Error("Order không tồn tại.");

  const totalDue = toNumber((order as any).subtotal) + toNumber((order as any).shippingFee);
  const depositAmount = Math.min(Math.max(0, toNumber((order as any).depositRequired)), totalDue);

  return {
    orderId: order.id,
    totalDue,
    depositAmount,
    // Deposit method is intentionally conservative for now.
    // COD is reserved for the remaining shipment collection flow, not for deposit.
    depositMethod: PaymentMethod.BANK_TRANSFER,
    remainingMethod: normalizePaymentMethod((order as any).paymentMethod, PaymentMethod.BANK_TRANSFER),
  };
}

export async function getOrderPaymentSummaryTx(tx: Tx, orderId: string): Promise<PaymentSummary> {
  const seed = await getOrderPaymentSeedTx(tx, orderId);

  const [paid, collected, unpaid] = await Promise.all([
    tx.payment.aggregate({
      where: {
        order_id: orderId,
        status: { in: normalizePaidStatuses() as any },
        direction: PaymentDirection.IN,
      },
      _sum: { amount: true },
    }),
    tx.payment.aggregate({
      where: {
        order_id: orderId,
        status: { in: normalizeCollectedStatuses() as any },
        direction: PaymentDirection.IN,
      },
      _sum: { amount: true },
    }),
    tx.payment.aggregate({
      where: {
        order_id: orderId,
        status: PaymentStatus.UNPAID,
        direction: PaymentDirection.IN,
      },
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

export async function listOrderPaymentsTx(tx: Tx, orderId: string): Promise<PaymentListItem[]> {
  const rows = await tx.payment.findMany({
    where: {
      order_id: orderId,
      type: PaymentType.ORDER,
      direction: PaymentDirection.IN,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  return rows.map((row: any) => ({
    id: row.id,
    refNo: row.refNo ?? null,
    ownerType: "ORDER",
    ownerId: row.order_id,
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
  }));
}

export async function recomputeOrderPaymentRollupTx(tx: Tx, orderId: string) {
  const summary = await getOrderPaymentSummaryTx(tx, orderId);

  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      hasShipment: true,
      shipment: { select: { status: true } },
    },
  });

  if (!order) throw new Error("Order không tồn tại.");
  if (order.status === OrderStatus.CANCELLED) return summary;

  const fullyPaid = summary.totalDue > 0 && summary.paidTotal >= summary.totalDue;
  const shipmentCompleted = !order.hasShipment || String(order.shipment?.status ?? "").toUpperCase() === "DELIVERED";
  const completed = fullyPaid && shipmentCompleted;

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
  return getOrderPaymentSummaryTx(tx, orderId);
}

async function createOrderPaymentTx(tx: Tx, input: {
  orderId: string;
  amount: number;
  purpose: PaymentPurpose;
  method: PaymentMethod;
  note?: string | null;
  status?: PaymentStatus | string;
}) {
  if (input.amount <= 0) return null;

  return tx.payment.create({
    data: {
      refNo: await buildPaymentRef(tx),
      order_id: input.orderId,
      type: PaymentType.ORDER,
      direction: PaymentDirection.IN,
      purpose: input.purpose,
      method: input.method,
      amount: money(input.amount),
      currency: "VND",
      status: (input.status ?? PaymentStatus.UNPAID) as any,
      paidAt: null,
      note: input.note ?? null,
    },
  });
}

export async function createInitialPaymentsForOrderTx(tx: Tx, orderId: string) {
  const seed = await getOrderPaymentSeedTx(tx, orderId);
  if (seed.totalDue <= 0) return [];

  const existing = await tx.payment.findFirst({
    where: {
      order_id: orderId,
      type: PaymentType.ORDER,
      purpose: { in: [PaymentPurpose.ORDER_DEPOSIT, PaymentPurpose.ORDER_FULL, PaymentPurpose.ORDER_REMAIN] },
    },
    select: { id: true },
  });

  if (existing) return [existing];

  const rows = [];
  const hasDeposit = seed.depositAmount > 0 && seed.depositAmount < seed.totalDue;

  if (!hasDeposit) {
    const full = await createOrderPaymentTx(tx, {
      orderId,
      amount: seed.totalDue,
      purpose: PaymentPurpose.ORDER_FULL,
      method: seed.remainingMethod,
      note: "Payment toàn bộ đơn hàng",
    });
    if (full) rows.push(full);
    return rows;
  }

  const deposit = await createOrderPaymentTx(tx, {
    orderId,
    amount: seed.depositAmount,
    purpose: PaymentPurpose.ORDER_DEPOSIT,
    method: seed.depositMethod,
    note: "Payment cọc đơn hàng",
  });
  if (deposit) rows.push(deposit);

  const remaining = await createOrderPaymentTx(tx, {
    orderId,
    amount: seed.totalDue - seed.depositAmount,
    purpose: PaymentPurpose.ORDER_REMAIN,
    method: seed.remainingMethod,
    note: seed.remainingMethod === PaymentMethod.COD ? "COD phần còn lại - chờ giao hàng" : "Payment phần còn lại của đơn hàng",
  });
  if (remaining) rows.push(remaining);

  return rows;
}

export async function createPayment(input: CreatePaymentInput) {
  if (input.ownerType !== "ORDER") {
    throw new Error("Payment owner hiện chỉ hỗ trợ ORDER. Acquisition/Shipment sẽ dùng cùng domain này khi schema có owner generic.");
  }

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.ownerId },
      select: { id: true, status: true, paymentMethod: true },
    });

    if (!order) throw new Error("Order không tồn tại.");
    if (order.status === OrderStatus.DRAFT) throw new Error("Cần post order trước khi tạo payment.");
    if (order.status === OrderStatus.CANCELLED) throw new Error("Không thể tạo payment cho order đã hủy.");

    const summary = await getOrderPaymentSummaryTx(tx, order.id);
    if (summary.remaining <= 0) throw new Error("Order đã thanh toán đủ.");

    const amount = input.amount == null ? summary.remaining : Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Số tiền payment không hợp lệ.");
    if (amount > summary.remaining) throw new Error("Số tiền payment vượt quá số còn lại cần thu.");

    const method = normalizePaymentMethod(input.method, order.paymentMethod ?? PaymentMethod.BANK_TRANSFER);
    const purpose = (input.purpose as PaymentPurpose | null) ?? PaymentPurpose.ORDER_REMAIN;

    const payment = await createOrderPaymentTx(tx, {
      orderId: order.id,
      amount,
      purpose,
      method,
      note: input.note ?? "Payment bổ sung cho đơn hàng",
    });

    if (!payment) throw new Error("Không thể tạo payment.");

    if (input.markPaidNow) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PAID, paidAt: new Date(), updatedAt: new Date() },
      });
      await recomputeOrderPaymentRollupTx(tx, order.id);
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
    const payment = await tx.payment.findUnique({
      where: { id: input.paymentId },
      select: { id: true, order_id: true, status: true, method: true },
    });

    if (!payment) throw new Error("Payment không tồn tại.");
    if (!payment.order_id) throw new Error("Payment chưa có owner order.");
    if (payment.status === PaymentStatus.PAID) throw new Error("Payment này đã hoàn tất.");
    if (["CANCELED", "CANCELLED"].includes(String(payment.status))) throw new Error("Không thể hoàn tất payment đã hủy.");

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

    const summary = await recomputeOrderPaymentRollupTx(tx, payment.order_id);
    return toPlain({ paymentId: payment.id, orderId: payment.order_id, summary });
  });
}

export async function markOrderShipmentDeliveredAndCollectCod(input: { orderId: string; note?: string | null }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: { id: true, status: true, hasShipment: true },
    });

    if (!order) throw new Error("Order không tồn tại.");
    if (order.status === OrderStatus.DRAFT) throw new Error("Cần post order trước khi giao hàng.");
    if (order.status === OrderStatus.CANCELLED) throw new Error("Không thể giao order đã hủy.");
    if (!order.hasShipment) throw new Error("Order này không có shipment.");

    await (tx as any).shipment.updateMany({
      where: { orderId: order.id },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.payment.updateMany({
      where: {
        order_id: order.id,
        type: PaymentType.ORDER,
        direction: PaymentDirection.IN,
        method: PaymentMethod.COD,
        status: PaymentStatus.UNPAID,
      },
      data: {
        status: COLLECTED,
        note: input.note ?? "COD đã giao thành công, chờ đối soát/nhận tiền từ đơn vị vận chuyển.",
        updatedAt: new Date(),
      } as any,
    });

    const summary = await recomputeOrderPaymentRollupTx(tx, order.id);
    return toPlain({ orderId: order.id, summary });
  });
}

export async function listOrderPayments(orderId: string) {
  return prisma.$transaction(async (tx) => toPlain(await listOrderPaymentsTx(tx, orderId)));
}

export async function getOrderPaymentSummary(orderId: string) {
  return prisma.$transaction(async (tx) => toPlain(await getOrderPaymentSummaryTx(tx, orderId)));
}
