import { prisma } from "@/server/db/client";
import { markGalleryMediaAssetsAttached } from "@/domains/media/server";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";

import type { WatchFormValues } from "../client/form/watch-form.types";
import { replaceWatchGalleryImagesRepo } from "../server/media";
import {
    moveWatchGalleryImagesToChosen,
    moveWatchPoolImagesToChosenPool,
    releaseRemovedWatchPoolImagesToActive,
} from "../server/media";
import { updateWatchPricingWithDiff } from "../server/pricing";
import { resetWatchReviewToDraft } from "../server/review";
import {
    WatchFormEnums,
    dedupeMediaItems,
    mediaKey,
    normalizeArray,
    normalizeImageKeys,
    normalizeText,
    pickEnumOrDefault,
    pickEnumOrNull,
    pickEnumOrUndefined,
    pickGoldColors,
    sameJson,
    textOrUndefined,
    toDecimal,
} from "../server/shared";

type SubmitWatchFormContext = {
    userId?: string | null;
    canReviewContent: boolean;
};

function buildContentSnapshot(input: {
    titleOverride?: string | null;
    hookText?: string | null;
    body?: string | null;
    bulletSpecs?: unknown[] | null;
    hashTags?: string | null;
}) {
    return {
        titleOverride: normalizeText(input.titleOverride),
        hookText: normalizeText(input.hookText),
        body: normalizeText(input.body),
        bulletSpecs: normalizeArray(input.bulletSpecs as any),
        hashTags: normalizeText(input.hashTags),
    };
}

function hasContentSnapshotData(
    content: ReturnType<typeof buildContentSnapshot>,
) {
    return (
        Boolean(content.titleOverride) ||
        Boolean(content.hookText) ||
        Boolean(content.body) ||
        Boolean(content.hashTags) ||
        content.bulletSpecs.length > 0
    );
}

