import { prisma } from "@/server/db/client";
import type { SaveWatchContentInput } from "../shared";
import {
  getWatchContentRepo,
  saveWatchContentRepo,
  syncWatchContentSnapshotRepo,
} from "./watch-content.repo";

export async function getWatchContent(productId: string) {
  return getWatchContentRepo(prisma as any, productId);
}

export async function saveWatchContent(
  productId: string,
  input: Omit<SaveWatchContentInput, "productId">
) {
  return saveWatchContentRepo(prisma as any, productId, {
    productId,
    ...input,
  });
}

export async function syncWatchContentSnapshot(productId: string) {
  return syncWatchContentSnapshotRepo(prisma as any, productId);
}