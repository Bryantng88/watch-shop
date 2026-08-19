import {
  PaymentDirection,
  PaymentMethod,
  PaymentPurpose,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";

import { processBusinessEventOperation } from "@/domains/event/delivery";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { prisma } from "@/server/db/client";
import { buildPaymentRef, money, toPlain } from "./payment.utils";
import { normalizePaymentMethod } from "./payment.core";

export type StandaloneExpenseKind = "SALARY" | "OPERATING_EXPENSE";

export type CreateStandaloneExpensePaymentInput = {
  kind: StandaloneExpenseKind;
  amount: number;
  method?: PaymentMethod | string | null;
  payeeUserId?: string | null;
  payeeName?: string | null;
  expenseCategoryId?: string | null;
  reference?: string | null;
  note?: string | null;
  markPaidNow?: boolean | null;
  actorUserId?: string | null;
  financeChannel?: "MEN" | "WOMEN" | "UNISEX" | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function getStandaloneExpensePaymentOptions() {
  const [users, categories] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, avatarUrl: true },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
    prisma.expenseCategory.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true, description: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);
  return { users, categories };
}

export async function createStandaloneExpensePayment(input: CreateStandaloneExpensePaymentInput) {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Số tiền chi không hợp lệ.");
  const kind = clean(input.kind).toUpperCase() as StandaloneExpenseKind;
  if (kind !== "SALARY" && kind !== "OPERATING_EXPENSE") {
    throw new Error("Loại khoản chi không hợp lệ.");
  }
  const financeChannel = clean(input.financeChannel).toUpperCase();
  if (!["MEN", "WOMEN", "UNISEX"].includes(financeChannel)) {
    throw new Error("Vui lòng chọn kênh tài chính Nam, Nữ hoặc Dùng chung.");
  }

  const result = await prisma.$transaction(async (tx) => {
    let payeeUser: { id: string; name: string | null; email: string } | null = null;
    let category: { id: string; code: string; name: string } | null = null;
    if (kind === "SALARY") {
      const payeeUserId = clean(input.payeeUserId);
      if (!payeeUserId) throw new Error("Vui lòng chọn nhân sự nhận lương.");
      payeeUser = await tx.user.findFirst({
        where: { id: payeeUserId, isActive: true },
        select: { id: true, name: true, email: true },
      });
      if (!payeeUser) throw new Error("Nhân sự nhận lương không tồn tại hoặc đã ngừng hoạt động.");
    } else {
      const expenseCategoryId = clean(input.expenseCategoryId);
      if (!expenseCategoryId) throw new Error("Vui lòng chọn loại chi phí.");
      category = await tx.expenseCategory.findFirst({
        where: { id: expenseCategoryId, isActive: true },
        select: { id: true, code: true, name: true },
      });
      if (!category) throw new Error("Loại chi phí không tồn tại hoặc đã ngừng sử dụng.");
    }

    const markPaidNow = Boolean(input.markPaidNow);
    const payment = await tx.payment.create({
      data: {
        refNo: await buildPaymentRef(tx),
        type: PaymentType.OTHER,
        direction: PaymentDirection.OUT,
        purpose: kind === "SALARY" ? PaymentPurpose.SALARY : PaymentPurpose.OPERATING_EXPENSE,
        method: normalizePaymentMethod(input.method),
        amount: money(amount),
        currency: "VND",
        status: markPaidNow ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        paidAt: markPaidNow ? new Date() : null,
        reference: clean(input.reference) || null,
        note: clean(input.note) || null,
        payee_user_id: payeeUser?.id ?? null,
        payeeName: kind === "SALARY"
          ? payeeUser?.name || payeeUser?.email || null
          : clean(input.payeeName) || null,
        expense_category_id: category?.id ?? null,
        financeChannel: financeChannel as "MEN" | "WOMEN" | "UNISEX",
      },
    });
    const event = await recordBusinessEvent(tx, {
      eventKey: "payment.created",
      targetType: "PAYMENT",
      targetId: payment.id,
      actorUserId: input.actorUserId ?? null,
      payload: {
        ownerType: "EXPENSE",
        ownerId: category?.id ?? payeeUser?.id ?? payment.id,
        status: payment.status,
        amount: Number(payment.amount),
        direction: payment.direction,
        type: payment.type,
        purpose: payment.purpose,
        currency: payment.currency,
        expenseCategory: category?.code ?? null,
        payeeUserId: payeeUser?.id ?? null,
        financeChannel,
        sourceId: `${payment.id}:payment.created`,
      },
    });
    return { payment: toPlain(payment), projectionDeliveryKey: event.projectionDeliveryKey };
  });
  await processBusinessEventOperation(result.projectionDeliveryKey);
  return result.payment;
}
