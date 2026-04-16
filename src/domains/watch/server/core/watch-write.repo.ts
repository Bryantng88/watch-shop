import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

export async function createWatchDraftRepo(db: DB, title: string) {
  return productRepo.createProductDraft(db, title, "WATCH" as any, 1, null as any);
}

export async function updateWatchRepo(db: DB, input: any) {
  return productRepo.updateProduct(db, input);
}

export async function removeWatchRepo(db: DB, productId: string) {
  return productRepo.deleteProduct(db, productId);
}

export async function updateWatchVariantStatusRepo(db: DB, variantId: string, status: any) {
  return productRepo.updateProductVariantStt(db, variantId, status);
}

export async function markWatchesPostedRepo(db: DB, productIds: string[]) {
  return productRepo.markPostedMany(db, productIds);
}

export async function upsertPrimaryWatchVariantRepo(db: DB, input: any) {
  return productRepo.upsertPrimaryVariantForAdmin(db, input);
}
