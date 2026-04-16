import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import {
    getWatchDetail,
    getWatchImages,
    getWatchPricing,
    getWatchServiceHistoryDetail,
    getWatchTradeHistoryDetail,
} from "@/domains/watch/server";
import WatchDetailClient from "@/domains/watch/client/WatchDetailClient";

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function WatchDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);

    const { id } = await params;

    const [detail, images, pricing, serviceHistory, tradeHistory] =
        await Promise.all([
            getWatchDetail(id),
            getWatchImages(id),
            getWatchPricing(id),
            getWatchServiceHistoryDetail(id),
            getWatchTradeHistoryDetail(id),
        ]);

    if (!detail) notFound();

    return (
        <WatchDetailClient
            detail={serialize(detail)}
            images={serialize(images)}
            pricing={serialize(pricing)}
            serviceHistory={serialize(serviceHistory)}
            tradeHistory={serialize(tradeHistory)}
            canViewTradeFinancials={true}
        />
    );
}