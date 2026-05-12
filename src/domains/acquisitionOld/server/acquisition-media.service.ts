import { randomUUID } from "crypto";
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

    if (key.startsWith(`${targetPrefix}/`) || key === targetPrefix) {
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
        overwrite: false,
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

export async function attachInlineImageToAcquisitionWatchDraft(input: {
    acquisitionId: string;
    productId: string;
    image?: AcquisitionInlineImageInput | null;
    sortOrder?: number | null;
}) {
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

    await prisma.$transaction(async (tx) => {
        await tx.product.update({
            where: { id: input.productId },
            data: {
                primaryImageUrl: moved.url,
                storefrontImageKey: moved.key,
            },
        });

        await tx.productImage.deleteMany({
            where: {
                productId: input.productId,
                role: ImageRole.INLINE,
                isPrimary: true,
            },
        });

        await tx.productImage.create({
            data: {
                id: randomUUID(),
                productId: input.productId,
                fileKey: moved.key,
                role: ImageRole.INLINE,
                sortOrder: input.sortOrder ?? 0,
                isPrimary: true,
                isForAdmin: true,
                isForStorefront: true,
            },
        });
    });

    return moved;
}
