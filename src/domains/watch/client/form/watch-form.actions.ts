"use server";

import { prisma } from "@/server/db/client";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";

import type { WatchFormValues } from "./watch-form.types";
import { replaceWatchGalleryImages } from "@/domains/watch/server";
import { updateWatchPricingWithDiff } from "@/domains/watch/server/pricing";
import { autoApproveWatchReview, resetWatchReviewToDraft } from "@/domains/watch/server/review";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";
import {
    WatchFormEnums,
    pickEnumOrDefault,
    pickEnumOrNull,
    pickEnumOrUndefined,
    pickGoldColors,
    toDecimal,
} from "./watch-form.server.utils";

function textOrUndefined(value?: string | null) {
    const text = String(value ?? "").trim();
    return text || undefined;
}

function normalizeText(value?: string | null) {
    return String(value ?? "").trim();
}

function normalizeArray(value?: unknown[]) {
    return (value ?? []).map((x) => String(x ?? "").trim()).filter(Boolean);
}

function normalizeImageKeys(items?: { key?: string | null }[]) {
    return (items ?? []).map((x) => String(x.key ?? "").trim()).filter(Boolean);
}

function sameJson(a: unknown, b: unknown) {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

function authHasPermission(auth: any, permission: string) {
    const permissions =
        auth?.permissions ??
        auth?.user?.permissions ??
        auth?.role?.permissions ??
        [];

    return Array.isArray(permissions) && permissions.includes(permission);
}

export async function submitWatchForm(values: WatchFormValues) {
    const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
    const userId = getAuthUserId(auth);
    const canReviewContent = authHasPermission(
        auth,
        PERMISSIONS.PRODUCT_CONTENT_REVIEW
    );

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
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy watch.");
    }

    const beforeContent = {
        titleOverride: normalizeText(current.watchContent?.titleOverride),
        hookText: normalizeText(current.watchContent?.hookText),
        body: normalizeText(current.watchContent?.body),
        bulletSpecs: normalizeArray(current.watchContent?.bulletSpecs as any),
        hashTags: normalizeText((current.watchContent as any)?.hashTags ?? (current.watchContent as any)?.hashTags),
    };

    const afterContent = {
        titleOverride: normalizeText(values.content.titleOverride),
        hookText: normalizeText(values.content.hookText),
        body: normalizeText(values.content.body),
        bulletSpecs: normalizeArray(values.content.bulletSpecs),
        hashTags: normalizeText(values.content.hashTags),
    };

    const beforeImageKeys = normalizeImageKeys(
        current.product.productImage.map((x: any) => ({ key: x.fileKey }))
    );

    const afterImageKeys = normalizeImageKeys(values.media.galleryImages);

    const contentChanged = !sameJson(beforeContent, afterContent);
    const imagesChanged = !sameJson(beforeImageKeys, afterImageKeys);


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
                gender: pickEnumOrUndefined(
                    values.basic.gender,
                    WatchFormEnums.Gender
                ),
                style: pickEnumOrNull(
                    values.basic.style,
                    WatchFormEnums.WatchStyle
                ),
                siteChannel: pickEnumOrUndefined(
                    values.basic.siteChannel,
                    WatchFormEnums.WatchSiteChannel
                ),
                stockState: values.basic.stockState || null,
                saleState: values.basic.saleState || null,
                conditionGrade: values.basic.conditionGrade || null,
                movementType: pickEnumOrNull(
                    values.basic.movementType,
                    WatchFormEnums.MovementType
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
                WatchFormEnums.WatchStrapSetType
            ),
            strapComponentSource: pickEnumOrNull(
                values.spec.strapComponentSource,
                WatchFormEnums.WatchStrapComponentSource
            ),
            caseShape: pickEnumOrNull(
                values.spec.caseShape,
                WatchFormEnums.CaseType
            ),
            caseSizeMM: toDecimal(values.spec.caseSizeMM),
            lugToLugMM: toDecimal(values.spec.lugToLugMM),
            thicknessMM: toDecimal(values.spec.thicknessMM),
            crystal: pickEnumOrNull(values.spec.crystal, WatchFormEnums.Glass),
            dialColor: values.spec.dialColor || null,
            dialFinish: values.spec.dialFinish || null,
            movementType: pickEnumOrNull(
                values.basic.movementType,
                WatchFormEnums.MovementType
            ),
            calibre: values.spec.calibre || null,
            materialProfile: pickEnumOrDefault(
                values.spec.materialProfile,
                WatchFormEnums.WatchMaterialProfile,
                WatchFormEnums.WatchMaterialProfile.SINGLE_MATERIAL
            ),
            primaryCaseMaterial: pickEnumOrDefault(
                values.spec.primaryCaseMaterial,
                WatchFormEnums.WatchCaseMaterialFamily,
                WatchFormEnums.WatchCaseMaterialFamily.STAINLESS_STEEL
            ),
            secondaryCaseMaterial: pickEnumOrNull(
                values.spec.secondaryCaseMaterial,
                WatchFormEnums.WatchCaseMaterialFamily
            ),
            goldTreatment: pickEnumOrNull(
                values.spec.goldTreatment,
                WatchFormEnums.WatchGoldTreatment
            ),
            goldColors: pickGoldColors(values.spec.goldColors),
            goldKarat: values.spec.goldKarat
                ? Number(values.spec.goldKarat)
                : null,
            braceletType: pickEnumOrNull(
                values.spec.braceletType,
                WatchFormEnums.Strap
            ),
            strapMaterialText: values.spec.strapMaterialText || null,
            waterResistance: values.spec.waterResistance || null,
            powerReserve: values.spec.powerReserve || null,
            buckleType: values.spec.buckleType || null,
            materialNote: values.spec.materialNote || null,
        };

        await tx.watchSpecV2.upsert({
            where: { watchId: current.id },
            create: {
                watchId: current.id,
                ...specData,
            },
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

    await replaceWatchGalleryImages({
        productId,
        images: (values.media.galleryImages ?? []).map((item, index) => ({
            fileKey: String(item.key),
            isForAdmin: true,
            isForStorefront: true,
            sortOrder: index,
        })),
    });

    if (canReviewContent) {
        if (contentChanged) {
            await autoApproveWatchReview({
                productId,
                targetType: "CONTENT",
                userId,
            });
        }

        if (imagesChanged) {
            await autoApproveWatchReview({
                productId,
                targetType: "IMAGE",
                userId,
            });
        }
    } else {
        if (contentChanged) {
            await resetWatchReviewToDraft({
                productId,
                targetType: "CONTENT",
                userId,
            });
        }

        if (imagesChanged) {
            await resetWatchReviewToDraft({
                productId,
                targetType: "IMAGE",
                userId,
            });
        }
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
            message: `${pricingResult.product?.title || values.basic.title || "Watch"
                } vừa được chỉnh giá.`,
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${productId}?focus=pricing`,
                productId,
                focus: "pricing",
                sku: pricingResult.product?.sku ?? values.header.sku ?? null,
                title:
                    pricingResult.product?.title ?? values.basic.title ?? null,
                changedFields: pricingResult.changedFields,
            },
        });
    }

    const hasContentData =
        Boolean(afterContent.titleOverride) ||
        Boolean(afterContent.hookText) ||
        Boolean(afterContent.body) ||
        Boolean(afterContent.hashTags) ||
        afterContent.bulletSpecs.length > 0;

    return {
        ok: true,
        message:
            canReviewContent && (contentChanged || imagesChanged)
                ? "Đã lưu watch và tự động duyệt phần vừa thay đổi."
                : "Đã lưu watch.",

        contentChanged,
        imagesChanged,
        hasContentData,

        reviewSubmitTargets:
            !canReviewContent
                ? ([
                    contentChanged && hasContentData ? "CONTENT" : null,
                    imagesChanged ? "IMAGE" : null,
                ].filter(Boolean) as Array<"CONTENT" | "IMAGE">)
                : [],

        askSubmitReview:
            !canReviewContent &&
            ((contentChanged && hasContentData) || imagesChanged),

        askContinueContent:
            !canReviewContent &&
            imagesChanged &&
            !hasContentData,

        contentReviewStatus: canReviewContent && contentChanged ? "APPROVED" : undefined,
        imageReviewStatus: canReviewContent && imagesChanged ? "APPROVED" : undefined,
    };
}