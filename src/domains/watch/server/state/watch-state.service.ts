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
    const current = await getWatchStateSnapshotRepo(tx, productId);

    if (!current) {
      throw new Error("Không tìm thấy watch.");
    }

    const patch = resolveWatchStateTransition(action, current);
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

export function markWatchHold(productId: string) {
  return transitionWatchState(productId, "MARK_HOLD");
}

export function releaseWatchHold(productId: string) {
  return transitionWatchState(productId, "RELEASE_HOLD");
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
