"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, CreditCard, ShieldAlert, X } from "lucide-react";

import PaymentSummaryMetrics from "./PaymentSummaryMetrics";
import PaymentTable from "./PaymentTable";
import PaymentCreatePanel from "./PaymentCreatePanel";

export type PaymentOwnerType = "ORDER" | "ACQUISITION" | "SERVICE";

export type PaymentOwner = {
    type: PaymentOwnerType;
    id: string;
    code?: string | null;
    title?: string | null;
    direction?: "IN" | "OUT";
    totalAmount?: number | null;
    remainingAmount?: number | null;
    codAmount?: number | null;
    listEndpoint: string;
};

export type PaymentListItem = {
    id: string;
    refNo?: string | null;
    ownerType?: string | null;
    ownerId?: string | null;
    type?: string | null;
    direction?: string | null;
    purpose?: string | null;
    method?: string | null;
    status?: string | null;
    amount: number;
    currency?: string | null;
    paidAt?: string | Date | null;
    reference?: string | null;
    note?: string | null;
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
};

type Props = {
    open: boolean;
    owner: PaymentOwner;
    submitting?: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    onCreatePayment: (payload: {
        ownerType: PaymentOwnerType;
        ownerId: string;
        amount: number;
        method: string;
        note?: string | null;
        markPaidNow: boolean;
    }) => void | Promise<void>;
    onCompletePayment: (payload: {
        paymentId: string;
        reference?: string | null;
        note?: string | null;
    }) => void | Promise<void>;
    onCancelPayment?: (payload: {
        paymentId: string;
        note?: string | null;
    }) => void | Promise<void>;
    onFinalizeByPaidAmount?: (payload: {
        orderId: string;
        note?: string | null;
    }) => void | Promise<void>;
};

function toNumber(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function normalizeStatus(value?: string | null) {
    return String(value ?? "").trim().toUpperCase();
}

function isCanceled(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);
    return status === "CANCELED" || status === "CANCELLED";
}

function isPaid(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);
    return status === "PAID" || status === "COLLECTED";
}

