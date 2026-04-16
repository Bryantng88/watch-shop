import type { Prisma } from "@/prisma/client";
import type { WatchDetailModel, WatchListComputedItem } from "./watch.types";

function decimalToString(value: Prisma.Decimal | null | undefined) {
    if (value == null) return null;
    return value.toString();
}

export function mapAdminWatchListItem(row: any): WatchListComputedItem {
    const imagesCount = Array.isArray(row?.watchMedia) ? row.watchMedia.length : 0;
    const hasContent = Boolean(
        row?.watchContent?.body ||
        row?.watchContent?.summary ||
        row?.watchContent?.bulletSpecs?.length
    );
    const hasPrice = Boolean(row?.watchPrice?.salePrice || row?.watchPrice?.listPrice);

    const publishMissing = [
        imagesCount > 0 ? null : "images",
        hasContent ? null : "content",
        hasPrice ? null : "price",
    ].filter(Boolean) as string[];

    return {
        id: row.productId,          // dùng productId làm id public cho list/UI
        watchId: row.id,            // watch.id giữ lại nếu cần internal
        productId: row.productId,   // route id
        title: row?.product?.title ?? null,
        type: "WATCH",
        status: row?.product?.status ?? "AVAILABLE",
        contentStatus: row?.product?.contentStatus ?? null,
        imagesCount,
        isReadyToPublish: publishMissing.length === 0,
        publishMissing,
        sku: row?.product?.sku ?? null,
        brand: row?.product?.brand?.name ?? row?.watchSpecV2?.brand ?? null,
        primaryImageUrl: row?.product?.primaryImageUrl ?? null,
        salePrice: decimalToString(row?.watchPrice?.salePrice),
        listPrice: decimalToString(row?.watchPrice?.listPrice),
        costPrice: decimalToString(row?.watchPrice?.costPrice),
        minPrice: decimalToString(row?.watchPrice?.minPrice),
        saleState: row?.saleState ?? null,
        serviceState: row?.serviceState ?? null,
        gender: row?.gender ?? null,
        siteChannel: row?.siteChannel ?? null,
        primaryCaseMaterial: row?.watchSpecV2?.primaryCaseMaterial ?? null,
        secondaryCaseMaterial: row?.watchSpecV2?.secondaryCaseMaterial ?? null,
        materialProfile: row?.watchSpecV2?.materialProfile ?? null,
        goldTreatment: row?.watchSpecV2?.goldTreatment ?? null,
        goldColors: row?.watchSpecV2?.goldColors ?? [],
        goldKarat: row?.watchSpecV2?.goldKarat ?? null,
        spec: {
            model: row?.watchSpecV2?.model ?? null,
            referenceNumber: row?.watchSpecV2?.referenceNumber ?? null,
        },
    };
}

export function mapWatchDetail(row: any): WatchDetailModel {
    return {
        id: row.product.id,
        productId: row.product.id,
        watchId: row.id,
        title: row.product.title,
        slug: row.product.slug ?? null,
        status: row.product.status,
        sku: row.product.sku ?? null,
        primaryImageUrl: row.product.primaryImageUrl ?? null,
        storefrontImageKey: row.product.storefrontImageKey ?? null,
        seoTitle: row.product.seoTitle ?? null,
        seoDescription: row.product.seoDescription ?? null,
        brand: row.product.brand
            ? {
                id: row.product.brand.id,
                name: row.product.brand.name,
                slug: row.product.brand.slug,
            }
            : null,
        watch: {
            id: row.id,
            gender: row.gender,
            siteChannel: row.siteChannel,
            stockState: row.stockState ?? null,
            saleState: row.saleState ?? null,
            serviceState: row.serviceState ?? null,
            movementType: row.movementType ?? null,
            movementCalibre: row.movementCalibre ?? null,
            yearText: row.yearText ?? null,
            hasBox: row.hasBox,
            hasPapers: row.hasPapers,
            notes: row.notes ?? null,
            conditionGrade: row.conditionGrade ?? null,
            serialNumber: row.serialNumber ?? null,
        },
        spec: row.watchSpecV2
            ? {
                id: row.watchSpecV2.id,
                brand: row.watchSpecV2.brand ?? null,
                model: row.watchSpecV2.model ?? null,
                referenceNumber: row.watchSpecV2.referenceNumber ?? null,
                nickname: row.watchSpecV2.nickname ?? null,
                caseShape: row.watchSpecV2.caseShape ?? null,
                caseSizeMM: decimalToString(row.watchSpecV2.caseSizeMM),
                lugToLugMM: decimalToString(row.watchSpecV2.lugToLugMM),
                lugWidthMM: decimalToString(row.watchSpecV2.lugWidthMM),
                thicknessMM: decimalToString(row.watchSpecV2.thicknessMM),
                materialProfile: row.watchSpecV2.materialProfile,
                primaryCaseMaterial: row.watchSpecV2.primaryCaseMaterial,
                secondaryCaseMaterial: row.watchSpecV2.secondaryCaseMaterial ?? null,
                goldTreatment: row.watchSpecV2.goldTreatment ?? null,
                goldColors: row.watchSpecV2.goldColors ?? [],
                goldKarat: row.watchSpecV2.goldKarat ?? null,
                dialColor: row.watchSpecV2.dialColor ?? null,
                crystal: row.watchSpecV2.crystal ?? null,
                calibre: row.watchSpecV2.calibre ?? null,
                braceletType: row.watchSpecV2.braceletType ?? null,
                boxIncluded: row.watchSpecV2.boxIncluded,
                bookletIncluded: row.watchSpecV2.bookletIncluded,
                cardIncluded: row.watchSpecV2.cardIncluded,
            }
            : null,
        price: row.watchPrice
            ? {
                id: row.watchPrice.id,
                costPrice: decimalToString(row.watchPrice.costPrice),
                serviceCost: decimalToString(row.watchPrice.serviceCost),
                landedCost: decimalToString(row.watchPrice.landedCost),
                listPrice: decimalToString(row.watchPrice.listPrice),
                salePrice: decimalToString(row.watchPrice.salePrice),
                minPrice: decimalToString(row.watchPrice.minPrice),
                pricingNote: row.watchPrice.pricingNote ?? null,
            }
            : null,
        content: row.watchContent
            ? {
                id: row.watchContent.id,
                titleOverride: row.watchContent.titleOverride ?? null,
                summary: row.watchContent.summary ?? null,
                hookText: row.watchContent.hookText ?? null,
                body: row.watchContent.body ?? null,
                bulletSpecs: row.watchContent.bulletSpecs ?? [],
                seoTitle: row.watchContent.seoTitle ?? null,
                seoDescription: row.watchContent.seoDescription ?? null,
            }
            : null,
        images: Array.isArray(row.watchMedia)
            ? row.watchMedia.map((image: any) => ({
                id: image.id,
                key: image.key ?? null,
                url: image.url ?? null,
                role: image.role ?? null,
                sortOrder: image.sortOrder ?? 0,
                alt: image.alt ?? null,
                width: image.width ?? null,
                height: image.height ?? null,
            }))
            : [],
    };
}