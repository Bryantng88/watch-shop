"use client";

import { Save, X } from "lucide-react";

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
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-14px_34px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6 xl:px-8">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Có thay đổi
                    </span>
                    <span>Workbench chỉ lưu domain data và emit event, không chạy duyệt workflow.</span>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={saving}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                        Hủy thay đổi
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Đang lưu" : "Lưu tất cả"}
                    </button>
                </div>
            </div>
        </div>
    );
}
