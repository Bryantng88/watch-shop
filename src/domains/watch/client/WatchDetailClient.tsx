"use client";

import Link from "next/link";
import WatchHeader from "@/domains/watch/ui/detail/WatchHeader";
import WatchImageGrid from "@/domains/watch/ui/detail/WatchImageGrid";
import WatchSpecCard from "@/domains/watch/ui/detail/WatchSpecCard";
import WatchPricingCard from "@/domains/watch/ui/detail/WatchPricingCard";
import WatchStateCard from "@/domains/watch/ui/detail/WatchStateCard";

type Props = {
    detail: any;
    images: any[];
    pricing: any;
    serviceHistory: any[];
    tradeHistory: any[];
    canViewTradeFinancials: boolean;
};

export default function WatchDetailClient({
    detail,
    images,
    pricing,
    canViewTradeFinancials,
}: Props) {
    return (
        <div className="space-y-6">
            <WatchHeader detail={detail} />

            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/admin/watches/${detail.productId}/edit`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                >
                    Edit watch
                </Link>
            </div>

            <WatchImageGrid images={images} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <WatchSpecCard detail={detail} />
                <WatchPricingCard
                    pricing={pricing}
                    canViewTradeFinancials={canViewTradeFinancials}
                />
                <WatchStateCard detail={detail} />
            </div>
        </div>
    );
}