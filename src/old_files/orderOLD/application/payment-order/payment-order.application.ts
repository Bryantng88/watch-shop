import { createNextOrderPayment, getOrderPaymentSummary, markOrderPaymentPaid } from "../../server";

export async function markOrderPaymentPaidApplication(input: {
  paymentId: string;
  paidAt?: Date | string | null;
  reference?: string | null;
  note?: string | null;
}) {
  return markOrderPaymentPaid(input);
}

export async function createNextOrderPaymentApplication(input: {
  orderId: string;
  amount?: number | null;
  method?: string | null;
  note?: string | null;
}) {
  return createNextOrderPayment(input);
}

export async function getOrderPaymentSummaryApplication(orderId: string) {
  return getOrderPaymentSummary(orderId);
}
