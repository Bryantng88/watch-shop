import {
  ProductStatus,
  WatchSaleState,
  WatchServiceState,
  WatchStockState,
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
  if (current.saleState === WatchSaleState.SOLD || current.product.status === ProductStatus.SOLD) {
    fail("Watch đã SOLD, không thể đổi trạng thái.");
  }
}

function assertNotConsignedTo(current: WatchStateSnapshot) {
  if (
    current.saleState === WatchSaleState.CONSIGNED_TO ||
    current.product.status === ProductStatus.CONSIGNED_TO
  ) {
    fail("Watch đang ký gửi đi, không thể đổi trạng thái này.");
  }
}

function assertServiceReady(current: WatchStateSnapshot) {
  if (
    current.serviceState === WatchServiceState.PENDING ||
    current.serviceState === WatchServiceState.IN_SERVICE
  ) {
    fail("Watch đang trong luồng service, chưa thể chuyển READY/HOLD/SOLD.");
  }
}

export function resolveWatchStateTransition(
  action: WatchStateAction,
  current: WatchStateSnapshot
): WatchStatePatch {
  switch (action) {
    case "MARK_READY": {
      assertNotSold(current);
      assertNotConsignedTo(current);
      assertServiceReady(current);

      return {
        saleState: WatchSaleState.READY,
        stockState: WatchStockState.IN_STOCK,
        productStatus: ProductStatus.AVAILABLE,
      };
    }

    case "MARK_HOLD": {
      assertNotSold(current);
      assertNotConsignedTo(current);
      assertServiceReady(current);

      return {
        saleState: WatchSaleState.HOLD,
        stockState: WatchStockState.RESERVED,
        productStatus: ProductStatus.HOLD,
      };
    }

    case "RELEASE_HOLD": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      if (current.saleState !== WatchSaleState.HOLD) {
        fail("Chỉ watch đang HOLD mới được bỏ giữ.");
      }

      assertServiceReady(current);

      return {
        saleState: WatchSaleState.READY,
        stockState: WatchStockState.IN_STOCK,
        productStatus: ProductStatus.AVAILABLE,
      };
    }

    case "MARK_SOLD": {
      assertNotSold(current);
      assertNotConsignedTo(current);
      assertServiceReady(current);

      return {
        saleState: WatchSaleState.SOLD,
        stockState: WatchStockState.OUT_OF_STOCK,
        productStatus: ProductStatus.SOLD,
      };
    }

    case "MARK_CONSIGNED_TO": {
      assertNotSold(current);
      assertServiceReady(current);

      return {
        saleState: WatchSaleState.CONSIGNED_TO,
        stockState: WatchStockState.OUT_OF_STOCK,
        productStatus: ProductStatus.CONSIGNED_TO,
      };
    }

    case "MARK_SERVICE_PENDING": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      return {
        saleState: WatchSaleState.IN_SERVICE,
        serviceState: WatchServiceState.PENDING,
        stockState: WatchStockState.OUT_OF_STOCK,
        productStatus: ProductStatus.NEED_SERVICE,
      };
    }

    case "MARK_IN_SERVICE": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      return {
        saleState: WatchSaleState.IN_SERVICE,
        serviceState: WatchServiceState.IN_SERVICE,
        stockState: WatchStockState.OUT_OF_STOCK,
        productStatus: ProductStatus.IN_SERVICE,
      };
    }

    case "MARK_SERVICE_DONE": {
      assertNotSold(current);
      assertNotConsignedTo(current);

      return {
        saleState: WatchSaleState.READY,
        serviceState: WatchServiceState.DONE,
        stockState: WatchStockState.IN_STOCK,
        productStatus: ProductStatus.AVAILABLE,
      };
    }

    default:
      fail("Action đổi trạng thái watch không hợp lệ.");
  }
}
