// Compatibility layer only.
// New payment logic lives in domains/payment. Keep these exports so older order imports do not break during rollout.

import {
  completePaymentApplication,
  createPaymentApplication,
  getOrderPaymentSummaryApplication as getPaymentSummaryApplication,
  listOrderPaymentsApplication,
} from "@/domains/payment/application";

export async function markOrderPaymentPaidApplication(input: {
  paymentId: string;
  paidAt?: Date | string | null;
  reference?: string | null;
  note?: string | null;
}) {
  return completePaymentApplication(input);
}

export async function createNextOrderPaymentApplication(input: {
  orderId: string;
  amount?: number | null;
  method?: string | null;
  note?: string | null;
  markPaidNow?: boolean | null;
}) {
  return createPaymentApplication({
    ownerType: "ORDER",
    ownerId: input.orderId,
    amount: input.amount,
    method: input.method,
    note: input.note,
    markPaidNow: input.markPaidNow,
  });
}

export async function getOrderPaymentSummaryApplication(orderId: string) {
  return getPaymentSummaryApplication(orderId);
}

export async function listOrderPaymentsForOrderApplication(orderId: string) {
  return listOrderPaymentsApplication(orderId);
}
