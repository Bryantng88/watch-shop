import { notFound } from "next/navigation";

import WatchFormClient from "@/domains/watch/client/WatchFormClient";
import {
    getWatchEditDetail,
    listWatchEditOptions,
} from "@/domains/watch/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

function canViewCost(user: {
    roles?: string[] | null;
    permissions?: string[] | null;
} | null) {
    const roles = (user?.roles ?? []).map((x) => String(x).trim().toUpperCase());
    const permissions = (user?.permissions ?? []).map((x) => String(x).trim());

    return (
        roles.includes("ADMIN") ||
        permissions.includes("ADMIN") ||
        permissions.includes("PRODUCT_COST_VIEW")
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
    await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

    const { id } = await params;

    const [detail, options, user] = await Promise.all([
        getWatchEditDetail(id),
        listWatchEditOptions(),
        null,
    ]);

    if (!detail) notFound();

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
            <WatchFormClient
                detail={serialize(detail)}
                brands={serialize(options.brands)}
                vendors={serialize(options.vendors)}
                categories={serialize(options.categories)}
                canViewCost={canViewCost(user)}
            />
        </div>
    );
}