export async function submitWatchFormApplication(
    values: WatchFormValues,
    context: SubmitWatchFormContext,
) {
    const productId = values.productId;

    const current = await prisma.watch.findUnique({
        where: { productId },
        include: {
            product: {
                include: {
                    productImage: {
                        where: { role: "GALLERY" as any },
                        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    },
                },
            },
            watchSpecV2: true,
            watchContent: true,
            reviewStates: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy watch.");
    }

    const beforeContent = buildContentSnapshot({
        titleOverride: current.watchContent?.titleOverride,
        hookText: current.watchContent?.hookText,
        body: current.watchContent?.body,
        bulletSpecs: current.watchContent?.bulletSpecs as any,
        hashTags: (current.watchContent as any)?.hashTags,
    });

    const afterContent = buildContentSnapshot(values.content);

    const beforeImageKeys = normalizeImageKeys(
        current.product.productImage.map((x: any) => ({ key: x.fileKey })),
    );

    const requestedPoolImages = dedupeMediaItems(values.media.poolImages ?? []);
    const requestedGalleryImages = dedupeMediaItems(
        values.media.galleryImages ?? [],
    );
    const afterImageKeysBeforeMove = normalizeImageKeys(requestedGalleryImages);

    const contentChanged = !sameJson(beforeContent, afterContent);
    const imagesChanged = !sameJson(beforeImageKeys, afterImageKeysBeforeMove);

    const contentReviewStatus = String(
        current.reviewStates.find((item: any) => item.targetType === "CONTENT")
            ?.status ?? "DRAFT",
    ).toUpperCase();
    const imageReviewStatus = String(
        current.reviewStates.find((item: any) => item.targetType === "IMAGE")
            ?.status ?? "DRAFT",
    ).toUpperCase();

    if (contentChanged && contentReviewStatus === "APPROVED") {
        throw new Error(
            "Nội dung đã được duyệt. Admin cần bấm Mở chỉnh sửa để chuyển về Draft trước khi lưu thay đổi.",
        );
    }

    if (imagesChanged && imageReviewStatus === "APPROVED") {
        throw new Error(
            "Hình ảnh đã được duyệt. Admin cần bấm Mở chỉnh sửa để chuyển về Draft trước khi lưu thay đổi.",
        );
    }

    await prisma.$transaction(async (tx) => {
        const brand = values.basic.brandId
            ? await tx.brand.findUnique({
                where: { id: values.basic.brandId },
                select: { id: true, name: true },
            })
            : null;

        if (values.basic.brandId && !brand) {
            throw new Error("Brand không hợp lệ.");
        }

        await tx.product.update({
            where: { id: productId },
            data: {
                title: textOrUndefined(values.basic.title),
                slug: textOrUndefined(values.basic.slug),
                sku: textOrUndefined(values.header.sku),
                brand: values.basic.brandId
                    ? { connect: { id: values.basic.brandId } }
                    : { disconnect: true },
                vendor: values.basic.vendorId
                    ? { connect: { id: values.basic.vendorId } }
                    : { disconnect: true },
                productCategory: values.basic.categoryId
                    ? { connect: { id: values.basic.categoryId } }
                    : { disconnect: true },
            },
        });

        await tx.watch.update({
            where: { id: current.id },
            data: {
                gender: pickEnumOrUndefined(values.basic.gender, WatchFormEnums.Gender),
                style: pickEnumOrNull(values.basic.style, WatchFormEnums.WatchStyle),
                siteChannel: pickEnumOrUndefined(
                    values.basic.siteChannel,
                    WatchFormEnums.WatchSiteChannel,
                ),
                conditionGrade: values.basic.conditionGrade || null,
                movementType: pickEnumOrNull(
                    values.basic.movementType,
                    WatchFormEnums.MovementType,
                ),
                movementCalibre: values.basic.movementCalibre || null,
                serialNumber: values.basic.serialNumber || null,
                yearText: values.basic.yearText || null,
            },
        });

        const specData = {
            brand: brand?.name ?? null,
            model: values.spec.model || null,
            referenceNumber: values.spec.referenceNumber || null,
            nickname: values.spec.nickname || null,
            strapSetType: pickEnumOrNull(
                values.spec.strapSetType,
                WatchFormEnums.WatchStrapSetType,
            ),
            strapComponentSource: pickEnumOrNull(
                values.spec.strapComponentSource,
                WatchFormEnums.WatchStrapComponentSource,
            ),
            caseShape: pickEnumOrNull(values.spec.caseShape, WatchFormEnums.CaseType),
            caseSizeMM: toDecimal(values.spec.caseSizeMM),
            lugToLugMM: toDecimal(values.spec.lugToLugMM),
            thicknessMM: toDecimal(values.spec.thicknessMM),
            crystal: pickEnumOrNull(values.spec.crystal, WatchFormEnums.Glass),
            dialColor: values.spec.dialColor || null,
            dialFinish: values.spec.dialFinish || null,
            movementType: pickEnumOrNull(
                values.basic.movementType,
                WatchFormEnums.MovementType,
            ),
            calibre: values.spec.calibre || null,
            materialProfile: pickEnumOrDefault(
                values.spec.materialProfile,
                WatchFormEnums.WatchMaterialProfile,
                WatchFormEnums.WatchMaterialProfile.SINGLE_MATERIAL,
            ),
            primaryCaseMaterial: pickEnumOrDefault(
                values.spec.primaryCaseMaterial,
                WatchFormEnums.WatchCaseMaterialFamily,
                WatchFormEnums.WatchCaseMaterialFamily.STAINLESS_STEEL,
            ),
            secondaryCaseMaterial: pickEnumOrNull(
                values.spec.secondaryCaseMaterial,
                WatchFormEnums.WatchCaseMaterialFamily,
            ),
            goldTreatment: pickEnumOrNull(
                values.spec.goldTreatment,
                WatchFormEnums.WatchGoldTreatment,
            ),
            goldColors: pickGoldColors(values.spec.goldColors),
            goldKarat: values.spec.goldKarat ? Number(values.spec.goldKarat) : null,
            braceletType: pickEnumOrNull(
                values.spec.braceletType,
                WatchFormEnums.Strap,
            ),
            strapMaterialText: values.spec.strapMaterialText || null,
            waterResistance: values.spec.waterResistance || null,
            powerReserve: values.spec.powerReserve || null,
            buckleType: values.spec.buckleType || null,
            boxIncluded: Boolean((values.spec as any).boxIncluded),
            bookletIncluded: Boolean((values.spec as any).bookletIncluded),
            cardIncluded: Boolean((values.spec as any).cardIncluded),
            materialNote: values.spec.materialNote || null,
        };

        await tx.watchSpecV2.upsert({
            where: { watchId: current.id },
            create: { watchId: current.id, ...specData },
            update: specData,
        });

        await tx.watchContent.upsert({
            where: { watchId: current.id },
            create: {
                watchId: current.id,
                contentStatus: "DRAFT",
                titleOverride: values.content.titleOverride || null,
                hookText: values.content.hookText || null,
                body: values.content.body || null,
                bulletSpecs: values.content.bulletSpecs ?? [],
                hashTags: values.content.hashTags || null,
            } as any,
            update: {
                titleOverride: values.content.titleOverride || null,
                hookText: values.content.hookText || null,
                body: values.content.body || null,
                bulletSpecs: values.content.bulletSpecs ?? [],
                hashTags: values.content.hashTags || null,
            } as any,
        });
    });

    const galleryOriginalKeys = new Set(
        requestedGalleryImages.map(mediaKey).filter(Boolean),
    );
    const remainingPoolImages = requestedPoolImages.filter((item) => {
        const key = mediaKey(item);
        return key && !galleryOriginalKeys.has(key);
    });

    // Release persisted pool images that the user removed before moving/saving
    // the new gallery/pool state. This keeps MediaAsset + NAS in sync.
    await releaseRemovedWatchPoolImagesToActive({
        productId,
        keepItems: [...remainingPoolImages, ...requestedGalleryImages],
    });

    const normalizedGalleryImages = await moveWatchGalleryImagesToChosen(
        requestedGalleryImages,
        { productId, acquisitionId: current.acquisitionId },
    );

    const normalizedPoolImages = await moveWatchPoolImagesToChosenPool(
        remainingPoolImages,
        { productId },
    );

    const galleryImageInputs = normalizedGalleryImages.map((item, index) => ({
        fileKey: String(item.key),
        isForAdmin: true,
        isForStorefront: true,
        sortOrder: index,
    }));

    await replaceWatchGalleryImagesRepo(prisma as any, {
        productId,
        images: galleryImageInputs,
    });

    await markGalleryMediaAssetsAttached({
        productId,
        images: galleryImageInputs,
    });

    if (contentChanged) {
        await resetWatchReviewToDraft({
            productId,
            targetType: "CONTENT",
            userId: context.userId,
        });
    }

    if (imagesChanged) {
        await resetWatchReviewToDraft({
            productId,
            targetType: "IMAGE",
            userId: context.userId,
        });
    }

    const pricingResult = await updateWatchPricingWithDiff(productId, {
        salePrice: values.pricing.salePrice,
        minPrice: values.pricing.minPrice,
        costPrice: values.pricing.costPrice,
        serviceCost: values.pricing.serviceCost,
        landedCost: values.pricing.landedCost,
        pricingNote: values.pricing.pricingNote,
    });

    if (pricingResult.changedFields.length > 0) {
        await notifyUsersByRole({
            role: "SALE",
            type: "WATCH_PRICE_UPDATED",
            title: "Giá watch vừa được cập nhật",
            message: `${pricingResult.product?.title || values.basic.title || "Watch"} vừa được chỉnh giá.`,
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${productId}?focus=pricing`,
                productId,
                focus: "pricing",
                sku: pricingResult.product?.sku ?? values.header.sku ?? null,
                title: pricingResult.product?.title ?? values.basic.title ?? null,
                changedFields: pricingResult.changedFields,
            },
        });
    }

    const hasContentData = hasContentSnapshotData(afterContent);

    return {
        ok: true,
        message:
            contentChanged || imagesChanged
                ? "Đã lưu watch. Phần vừa thay đổi đã ở trạng thái Draft và cần duyệt lại."
                : "Đã lưu watch.",
        contentChanged,
        imagesChanged,
        hasContentData,
        media: {
            poolImages: normalizedPoolImages,
            galleryImages: normalizedGalleryImages,
        },
        reviewSubmitTargets: !context.canReviewContent
            ? ([
                contentChanged && hasContentData ? "CONTENT" : null,
                imagesChanged ? "IMAGE" : null,
            ].filter(Boolean) as Array<"CONTENT" | "IMAGE">)
            : [],
        askSubmitReview:
            !context.canReviewContent &&
            ((contentChanged && hasContentData) || imagesChanged),
        askContinueContent:
            !context.canReviewContent && imagesChanged && !hasContentData,
        contentReviewStatus: contentChanged ? "DRAFT" : undefined,
        imageReviewStatus: imagesChanged ? "DRAFT" : undefined,
    };
}
