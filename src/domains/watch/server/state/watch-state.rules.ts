import {
  ProductStatus,
  WatchSaleStage,
  WatchServiceStage,
  WatchStockStage,
} from "@prisma/client";

import type {
  WatchStateAction,
  WatchStatePatch,
  WatchStateSnapshot,
} from "./watch-state.types";

function fail(message: string): never {
  throw new Error(message);
}

function assertNotSold(current: WatchStateSnapshot) {
  if (
    current.saleStage === WatchSaleStage.SOLD ||
    current.product.status === ProductStatus.SOLD
  ) {
    fail("Watch đã SOLD, không thể đổi trạng thái.");
  }
}

function assertNotConsignedTo(current: WatchStateSnapshot) {
  if (
    current.saleStage === WatchSaleStage.CONSIGNED_TO ||
    current.product.status === ProductStatus.CONSIGNED_TO
  ) {
    fail("Watch đang ký gửi đi, không thể đổi trạng thái này.");
  }
}

function assertServiceReady(current: WatchStateSnapshot) {
  if (
    current.serviceStage === WatchServiceStage.PENDING ||
    current.serviceStage === WatchServiceStage.IN_SERVICE
  ) {
    fail("Watch đang trong luồng service, chưa thể chuyển READY/HOLD/SOLD.");
  }
}

function toProcessingIfNeeded(current: WatchStateSnapshot) {
  if (
    current.saleStage === WatchSaleStage.DRAFT ||
    current.saleStage === WatchSaleStage.PROCESSING
  ) {
    return WatchSaleStage.PROCESSING;
  }

  return current.saleStage;
}

export function resolveWatchStateTransition(
  action: WatchStateAction,
  current: WatchStateSnapshot,
): WatchStatePatch {
  switch (action) {
    case "MARK_READY": {
      assertNotSold(current);
      assertNotConsignedTo(current);
      assertServiceReady(current);

      return {
        saleStage: WatchSaleStage.READY,
        stockStage: WatchStockStage.IN_STOCK,
        productStatus: ProductStatus.AVAILABLE,
      };
    }

    case "MARK_HOLD": {
      assertNotSold(current);
      assertNotConsignedTo(current);
      assertServiceReady(current);

      return {
        saleStage: WatchSaleStage.HOLD,
        stockStage: WatchStockStage.RESERVED,
        productStatus: ProductStatus.HOLD,
      };
    }

    case "RELEASE_HOLD": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      if (current.saleStage !== WatchSaleStage.HOLD) {
        fail("Chỉ watch đang HOLD mới được bỏ giữ.");
      }

      assertServiceReady(current);

      return {
        saleStage: WatchSaleStage.READY,
        stockStage: WatchStockStage.IN_STOCK,
        productStatus: ProductStatus.AVAILABLE,
      };
    }

    case "MARK_SOLD": {
      assertNotSold(current);
      assertNotConsignedTo(current);
      assertServiceReady(current);

      return {
        saleStage: WatchSaleStage.SOLD,
        stockStage: WatchStockStage.OUT_OF_STOCK,
        productStatus: ProductStatus.SOLD,
      };
    }

    case "MARK_CONSIGNED_TO": {
      assertNotSold(current);
      assertServiceReady(current);

      return {
        saleStage: WatchSaleStage.CONSIGNED_TO,
        stockStage: WatchStockStage.OUT_OF_STOCK,
        productStatus: ProductStatus.CONSIGNED_TO,
      };
    }

    case "MARK_SERVICE_PENDING": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      return {
        saleStage: toProcessingIfNeeded(current),
        serviceStage: WatchServiceStage.PENDING,
        stockStage: WatchStockStage.OUT_OF_STOCK,
        productStatus: ProductStatus.NEED_SERVICE,
      };
    }

    case "MARK_IN_SERVICE": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      return {
        saleStage: toProcessingIfNeeded(current),
        serviceStage: WatchServiceStage.IN_SERVICE,
        stockStage: WatchStockStage.OUT_OF_STOCK,
        productStatus: ProductStatus.IN_SERVICE,
      };
    }

    case "MARK_SERVICE_DONE": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      return {
        saleStage: WatchSaleStage.READY,
        serviceStage: WatchServiceStage.DONE,
        stockStage: WatchStockStage.IN_STOCK,
        productStatus: ProductStatus.AVAILABLE,
      };
    }

    default:
      fail("Action đổi trạng thái watch không hợp lệ.");
  }
}