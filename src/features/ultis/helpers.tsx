// src/features/products/admin/server/_helpers.ts
import { Prisma, CaseType, ProductType } from "@prisma/client";
import slugify from "slugify";

export async function genUniqueSlug(tx: Prisma.TransactionClient, title: string) {
    const base = slugify(title, { lower: true, strict: true }) || "item";
    let slug = base;
    let i = 1;
    // dùng findFirst thay vì findUnique để an toàn migration cũ
    while (await tx.product.findFirst({ where: { slug }, select: { id: true } })) {
        slug = `${base}-${i++}`;
    }
    return slug;
}

export function buildSizeCategory(
    caseType: CaseType,
    length?: number | null,
    width?: number | null
) {
    const L = Number(length ?? NaN);
    const W = Number(width ?? NaN);
    const isRound = caseType === "ROUND";

    if (isRound && Number.isFinite(W)) {
        if (W < 33) return "Small";
        if (W < 39) return "Medium";
        return "Large";
    }
    if (!isRound && Number.isFinite(W)) {
        if (W < 33) return "Small";
        if (W < 35) return "Medium";
        return "Large";
    }
    return undefined;
}

export function buildWatchSpec(dto: any) {
    if ((dto.type ?? "WATCH").toUpperCase() !== "WATCH") return undefined;

    const caseType: CaseType =
        (dto.caseType as CaseType) ?? CaseType.ROUND;

    const length = dto.length != null ? Number(dto.length) : 46.5;
    const width = dto.width != null ? Number(dto.width) : 39.7;
    const thickness = dto.thickness != null ? Number(dto.thickness) : 12.0;

    return {
        create: {
            caseType,
            length,
            width,
            thickness,
            sizeCategory: buildSizeCategory(caseType, length, width),
        },
    } satisfies Prisma.WatchSpecCreateNestedOneWithoutProductInput;
}

export function buildVariants(dto: any, skuBase: string) {
    // SINGLE: 1 variant – sku=slug
    // Nếu sau này có nhiều variant, có thể lặp & thêm hậu tố
    const price = dto.price != null ? Number(dto.price) : 0;
    const stockQty = dto.stockQty != null ? Number(dto.stockQty) : 1;

    return {
        create: [
            {
                price,
                stockQty,
                isActive: true,
                sku: skuBase,
            },
        ],
    } satisfies Prisma.ProductVariantCreateNestedManyWithoutProductInput;
}
