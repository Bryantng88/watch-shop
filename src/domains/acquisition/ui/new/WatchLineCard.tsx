"use client";

import { useMemo, useState } from "react";
import { Expand, Loader2, Trash2, X } from "lucide-react";
import MediaPickerInline from "@/components/media/MediaPickerInline";
import type { AcquisitionWatchLine } from "./acquisition-form.types";

type Props = {
    line: AcquisitionWatchLine;
    index: number;
    onChange: (next: AcquisitionWatchLine) => void;
    onRemove: () => void;
    canRemove?: boolean;
};

function formatMoneyDisplay(value: string | number | null | undefined) {
    if (value === "" || value == null) return "";
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) return "";
    return new Intl.NumberFormat("vi-VN").format(num);
}

function parseMoneyInput(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return "";
    return Number(digits);
}

function getPreviewSrc(line: AcquisitionWatchLine) {
    if (line.imageUrl) return line.imageUrl;
    if (typeof line.imageKey === "string" && line.imageKey.trim()) {
        return `/api/media/sign?key=${encodeURIComponent(line.imageKey)}`;
    }
    return "";
}

export default function WatchLineCard({
    line,
    index,
    onChange,
    onRemove,
    canRemove = true,
}: Props) {
    const [movingImage, setMovingImage] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const previewSrc = useMemo(() => getPreviewSrc(line), [line]);
    const formattedCost = formatMoneyDisplay(line.cost);

    const setField = <K extends keyof AcquisitionWatchLine>(
        key: K,
        value: AcquisitionWatchLine[K]
    ) => {
        onChange({ ...line, [key]: value });
    };

    const handlePickImage = async (fileKey: string) => {
        if (!fileKey) return;
        setMovingImage(true);

        try {
            const res = await fetch("/api/admin/acquisitions/prepare-inline-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileKeys: [fileKey] }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || "Không thể xử lý ảnh đã chọn.");
            }

            const first = data?.items?.[0];
            onChange({
                ...line,
                imageKey: first?.key ?? null,
                imageUrl: first?.url ?? null,
            });
        } catch (error: any) {
            alert(error?.message || "Không thể xử lý ảnh đã chọn.");
        } finally {
            setMovingImage(false);
        }
    };

    const handleCostChange = (raw: string) => {
        setField("cost", parseMoneyInput(raw) as AcquisitionWatchLine["cost"]);
    };

    return (
        <>
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

                        {movingImage ? (
                            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Đang xử lý ảnh
                            </div>
                        ) : null}
                    </div>

                    {canRemove ? (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                        </button>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[96px_minmax(0,1.5fr)_minmax(0,1.2fr)_90px_160px_110px] xl:items-start">
                    <div className="space-y-1">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            Ảnh
                        </div>

                        <div className="relative w-fit">
                            <MediaPickerInline
                                value={line.imageUrl || line.imageKey}
                                onChange={handlePickImage}
                                pending={movingImage}
                                disabled={movingImage}
                                profile="inline"
                                compact
                                className="h-[72px] w-[72px] rounded-xl"
                            />

                            {previewSrc ? (
                                <button
                                    type="button"
                                    onClick={() => setPreviewOpen(true)}
                                    className="absolute inset-0 flex items-end justify-center rounded-xl bg-black/0 transition hover:bg-black/10"
                                    title="Xem ảnh lớn"
                                >
                                    <span className="mb-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
                                        Xem lớn
                                    </span>
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            Mô tả nhanh / tên đồng hồ
                        </div>
                        <input
                            value={line.quickInput}
                            onChange={(e) => setField("quickInput", e.target.value)}
                            placeholder="VD: seiko tự động tròn mặt đen"
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
                            placeholder="VD: niềng 18K gold, máy..."
                            className="h-[42px] w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            SL
                        </div>
                        <input
                            type="number"
                            min={1}
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
                            type="text"
                            inputMode="numeric"
                            value={formattedCost}
                            onChange={(e) => handleCostChange(e.target.value)}
                            placeholder="0"
                            className="h-[42px] w-full rounded-xl border border-slate-200 px-3 text-right text-sm font-medium tabular-nums outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
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

            {previewOpen && previewSrc ? (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setPreviewOpen(false)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white p-3 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewOpen(false)}
                            className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-3 flex items-center gap-2 px-2 pt-1 text-sm font-medium text-slate-700">
                            <Expand className="h-4 w-4" />
                            Đồng hồ #{index + 1}
                        </div>

                        <img
                            src={previewSrc}
                            alt={`Preview đồng hồ #${index + 1}`}
                            className="max-h-[78vh] max-w-[84vw] rounded-2xl object-contain"
                        />
                    </div>
                </div>
            ) : null}
        </>
    );
}