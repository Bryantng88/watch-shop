import { prisma } from "@/server/db/client";
import {
  getWatchPricingRepo,
  updateWatchPricingRepo,
  type UpdateWatchPricingInput,
} from "./watch-pricing.repo";

function moneyString(value: unknown) {
  return value == null ? null : String(value);
}

function hasChanged(before: unknown, after: unknown) {
  return moneyString(before) !== moneyString(after);
}

export async function getWatchPricing(productId: string) {
  return getWatchPricingRepo(prisma as any, productId);
}

export async function updateWatchPricing(
  productId: string,
  input: UpdateWatchPricingInput
) {
  return updateWatchPricingRepo(prisma as any, productId, input);
}

export async function updateWatchPricingWithDiff(
  productId: string,
  input: UpdateWatchPricingInput
) {
  const before = await getWatchPricingRepo(prisma as any, productId);
  const next = await updateWatchPricingRepo(prisma as any, productId, input);

  const changedFields = [
    hasChanged(before.price?.salePrice, next.salePrice) ? "salePrice" : null,
    hasChanged(before.price?.minPrice, next.minPrice) ? "minPrice" : null,
    hasChanged(before.price?.costPrice, next.costPrice) ? "costPrice" : null,
    hasChanged(before.price?.serviceCost, next.serviceCost) ? "serviceCost" : null,
    hasChanged(before.price?.landedCost, next.landedCost) ? "landedCost" : null,
  ].filter(Boolean) as string[];

  return {
    product: before.product,
    before: before.price,
    after: next,
    changedFields,
  };
}