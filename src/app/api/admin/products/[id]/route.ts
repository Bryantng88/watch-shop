import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import * as adminProductService from "@/app/(admin)/admin/products/_server/product.service";
import * as prodRepo from "@/app/(admin)/admin/products/_server/product.repo";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

type Ctx = { params: Promise<{ id: string }> };

const STRAP_ATTACHMENT_PREFIX = "__STRAP_LINK__:";

const ImageInputSchema = z.object({
    fileKey: z.string().min(1),
    alt: z.string().nullable().optional(),
    sortOrder: z.number().int().nullable().optional(),
});

const StrapAttachmentSchema = z.object({
    productId: z.string().min(1),
    variantId: z.string().min(1),
    title: z.string().nullish().optional(),
    vendorName: z.string().nullish().optional(),
    costPrice: z.number().nullish().optional(),
    price: z.number().nullish().optional(),
    strapSpec: z
        .object({
            lugWidthMM: z.number().nullish().optional(),
            buckleWidthMM: z.number().nullish().optional(),
            color: z.string().nullish().optional(),
            material: z.string().nullish().optional(),
            quickRelease: z.boolean().nullish().optional(),
        })
        .nullish()
        .optional(),
});

const PatchBodySchema = z.object({
    minPrice: z.number().nullish().optional(),
    salePrice: z.number().nullish().optional(),
    baseVariantCostPrice: z.number().nullish().optional(),
    strapAttachment: StrapAttachmentSchema.nullish().optional(),
    product: z
        .object({
            title: z.string().optional(),
            brandId: z.string().nullish(),
            vendorId: z.string().nullish(),
            status: z.string().optional(),
            type: z.string().optional(),
            categoryId: z.string().nullish(),
            description: z.string().nullish().optional(),
            primaryImageUrl: z.string().nullish().optional(),
            seoDescription: z.string().nullish().optional(),
            tag: z.string().nullish().optional(),
        })
        .partial()
        .optional(),
    watchSpec: z
        .object({
            ref: z.string().nullish().optional(),
            model: z.string().nullish().optional(),
            year: z.union([z.string(), z.number()]).nullish().optional(),
            caseType: z.string().nullish().optional(),
            gender: z.string().nullish().optional(),
            movement: z.string().nullish().optional(),
            caliber: z.string().nullish().optional(),
            caseMaterial: z.string().nullish().optional(),
            goldKarat: z.union([z.string(), z.number()]).nullish().optional(),
            goldColor: z.string().nullish().optional(),
            length: z.union([z.string(), z.number()]).nullish().optional(),
            width: z.union([z.string(), z.number()]).nullish().optional(),
            thickness: z.union([z.string(), z.number()]).nullish().optional(),
            strap: z.string().nullish().optional(),
            glass: z.string().nullish().optional(),
            boxIncluded: z.boolean().optional(),
            bookletIncluded: z.boolean().optional(),
            cardIncluded: z.boolean().optional(),
            hasStrap: z.boolean().optional(),
            isServiced: z.boolean().optional(),
            hasClasp: z.boolean().optional(),
            isSpa: z.boolean().optional(),
            complicationIds: z.array(z.string()).optional(),
        })
        .partial()
        .optional(),
    variant: z
        .object({
            id: z.string().optional(),
            name: z.string().nullish().optional(),
            price: z.number().nullish().optional(),
            salePrice: z.number().nullish().optional(),
            costPrice: z.number().nullish().optional(),
            stockQty: z.number().nullish().optional(),
            availabilityStatus: z.string().nullish().optional(),
        })
        .partial()
        .optional(),
    images: z.array(ImageInputSchema).optional(),
});

type StrapAttachment = z.infer<typeof StrapAttachmentSchema>;
type StoredStrapAttachment = StrapAttachment & { baseName?: string | null };

function hasKeys(value: unknown) {
    return !!value && typeof value === "object" && Object.keys(value as Record<string, unknown>).length > 0;
}

