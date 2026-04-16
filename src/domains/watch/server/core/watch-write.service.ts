import { prisma } from "@/server/db/client";
import {
  createWatchDraftRepo,
  markWatchesPostedRepo,
  removeWatchRepo,
  updateWatchRepo,
  updateWatchVariantStatusRepo,
  upsertPrimaryWatchVariantRepo,
} from "./watch-write.repo";

export async function createWatchDraft(title: string) {
  return prisma.$transaction(async (tx) => createWatchDraftRepo(tx as any, title));
}

export async function updateWatch(input: any) {
  return prisma.$transaction(async (tx) => updateWatchRepo(tx as any, input));
}

export async function removeWatch(productId: string) {
  return prisma.$transaction(async (tx) => removeWatchRepo(tx as any, productId));
}

export async function updateWatchVariantStatus(variantId: string, status: any) {
  return prisma.$transaction(async (tx) => updateWatchVariantStatusRepo(tx as any, variantId, status));
}

export async function markWatchesPosted(productIds: string[]) {
  return prisma.$transaction(async (tx) => markWatchesPostedRepo(tx as any, productIds));
}

export async function upsertPrimaryWatchVariant(input: any) {
  return prisma.$transaction(async (tx) => upsertPrimaryWatchVariantRepo(tx as any, input));
}
