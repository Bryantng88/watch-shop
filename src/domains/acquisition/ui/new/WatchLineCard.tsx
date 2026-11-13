"use client";

import { memo, useCallback, useMemo, useState } from "react";
import AcquisitionMoneyInput from "../shared/AcquisitionMoneyInput";
import { Expand, Trash2, X } from "lucide-react";
import MediaPickerInline from "@/components/media/MediaPickerInline";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import type { AcquisitionPurchasedWatch, AcquisitionWatchLine } from "../../client/form/acquisition-form.types";

type Props = {
    line: AcquisitionWatchLine;
    index: number;
    onChange: (id: string, patch: Partial<AcquisitionWatchLine>) => void;
    onRemove: (id: string) => void;
    codexStatus?: string;
    canRemove?: boolean;
    tradeIn?: boolean;
    currency?: string;
    purchasedWatches?: AcquisitionPurchasedWatch[];
};

function getPreviewSrc(line: Pick<AcquisitionWatchLine, "imageKey" | "imageUrl">) {
    if (line.imageUrl) return line.imageUrl;
    if (typeof line.imageKey === "string" && line.imageKey.trim()) {
        return `/api/media/sign?key=${encodeURIComponent(line.imageKey)}`;
    }
    return "";
}

const StableMediaPicker = memo(MediaPickerInline);

