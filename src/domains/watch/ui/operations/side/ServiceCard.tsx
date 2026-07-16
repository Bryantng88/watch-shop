"use client";

import { Wrench } from "lucide-react";
import { Header } from "./TradeHistoryCard";

export default function ServiceCard({
    serviceHistory,
}: {
    serviceHistory?: any[];
}) {
    const rows = Array.isArray(serviceHistory) ? serviceHistory.slice(0, 4) : [];

    return (
        <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.055)]">
            <Header icon={<Wrench className="h-4 w-4" />} title="Service" subtitle={`${rows.length} service/TI có phát sinh chi phí`} />
            <div className="p-4">
                <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-[minmax(0,1fr)_80px_28px] gap-2 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase text-slate-400">
                        <div>Service code</div>
                        <div>Trạng thái</div>
                        <div>+</div>
                    </div>
                    {(rows.length ? rows : [{ issue: "Không cần service", status: "-", id: "empty" }]).map((item) => (
                        <div key={item.id} className="grid min-h-[42px] grid-cols-[minmax(0,1fr)_80px_28px] items-center gap-2 border-t border-slate-100 px-3 py-2 text-xs">
                            <div className="truncate text-slate-600">{item.issue || item.title}</div>
                            <div className="truncate font-bold text-indigo-600">{item.status || "-"}</div>
                            <div className="font-bold text-slate-500">2</div>
                        </div>
                    ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className="h-9 rounded-md border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700">Xem service board</button>
                    <button className="h-9 rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700">Tạo service</button>
                </div>
            </div>
        </aside>
    );
}
