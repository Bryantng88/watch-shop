"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AcquisitionListCounts, AcquisitionListView } from "./types";
import { cx } from "./helpers";

const tabs: Array<{ key: AcquisitionListView; label: string }> = [
    { key: "all", label: "Tất cả" },
    { key: "draft", label: "DRAFT" },
    { key: "posted", label: "POSTED" },
    { key: "canceled", label: "CANCELED" },
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
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-4 text-sm">
            {tabs.map((tab) => {
                const active = currentView === tab.key || (!sp.get("view") && tab.key === "all");

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={cx(
                            "relative pb-2 font-medium transition",
                            active ? "text-slate-950" : "text-slate-600 hover:text-slate-900"
                        )}
                    >
                        <span>{tab.label}</span>
                        <span className="ml-2 text-slate-400">{counts[tab.key]}</span>
                        {active ? (
                            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
}