import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

export async function syncWatchContentSnapshotRepo(db: DB, productId: string) {
  return productRepo.syncProductContentSnapshot(db, productId);
}

export async function saveWatchContentRepo(db: DB, input: any) {
  return productRepo.saveProductContent(db, input);
}
