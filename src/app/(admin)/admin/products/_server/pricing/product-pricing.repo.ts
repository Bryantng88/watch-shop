import { prisma } from "@/server/db/client";

export async function findProductPricingById(productId: string) {
    return prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            minPrice: true,
            salePrice: true,
            purchasePrice: true,
            updatedAt: true,
        },
    });
}

export async function updateProductPricing(
    productId: string,
    patch: Partial<{
        minPrice: number | null;
        salePrice: number | null;
        purchasePrice: number | null;
    }>
) {
    return prisma.product.update({
        where: { id: productId },
        data: patch,
        select: {
            id: true,
            minPrice: true,
            salePrice: true,
            purchasePrice: true,
            updatedAt: true,
        },
    });
}
