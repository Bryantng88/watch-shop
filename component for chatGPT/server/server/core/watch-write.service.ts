import { prisma } from "@/server/db/client";
import {
  assertWatchWritable,
  validateWatchPricingInput,
} from "../shared";
import type {
  CreateWatchDraftInput,
  UpdateWatchCoreInput,
  UpdateWatchPricingInput,
} from "../shared";
import {
  createWatchDraftRepo,
  removeWatchRepo,
  updateWatchCoreRepo,
} from "./watch-write.repo";

export async function createWatchDraft(input: CreateWatchDraftInput) {
  return createWatchDraftRepo(prisma as any, input);
}

export async function updateWatchCore(
  productId: string,
  input: UpdateWatchCoreInput
) {
  if (input.status) {
    assertWatchWritable(input.status === "SOLD" ? "SOLD" : null);
  }

  return updateWatchCoreRepo(prisma as any, productId, input);
}

export async function removeWatch(productId: string) {
  return removeWatchRepo(prisma as any, productId);
}