export default function PaymentWorkspace({
    open,
    owner,
    submitting = false,
    onClose,
    onUpdated,
    onCreatePayment,
    onCompletePayment,
    onCancelPayment,
    onFinalizeByPaidAmount,
}: Props) {
    const [payments, setPayments] = useState<PaymentListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFinalizePanel, setShowFinalizePanel] = useState(false);

    const paidTotal = useMemo(
        () =>
            payments
                .filter(isPaid)
                .reduce((sum, payment) => sum + toNumber(payment.amount), 0),
        [payments],
    );

    const activeOpenTotal = useMemo(
        () =>
            payments
                .filter((payment) => !isCanceled(payment))
                .reduce((sum, payment) => sum + toNumber(payment.amount), 0),
        [payments],
    );

    const totalAmount = toNumber(owner.totalAmount);
    const computedRemainingAmount = Math.max(0, totalAmount - paidTotal);
    const remainingAmount =
        owner.remainingAmount != null
            ? Math.min(toNumber(owner.remainingAmount), computedRemainingAmount)
            : computedRemainingAmount;

    const isFullyPaid = totalAmount > 0 && remainingAmount <= 0;
    const availableToCreate = isFullyPaid ? 0 : Math.max(0, totalAmount - activeOpenTotal);
    const canFinalizeByPaidAmount =
        owner.type === "ORDER" &&
        typeof onFinalizeByPaidAmount === "function" &&
        paidTotal > 0 &&
        remainingAmount > 0;

    async function reloadPayments() {
        if (!owner.listEndpoint) return;

        setLoading(true);

        try {
            const res = await fetch(owner.listEndpoint, { cache: "no-store" });
            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không tải được danh sách payment.");
            }

            setPayments(Array.isArray(json?.items) ? json.items : []);
        } catch (error) {
            console.error("[PaymentWorkspace] reloadPayments failed", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open || !owner.id) return;
        setPayments([]);
        setShowFinalizePanel(false);
        reloadPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, owner.id, owner.listEndpoint]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
            <div className="flex max-h-[88vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200">
                <div className="flex items-start justify-between border-b border-slate-100 px-7 py-6">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white">
                            <CreditCard className="h-5 w-5" />
                        </div>

                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                                Payment Domain
                            </div>
                            <h2 className="mt-1 text-xl font-bold text-slate-950">
                                Quản lý thanh toán
                            </h2>
                            <div className="mt-1 text-sm text-slate-500">
                                {owner.code || owner.id}
                                {owner.title ? ` · ${owner.title}` : ""}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-[1fr_360px] overflow-hidden">
                    <div className="min-w-0 overflow-auto px-7 py-6">
                        <PaymentSummaryMetrics
                            direction={owner.direction ?? "IN"}
                            totalAmount={totalAmount}
                            paidTotal={paidTotal}
                            remainingAmount={remainingAmount}
                            codAmount={owner.codAmount ?? 0}
                        />

                        <PaymentTable
                            payments={payments}
                            loading={loading}
                            owner={owner}
                            submitting={submitting}
                            onReload={reloadPayments}
                            onUpdated={onUpdated}
                            onCompletePayment={onCompletePayment}
                            onCancelPayment={onCancelPayment}
                            setPayments={setPayments}
                        />
                    </div>

                    <aside className="border-l border-slate-100 bg-white px-6 py-6">
                        <div className="space-y-3">
                            <PaymentCreatePanel
                                owner={owner}
                                defaultAmount={availableToCreate}
                                locked={isFullyPaid || availableToCreate <= 0}
                                lockMessage={
                                    isFullyPaid
                                        ? "Payment đã thanh toán full. Không thể tạo thêm payment mới."
                                        : "Owner đã có đủ payment đang mở. Hoàn tất hoặc hủy payment hiện có trước khi tạo thêm."
                                }
                                submitting={submitting}
                                onCreatePayment={onCreatePayment}
                                onReload={reloadPayments}
                                onUpdated={onUpdated}
                            />

                            {canFinalizeByPaidAmount ? (
                                <div className="rounded-3xl border border-amber-200 bg-amber-50/50">
                                    <button
                                        type="button"
                                        onClick={() => setShowFinalizePanel((value) => !value)}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                                <ShieldAlert className="h-4 w-4" />
                                            </span>
                                            <span>
                                                <span className="block text-sm font-semibold text-amber-900">
                                                    Chốt nâng cao
                                                </span>
                                                <span className="mt-0.5 block text-xs text-amber-700/80">
                                                    Chỉ dùng để sửa sai tài chính.
                                                </span>
                                            </span>
                                        </span>

                                        <ChevronDown
                                            className={`h-4 w-4 text-amber-700 transition ${showFinalizePanel ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {showFinalizePanel ? (
                                        <div className="border-t border-amber-200/70 px-4 py-4">
                                            <div className="rounded-2xl border border-amber-200 bg-white/70 p-3">
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                                    <div>
                                                        <div className="text-sm font-semibold text-amber-900">
                                                            Cẩn trọng trước khi chốt
                                                        </div>
                                                        <p className="mt-1 text-xs leading-5 text-amber-700">
                                                            Thao tác này sẽ hủy các payment còn mở, cập nhật tổng order theo số tiền đã nhận
                                                            và hoàn tất order. Chỉ dùng khi giá chốt ban đầu nhập sai nhưng payment đã nhận là đúng.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={submitting}
                                                onClick={() => {
                                                    const ok = window.confirm(
                                                        "Bạn chắc chắn muốn chốt đơn theo số tiền đã nhận? Thao tác này sẽ hủy payment còn mở, cập nhật tổng order và hoàn tất order.",
                                                    );

                                                    if (!ok) return;

                                                    onFinalizeByPaidAmount?.({
                                                        orderId: owner.id,
                                                        note: "Chốt order theo tiền đã nhận từ payment.",
                                                    });
                                                }}
                                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Tôi hiểu rủi ro, chốt theo tiền đã nhận
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}