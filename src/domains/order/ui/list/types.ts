export type OrderViewKey =
  | "all"
  | "web_pending"
  | "need_action"
  | "processing"
  | "delivered"
  | "completed"
  | "cancelled";

export type OrderListSort =
  | "updatedDesc"
  | "updatedAsc"
  | "createdDesc"
  | "createdAsc";

export type OrderListItem = {
  id: string;
  refNo: string | null;
  customerName: string | null;
  shipPhone: string | null;
  reserveType: string | null;
  depositRequired: number;
  status: string;
  subtotal: number;
  currency: string;
  itemCount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  source: string;
  verificationStatus: string;
  hasShipment: boolean | null;
};

export type OrderListCounts = Record<OrderViewKey, number>;

export type OrderListFiltersValue = {
  q: string;
  sort: OrderListSort;
  pageSize: string;
};

export type OrderListPageProps = {
  items: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rawSearchParams: Record<string, string | string[] | undefined>;
  counts?: Partial<OrderListCounts>;
};
