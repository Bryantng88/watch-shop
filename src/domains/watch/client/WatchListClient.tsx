"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    useAppProgress,
    type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import React from "react";
import { WatchListToolbar } from "../ui/list";
import WatchListViewTabs from "../ui/list/WatchListViewTabs";
import WatchListFilters from "../ui/list/WatchListFilters";
import WatchListTable from "../ui/list/WatchListTable";
import BuyBackWatchModal from "../ui/buy-back/BuyBackWatchModal";
import { buildCounts } from "../ui/list/helpers";
import { normalizeWatchListView } from "../shared/watch-status";
import { buildWatchWorkCaseSource } from "@/domains/work-case/utils/work-case-source";
import type {
    ViewKey,
    WatchListPageProps,
    WatchListResult,
    WatchListSubFilter,
    WatchRow,
} from "../ui/list/types";
import { WatchServiceQuickModal } from "@/domains/service/ui/quick-service";
import {
    markWatchMediaAssetAttachedFromWatchAction,
    requestWatchPhotoshootAction,
} from "./media-work/watch-media-work.actions";
import RaiseWorkCaseModal, { type RaiseWorkCaseSourceContext } from "@/domains/work-case/ui/RaiseWorkCaseModal";
import { getTaskQuickCreateDataAction } from "@/domains/task/actions/task.actions";
import TaskQuickCreateModal, {
    type TaskQuickCreateContext,
    type TaskUserOption,
} from "@/domains/task/ui/quick-create/TaskQuickCreateModal";
import type { TaskTypeOption } from "@/domains/task/server/task-type.types";
import { TaskDomain, TaskMode } from "@prisma/client";

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

