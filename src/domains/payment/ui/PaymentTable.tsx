"use client";

import { useState } from "react";
import {
    CheckCircle2,
    Loader2,
    XCircle,
} from "lucide-react";

import type { PaymentListItem, PaymentOwner } from "./PaymentWorkspace";

type Props = {
    payments: PaymentListItem[];
    loading?: boolean;
    owner: PaymentOwner;
    submitting?: boolean;
    setPayments: React.Dispatch<React.SetStateAction<PaymentListItem[]>>;
    onReload: () => Promise<void>;
    onUpdated?: () => void;
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

function formatMoney(value: unknown, currency = "VND") {
    return `${Math.round(toNumber(value)).toLocaleString("vi-VN")} ${currency}`;
}

function normalizeStatus(value?: string | null) {
    return String(value ?? "").trim().toUpperCase();
}

function normalizeMethod(value?: string | null) {
    return String(value ?? "").trim().toUpperCase();
}

function isPaid(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);
    return status === "PAID" || status === "COLLECTED";
}

function isCanceled(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);
    return status === "CANCELED" || status === "CANCELLED";
}

function canComplete(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);
    return status === "UNPAID" || status === "PENDING";
}

function canCancel(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);
    return status === "UNPAID" || status === "PENDING" || status === "COLLECTED";
}

function statusLabel(payment: PaymentListItem) {
    const status = normalizeStatus(payment.status);

    if (status === "PAID" || status === "COLLECTED") return "Đã nhận tiền";
    if (status === "CANCELED" || status === "CANCELLED") return "Đã hủy";
    if (status === "FAILED") return "Thất bại";

    return "Chưa thu";
}

function statusClass(payment: PaymentListItem) {
    if (isPaid(payment)) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (isCanceled(payment)) return "bg-rose-50 text-rose-700 ring-rose-200";
    return "bg-slate-50 text-slate-600 ring-slate-200";
}

function methodLabel(method?: string | null) {
    const key = normalizeMethod(method);

    if (key === "BANK_TRANSFER") return "Chuyển khoản";
    if (key === "CASH") return "Tiền mặt";
    if (key === "CARD") return "Thẻ";
    if (key === "COD") return "COD";

    return method || "-";
}

function purposeLabel(purpose?: string | null) {
    const key = String(purpose ?? "").toUpperCase();

    if (key.includes("DEPOSIT")) return "Cọc đơn hàng";
    if (key.includes("REMAIN")) return "Phần còn lại";
    if (key.includes("COD")) return "COD";
    if (key.includes("ACQUISITION")) return "Chi mua hàng";
    if (key.includes("SERVICE")) return "Dịch vụ";

    return purpose || "Payment";
}

function ownerTypeLabel(payment: PaymentListItem, owner: PaymentOwner) {
    const value = String(payment.ownerType || owner.type || "").toUpperCase();

    if (value === "ORDER") return "Order";
    if (value === "ACQUISITION") return "Acquisition";
    if (value === "SERVICE") return "Service";
    if (value === "SHIPMENT") return "Shipment";

    return value || "Owner";
}

