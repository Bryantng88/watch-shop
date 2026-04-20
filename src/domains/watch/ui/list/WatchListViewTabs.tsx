"use client";

import type { ViewKey, WatchListCounts } from "./types";

const items: Array<{ key: ViewKey; label: string }> = [
    { key: "draft", label: "Draft" },
    { key: "processing", label: "Processing" },
    { key: "ready", label: "Ready" },
    { key: "hold", label: "Hold" },
    { key: "sold", label: "Sold" },
    { key: "all", label: "All" },
];

export default function WatchListViewTabs({
    value,
    counts,
    onChange,
}: {
    value: ViewKey;
    counts: WatchListCounts;
    onChange: (value: ViewKey) => void;
}) {
    return (
        <div className="border-b border-slate-200">
            <div className="flex min-w-max items-center gap-6 overflow-x-auto">
                {items.map((item) => {
                    const active = item.key === value;
                    const count = counts[item.key] ?? 0;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => onChange(item.key)}
                            className={[
                                "relative inline-flex h-12 shrink-0 items-center whitespace-nowrap text-sm transition",
                                active
                                    ? "font-semibold text-slate-950"
                                    : "font-medium text-slate-500 hover:text-slate-800",
                            ].join(" ")}
                        >
                            <span>{item.label}</span>
                            <span
                                className={[
                                    "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                                    active
                                        ? "bg-slate-100 text-slate-700"
                                        : "bg-slate-50 text-slate-400",
                                ].join(" ")}
                            >
                                {count}
                            </span>

                            {active ? (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}