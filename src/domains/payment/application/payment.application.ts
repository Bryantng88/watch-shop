import {
  completePayment,
  createInitialPaymentsForOrderTx,
  createPayment,
  getOrderPaymentSummary,
  listOrderPayments,
  markOrderShipmentDeliveredAndCollectCod,
  type Tx,
} from "../server";
import type { CreatePaymentInput } from "../shared";

export async function createPaymentApplication(input: CreatePaymentInput) {
  return createPayment(input);
}

export async function completePaymentApplication(input: {
  paymentId: string;
  paidAt?: Date | string | null;
  reference?: string | null;
  note?: string | null;
}) {
  return completePayment(input);
}

export async function listOrderPaymentsApplication(orderId: string) {
  return listOrderPayments(orderId);
}

export async function getOrderPaymentSummaryApplication(orderId: string) {
  return getOrderPaymentSummary(orderId);
}

export async function createInitialPaymentsForOrderApplicationTx(tx: Tx, orderId: string) {
  return createInitialPaymentsForOrderTx(tx, orderId);
}

export async function markOrderShipmentDeliveredApplication(input: { orderId: string; note?: string | null }) {
  return markOrderShipmentDeliveredAndCollectCod(input);
}
