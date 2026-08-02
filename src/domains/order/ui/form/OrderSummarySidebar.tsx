"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

import { Button } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";
import { fmtMoney } from "@/domains/order/ui/order-ui.helpers";

type Props = {
    itemsCount: number;
    subtotal: number;
    tradeInAmount?: number;
    isEdit?: boolean;
    canEdit?: boolean;
    submitting?: boolean;
    backHref: string;
    onCancel?: () => void;
    onSubmit: () => void;
};

export default function OrderSummarySidebar({
    itemsCount,
    subtotal,
    tradeInAmount = 0,
    isEdit,
    canEdit = true,
    submitting,
    backHref,
    onCancel,
    onSubmit,
}: Props) {
    return (
        <aside className="space-y-5 xl:sticky xl:top-4 xl:self-start">
            <SectionCard
                icon={<Wallet className="h-5 w-5" />}
                title="Tổng hợp"
                subtitle="Kiểm tra trước khi lưu."
            >
                <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs text-slate-500">Số dòng</div>
                        <div className="mt-1 text-sm font-semibold text-slate-950">
                            {itemsCount}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                        <div className="text-xs text-white/60">Tạm tính</div>
                        <div className="mt-1 text-lg font-semibold">
                            {fmtMoney(subtotal)}
                        </div>
                    </div>

                    {tradeInAmount > 0 ? (
                        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                            <div className="flex items-center justify-between gap-3 text-xs text-violet-700">
                                <span>Giá trị trade-in</span>
                                <span className="font-semibold">− {fmtMoney(tradeInAmount)}</span>
                            </div>
                            <div className="mt-3 border-t border-violet-200 pt-3">
                                <div className="text-xs text-violet-600">Chênh lệch giao dịch dự kiến</div>
                                <div className="mt-1 text-lg font-semibold text-violet-950">
                                    {fmtMoney(Math.max(0, subtotal - tradeInAmount))}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        className="w-full"
                        onClick={onSubmit}
                        disabled={submitting || !canEdit}
                    >
                        {submitting
                            ? "Đang lưu..."
                            : isEdit
                              ? "Lưu thay đổi"
                              : "Tạo đơn"}
                    </Button>

                    {onCancel ? (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                    ) : (
                        <Link
                            href={backHref}
                            className="block rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Hủy
                        </Link>
                    )}
                </div>
            </SectionCard>
        </aside>
    );
}
