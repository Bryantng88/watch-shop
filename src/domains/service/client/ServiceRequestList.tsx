"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import TechnicalAssessmentModal from "@/domains/service/ui/technical/TechnicalAssessmentModal";
import {
    buildServiceRequestCounts,
    normalizeServiceRequestView,
    ServiceRequestListFilters,
    ServiceRequestListViewTabs,
    ServiceRequestPagination,
    ServiceRequestTable,
    type ServiceReqItem,
    type ServiceRequestFiltersValue,
    type ServiceRequestListPageProps,
    type ServiceRequestViewKey,
} from "@/domains/service/ui/list";

type Props = ServiceRequestListPageProps;

function setParam(params: URLSearchParams, key: string, value: string | null) {
    if (!value) params.delete(key);
    else params.set(key, value);
}

export default function ServiceRequestListClient(props: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const notify = useNotify();
    const dialog = useAppDialog();

    const items = props.items ?? [];
    const currentView = useMemo(
        () => normalizeServiceRequestView(searchParams.get("view")),
        [searchParams]
    );
    const counts = useMemo(
        () => buildServiceRequestCounts({ counts: props.counts, total: props.total, currentView }),
        [props.counts, props.total, currentView]
    );

    const q = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "updatedDesc";

    const [filters, setFilters] = useState<ServiceRequestFiltersValue>({ q, sort });
    const [technicalAssessmentRequestId, setTechnicalAssessmentRequestId] = useState<string | null>(null);

    useEffect(() => {
        setFilters({ q, sort });
    }, [q, sort]);

    const selectedItem = useMemo(
        () => items.find((item) => item.id === technicalAssessmentRequestId) ?? null,
        [items, technicalAssessmentRequestId]
    );

    const productImage = selectedItem?.primaryImageUrl ?? selectedItem?.product?.primaryImageUrl ?? null;
    const productTitle = selectedItem?.productTitle ?? selectedItem?.product?.title ?? null;
    const productSku = selectedItem?.skuSnapshot ?? null;
    const movementSpecLabel = selectedItem?.product?.watchSpec?.movement ?? null;

    function pushParams(mutator: (params: URLSearchParams) => void) {
        const next = new URLSearchParams(searchParams.toString());
        mutator(next);
        const query = next.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    function setView(view: ServiceRequestViewKey) {
        pushParams((next) => {
            if (view === "all") next.delete("view");
            else next.set("view", view);
            next.set("page", "1");
        });
    }

    function applyFilters() {
        pushParams((next) => {
            setParam(next, "q", filters.q.trim() || null);
            setParam(next, "sort", filters.sort && filters.sort !== "updatedDesc" ? filters.sort : null);
            next.set("page", "1");
        });
    }

    function clearFilters() {
        setFilters({ q: "", sort: "updatedDesc" });
        pushParams((next) => {
            next.delete("q");
            next.delete("sort");
            next.set("page", "1");
        });
    }

    function goPage(page: number) {
        pushParams((next) => {
            next.set("page", String(page));
        });
    }

    function openDetail(row: ServiceReqItem) {
        router.push(`/admin/services/${row.id}`);
    }

    function openIssueBoard(row: ServiceReqItem) {
        router.push(`/admin/services/issues-board?serviceRequestId=${row.id}`);
    }

    function openLogs(row: ServiceReqItem) {
        notify.info({
            title: "Nhật ký xử lý",
            message: `Cần nối lại MaintenanceLogModal cho ${row.refNo || row.id}.`,
        });
    }

    async function completeOne(row: ServiceReqItem) {
        const confirmed = await dialog.confirm({
            title: "Đóng service request",
            message: "Bạn có chắc muốn chốt service request này không?",
            confirmText: "Đóng SR",
            cancelText: "Hủy",
            tone: "success",
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/admin/service-requests/${row.id}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json?.error || "Không thể đóng service request");
            }

            notify.success({
                title: "Đã đóng service request",
                message: "Service request đã được chốt thành công.",
            });

            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Không thể đóng service request",
                message: error?.message || "Đã có lỗi xảy ra.",
            });
        }
    }

    async function copyId(row: ServiceReqItem) {
        await navigator.clipboard?.writeText(row.id);
        notify.success({
            title: "Đã copy ID",
            message: row.id,
        });
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">Service Requests</h1>
                    <p className="mt-1 text-sm text-slate-500">Quản lý service đi kèm watch, kỹ thuật, vendor và maintenance.</p>
                </div>

                <button
                    type="button"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    onClick={() => router.push("/admin/orders")}
                >
                    ← Orders
                </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-5 shadow-sm">
                <ServiceRequestListViewTabs value={currentView} counts={counts} onChange={setView} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <ServiceRequestListFilters
                    value={filters}
                    onChange={setFilters}
                    onSubmit={applyFilters}
                    onClear={clearFilters}
                />
            </div>

            <ServiceRequestTable
                items={items}
                onOpenDetail={openDetail}
                onOpenIssueBoard={openIssueBoard}
                onOpenLogs={openLogs}
                onComplete={completeOne}
                onCopyId={copyId}
                onOpenTechnicalAssessment={(row) => setTechnicalAssessmentRequestId(row.id)}
            />

            <ServiceRequestPagination
                total={props.total}
                page={props.page}
                totalPages={props.totalPages}
                onPageChange={goPage}
            />

            <TechnicalAssessmentModal
                key={technicalAssessmentRequestId || "technical-assessment-empty"}
                open={!!technicalAssessmentRequestId}
                serviceRequestId={technicalAssessmentRequestId}
                onClose={() => setTechnicalAssessmentRequestId(null)}
                onSaved={async () => {
                    setTechnicalAssessmentRequestId(null);
                    notify.success({
                        title: "Đã lưu phiếu kỹ thuật",
                        message: "Dữ liệu đánh giá kỹ thuật đã được cập nhật.",
                    });
                    router.refresh();
                }}
                productName={productTitle ?? undefined}
                productSku={productSku ?? undefined}
                productImage={productImage ?? undefined}
                movementSpecLabel={movementSpecLabel ?? undefined}
            />
        </div>
    );
}
