"use client";

import { Loader2, Save, X } from "lucide-react";
import { operationButtonClass } from "@/domains/watch/ui/operations/shared/OperationShell";

export default function WatchWorkbenchDirtyBar({
    dirty,
    saving,
    onSave,
    onReset,
}: {
    dirty: boolean;
    saving?: boolean;
    onSave: () => void;
    onReset: () => void;
}) {
    if (!dirty) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 shadow-[0_-10px_28px_rgba(15,23,42,0.07)] backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6 xl:px-8">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        Có thay đổi
                    </span>
                    <span>Workbench chỉ lưu domain data và emit event, không chạy duyệt workflow.</span>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={saving}
                        className={operationButtonClass({ variant: "secondary", size: "md", className: "h-10 disabled:opacity-50" })}
                    >
                        <X className="h-4 w-4" />
                        Hủy thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className={operationButtonClass({ variant: "primary", size: "md", className: "h-10 disabled:opacity-50" })}
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "Đang lưu" : "Lưu tất cả"}
                    </button>
                </div>
            </div>
        </div>
    );
}
