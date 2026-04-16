import type { WatchDetail, WatchListItem } from "./watch.types";

export function mapAdminWatchListItem(row: any): WatchListItem {
    const primaryVariant = row?.variants?.[0] ?? null;

    return {
        id: row.id,
        productId: row.id,
        title: row.title ?? "",
        sku: row.sku ?? primaryVariant?.sku ?? null,
        status: row.status,
        salePrice: primaryVariant?.salePrice ?? null,
        costPrice: primaryVariant?.costPrice ?? null,
        hasContent: Boolean(row?.content),
        imageCount: Array.isArray(row?.images) ? row.images.length : 0,
        serviceStatus: row?.serviceStatus ?? null,
    };
}

export function mapWatchDetail(row: any): WatchDetail {
    const primaryVariant = row?.variants?.[0] ?? null;

    return {
        id: row.id,
        productId: row.id,
        title: row.title ?? "",
        status: row.status,
        sku: row.sku ?? primaryVariant?.sku ?? null,
        spec: primaryVariant?.watchSpec ?? null,
        content: row?.content ?? null,
        images: Array.isArray(row?.images)
            ? row.images.map((image: any) => ({
                id: image.id,
                url: image.url,
                role: image.role ?? null,
                sortOrder: image.sortOrder ?? null,
            }))
            : [],
    };
}