import {
  completePayment,
  createInitialPaymentForAcquisitionTx,
  createInitialPaymentsForOrderTx,
  createPayment,
  ensureServiceRequestPaymentTx,
  getAcquisitionPaymentSummary,
  getOrderPaymentSummary,
  getServicePaymentSummary,
  listAcquisitionPayments,
  listOrderPayments,
  listServicePayments,
  markOrderShipmentDeliveredAndCollectCod,
  cancelPayment,
  finalizeOrderByPaidAmount,
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

export async function finalizeOrderByPaidAmountApplication(input: {
  orderId: string;
  note?: string | null;
}) {
  return finalizeOrderByPaidAmount(input);
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

export async function listServicePaymentsApplication(serviceRequestId: string) {
  return listServicePayments(serviceRequestId);
}

export async function getServicePaymentSummaryApplication(serviceRequestId: string) {
  return getServicePaymentSummary(serviceRequestId);
}

export async function ensureServiceRequestPaymentApplicationTx(tx: Tx, serviceRequestId: string) {
  return ensureServiceRequestPaymentTx(tx, serviceRequestId);
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