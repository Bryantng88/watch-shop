"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";

import { WatchListToolbar } from "../ui/list";
import WatchListViewTabs from "../ui/list/WatchListViewTabs";
import WatchListFilters from "../ui/list/WatchListFilters";
import WatchListTable from "../ui/list/WatchListTable";
import { buildCounts } from "../ui/list/helpers";
import { normalizeWatchListView } from "../shared/watch-status";

import type {
    ViewKey,
    WatchListPageProps,
    WatchListResult,
    WatchListSubFilter,
    WatchRow,
} from "../ui/list/types";

type WatchListClientProps = Partial<WatchListPageProps> & {
    initialResult?: WatchListResult;
    vendors?: { id: string; name: string }[];
    brands?: { id: string; name: string }[];
    canViewCost: boolean;
};

const listCache = new Map<string, WatchListResult>();

const EMPTY_SUB_COUNTS = {
    missingContent: 0,
    missingImage: 0,
    reviewDraft: 0,
    reviewSubmitted: 0,
    partialApproved: 0,
    approved: 0,
    posted: 0,
};

function normalizeView(value: string | null | undefined): ViewKey {
    return normalizeWatchListView(value);
}

function normalizeSubFilter(
    value: string | null | undefined,
): WatchListSubFilter {
    const text = String(value ?? "")
        .trim()
        .toUpperCase();

    const allowed: WatchListSubFilter[] = [
        "",
        "MISSING_CONTENT",
        "MISSING_IMAGE",
        "REVIEW_DRAFT",
        "REVIEW_SUBMITTED",
        "PARTIAL_APPROVED",
        "APPROVED",
        "POSTED",
    ];

    return allowed.includes(text as WatchListSubFilter)
        ? (text as WatchListSubFilter)
        : "";
}

function subFilterAllowedForView(view: ViewKey, subFilter: WatchListSubFilter) {
    if (!subFilter) return true;

    if (view === "processing") {
        return subFilter === "MISSING_CONTENT" || subFilter === "MISSING_IMAGE";
    }

    if (view === "ready") {
        return [
            "REVIEW_DRAFT",
            "REVIEW_SUBMITTED",
            "PARTIAL_APPROVED",
            "APPROVED",
            "POSTED",
        ].includes(subFilter);
    }

    return false;
}
function buildListFetchParams(params: URLSearchParams) {
    return new URLSearchParams(params.toString());
}

function setParam(next: URLSearchParams, key: string, value?: string | null) {
    if (!value) next.delete(key);
    else next.set(key, value);
}

function buildInitialParams(sp: URLSearchParams) {
    const params = new URLSearchParams(sp.toString());

    if (!params.get("view")) params.set("view", "draft");
    if (!params.get("sort")) params.set("sort", "updatedDesc");
    if (!params.get("page")) params.set("page", "1");
    if (!params.get("pageSize")) params.set("pageSize", "20");

    return params;
}

function cacheKey(params: URLSearchParams) {
    const normalized = new URLSearchParams(params.toString());

    Array.from(normalized.keys()).forEach((key) => {
        const value = normalized.get(key);
        if (!value) normalized.delete(key);
    });

    normalized.sort();
    return normalized.toString();
}

function normalizeResult(result: WatchListResult): WatchListResult {
    return {
        ...result,
        items: result.items ?? [],
        total: result.total ?? 0,
        page: result.page ?? 1,
        pageSize: result.pageSize ?? 20,
        totalPages: result.totalPages ?? 1,
        counts: result.counts,
        summary: {
            items: result.summary?.items ?? result.total ?? 0,
            hasContent: result.summary?.hasContent ?? 0,
            hasImages: result.summary?.hasImages ?? 0,
            subCounts: result.summary?.subCounts ?? EMPTY_SUB_COUNTS,
        },
    };
}

function dataFromProps(props: WatchListClientProps): WatchListResult {
    if (props.initialResult) {
        return normalizeResult(props.initialResult);
    }

    return normalizeResult({
        items: props.items ?? [],
        total: props.total ?? 0,
        page: props.page ?? 1,
        pageSize: props.pageSize ?? 20,
        totalPages: props.totalPages ?? 1,
        counts: props.counts,
        summary: props.summary ?? {
            items: props.total ?? 0,
            hasContent: 0,
            hasImages: 0,
            subCounts: EMPTY_SUB_COUNTS,
        },
    } as WatchListResult);
}

