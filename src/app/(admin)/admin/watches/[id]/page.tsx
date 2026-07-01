import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import {
    getWatchDetail,
    getWatchServiceHistoryDetail,
    getWatchTradeHistoryDetail,
} from "@/domains/watch/server";
import WatchDetailClient from "@/domains/watch/client/WatchDetailClient";

type AuthUser = {
    roles?: any[] | null;
    permissions?: any[] | null;
} | null;

function normalizeAuthValues(items?: any[] | null) {
    return (items ?? [])
        .map((item) => {
            if (typeof item === "string") return item;
            return item?.name ?? item?.code ?? item?.key ?? item?.slug ?? "";
        })
        .filter(Boolean)
        .map((x) => String(x).trim().toUpperCase());
}

function hasAdmin(user: AuthUser) {
    const roles = normalizeAuthValues(user?.roles);
    const permissions = normalizeAuthValues(user?.permissions);

    return roles.includes("ADMIN") || permissions.includes("ADMIN");
}

function canViewTradeFinancials(user: AuthUser) {
    const permissions = normalizeAuthValues(user?.permissions);

    return (
        hasAdmin(user) ||
        permissions.includes("PRODUCT_COST_VIEW")
    );
}

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) {
                return Number(value);
            }
            return value;
        })
    );
}

export default async function WatchDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requirePermission(PERMISSIONS.PRODUCT_VIEW);
    const { id } = await params;

    const [detail, serviceHistory, tradeHistory] =
        await Promise.all([
            getWatchDetail(id),
            getWatchServiceHistoryDetail(id),
            getWatchTradeHistoryDetail(id),
        ]);

    if (!detail) notFound();

    return (
        <WatchDetailClient
            detail={serialize(detail)}
            serviceHistory={serialize(serviceHistory)}
            tradeHistory={serialize(tradeHistory)}
            canViewTradeFinancials={canViewTradeFinancials(user)}
            canReviewContent={hasAdmin(user)}
        />
    );
}
