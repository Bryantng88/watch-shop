"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
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

type WatchFilterFormState = {
    q: string;
    sku: string;
    brandId: string;
    vendorId: string;
    hasContent: string;
    hasImages: string;
    saleStage: string;
    opsStage: string;
    sort: string;
};

const EMPTY_SUB_COUNTS = {
    missingContent: 0,
    missingImage: 0,
    reviewDraft: 0,
    reviewSubmitted: 0,
    partialApproved: 0,
    approved: 0,
    posted: 0,
};

const DEFAULT_PAGE_SIZE = "20";
const DEFAULT_SORT = "updatedDesc";
const DEFAULT_VIEW: ViewKey = "draft";

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

function setParam(next: URLSearchParams, key: string, value?: string | null) {
    const normalized = String(value ?? "").trim();
    if (!normalized) next.delete(key);
    else next.set(key, normalized);
}

function sanitizeParams(input: URLSearchParams) {
    const params = new URLSearchParams(input.toString());

    const view = normalizeView(params.get("view"));
    params.set("view", view || DEFAULT_VIEW);

    const sort = params.get("sort") || DEFAULT_SORT;
    params.set("sort", sort);

    const page = Number(params.get("page"));
    params.set("page", Number.isFinite(page) && page > 0 ? String(Math.floor(page)) : "1");

    const pageSize = Number(params.get("pageSize"));
    params.set(
        "pageSize",
        Number.isFinite(pageSize) && pageSize > 0
            ? String(Math.min(Math.floor(pageSize), 100))
            : DEFAULT_PAGE_SIZE,
    );

    const subFilter = normalizeSubFilter(params.get("subFilter"));
    if (subFilterAllowedForView(view, subFilter)) {
        setParam(params, "subFilter", subFilter);
    } else {
        params.delete("subFilter");
    }

    Array.from(params.entries()).forEach(([key, value]) => {
        if (!String(value ?? "").trim()) params.delete(key);
    });

    return params;
}

function filterStateFromParams(params: URLSearchParams): WatchFilterFormState {
    return {
        q: params.get("q") ?? "",
        sku: params.get("sku") ?? "",
        brandId: params.get("brandId") ?? "",
        vendorId: params.get("vendorId") ?? "",
        hasContent: params.get("hasContent") ?? "",
        hasImages: params.get("hasImages") ?? "",
        saleStage: params.get("saleStage") ?? "",
        opsStage: params.get("opsStage") ?? "",
        sort: params.get("sort") ?? DEFAULT_SORT,
    };
}

function emptyFilterState(): WatchFilterFormState {
    return {
        q: "",
        sku: "",
        brandId: "",
        vendorId: "",
        hasContent: "",
        hasImages: "",
        saleStage: "",
        opsStage: "",
        sort: DEFAULT_SORT,
    };
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

function paramsKey(params: URLSearchParams) {
    const normalized = sanitizeParams(params);
    normalized.sort();
    return normalized.toString();
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

    const urlParams = useMemo(() => sanitizeParams(new URLSearchParams(sp.toString())), [sp]);
    const urlKey = useMemo(() => paramsKey(urlParams), [urlParams]);

    const [params, setParams] = useState(urlParams);
    const [listData, setListData] = useState<WatchListResult>(() => dataFromProps(props));
    const [filters, setFilters] = useState<WatchFilterFormState>(() => filterStateFromParams(urlParams));
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    /**
     * URL state and server props must be synced separately.
     *
     * The old implementation reset listData from props every time the URL changed.
     * Because props still contained the first SSR result, clicking page 2/3 updated
     * the pagination state but immediately rendered page-1 rows again.
     */
    useEffect(() => {
        setParams(urlParams);
        setFilters(filterStateFromParams(urlParams));
        setSelectedIds([]);
    }, [urlKey, urlParams]);

    useEffect(() => {
        setListData(dataFromProps(props));
    }, [
        props.initialResult,
        props.items,
        props.total,
        props.page,
        props.pageSize,
        props.totalPages,
        props.counts,
        props.summary,
    ]);

    useEffect(() => {
        const raw = new URLSearchParams(sp.toString());
        const sanitized = sanitizeParams(raw);
        if (raw.toString() !== sanitized.toString()) {
            router.replace(`${pathname}?${sanitized.toString()}`, { scroll: false });
        }
    }, [pathname, router, sp]);

    const rows = listData.items ?? [];

    const currentView = useMemo(
        () => normalizeView(params.get("view")),
        [params],
    );

    const currentSubFilter = useMemo(() => {
        const value = normalizeSubFilter(params.get("subFilter"));
        return subFilterAllowedForView(currentView, value) ? value : "";
    }, [params, currentView]);

    const counts = useMemo(
        () => buildCounts(rows, listData.counts),
        [rows, listData.counts],
    );

    const replaceUrl = useCallback(
        (next: URLSearchParams) => {
            const sanitized = sanitizeParams(next);
            router.replace(`${pathname}?${sanitized.toString()}`, { scroll: false });
            setParams(new URLSearchParams(sanitized.toString()));
            return sanitized;
        },
        [pathname, router],
    );

    async function loadList(next: URLSearchParams) {
        const sanitized = replaceUrl(next);
        setSelectedIds([]);
        setIsLoading(true);

        try {
            const res = await fetch(
                `/api/admin/watches/list?${sanitized.toString()}&_ts=${Date.now()}`,
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

            setListData(normalizeResult(json.data));
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
            setParam(next, "sort", filters.sort || DEFAULT_SORT);
            setParam(next, "page", "1");
        });
    }

    function handleClearFilters() {
        setFilters(emptyFilterState());

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

            setParam(next, "sort", DEFAULT_SORT);
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
        const returnTo = `${pathname}?${sanitizeParams(params).toString()}`;
        navigateWithProgress(
            `/admin/watches/${row.productId}?returnTo=${encodeURIComponent(returnTo)}`,
            "Đang mở chi tiết watch",
        );
    }

    function onEdit(row: WatchRow) {
        const returnTo = `${pathname}?${sanitizeParams(params).toString()}`;
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
