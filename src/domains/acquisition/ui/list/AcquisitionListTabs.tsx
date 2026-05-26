"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import type { AcquisitionListCounts, AcquisitionListView } from "./types";

const tabs: Array<{ key: AcquisitionListView; label: string }> = [
    { key: "all", label: "Tất cả" },
    { key: "draft", label: "Draft" },
    { key: "posted", label: "Posted" },
    { key: "canceled", label: "Canceled" },
];

export default function AcquisitionListTabs({
    counts,
}: {
    counts: AcquisitionListCounts;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const currentView = (sp.get("view") || "all") as AcquisitionListView;

    function onChange(view: AcquisitionListView) {
        const next = new URLSearchParams(sp.toString());

        if (view === "all") next.delete("view");
        else next.set("view", view);

        next.delete("status");
        next.set("page", "1");

        router.push(`${pathname}?${next.toString()}`);
    }

    return (
        <div className="border-b border-slate-200">
            <div className="flex min-w-max items-center gap-6 overflow-x-auto">
                {tabs.map((tab) => {
                    const active = currentView === tab.key || (!sp.get("view") && tab.key === "all");

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={cn(
                                "relative inline-flex h-12 shrink-0 items-center whitespace-nowrap text-sm transition",
                                active
                                    ? "font-semibold text-slate-950"
                                    : "font-medium text-slate-500 hover:text-slate-800",
                            )}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={cn(
                                    "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                                    active ? "bg-slate-100 text-slate-700" : "bg-slate-50 text-slate-400",
                                )}
                            >
                                {counts[tab.key] ?? 0}
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