"use client";

import type { Counts, ViewKey } from "./types";

const tabs: Array<{ key: ViewKey; label: string }> = [
    { key: "draft", label: "Draft" },
    { key: "processing", label: "Processing" },
    { key: "ready", label: "Ready" },
    { key: "hold", label: "Hold" },
    { key: "sold", label: "Sold" },
    { key: "all", label: "All" },
];

export default function WatchListViewTabs({
    currentView,
    counts,
    onChange,
}: {
    currentView: ViewKey;
    counts: Counts;
    onChange: (view: ViewKey) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
                const active = currentView === tab.key;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={[
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                            active
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:text-slate-900",
                        ].join(" ")}
                    >
                        <span>{tab.label}</span>
                        <span
                            className={[
                                "rounded-full px-2 py-0.5 text-xs",
                                active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                        >
                            {counts[tab.key]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}