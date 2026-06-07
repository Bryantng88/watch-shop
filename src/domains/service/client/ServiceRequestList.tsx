"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListChecks } from "lucide-react";

import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import PaymentWorkspace from "@/domains/payment/ui/PaymentWorkspace";
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
        [searchParams],
    );

    const counts = useMemo(
        () =>
            buildServiceRequestCounts({
                counts: props.counts,
                total: props.total,
                currentView,
            }),
        [props.counts, props.total, currentView],
    );

    const q = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort") ?? "updatedDesc";

    const [filters, setFilters] = useState<ServiceRequestFiltersValue>({
        q,
        sort,
    });

    const [technicalAssessmentRequestId, setTechnicalAssessmentRequestId] =
        useState<string | null>(null);
    const [paymentServiceRequest, setPaymentServiceRequest] =
        useState<ServiceReqItem | null>(null);
    const [paymentSubmitting, setPaymentSubmitting] = useState(false);

    useEffect(() => {
        setFilters({ q, sort });
    }, [q, sort]);

    const selectedItem = useMemo(
        () =>
            items.find((item) => item.id === technicalAssessmentRequestId) ?? null,
        [items, technicalAssessmentRequestId],
    );

    const productImage =
        selectedItem?.primaryImageUrl ??
        selectedItem?.product?.primaryImageUrl ??
        null;
    const productTitle =
        selectedItem?.productTitle ?? selectedItem?.product?.title ?? null;
    const productSku = selectedItem?.skuSnapshot ?? null;
    const movementSpecLabel = selectedItem?.product?.watchSpec?.movement ?? null;

    const paymentOwner = useMemo(() => {
        if (!paymentServiceRequest) return null;

        const actualCostTotal = Number(paymentServiceRequest.actualCostTotal ?? 0);
        const estimatedCostTotal = Number(paymentServiceRequest.estimatedCostTotal ?? 0);
        const totalAmount = actualCostTotal > 0 ? actualCostTotal : estimatedCostTotal;

        return {
            type: "SERVICE" as const,
            id: paymentServiceRequest.id,
            code: paymentServiceRequest.refNo,
            title: paymentServiceRequest.productTitle ?? paymentServiceRequest.product?.title ?? "Service request",
            direction: "OUT" as const,
            totalAmount,
            remainingAmount: paymentServiceRequest.remainingAmount ?? null,
            listEndpoint: `/api/admin/service-requests/${paymentServiceRequest.id}/payment`,
            disableCreate: true,
            createDisabledMessage: "Payment service được tạo UNPAID tự động khi hoàn tất từng Technical Issue. Tại đây chỉ xử lý Hoàn tất/Hủy payment.",
        };
    }, [paymentServiceRequest]);

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
            setParam(
                next,
                "sort",
                filters.sort && filters.sort !== "updatedDesc" ? filters.sort : null,
            );
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
        router.push(`/admin/service-requests/${row.id}`);
    }

    function openGlobalIssueBoard() {
        router.push("/admin/services/issues-board");
    }

    function openIssueBoard(row: ServiceReqItem) {
        router.push(`/admin/services/issues-board?serviceRequestId=${row.id}`);
    }

    function openLogs(row: ServiceReqItem) {
        notify.info({
            title: "Nhật ký xử lý",
            message: `Cần nối lại MaintenanceLogModal cho ${row.refNo ?? row.id}.`,
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
            const response = await fetch(
                `/api/admin/service-requests/${row.id}/complete`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                },
            );

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


    async function createPayment(payload: {
        ownerType: "ORDER" | "ACQUISITION" | "SERVICE";
        ownerId: string;
        amount: number;
        method: string;
        note?: string | null;
        markPaidNow: boolean;
    }) {
        setPaymentSubmitting(true);
        try {
            const response = await fetch(`/api/admin/service-requests/${payload.ownerId}/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: payload.amount,
                    method: payload.method,
                    note: payload.note ?? null,
                    markPaidNow: false,
                    purpose: "MAINTENANCE_COST",
                }),
            });

            const json = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(json?.error || "Không thể tạo payment service.");

            notify.success({
                title: "Đã tạo payment service",
                message: "Khoản thu dịch vụ đã được tạo.",
            });
            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Không thể tạo payment",
                message: error?.message || "Thao tác thất bại.",
            });
            throw error;
        } finally {
            setPaymentSubmitting(false);
        }
    }

    async function completePayment(payload: {
        paymentId: string;
        reference?: string | null;
        note?: string | null;
    }) {
        setPaymentSubmitting(true);
        try {
            const response = await fetch(`/api/admin/payments/${payload.paymentId}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(json?.error || "Không thể hoàn tất payment.");

            notify.success({
                title: "Đã thu payment",
                message: "Payment service đã được đánh dấu đã thu.",
            });
            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Không thể hoàn tất payment",
                message: error?.message || "Thao tác thất bại.",
            });
            throw error;
        } finally {
            setPaymentSubmitting(false);
        }
    }

    async function cancelPayment(payload: { paymentId: string; note?: string | null }) {
        setPaymentSubmitting(true);
        try {
            const response = await fetch(`/api/admin/payments/${payload.paymentId}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(json?.error || "Không thể hủy payment.");

            notify.success({
                title: "Đã hủy payment",
                message: "Khoản payment service đã được hủy.",
            });
            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Không thể hủy payment",
                message: error?.message || "Thao tác thất bại.",
            });
            throw error;
        } finally {
            setPaymentSubmitting(false);
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
        <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">
                        Service Requests
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Quản lý service đi kèm watch, kỹ thuật, vendor và maintenance.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        onClick={openGlobalIssueBoard}
                    >
                        <ListChecks className="h-4 w-4" />
                        Mở Issue Board
                    </button>

                    <button
                        type="button"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        onClick={() => router.push("/admin/orders")}
                    >
                        ← Orders
                    </button>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-5 shadow-sm">
                <ServiceRequestListViewTabs
                    value={currentView}
                    counts={counts}
                    onChange={setView}
                />
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
                onOpenTechnicalAssessment={(row) =>
                    setTechnicalAssessmentRequestId(row.id)
                }
                onOpenPayment={(row) => setPaymentServiceRequest(row)}
            />

            <ServiceRequestPagination
                total={props.total}
                page={props.page}
                totalPages={props.totalPages}
                onPageChange={goPage}
            />

            {paymentOwner ? (
                <PaymentWorkspace
                    open={!!paymentServiceRequest}
                    owner={paymentOwner}
                    submitting={paymentSubmitting}
                    onClose={() => setPaymentServiceRequest(null)}
                    onCreatePayment={createPayment}
                    onCompletePayment={completePayment}
                    onCancelPayment={cancelPayment}
                    onUpdated={() => router.refresh()}
                />
            ) : null}

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
