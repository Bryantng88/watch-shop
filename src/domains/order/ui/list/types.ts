export type OrderViewKey =
  | "all"
  | "pending"
  | "need_action"
  | "processing"
  | "returning"
  | "completed"
  | "returned"
  | "cancelled";

export type OrderProcessingSubFilter =
  | ""
  | "awaiting_payment"
  | "remaining_payment"
  | "awaiting_shipment"
  | "shipping"
  | "delivered_remaining";

export type OrderListFiltersValue = {
  q: string;
  sort: string;
  pageSize: string;
};

export const ORDER_LIST_VIEWS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác minh" },
  { key: "need_action", label: "Cần xử lý" },
  { key: "processing", label: "Đang xử lý" },
  { key: "returning", label: "Đang hoàn" },
  { key: "completed", label: "Hoàn tất" },
  { key: "returned", label: "Đã hoàn" },
  { key: "cancelled", label: "Đã huỷ" },
] as const;

export const ORDER_PROCESSING_SUB_FILTERS = [
  { key: "", label: "Tất cả" },
  { key: "awaiting_payment", label: "Chờ thanh toán" },
  { key: "remaining_payment", label: "Còn phải thu" },
  { key: "awaiting_shipment", label: "Chờ giao" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered_remaining", label: "Đã giao / còn phải thu" },
] as const;

export type OrderListCounts = Partial<Record<OrderViewKey, number>> & {
  processingSub?: Partial<Record<Exclude<OrderProcessingSubFilter, "">, number>>;
};

export type OrderPaymentFlowTone =
  | "neutral"
  | "warning"
  | "info"
  | "success"
  | "danger";

export type OrderListItem = {
  id: string;
  refNo: string | null;

  customerName: string | null;
  customerPhone: string | null;
  shipPhone?: string | null;

  status: string | null;
  verificationStatus?: string | null;

  paymentStatus?: string | null;
  fulfillmentStatus?: string | null;
  shipmentStatus?: string | null;
  activeShipmentId?: string | null;
  shipmentProgressEvents?: {
    key: string;
    status: string | null;
    label?: string;
  }[];
  source?: string | null;
  sourceLabel?: string | null;
  createdByName?: string | null;

  itemsCount?: number | null;
  totalAmount?: number | string | null;
  paidAmount?: number | string | null;
  remainingAmount?: number | string | null;

  depositRequired?: number | string | null;
  depositPaid?: number | string | null;
  reserveType?: string | null;
  paymentMethod?: string | null;

  paymentFlowLabel?: string | null;
  paymentFlowTone?: OrderPaymentFlowTone | null;
  paymentFlowDescription?: string | null;

  hasShipment?: boolean | null;
  hasPendingPayment?: boolean | null;
  isFullyPaid?: boolean | null;

  collectedAmount?: number | string | null;
  unpaidPaymentAmount?: number | string | null;
  updatedAt?: string | Date | null;
};

export type OrderListPageProps = {
  items: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rawSearchParams: Record<string, string | string[] | undefined>;
  counts: OrderListCounts;
};
