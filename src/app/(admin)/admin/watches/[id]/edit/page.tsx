import { notFound } from "next/navigation";

import WatchFormClient from "@/domains/watch/client/WatchFormClient";
import {
    getWatchEditDetail,
    getWatchMediaEditDetail,
} from "@/domains/watch/server/detail/watch-detail.service";
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

function compactOption(item?: { id?: string | null; name?: string | null; slug?: string | null; platform?: string | null } | null) {
    if (!item?.id || !item?.name) return null;

    return {
        id: item.id,
        name: item.name,
        ...(item.slug ? { slug: item.slug } : {}),
        ...(item.platform ? { platform: item.platform } : {}),
    };
}

function uniqOptions<T extends { id: string }>(items: Array<T | null>) {
    const byId = new Map<string, T>();

    for (const item of items) {
        if (!item?.id) continue;
        byId.set(item.id, item);
    }

    return Array.from(byId.values());
}

function getRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object"
        ? (value as Record<string, unknown>)
        : null;
}

function buildMediaEditOptions(detail: unknown) {
    const record = getRecord(detail);
    const postTargets = record?.postTargets;

    return {
        brands: uniqOptions([compactOption(getRecord(record?.brand))]),
        vendors: uniqOptions([compactOption(getRecord(record?.vendor))]),
        categories: uniqOptions([compactOption(getRecord(record?.category))]),
        postTargets: uniqOptions(
            (Array.isArray(postTargets) ? postTargets : []).map((item) =>
                compactOption(getRecord(item)),
            ),
        ),
    };
}

export default async function WatchEditPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const startedAt = perfNow();
    const user = await perfStep("watch-edit-page", "requirePermission", () =>
        requirePermission(PERMISSIONS.PRODUCT_UPDATE),
    );
    const { id } = await params;
    const query = await searchParams;
    const isEmbeddedMediaMode =
        query.embedded === "1" && query.mode === "media";

    const [detail, options] = isEmbeddedMediaMode
        ? [
            await perfStep("watch-edit-page", "getWatchMediaEditDetail", () =>
                getWatchMediaEditDetail(id),
            ),
            null,
        ]
        : await Promise.all([
            perfStep("watch-edit-page", "getWatchEditDetail", () =>
                getWatchEditDetail(id),
            ),
            perfStep("watch-edit-page", "listWatchEditOptions", () =>
                listWatchEditOptions(),
            ),
        ]);

    if (!detail) notFound();
    const editOptions = options ?? buildMediaEditOptions(detail);

    perfLog("watch-edit-page", "totalBeforeRender", startedAt);

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
            <WatchFormClient
                detail={serialize(detail)}
                brands={serialize(editOptions.brands)}
                vendors={serialize(editOptions.vendors)}
                categories={serialize(editOptions.categories)}
                postTargets={serialize(editOptions.postTargets ?? [])}
                canViewCost={canViewCost(user)}
                canEditPrice={canEditPrice(user)}
                canReviewContent={hasAdmin(user)}
            />
        </div>
    );
}
