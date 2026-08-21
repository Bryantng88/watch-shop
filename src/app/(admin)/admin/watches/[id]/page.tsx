import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import {
    getWatchEditDetail,
    getWatchServiceProjectionDetail,
    getWatchTradeHistoryDetail,
    getActiveWatchMediaWorkspace,
} from "@/domains/watch/server";
import WatchDetailUiProposal from "@/domains/watch/ui/proposal/WatchDetailUiProposal";

type AuthUser = {
    roles?: unknown[] | null;
    permissions?: unknown[] | null;
} | null;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value as UnknownRecord
        : {};
}

function normalizeAuthValues(items?: unknown[] | null) {
    return (items ?? [])
        .map((item) => {
            if (typeof item === "string") return item;
            const value = asRecord(item);
            return value.name ?? value.code ?? value.key ?? value.slug ?? "";
        })
        .filter(Boolean)
        .map((x) => String(x).trim().toUpperCase());
}

function hasAdmin(user: AuthUser) {
    const roles = normalizeAuthValues(user?.roles);
    const permissions = normalizeAuthValues(user?.permissions);

    return roles.includes("ADMIN") || permissions.includes("ADMIN");
}

function canViewCost(user: AuthUser) {
    const permissions = normalizeAuthValues(user?.permissions);

    return (
        hasAdmin(user) ||
        permissions.includes(PERMISSIONS.PRODUCT_COST_VIEW)
    );
}

function canEditPrice(user: AuthUser) {
    const permissions = normalizeAuthValues(user?.permissions);

    return (
        hasAdmin(user) ||
        permissions.includes(PERMISSIONS.PRODUCT_PRICE_EDIT)
    );
}

function serialize<T>(obj: T): T {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (asRecord(value)._isDecimal) {
                return Number(value);
            }
            return value;
        })
    );
}

function scrubSensitivePrice(detail: unknown) {
    const source = asRecord(detail);
    const acquisition = asRecord(source.acquisition);
    const price = asRecord(source.price);

    return {
        ...source,
        acquisition: source.acquisition
            ? {
                ...acquisition,
                unitCost: null,
            }
            : source.acquisition,
        price: source.price
            ? {
                ...price,
                costPrice: null,
                serviceCost: null,
                landedCost: null,
                minPrice: null,
                pricingNote: null,
            }
            : source.price,
    };
}

function scrubTradeFinancials(tradeHistory: unknown) {
    const source = asRecord(tradeHistory);
    const scrubAmounts = (value: unknown) => Array.isArray(value)
        ? value.map((item) => ({ ...asRecord(item), amount: null }))
        : value;

    return {
        ...source,
        acquisitions: Array.isArray(source.acquisitions)
            ? source.acquisitions.map((item) => ({
                ...asRecord(item),
                unitCost: null,
                amount: null,
            }))
            : source.acquisitions,
        orders: Array.isArray(source.orders)
            ? source.orders.map((item) => {
                const order = asRecord(item);
                return {
                    ...order,
                    amount: order.salePrice ?? order.amount ?? null,
                };
            })
            : source.orders,
        costLedger: scrubAmounts(source.costLedger),
        serviceFees: scrubAmounts(source.serviceFees),
        shipmentFees: scrubAmounts(source.shipmentFees),
        costSummary: source.costSummary
            ? {
                ...asRecord(source.costSummary),
                acquisitionAmount: null,
                serviceAmount: null,
                shipmentAmount: null,
                otherAmount: null,
                landedCost: null,
            }
            : source.costSummary,
    };
}

export default async function WatchDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requirePermission(PERMISSIONS.PRODUCT_VIEW);
    const { id } = await params;

    const [detail, serviceProjection, tradeHistory, mediaWorkspace] =
        await Promise.all([
            getWatchEditDetail(id),
            getWatchServiceProjectionDetail(id),
            getWatchTradeHistoryDetail(id),
            getActiveWatchMediaWorkspace(id),
        ]);

    if (!detail) notFound();
    const mayViewCost = canViewCost(user);
    const mayEditPrice = canEditPrice(user);
    const safeDetail = mayViewCost ? detail : scrubSensitivePrice(detail);
    const safeTradeHistory = mayViewCost
        ? tradeHistory
        : scrubTradeFinancials(tradeHistory);

    return (
        <WatchDetailUiProposal
            detail={serialize(safeDetail)}
            service={serialize(serviceProjection)}
            tradeHistory={serialize(safeTradeHistory)}
            canViewFinancials={mayViewCost}
            live
            canEditPrice={mayEditPrice}
            mediaWorkspace={serialize(mediaWorkspace ?? {})}
        />
    );
}
