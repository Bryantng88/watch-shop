"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { maskMoney, normalizeDate } from "@/domains/watch/client/workbench/workbench-utils";
import { operationButtonClass } from "../shared/OperationShell";

type TradeHistory = {
    acquisitions?: Array<Record<string, unknown>>;
    orders?: Array<Record<string, unknown>>;
};

function stringValue(value: unknown) {
    return typeof value === "string" ? value : "";
}

export default function TradeHistoryCard({
    tradeHistory,
    canViewSensitivePrice,
}: {
    tradeHistory?: TradeHistory | Array<Record<string, unknown>>;
    canViewSensitivePrice: boolean;
}) {
    const source = !Array.isArray(tradeHistory) && tradeHistory ? tradeHistory : {};
    const acquisitions = Array.isArray(source.acquisitions) ? source.acquisitions : [];
    const orders = Array.isArray(source.orders) ? source.orders : [];
    const events = [
        ...acquisitions.slice(0, 2).map((item) => ({
            title: "Nhập hàng",
            meta: `${normalizeDate(item.updatedAt || item.createdAt)} · Payment: ${maskMoney(canViewSensitivePrice, item.amount as string | number | null | undefined)} · ${stringValue(item.vendorName) || "Vendor"}`,
            href: `/admin/acquisitions?focus=${encodeURIComponent(stringValue(item.id))}`,
        })),
        ...orders.slice(0, 1).map((item) => ({
            title: "Bán hàng",
            meta: `${normalizeDate(item.updatedAt || item.createdAt)} · ${maskMoney(canViewSensitivePrice, item.amount as string | number | null | undefined)} · ${stringValue(item.customerName) || "Customer"}`,
            href: `/admin/orders?q=${encodeURIComponent(stringValue(item.refNo) || stringValue(item.id))}`,
        })),
    ];

    if (!events.length) {
        events.push({ title: "Chưa bán", meta: "Watch đang ở trạng thái in stock.", href: "/admin/orders" });
    }

    return (
        <aside id="trade" className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <Header icon={<ArrowLeftRight className="h-4 w-4" />} title="Lịch sử giao dịch" subtitle="Transaction context của watch." />
            <div className="p-4">
                <div className="space-y-4">
                    {events.map((item, index) => (
                        <Link href={item.href} key={`${item.title}-${index}`} className="grid grid-cols-[26px_minmax(0,1fr)] gap-3 rounded-lg p-1 transition hover:bg-violet-50">
                            <div className="grid h-6 w-6 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">{index + 1}</div>
                            <div>
                                <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                                <div className="mt-1 text-xs leading-5 text-slate-500">{item.meta}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                <Link href="/admin/orders" className={operationButtonClass({ variant: "secondary", size: "sm", className: "mt-4 w-full text-xs" })}>
                    Xem toàn bộ
                </Link>
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
        <div className="flex min-h-[68px] items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">{icon}</div>
            <div>
                <h3 className="text-[15px] font-bold leading-5 text-slate-950">{title}</h3>
                {subtitle ? <p className="mt-1 text-[11px] leading-4 text-slate-500">{subtitle}</p> : null}
            </div>
        </div>
    );
}
