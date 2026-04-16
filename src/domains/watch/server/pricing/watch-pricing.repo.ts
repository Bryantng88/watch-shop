import type { DB } from "@/server/db/client";
import * as productRepo from "@/app/(admin)/admin/products/_server/core/product.repo";
import * as pricingRepo from "@/app/(admin)/admin/products/_server/pricing/product-pricing.repo";

export async function updateWatchVariantPricingRepo(db: DB, input: any) {
  return productRepo.updatePrimaryVariantPricing(db, input);
}

export async function bulkSetWatchSalePriceRepo(db: DB, input: any) {
  return productRepo.bulkSetSalePrice(db, input);
}

export async function getWatchPricingMatrixRepo(db: DB, input: any) {
  if (typeof (pricingRepo as any).getProductPricingMatrix === "function") {
    return (pricingRepo as any).getProductPricingMatrix(db, input);
  }
  return null;
}
