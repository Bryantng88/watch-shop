import { readConsignment } from "@/domains/consignment/shared/contract";
import {
  Prisma,
  ProductStatus,
  WatchSaleStage,
  WatchServiceStage,
  WatchStockStage,
} from "@prisma/client";

type Tx = Prisma.TransactionClient;
export type WatchInventoryCanonicalState = "AVAILABLE" | "HOLD" | "SOLD";

const CANONICAL_PATCH = {
  AVAILABLE: {
    productStatus: ProductStatus.AVAILABLE,
    saleStage: WatchSaleStage.READY,
    stockStage: WatchStockStage.IN_STOCK,
  },
  HOLD: {
    productStatus: ProductStatus.HOLD,
    saleStage: WatchSaleStage.HOLD,
    stockStage: WatchStockStage.RESERVED,
  },
  SOLD: {
    productStatus: ProductStatus.SOLD,
    saleStage: WatchSaleStage.SOLD,
    stockStage: WatchStockStage.OUT_OF_STOCK,
  },
} as const;

function productStatusForTransition(input: {
  next: WatchInventoryCanonicalState;
  currentServiceStage: WatchServiceStage;
  serviceStageOverride?: WatchServiceStage | null;
}) {
  const serviceStage = input.serviceStageOverride ?? input.currentServiceStage;
  const hasActiveService = serviceStage === WatchServiceStage.PENDING ||
    serviceStage === WatchServiceStage.IN_SERVICE;

  if (input.next === "AVAILABLE" && hasActiveService) {
    return ProductStatus.IN_SERVICE;
  }

  return CANONICAL_PATCH[input.next].productStatus;
}

/** The only writer for the three sales-inventory fields used by lifecycle flows. */
export async function transitionWatchInventoryTx(
  tx: Tx,
  input: {
    productId: string;
    next: WatchInventoryCanonicalState;
    saleStageOverride?: WatchSaleStage;
    serviceStageOverride?: WatchServiceStage | null;
  },
) {
  await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id"=${input.productId} FOR UPDATE`;
  const current = await tx.watch.findUnique({
    where: { productId: input.productId },
    select: {
      productId: true,
      acquisitionId: true,
      currentInventoryCycleId: true,
      saleStage: true,
      stockStage: true,
      serviceStage: true,
      product: { select: { status: true } },
    },
  });
  if (!current) return null;
  if (!current.currentInventoryCycleId) {
    throw new Error(`Watch ${input.productId} has no current inventory cycle.`);
  }

  const acquisition=current.acquisitionId?await tx.acquisition.findUnique({where:{id:current.acquisitionId},select:{consignment:true}}):null;
  const consignment=readConsignment(acquisition?.consignment);
  if(consignment?.direction === "IN" && ["DRAFT","RETURNED","CANCELLED"].includes(consignment.status))throw new Error("Đồng hồ ký gửi chưa nhận hoặc đã trả người gửi.");
  if(consignment?.direction === "IN" && ["SOLD","SETTLED"].includes(consignment.status) && input.next!=="SOLD")throw new Error("Hồ sơ ký gửi đã chốt bán. Cần đối soát / điều chỉnh quyết toán trước khi hoàn đơn.");
  const patch = CANONICAL_PATCH[input.next];
  const saleStage = input.saleStageOverride ?? patch.saleStage;
  let productStatus: ProductStatus = productStatusForTransition({
    next: input.next,
    currentServiceStage: current.serviceStage,
    serviceStageOverride: input.serviceStageOverride,
  });
  if(consignment?.direction === "IN" && consignment.status === "ACTIVE" && input.next === "AVAILABLE" && productStatus === ProductStatus.AVAILABLE)productStatus=ProductStatus.CONSIGNED_FROM;
  const unchanged = current.product.status === productStatus &&
    current.saleStage === saleStage && current.stockStage === patch.stockStage &&
    (input.serviceStageOverride == null || String(current.serviceStage) === input.serviceStageOverride);
  if (unchanged) return { changed: false, currentInventoryCycleId: current.currentInventoryCycleId };

  await tx.product.update({ where: { id: input.productId }, data: { status: productStatus } });
  await tx.watch.update({
    where: { productId: input.productId },
    data: {
      saleStage,
      stockStage: patch.stockStage,
      ...(input.serviceStageOverride ? { serviceStage: input.serviceStageOverride } : {}),
    },
  });
  return { changed: true, currentInventoryCycleId: current.currentInventoryCycleId };
}
