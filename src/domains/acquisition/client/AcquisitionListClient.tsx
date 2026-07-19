"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import PaymentWorkspace, {
    type PaymentOwner,
    type PaymentOwnerType,
} from "@/domains/payment/ui/PaymentWorkspace";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import AcquisitionEditModal from "@/domains/acquisition/ui/edit/AcquisitionEditModal";
import BusinessListDashboard from "@/domains/shared/ui/business-list/BusinessListDashboard";
import BusinessListShell from "@/domains/shared/ui/business-list/BusinessListShell";
import type { BusinessListDashboardWidgetKey } from "@/domains/shared/ui/business-list";

import type { AcquisitionListClientProps } from "../ui/list";
import {
    AcquisitionListToolbar,
    AcquisitionListTable,
} from "../ui/list";

const ACQUISITION_DASHBOARD_WIDGETS: BusinessListDashboardWidgetKey[] = [
    "overview",
    "value-trend",
    "status-breakdown",
    "recent-activity",
];

function getBulkPostErrorMessage(data: any) {
    if (!data) return "Có lỗi khi duyệt phiếu!";

    if (Array.isArray(data?.failed) && data.failed.length > 0) {
        return data.failed
            .map((item: any) => `${item?.id || "unknown"}: ${item?.error || "Lỗi không xác định"}`)
            .join("\n");
    }

    return data?.error || "Có lỗi khi duyệt phiếu!";
}

function isSelectable(item: { approvalStatus: string }) {
    return String(item.approvalStatus).toUpperCase() !== "POSTED";
}