export default function PaymentTable({
    payments,
    loading = false,
    owner,
    submitting = false,
    setPayments,
    onReload,
    onUpdated,
    onCompletePayment,
    onCancelPayment,
}: Props) {
    const [activeCompleteId, setActiveCompleteId] = useState<string | null>(null);
    const [completeReference, setCompleteReference] = useState("");
    const [completeNote, setCompleteNote] = useState("");
    const [cancelingPaymentId, setCancelingPaymentId] = useState<string | null>(null);

    async function submitCompletePayment(payment: PaymentListItem) {
        if (!payment.id || !canComplete(payment)) return;

        await onCompletePayment({
            paymentId: payment.id,
            reference: completeReference.trim() || null,
            note: completeNote.trim() || null,
        });

        setPayments((prev) =>
            prev.map((item) =>
                item.id === payment.id
                    ? {
                        ...item,
                        status: "PAID",
                        reference: completeReference.trim() || item.reference,
                        note: completeNote.trim() || item.note,
                        paidAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                    : item,
            ),
        );

        setCompleteReference("");
        setCompleteNote("");
        setActiveCompleteId(null);

        await onReload();
        onUpdated?.();
    }

    async function submitCancelPayment(payment: PaymentListItem) {
        if (!onCancelPayment || !canCancel(payment) || !payment.id) return;

        const ok = window.confirm(
            `Hủy payment ${payment.refNo || payment.id}? Khoản này sẽ không còn được tính vào tổng payment active.`,
        );

        if (!ok) return;

        setCancelingPaymentId(payment.id);

        try {
            await onCancelPayment({
                paymentId: payment.id,
                note: "Hủy payment từ màn quản lý thanh toán.",
            });

            setPayments((prev) =>
                prev.map((item) =>
                    item.id === payment.id
                        ? {
                            ...item,
                            status: "CANCELED",
                            note: item.note || "Hủy payment từ màn quản lý thanh toán.",
                            updatedAt: new Date().toISOString(),
                        }
                        : item,
                ),
            );

            await onReload();
            onUpdated?.();
        } finally {
            setCancelingPaymentId(null);
        }
    }

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-950">Danh sách payment</h3>

                {loading ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Đang tải
                    </div>
                ) : null}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1.45fr_1fr_1fr_1fr_150px] bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <div>Payment</div>
                    <div>Mục đích</div>
                    <div>Phương thức</div>
                    <div className="text-right">Số tiền</div>
                    <div className="text-right">Action</div>
                </div>

                {payments.length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-slate-400">
                        Chưa có payment.
                    </div>
                ) : (
                    payments.map((payment) => {
                        const direction = String(payment.direction ?? owner.direction ?? "IN").toUpperCase();
                        const amountPrefix = direction === "OUT" ? "-" : "+";
                        const isRowCompleting = activeCompleteId === payment.id;

                        return (
                            <div key={payment.id} className="border-t border-slate-100 px-4 py-4">
                                <div className="grid grid-cols-[1.45fr_1fr_1fr_1fr_150px] items-center gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-bold text-slate-950">
                                            {payment.refNo || payment.id}
                                        </div>

                                        <div className="mt-1 flex flex-wrap gap-1.5">
                                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                                {ownerTypeLabel(payment, owner)}
                                            </span>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusClass(
                                                    payment,
                                                )}`}
                                            >
                                                {statusLabel(payment)}
                                            </span>
                                        </div>

                                        {payment.note ? (
                                            <div className="mt-1 truncate text-xs text-slate-400">
                                                {payment.note}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="text-sm font-medium text-slate-600">
                                        {purposeLabel(payment.purpose)}
                                    </div>

                                    <div className="text-sm text-slate-500">
                                        {methodLabel(payment.method)}
                                    </div>

                                    <div className="text-right text-sm font-bold text-slate-950">
                                        {amountPrefix}
                                        {formatMoney(payment.amount, payment.currency || "VND")}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        {canComplete(payment) ? (
                                            <button
                                                type="button"
                                                disabled={submitting}
                                                onClick={() =>
                                                    setActiveCompleteId(
                                                        activeCompleteId === payment.id ? null : payment.id,
                                                    )
                                                }
                                                className="rounded-full px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                                            >
                                                Hoàn tất
                                            </button>
                                        ) : null}

                                        {onCancelPayment && canCancel(payment) ? (
                                            <button
                                                type="button"
                                                disabled={submitting || cancelingPaymentId === payment.id}
                                                onClick={() => submitCancelPayment(payment)}
                                                className="rounded-full px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                            >
                                                {cancelingPaymentId === payment.id ? "Đang hủy" : "Hủy"}
                                            </button>
                                        ) : null}
                                    </div>
                                </div>

                                {isRowCompleting && canComplete(payment) ? (
                                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                            Hoàn tất {payment.refNo || payment.id}
                                        </div>

                                        <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                                            <input
                                                value={completeReference}
                                                onChange={(event) => setCompleteReference(event.target.value)}
                                                placeholder="Mã tham chiếu / đối soát"
                                                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                                            />

                                            <input
                                                value={completeNote}
                                                onChange={(event) => setCompleteNote(event.target.value)}
                                                placeholder="Ghi chú hoàn tất"
                                                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                                            />

                                            <button
                                                type="button"
                                                disabled={submitting}
                                                onClick={() => submitCompletePayment(payment)}
                                                className="h-10 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white disabled:opacity-50"
                                            >
                                                Xác nhận
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
                    <XCircle className="h-4 w-4 text-slate-400" />
                    Quy tắc thao tác
                </div>

                <div className="space-y-2 text-xs leading-5 text-slate-500">
                    <p>Payment chưa thu có thể hoàn tất hoặc hủy.</p>
                    <p>Payment đã hoàn tất không hủy trực tiếp, cần xử lý refund/điều chỉnh riêng.</p>
                    <p>Tổng payment active không được vượt giá trị owner.</p>
                </div>
            </div>
        </div>
    );
}