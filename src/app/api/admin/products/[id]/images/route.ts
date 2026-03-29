import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { ImageRole } from "@prisma/client";
import {
    PRODUCT_INLINE_CHOSEN_PREFIX,
    PRODUCT_INLINE_PREFIX,
    buildInlineActiveKeyFromChosen,
    buildInlineChosenKey,
    isWithinPrefix,
    moveMediaObject,
    normalizeKey,
} from "@/server/lib/product-image-storage";

type Body = { files: { key: string; alt?: string }[] };

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: productId } = await params;
    const body = (await req.json()) as Body;

    if (!Array.isArray(body.files) || body.files.length === 0) {
        return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const normalizedFiles = body.files
        .map((f) => ({ ...f, key: normalizeKey(f.key) }))
        .filter((f) => !!f.key);

    if (!normalizedFiles.length) {
        return NextResponse.json({ error: "No valid files" }, { status: 400 });
    }

    const currentProduct = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            primaryImageUrl: true,
            image: {
                where: { role: ImageRole.COVER },
                select: { id: true, fileKey: true },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                take: 1,
            },
        },
    });

    if (!currentProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const picked = normalizedFiles[0];
    const previousCoverKey = normalizeKey(
        currentProduct.primaryImageUrl ?? currentProduct.image[0]?.fileKey ?? null
    );

    let coverKey = picked.key;
    if (isWithinPrefix(picked.key, PRODUCT_INLINE_PREFIX)) {
        coverKey = buildInlineChosenKey(productId, picked.key);
    }

    const shouldMovePickedIntoChosen = coverKey !== picked.key;
    const shouldRestorePreviousToActive =
        !!previousCoverKey &&
        previousCoverKey !== coverKey &&
        isWithinPrefix(previousCoverKey, PRODUCT_INLINE_CHOSEN_PREFIX);

    let movedPickedIntoChosen = false;
    let restoreWarning: string | null = null;

    try {
        if (shouldMovePickedIntoChosen) {
            await moveMediaObject(picked.key, coverKey);
            movedPickedIntoChosen = true;
        }

        await prisma.$transaction(async (tx) => {
            await tx.productImage.deleteMany({
                where: { productId, role: ImageRole.COVER },
            });

            await tx.productImage.create({
                data: {
                    productId,
                    fileKey: coverKey,
                    alt: picked.alt ?? null,
                    role: ImageRole.COVER,
                    sortOrder: 0,
                },
            });

            await tx.product.update({
                where: { id: productId },
                data: { primaryImageUrl: coverKey },
            });
        });
    } catch (error) {
        if (movedPickedIntoChosen) {
            try {
                await moveMediaObject(coverKey, picked.key);
            } catch (rollbackError) {
                console.error("rollback inline image move failed", rollbackError);
            }
        }
        throw error;
    }

    if (shouldRestorePreviousToActive && previousCoverKey) {
        const restoredKey = buildInlineActiveKeyFromChosen(previousCoverKey);
        try {
            await moveMediaObject(previousCoverKey, restoredKey);
        } catch (error: any) {
            console.error("restore previous inline image failed", {
                productId,
                previousCoverKey,
                restoredKey,
                error,
            });
            restoreWarning = error?.message ?? "Không thể trả ảnh cũ về thư mục active";
        }
    }

    return NextResponse.json({
        ok: true,
        coverImageUrl: coverKey,
        primaryImageUrl: coverKey,
        fileKey: coverKey,
        movedToChosen: shouldMovePickedIntoChosen,
        restoredPreviousToActive: shouldRestorePreviousToActive && !restoreWarning,
        warning: restoreWarning,
    });
}
