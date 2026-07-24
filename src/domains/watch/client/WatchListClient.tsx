"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    useAppProgress,
    type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import {
    BusinessEntityPreviewModal,
    useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import React from "react";
import { WatchListToolbar } from "../ui/list";
import WatchListFilters from "../ui/list/WatchListFilters";
import WatchListTable from "../ui/list/WatchListTable";
import BuyBackWatchModal from "../ui/buy-back/BuyBackWatchModal";
import { buildWatchWorkCaseSource } from "@/domains/work-case/utils/work-case-source";
import type {
    WatchListPageProps,
    WatchListResult,
    WatchRow,
} from "../ui/list/types";
import {
    markWatchMediaAssetAttachedFromWatchAction,
    requestWatchPhotoshootAction,
} from "./media-work/watch-media-work.actions";
import {
    confirmDuplicateWatchAction,
    permanentlyDeleteDuplicateWatchAction,
    restoreDuplicateWatchAction,
} from "./duplicate/watch-duplicate.actions";
import RaiseWorkCaseModal, { type RaiseWorkCaseSourceContext } from "@/domains/work-case/ui/RaiseWorkCaseModal";
import { getTaskQuickCreateDataAction } from "@/domains/task/actions/task.actions";
import TaskQuickCreateModal, {
    type TaskQuickCreateContext,
    type TaskUserOption,
} from "@/domains/task/ui/quick-create/TaskQuickCreateModal";
import type { TaskTypeOption } from "@/domains/task/server/task-type.types";
import { TaskDomain, TaskMode } from "@prisma/client";
import {
    AsyncBusinessListDashboard,
    BusinessListShell,
    type BusinessListDashboardWidgetKey,
} from "@/domains/shared/ui/business-list";

const WATCH_DASHBOARD_WIDGETS: BusinessListDashboardWidgetKey[] = [
    "overview",
    "value-trend",
    "status-breakdown",
    "recent-activity",
    "watch-media",
    "watch-service",
    "watch-readiness",
    "watch-aging",
];

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
    mediaStatus: string;
    serviceStatus: string;
    saleStatus: string;
    priceStatus: string;
    pricePreset: string;
    priceMin: string;
    priceMax: string;
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
const DEFAULT_VIEW = "all";

function setParam(next: URLSearchParams, key: string, value?: string | null) {
    const normalized = String(value ?? "").trim();
    if (!normalized) next.delete(key);
    else next.set(key, normalized);
}

function sanitizeParams(input: URLSearchParams) {
    const params = new URLSearchParams(input.toString());

    params.set("view", DEFAULT_VIEW);
    [
        "subFilter",
        "hasContent",
        "hasImages",
        "saleStage",
        "opsStage",
        "quickFilter",
    ].forEach((key) => params.delete(key));

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
        mediaStatus: params.get("mediaStatus") ?? "",
        serviceStatus: params.get("serviceStatus") ?? "",
        saleStatus: params.get("saleStatus") ?? "",
        priceStatus: params.get("priceStatus") ?? "",
        pricePreset: params.get("pricePreset") ?? "",
        priceMin: params.get("priceMin") ?? "",
        priceMax: params.get("priceMax") ?? "",
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
        mediaStatus: "",
        serviceStatus: "",
        saleStatus: "",
        priceStatus: "",
        pricePreset: "",
        priceMin: "",
        priceMax: "",
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
    const dialog = useAppDialog();
    const previewState = useBusinessEntityPreview();
    const [serviceIntakeProductId, setServiceIntakeProductId] = React.useState<string | null>(null);
    const [serviceIntakeRow, setServiceIntakeRow] = React.useState<WatchRow | null>(null);
    const [serviceSuspicion, setServiceSuspicion] = React.useState("");
    const [serviceIntakeError, setServiceIntakeError] = React.useState<string | null>(null);
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
    const [mediaRowSubmittingId, setMediaRowSubmittingId] = useState<string | null>(null);
    const [duplicateSubmittingId, setDuplicateSubmittingId] = useState<string | null>(null);
    const [dashboardCustomizationRequest, setDashboardCustomizationRequest] = useState(0);

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
        () => selectedRows.filter((row) => row.hasImages && row.productId),
        [selectedRows],
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

    function handleApplyFilters() {
        pushParams((next) => {
            setParam(next, "q", filters.q);
            setParam(next, "sku", filters.sku);
            setParam(next, "brandId", filters.brandId);
            setParam(next, "vendorId", filters.vendorId);
            setParam(next, "mediaStatus", filters.mediaStatus);
            setParam(next, "serviceStatus", filters.serviceStatus);
            setParam(next, "saleStatus", filters.saleStatus);
            setParam(next, "priceStatus", filters.priceStatus);
            setParam(next, "pricePreset", filters.pricePreset);
            setParam(next, "priceMin", filters.priceMin);
            setParam(next, "priceMax", filters.priceMax);
            [
                "hasContent",
                "hasImages",
                "saleStage",
                "opsStage",
                "subFilter",
                "quickFilter",
            ].forEach((key) => next.delete(key));
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
                "mediaStatus",
                "serviceStatus",
                "saleStatus",
                "priceStatus",
                "pricePreset",
                "priceMin",
                "priceMax",
                "quickFilter",
                "subFilter",
            ].forEach((key) => next.delete(key));

            setParam(next, "sort", DEFAULT_SORT);
            setParam(next, "page", "1");
        }, { meta: "lite" });
    }

    function handlePage(page: number) {
        pushParams((next) => setParam(next, "page", String(page)), { meta: "lite" });
    }

    function handleClearField(key: string) {
        setFilters((prev) => ({ ...prev, [key]: "" }));

        pushParams((next) => {
            next.delete(key);
            setParam(next, "page", "1");
        }, { meta: "lite" });
    }

    function handleFilterChange(patch: Partial<WatchFilterFormState>) {
        setFilters((prev) => {
            const next = { ...prev, ...patch };
            if (Object.prototype.hasOwnProperty.call(patch, "priceStatus") && patch.priceStatus) {
                next.pricePreset = "";
                next.priceMin = "";
                next.priceMax = "";
            }
            if (Object.prototype.hasOwnProperty.call(patch, "pricePreset") && patch.pricePreset) {
                next.priceStatus = "";
                next.priceMin = "";
                next.priceMax = "";
            }
            if (
                (Object.prototype.hasOwnProperty.call(patch, "priceMin") && patch.priceMin) ||
                (Object.prototype.hasOwnProperty.call(patch, "priceMax") && patch.priceMax)
            ) {
                next.priceStatus = "";
                next.pricePreset = "";
            }
            return next;
        });
    }

    function handleSaveView() {
        const name = window.prompt("Đặt tên view này");
        const normalizedName = String(name ?? "").trim();
        if (!normalizedName) return;

        const storageKey = "watch-list:saved-views";
        const current = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
        const views = Array.isArray(current) ? current : [];
        const nextView = {
            id: `${Date.now()}`,
            name: normalizedName,
            values: filters,
            savedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(storageKey, JSON.stringify([nextView, ...views]));
        notify.success({
            title: "Đã lưu view",
            message: `View "${normalizedName}" đã được lưu trên trình duyệt này.`,
        });
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
        const total = photoshootEligibleRows.length;
        const steps: AppProgressStep[] = photoshootEligibleRows.map((row, index) => ({
            id: row.id,
            label: row.title || row.sku || row.productId,
            detail: `Chờ gửi sang WP Photoshoot (${index + 1}/${total})`,
            status: "pending",
        }));

        progress.show({
            title: "Đang gửi sang WP Photoshoot",
            message: `0/${total} watch hoàn tất`,
            steps,
        });

        try {
            progress.update({
                message: `Đang gửi ${total} watch sang WP Photoshoot`,
                steps: steps.map((step) => ({
                    ...step,
                    status: "running",
                    detail: "Đang gửi sang WP Photoshoot",
                })),
            });

            const result = await requestWatchPhotoshootAction({
                watchIds: photoshootEligibleRows.map((row) => row.id),
                note: "Requested from Watch list bulk action.",
            });
            const itemByWatchId = new Map(result.items.map((item) => [item.watchId, item]));
            const sentCount = result.requested ?? 0;
            const skippedCount = result.skipped ?? 0;

            progress.update({
                message: `${sentCount}/${total} watch hoàn tất`,
                steps: steps.map((step) => {
                    const item = itemByWatchId.get(step.id);
                    const requested = item?.status === "REQUESTED";

                    return {
                        ...step,
                        status: requested ? "done" : "skipped",
                        detail: requested
                            ? "Đã gửi vào WP Photoshoot."
                            : item?.reason ?? "Watch được bỏ qua.",
                    };
                }),
            });

            notify.success({
                title: "Đã gửi sang Photoshoot",
                message: `${sentCount} watch được gửi, ${skippedCount} watch bỏ qua.`,
            });
            setSelectedIds([]);

            const next = new URLSearchParams(params.toString());
            await loadList(next, { meta: "lite" });
        } catch (error) {
            progress.update({
                message: "Gửi sang WP Photoshoot thất bại",
                steps: steps.map((step) => ({
                    ...step,
                    status: "error",
                    detail:
                        error instanceof Error
                            ? error.message
                            : "Không thể gửi watch này.",
                })),
            });
            notify.error({
                title: "Không thể gửi Photoshoot",
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể gửi danh sách watch sang Photoshoot.",
            });
        } finally {
            setPhotoshootSubmitting(false);
            window.setTimeout(() => progress.hide(), 1200);
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

    async function sendWatchToMediaSpace(row: WatchRow) {
        if (mediaRowSubmittingId) return;

        setMediaRowSubmittingId(row.id);
        const targetLabel = row.hasImages ? "Xử lý Media" : "Chụp ảnh";
        progress.show({
            title: "Đang đưa vào Space Media",
            message: `${row.title || row.sku || "Watch"} đang được chuyển vào Workspace ${targetLabel}.`,
        });

        try {
            if (row.hasImages) {
                const result = await markWatchMediaAssetAttachedFromWatchAction({
                    productId: row.productId,
                    note: "Requested Media Workspace from Watch list row action.",
                });

                if (result.skipped) {
                    notify.warning({
                        title: "Chưa thể đưa vào Space Media",
                        message: result.reason ?? "Watch đã được bỏ qua.",
                    });
                    return;
                }
            } else {
                const result = await requestWatchPhotoshootAction({
                    watchIds: [row.id],
                    note: "Requested Photoshoot Workspace from Watch list row action.",
                });
                const item = result.items[0];

                if (item?.status !== "REQUESTED") {
                    notify.warning({
                        title: "Chưa thể đưa vào Space Media",
                        message: item?.reason ?? "Watch đã được bỏ qua.",
                    });
                    return;
                }
            }

            notify.success({
                title: "Đã đưa vào Space Media",
                message: `Watch đã được đưa vào Workspace ${targetLabel}.`,
            });
            await loadList(new URLSearchParams(params.toString()), { meta: "lite" });
        } catch (error) {
            notify.error({
                title: "Không thể đưa vào Space Media",
                message: error instanceof Error ? error.message : "Có lỗi khi cập nhật Media Workspace.",
            });
        } finally {
            setMediaRowSubmittingId(null);
            window.setTimeout(() => progress.hide(), 900);
        }
    }

    async function confirmDuplicateWatch(row: WatchRow) {
        if (duplicateSubmittingId) return;
        const accepted = await dialog.confirm({
            title: "Xác nhận watch bị trùng?",
            message: `Watch “${row.title || row.sku || row.productId}” sẽ được đưa ra khỏi danh sách hiện tại và lưu vào hàng chờ xử lý trùng. Dữ liệu chưa bị xóa hoặc hợp nhất.`,
            confirmText: "Xác nhận trùng",
            cancelText: "Hủy",
            tone: "warning",
        });
        if (!accepted) return;

        setDuplicateSubmittingId(row.id);
        progress.show({
            title: "Đang xác nhận watch trùng",
            message: "Hệ thống đang chuyển watch vào hàng chờ xử lý trùng.",
        });
        try {
            await confirmDuplicateWatchAction({ productId: row.productId });
            setSelectedIds((current) => current.filter((id) => id !== row.id));
            notify.success({
                title: "Đã xác nhận trùng",
                message: "Watch đã được đưa ra khỏi danh sách hiện tại. Dữ liệu vẫn được giữ nguyên.",
            });
            await loadList(new URLSearchParams(params.toString()), { meta: "full" });
        } catch (error) {
            notify.error({
                title: "Không thể xác nhận trùng",
                message: error instanceof Error ? error.message : "Có lỗi khi cập nhật watch.",
            });
        } finally {
            setDuplicateSubmittingId(null);
            window.setTimeout(() => progress.hide(), 900);
        }
    }

    async function restoreDuplicateWatch(row: WatchRow) {
        if (duplicateSubmittingId) return;
        const accepted = await dialog.confirm({
            title: "Đưa watch lại danh sách hiện tại?",
            message: `Watch “${row.title || row.sku || row.productId}” sẽ được gỡ khỏi danh sách trùng và hiển thị lại trong Watch List.`,
            confirmText: "Đưa lại danh sách",
            cancelText: "Hủy",
        });
        if (!accepted) return;

        setDuplicateSubmittingId(row.id);
        progress.show({
            title: "Đang khôi phục watch",
            message: "Hệ thống đang đưa watch trở lại danh sách hiện tại.",
        });
        try {
            await restoreDuplicateWatchAction({ productId: row.productId });
            notify.success({
                title: "Đã đưa lại danh sách Watch",
                message: "Watch không còn nằm trong hàng chờ trùng.",
            });
            await loadList(new URLSearchParams(params.toString()), { meta: "full" });
        } catch (error) {
            notify.error({
                title: "Không thể khôi phục watch",
                message: error instanceof Error ? error.message : "Có lỗi khi cập nhật watch.",
            });
        } finally {
            setDuplicateSubmittingId(null);
            window.setTimeout(() => progress.hide(), 900);
        }
    }

    async function permanentlyDeleteDuplicateWatch(row: WatchRow) {
        if (duplicateSubmittingId) return;
        const accepted = await dialog.confirm({
            title: "Xóa vĩnh viễn watch trùng?",
            message: `Watch “${row.title || row.sku || row.productId}” cùng dữ liệu Media, Service và dòng phiếu nhập liên quan sẽ bị xóa. Thao tác này không thể hoàn tác.`,
            confirmText: "Xóa vĩnh viễn",
            cancelText: "Hủy",
            tone: "danger",
        });
        if (!accepted) return;

        setDuplicateSubmittingId(row.id);
        progress.show({
            title: "Đang xóa watch trùng",
            message: "Hệ thống đang dọn dữ liệu liên quan trong một transaction.",
        });
        try {
            await permanentlyDeleteDuplicateWatchAction({ productId: row.productId });
            notify.success({
                title: "Đã xóa watch trùng",
                message: "Watch và dữ liệu liên quan đã được xóa.",
            });
            await loadList(new URLSearchParams(params.toString()), { meta: "full" });
        } catch (error) {
            notify.error({
                title: "Không thể xóa watch trùng",
                message: error instanceof Error ? error.message : "Transaction xóa đã thất bại.",
            });
        } finally {
            setDuplicateSubmittingId(null);
            window.setTimeout(() => progress.hide(), 1200);
        }
    }

    async function sendSelectedToMediaSpace() {
        if (!selectedRows.length || photoshootSubmitting || mediaReviewSubmitting) return;

        setMediaReviewSubmitting(true);
        const steps: AppProgressStep[] = selectedRows.map((row) => ({
            id: row.id,
            label: row.title || row.sku || row.productId,
            detail: row.hasImages ? "Chờ đưa vào Xử lý Media" : "Chờ đưa vào Chụp ảnh",
            status: "pending",
        }));

        progress.show({
            title: "Đang đưa vào Space Media",
            message: `0/${selectedRows.length} watch hoàn tất`,
            steps,
        });

        let completed = 0;
        let skipped = 0;
        for (let index = 0; index < selectedRows.length; index += 1) {
            const row = selectedRows[index];
            steps[index] = { ...steps[index], status: "running", detail: "Đang xử lý..." };
            progress.update({ message: `${index}/${selectedRows.length} watch hoàn tất`, steps: [...steps] });

            try {
                if (row.hasImages) {
                    const result = await markWatchMediaAssetAttachedFromWatchAction({
                        productId: row.productId,
                        note: "Requested Media Workspace from Watch list bulk action.",
                    });
                    if (result.skipped) {
                        skipped += 1;
                        steps[index] = { ...steps[index], status: "skipped", detail: result.reason ?? "Watch đã được bỏ qua." };
                    } else {
                        completed += 1;
                        steps[index] = { ...steps[index], status: "done", detail: "Đã đưa vào Workspace Xử lý Media." };
                    }
                } else {
                    const result = await requestWatchPhotoshootAction({
                        watchIds: [row.id],
                        note: "Requested Photoshoot Workspace from Watch list bulk action.",
                    });
                    const item = result.items[0];
                    if (item?.status !== "REQUESTED") {
                        skipped += 1;
                        steps[index] = { ...steps[index], status: "skipped", detail: item?.reason ?? "Watch đã được bỏ qua." };
                    } else {
                        completed += 1;
                        steps[index] = { ...steps[index], status: "done", detail: "Đã đưa vào Workspace Chụp ảnh." };
                    }
                }
            } catch (error) {
                skipped += 1;
                steps[index] = {
                    ...steps[index],
                    status: "error",
                    detail: error instanceof Error ? error.message : "Không thể cập nhật Space Media.",
                };
            }

            progress.update({
                message: `${index + 1}/${selectedRows.length} watch hoàn tất`,
                steps: [...steps],
            });
        }

        try {
            notify.success({
                title: "Đã xử lý Space Media",
                message: `${completed} watch được đưa vào luồng, ${skipped} watch bỏ qua.`,
            });
            setSelectedIds([]);
            await loadList(new URLSearchParams(params.toString()), { meta: "lite" });
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
            `/admin/watches/${row.productId}?returnTo=${encodeURIComponent(returnTo)}`,
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

        if (serviceIntakeProductId) return;

        setServiceIntakeRow(row);
        setServiceSuspicion("");
        setServiceIntakeError(null);
    }

    async function submitServiceIntake(openExisting = false) {
        const row = serviceIntakeRow;
        const productId = String(row?.productId || "").trim();
        const suspicion = serviceSuspicion.trim();

        if (!productId) {
            setServiceIntakeError("Watch nay chua co productId.");
            return;
        }

        if (!openExisting && !suspicion) {
            setServiceIntakeError("Vui long nhap nghi ngo ky thuat dau tien.");
            return;
        }

        if (serviceIntakeProductId) return;

        setServiceIntakeProductId(productId);
        setServiceIntakeError(null);
        let intakeSteps: AppProgressStep[] = [
            {
                id: "validate",
                label: "Kiểm tra thông tin phiếu",
                detail: "Watch và nghi ngờ kỹ thuật đã hợp lệ.",
                status: "done",
            },
            {
                id: "create",
                label: "Tạo Service Request và Technical Issue",
                detail: "Đang ghi nhận phiếu kỹ thuật.",
                status: "running",
            },
            {
                id: "background",
                label: "Đồng bộ Space, timeline và projection",
                detail: "Sẽ tiếp tục chạy nền sau khi tạo phiếu.",
                status: "pending",
            },
        ];
        progress.show({
            title: "Đang tạo phiếu kỹ thuật",
            message: "Đang ghi nhận Service Request và nghi ngờ kỹ thuật.",
            steps: intakeSteps,
        });

        try {
            const res = await fetch("/api/admin/service-operation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    action: "watch_intake_with_suspicion",
                    productId,
                    suspicion,
                    openExisting,
                }),
            });

            const json = await res.json().catch(() => null);

            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Khong the tao phieu ky thuat.");
            }

            const data = json.data ?? {};

            if (data.status === "EXISTING_WORKSPACE") {
                progress.hide();
                setServiceIntakeRow(null);
                setServiceSuspicion("");
                notify.success({
                    title: "Watch đã có phiếu kỹ thuật",
                    message: data.refNo
                        ? `SR ${data.refNo} đang được xử lý.`
                        : "Bạn có thể mở phiếu từ Service Operation khi cần.",
                });
                return;
            }

            intakeSteps = intakeSteps.map((step) =>
                step.id === "create"
                    ? { ...step, status: "done", detail: "Phiếu kỹ thuật đã được ghi nhận." }
                    : step.id === "background"
                      ? {
                            ...step,
                            status: "running",
                            detail: "Đã chuyển sang xử lý nền; bạn có thể tiếp tục làm việc.",
                        }
                      : step,
            );
            progress.update({
                title: "Đã tạo phiếu kỹ thuật",
                message: "Space và lịch sử đang được đồng bộ nền.",
                steps: intakeSteps,
            });

            notify.success({
                title: data.createdServiceRequest ? "Đã tạo phiếu kỹ thuật" : "Đã ghi nhận phiếu kỹ thuật",
                message: data.createdInitialIssue
                    ? "Đã tạo SR kèm nghi ngờ kỹ thuật đầu tiên."
                    : data.refNo
                        ? `SR ${data.refNo} đã được ghi nhận.`
                        : "Bạn có thể mở phiếu từ Service Operation khi cần.",
            });

            setServiceIntakeRow(null);
            setServiceSuspicion("");
            window.setTimeout(() => progress.hide(), 900);
        } catch (error) {
            progress.hide();
            setServiceIntakeError(
                error instanceof Error
                    ? error.message
                    : "Khong the mo Service Operation workspace.",
            );
            notify.error({
                title: "Khong the tao phieu ky thuat",
                message:
                    error instanceof Error
                        ? error.message
                        : "Khong the mo Service Operation workspace.",
            });
        } finally {
            setServiceIntakeProductId(null);
        }
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
    const duplicateView = params.get("duplicates") === "1";
    return (
        <BusinessListShell
            header={
                <WatchListToolbar
                    audienceSegment={params.get("segment") === "WOMEN" ? "WOMEN" : "MEN"}
                    onAudienceSegmentChange={(segment) => {
                        const next = new URLSearchParams(params.toString());
                        next.set("segment", segment);
                        next.set("page", "1");
                        void loadList(next, { meta: "lite" });
                    }}
                    selectedCount={selectedIds.length}
                    photoshootEligibleCount={photoshootEligibleRows.length}
                    mediaReviewEligibleCount={mediaReviewEligibleRows.length}
                    submittingPhotoshoot={photoshootSubmitting}
                    submittingMediaReview={mediaReviewSubmitting}
                    onRequestPhotoshoot={requestSelectedPhotoshoot}
                    onRequestMediaReview={requestSelectedMediaReview}
                    showSelectionActions={false}
                    duplicateView={duplicateView}
                    onToggleDuplicateView={() => {
                        const next = new URLSearchParams(params.toString());
                        if (duplicateView) next.delete("duplicates");
                        else next.set("duplicates", "1");
                        next.set("page", "1");
                        void loadList(next, { meta: "full" });
                    }}
                    onCustomizeDashboard={() =>
                        setDashboardCustomizationRequest((request) => request + 1)
                    }
                />
            }
            dashboard={
                <AsyncBusinessListDashboard
                    endpoint={`/api/admin/watches/dashboard?segment=${
                        params.get("segment") === "WOMEN" ? "WOMEN" : "MEN"
                    }`}
                    widgets={WATCH_DASHBOARD_WIDGETS}
                    storageKey="admin-dashboard:watch-list"
                    customizationRequest={dashboardCustomizationRequest}
                    showCustomizationTrigger={false}
                />
            }
            filters={
                <WatchListFilters
                    filters={filters}
                    total={listData.total}
                    visibleCount={displayRows.length}
                    brandOptions={brandOptions}
                    vendorOptions={vendorOptions}
                    onChange={handleFilterChange}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    onClearField={handleClearField}
                    onSaveView={handleSaveView}
                />
            }
        >
            {selectedRows.length && !duplicateView ? (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3 shadow-sm">
                    <div className="text-sm text-slate-700">
                        Đã chọn <span className="font-bold text-violet-700">{selectedRows.length}</span> watch
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void sendSelectedToMediaSpace()}
                            disabled={mediaReviewSubmitting || photoshootSubmitting}
                            className="inline-flex h-9 items-center rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                        >
                            {mediaReviewSubmitting ? "Đang xử lý..." : `Đưa vào Space Media (${selectedRows.length})`}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            disabled={mediaReviewSubmitting || photoshootSubmitting}
                            className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800"
                        >
                            Bỏ chọn
                        </button>
                    </div>
                </div>
            ) : null}
            <div className={loading ? "opacity-60 transition" : "transition"}>
                <WatchListTable
                    items={displayRows}
                    total={listData.total}
                    selectedIds={selectedIds}
                    canViewCost={props.canViewCost}
                    onToggleOne={onToggleOne}
                    onToggleAll={onToggleAll}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={duplicateView ? permanentlyDeleteDuplicateWatch : onDelete}
                    onService={onService}
                    onMedia={sendWatchToMediaSpace}
                    mediaSubmittingId={mediaRowSubmittingId}
                    onConfirmDuplicate={duplicateView ? undefined : confirmDuplicateWatch}
                    duplicateSubmittingId={duplicateSubmittingId}
                    onRestoreDuplicate={duplicateView ? restoreDuplicateWatch : undefined}
                    onQuickOrder={onQuickOrder}
                    onConsign={onConsign}
                    onBuyBack={onBuyBack}
                    onRaiseCase={openWorkCaseFromWatch}
                    onCreateTask={onCreateTask}
                    onPreview={previewState.openPreview}
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

            {serviceIntakeRow ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
                    <section className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <div className="text-base font-semibold text-slate-950">
                                Tao Service Request
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                {serviceIntakeRow.title || serviceIntakeRow.sku || "Watch"}
                            </div>
                        </div>
                        <div className="space-y-4 px-5 py-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">
                                    Nghi ngo ky thuat dau tien
                                </span>
                                <textarea
                                    value={serviceSuspicion}
                                    onChange={(event) => {
                                        setServiceSuspicion(event.target.value);
                                        setServiceIntakeError(null);
                                    }}
                                    rows={4}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                    placeholder="Vi du: may chay cham, kim giay khong on dinh, can kiem tra chong nuoc..."
                                    disabled={Boolean(serviceIntakeProductId)}
                                />
                            </label>
                            {serviceIntakeError ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                                    {serviceIntakeError}
                                </div>
                            ) : null}
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (serviceIntakeProductId) return;
                                    setServiceIntakeRow(null);
                                    setServiceSuspicion("");
                                    setServiceIntakeError(null);
                                }}
                                className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                disabled={Boolean(serviceIntakeProductId)}
                            >
                                Huy
                            </button>
                            <button
                                type="button"
                                onClick={() => void submitServiceIntake(false)}
                                className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                disabled={Boolean(serviceIntakeProductId)}
                            >
                                Tao SR
                            </button>
                        </div>
                    </section>
                </div>
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

            <BusinessEntityPreviewModal
                open={previewState.open}
                preview={previewState.preview}
                loading={previewState.loading}
                error={previewState.error}
                onClose={previewState.closePreview}
                onActivityChanged={previewState.refreshPreview}
            />
        </BusinessListShell>

    );
}
