"use client";

import { useMemo, useState } from "react";

import { Button, FieldLabel, Input, Select, Textarea } from "@/domains/shared/ui/form/fields";
import type { ShipmentListItem } from "../list/types";

const PAYMENT_METHOD_OPTIONS = [
    { value: "BANK_TRANSFER", label: "Chuyển khoản" },
    { value: "CASH", label: "Tiền mặt" },
];

function moneyPreview(value: string) {
    const amount = Number(String(value).replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) return "Không phát sinh / chưa nhập phí hoàn";
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
}

export default function ShipmentReturnFeeModal({
    shipment,
    submitting,
    onClose,
    onSubmit,
}: {
    shipment: ShipmentListItem | null;
    submitting?: boolean;
    onClose: () => void;
    onSubmit: (payload: {
        amount: number;
        method: string;
        reference?: string | null;
        note?: string | null;
    }) => void | Promise<void>;
}) {
    const [form, setForm] = useState({
        amount: "",
        method: "BANK_TRANSFER",
        reference: "",
        note: "",
    });

    const amount = useMemo(
        () => Number(String(form.amount).replace(/[^\d.-]/g, "")),
        [form.amount],
    );

    if (!shipment) return null;

    function patch(next: Partial<typeof form>) {
        setForm((prev) => ({ ...prev, ...next }));
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;

        onSubmit({
            amount: safeAmount,
            method: form.method,
            reference: form.reference.trim() || null,
            note: form.note.trim() || null,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
            <form onSubmit={submit} className="w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="text-xl font-semibold text-slate-950">Nhận hàng hoàn</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Xác nhận sale đã nhận lại hàng. Nếu có phí ship hoàn về, khoản này sẽ được ghi nhận là payment OUT riêng cho shipment.
                    </p>
                </div>

                <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
                    <div>
                        <FieldLabel>Phí hoàn hàng</FieldLabel>
                        <Input
                            value={form.amount}
                            onChange={(event) => patch({ amount: event.target.value })}
                            placeholder="Ví dụ: 30000"
                            autoFocus
                        />
                        <div className="mt-2 text-xs font-semibold text-slate-500">{moneyPreview(form.amount)}</div>
                    </div>

                    <div>
                        <FieldLabel>Phương thức trả phí</FieldLabel>
                        <Select
                            value={form.method}
                            onChange={(event) => patch({ method: event.target.value })}
                            options={PAYMENT_METHOD_OPTIONS}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <FieldLabel>Mã tham chiếu payment</FieldLabel>
                        <Input
                            value={form.reference}
                            onChange={(event) => patch({ reference: event.target.value })}
                            placeholder="Mã giao dịch ngân hàng / biên nhận"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <FieldLabel>Ghi chú</FieldLabel>
                        <Textarea
                            value={form.note}
                            onChange={(event) => patch({ note: event.target.value })}
                            placeholder="Ví dụ: đã nhận lại hàng, khách yêu cầu kiểm tra/xử lý thêm"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Đang lưu..." : "Nhận hàng hoàn"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
