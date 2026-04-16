import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

export async function upsertWatchSpecRepo(db: DB, input: any) {
  return productRepo.upsertWatchSpecForAdmin(db, input);
}
