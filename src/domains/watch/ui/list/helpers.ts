import type { WatchListCounts, WatchRow } from "./types";

export function formatMoney(value?: number | null) {
    if (value == null || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("vi-VN").format(value);
}

export function buildMediaUrl(fileKey?: string | null) {
    if (!fileKey) return null;
    return `/api/media/sign?key=${encodeURIComponent(fileKey)}`;
}

function pickImages(row: any) {
    if (Array.isArray(row?.product?.productImage)) return row.product.productImage;
    if (Array.isArray(row?.productImage)) return row.productImage;
    if (Array.isArray(row?.images)) return row.images;
    return [];
}

function normalizeRole(value: any) {
    return String(value ?? "").toUpperCase();
}

function getInlineImages(row: any) {
    return pickImages(row)
        .filter((img: any) => normalizeRole(img?.role) === "INLINE")
        .sort((a: any, b: any) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
}

function getGalleryImages(row: any) {
    return pickImages(row)
        .filter((img: any) => normalizeRole(img?.role) === "GALLERY")
        .sort((a: any, b: any) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
}

export function mapWatchImage(row: any) {
    const inlineImages = getInlineImages(row);
    const picked = inlineImages[0];

    if (!picked) return null;

    const fileKey =
        picked?.fileKey ??
        picked?.key ??
        picked?.path ??
        null;

    if (!fileKey) return picked?.url ?? null;

    return buildMediaUrl(fileKey);
}

export function hasValidContent(row: any) {
    const content = row?.watchContent ?? row?.content;
    if (!content) return false;

    const hasHook = Boolean(String(content?.hookText ?? "").trim());
    const hasBody = Boolean(String(content?.body ?? "").trim());
    const hasSummary = Boolean(String(content?.summary ?? "").trim());
    const hasBulletSpecs =
        Array.isArray(content?.bulletSpecs) &&
        content.bulletSpecs.some((item: any) => Boolean(String(item ?? "").trim()));

    return hasHook || hasBody || hasSummary || hasBulletSpecs;
}

export function normalizeNumber(value: any) {
    if (value == null) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function mapWatchRow(row: any): WatchRow {
    const product = row?.product ?? row ?? {};
    const galleryImages = getGalleryImages(row);

    const imagesCount = galleryImages.length;
    const hasImages = imagesCount > 0;
    const hasContent = hasValidContent(row);

    const price = row?.watchPrice ?? row?.price ?? {};

    return {
        id: String(row?.id ?? ""),
        productId: String(row?.productId ?? product?.id ?? ""),
        sku: String(product?.sku ?? row?.sku ?? ""),
        title: String(product?.title ?? row?.title ?? ""),
        slug: product?.slug ?? row?.slug ?? null,

        brandName:
            product?.brand?.name ??
            row?.brand?.name ??
            row?.watchSpecV2?.brand ??
            row?.spec?.brand ??
            null,

        vendorName:
            product?.vendor?.name ??
            row?.vendor?.name ??
            null,

        imageUrl: mapWatchImage(row), // chỉ lấy INLINE
        imagesCount,                  // chỉ đếm GALLERY
        hasImages,                    // readiness image = có GALLERY
        hasContent,

        serviceState: row?.serviceState ?? null,
        stockState: row?.stockState ?? null,
        saleState: row?.saleState ?? null,
        conditionGrade: row?.conditionGrade ?? null,

        serviceLabel: row?.serviceState ?? null,
        statusLabel: row?.saleState ?? row?.stockState ?? null,

        salePrice: normalizeNumber(price?.salePrice),
        listPrice: normalizeNumber(price?.listPrice),
        costPrice: normalizeNumber(price?.costPrice),
        minPrice: normalizeNumber(price?.minPrice),

        updatedAt: row?.updatedAt ? new Date(row.updatedAt).toISOString() : null,

        contentReady: hasContent,
        imageReady: hasImages,
        serviceReady: !row?.serviceRequest || row?.serviceState === "DONE",
    };
}

export function buildCounts(
    rows: WatchRow[],
    counts?: Partial<WatchListCounts> | null
): WatchListCounts {
    return {
        draft: Number(counts?.draft ?? 0),
        processing: Number(counts?.processing ?? 0),
        ready: Number(counts?.ready ?? 0),
        hold: Number(counts?.hold ?? 0),
        sold: Number(counts?.sold ?? 0),
        all: Number(counts?.all ?? rows?.length ?? 0),
    };
}

export function formatRelativeStatus(row: WatchRow) {
    if (row.saleState === "READY") return "Sẵn sàng bán";
    if (row.saleState === "HOLD") return "Đang giữ";
    if (row.saleState === "SOLD") return "Đã bán";
    return "Đang hoàn thiện";
}

export function contentStatusText(row: WatchRow) {
    return row.contentReady ? "Đã có" : "Chưa có";
}

export function imageStatusText(row: WatchRow) {
    return row.imageReady ? `Đã có (${row.imagesCount})` : "Chưa có";
}

export function serviceStatusText(row: WatchRow) {
    return row.serviceReady ? "Không cần service" : "Cần xử lý";
}