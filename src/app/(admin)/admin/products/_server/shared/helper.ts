// src/features/products/admin/server/_helpers.ts
import { Prisma, CaseType, ProductType, Gender, MovementType } from "@prisma/client";
import slugify from "slugify";
import { Tx } from "@/server/db/client";


export type AdminSort =
    | "updatedDesc" | "updatedAsc"
    | "createdDesc" | "createdAsc"
    | "titleAsc" | "titleDesc";

export interface AdminProductFilters {
    page?: number;
    pageSize?: number;
    q?: string;

    //sstatus?: Prisma.ProductWhereInput["status"][]; // ['ACTIVE','DRAFT','INACTIVE']
    type?: Prisma.ProductWhereInput["type"][];     // ['PRE_OWNED',...]
    brandIds?: string[];
    hasImages?: "yes" | "no";
    updatedFrom?: Date | string;
    updatedTo?: Date | string;
    sort?: AdminSort;
}

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


export function buildWhere(f: AdminProductFilters): Prisma.ProductWhereInput {
    return {
        ...(f.q
            ? {
                OR: [
                    { title: { contains: f.q, mode: "insensitive" } },
                    { slug: { contains: f.q, mode: "insensitive" } },
                    { seoTitle: { contains: f.q, mode: "insensitive" } },
                ],
            }
            : {}),
        // ...(f.status?.length ? { status: { in: f.status as any } } : {}),
        ...(f.type?.length ? { type: { in: f.type as any } } : {}),
        ...(f.brandIds?.length ? { brandId: { in: f.brandIds } } : {}),
        ...(f.hasImages === "yes" ? { primaryImageUrl: { not: null } } : {}),
        ...(f.hasImages === "no" ? { primaryImageUrl: null } : {}),
        ...(f.updatedFrom || f.updatedTo
            ? {
                updatedAt: {
                    ...(f.updatedFrom ? { gte: new Date(f.updatedFrom) } : {}),
                    ...(f.updatedTo ? { lte: new Date(f.updatedTo) } : {}),
                },
            }
            : {}),
    };
}

export function buildOrderBy(sort: AdminSort | undefined): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
        case "updatedAsc": return [{ updatedAt: "asc" }];
        case "updatedDesc": return [{ updatedAt: "desc" }];
        case "createdAsc": return [{ createdAt: "asc" }];
        case "createdDesc": return [{ createdAt: "desc" }];
        case "titleAsc": return [{ title: "asc" }];
        case "titleDesc": return [{ title: "desc" }];
        default: return [{ updatedAt: "desc" }];
    }
}


export function getProductSkuPrefix(type?: ProductType | string | null) {
    switch (String(type ?? "WATCH").toUpperCase()) {
        case "WATCH":
            return "WAT";
        case "WATCH_STRAP":
            return "STR";
        case "BOX":
            return "BOX";
        case "ACCESSORIES":
            return "ACC";
        case "PARTS":
            return "PAR";
        case "SERVICE":
            return "SER";
        default:
            return "PRD";
    }
}

function normalizeSkuHead(input: string | null | undefined, fallback: string) {
    const raw = String(input ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

    if (!raw) return fallback;
    return raw.slice(0, 3).padEnd(3, "X");
}

export async function genUniqueProductSku(
    db: Tx,
    input: {
        type?: ProductType | string | null;
        brandName?: string | null;
        date?: Date;
    }
) {
    const now = input.date ?? new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");

    const type = String(input.type ?? "WATCH").toUpperCase();
    const head =
        type === "WATCH"
            ? normalizeSkuHead(input.brandName, "WAT")
            : normalizeSkuHead(getProductSkuPrefix(type), "PRD");

    const startsWith = `${head}-${yy}${mm}-`;

    const last = await db.product.findFirst({
        where: { sku: { startsWith } },
        orderBy: { sku: "desc" },
        select: { sku: true },
    });

    let nextNum = 1;
    if (last?.sku) {
        const match = String(last.sku).match(/-(\d+)$/);
        if (match?.[1]) nextNum = Number(match[1]) + 1;
    }

    return `${startsWith}${String(nextNum).padStart(4, "0")}`;
}


export function buildHashtagsFromProduct(product: any): string[] {
    const tags = new Set<string>();

    if (product?.sku) {
        tags.add(`#${String(product.sku).replace(/\s+/g, '')}`);
    }

    if (product?.brand) {
        tags.add(`#${String(product.brand).replace(/\s+/g, '')}`);
    }

    if (product?.watchSpecSnapshot?.model) {
        tags.add(`#${String(product.watchSpecSnapshot.model).replace(/\s+/g, '')}`);
    }

    tags.add('#vintagewatch');

    return Array.from(tags);
}


export function buildSpecBulletsFromProductABC(product: any): string[] {
    const ws = product?.watchSpecSnapshot ?? product?.watchSpec ?? null;
    const bullets: string[] = [];

    if (ws?.movement) bullets.push(`Bộ máy ${String(ws.movement).toLowerCase()}.`);
    if (ws?.caliber) bullets.push(`Caliber ${ws.caliber}.`);

    const sizeParts = [ws?.width ? `${ws.width}mm` : null, ws?.thickness ? `dày ${ws.thickness}mm` : null]
        .filter(Boolean)
        .join(', ');
    if (sizeParts) bullets.push(`Kích thước ${sizeParts}.`);

    if (ws?.caseMaterial) bullets.push(`Vỏ ${String(ws.caseMaterial).toLowerCase()}.`);
    if (ws?.glass) bullets.push(`Kính ${String(ws.glass).toLowerCase()}.`);
    if (ws?.dialColor) bullets.push(`Mặt số ${ws.dialColor}.`);
    if (ws?.dialCondition) bullets.push(`Tình trạng dial: ${ws.dialCondition}.`);
    if (ws?.strap) bullets.push(`Dây ${String(ws.strap).toLowerCase()}.`);

    return bullets
}