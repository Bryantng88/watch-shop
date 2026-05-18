import { isWatchServiceReady } from "../../shared/watch-status";
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
    if (Array.isArray(row?.product?.productImage))
        return row.product.productImage;
    if (Array.isArray(row?.productImage)) return row.productImage;
    if (Array.isArray(row?.images)) return row.images;
    return [];
}

function normalizeRole(value: any) {
    return String(value ?? "").toUpperCase();
}

function sortImages(images: any[]) {
    return [...images].sort(
        (a: any, b: any) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0),
    );
}

const WATCH_THUMBNAIL_IMAGE_ROLES = ["INLINE", "GALLERY"];
const WATCH_READY_IMAGE_ROLES = ["GALLERY"];

function getThumbnailImages(row: any) {
    return sortImages(
        pickImages(row).filter((img: any) =>
            WATCH_THUMBNAIL_IMAGE_ROLES.includes(normalizeRole(img?.role)),
        ),
    );
}

function getReadyImages(row: any) {
    return sortImages(
        pickImages(row).filter((img: any) =>
            WATCH_READY_IMAGE_ROLES.includes(normalizeRole(img?.role)),
        ),
    );
}

function getPreferredListImage(row: any) {
    const images = getThumbnailImages(row);
    return (
        images.find((img: any) => normalizeRole(img?.role) === "INLINE") ??
        images.find((img: any) => normalizeRole(img?.role) === "GALLERY") ??
        images[0] ??
        null
    );
}

export function mapWatchImage(row: any) {
    const picked = getPreferredListImage(row);

    if (!picked) return null;

    const fileKey =
        picked?.fileKey ?? picked?.imageKey ?? picked?.key ?? picked?.path ?? null;
    if (!fileKey) return picked?.url ?? null;

    return buildMediaUrl(fileKey);
}

export function countListImages(row: any) {
    const precomputed = Number(row?.__imagesCount);
    if (Number.isFinite(precomputed) && precomputed >= 0) return precomputed;

    return getReadyImages(row).length;
}

export function hasValidContent(row: any) {
    const content = row?.watchContent ?? row?.content;
    if (!content) return false;

    const hasTitle = Boolean(String(content?.titleOverride ?? "").trim());
    const hasHook = Boolean(String(content?.hookText ?? "").trim());
    const hasBody = Boolean(String(content?.body ?? "").trim());
    const hasSummary = Boolean(String(content?.summary ?? "").trim());
    const hasBulletSpecs =
        Array.isArray(content?.bulletSpecs) &&
        content.bulletSpecs.some((item: any) => Boolean(String(item ?? "").trim()));

    return hasTitle || hasHook || hasBody || hasSummary || hasBulletSpecs;
}

