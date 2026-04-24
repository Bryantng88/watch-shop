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

function pickEnum<T extends string>(
    value: string | null | undefined,
    allowed: readonly T[]
): T | null {
    const raw = String(value ?? "").trim() as T;
    return allowed.includes(raw) ? raw : null;
}

const MOVEMENT_TYPES = [
    "AUTOMATIC",
    "HAND_WOUND",
    "QUARTZ",
    "SOLAR",
    "KINETIC",
    "MECHAQUARTZ",
    "SPRING_DRIVE",
    "HYBRID",
] as const;

const CASE_TYPES = [
    "ROUND",
    "TANK",
    "SQUARE",
    "SPECIAL",
    "OTHER",
    "TONNEAU",
    "CUSHION",
    "OVAL",
    "ASYMMETRICAL",
    "OCTAGON",
    "POLYGON",
] as const;

const GLASS_TYPES = [
    "SAPPHIRE",
    "ACRYLIC",
    "MINERAL",
    "HARDLEX",
    "AR_COATED",
] as const;

const MATERIAL_PROFILES = [
    "SINGLE_MATERIAL",
    "BIMETAL",
    "COATED",
    "OTHER",
] as const;

const CASE_MATERIALS = [
    "STAINLESS_STEEL",
    "TITANIUM",
    "CERAMIC",
    "CARBON",
    "GOLD",
    "PLATINUM",
    "SILVER",
    "BRASS",
    "OTHER",
] as const;

const GOLD_TREATMENTS = [
    "SOLID_GOLD",
    "CAPPED_GOLD",
    "GOLD_PLATED",
    "GOLD_VERMEIL",
    "GOLD_FILLED",
] as const;

const GOLD_COLORS = ["YELLOW", "WHITE", "ROSE", "MIXED"] as const;

const BRACELET_TYPES = [
    "LEATHER",
    "BRACELET",
    "RUBBER",
    "NATO",
    "CANVASS",
    "SPECIAL",
] as const;

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
                title: values.basic.title || null,
                slug: values.basic.slug || null,
                sku: values.header.sku || null,

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
                gender: values.basic.gender || null,
                siteChannel: values.basic.siteChannel || null,
                stockState: values.basic.stockState || null,
                saleState: values.basic.saleState || null,
                conditionGrade: values.basic.conditionGrade || null,
                movementType: pickEnum(
                    values.basic.movementType,
                    MOVEMENT_TYPES
                ),
                movementCalibre: values.basic.movementCalibre || null,
                serialNumber: values.basic.serialNumber || null,
                yearText: values.basic.yearText || null,
            },
        });

        await tx.watchSpecV2.upsert({
            where: { watchId: current.id },
            create: {
                watchId: current.id,
                brand: brand?.name ?? null,
                model: values.spec.model || null,
                referenceNumber: values.spec.referenceNumber || null,
                nickname: values.spec.nickname || null,
                caseShape: pickEnum(values.spec.caseShape, CASE_TYPES),
                caseSizeMM: toDecimal(values.spec.caseSizeMM),
                lugToLugMM: toDecimal(values.spec.lugToLugMM),
                thicknessMM: toDecimal(values.spec.thicknessMM),
                crystal: pickEnum(values.spec.crystal, GLASS_TYPES),
                dialColor: values.spec.dialColor || null,
                dialFinish: values.spec.dialFinish || null,
                movementType: pickEnum(
                    values.basic.movementType,
                    MOVEMENT_TYPES
                ),
                calibre: values.spec.calibre || null,
                materialProfile: pickEnum(
                    values.spec.materialProfile,
                    MATERIAL_PROFILES
                ),
                primaryCaseMaterial: pickEnum(
                    values.spec.primaryCaseMaterial,
                    CASE_MATERIALS
                ),
                secondaryCaseMaterial: pickEnum(
                    values.spec.secondaryCaseMaterial,
                    CASE_MATERIALS
                ),
                goldTreatment: pickEnum(
                    values.spec.goldTreatment,
                    GOLD_TREATMENTS
                ),
                goldColors: (values.spec.goldColors ?? []).filter((x) =>
                    GOLD_COLORS.includes(x as any)
                ) as any,
                goldKarat: values.spec.goldKarat
                    ? Number(values.spec.goldKarat)
                    : null,
                braceletType: pickEnum(
                    values.spec.braceletType,
                    BRACELET_TYPES
                ),
                strapMaterialText: values.spec.strapMaterialText || null,
                waterResistance: values.spec.waterResistance || null,
                powerReserve: values.spec.powerReserve || null,
                buckleType: values.spec.buckleType || null,
                materialNote: values.spec.materialNote || null,
            },
            update: {
                brand: brand?.name ?? null,
                model: values.spec.model || null,
                referenceNumber: values.spec.referenceNumber || null,
                nickname: values.spec.nickname || null,
                caseShape: pickEnum(values.spec.caseShape, CASE_TYPES),
                caseSizeMM: toDecimal(values.spec.caseSizeMM),
                lugToLugMM: toDecimal(values.spec.lugToLugMM),
                thicknessMM: toDecimal(values.spec.thicknessMM),
                crystal: pickEnum(values.spec.crystal, GLASS_TYPES),
                dialColor: values.spec.dialColor || null,
                dialFinish: values.spec.dialFinish || null,
                movementType: pickEnum(
                    values.basic.movementType,
                    MOVEMENT_TYPES
                ),
                calibre: values.spec.calibre || null,
                materialProfile: pickEnum(
                    values.spec.materialProfile,
                    MATERIAL_PROFILES
                ),
                primaryCaseMaterial: pickEnum(
                    values.spec.primaryCaseMaterial,
                    CASE_MATERIALS
                ),
                secondaryCaseMaterial: pickEnum(
                    values.spec.secondaryCaseMaterial,
                    CASE_MATERIALS
                ),
                goldTreatment: pickEnum(
                    values.spec.goldTreatment,
                    GOLD_TREATMENTS
                ),
                goldColors: (values.spec.goldColors ?? []).filter((x) =>
                    GOLD_COLORS.includes(x as any)
                ) as any,
                goldKarat: values.spec.goldKarat
                    ? Number(values.spec.goldKarat)
                    : null,
                braceletType: pickEnum(
                    values.spec.braceletType,
                    BRACELET_TYPES
                ),
                strapMaterialText: values.spec.strapMaterialText || null,
                waterResistance: values.spec.waterResistance || null,
                powerReserve: values.spec.powerReserve || null,
                buckleType: values.spec.buckleType || null,
                materialNote: values.spec.materialNote || null,
            },
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

        await tx.watchPrice.upsert({
            where: { watchId: current.id },
            create: {
                watchId: current.id,
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
        !sameMoney(prevPricing.salePrice, nextPricing.salePrice)
            ? "salePrice"
            : null,
        !sameMoney(prevPricing.listPrice, nextPricing.listPrice)
            ? "listPrice"
            : null,
        !sameMoney(prevPricing.minPrice, nextPricing.minPrice)
            ? "minPrice"
            : null,
        !sameMoney(prevPricing.costPrice, nextPricing.costPrice)
            ? "costPrice"
            : null,
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