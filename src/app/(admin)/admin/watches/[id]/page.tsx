import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import {
    getWatchEditDetail,
    getWatchServiceHistoryDetail,
    getWatchTradeHistoryDetail,
} from "@/domains/watch/server";
import WatchWorkbenchClient from "@/domains/watch/client/workbench/WatchWorkbenchClient";

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

function scrubSensitivePrice(detail: any) {
    if (!detail) return detail;

    return {
        ...detail,
        acquisition: detail.acquisition
            ? {
                ...detail.acquisition,
                unitCost: null,
            }
            : detail.acquisition,
        price: detail.price
            ? {
                ...detail.price,
                costPrice: null,
                serviceCost: null,
                landedCost: null,
                minPrice: null,
                pricingNote: null,
            }
            : detail.price,
    };
}

function scrubTradeFinancials(tradeHistory: any) {
    if (!tradeHistory || Array.isArray(tradeHistory)) return tradeHistory;

    return {
        ...tradeHistory,
        acquisitions: Array.isArray(tradeHistory.acquisitions)
            ? tradeHistory.acquisitions.map((item: any) => ({
                ...item,
                unitCost: null,
                amount: null,
            }))
            : tradeHistory.acquisitions,
        orders: Array.isArray(tradeHistory.orders)
            ? tradeHistory.orders.map((item: any) => ({
                ...item,
                amount: item.salePrice ?? item.amount ?? null,
            }))
            : tradeHistory.orders,
    };
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
            getWatchEditDetail(id),
            getWatchServiceHistoryDetail(id),
            getWatchTradeHistoryDetail(id),
        ]);

    if (!detail) notFound();
    const isAdmin = hasAdmin(user);
    const safeDetail = isAdmin ? detail : scrubSensitivePrice(detail);
    const safeTradeHistory = isAdmin
        ? tradeHistory
        : scrubTradeFinancials(tradeHistory);

    return (
        <WatchWorkbenchClient
            detail={serialize(safeDetail)}
            serviceHistory={serialize(serviceHistory)}
            tradeHistory={serialize(safeTradeHistory)}
            permissions={{
                canViewSensitivePrice: isAdmin,
                canEditPrice: isAdmin,
            }}
        />
    );
}
