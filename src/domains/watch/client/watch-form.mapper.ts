import type { Prisma } from "@/prisma/client";
import type { WatchDetailModel, WatchListComputedItem } from "./watch.types";

function decimalToString(value: Prisma.Decimal | null | undefined) {
    if (value == null) return null;
    return value.toString();
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

    const adminInlineImages = images.filter((img: any) => img?.role === "INLINE" && img?.isForAdmin);
    const imagesCount = adminInlineImages.length;

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
        id: row.productId,
        watchId: row.id,
        productId: row.productId,
        title: row?.product?.title ?? null,
        status: row?.product?.status ?? "AVAILABLE",
        contentStatus: row?.product?.contentStatus ?? null,
        createdAt: row?.product?.createdAt ?? null,
        updatedAt: row?.product?.updatedAt ?? row?.updatedAt ?? null,
        vendorName: row?.product?.vendor?.name ?? null,

        images,
        imagesCount,
        hasImages: imagesCount > 0,
        hasContent,

        isReadyToPublish: publishMissing.length === 0,
        publishMissing,

        sku: row?.product?.sku ?? null,
        brand: row?.product?.brand?.name ?? row?.watchSpecV2?.brand ?? null,
        primaryImageUrl: null,

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
            }
            : null,
    };
}
