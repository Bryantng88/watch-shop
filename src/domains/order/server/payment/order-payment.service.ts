// Deprecated: payment moved to domains/payment.
// Keep re-exports for old imports during rollout.

export {
  completePayment as markOrderPaymentPaid,
  createInitialPaymentsForOrderTx as createInitialPaymentForOrderTx,
  createPayment as createNextOrderPayment,
  getOrderPaymentSummary,
  getPaymentSummaryTx as getOrderPaymentSummaryTx,
  listOrderPayments,
  recomputePaymentOwnerRollupTx as recomputeOrderOperationalStateTx,
} from "@/domains/payment/server";
