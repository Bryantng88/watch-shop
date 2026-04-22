import { Prisma } from "@prisma/client";
import type { WatchDetailModel, WatchListComputedItem } from "./watch.types";

function decimalToString(value: Prisma.Decimal | null | undefined) {
    if (value == null) return null;
    return value.toString();
}

function hasMeaningfulContent(row: any) {
    return Boolean(
        String(row?.watchContent?.body ?? "").trim() ||
        String(row?.watchContent?.summary ?? "").trim() ||
        row?.watchContent?.bulletSpecs?.length
    );
}

export function mapAdminWatchListItem(row: any): WatchListComputedItem {
    const images = (row?.product?.productImage ?? []).map((img: any) => ({
        id: img.id,
        fileKey: img.fileKey ?? null,
        role: img.role ?? null,
        isForAdmin: img.isForAdmin ?? null,
        isForStorefront: img.isForStorefront ?? null,
        sortOrder: img.sortOrder ?? null,
    }));

    const galleryImages = images.filter((img: any) => img?.role === "GALLERY");
    const imagesCount = galleryImages.length;
    const hasImages = imagesCount > 0;
    const hasContent = hasMeaningfulContent(row);
    const hasPrice = Boolean(row?.watchPrice?.salePrice || row?.watchPrice?.listPrice);

    const status = row?.product?.status ?? "AVAILABLE";
    const isHold = ["HOLD", "CONSIGNED_FROM", "CONSIGNED_TO"].includes(String(status).toUpperCase());
    const isSold = String(status).toUpperCase() === "SOLD";

    const publishMissing = [
        hasImages ? null : "images",
        hasContent ? null : "content",
        hasPrice ? null : "price",
    ].filter(Boolean) as string[];

    return {
        id: row.productId,
        watchId: row.id,
        productId: row.productId,
        title: row?.product?.title ?? null,
        status,
        contentStatus: row?.product?.contentStatus ?? null,

        images,
        imagesCount,
        hasImages,
        hasContent,

        isReadyToPublish: !isHold && !isSold && hasImages && hasContent,
        publishMissing,

        sku: row?.product?.sku ?? null,
        brand: row?.product?.brand?.name ?? row?.watchSpecV2?.brand ?? null,
        primaryImageUrl: galleryImages[0]?.fileKey ?? null,

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

        updatedAt: row?.product?.updatedAt ?? row?.updatedAt ?? null,

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
        vendor: row.product.vendor
            ? {
                id: row.product.vendor.id,
                name: row.product.vendor.name,
            }
            : null,
        category: row.product.productCategory
            ? {
                id: row.product.productCategory.id,
                name: row.product.productCategory.name,
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
            specStatus: row.specStatus ?? "PENDING",
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
                materialProfile: row.watchSpecV2.materialProfile ?? null,
                primaryCaseMaterial: row.watchSpecV2.primaryCaseMaterial ?? null,
                secondaryCaseMaterial: row.watchSpecV2.secondaryCaseMaterial ?? null,
                goldTreatment: row.watchSpecV2.goldTreatment ?? null,
                goldColors: row.watchSpecV2.goldColors ?? [],
                goldKarat: row.watchSpecV2.goldKarat ?? null,
                dialColor: row.watchSpecV2.dialColor ?? null,
                crystal: row.watchSpecV2.crystal ?? null,
                calibre: row.watchSpecV2.calibre ?? null,
                braceletType: row.watchSpecV2.braceletType ?? null,
                bookletIncluded: row.watchSpecV2.bookletIncluded ?? null,
                cardIncluded: row.watchSpecV2.cardIncluded ?? null,
            }
            : null,
        price: row.watchPrice
            ? {
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
                titleOverride: row.watchContent.titleOverride ?? null,
                summary: row.watchContent.summary ?? null,
                hookText: row.watchContent.hookText ?? null,
                body: row.watchContent.body ?? null,
                bulletSpecs: row.watchContent.bulletSpecs ?? [],
                seoTitle: row.watchContent.seoTitle ?? null,
                seoDescription: row.watchContent.seoDescription ?? null,
            }
            : null,
        images: (row.product.productImage ?? []).map((img: any) => ({
            id: img.id,
            fileKey: img.fileKey ?? null,
            role: img.role ?? null,
            isForAdmin: img.isForAdmin ?? null,
            isForStorefront: img.isForStorefront ?? null,
            sortOrder: img.sortOrder ?? null,
        })),
    };
}
