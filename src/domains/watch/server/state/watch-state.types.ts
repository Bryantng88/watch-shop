import type {
  ProductStatus,
  WatchSaleStage,
  WatchServiceStage,
  WatchStockStage,
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
  saleStage: WatchSaleStage;
  serviceStage: WatchServiceStage;
  stockStage: WatchStockStage;
  product: {
    id: string;
    status: ProductStatus;
  };
};

export type WatchStatePatch = {
  saleStage?: WatchSaleStage;
  serviceStage?: WatchServiceStage;
  stockStage?: WatchStockStage;
  productStatus?: ProductStatus;
};

export type WatchStateTransitionResult = WatchStateSnapshot & {
  previous: WatchStateSnapshot;
};