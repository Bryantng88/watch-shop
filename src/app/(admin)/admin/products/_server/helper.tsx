// src/features/products/admin/server/_helpers.ts
import { Prisma, CaseType, ProductType, Gender, MovementType } from "@prisma/client";
import slugify from "slugify";
import { Tx } from "@/server/db/client";

export async function genUniqueSlug(db: Tx, title: string) {
    const base = slugify(title, { lower: true, strict: true });
    let slug = base;
    let i = 1;
    while (await db.product.findUnique({ where: { slug } })) {
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

    if (isRound && Number.isFinite(L)) {
        if (L < 33) return "Small";
        if (L < 39) return "Medium";
        return "Large";
    }
    if (!isRound && Number.isFinite(L)) {
        if (L < 33) return "Small";
        if (L < 35) return "Medium";
        return "Large";
    }
    return undefined;
}

export function buildWatchSpec(dto: any) {
    if ((dto.type ?? "WATCH").toUpperCase() !== "WATCH") return undefined;

    const caseType: CaseType =
        (dto.caseType as CaseType) ?? CaseType.ROUND;
    const compIds: string[] =
        Array.isArray(dto.complicationIds) ? dto.complicationIds :
            Array.isArray(dto.complications) ? dto.complications : [];
    const length = dto.length != null ? Number(dto.length) : 46.5;
    const width = dto.width != null ? Number(dto.width) : 39.7;
    const thickness = dto.thickness != null ? Number(dto.thickness) : 12.0;
    const gender: Gender =
        (dto.gender as Gender) ?? Gender.MEN;
    const movement: MovementType =
        (dto.movement as MovementType) ?? MovementType.AUTOMATIC;
    return {
        create: {
            caseType,
            length,
            width,
            gender,
            movement,
            complication:
                compIds.length
                    ? {
                        connect: compIds.map((id: string) => ({ id })),
                    }
                    : undefined,
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
                availabilityStatus: "HIDDEN",
                sku: skuBase,
            },
        ],
    } satisfies Prisma.ProductVariantCreateNestedManyWithoutProductInput;
}

export function toPublicUrl(key?: string | null): string | undefined {
    if (!key) return undefined;
    const base = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE;
    if (!base) return undefined;

    // bỏ slash dư, encode tên file (giữ nguyên dấu '/')
    const cleaned = String(key).replace(/^\/+/, '');
    return `${base.replace(/\/$/, '')}/${encodeURI(cleaned)}`;
}


