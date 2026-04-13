import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import * as prodRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

function sanitizeObject(input: Record<string, any> | null | undefined) {
    if (!input) return undefined;
    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
        if (value === undefined) continue;
        out[key] = value;
    }
    return Object.keys(out).length ? out : undefined;
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));
        const product = sanitizeObject(body?.product);
        const watchSpec = sanitizeObject(body?.watchSpec);
        const variant = sanitizeObject(body?.variant);
        const images = Array.isArray(body?.images) ? body.images : undefined;
        const baseVariantCostPrice =
            body?.baseVariantCostPrice === "" || body?.baseVariantCostPrice == null
                ? undefined
                : Number(body.baseVariantCostPrice);

        const result = await prisma.$transaction(async (tx) => {
            if (product) {
                await prodRepo.updateProduct(tx, id, product as any);
            }

            if (watchSpec || Array.isArray(body?.complicationIds)) {
                await prodRepo.upsertWatchSpecForAdmin(tx, id, {
                    watchSpec,
                    complicationIds: Array.isArray(body?.complicationIds)
                        ? body.complicationIds
                        : watchSpec?.complicationIds,
                });
            }

            if (images) {
                await prodRepo.replaceProductImages(
                    tx,
                    id,
                    images.map((img: any, index: number) => ({
                        fileKey: String(img?.fileKey ?? "").trim(),
                        alt: img?.alt ?? null,
                        sortOrder: img?.sortOrder ?? index,
                    }))
                );
            }

            if (variant || baseVariantCostPrice !== undefined) {
                const latest = await prodRepo.getLatestVariantForAdmin(tx, id);

                await prodRepo.upsertPrimaryVariantForAdmin(tx, id, {
                    id: variant?.id ?? latest?.id ?? undefined,
                    ...(variant?.price !== undefined ? { price: Number(variant.price) } : {}),
                    ...(baseVariantCostPrice !== undefined
                        ? { costPrice: baseVariantCostPrice }
                        : {}),
                });
            }

            return prodRepo.getAdminProductDetail(tx, id);
        });

        return NextResponse.json({ ok: true, product: result });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Update product failed" },
            { status: 500 }
        );
    }
}
