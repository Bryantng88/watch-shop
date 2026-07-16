"use client";

import { RadioTower } from "lucide-react";
import { Header } from "./TradeHistoryCard";
import { operationButtonClass } from "../shared/OperationShell";

const items = [
    ["+8%", "Giá tương tự tăng trong 7 ngày qua", "green"],
    ["72%", "Xu hướng giao dịch tốt ở watches cùng phân khúc", "blue"],
    ["LOW", "Cạnh tranh thấp, cơ hội bán tốt hơn", "red"],
    ["GOOD", "Nhu cầu ổn định trong 30 ngày gần nhất", "green"],
    ["1200", "Searches keyword computron / tháng", "amber"],
] as const;

export default function ProjectionFeedCard() {
    return (
        <aside id="projection" className="scroll-mt-24 overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
            <Header icon={<RadioTower className="h-4 w-4" />} title="Projection feed" subtitle="Gợi ý thông minh từ dữ liệu thị trường." />
            <div className="space-y-2 p-4">
                {items.map(([badge, text, tone]) => (
                    <div key={text} className="flex min-h-10 items-center gap-3 rounded-md border border-slate-100 bg-slate-50/70 px-3 text-xs leading-5 text-slate-600">
                        <span className={`rounded-full px-2 py-1 font-semibold ${toneClass(tone)}`}>{badge}</span>
                        <span>{text}</span>
                    </div>
                ))}
                <button className={operationButtonClass({ variant: "secondary", size: "sm", className: "mt-2 w-full text-xs" })}>
                    Xem chi tiết projection
                </button>
            </div>
        </aside>
    );
}

function toneClass(tone: string) {
    if (tone === "green") return "bg-emerald-50 text-emerald-700";
    if (tone === "blue") return "bg-blue-50 text-blue-700";
    if (tone === "red") return "bg-rose-50 text-rose-700";
    return "bg-amber-50 text-amber-700";
}
