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
            return "W";
        case "WATCH_STRAP":
            return "ST";
        case "BOX":
            return "BX";
        case "ACCESSORIES":
            return "AC";
        case "PARTS":
            return "PT";
        case "SERVICE":
            return "SV";
        default:
            return "PR";
    }
}

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

export async function genUniqueProductSku(
    db: Tx,
    type?: ProductType | string | null,
    date?: Date
) {
    const now = date ?? new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = pad2(now.getMonth() + 1);
    const prefix = getProductSkuPrefix(type);
    const startsWith = `${prefix}-${yy}${mm}-`;

    const last = await db.product.findFirst({
        where: {
            sku: {
                startsWith,
            },
        },
        orderBy: {
            sku: "desc",
        },
        select: {
            sku: true,
        },
    });

    let nextNum = 1;

    if (last?.sku) {
        const match = String(last.sku).match(/-(\d+)$/);
        if (match?.[1]) {
            nextNum = Number(match[1]) + 1;
        }
    }

    return `${startsWith}${String(nextNum).padStart(4, "0")}`;
}

function toText(value: unknown) {
    if (value == null) return "";
    return String(value).trim();
}

function normalizeKey(value: unknown) {
    return toText(value).toUpperCase().replace(/\s+/g, "_");
}

function sentenceCase(value: string) {
    const raw = toText(value);
    if (!raw) return "";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function mapCaseMaterialLabel(value: unknown) {
    const key = normalizeKey(value);

    switch (key) {
        case "STAINLESS_STEEL":
        case "STEEL":
            return "Thép";
        case "GOLD":
            return "Vàng";
        case "GOLD_PLATED":
        case "PLAQUE":
        case "PLATED":
            return "Mạ vàng";
        case "TWO_TONE":
        case "STEEL_GOLD":
            return "Thép demi";
        case "TITANIUM":
            return "Titanium";
        case "SILVER":
            return "Bạc";
        case "BRONZE":
            return "Đồng";
        default:
            return sentenceCase(toText(value).toLowerCase().replace(/_/g, " "));
    }
}

function mapGlassLabel(value: unknown) {
    const raw = toText(value);
    const key = normalizeKey(value);

    switch (key) {
        case "SAPPHIRE":
            return "sapphire";
        case "MINERAL":
            return "mineral";
        case "ACRYLIC":
        case "PLEXI":
        case "PLEXIGLASS":
            return "acrylic";
        default:
            return raw ? raw.toLowerCase().replace(/_/g, " ") : "";
    }
}

function mapStrapMaterialLabel(value: unknown) {
    const key = normalizeKey(value);

    switch (key) {
        case "LEATHER":
            return "da";
        case "STEEL":
        case "STAINLESS_STEEL":
            return "thép";
        case "RUBBER":
            return "cao su";
        case "FABRIC":
        case "CANVAS":
        case "NYLON":
            return "vải";
        case "ALLIGATOR":
        case "CROCODILE":
            return "da cá sấu";
        default:
            return toText(value).toLowerCase().replace(/_/g, " ");
    }
}

function mapMovementLabel(value: unknown) {
    const raw = toText(value);
    const key = normalizeKey(value);

    switch (key) {
        case "AUTOMATIC":
        case "AUTO":
            return "automatic";
        case "QUARTZ":
            return "quartz";
        case "MANUAL":
        case "HANDWIND":
        case "HAND_WIND":
            return "lên cót tay";
        default:
            return raw ? raw.toLowerCase().replace(/_/g, " ") : "";
    }
}

function inferOriginalStrapAndClasp(product: any) {
    const ws = product?.watchSpecSnapshot ?? product?.watchSpec ?? null;
    const strapText = normalizeKey(ws?.strap);

    const hasStrap =
        ws?.hasStrap === true ||
        strapText.includes("ORIGINAL") ||
        strapText.includes("ZIN");

    const hasClasp =
        ws?.hasClasp === true ||
        strapText.includes("CLASP_ORIGINAL") ||
        strapText.includes("KHOA_ZIN") ||
        strapText.includes("ZIN");

    return {
        hasStrap,
        hasClasp,
    };
}

function inferInventoryStrap(product: any) {
    const firstVariant = product?.variants?.[0] ?? null;
    const variantName = toText(firstVariant?.name);

    if (variantName.startsWith("__STRAP_LINK__:")) {
        return true;
    }

    if (product?.linkedStrapVariantId || product?.linkedStrapProductId) {
        return true;
    }

    return false;
}

export function buildSpecBulletsFromProductABC(product: any): string[] {
    const ws = product?.watchSpecSnapshot ?? product?.watchSpec ?? null;
    const bullets: string[] = [];

    const brand =
        toText(product?.brand?.name) ||
        toText(product?.brandSnapshot) ||
        toText(product?.brand);

    const movementText = mapMovementLabel(ws?.movement);
    const caliber = toText(ws?.caliber);
    const caseMaterialText = mapCaseMaterialLabel(ws?.caseMaterial);
    const glassText = mapGlassLabel(ws?.glass);
    const dialColorText = toText(ws?.dialColor);
    const strapMaterialText = mapStrapMaterialLabel(ws?.strap);

    const { hasStrap, hasClasp } = inferOriginalStrapAndClasp(product);
    const isInventoryStrap = inferInventoryStrap(product);

    if (movementText) {
        if (brand && caliber) {
            bullets.push(
                `Bộ máy ${movementText} chính hãng ${brand} (Caliber ${caliber}).`
            );
        } else if (brand) {
            bullets.push(`Bộ máy ${movementText} chính hãng ${brand}.`);
        } else if (caliber) {
            bullets.push(`Bộ máy ${movementText} (Caliber ${caliber}).`);
        } else {
            bullets.push(`Bộ máy ${movementText}.`);
        }
    } else if (caliber) {
        bullets.push(`Caliber ${caliber}.`);
    }

    const sizeParts = [
        ws?.width ? `${ws.width}mm` : null,
        ws?.thickness ? `dày ${ws.thickness}mm` : null,
    ]
        .filter(Boolean)
        .join(", ");

    if (sizeParts) {
        bullets.push(`Kích thước ${sizeParts}.`);
    }

    if (caseMaterialText) {
        bullets.push(`Vỏ ${caseMaterialText}.`);
    }

    if (glassText) {
        bullets.push(`Kính ${glassText}.`);
    }

    if (dialColorText) {
        bullets.push(`Mặt số ${dialColorText}.`);
    }

    if (ws?.dialCondition) {
        bullets.push(`Tình trạng mặt số ${toText(ws.dialCondition)}.`);
    }

    if (strapMaterialText) {
        if (isInventoryStrap) {
            bullets.push(`Dây khóa ${strapMaterialText} thay mới từ kho.`);
        } else if (hasStrap && hasClasp) {
            bullets.push(`Dây khóa ${strapMaterialText} zin theo đồng hồ.`);
        } else if (hasStrap) {
            bullets.push(`Dây ${strapMaterialText} zin theo đồng hồ.`);
        } else {
            bullets.push(`Dây ${strapMaterialText}.`);
        }
    }

    return bullets;
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