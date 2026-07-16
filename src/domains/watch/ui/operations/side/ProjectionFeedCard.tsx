"use client";

import { RadioTower } from "lucide-react";
import { Header } from "./TradeHistoryCard";

const items = [
    ["+8%", "Giá tương tự tăng trong 7 ngày qua", "green"],
    ["72%", "Xu hướng giao dịch tốt ở watches cùng phân khúc", "blue"],
    ["LOW", "Cạnh tranh thấp - cơ hội bán tốt hơn", "red"],
    ["GOOD", "Nhu cầu ổn định trong 30 ngày gần nhất", "green"],
    ["1200", "Searches keyword computron / tháng", "amber"],
] as const;

export default function ProjectionFeedCard() {
    return (
        <aside id="projection" className="scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.055)]">
            <Header icon={<RadioTower className="h-4 w-4" />} title="Projection feed" subtitle="Gợi ý thông minh từ dữ liệu thị trường." />
            <div className="space-y-2 p-4">
                {items.map(([badge, text, tone]) => (
                    <div key={text} className="flex min-h-10 items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 text-xs text-slate-600">
                        <span className={`rounded-full px-2 py-1 font-black ${toneClass(tone)}`}>{badge}</span>
                        <span>{text}</span>
                    </div>
                ))}
                <button className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50">
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
