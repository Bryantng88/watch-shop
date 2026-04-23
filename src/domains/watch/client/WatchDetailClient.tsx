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

type Props = {
    detail: any;
    images?: any[];
    pricing?: any;
    serviceHistory?: any[];
    tradeHistory?: { acquisitions?: any[]; orders?: any[] } | any[];
    canViewTradeFinancials?: boolean;
};

function normalizeRole(value: any) {
    return String(value ?? "").toUpperCase();
}

function sortImages(items: any[]) {
    return [...items].sort(
        (a, b) =>
            Number(a?.sortOrder ?? 0) - Number(b?.sortOrder ?? 0)
    );
}

export default function WatchDetailClient({
    detail,
    images = [],
    serviceHistory = [],
    tradeHistory,
    canViewTradeFinancials = false,
}: Props) {
    const sortedImages = sortImages(images ?? []);

    const inlineImages = sortedImages.filter(
        (img) => normalizeRole(img?.role) === "INLINE"
    );

    const galleryImages = sortedImages.filter(
        (img) => normalizeRole(img?.role) === "GALLERY"
    );

    return (
        <div className="space-y-6">
            <WatchHeader detail={detail} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <WatchMediaPanel
                        detail={detail}
                        inlineImages={inlineImages}
                        galleryImages={galleryImages}
                        canViewTradeFinancials={canViewTradeFinancials}
                    />

                    <WatchOverviewPanel detail={detail} />
                    <WatchContentPanel detail={detail} />
                    <WatchServicePanel serviceHistory={serviceHistory} />
                    <WatchTradePanel tradeHistory={tradeHistory} />
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <WatchOpsPanel detail={detail} />
                    <WatchPricingPanel
                        detail={detail}
                        canViewTradeFinancials={canViewTradeFinancials}
                    />
                </div>
            </div>
        </div>
    );
}