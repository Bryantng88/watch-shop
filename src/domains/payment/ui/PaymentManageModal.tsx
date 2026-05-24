"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, CheckCircle2, Loader2, Plus, X } from "lucide-react";

import { Button, Input, Select } from "@/domains/shared/ui/form/fields";
import {
    PAYMENT_METHOD_OPTIONS,
    PAYMENT_PURPOSE_LABEL,
    PAYMENT_STATUS_LABEL,
    type PaymentListItem,
} from "../shared";

type OrderPaymentTarget = {
    id: string;
    refNo?: string | null;
    customerName?: string | null;
    totalAmount?: number | string | null;
    remainingAmount?: number | string | null;
    collectedAmount?: number | string | null;
};

type Props = {
    open: boolean;
    order: OrderPaymentTarget | null;
    submitting?: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    onCreatePayment: (payload: {
        ownerType: "ORDER";
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
};

function toNumber(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function formatMoney(value: unknown, currency = "VND") {
    return `${Math.round(toNumber(value)).toLocaleString("vi-VN")} ${currency}`;
}

function canComplete(payment: PaymentListItem) {
    const status = String(payment.status ?? "").toUpperCase();
    const direction = String(payment.direction ?? "").toUpperCase();
    return direction === "IN" && (status === "UNPAID" || status === "COLLECTED");
}

function statusClass(status: string) {
    const key = String(status ?? "").toUpperCase();
    if (key === "PAID") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (key === "COLLECTED") return "bg-amber-50 text-amber-700 ring-amber-100";
    if (key === "UNPAID") return "bg-slate-50 text-slate-600 ring-slate-200";
    if (key === "CANCELED" || key === "CANCELLED") return "bg-rose-50 text-rose-700 ring-rose-100";
    return "bg-slate-50 text-slate-600 ring-slate-200";
}

function directionLabel(direction?: string | null) {
    return String(direction ?? "").toUpperCase() === "OUT" ? "Chi ra" : "Thu vào";
}

function ownerLabel(ownerType?: string | null) {
    return String(ownerType ?? "").toUpperCase() === "SHIPMENT" ? "Shipment" : "Order";
}

export default function PaymentManageModal({
    open,
    order,
    submitting,
    onClose,
    onUpdated,
    onCreatePayment,
    onCompletePayment,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState<PaymentListItem[]>([]);

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("BANK_TRANSFER");
    const [note, setNote] = useState("");
    const [markPaidNow, setMarkPaidNow] = useState(false);

    const [completePaymentId, setCompletePaymentId] = useState("");
    const [reference, setReference] = useState("");
    const [completeNote, setCompleteNote] = useState("");

    const remainingAmount = useMemo(
        () => Math.max(0, toNumber(order?.remainingAmount ?? order?.totalAmount)),
        [order],
    );

    const codCollectedAmount = useMemo(() => {
        return payments.reduce((sum, payment) => {
            const method = String(payment.method ?? "").toUpperCase();
            const status = String(payment.status ?? "").toUpperCase();
            const direction = String(payment.direction ?? "").toUpperCase();

            if (method === "COD" && status === "COLLECTED" && direction === "IN") {
                return sum + toNumber(payment.amount);
            }

            return sum;
        }, 0);
    }, [payments]);

    const parsedAmount = toNumber(amount);
    const invalidCreateAmount = parsedAmount <= 0 || parsedAmount > remainingAmount;

    const completablePayments = useMemo(() => payments.filter(canComplete), [payments]);

    async function reloadPayments(targetOrder = order) {
        if (!targetOrder) return;

        setLoading(true);

        try {
            const res = await fetch(`/api/admin/orders/${targetOrder.id}/payment`, {
                cache: "no-store",
            });

            const json = await res.json();
            const items: PaymentListItem[] = Array.isArray(json?.items) ? json.items : [];

            setPayments(items);
            setCompletePaymentId(items.find(canComplete)?.id ?? "");
        } catch {
            setPayments([]);
            setCompletePaymentId("");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open || !order) return;

        setPayments([]);
        setAmount(String(Math.round(remainingAmount)));
        setMethod("BANK_TRANSFER");
        setNote("");
        setMarkPaidNow(false);
        setCompletePaymentId("");
        setReference("");
        setCompleteNote("");

        reloadPayments(order);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, order?.id, remainingAmount]);

    if (!open || !order) return null;

    const activeOrder = order;

    async function submitCreate(event: React.FormEvent) {
        event.preventDefault();
        if (invalidCreateAmount) return;

        await onCreatePayment({
            ownerType: "ORDER",
            ownerId: activeOrder.id,
            amount: parsedAmount,
            method,
            note: note.trim() || null,
            markPaidNow,
        });

        setAmount(String(Math.round(remainingAmount)));
        setNote("");
        setMarkPaidNow(false);
        await reloadPayments(activeOrder);
        onUpdated?.();
    }

    async function submitComplete(event: React.FormEvent) {
        event.preventDefault();
        if (!completePaymentId) return;

        await onCompletePayment({
            paymentId: completePaymentId,
            reference: reference.trim() || null,
            note: completeNote.trim() || null,
        });

        setReference("");
        setCompleteNote("");
        await reloadPayments(activeOrder);
        onUpdated?.();
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 py-6">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-slate-950 p-2 text-white">
                            <Banknote className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Payment domain
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-950">
                                Quản lý thanh toán
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {activeOrder.refNo || activeOrder.id} · {activeOrder.customerName || "-"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.25fr_0.85fr]">
                    <div className="border-r border-slate-100 px-6 py-5">
                        <div className="mb-5 rounded-3xl border border-slate-200 bg-slate-50/60 p-4">
                            <div className="grid grid-cols-3 divide-x divide-slate-200">
                                <div className="px-3 first:pl-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                                        Tổng đơn
                                    </p>
                                    <p className="mt-1 text-base font-bold text-slate-950">
                                        {formatMoney(activeOrder.totalAmount)}
                                    </p>
                                </div>

                                <div className="px-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-400">
                                        Còn phải thu
                                    </p>
                                    <p className="mt-1 text-base font-bold text-rose-600">
                                        {formatMoney(activeOrder.remainingAmount)}
                                    </p>
                                </div>

                                <div className="px-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-500">
                                        COD đối soát
                                    </p>
                                    <p className="mt-1 text-base font-bold text-amber-700">
                                        {formatMoney(codCollectedAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-bold text-slate-950">Danh sách payment</h3>
                            {loading ? (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Đang tải
                                </span>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            {!loading && !payments.length ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                                    Chưa có payment nào.
                                </div>
                            ) : null}

                            {payments.map((payment) => {
                                const status = String(payment.status ?? "").toUpperCase();
                                const purpose = String(payment.purpose ?? "");
                                const direction = String(payment.direction ?? "").toUpperCase();
                                const purposeText = (PAYMENT_PURPOSE_LABEL[purpose] ?? purpose) || "-";

                                return (
                                    <div
                                        key={payment.id}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-950">
                                                        {payment.refNo || payment.id}
                                                    </span>
                                                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                                        {ownerLabel(payment.ownerType)}
                                                    </span>
                                                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                                        {directionLabel(direction)}
                                                    </span>
                                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusClass(status)}`}>
                                                        {PAYMENT_STATUS_LABEL[status] ?? status}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {purposeText} · {payment.method || "-"}
                                                </p>

                                                {payment.note ? (
                                                    <p className="mt-1 text-xs text-slate-400">{payment.note}</p>
                                                ) : null}
                                            </div>

                                            <div
                                                className={
                                                    direction === "OUT"
                                                        ? "text-right font-bold text-rose-600"
                                                        : "text-right font-bold text-slate-950"
                                                }
                                            >
                                                {direction === "OUT" ? "-" : "+"}
                                                {formatMoney(payment.amount, payment.currency || "VND")}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-5 px-6 py-5">
                        {remainingAmount <= 0 ? (
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Đơn hàng đã đủ payment
                                </div>
                                <p className="mt-2 text-sm text-emerald-700/80">
                                    Không còn khoản phải thu. Chỉ tạo payment mới khi có phát sinh điều chỉnh hoặc phí bổ sung.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={submitCreate} className="rounded-2xl border border-slate-200 p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-slate-500" />
                                    <h3 className="text-sm font-bold text-slate-950">Tạo payment mới</h3>
                                </div>

                                <div className="space-y-3">
                                    <Input
                                        value={amount}
                                        onChange={(event) => setAmount(event.target.value)}
                                        placeholder="Số tiền"
                                    />

                                    <Select
                                        value={method}
                                        onChange={(event) => setMethod(event.target.value)}
                                        options={[...PAYMENT_METHOD_OPTIONS]}
                                    />

                                    <Input
                                        value={note}
                                        onChange={(event) => setNote(event.target.value)}
                                        placeholder="Ghi chú"
                                    />

                                    <label className="flex items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={markPaidNow}
                                            onChange={(event) => setMarkPaidNow(event.target.checked)}
                                        />
                                        Đánh dấu đã thanh toán ngay
                                    </label>

                                    <Button type="submit" disabled={submitting || invalidCreateAmount}>
                                        {submitting ? "Đang tạo..." : "Tạo payment"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        <form onSubmit={submitComplete} className="rounded-2xl border border-slate-200 p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-950">Hoàn tất payment</h3>
                            </div>

                            <div className="space-y-3">
                                <Select
                                    value={completePaymentId}
                                    onChange={(event) => setCompletePaymentId(event.target.value)}
                                    options={[
                                        { value: "", label: "Chọn payment cần hoàn tất" },
                                        ...completablePayments.map((payment) => ({
                                            value: payment.id,
                                            label: `${payment.refNo || payment.id} · ${formatMoney(payment.amount, payment.currency || "VND")}`,
                                        })),
                                    ]}
                                />

                                <Input
                                    value={reference}
                                    onChange={(event) => setReference(event.target.value)}
                                    placeholder="Mã tham chiếu / đối soát"
                                />

                                <Input
                                    value={completeNote}
                                    onChange={(event) => setCompleteNote(event.target.value)}
                                    placeholder="Ghi chú hoàn tất"
                                />

                                <Button type="submit" disabled={submitting || !completePaymentId}>
                                    {submitting ? "Đang cập nhật..." : "Hoàn tất payment"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}