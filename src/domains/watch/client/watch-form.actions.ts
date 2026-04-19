"use server";

import { prisma } from "@/server/db/client";
import type { WatchFormValues } from "./watch-form.types";
import { replaceWatchImages } from "@/domains/watch/server";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";

function toDecimal(value?: string) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;

    const normalized = raw.replace(/[^\d.-]/g, "");
    if (!normalized) return null;

    return normalized;
}

function sameMoney(a?: string | null, b?: string | null) {
    return String(a ?? "") === String(b ?? "");
}

export async function submitWatchForm(values: WatchFormValues) {
    const productId = values.productId;

    const current = await prisma.watch.findFirst({
        where: { productId },
        include: {
            product: true,
            watchSpecV2: true,
            watchPrice: true,
            watchContent: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy watch.");
    }

    const prevPricing = {
        salePrice: current.watchPrice?.salePrice?.toString() ?? null,
        listPrice: current.watchPrice?.listPrice?.toString() ?? null,
        minPrice: current.watchPrice?.minPrice?.toString() ?? null,
        costPrice: current.watchPrice?.costPrice?.toString() ?? null,
    };

    await prisma.$transaction(async (tx) => {
        await tx.product.update({
            where: { id: productId },
            data: {
                title: values.basic.title || null,
                slug: values.basic.slug || null,

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
                gender: (values.basic.gender as any) || null,
                siteChannel: (values.basic.siteChannel as any) || null,
                stockState: values.basic.stockState || null,
                saleState: values.basic.saleState || null,
                conditionGrade: values.basic.conditionGrade || null,
                movementType: values.basic.movementType || null,
                movementCalibre: values.basic.movementCalibre || null,
                serialNumber: values.basic.serialNumber || null,
                yearText: values.basic.yearText || null,
            },
        });

        await tx.watchSpecV2.upsert({
            where: { productId },
            create: {
                productId,
                brand: values.spec.specBrand || null,
                model: values.spec.model || null,
                referenceNumber: values.spec.referenceNumber || null,
                nickname: values.spec.nickname || null,
                caseShape: values.spec.caseShape || null,
                caseSizeMM: toDecimal(values.spec.caseSizeMM),
                lugToLugMM: toDecimal(values.spec.lugToLugMM),
                thicknessMM: toDecimal(values.spec.thicknessMM),
                crystal: values.spec.crystal || null,
                dialColor: values.spec.dialColor || null,
                calibre: values.spec.calibre || null,
                materialProfile: (values.spec.materialProfile as any) || null,
                primaryCaseMaterial: (values.spec.primaryCaseMaterial as any) || null,
                secondaryCaseMaterial: (values.spec.secondaryCaseMaterial as any) || null,
                goldTreatment: (values.spec.goldTreatment as any) || null,
                goldColors: values.spec.goldColors ?? [],
                goldKarat: values.spec.goldKarat ? Number(values.spec.goldKarat) : null,
                braceletType: values.spec.braceletType || null,
                strapMaterialText: values.spec.strapMaterialText || null,
                waterResistance: values.spec.waterResistance || null,
                powerReserve: values.spec.powerReserve || null,
                dialFinish: values.spec.dialFinish || null,
                buckleType: values.spec.buckleType || null,
                materialNote: values.spec.materialNote || null,
            },
            update: {
                brand: values.spec.specBrand || null,
                model: values.spec.model || null,
                referenceNumber: values.spec.referenceNumber || null,
                nickname: values.spec.nickname || null,
                caseShape: values.spec.caseShape || null,
                caseSizeMM: toDecimal(values.spec.caseSizeMM),
                lugToLugMM: toDecimal(values.spec.lugToLugMM),
                thicknessMM: toDecimal(values.spec.thicknessMM),
                crystal: values.spec.crystal || null,
                dialColor: values.spec.dialColor || null,
                calibre: values.spec.calibre || null,
                materialProfile: (values.spec.materialProfile as any) || null,
                primaryCaseMaterial: (values.spec.primaryCaseMaterial as any) || null,
                secondaryCaseMaterial: (values.spec.secondaryCaseMaterial as any) || null,
                goldTreatment: (values.spec.goldTreatment as any) || null,
                goldColors: values.spec.goldColors ?? [],
                goldKarat: values.spec.goldKarat ? Number(values.spec.goldKarat) : null,
                braceletType: values.spec.braceletType || null,
                strapMaterialText: values.spec.strapMaterialText || null,
                waterResistance: values.spec.waterResistance || null,
                powerReserve: values.spec.powerReserve || null,
                dialFinish: values.spec.dialFinish || null,
                buckleType: values.spec.buckleType || null,
                materialNote: values.spec.materialNote || null,
            },
        });

        await tx.watchContent.upsert({
            where: { productId },
            create: {
                productId,
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

        await tx.watchPrice.upsert({
            where: { productId },
            create: {
                productId,
                salePrice: toDecimal(values.pricing.salePrice),
                listPrice: toDecimal(values.pricing.listPrice),
                minPrice: toDecimal(values.pricing.minPrice),
                costPrice: toDecimal(values.pricing.costPrice),
                serviceCost: toDecimal(values.pricing.serviceCost),
                landedCost: toDecimal(values.pricing.landedCost),
                pricingNote: values.pricing.pricingNote || null,
            },
            update: {
                salePrice: toDecimal(values.pricing.salePrice),
                listPrice: toDecimal(values.pricing.listPrice),
                minPrice: toDecimal(values.pricing.minPrice),
                costPrice: toDecimal(values.pricing.costPrice),
                serviceCost: toDecimal(values.pricing.serviceCost),
                landedCost: toDecimal(values.pricing.landedCost),
                pricingNote: values.pricing.pricingNote || null,
            },
        });
    });

    const selected = Array.isArray(values.media.selectedImages)
        ? values.media.selectedImages
        : [];

    await replaceWatchImages({
        productId,
        images: selected.map((item, index) => ({
            fileKey: String(item.key),
            role: "GALLERY",
            isForAdmin: true,
            isForStorefront: true,
            sortOrder: index,
        })),
    });

    const nextPricing = {
        salePrice: toDecimal(values.pricing.salePrice),
        listPrice: toDecimal(values.pricing.listPrice),
        minPrice: toDecimal(values.pricing.minPrice),
        costPrice: toDecimal(values.pricing.costPrice),
    };

    const changedFields = [
        !sameMoney(prevPricing.salePrice, nextPricing.salePrice) ? "salePrice" : null,
        !sameMoney(prevPricing.listPrice, nextPricing.listPrice) ? "listPrice" : null,
        !sameMoney(prevPricing.minPrice, nextPricing.minPrice) ? "minPrice" : null,
        !sameMoney(prevPricing.costPrice, nextPricing.costPrice) ? "costPrice" : null,
    ].filter(Boolean) as string[];

    if (changedFields.length > 0) {
        await notifyUsersByRole({
            roles: ["SALE", "TECHNICIAN"],
            title: "Watch pricing updated",
            message: `${values.basic.title || "Watch"} vừa được cập nhật giá.`,
            metadata: {
                productId,
                watchId: current.id,
                sku: values.header.sku || null,
                title: values.basic.title || null,
                changedFields,
                before: prevPricing,
                after: nextPricing,
            },
            link: `/admin/watches/${productId}`,
        });
    }

    return {
        ok: true,
        message: "Đã lưu watch.",
    };
}