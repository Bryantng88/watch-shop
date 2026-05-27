import { ImageRole } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { normalizeKey } from "@/server/lib/product-image-storage";
import {
    moveAndTrackMediaAsset,
    upsertMediaAssetRepo,
} from "@/domains/media/server";

export type AcquisitionInlineImageInput = {
    key?: string | null;
    url?: string | null;
};

export type AcquisitionChosenInlineImage = {
    key: string;
    fileKey: string;
    url: string;
    name?: string | null;
    sortOrder: number | null;
};

export function getAcquisitionInlineChosenPrefix(productId: string) {
    return `products/inline/chosen/watch/${productId}/inline`;
}

export function pickFirstAcquisitionInlineImage(
    images?: AcquisitionInlineImageInput[] | null
): AcquisitionInlineImageInput | null {
    if (!Array.isArray(images)) return null;

    return (
        images.find((image) => String(image?.key ?? "").trim()) ??
        images.find((image) => String(image?.url ?? "").trim()) ??
        null
    );
}

export async function moveAcquisitionInlineImageToChosen(input: {
    key: string;
    productId: string;
    acquisitionId: string;
    sortOrder?: number | null;
}): Promise<AcquisitionChosenInlineImage> {
    const key = normalizeKey(input.key);

    if (!key) {
        throw new Error("Media key không hợp lệ");
    }

    const targetPrefix = getAcquisitionInlineChosenPrefix(input.productId);

    if (key.startsWith(`${targetPrefix}/`)) {
        const asset = await upsertMediaAssetRepo(prisma as any, {
            key,
            status: "CHOSEN",
            productId: input.productId,
            acquisitionId: input.acquisitionId,
            role: ImageRole.INLINE,
            sortOrder: input.sortOrder ?? 0,
        });

        return {
            key: asset.key,
            fileKey: asset.key,
            url: `/api/media/sign?key=${encodeURIComponent(asset.key)}`,
            name: asset.fileName,
            sortOrder: asset.sortOrder,
        };
    }

    const moved = await moveAndTrackMediaAsset({
        fromKey: key,
        toPrefix: targetPrefix,
        deleteSource: true,
        overwrite: true,
        productId: input.productId,
        acquisitionId: input.acquisitionId,
        role: ImageRole.INLINE,
        status: "CHOSEN",
        sortOrder: input.sortOrder ?? 0,
    });

    return {
        key: moved.key,
        fileKey: moved.key,
        url: moved.url,
        name: moved.asset?.fileName ?? null,
        sortOrder: moved.asset?.sortOrder ?? input.sortOrder ?? 0,
    };
}

export async function syncInlineImageToProduct(input: {
    productId: string;
    key: string;
    sortOrder?: number | null;
}) {
    const key = normalizeKey(input.key);

    if (!key) {
        throw new Error("Inline image key không hợp lệ");
    }

    await prisma.product.update({
        where: { id: input.productId },
        data: {
            primaryImageUrl: key,
            storefrontImageKey: key,
        },
    });

    const existing = await prisma.productImage.findFirst({
        where: {
            productId: input.productId,
            role: ImageRole.INLINE,
            fileKey: key,
        },
        select: { id: true },
    });

    if (existing) {
        await prisma.productImage.update({
            where: { id: existing.id },
            data: {
                sortOrder: input.sortOrder ?? 0,
                isPrimary: true,
                isForAdmin: true,
                isForStorefront: true,
            },
        });
    } else {
        await prisma.productImage.create({
            data: {
                productId: input.productId,
                fileKey: key,
                role: ImageRole.INLINE,
                sortOrder: input.sortOrder ?? 0,
                isPrimary: true,
                isForAdmin: true,
                isForStorefront: true,
            },
        });
    }

    await prisma.productImage.updateMany({
        where: {
            productId: input.productId,
            role: ImageRole.INLINE,
            fileKey: { not: key },
        },
        data: {
            isPrimary: false,
        },
    });

    await upsertMediaAssetRepo(prisma as any, {
        key,
        status: "CHOSEN",
        productId: input.productId,
        role: ImageRole.INLINE,
        sortOrder: input.sortOrder ?? 0,
    });
    await prisma.productImage.deleteMany({
        where: {
            productId: input.productId,
            role: ImageRole.INLINE,
            fileKey: {
                startsWith: "products/inline/active/",
            },
        },
    });
    return key;
}

export async function attachInlineImageToAcquisitionWatchDraft(input: {
    acquisitionId: string;
    productId: string;
    image?: AcquisitionInlineImageInput | null;
    sortOrder?: number | null;
}) {
    try {
        const sourceKey = normalizeKey(input.image?.key ?? null);
        const fallbackUrl = String(input.image?.url ?? "").trim() || null;

        if (!sourceKey) {
            if (!fallbackUrl) return null;

            await prisma.product.update({
                where: { id: input.productId },
                data: {
                    primaryImageUrl: fallbackUrl,
                },
            });

            return {
                key: null,
                fileKey: null,
                url: fallbackUrl,
                name: null,
                sortOrder: input.sortOrder ?? 0,
            };
        }

        const moved = await moveAcquisitionInlineImageToChosen({
            key: sourceKey,
            productId: input.productId,
            acquisitionId: input.acquisitionId,
            sortOrder: input.sortOrder ?? 0,
        });

        await syncInlineImageToProduct({
            productId: input.productId,
            key: moved.key,
            sortOrder: input.sortOrder ?? 0,
        });

        return moved;
    } catch (error) {
        console.error("[INLINE_ATTACH_ERROR]", {
            acquisitionId: input.acquisitionId,
            productId: input.productId,
            imageKey: input.image?.key ?? null,
            imageUrl: input.image?.url ?? null,
            error,
        });

        return null;
    }
}

export async function rescueInlineImageFromMediaAsset(input: {
    productId: string;
}) {
    const asset = await prisma.mediaAsset.findFirst({
        where: {
            productId: input.productId,
            role: ImageRole.INLINE,
            status: "CHOSEN",
            isMissing: false,
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        select: {
            key: true,
            sortOrder: true,
        },
    });

    if (!asset?.key) {
        throw new Error("Không tìm thấy MediaAsset INLINE CHOSEN để cứu hình");
    }

    await syncInlineImageToProduct({
        productId: input.productId,
        key: asset.key,
        sortOrder: asset.sortOrder ?? 0,
    });

    return {
        productId: input.productId,
        key: asset.key,
    };
}