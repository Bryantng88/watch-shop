"use client";

import { Save } from "lucide-react";
import { cx } from "./workbench-utils";
import type { WatchWorkbenchSection } from "./types";

const NAV_ITEMS: Array<{ id: WatchWorkbenchSection; label: string }> = [
    { id: "pricing", label: "1. Giá & cost ledger" },
    { id: "spec", label: "2. Spec" },
    { id: "content", label: "3. Nội dung" },
    { id: "images", label: "4. Hình ảnh" },
    { id: "trade", label: "5. Lịch sử" },
    { id: "timeline", label: "6. Timeline" },
    { id: "projection", label: "7. Projection" },
    { id: "media-modal", label: "8. Media WP modal" },
];

export default function WatchWorkbenchNav({
    activeSection,
    saving,
    dirty,
    onSave,
}: {
    activeSection: WatchWorkbenchSection;
    saving?: boolean;
    dirty?: boolean;
    onSave: () => void;
}) {
    return (
        <nav className="sticky top-0 z-30 flex flex-col gap-3 rounded-lg border border-slate-200/90 bg-white/90 p-2 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 gap-1 overflow-x-auto">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cx(
                            "inline-flex h-9 shrink-0 items-center rounded-md border px-3 text-xs font-semibold transition",
                            activeSection === item.id
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                        )}
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={!dirty || saving}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {saving ? "Đang lưu" : "Lưu thay đổi"}
                </button>
            </div>
        </nav>
    );
}
