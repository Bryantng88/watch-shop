import type { OrderListCounts, OrderListItem } from "../ui/list/types";

export type OrderListProjectionRow = OrderListItem & {
  refNo: string | null;
  createdAt: string;
  updatedAt: string;
  previewImageUrl: string | null;
  previewImageUrls: string[];
  orderStatus: string;
};

export type OrderListProjectionResult = {
  items: OrderListProjectionRow[];
  total: number;
  totalValue: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: OrderListCounts;
};
