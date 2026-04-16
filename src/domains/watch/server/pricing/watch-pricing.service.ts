import { prisma } from "@/server/db/client";
import { validateWatchPricingInput } from "../shared";
import type { UpdateWatchPricingInput } from "../shared";
import {
  bulkSetWatchSalePriceRepo,
  getWatchPricingRepo,
  updateWatchPricingRepo,
} from "./watch-pricing.repo";

export async function getWatchPricing(productId: string) {
  return getWatchPricingRepo(prisma as any, productId);
}

export async function updateWatchPricing(
  productId: string,
  input: Omit<UpdateWatchPricingInput, "productId">
) {
  const payload: UpdateWatchPricingInput = {
    productId,
    ...input,
  };

  validateWatchPricingInput(payload);
  return updateWatchPricingRepo(prisma as any, productId, payload);
}

export async function bulkSetWatchSalePrice(input: {
  productIds: string[];
  salePrice: number | string;
}) {
  return bulkSetWatchSalePriceRepo(prisma as any, input);
}