function Pagination({
    page,
    totalPages,
    total,
    loading,
    onPage,
}: {
    page: number;
    totalPages: number;
    total: number;
    loading?: boolean;
    onPage: (page: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <div>
                Tổng: <span className="font-semibold text-slate-950">{total}</span> •
                Trang <span className="font-semibold text-slate-950">{page}</span>/
                <span className="font-semibold text-slate-950">{totalPages}</span>
                {loading ? (
                    <span className="ml-2 text-slate-400">Đang tải...</span>
                ) : null}
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={loading || page <= 1}
                    onClick={() => onPage(Math.max(1, page - 1))}
                >
                    ← Trước
                </button>

                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={loading || page >= totalPages}
                    onClick={() => onPage(Math.min(totalPages, page + 1))}
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}

export default function WatchListClient(props: WatchListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const progress = useAppProgress();

    const initialParams = useMemo(() => buildInitialParams(sp), []); // eslint-disable-line react-hooks/exhaustive-deps

    const [params, setParams] = useState(initialParams);
    const [listData, setListData] = useState<WatchListResult>(() => {
        const data = dataFromProps(props);
        listCache.set(cacheKey(buildListFetchParams(initialParams)), data);
        return data;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const rows = listData.items ?? [];

    const currentView = useMemo(
        () => normalizeView(params.get("view")),
        [params],
    );

    const currentSubFilter = useMemo(() => {
        const value = normalizeSubFilter(params.get("subFilter"));
        return subFilterAllowedForView(currentView, value) ? value : "";
    }, [params, currentView]);

    const [filters, setFilters] = useState({
        q: params.get("q") ?? "",
        sku: params.get("sku") ?? "",
        brandId: params.get("brandId") ?? "",
        vendorId: params.get("vendorId") ?? "",
        hasContent: params.get("hasContent") ?? "",
        hasImages: params.get("hasImages") ?? "",
        saleStage: params.get("saleStage") ?? "",
        opsStage: params.get("opsStage") ?? "",
        sort: params.get("sort") ?? "updatedDesc",
    });

    const counts = useMemo(
        () => buildCounts(rows, listData.counts),
        [rows, listData.counts],
    );

    async function loadList(next: URLSearchParams) {
        const fetchParams = buildListFetchParams(next);
        const key = cacheKey(fetchParams);
        const cached = listCache.get(key);

        window.history.pushState(null, "", `${pathname}?${next.toString()}`);
        setParams(new URLSearchParams(next.toString()));
        setSelectedIds([]);

        if (cached) {
            setListData(cached);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(
                `/api/admin/watches/list?${fetchParams.toString()}`,
                {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                },
            );

            const json = await res.json().catch(() => null);

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Không tải được danh sách watch");
            }

            listCache.set(key, json.data);
            setListData(json.data);
        } catch (error) {
            console.error("[WATCH_LIST][LOAD_ERROR]", error);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }
    function pushParams(mutator: (next: URLSearchParams) => void) {
        const next = new URLSearchParams(params.toString());
        mutator(next);

        startTransition(() => {
            void loadList(next);
        });
    }

    function handleViewChange(view: ViewKey) {
        pushParams((next) => {
            setParam(next, "view", view);
            next.delete("subFilter");
            setParam(next, "page", "1");
        });
    }

    function handleSubFilterChange(subFilter: WatchListSubFilter) {
        pushParams((next) => {
            const nextValue = currentSubFilter === subFilter ? "" : subFilter;
            setParam(next, "subFilter", nextValue || null);
            setParam(next, "page", "1");
        });
    }

    function handleApplyFilters() {
        pushParams((next) => {
            setParam(next, "q", filters.q);
            setParam(next, "sku", filters.sku);
            setParam(next, "brandId", filters.brandId);
            setParam(next, "vendorId", filters.vendorId);
            setParam(next, "hasContent", filters.hasContent);
            setParam(next, "hasImages", filters.hasImages);
            setParam(next, "saleStage", filters.saleStage);
            setParam(next, "opsStage", filters.opsStage);
            setParam(next, "sort", filters.sort || "updatedDesc");
            setParam(next, "page", "1");
        });
    }

    function handleClearFilters() {
        const emptyFilters = {
            q: "",
            sku: "",
            brandId: "",
            vendorId: "",
            hasContent: "",
            hasImages: "",
            saleStage: "",
            opsStage: "",
            sort: "updatedDesc",
        };

        setFilters(emptyFilters);

        pushParams((next) => {
            [
                "q",
                "sku",
                "brandId",
                "vendorId",
                "hasContent",
                "hasImages",
                "saleStage",
                "opsStage",
                "subFilter",
            ].forEach((key) => next.delete(key));

            setParam(next, "sort", "updatedDesc");
            setParam(next, "page", "1");
        });
    }

    function handlePage(page: number) {
        pushParams((next) => setParam(next, "page", String(page)));
    }

    function onToggleOne(watchId: string, checked: boolean) {
        setSelectedIds((prev) =>
            checked
                ? [...new Set([...prev, watchId])]
                : prev.filter((x) => x !== watchId),
        );
    }

    function onToggleAll(checked: boolean) {
        setSelectedIds(checked ? displayRows.map((x) => x.id) : []);
    }

    function navigateWithProgress(href: string, title = "Đang chuyển trang") {
        progress.show({
            title,
            message: "Hệ thống đang mở màn hình mới.",
        });

        router.push(href);
        window.setTimeout(() => progress.hide(), 1200);
    }

    function onView(row: WatchRow) {
        const returnTo = `${pathname}?${params.toString()}`;
        navigateWithProgress(
            `/admin/watches/${row.productId}?returnTo=${encodeURIComponent(returnTo)}`,
            "Đang mở chi tiết watch",
        );
    }

    function onEdit(row: WatchRow) {
        const returnTo = `${pathname}?${params.toString()}`;
        navigateWithProgress(
            `/admin/watches/${row.productId}/edit?returnTo=${encodeURIComponent(returnTo)}`,
            "Đang mở form chỉnh sửa",
        );
    }

    function onDelete(row: WatchRow) {
        console.log("TODO delete watch", row);
    }

    function onService(row: WatchRow) {
        navigateWithProgress(`/admin/services/new?productId=${row.productId}`, "Đang mở phiếu service");
    }

    function onQuickOrder(row: WatchRow) {
        navigateWithProgress(`/admin/orders/new?mode=quick&productId=${row.productId}`, "Đang tạo đơn nhanh");
    }

    function onConsign(row: WatchRow) {
        navigateWithProgress(`/admin/consignments/new?productId=${row.productId}`, "Đang mở ký gửi");
    }

    const brandOptions = (props.brands ?? []).map((brand) => ({
        label: brand.name,
        value: brand.id,
    }));

    const vendorOptions = (props.vendors ?? []).map((vendor) => ({
        label: vendor.name,
        value: vendor.id,
    }));

    const loading = isLoading || isPending;
    const displayRows = rows;
    const displayTotal = listData.total;
    return (
        <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 pt-6 lg:px-5 xl:px-6">
            <WatchListToolbar selectedCount={selectedIds.length} />

            <WatchListViewTabs
                value={currentView}
                counts={counts}
                onChange={handleViewChange}
            />

            <WatchListFilters
                filters={filters}
                brandOptions={brandOptions}
                vendorOptions={vendorOptions}
                onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            <div className={loading ? "opacity-60 transition" : "transition"}>
                <WatchListTable
                    items={displayRows}
                    selectedIds={selectedIds}
                    canViewCost={props.canViewCost}
                    currentView={currentView}
                    subFilter={currentSubFilter}
                    subCounts={listData.summary?.subCounts ?? EMPTY_SUB_COUNTS}
                    total={displayTotal}
                    segmentTotal={listData.summary?.items ?? listData.total}
                    onSubFilterChange={handleSubFilterChange}
                    onToggleOne={onToggleOne}
                    onToggleAll={onToggleAll}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onService={onService}
                    onQuickOrder={onQuickOrder}
                    onConsign={onConsign}
                />
            </div>

            <Pagination
                page={listData.page}
                totalPages={listData.totalPages}
                total={listData.total}
                loading={loading}
                onPage={handlePage}
            />
        </div>
    );
}
