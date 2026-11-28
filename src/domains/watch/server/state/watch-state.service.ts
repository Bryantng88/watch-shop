import { readConsignment } from "@/domains/consignment/shared/contract";
import { prisma } from "@/server/db/client";

import { resolveWatchStateTransition } from "./watch-state.rules";
import type {
  WatchStateAction,
  WatchStateTransitionResult,
} from "./watch-state.types";
import {
  applyWatchStatePatchRepo,
  getWatchStateSnapshotRepo,
} from "./watch-state.repo";

export async function transitionWatchState(
  productId: string,
  action: WatchStateAction
): Promise<WatchStateTransitionResult> {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id"=${productId} FOR UPDATE`;
    const current = await getWatchStateSnapshotRepo(tx, productId);

    if (!current) {
      throw new Error("Không tìm thấy watch.");
    }

    const owner=await tx.watch.findUnique({where:{productId},select:{acquisitionId:true}});
    const acquisition=owner?.acquisitionId?await tx.acquisition.findUnique({where:{id:owner.acquisitionId},select:{consignment:true}}):null;
    const consignment=readConsignment(acquisition?.consignment);
    if(consignment?.direction === "IN" && ["DRAFT","RETURNED","CANCELLED"].includes(consignment.status))throw new Error("Đồng hồ chưa được nhận hoặc đã trả người gửi. Xử lý hồ sơ ký gửi trước.");
    if(consignment?.direction === "IN" && action === "MARK_SOLD")throw new Error("Bán đồng hồ nhận ký gửi qua Đơn hàng để chốt đúng số tiền và quyết toán.");
    const patch = resolveWatchStateTransition(action, current);
    if(consignment?.direction === "IN" && consignment.status === "ACTIVE" && patch.productStatus === "AVAILABLE")patch.productStatus="CONSIGNED_FROM";
    const next = await applyWatchStatePatchRepo(tx, productId, patch);

    return {
      ...next,
      previous: current,
    };
  });
}

export function markWatchReady(productId: string) {
  return transitionWatchState(productId, "MARK_READY");
}

export function markWatchSold(productId: string) {
  return transitionWatchState(productId, "MARK_SOLD");
}

export function markWatchConsignedTo(productId: string) {
  return transitionWatchState(productId, "MARK_CONSIGNED_TO");
}

export function markWatchServicePending(productId: string) {
  return transitionWatchState(productId, "MARK_SERVICE_PENDING");
}

export function markWatchInService(productId: string) {
  return transitionWatchState(productId, "MARK_IN_SERVICE");
}

export function markWatchServiceDone(productId: string) {
  return transitionWatchState(productId, "MARK_SERVICE_DONE");
}
