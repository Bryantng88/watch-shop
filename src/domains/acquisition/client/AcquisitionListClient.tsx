"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import PaymentWorkspace, {
    type PaymentOwner,
    type PaymentOwnerType,
} from "@/domains/payment/ui/PaymentWorkspace";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";

import type { AcquisitionListClientProps } from "../ui/list";
import {
    AcquisitionListTabs,
    AcquisitionListToolbar,
    AcquisitionListTable,
} from "../ui/list";

function getBulkPostErrorMessage(data: any) {
    if (!data) return "Có lỗi khi duyệt phiếu!";

    if (Array.isArray(data?.failed) && data.failed.length > 0) {
        return data.failed
            .map((item: any) => {
                const id = item?.id || "unknown";
                const error = item?.error || "Lỗi không xác định";
                return `${id}: ${error}`;
            })
            .join("\n");
    }

    return data?.error || "Có lỗi khi duyệt phiếu!";
}

export default function AcquisitionListClient(props: AcquisitionListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const notify = useNotify();
    const progress = useAppProgress();

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [showBulkBar, setShowBulkBar] = React.useState(false);

    const [paymentSubmitting, setPaymentSubmitting] = React.useState(false);
    const [paymentOwner, setPaymentOwner] = React.useState<PaymentOwner | null>(null);

    React.useEffect(() => {
        setSelectedIds([]);
        setShowBulkBar(false);
    }, [sp.toString(), props.page]);

    React.useEffect(() => {
        setShowBulkBar(selectedIds.length > 0);
    }, [selectedIds.length]);

    const displayItems = props.items;

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
        progress.show({
            title: "Đang duyệt phiếu",
            message: `Đang xử lý ${selectedIds.length} phiếu nhập đã chọn.`,
        });

        try {
            const payload = displayItems
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
            setShowBulkBar(false);
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
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                    Danh sách phiếu nhập
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Domain acquisition đã tách riêng, dữ liệu đi theo luồng watch-first.
                </p>
            </div>

            <AcquisitionListTabs counts={props.counts} />
            <AcquisitionListToolbar vendors={props.vendors} />

            {showBulkBar ? (
                <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} phiếu đã chọn
                    </span>

                    <button
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm hover:bg-slate-50"
                        onClick={handleBulkPost}
                        type="button"
                    >
                        Duyệt phiếu
                    </button>

                    <button
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm hover:bg-slate-50"
                        onClick={() => {
                            setSelectedIds([]);
                            setShowBulkBar(false);
                        }}
                        type="button"
                    >
                        Bỏ chọn
                    </button>
                </div>
            ) : null}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <div className="text-lg font-semibold text-slate-950">Dữ liệu</div>
                    <div className="mt-1 text-sm text-slate-500">
                        Tổng {props.total} phiếu nhập
                    </div>
                </div>

                <AcquisitionListTable
                    items={props.items}
                    onOpenPayment={(owner) => setPaymentOwner(owner)}
                />

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600">
                    <div>
                        Tổng: <b>{props.total}</b> • Trang <b>{props.page}</b>/
                        <b>{props.totalPages}</b>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                            disabled={props.page <= 1}
                            onClick={() => {
                                const next = new URLSearchParams(sp.toString());
                                next.set("page", String(Math.max(1, props.page - 1)));
                                router.push(`${pathname}?${next.toString()}`);
                            }}
                        >
                            ← Trước
                        </button>

                        <button
                            type="button"
                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                            disabled={props.page >= props.totalPages}
                            onClick={() => {
                                const next = new URLSearchParams(sp.toString());
                                next.set("page", String(Math.min(props.totalPages, props.page + 1)));
                                router.push(`${pathname}?${next.toString()}`);
                            }}
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            </div>

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
        </div>
    );
}