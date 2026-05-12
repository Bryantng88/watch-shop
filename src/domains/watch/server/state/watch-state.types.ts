import type {
  ProductStatus,
  WatchSaleState,
  WatchServiceState,
  WatchStockState,
} from "@prisma/client";

export type WatchStateAction =
  | "MARK_READY"
  | "MARK_HOLD"
  | "RELEASE_HOLD"
  | "MARK_SOLD"
  | "MARK_CONSIGNED_TO"
  | "MARK_SERVICE_PENDING"
  | "MARK_IN_SERVICE"
  | "MARK_SERVICE_DONE";

export type WatchStateSnapshot = {
  productId: string;
  saleState: WatchSaleState;
  serviceState: WatchServiceState;
  stockState: WatchStockState;
  product: {
    id: string;
    status: ProductStatus;
  };
};

export type WatchStatePatch = {
  saleState?: WatchSaleState;
  serviceState?: WatchServiceState;
  stockState?: WatchStockState;
  productStatus?: ProductStatus;
};

export type WatchStateTransitionResult = WatchStateSnapshot & {
  previous: WatchStateSnapshot;
};
