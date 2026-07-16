"use client";

import type { ReactNode } from "react";
import { ArrowLeftRight } from "lucide-react";
import { maskMoney, normalizeDate } from "@/domains/watch/client/workbench/workbench-utils";

export default function TradeHistoryCard({
    tradeHistory,
    canViewSensitivePrice,
}: {
    tradeHistory?: { acquisitions?: any[]; orders?: any[] } | any[];
    canViewSensitivePrice: boolean;
}) {
    const acquisitions = Array.isArray((tradeHistory as any)?.acquisitions)
        ? (tradeHistory as any).acquisitions
        : [];
    const orders = Array.isArray((tradeHistory as any)?.orders)
        ? (tradeHistory as any).orders
        : [];
    const events = [
        ...acquisitions.slice(0, 2).map((item: any) => ({
            title: "Nhập hàng",
            meta: `${normalizeDate(item.updatedAt || item.createdAt)} · Payment: ${maskMoney(canViewSensitivePrice, item.amount)} · ${item.vendorName ?? "Vendor"}`,
        })),
        ...orders.slice(0, 1).map((item: any) => ({
            title: "Bán hàng",
            meta: `${normalizeDate(item.updatedAt || item.createdAt)} · ${maskMoney(canViewSensitivePrice, item.amount)} · ${item.customerName ?? "Customer"}`,
        })),
    ];

    if (!events.length) {
        events.push({ title: "Chưa bán", meta: "Watch đang ở trạng thái in stock." });
    }

    return (
        <aside id="trade" className="scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.055)]">
            <Header icon={<ArrowLeftRight className="h-4 w-4" />} title="Lịch sử giao dịch" subtitle="Transaction context của watch." />
            <div className="p-4">
                <div className="space-y-4">
                    {events.map((item, index) => (
                        <div key={`${item.title}-${index}`} className="grid grid-cols-[26px_minmax(0,1fr)] gap-3">
                            <div className="grid h-6 w-6 place-items-center rounded-full bg-indigo-50 text-xs font-black text-indigo-600">{index + 1}</div>
                            <div>
                                <div className="text-sm font-black text-slate-950">{item.title}</div>
                                <div className="mt-1 text-xs leading-5 text-slate-500">{item.meta}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-4 h-9 w-full rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50">
                    Xem toàn bộ
                </button>
            </div>
        </aside>
    );
}

export function Header({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="flex min-h-[74px] items-center gap-3 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/80 px-4 py-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
            <div>
                <h3 className="text-lg font-black text-slate-950">{title}</h3>
                {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
            </div>
        </div>
    );
}
