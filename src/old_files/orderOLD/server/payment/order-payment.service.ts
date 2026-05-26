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
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import { toPlain } from "../shared";
import { syncWatchInventoryFromOrderId } from "../order-watch-sync.service";

type Tx = Prisma.TransactionClient;

type OrderPaymentSummary = {
  totalDue: number;
  paidTotal: number;
  remaining: number;
  depositRequired: number;
  depositPaid: number;
};

function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function money(value: number) {
  return new Prisma.Decimal(Math.max(0, Math.round(value)));
}

async function buildPaymentRef(tx: Tx) {
  return genRefNo(tx, {
    model: tx.payment,
    prefix: "PM",
    field: "refNo",
    padding: 6,
  });
}

async function getOrderPaymentSummaryTx(tx: Tx, orderId: string): Promise<OrderPaymentSummary> {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      subtotal: true,
      shippingAmount: true,
      depositRequired: true,
      depositPaid: true,
    },
  });

  if (!order) throw new Error("Order không tồn tại.");

  const paid = await tx.payment.aggregate({
    where: {
      order_id: orderId,
      status: PaymentStatus.PAID,
      direction: PaymentDirection.IN,
    },
    _sum: { amount: true },
  });

  const totalDue = toNumber(order.subtotal) + toNumber(order.shippingAmount);
  const paidTotal = toNumber(paid._sum.amount);
  const depositRequired = toNumber(order.depositRequired);
  const depositPaid = toNumber(order.depositPaid);

  return {
    totalDue,
    paidTotal,
    remaining: Math.max(0, totalDue - paidTotal),
    depositRequired,
    depositPaid,
  };
}

async function updateOrderPaymentRollupTx(tx: Tx, orderId: string) {
  const summary = await getOrderPaymentSummaryTx(tx, orderId);

  const depositPaid = summary.depositRequired > 0
    ? Math.min(summary.paidTotal, summary.depositRequired)
    : 0;

  const fullyPaid = summary.totalDue > 0 && summary.paidTotal >= summary.totalDue;

  await tx.order.update({
    where: { id: orderId },
    data: {
      depositPaid: summary.depositRequired > 0 ? money(depositPaid) : null,
      paymentStatus: fullyPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
      status: fullyPaid ? OrderStatus.PAID : undefined,
      updatedAt: new Date(),
    },
  });

  if (fullyPaid) {
    await syncWatchInventoryFromOrderId(tx, orderId);
  }

  return getOrderPaymentSummaryTx(tx, orderId);
}

export async function createInitialPaymentForOrderTx(tx: Tx, orderId: string) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      paymentMethod: true,
      subtotal: true,
      shippingAmount: true,
      depositRequired: true,
    },
  });

  if (!order) throw new Error("Order không tồn tại.");

  const existing = await tx.payment.findFirst({
    where: {
      order_id: order.id,
      type: PaymentType.ORDER,
      purpose: { in: [PaymentPurpose.ORDER_DEPOSIT, PaymentPurpose.ORDER_FULL] },
    },
    select: { id: true },
  });

  if (existing) return existing;

  const totalDue = toNumber(order.subtotal) + toNumber(order.shippingAmount);
  const depositRequired = toNumber(order.depositRequired);
  const isDeposit = depositRequired > 0 && depositRequired < totalDue;
  const amount = isDeposit ? depositRequired : totalDue;

  if (amount <= 0) return null;

  return tx.payment.create({
    data: {
      refNo: await buildPaymentRef(tx),
      order_id: order.id,
      type: PaymentType.ORDER,
      direction: PaymentDirection.IN,
      purpose: isDeposit ? PaymentPurpose.ORDER_DEPOSIT : PaymentPurpose.ORDER_FULL,
      method: order.paymentMethod ?? PaymentMethod.BANK_TRANSFER,
      amount: money(amount),
      currency: "VND",
      status: PaymentStatus.UNPAID,
      paidAt: null,
      note: isDeposit ? "Thanh toán cọc đơn hàng" : "Thanh toán toàn bộ đơn hàng",
    },
    select: { id: true },
  });
}

export async function createNextOrderPayment(input: {
  orderId: string;
  amount?: number | null;
  method?: PaymentMethod | string | null;
  note?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        status: true,
        paymentMethod: true,
      },
    });

    if (!order) throw new Error("Order không tồn tại.");
    if (order.status === OrderStatus.DRAFT) {
      throw new Error("Cần xác nhận đơn trước khi tạo payment.");
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new Error("Không thể tạo payment cho order đã hủy.");
    }

    const summary = await getOrderPaymentSummaryTx(tx, order.id);
    if (summary.remaining <= 0) {
      throw new Error("Order đã thanh toán đủ.");
    }

    const amount = input.amount == null ? summary.remaining : Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Số tiền payment không hợp lệ.");
    }
    if (amount > summary.remaining) {
      throw new Error("Số tiền payment vượt quá số còn lại cần thanh toán.");
    }

    const payment = await tx.payment.create({
      data: {
        refNo: await buildPaymentRef(tx),
        order_id: order.id,
        type: PaymentType.ORDER,
        direction: PaymentDirection.IN,
        purpose: PaymentPurpose.ORDER_REMAIN,
        method: (input.method as PaymentMethod | null) ?? order.paymentMethod ?? PaymentMethod.BANK_TRANSFER,
        amount: money(amount),
        currency: "VND",
        status: PaymentStatus.UNPAID,
        paidAt: null,
        note: input.note ?? "Thanh toán phần còn lại của đơn hàng",
      },
    });

    return toPlain(payment);
  });
}

export async function markOrderPaymentPaid(input: {
  paymentId: string;
  paidAt?: Date | string | null;
  reference?: string | null;
  note?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: input.paymentId },
      select: {
        id: true,
        order_id: true,
        status: true,
      },
    });

    if (!payment) throw new Error("Payment không tồn tại.");
    if (!payment.order_id) throw new Error("Payment không thuộc order.");

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

    const summary = await updateOrderPaymentRollupTx(tx, payment.order_id);

    return toPlain({ paymentId: payment.id, orderId: payment.order_id, summary });
  });
}

export async function getOrderPaymentSummary(orderId: string) {
  return prisma.$transaction(async (tx) => toPlain(await getOrderPaymentSummaryTx(tx, orderId)));
}
