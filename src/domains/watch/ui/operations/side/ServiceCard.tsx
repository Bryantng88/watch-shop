"use client";

import { Wrench } from "lucide-react";
import { Header } from "./TradeHistoryCard";
import { operationButtonClass } from "../shared/OperationShell";

function stringValue(value: unknown) {
    return typeof value === "string" ? value : "";
}

export default function ServiceCard({
    serviceHistory,
}: {
    serviceHistory?: Array<Record<string, unknown>>;
}) {
    const rows = Array.isArray(serviceHistory) ? serviceHistory.slice(0, 4) : [];
    const displayRows = rows.length ? rows : [{ issue: "Không cần service", status: "-", id: "empty" }];

    return (
        <aside className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
            <Header icon={<Wrench className="h-4 w-4" />} title="Service" subtitle={`${rows.length} service/TI có phát sinh chi phí`} />
            <div className="p-4">
                <div className="overflow-hidden rounded-lg border border-slate-200/80">
                    <div className="grid grid-cols-[minmax(0,1fr)_80px_28px] gap-2 bg-slate-50/80 px-3 py-2.5 text-[10px] font-semibold uppercase text-slate-400">
                        <div>Service code</div>
                        <div>Trạng thái</div>
                        <div>+</div>
                    </div>
                    {displayRows.map((item) => {
                        const id = stringValue(item.id) || stringValue(item.issue) || "service";

                        return (
                            <div key={id} className="grid min-h-[44px] grid-cols-[minmax(0,1fr)_80px_28px] items-center gap-2 border-t border-slate-100 px-3 py-2 text-xs">
                                <div className="truncate text-slate-600">{stringValue(item.issue) || stringValue(item.title)}</div>
                                <div className="truncate font-medium text-indigo-600">{stringValue(item.status) || "-"}</div>
                                <div className="font-medium text-slate-500">2</div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className={operationButtonClass({ variant: "softEmerald", size: "sm", className: "text-xs" })}>Xem service board</button>
                    <button className={operationButtonClass({ variant: "secondary", size: "sm", className: "text-xs" })}>Tạo service</button>
                </div>
            </div>
        </aside>
    );
}
