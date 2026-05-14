import type {
  OrderFlowType,
  OrderItemKind,
  OrderSource,
  OrderStatus,
  OrderVerificationStatus,
  PaymentMethod,
  ReserveType,
  ServiceScope,
} from "@prisma/client";

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

export type OrderSearchInput = {
  q?: string;
  view?: OrderViewKey;
  sort?: OrderListSort;
  page?: number;
  pageSize?: number;
};

export type OrderItemInput = {
  id?: string;
  kind: OrderItemKind | "PRODUCT" | "SERVICE" | "DISCOUNT";
  productId?: string | null;
  variantId?: string | null;
  title: string;
  quantity: number;
  listPrice: number;
  unitPriceAgreed?: number | null;
  img?: string | null;
  serviceCatalogId?: string | null;
  serviceScope?: ServiceScope | null;
  linkedOrderItemId?: string | null;
  customerItemNote?: string | null;
  taxRate?: number | null;
  createdFromFlow?: OrderFlowType | "STANDARD" | "QUICK_ORDER" | null;
};

export type OrderDraftInput = {
  customerName: string;
  shipPhone?: string | null;
  hasShipment: boolean;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipDistrict?: string | null;
  shipWard?: string | null;
  createdAt: string;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  reserve?: {
    type: ReserveType;
    amount?: number | null;
    expiresAt?: string | null;
  } | null;
  items: OrderItemInput[];
};

export type CreateOrderInput = Omit<OrderDraftInput, "createdAt"> & {
  customerId?: string | null;
  orderDate?: Date | string | null;
  status?: OrderStatus;
  source?: OrderSource;
  verificationStatus?: OrderVerificationStatus;
  quickFromProductId?: string | null;
  quickFlowType?: OrderFlowType | "STANDARD" | "QUICK_ORDER" | null;
};

export type QuickOrderFromProductInput = {
  productId: string;
  customerName: string;
  customerId?: string | null;
  shipPhone?: string | null;
  listPrice?: number | null;
  unitPriceAgreed?: number | null;
  notes?: string | null;
};

export type ResolvedProductOrderItem = {
  kind: "PRODUCT";
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  listPrice: number;
  primaryImageUrl?: string | null;
  productType?: string | null;
};
