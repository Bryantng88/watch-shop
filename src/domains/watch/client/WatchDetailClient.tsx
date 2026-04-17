"use client";

import WatchHeader from "../ui/list/detail/WatchHeader";
import WatchMediaPanel from "../ui/list/detail/WatchMediaPanel";
import { WatchOpsPanel, WatchOverviewPanel } from "../ui/list/detail/WatchOverviewPanel";
import WatchPricingPanel from "../ui/list/detail/WatchPricingPanel";
import WatchContentPanel from "../ui/list/detail/WatchContentPanel";
import WatchServicePanel from "../ui/list/detail/WatchServicePanel";
import WatchTradePanel from "../ui/list/detail/WatchTradePanel";
import { CollapsibleSection, TinyStat, boolText } from "../ui/list/detail/shared";
import { Image as ImageIcon } from "lucide-react";

type Props = {
    detail: any;
    images?: any[];
    pricing?: any;
    serviceHistory?: any[];
    tradeHistory?: { acquisitions?: any[]; orders?: any[] } | any[];
    canViewTradeFinancials?: boolean;
};

export default function WatchDetailClient({
    detail,
    images = [],
    serviceHistory = [],
    tradeHistory,
    canViewTradeFinancials = false,
}: Props) {
    const galleryCount = (images ?? []).filter((img) => String(img?.role ?? "").toUpperCase() === "GALLERY").length || (images?.length ?? 0);

    return (
        <div className="space-y-6">
            <WatchHeader detail={detail} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <WatchMediaPanel detail={detail} images={images} canViewTradeFinancials={canViewTradeFinancials} />
                    <WatchOverviewPanel detail={detail} />
                    <WatchContentPanel detail={detail} />
                    <WatchServicePanel serviceHistory={serviceHistory} />
                    <WatchTradePanel tradeHistory={tradeHistory} />
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <WatchOpsPanel detail={detail} />
                    <WatchPricingPanel detail={detail} canViewTradeFinancials={canViewTradeFinancials} />
                    <CollapsibleSection
                        title="Hình ảnh & phụ kiện"
                        desc="Theo dõi nhanh media và phụ kiện đi kèm."
                        icon={<ImageIcon className="h-5 w-5" />}
                        defaultOpen
                    >
                        <div className="grid grid-cols-1 gap-3">
                            <TinyStat label="Số ảnh" value={galleryCount} />
                            <TinyStat label="Has box" value={boolText(detail?.watch?.hasBox ?? detail?.spec?.boxIncluded)} />
                            <TinyStat label="Has papers" value={boolText(detail?.watch?.hasPapers ?? detail?.spec?.cardIncluded)} />
                            <TinyStat label="Booklet" value={boolText(detail?.spec?.bookletIncluded)} />
                            <TinyStat label="Card" value={boolText(detail?.spec?.cardIncluded)} />
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    );
}
