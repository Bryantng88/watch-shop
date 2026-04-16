import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";
import type { WatchListFilters } from "./watch.types";

export async function listAdminWatches(db: DB, input: WatchListFilters) {
  return productRepo.listAdminProducts(db, {
    ...input,
    catalog: "product",
    type: ["WATCH"],
  } as any);
}

export async function searchWatches(db: DB, q: string) {
  return productRepo.searchProductsRepo(db, q, "product");
}

export async function getWatchesForBulkPost(db: DB, ids?: string[]) {
  return productRepo.getProductsForBulkPost(db, ids);
}

export async function listDraftWatchIdsForAutoBulkPost(db: DB, limit?: number) {
  return productRepo.listDraftProductIdsForAutoBulkPost(db, limit);
}