function toNullableNumber(value: unknown) {
    if (value == null || value === "") return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function parseStoredStrapAttachment(raw: string | null | undefined): StoredStrapAttachment | null {
    if (!raw || !raw.startsWith(STRAP_ATTACHMENT_PREFIX)) return null;

    try {
        const parsed = JSON.parse(raw.slice(STRAP_ATTACHMENT_PREFIX.length));
        if (!parsed || typeof parsed !== "object") return null;
        if (!parsed.variantId || !parsed.productId) return null;
        return parsed as StoredStrapAttachment;
    } catch {
        return null;
    }
}

function encodeStoredStrapAttachment(value: StoredStrapAttachment) {
    return `${STRAP_ATTACHMENT_PREFIX}${JSON.stringify(value)}`;
}

async function syncInventoryStrapAttachment(tx: any, productId: string, patch: z.infer<typeof PatchBodySchema>) {
    const latestVariant = await prodRepo.getLatestVariantForAdmin(tx, productId);
    const existingAttachment = parseStoredStrapAttachment(latestVariant?.name ?? null);
    const baseVariantName = existingAttachment?.baseName ?? (latestVariant?.name ?? null);
    const currentCostPrice = toNullableNumber(latestVariant?.costPrice);
    const previousStrapCost = toNullableNumber(existingAttachment?.costPrice) ?? 0;
    const acquisitionBaseCost = toNullableNumber(latestVariant?.acquisitionItem?.[0]?.unitCost);
    const derivedBaseCost =
        currentCostPrice != null
            ? Math.max(currentCostPrice - previousStrapCost, 0)
            : acquisitionBaseCost;

    let resolvedCostPrice = patch.variant?.costPrice;
    let resolvedVariantName = patch.variant?.name;

    if (patch.strapAttachment === undefined) {
        return {
            variantPatch: {
                ...(patch.variant ?? {}),
                ...(resolvedVariantName !== undefined ? { name: resolvedVariantName } : {}),
            },
        };
    }

    const nextAttachment = patch.strapAttachment;
    const prevVariantId = existingAttachment?.variantId ?? null;
    const nextVariantId = nextAttachment?.variantId ?? null;

    if (prevVariantId && prevVariantId !== nextVariantId) {
        await tx.productVariant.update({
            where: { id: prevVariantId },
            data: {
                stockQty: { increment: 1 },
                updatedAt: new Date(),
            },
        });
    }

    let storedAttachment: StoredStrapAttachment | null = null;

    if (nextAttachment?.variantId) {
        if (nextVariantId === prevVariantId && existingAttachment) {
            storedAttachment = {
                ...existingAttachment,
                baseName: baseVariantName,
            };
        } else {
            const strapVariant = await tx.productVariant.findUnique({
                where: { id: nextAttachment.variantId },
                select: {
                    id: true,
                    productId: true,
                    stockQty: true,
                    costPrice: true,
                    price: true,
                    product: {
                        select: {
                            id: true,
                            title: true,
                            type: true,
                            vendor: { select: { name: true } },
                        },
                    },
                    strapSpec: {
                        select: {
                            lugWidthMM: true,
                            buckleWidthMM: true,
                            color: true,
                            material: true,
                            quickRelease: true,
                        },
                    },
                },
            });

            if (!strapVariant?.id || strapVariant.product?.type !== "WATCH_STRAP") {
                throw new Error("Dây được chọn không hợp lệ hoặc không còn tồn tại.");
            }

            if (Number(strapVariant.stockQty ?? 0) <= 0) {
                throw new Error("Dây trong kho đã hết tồn, không thể gắn vào sản phẩm.");
            }

            await tx.productVariant.update({
                where: { id: strapVariant.id },
                data: {
                    stockQty: { decrement: 1 },
                    updatedAt: new Date(),
                },
            });

            storedAttachment = {
                baseName: baseVariantName,
                productId: strapVariant.productId,
                variantId: strapVariant.id,
                title: strapVariant.product?.title ?? nextAttachment.title ?? null,
                vendorName: strapVariant.product?.vendor?.name ?? nextAttachment.vendorName ?? null,
                costPrice: toNullableNumber(strapVariant.costPrice),
                price: toNullableNumber(strapVariant.price),
                strapSpec: strapVariant.strapSpec
                    ? {
                        lugWidthMM: toNullableNumber(strapVariant.strapSpec.lugWidthMM),
                        buckleWidthMM: toNullableNumber(strapVariant.strapSpec.buckleWidthMM),
                        color: strapVariant.strapSpec.color ?? null,
                        material: strapVariant.strapSpec.material ?? null,
                        quickRelease: strapVariant.strapSpec.quickRelease ?? null,
                    }
                    : null,
            };
        }

        const strapAddedCost = toNullableNumber(storedAttachment?.costPrice) ?? 0;
        const baseCost = patch.baseVariantCostPrice ?? derivedBaseCost;
        if (resolvedCostPrice === undefined && (baseCost != null || strapAddedCost != null)) {
            resolvedCostPrice = Number(baseCost ?? 0) + Number(strapAddedCost ?? 0);
        }
        resolvedVariantName = encodeStoredStrapAttachment(storedAttachment);
    } else {
        const baseCost = patch.baseVariantCostPrice ?? derivedBaseCost;
        if (resolvedCostPrice === undefined && baseCost != null) {
            resolvedCostPrice = Number(baseCost);
        }
        resolvedVariantName = baseVariantName ?? null;
    }

    return {
        variantPatch: {
            ...(patch.variant ?? {}),
            name: resolvedVariantName,
            costPrice: resolvedCostPrice,
            id: patch.variant?.id ?? latestVariant?.id ?? undefined,
        },
    };
}

export async function GET(_req: NextRequest, ctx: Ctx) {
    try {
        const { id } = await ctx.params;
        const data = await adminProductService.detail(id);

        if (!data) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 400 });
    }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const body = await req.json();
        const patch = PatchBodySchema.parse(body);

        const updated = await prisma.$transaction(async (tx) => {
            if (hasKeys(patch.product)) {
                const product = patch.product!;
                const data: any = {};

                if (product.title !== undefined) data.title = product.title;
                if (product.description !== undefined) data.description = product.description || null;
                if (product.status !== undefined) data.status = product.status as any;
                if (product.type !== undefined) data.type = product.type as any;
                if (product.primaryImageUrl !== undefined) data.primaryImageUrl = product.primaryImageUrl || null;
                if (product.seoDescription !== undefined) data.seoDescription = product.seoDescription || null;
                if (product.tag !== undefined) data.tag = product.tag || null;
                if (product.brandId !== undefined) {
                    data.brand = product.brandId ? { connect: { id: product.brandId } } : { disconnect: true };
                }
                if (product.vendorId !== undefined) {
                    data.vendor = product.vendorId ? { connect: { id: product.vendorId } } : { disconnect: true };
                }
                if (product.categoryId !== undefined) {
                    data.ProductCategory = product.categoryId
                        ? { connect: { id: product.categoryId } }
                        : { disconnect: true };
                }

                if (Object.keys(data).length) {
                    await prodRepo.updateProduct(tx, id, data);
                }
            }

            if (patch.images !== undefined) {
                await prodRepo.replaceProductImages(tx, id, patch.images);
            }

            if (hasKeys(patch.watchSpec)) {
                const watchSpec = patch.watchSpec!;
                const { complicationIds, ...watchSpecFields } = watchSpec;
                await prodRepo.upsertWatchSpecForAdmin(tx, id, {
                    watchSpec: watchSpecFields,
                    complicationIds,
                });
            }

            const hasLegacyVariantFields = patch.minPrice !== undefined || patch.salePrice !== undefined;
            const hasAnyVariantChange = hasKeys(patch.variant) || hasLegacyVariantFields || patch.strapAttachment !== undefined;

            if (hasAnyVariantChange) {
                const synced = await syncInventoryStrapAttachment(tx, id, patch);
                const variant = synced.variantPatch ?? patch.variant ?? {};

                await prodRepo.upsertPrimaryVariantForAdmin(tx, id, {
                    id: variant.id,
                    name: variant.name ?? undefined,
                    price: variant.price ?? patch.minPrice ?? undefined,
                    salePrice: variant.salePrice ?? patch.salePrice ?? undefined,
                    costPrice: variant.costPrice ?? undefined,
                    stockQty: variant.stockQty ?? undefined,
                    availabilityStatus: variant.availabilityStatus as any,
                });
            }

            return { success: true };
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (err: any) {
        console.error("PATCH /api/admin/products/:id failed:", err);
        const message = err?.issues ? JSON.stringify(err.issues) : err?.message ?? "Unexpected error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_DELETE);
    if (auth instanceof Response) return auth;

    try {
        const { id } = await ctx.params;
        const result = await adminProductService.remove(id);
        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Failed to delete" }, { status: 400 });
    }
}
