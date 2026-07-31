"use client";

import { maskMoney, moneyText } from "@/domains/watch/client/workbench/workbench-utils";
import { Pill } from "../shared/OperationShell";

export type PriceLedgerItem = {
    label: string;
    description: string;
    amount?: string | number | null;
    status: "PAID" | "UNPAID" | "NONE";
};

export default function PriceLedgerTable({
    items,
    canViewSensitivePrice,
}: {
    items: PriceLedgerItem[];
    canViewSensitivePrice: boolean;
}) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200/80">
            <div className="grid grid-cols-[minmax(0,1fr)_140px_110px] gap-3 bg-slate-50/80 px-4 py-2.5 text-[11px] font-semibold uppercase text-slate-400">
                <div>Nguồn chi phí</div>
                <div className="text-right">Số tiền</div>
                <div>Trạng thái</div>
            </div>
            {items.map((item) => (
                <div key={item.label} className="grid min-h-[58px] grid-cols-[minmax(0,1fr)_140px_110px] items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm transition hover:bg-slate-50/70">
                    <div className="min-w-0">
                        <div className="font-semibold text-slate-900">{item.label}</div>
                        <div className="mt-1 truncate text-xs leading-5 text-slate-500">{item.description}</div>
                    </div>
                    <div className="text-right font-semibold text-rose-600">
                        {item.amount ? maskMoney(canViewSensitivePrice, item.amount) : "-"}
                    </div>
                    <div>
                        <Pill tone={item.status === "PAID" ? "green" : item.status === "UNPAID" ? "amber" : "slate"}>
                            {item.status === "NONE" ? "None" : item.status}
                        </Pill>
                    </div>
                </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs font-bold text-slate-500">Tổng giá vốn</span>
                <span className="text-sm font-bold text-slate-950">
                    {maskMoney(
                        canViewSensitivePrice,
                        items.reduce((total, item) => total + Number(item.amount ?? 0), 0),
                    )}
                </span>
            </div>
        </div>
    );
}

export function PriceSnapshot({
    label,
    value,
    tone = "slate",
}: {
    label: string;
    value: string | number | null | undefined;
    tone?: "slate" | "red";
}) {
    return (
        <div className="rounded-md border border-slate-200/80 bg-white p-3">
            <div className="text-[10px] font-semibold uppercase text-slate-400">{label}</div>
            <div className={tone === "red" ? "mt-2 text-sm font-semibold text-rose-600" : "mt-2 text-sm font-semibold text-slate-950"}>
                {moneyText(value)}
            </div>
        </div>
    );
}
