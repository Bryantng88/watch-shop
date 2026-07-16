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
        <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[minmax(0,1fr)_140px_110px_80px] gap-3 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase text-slate-400">
                <div>Nguồn chi phí</div>
                <div className="text-right">Số tiền</div>
                <div>Trạng thái</div>
                <div>Thao tác</div>
            </div>
            {items.map((item) => (
                <div key={item.label} className="grid min-h-[54px] grid-cols-[minmax(0,1fr)_140px_110px_80px] items-center gap-3 border-t border-slate-100 px-3 py-2 text-sm hover:bg-slate-50/60">
                    <div className="min-w-0">
                        <div className="font-bold text-slate-900">{item.label}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{item.description}</div>
                    </div>
                    <div className="text-right font-bold text-rose-600">
                        {item.amount ? maskMoney(canViewSensitivePrice, item.amount) : "-"}
                    </div>
                    <div>
                        <Pill tone={item.status === "PAID" ? "green" : item.status === "UNPAID" ? "amber" : "slate"}>
                            {item.status === "NONE" ? "None" : item.status}
                        </Pill>
                    </div>
                    <button className="h-8 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Sửa
                    </button>
                </div>
            ))}
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
        <div className="rounded-md border border-slate-200 bg-white p-3">
            <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
            <div className={tone === "red" ? "mt-2 text-sm font-black text-rose-600" : "mt-2 text-sm font-black text-slate-950"}>
                {moneyText(value)}
            </div>
        </div>
    );
}
