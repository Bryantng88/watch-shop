import { notFound } from "next/navigation";

import WatchFormClient from "@/domains/watch/client/WatchFormClient";
import { getWatchEditDetail } from "@/domains/watch/server/detail/watch-detail.service";
import { listWatchEditOptions } from "@/domains/watch/server/detail/watch-edit-options.repo";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";

type AuthUser = {
    roles?: unknown[] | null;
    permissions?: unknown[] | null;
} | null;

function normalizeAuthValues(items?: unknown[] | null) {
    return (items ?? [])
        .map((item) => {
            if (typeof item === "string") return item;
            if (!item || typeof item !== "object") return "";
            const record = item as Record<string, unknown>;
            return record.name ?? record.code ?? record.key ?? record.slug ?? "";
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
    const startedAt = perfNow();
    const user = await perfStep("watch-edit-page", "requirePermission", () =>
        requirePermission(PERMISSIONS.PRODUCT_UPDATE),
    );
    const { id } = await params;

    const [detail, options] = await Promise.all([
        perfStep("watch-edit-page", "getWatchEditDetail", () =>
            getWatchEditDetail(id),
        ),
        perfStep("watch-edit-page", "listWatchEditOptions", () =>
            listWatchEditOptions(),
        ),
    ]);

    if (!detail) notFound();

    perfLog("watch-edit-page", "totalBeforeRender", startedAt);

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
