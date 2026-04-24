"use server";

import { prisma } from "@/server/db/client";
import type { WatchFormValues } from "./watch-form.types";
import { replaceWatchGalleryImages } from "@/domains/watch/server";
import { updateWatchPricingWithDiff } from "@/domains/watch/server/pricing";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";
import {
    WatchFormEnums,
    pickEnumOrDefault,
    pickEnumOrNull,
    pickEnumOrUndefined,
    pickGoldColors,
    toDecimal,
} from "./watch-form.server.utils"
function textOrUndefined(value?: string | null) {
    const text = String(value ?? "").trim();
    return text || undefined;
}

function textOrNull(value?: string | null) {
    const text = String(value ?? "").trim();
    return text || null;
}
export async function submitWatchForm(values: WatchFormValues) {
    const productId = values.productId;

    const current = await prisma.watch.findUnique({
        where: { productId },
        include: {
            product: true,
            watchSpecV2: true,
            watchContent: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy watch.");
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
                gender: pickEnumOrUndefined(
                    values.basic.gender,
                    WatchFormEnums.Gender
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

            caseShape: pickEnumOrNull(
                values.spec.caseShape,
                WatchFormEnums.CaseType
            ),

            caseSizeMM: toDecimal(values.spec.caseSizeMM),
            lugToLugMM: toDecimal(values.spec.lugToLugMM),
            thicknessMM: toDecimal(values.spec.thicknessMM),

            crystal: pickEnumOrNull(
                values.spec.crystal,
                WatchFormEnums.Glass
            ),

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
                hookText: values.content.hookText || null,
                body: values.content.body || null,
                bulletSpecs: values.content.bulletSpecs ?? [],
            },
            update: {
                hookText: values.content.hookText || null,
                body: values.content.body || null,
                bulletSpecs: values.content.bulletSpecs ?? [],
            },
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

    const pricingResult = await updateWatchPricingWithDiff(productId, {
        salePrice: values.pricing.salePrice,
        minPrice: values.pricing.minPrice,
        costPrice: values.pricing.costPrice,
        serviceCost: values.pricing.serviceCost,
        landedCost: values.pricing.landedCost,
        pricingNote: values.pricing.pricingNote,
    });

    if (pricingResult.changedFields.length > 0) {
        const route = `/admin/watches/${productId}?focus=pricing`;

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
                title: pricingResult.product?.title ?? values.basic.title ?? null,
                changedFields: pricingResult.changedFields,
                before: {
                    salePrice: pricingResult.before?.salePrice?.toString() ?? null,
                    minPrice: pricingResult.before?.minPrice?.toString() ?? null,
                    costPrice: pricingResult.before?.costPrice?.toString() ?? null,
                    serviceCost: pricingResult.before?.serviceCost?.toString() ?? null,
                    landedCost: pricingResult.before?.landedCost?.toString() ?? null,
                },
                after: {
                    salePrice: pricingResult.after?.salePrice?.toString() ?? null,
                    minPrice: pricingResult.after?.minPrice?.toString() ?? null,
                    costPrice: pricingResult.after?.costPrice?.toString() ?? null,
                    serviceCost: pricingResult.after?.serviceCost?.toString() ?? null,
                    landedCost: pricingResult.after?.landedCost?.toString() ?? null,
                },
            },
        });
    }

    return {
        ok: true,
        message: "Đã lưu watch.",
    };
}