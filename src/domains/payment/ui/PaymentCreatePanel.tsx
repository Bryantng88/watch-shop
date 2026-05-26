"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { PaymentOwner, PaymentOwnerType } from "./PaymentWorkspace";

const PAYMENT_METHODS = [
    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
    { value: "CASH", label: "Tiền mặt" },
    { value: "CARD", label: "Thẻ" },
];

type Props = {
    owner: PaymentOwner;
    defaultAmount: number;
    locked?: boolean;
    lockMessage?: string;
    submitting?: boolean;
    onReload: () => Promise<void>;
    onUpdated?: () => void;
    onCreatePayment: (payload: {
        ownerType: PaymentOwnerType;
        ownerId: string;
        amount: number;
        method: string;
        note?: string | null;
        markPaidNow: boolean;
    }) => void | Promise<void>;
};

function toNumber(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
}

export default function PaymentCreatePanel({
    owner,
    defaultAmount,
    locked = false,
    lockMessage,
    submitting,
    onReload,
    onUpdated,
    onCreatePayment,
}: Props) {
    const [expanded, setExpanded] = useState(false);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("BANK_TRANSFER");
    const [note, setNote] = useState("");
    const [markPaidNow, setMarkPaidNow] = useState(false);

    useEffect(() => {
        setAmount(defaultAmount > 0 ? String(Math.round(defaultAmount)) : "");
    }, [defaultAmount]);

    async function submit() {
        const value = toNumber(amount);
        if (value <= 0) return alert("Số tiền payment không hợp lệ.");

        await onCreatePayment({
            ownerType: owner.type,
            ownerId: owner.id,
            amount: value,
            method,
            note: note.trim() || null,
            markPaidNow,
        });

        setNote("");
        setMarkPaidNow(false);
        setExpanded(false);

        await onReload();
        onUpdated?.();
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <button
                type="button"
                onClick={() => {
                    if (locked) return;
                    setExpanded((v) => !v);
                }}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
                <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                    <Plus className="h-4 w-4 text-slate-500" />
                    Tạo payment mới
                </div>
                <span className="text-xs font-bold text-slate-400">
                    {locked ? "Đã đủ" : expanded ? "Thu gọn" : "Mở"}
                </span>
            </button>

            {locked ? (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        {lockMessage ?? "Payment đã hoàn tất. Không thể tạo thêm payment mới."}
                    </div>
                </div>
            ) : expanded ? (
                <div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-2">
                    <input
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        inputMode="numeric"
                        placeholder="Số tiền"
                        className="h-10 w-full border-b border-slate-200 text-sm outline-none focus:border-slate-500"
                    />

                    <select
                        value={method}
                        onChange={(event) => setMethod(event.target.value)}
                        className="h-10 w-full border-b border-slate-200 bg-white text-sm outline-none focus:border-slate-500"
                    >
                        {PAYMENT_METHODS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <input
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Ghi chú"
                        className="h-10 w-full border-b border-slate-200 text-sm outline-none placeholder:text-slate-300 focus:border-slate-500"
                    />

                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={markPaidNow}
                            onChange={(event) => setMarkPaidNow(event.target.checked)}
                        />
                        Đánh dấu đã thanh toán ngay
                    </label>

                    <button
                        type="button"
                        disabled={submitting}
                        onClick={submit}
                        className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white disabled:opacity-50"
                    >
                        Tạo payment
                    </button>
                </div>
            ) : null}
        </div>
    );
}