import { notFound } from "next/navigation";

import WatchFormClient from "@/domains/watch/client/WatchFormClient";
import {
    getWatchEditDetail,
    listWatchEditOptions,
} from "@/domains/watch/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

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

function canViewCost(user: AuthUser) {
    const permissions = normalizeAuthValues(user?.permissions);

    return (
        hasAdmin(user) ||
        permissions.includes("PRODUCT_COST_VIEW")
    );
}

function canEditPrice(user: AuthUser) {
    const permissions = normalizeAuthValues(user?.permissions);

    return (
        hasAdmin(user) ||
        permissions.includes("PRODUCT_PRICE_EDIT")
    );
}

function serialize<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export default async function WatchEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
    const { id } = await params;

    const [detail, options] = await Promise.all([
        getWatchEditDetail(id),
        listWatchEditOptions(),
    ]);

    if (!detail) notFound();

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
            <WatchFormClient
                detail={serialize(detail)}
                brands={serialize(options.brands)}
                vendors={serialize(options.vendors)}
                categories={serialize(options.categories)}
                postTargets={serialize(options.postTargets ?? [])}
                canViewCost={canViewCost(user)}
                canEditPrice={canEditPrice(user)}
                canReviewContent={hasAdmin(user)}
            />
        </div>
    );
}