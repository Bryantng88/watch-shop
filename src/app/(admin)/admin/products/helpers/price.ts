import { Prisma } from "@prisma/client";

type VariantLike = {
    price: Prisma.Decimal | number | null;
};

export function computeMinPrice(
    variants: VariantLike[]
): number | null {
    const prices = variants
        .map(v => v.price)
        .filter((p): p is Prisma.Decimal | number => p != null)
        .map(p => Number(p));

    if (prices.length === 0) return null;
    return Math.min(...prices);
}
