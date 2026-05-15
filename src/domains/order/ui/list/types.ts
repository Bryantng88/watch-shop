export type OrderViewKey =
  | "all"
  | "pending"
  | "need_action"
  | "processing"
  | "delivered"
  | "completed"
  | "cancelled";

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
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã huỷ" },
] as const;
export type OrderListCounts = Partial<Record<OrderViewKey, number>>;

export type OrderListItem = {
  id: string;
  refNo: string | null;

  customerName: string | null;
  customerPhone: string | null;
  shipPhone?: string | null;

  status: string | null;
  paymentStatus?: string | null;
  fulfillmentStatus?: string | null;
  verificationStatus?: string | null;

  source?: string | null;
  sourceLabel?: string | null;
  createdByName?: string | null;

  itemsCount?: number | null;
  totalAmount?: number | string | null;
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