import * as pricingRepo from "./product-pricing.repo";

export type ProductPricingField = "minPrice" | "salePrice" | "purchasePrice";

export async function updateProductPricing(input: {
    productId: string;
    field: ProductPricingField;
    value: number | null;
}) {
    const existing = await pricingRepo.findProductPricingById(input.productId);
    if (!existing) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    const patch: Partial<Record<ProductPricingField, number | null>> = {
        [input.field]: input.value,
    };

    return pricingRepo.updateProductPricing(input.productId, patch);
}
