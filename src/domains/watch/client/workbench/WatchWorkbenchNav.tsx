"use client";

import { Loader2, Save } from "lucide-react";
import { operationButtonClass } from "@/domains/watch/ui/operations/shared/OperationShell";
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
        <nav className="sticky top-0 z-30 flex flex-col gap-3 rounded-lg border border-slate-200/80 bg-white/95 p-2 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 gap-1 overflow-x-auto">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cx(
                            "inline-flex h-9 shrink-0 items-center rounded-md border px-3 text-xs font-medium transition",
                            activeSection === item.id
                                ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
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
                    className={operationButtonClass({ variant: "secondary", size: "sm", className: "text-xs disabled:opacity-50" })}
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Đang lưu" : "Lưu thay đổi"}
                </button>
            </div>
        </nav>
    );
}