function mergePreviousImageFields(
    items: WatchRow[],
    previousItems: WatchRow[],
): WatchRow[] {
    if (!items.length || !previousItems.length) return items;

    const previousByProductId = new Map(
        previousItems.map((item) => [item.productId, item]),
    );

    return items.map((item) => {
        const previous = previousByProductId.get(item.productId);
        if (!previous) return item;

        const hasCurrentImage =
            Boolean(item.imageUrl || item.imageKey) ||
            Number(item.imagesCount ?? 0) > 0 ||
            Boolean(item.hasImages);

        if (hasCurrentImage) return item;

        return {
            ...item,
            imageUrl: previous.imageUrl ?? item.imageUrl,
            imageKey: previous.imageKey ?? item.imageKey,
            imagesCount: previous.imagesCount ?? item.imagesCount,
            hasImages: previous.hasImages ?? item.hasImages,
            imageReady: previous.imageReady ?? item.imageReady,
        };
    });
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
    const notify = useNotify();
    const [serviceQuickRow, setServiceQuickRow] = React.useState<WatchRow | null>(null);
    const [buyBackRow, setBuyBackRow] = React.useState<WatchRow | null>(null);
    const [buyBackSubmitting, setBuyBackSubmitting] = React.useState(false);
    const [buyBackError, setBuyBackError] = React.useState<string | null>(null);
    const [workCaseSource, setWorkCaseSource] =
        useState<RaiseWorkCaseSourceContext | null>(null);
    const [taskModalOpen, setTaskModalOpen] = React.useState(false);
    const [taskUsers, setTaskUsers] = React.useState<TaskUserOption[]>([]);
    const [taskTypes, setTaskTypes] = React.useState<TaskTypeOption[]>([]);
    const [taskCurrentUserId, setTaskCurrentUserId] = React.useState("");
    const [taskContext, setTaskContext] = React.useState<TaskQuickCreateContext | null>(null);
    const urlParams = useMemo(() => sanitizeParams(new URLSearchParams(sp.toString())), [sp]);
    const urlKey = useMemo(() => paramsKey(urlParams), [urlParams]);

    const [params, setParams] = useState(urlParams);
    const [listData, setListData] = useState<WatchListResult>(() => dataFromProps(props));
    const [filters, setFilters] = useState<WatchFilterFormState>(() => filterStateFromParams(urlParams));
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [photoshootSubmitting, setPhotoshootSubmitting] = useState(false);
    const [mediaReviewSubmitting, setMediaReviewSubmitting] = useState(false);

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

    const rows = useMemo(() => listData.items ?? [], [listData.items]);
    const selectedRows = useMemo(
        () => rows.filter((row) => selectedIds.includes(row.id)),
        [rows, selectedIds],
    );
    const photoshootEligibleRows = useMemo(
        () => selectedRows.filter((row) => !row.hasImages && Number(row.imagesCount ?? 0) <= 0),
        [selectedRows],
    );
    const mediaReviewEligibleRows = useMemo(
        () => selectedRows.filter((row) => row.hasContent && row.hasImages && row.productId),
        [selectedRows],
    );

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
            window.history.replaceState(null, "", `${pathname}?${sanitized.toString()}`);
            setParams(new URLSearchParams(sanitized.toString()));
            return sanitized;
        },
        [pathname],
    );

    async function loadList(next: URLSearchParams, options?: { meta?: "full" | "lite" }) {
        const sanitized = replaceUrl(next);
        const requestParams = new URLSearchParams(sanitized.toString());
        if (options?.meta) requestParams.set("meta", options.meta);

        setSelectedIds([]);
        setIsLoading(true);

        try {
            const res = await fetch(
                `/api/admin/watches/list?${requestParams.toString()}&_ts=${Date.now()}`,
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

            setListData((prev) =>
                normalizeResult({
                    ...json.data,
                    items: mergePreviousImageFields(
                        json.data?.items ?? [],
                        prev.items ?? [],
                    ),
                    counts: json.data?.counts ?? prev.counts,
                    summary: json.data?.summary ?? prev.summary,
                }),
            );
        } catch (error) {
            console.error("[WATCH_LIST][LOAD_ERROR]", error);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }

    function pushParams(
        mutator: (next: URLSearchParams) => void,
        options?: { meta?: "full" | "lite" },
    ) {
        const next = new URLSearchParams(params.toString());
        mutator(next);

        startTransition(() => {
            void loadList(next, options);
        });
    }

    function handleViewChange(view: ViewKey) {
        pushParams((next) => {
            setParam(next, "view", view);
            next.delete("subFilter");
            setParam(next, "page", "1");
        }, { meta: "lite" });
    }

    function handleSubFilterChange(subFilter: WatchListSubFilter) {
        pushParams((next) => {
            const nextValue = currentSubFilter === subFilter ? "" : subFilter;
            setParam(next, "subFilter", nextValue || null);
            setParam(next, "page", "1");
        }, { meta: "lite" });
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
        }, { meta: "lite" });
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
        }, { meta: "lite" });
    }

    function handlePage(page: number) {
        pushParams((next) => setParam(next, "page", String(page)), { meta: "lite" });
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

    async function requestSelectedPhotoshoot() {
        if (!photoshootEligibleRows.length || photoshootSubmitting) return;

        setPhotoshootSubmitting(true);

        try {
            const result = await requestWatchPhotoshootAction({
                watchIds: photoshootEligibleRows.map((row) => row.id),
                note: "Requested from Watch list bulk action.",
            });

            notify.success({
                title: "Đã gửi sang Photoshoot",
                message: `${result.requested} watch được gửi, ${result.skipped} watch bỏ qua.`,
            });
            setSelectedIds([]);

            const next = new URLSearchParams(params.toString());
            await loadList(next, { meta: "lite" });
        } catch (error) {
            notify.error({
                title: "Không thể gửi Photoshoot",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể gửi danh sách watch sang Photoshoot.",
            });
        } finally {
            setPhotoshootSubmitting(false);
        }
    }

    async function requestSelectedMediaReview() {
        if (!mediaReviewEligibleRows.length || mediaReviewSubmitting) return;

        setMediaReviewSubmitting(true);
        const total = mediaReviewEligibleRows.length;
        const steps: AppProgressStep[] = mediaReviewEligibleRows.map((row, index) => ({
            id: row.id,
            label: row.title || row.sku || row.productId,
            detail: `Chờ gửi sang WP Xử lý Media (${index + 1}/${total})`,
            status: "pending",
        }));

        progress.show({
            title: "Đang gửi sang WP Xử lý Media",
            message: `0/${total} watch hoàn tất`,
            steps,
        });

        try {
            let sent = 0;
            let skipped = 0;

            for (let index = 0; index < mediaReviewEligibleRows.length; index += 1) {
                const row = mediaReviewEligibleRows[index];
                steps[index] = {
                    ...steps[index],
                    status: "running",
                    detail: `Đang move ${row.title || row.sku || row.productId} sang WP Xử lý Media`,
                };
                progress.update({
                    message: `${index}/${total} watch hoàn tất`,
                    steps: [...steps],
                });

                try {
                    const result = await markWatchMediaAssetAttachedFromWatchAction({
                        productId: row.productId,
                        note: "Submitted to Media Processing review from Watch list bulk action.",
                    });

                    if (result.skipped) {
                        skipped += 1;
                        steps[index] = {
                            ...steps[index],
                            status: "skipped",
                            detail: result.reason ?? "Watch đã được bỏ qua.",
                        };
                    } else {
                        sent += 1;
                        steps[index] = {
                            ...steps[index],
                            status: "done",
                            detail: "Đã gửi vào WP Xử lý Media.",
                        };
                    }
                } catch (error) {
                    skipped += 1;
                    steps[index] = {
                        ...steps[index],
                        status: "error",
                        detail:
                            error instanceof Error
                                ? error.message
                                : "Không thể gửi watch này.",
                    };
                }

                progress.update({
                    message: `${index + 1}/${total} watch hoàn tất`,
                    steps: [...steps],
                });
            }

            notify.success({
                title: "Đã gửi sang Xử lý Media",
                message: `${sent} watch được gửi duyệt, ${skipped} watch bỏ qua.`,
            });
            setSelectedIds([]);

            const next = new URLSearchParams(params.toString());
            await loadList(next, { meta: "lite" });
        } catch (error) {
            notify.error({
                title: "Không thể gửi Xử lý Media",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể gửi danh sách watch sang Workspace Xử lý Media.",
            });
        } finally {
            setMediaReviewSubmitting(false);
            window.setTimeout(() => progress.hide(), 1200);
        }
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
        const productId = String(row.productId || "").trim();

        if (!productId) {
            alert("Watch này chưa có productId");
            return;
        }

        setServiceQuickRow(row);
    }

    function onQuickOrder(row: WatchRow) {
        navigateWithProgress(`/admin/orders/new?mode=quick&productId=${row.productId}`, "Đang tạo đơn nhanh");
    }

    function onConsign(row: WatchRow) {
        navigateWithProgress(`/admin/consignments/new?productId=${row.productId}`, "Đang mở ký gửi");
    }

    function inferWatchTaskTitle(row: WatchRow) {
        return row.title ? `Xử lý watch: ${row.title}` : "Xử lý watch";
    }

    async function onCreateTask(row: WatchRow) {
        try {
            const data = await getTaskQuickCreateDataAction();
            setTaskUsers(data.users ?? []);
            setTaskTypes(data.taskTypes ?? []);
            setTaskCurrentUserId(data.currentUserId ?? "");
            setTaskContext({
                watchId: row.id,
                domain: TaskDomain.WATCH,
                mode: TaskMode.NORMAL,
                titlePreset: inferWatchTaskTitle(row),
                descriptionPreset: [
                    row.sku ? `SKU: ${row.sku}` : null,
                    row.title ? `Watch: ${row.title}` : null,
                ].filter(Boolean).join("\n"),
            });
            setTaskModalOpen(true);
        } catch (error) {
            notify.error({
                title: "Không thể mở tạo task",
                message: error?.message || "Không tải được dữ liệu tạo task.",
            });
        }
    }

    function openWorkCaseFromWatch(row: WatchRow) {
        setWorkCaseSource(
            buildWatchWorkCaseSource({
                watchId: row.id,
                title: row.title,
                sku: row.sku,
                imageUrl: row.imageUrl,
            }),
        );
    }

    function onBuyBack(row: WatchRow) {
        setBuyBackError(null);
        setBuyBackRow(row);
    }

    async function submitBuyBack(payload: {
        productId: string;
        unitCost: number;
        notes?: string | null;
    }) {
        setBuyBackSubmitting(true);
        setBuyBackError(null);

        try {
            const res = await fetch("/api/admin/watches/buy-back", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Không thể tạo phiếu mua lại.");
            }

            const acquisitionId = json.data?.acquisitionId ?? json.data?.id;

            notify.success({
                title: "Đã tạo phiếu mua lại",
                message: "Phiếu BUY_BACK đã được tạo dạng DRAFT.",
            });

            setBuyBackRow(null);

            if (acquisitionId) {
                navigateWithProgress(
                    `/admin/acquisitions/${acquisitionId}`,
                    "Đang mở phiếu mua lại",
                );
            } else {
                router.refresh();
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể tạo phiếu mua lại.";

            setBuyBackError(message);
            notify.error({
                title: "Không thể tạo buy back",
                message,
            });
        } finally {
            setBuyBackSubmitting(false);
        }
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
            <WatchListToolbar
                selectedCount={selectedIds.length}
                photoshootEligibleCount={photoshootEligibleRows.length}
                mediaReviewEligibleCount={mediaReviewEligibleRows.length}
                submittingPhotoshoot={photoshootSubmitting}
                submittingMediaReview={mediaReviewSubmitting}
                onRequestPhotoshoot={requestSelectedPhotoshoot}
                onRequestMediaReview={requestSelectedMediaReview}
            />

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
                    onBuyBack={onBuyBack}
                    onRaiseCase={openWorkCaseFromWatch}
                    onCreateTask={onCreateTask}
                />
            </div>

            <Pagination
                page={listData.page}
                totalPages={listData.totalPages}
                total={listData.total}
                loading={loading}
                onPage={handlePage}
            />
            {buyBackRow ? (
                <BuyBackWatchModal
                    open
                    row={buyBackRow}
                    submitting={buyBackSubmitting}
                    error={buyBackError}
                    onClose={() => {
                        if (buyBackSubmitting) return;
                        setBuyBackRow(null);
                        setBuyBackError(null);
                    }}
                    onSubmit={submitBuyBack}
                />
            ) : null}

            <RaiseWorkCaseModal
                open={!!workCaseSource}
                source={workCaseSource}
                categories={[]}
                onClose={() => setWorkCaseSource(null)}
                onSaved={() => {
                    setWorkCaseSource(null);
                    router.refresh();
                }}
            />

            {taskModalOpen ? (
                <TaskQuickCreateModal
                    open
                    users={taskUsers}
                    taskTypes={taskTypes}
                    currentUserId={taskCurrentUserId}
                    context={taskContext}
                    onClose={() => setTaskModalOpen(false)}
                    onSaved={() => {
                        setTaskModalOpen(false);
                        notify.success({
                            title: "Đã tạo task",
                            message: "Task đã được gắn với watch đang chọn.",
                        });
                        router.refresh();
                    }}
                />
            ) : null}

            {serviceQuickRow ? (
                <WatchServiceQuickModal
                    open
                    productId={serviceQuickRow.productId}
                    productTitle={serviceQuickRow.title}
                    sku={serviceQuickRow.sku}
                    onClose={() => setServiceQuickRow(null)}
                    onUpdated={() => router.refresh()}
                />
            ) : null}
        </div>

    );
}
