"use client";

import WatchHeader from "../ui/detail/WatchHeader";
import WatchMediaPanel from "../ui/detail/WatchMediaPanel";
import {
    WatchOpsPanel,
    WatchOverviewPanel,
} from "../ui/detail/WatchOverviewPanel";
import WatchPricingPanel from "../ui/detail/WatchPricingPanel";
import WatchContentPanel from "../ui/detail/WatchContentPanel";
import WatchServicePanel from "../ui/detail/WatchServicePanel";
import WatchTradePanel from "../ui/detail/WatchTradePanel";
import { ADMIN_DETAIL_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";

type Props = {
    detail: any;
    images?: any[];
    serviceHistory?: any[];
    tradeHistory?: { acquisitions?: any[]; orders?: any[] } | any[];
    canViewTradeFinancials?: boolean;
    canReviewContent?: boolean;
};

function normalizeRole(value: any) {
    return String(value ?? "").toUpperCase();
}

function buildMediaUrl(value: any) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;

    if (
        raw.startsWith("http://") ||
        raw.startsWith("https://") ||
        raw.startsWith("blob:") ||
        raw.startsWith("data:") ||
        raw.startsWith("/api/media/sign")
    ) {
        return raw;
    }

    const key = raw.replace(/^\/+/, "");
    return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

function normalizeImage(image: any) {
    if (!image) return null;

    const raw =
        image.url ??
        image.imageUrl ??
        image.src ??
        image.fileKey ??
        image.key ??
        image.path ??
        null;

    const src = buildMediaUrl(raw);

    return {
        ...image,
        key: image.key ?? image.fileKey ?? null,
        url: src,
        imageUrl: src,
        src,
    };
}

function sortImages(items: any[]) {
    return [...(items ?? [])].sort(
        (a, b) => Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
    );
}

export default function WatchDetailClient({
    detail,
    images,
    serviceHistory = [],
    tradeHistory,
    canViewTradeFinancials = false,
    canReviewContent = false,
}: Props) {
    const sourceImages = Array.isArray(images) && images.length > 0
        ? images
        : Array.isArray(detail?.images)
            ? detail.images
            : [];

    const sortedImages = sortImages(sourceImages)
        .map(normalizeImage)
        .filter(Boolean);

    const inlineImage =
        sortedImages.find((img) => normalizeRole(img?.role) === "INLINE") ??
        sortedImages.find((img) => normalizeRole(img?.role) === "COVER") ??
        sortedImages.find((img) => normalizeRole(img?.role) === "THUMB") ??
        sortedImages.find((img) => normalizeRole(img?.role) === "GALLERY") ??
        null;

    const galleryImages = sortedImages.filter(
        (img) => normalizeRole(img?.role) === "GALLERY"
    );

    return (
        <div className={ADMIN_DETAIL_CONTENT_CLASS}>
            <WatchHeader detail={detail} inlineImage={inlineImage} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <WatchMediaPanel
                        detail={detail}
                        galleryImages={galleryImages}
                    />
                    <WatchContentPanel
                        detail={detail}
                        canReviewContent={canReviewContent}
                    />
                    <WatchOverviewPanel detail={detail} />



                    <WatchServicePanel serviceHistory={serviceHistory} />


                </div>

                <div className="space-y-6 xl:col-span-4">
                    <WatchOpsPanel detail={detail} />

                    <WatchPricingPanel
                        detail={detail}
                        canViewTradeFinancials={canViewTradeFinancials}
                    />
                    <WatchTradePanel
                        tradeHistory={tradeHistory}
                        canViewTradeFinancials={canViewTradeFinancials}
                    />
                </div>
            </div>
        </div>
    );
}