export function normalizeNumber(value: any) {
    if (value == null) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function getOpenServiceIssuesCount(row: any) {
    const requests = row?.product?.serviceRequest ?? row?.serviceRequest ?? [];

    if (!Array.isArray(requests)) return 0;

    return requests.reduce((total: number, request: any) => {
        const issues = Array.isArray(request?.technicalIssue)
            ? request.technicalIssue
            : [];

        const openIssues = issues.filter((issue: any) => {
            const status = String(issue?.executionStatus ?? "").toUpperCase();
            return !["DONE", "COMPLETED", "CLOSED", "CANCELLED"].includes(status);
        });

        return total + openIssues.length;
    }, 0);
}

type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PARTIAL";

function getReviewStatus(row: any, targetType: "CONTENT" | "IMAGE") {
    const found = row?.reviewStates?.find(
        (item: any) => String(item?.targetType).toUpperCase() === targetType,
    );

    return String(found?.status ?? "DRAFT").toUpperCase();
}

function normalizeContentStatus(row: any): ReviewStatus | "PUBLISHED" {
    if (row?.isContentDownloaded && row?.isImageDownloaded) {
        return "PUBLISHED";
    }

    const contentStatus = getReviewStatus(row, "CONTENT");
    const imageStatus = getReviewStatus(row, "IMAGE");

    if (contentStatus === "REJECTED" || imageStatus === "REJECTED") {
        return "REJECTED";
    }

    if (contentStatus === "APPROVED" && imageStatus === "APPROVED") {
        return "APPROVED";
    }

    if (contentStatus === "APPROVED" || imageStatus === "APPROVED") {
        return "PARTIAL";
    }

    if (contentStatus === "SUBMITTED" || imageStatus === "SUBMITTED") {
        return "SUBMITTED";
    }

    return "DRAFT";
}
export function formatDateTime(value?: string | Date | null): string {
    if (!value) return "-";

    const date = new Date(value);

    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}
function buildReadyReviewStatus(row: any): WatchRow["reviewStatus"] {
    if (Boolean(row?.isContentDownloaded && row?.isImageDownloaded)) {
        return "POSTED";
    }

    const contentStatus =
        getReviewStateStatus(row, "CONTENT") ||
        String(row?.contentReviewStatus ?? row?.contentStatus ?? "").toUpperCase();

    const imageStatus =
        getReviewStateStatus(row, "IMAGE") ||
        String(row?.imageReviewStatus ?? row?.imageStatus ?? "").toUpperCase();

    if (contentStatus === "APPROVED" && imageStatus === "APPROVED") {
        return "APPROVED";
    }

    if (contentStatus === "APPROVED" || imageStatus === "APPROVED") {
        return "PARTIAL_APPROVED";
    }

    if (contentStatus === "SUBMITTED" || imageStatus === "SUBMITTED") {
        return "SUBMITTED";
    }

    return "DRAFT";
}

function getReviewStateStatus(row: any, targetType: "CONTENT" | "IMAGE") {
    return String(
        row?.reviewStates?.find((item: any) => item?.targetType === targetType)
            ?.status ?? "",
    ).toUpperCase();
}

export function mapWatchRow(row: any): WatchRow {
    const product = row?.product ?? row ?? {};
    const imagesCount = countListImages(row);
    const hasImages = imagesCount > 0;
    const hasContent = hasValidContent(row);
    const contentStatus = normalizeContentStatus(row);
    const serviceIssuesCount = getOpenServiceIssuesCount(row);
    const serviceReady = isWatchServiceReady(row?.serviceState);
    const reviewStatus = buildReadyReviewStatus(row);
    const price = row?.watchPrice ?? row?.price ?? {};

    return {
        id: String(row?.id ?? product?.id ?? ""),
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

        vendorName: product?.vendor?.name ?? row?.vendor?.name ?? null,

        imageUrl: mapWatchImage(row),
        imageKey:
            getPreferredListImage(row)?.fileKey ??
            getPreferredListImage(row)?.imageKey ??
            getPreferredListImage(row)?.key ??
            null,
        imagesCount,
        hasImages,
        hasContent,
        contentStatus,
        isContentDownloaded: Boolean(row?.isContentDownloaded),
        isImageDownloaded: Boolean(row?.isImageDownloaded),
        isPosted: Boolean(row?.isContentDownloaded && row?.isImageDownloaded),

        serviceIssuesCount,
        reviewStatus,
        postReadiness: reviewStatus,
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
        lastUpdatedBy: getLastReviewActor(row),
        contentReady: hasContent,
        imageReady: hasImages,
        serviceReady,
        createdAt: row.createdAt ?? null,
        specStatus: row?.specStatus ?? "PENDING",
    };
}

export function buildCounts(
    rows: WatchRow[],
    counts?: Partial<WatchListCounts> | null,
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

export function specStatusText(row: WatchRow) {
    switch (row.specStatus) {
        case "READY":
            return "Spec sẵn sàng";
        case "PARTIAL":
            return "Thiếu spec";
        case "FAILED":
            return "Spec lỗi";
        default:
            return "Chưa có spec";
    }
}

export function specStatusTone(row: WatchRow) {
    switch (row.specStatus) {
        case "READY":
            return "text-emerald-600";
        case "PARTIAL":
            return "text-amber-600";
        case "FAILED":
            return "text-rose-500";
        default:
            return "text-slate-500";
    }
}
function getLastReviewActor(row: any) {
    const states = row?.reviewStates ?? [];
    const events = states
        .flatMap((state: any) => [
            state.reviewedAt
                ? {
                    at: state.reviewedAt,
                    userId: state.reviewedById,
                }
                : null,
            state.submittedAt
                ? {
                    at: state.submittedAt,
                    userId: state.submittedById,
                }
                : null,
        ])
        .filter((x: any) => x?.userId && x?.at)
        .sort(
            (a: any, b: any) => new Date(b.at).getTime() - new Date(a.at).getTime(),
        );

    const latest = events[0];
    if (!latest) return null;

    const user = row.__userMap?.get(latest.userId);

    return {
        id: latest.userId,
        name: user?.name ?? null,
        email: user?.email ?? null,
    };
}
export function contentStatusText(row: WatchRow) {
    const status = String(row.contentStatus ?? "DRAFT").toUpperCase();

    const map: Record<string, string> = {
        DRAFT: "Chưa gửi duyệt",
        SUBMITTED: "Chờ duyệt",
        APPROVED: "Đã duyệt",
        REJECTED: "Trả về",
        PARTIAL: "Duyệt một phần",
        PUBLISHED: "Đã đăng",
        ARCHIVED: "Lưu trữ",
        PROCESSING: "Đang xử lý",
    };

    return map[status] ?? status;
}

export function contentStatusTone(row: WatchRow) {
    const status = String(row.contentStatus ?? "DRAFT").toUpperCase();

    if (status === "PUBLISHED") {
        return "bg-violet-50 text-violet-700 ring-violet-200";
    }

    if (status === "APPROVED") {
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (status === "PARTIAL") {
        return "bg-blue-50 text-blue-700 ring-blue-200";
    }

    if (status === "SUBMITTED") {
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    if (status === "REJECTED") {
        return "bg-rose-50 text-rose-700 ring-rose-200";
    }

    if (status === "PROCESSING") {
        return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    }

    return "bg-slate-50 text-slate-600 ring-slate-200";
}
