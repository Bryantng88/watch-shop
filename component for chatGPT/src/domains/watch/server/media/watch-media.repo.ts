import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

export async function replaceWatchImagesRepo(db: DB, input: any) {
  return productRepo.replaceProductImages(db, input);
}

export async function setWatchStorefrontImageRepo(db: DB, productId: string, imageId: string | null) {
  return productRepo.setProductStorefrontImage(db, productId, imageId);
}