export default function AcquisitionListClient(props: AcquisitionListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const notify = useNotify();
    const progress = useAppProgress();

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [paymentOwner, setPaymentOwner] = React.useState<PaymentOwner | null>(null);
    const [editAcquisitionId, setEditAcquisitionId] = React.useState<string | null>(null);
    const [paymentSubmitting, setPaymentSubmitting] = React.useState(false);

    React.useEffect(() => {
        setSelectedIds([]);
    }, [sp.toString(), props.page]);

    const selectableIds = React.useMemo(
        () => props.items.filter(isSelectable).map((item) => item.id),
        [props.items],
    );

    function toggleOne(id: string, checked: boolean) {
        setSelectedIds((prev) =>
            checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
        );
    }

    function toggleAll(checked: boolean) {
        setSelectedIds(checked ? selectableIds : []);
    }

    async function createAcquisitionPayment(payload: {
        ownerType: PaymentOwnerType;
        ownerId: string;
        amount: number;
        method: string;
        note?: string | null;
        markPaidNow: boolean;
    }) {
        setPaymentSubmitting(true);

        try {
            const res = await fetch(`/api/admin/acquisitions/${payload.ownerId}/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Không thể tạo payment.");

            notify.success({
                title: "Đã tạo payment",
                message: "Payment phiếu nhập đã được tạo.",
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

    async function completeAcquisitionPayment(payload: {
        paymentId: string;
        reference?: string | null;
        note?: string | null;
    }) {
        setPaymentSubmitting(true);

        try {
            const res = await fetch(`/api/admin/payments/${payload.paymentId}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Không thể hoàn tất payment.");

            notify.success({
                title: "Đã hoàn tất payment",
                message: "Payment phiếu nhập đã được ghi nhận.",
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

    async function cancelAcquisitionPayment(payload: {
        paymentId: string;
        note?: string | null;
    }) {
        setPaymentSubmitting(true);

        try {
            const res = await fetch(`/api/admin/payments/${payload.paymentId}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Không thể hủy payment.");

            notify.success({
                title: "Đã hủy payment",
                message: "Payment phiếu nhập đã được hủy.",
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

    async function handleBulkPost() {
        if (!selectedIds.length) return;

        progress.show({
            title: "Đang duyệt phiếu",
            message: `Đang xử lý ${selectedIds.length} phiếu nhập đã chọn.`,
        });

        try {
            const payload = props.items
                .filter((x) => selectedIds.includes(x.id))
                .map((x) => ({ id: x.id, vendor: x.vendorName || "" }));

            const res = await fetch("/api/admin/acquisitions/bulk-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: payload }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                notify.error({
                    title: "Duyệt phiếu thất bại",
                    message: getBulkPostErrorMessage(data),
                    duration: 7000,
                });
                return;
            }

            const postedCount = Number(data?.posted?.length ?? 0);
            const failedCount = Number(data?.failed?.length ?? 0);

            if (failedCount > 0) {
                notify.warning({
                    title: "Duyệt phiếu chưa hoàn tất",
                    message: `Đã duyệt ${postedCount} phiếu, có ${failedCount} phiếu lỗi.\n\n${getBulkPostErrorMessage(data)}`,
                    duration: 7000,
                });
            } else {
                notify.success({
                    title: "Đã duyệt phiếu nhập",
                    message: `Đã duyệt thành công ${postedCount} phiếu.`,
                });
            }

            setSelectedIds([]);
            router.refresh();
        } catch (error) {
            notify.error({
                title: "Duyệt phiếu thất bại",
                message: error instanceof Error ? error.message : "Có lỗi khi duyệt phiếu!",
            });
        } finally {
            progress.hide();
        }
    }

    return (
        <BusinessListShell
            header={
            <div className="flex flex-col gap-4 px-1 py-1 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
                        Danh sách phiếu nhập
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Quản lý phiếu nhập, duyệt tồn kho và thanh toán đầu vào.
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 self-start">
                    <div className="inline-flex h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4">
                        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                            Đã chọn
                        </div>
                        <div className="text-xl font-semibold leading-none text-slate-950">
                            {selectedIds.length}
                        </div>
                    </div>
                    <Link
                        href="/admin/acquisitions/new"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        Tạo phiếu nhập
                    </Link>
                </div>
            </div>
            }
            dashboard={<BusinessListDashboard
                data={props.dashboardData}
                widgets={ACQUISITION_DASHBOARD_WIDGETS}
                storageKey="admin-dashboard:acquisition-list"
            />}
            filters={
                <AcquisitionListToolbar
                    vendors={props.vendors}
                    total={props.total}
                    visibleCount={props.items.length}
                />
            }
        >

            {selectedIds.length > 0 ? (
                <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-3">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} phiếu đã chọn
                    </span>

                    <button
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={handleBulkPost}
                        type="button"
                    >
                        Duyệt phiếu
                    </button>

                    <button
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => setSelectedIds([])}
                        type="button"
                    >
                        Bỏ chọn
                    </button>
                </div>
            ) : null}

            <AcquisitionListTable
                items={props.items}
                total={props.total}
                page={props.page}
                totalPages={props.totalPages}
                pathname={pathname}
                searchParams={sp}
                selectedIds={selectedIds}
                onToggleOne={toggleOne}
                onToggleAll={toggleAll}
                onOpenPayment={setPaymentOwner}
                onOpenEdit={setEditAcquisitionId}
            />

            {editAcquisitionId ? (
                <AcquisitionEditModal
                    open={!!editAcquisitionId}
                    acquisitionId={editAcquisitionId}
                    onClose={() => setEditAcquisitionId(null)}
                    onUpdated={() => router.refresh()}
                />
            ) : null}

            {paymentOwner ? (
                <PaymentWorkspace
                    open={!!paymentOwner}
                    owner={paymentOwner}
                    submitting={paymentSubmitting}
                    onClose={() => setPaymentOwner(null)}
                    onUpdated={() => router.refresh()}
                    onCreatePayment={createAcquisitionPayment}
                    onCompletePayment={completeAcquisitionPayment}
                    onCancelPayment={cancelAcquisitionPayment}
                />
            ) : null}
        </BusinessListShell>
    );
}
