"use client";

import { Trash2 } from "lucide-react";
import MediaPickerInline from "@/components/media/MediaPickerInline";
import type { AcquisitionWatchLine } from "../_server/acquisition-line.types";

type Props = {
    line: AcquisitionWatchLine;
    index: number;
    onChange: (next: AcquisitionWatchLine) => void;
    onRemove: () => void;
};

function signedMediaUrl(fileKey?: string | null) {
    if (!fileKey) return null;
    return `/api/media/sign?key=${encodeURIComponent(fileKey)}`;
}

export default function WatchLineCard({
    line,
    index,
    onChange,
    onRemove,
}: Props) {
    const setField = <K extends keyof AcquisitionWatchLine>(
        key: K,
        value: AcquisitionWatchLine[K]
    ) => {
        onChange({ ...line, [key]: value });
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                        Đồng hồ #{index + 1}
                    </div>
                    {!line.quickInput ? (
                        <div className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                            Trống
                        </div>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={onRemove}
                    className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[84px_minmax(0,1.5fr)_minmax(0,1.2fr)_90px_140px_110px] xl:items-start">
                <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Ảnh
                    </div>
                    <MediaPickerInline
                        value={line.imageUrl}
                        onChange={(fileKey) => {
                            onChange({
                                ...line,
                                imageKey: fileKey,
                                imageUrl: signedMediaUrl(fileKey),
                            });
                        }}
                        profile="inline"
                        compact
                        className="h-[72px] w-[72px] rounded-xl"
                    />
                </div>

                <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Mô tả nhanh / tên đồng hồ
                    </div>
                    <input
                        value={line.quickInput}
                        onChange={(e) => setField("quickInput", e.target.value)}
                        placeholder="VD: seiko tự động tròn mặt đen dây thép"
                        className="h-[42px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                    />
                </div>

                <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Gợi ý thêm cho AI
                    </div>
                    <input
                        value={line.aiHint}
                        onChange={(e) => setField("aiHint", e.target.value)}
                        placeholder="VD: niềng 18K gold, máy pin..."
                        className="h-[42px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                    />
                </div>

                <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        SL
                    </div>
                    <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => setField("quantity", Number(e.target.value || 1))}
                        className="h-[42px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                    />
                </div>

                <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Giá nhập
                    </div>
                    <input
                        type="number"
                        value={line.cost}
                        onChange={(e) =>
                            setField("cost", e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="h-[42px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                    />
                </div>

                <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Service
                    </div>
                    <label className="inline-flex h-[42px] items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={line.receiveService}
                            onChange={(e) => setField("receiveService", e.target.checked)}
                        />
                        <span>Có</span>
                    </label>
                </div>
            </div>
        </div>
    );
}