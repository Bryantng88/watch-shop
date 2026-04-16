import { prisma } from "@/server/db/client";
import * as productService from "@/app/(admin)/admin/products/_server/core/product.service";
import { saveWatchContentRepo, syncWatchContentSnapshotRepo } from "./watch-content.repo";

export async function saveWatchContent(input: any) {
  // Reuse old service because it already rebuilds bullets/hashtags and manual-save flow.
  return productService.saveContent(input);
}

export async function syncWatchContentSnapshot(productId: string) {
  return prisma.$transaction(async (tx) => syncWatchContentSnapshotRepo(tx as any, productId));
}

export async function saveWatchContentDirect(input: any) {
  return prisma.$transaction(async (tx) => saveWatchContentRepo(tx as any, input));
}
