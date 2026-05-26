"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, X } from "lucide-react";

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
}: Props) {
    const [payments, setPayments] = useState<PaymentListItem[]>([]);
    const [loading, setLoading] = useState(false);

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
                    </aside>
                </div>
            </div>
        </div>
    );
}