export type ShipmentViewKey = "all" | "ready" | "shipping" | "returning" | "delivered" | "returned" | "cancelled";

export type ShipmentListFiltersValue = {
  q: string;
  pageSize: string;
};

export const SHIPMENT_LIST_VIEWS: Array<{ key: ShipmentViewKey; label: string; status: string | null }> = [
  { key: "all", label: "Tất cả", status: null },
  { key: "ready", label: "Chờ giao", status: "READY" },
  { key: "shipping", label: "Đang giao", status: "SHIPPED" },
  { key: "returning", label: "Đang hoàn", status: "RETURNING" },
  { key: "delivered", label: "Đã giao", status: "DELIVERED" },
  { key: "returned", label: "Hoàn trả", status: "RETURNED" },
  { key: "cancelled", label: "Đã huỷ", status: "CANCELLED" },
];

export type ShipmentListItem = {
  id: string;
  refNo: string | null;
  orderId: string;
  orderRefNo?: string | null;
  customerName?: string | null;
  shipPhone?: string | null;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipDistrict?: string | null;
  shipWard?: string | null;
  carrier?: string | null;
  trackingCode?: string | null;
  shippingAmount?: number | string | null;
  shippingFeePayer?: string | null;
  currency?: string | null;
  status: string;
  shippedAt?: string | Date | null;
  deliveredAt?: string | Date | null;
  notes?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  order?: {
    id: string;
    refNo?: string | null;
    status?: string | null;
    paymentStatus?: string | null;
    paymentMethod?: string | null;
    reserveType?: string | null;
    source?: string | null;
    subtotal?: number | string | null;
    shippingAmount?: number | string | null;
    quickFromProductId?: string | null;
    quickFlowType?: string | null;
  } | null;
};

export type ShipmentListPageProps = {
  items: ShipmentListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rawSearchParams: Record<string, string | string[] | undefined>;
  counts?: Partial<Record<ShipmentViewKey, number>>;
};
