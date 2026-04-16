import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

export async function getAdminWatchRow(db: DB, productId: string) {
  return productRepo.getAdminProductRow(db, productId);
}

export async function getAdminEditWatchDetail(db: DB, productId: string) {
  return productRepo.getAdminEditProductDetail(db, productId);
}

export async function getAdminWatchDetail(db: DB, productId: string) {
  return productRepo.getAdminProductDetail(db, productId);
}

export async function getLatestWatchVariantForAdmin(db: DB, productId: string) {
  return productRepo.getLatestVariantForAdmin(db, productId);
}

export async function getOpenServiceWatches(db: DB) {
  return productRepo.getOpenServiceProducts(db);
}

export async function getWatchTradeHistory(db: DB, productId: string) {
  return productRepo.getProductTradeHistory(db, productId);
}

export async function getWatchServiceHistory(db: DB, productId: string) {
  return productRepo.getProductServiceHistory(db, productId);
}
