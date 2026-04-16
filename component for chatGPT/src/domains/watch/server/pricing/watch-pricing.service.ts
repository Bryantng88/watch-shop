import { prisma } from "@/server/db/client";
import { bulkSetWatchSalePriceRepo, getWatchPricingMatrixRepo, updateWatchVariantPricingRepo } from "./watch-pricing.repo";

export async function updateWatchVariantPricing(input: any) {
  return prisma.$transaction(async (tx) => updateWatchVariantPricingRepo(tx as any, input));
}

export async function bulkSetWatchSalePrice(input: any) {
  return prisma.$transaction(async (tx) => bulkSetWatchSalePriceRepo(tx as any, input));
}

export async function getWatchPricingMatrix(input: any) {
  return getWatchPricingMatrixRepo(prisma as any, input);
}
