import {
  completePayment,
  createInitialPaymentForAcquisitionTx,
  createInitialPaymentsForOrderTx,
  createPayment,
  getAcquisitionPaymentSummary,
  getOrderPaymentSummary,
  listAcquisitionPayments,
  listOrderPayments,
  markOrderShipmentDeliveredAndCollectCod,
  cancelPayment,
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

export async function cancelPaymentApplication(input: {
  paymentId: string;
  note?: string | null;
}) {
  return cancelPayment(input);
}

export async function listOrderPaymentsApplication(orderId: string) {
  return listOrderPayments(orderId);
}

export async function getOrderPaymentSummaryApplication(orderId: string) {
  return getOrderPaymentSummary(orderId);
}

export async function listAcquisitionPaymentsApplication(acquisitionId: string) {
  return listAcquisitionPayments(acquisitionId);
}

export async function getAcquisitionPaymentSummaryApplication(acquisitionId: string) {
  return getAcquisitionPaymentSummary(acquisitionId);
}

export async function createInitialPaymentsForOrderApplicationTx(tx: Tx, orderId: string) {
  return createInitialPaymentsForOrderTx(tx, orderId);
}

export async function createInitialPaymentForAcquisitionApplicationTx(
  tx: Tx,
  acquisitionId: string,
) {
  return createInitialPaymentForAcquisitionTx(tx, acquisitionId);
}

export async function markOrderShipmentDeliveredApplication(input: {
  orderId: string;
  note?: string | null;
}) {
  return markOrderShipmentDeliveredAndCollectCod(input);
}