const WatchLineCard = memo(function WatchLineCard({
    line,
    index,
    onChange,
    onRemove,
    canRemove = true,
    tradeIn = false,
    purchasedWatches = [],
    currency = "VND",
    codexStatus,
}: Props) {
    const notify = useNotify();
    const [previewOpen, setPreviewOpen] = useState(false);

    const previewSrc = useMemo(() => getPreviewSrc({imageKey:line.imageKey,imageUrl:line.imageUrl}), [line.imageKey, line.imageUrl]);

    const setField = <K extends keyof AcquisitionWatchLine>(
        key: K,
        value: AcquisitionWatchLine[K]
    ) => {
        onChange(line.id, { [key]: value });
    };

    const handlePickImage = useCallback((nextFileKey: string) => {
        const key = String(nextFileKey ?? "").trim();

        if (!key) {
            notify.warning({
                title: "Chưa chọn ảnh",
                message: "Vui lòng chọn một ảnh hợp lệ.",
            });
            return;
        }

        onChange(line.id, {
            imageKey: key,
            imageUrl: `/api/media/sign?key=${encodeURIComponent(key)}`,
        });
    }, [line.id, onChange, notify]);

    return (
        <>
            <div className="border-b border-slate-100 bg-white py-4">
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

                        <select
                            value={line.audienceSegment}
                            onChange={(event) =>
                                setField(
                                    "audienceSegment",
                                    event.target.value as AcquisitionWatchLine["audienceSegment"],
                                )
                            }
                            className="h-7 rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                            aria-label={`Giới tính Watch #${index + 1}`}
                        >
                            <option value="MEN">Nam</option>
                            <option value="WOMEN">Nữ</option>
                        </select>
                    </div>

                    {canRemove ? (
                        <button
                            type="button"
                            onClick={() => onRemove(line.id)}
                            className="inline-flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                        </button>
                    ) : null}
                </div>

                {tradeIn ? (
                    <div className="mb-4 grid gap-3 rounded-md border border-violet-100 bg-violet-50/50 p-3 md:grid-cols-2">
                        <label className="text-xs font-semibold text-slate-700">
                            Nguồn đồng hồ
                            <select
                                value={line.tradeInSource}
                                onChange={(event) => {
                                    const source = event.target.value as AcquisitionWatchLine["tradeInSource"];
                                    onChange(line.id, { tradeInSource: source, sourceOrderItemId: null });
                                }}
                                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                            >
                                <option value="EXTERNAL">Đồng hồ ngoài</option>
                                <option value="CUSTOMER_PURCHASE">Đồng hồ khách đã mua</option>
                            </select>
                        </label>
                        {line.tradeInSource === "CUSTOMER_PURCHASE" ? (
                            <label className="text-xs font-semibold text-slate-700">
                                Watch trong lịch sử mua
                                <select
                                    required
                                    value={line.sourceOrderItemId ?? ""}
                                    onChange={(event) => {
                                        const selected = purchasedWatches.find((item) => item.sourceOrderItemId === event.target.value);
                                        onChange(line.id, {
                                            sourceOrderItemId: selected?.sourceOrderItemId ?? null,
                                            quickInput: selected?.title ?? line.quickInput,
                                            imageKey: selected?.imageKey ?? line.imageKey,
                                            imageUrl: selected?.imageUrl ?? line.imageUrl,
                                        });
                                    }}
                                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                                >
                                    <option value="">Chọn Watch đã mua</option>
                                    {purchasedWatches.map((item) => (
                                        <option key={item.sourceOrderItemId} value={item.sourceOrderItemId}>
                                            {item.title} · {item.sourceOrderRefNo ?? item.sourceOrderId}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : (
                            <div className="self-end pb-2 text-xs text-slate-500">Watch ngoài hệ thống sẽ được tạo mới khi duyệt phiếu.</div>
                        )}
                    </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[72px_minmax(210px,1.35fr)_minmax(170px,1fr)_160px_160px] xl:items-start">
                    <div className="row-span-2 min-w-0 space-y-1 xl:row-span-1">
                        <div className="flex h-7 items-end text-xs font-medium text-slate-500">
                            Ảnh
                        </div>

                        <div className="relative w-fit">
                            <StableMediaPicker
                                value={line.imageKey ?? ""}
                                onChange={handlePickImage}
                                pending={false}
                                disabled={false}
                                profile="inline"
                                audienceSegment={line.audienceSegment}
                                compact
                                className="h-[72px] w-[72px] rounded-md"
                            />

                            {previewSrc ? (
                                <button
                                    type="button"
                                    onClick={() => setPreviewOpen(true)}
                                    className="absolute inset-0 flex items-end justify-center rounded-md bg-black/0 transition hover:bg-black/10"
                                    title="Xem ảnh lớn"
                                >
                                    <span className="mb-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
                                        Xem lớn
                                    </span>
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                        <div className="flex h-7 items-end whitespace-nowrap text-xs font-medium text-slate-500">
                            Tên / mô tả nhanh
                        </div>
                        <input
                            maxLength={500}
                            value={line.quickInput}
                            onChange={(e) => setField("quickInput", e.target.value)}
                            aria-label={`Tên đồng hồ ${index + 1}`}
                            placeholder="VD: Seiko 5 7009 Automatic"
                            className="h-[42px] w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                        />
                        {codexStatus && <p role="status" className="text-xs leading-5 text-slate-500">{codexStatus}</p>}
                    </div>

                    <div className="min-w-0 space-y-1">
                        <div className="flex h-7 items-end whitespace-nowrap text-xs font-medium text-slate-500">
                            Gợi ý thêm cho AI
                        </div>
                        <input
                            maxLength={1000}
                            value={line.aiHint}
                            onChange={(e) => setField("aiHint", e.target.value)}
                            placeholder="VD: niềng 18K"
                            className="h-[42px] w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <div className="flex h-7 items-end whitespace-nowrap text-xs font-medium text-slate-500">
                            Giá nhập
                        </div>
                        <AcquisitionMoneyInput key={currency} label={`Giá nhập đồng hồ ${index + 1}`} value={line.cost} currency={currency} onChange={value => setField("cost", value)} />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <div
                            className="flex h-7 items-end whitespace-nowrap text-xs font-medium text-slate-500"
                            title="Không bắt buộc"
                        >
                            Giá bán đề xuất
                        </div>
                        <AcquisitionMoneyInput key={currency} label={`Giá bán đồng hồ ${index + 1}`} value={line.salePrice} currency={currency} placeholder="Tùy chọn" onChange={value => setField("salePrice", value)} />
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
});

export default WatchLineCard;
