"use client";

import { Layers } from "lucide-react";
import { operationButtonClass } from "../shared/OperationShell";
import { Header } from "./TradeHistoryCard";

export default function MediaWorkspaceModalDemo({
    title,
    imageUrl,
    onOpenMediaWorkspace,
    openingMediaWorkspace = false,
}: {
    title: string;
    imageUrl?: string | null;
    onOpenMediaWorkspace: () => void;
    openingMediaWorkspace?: boolean;
}) {
    return (
        <section id="media-modal" className="scroll-mt-24 overflow-hidden rounded-lg border border-dashed border-violet-200 bg-violet-50/35 p-3">
            <Header icon={<Layers className="h-4 w-4" />} title="WP Media Workspace modal mode" subtitle="Cùng cấp context cho Media Workspace, Watch page không phá modal xử lý hình ảnh." />
            <div className="mt-3 overflow-hidden rounded-lg border border-violet-200/80 bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-violet-100 bg-violet-50/50 px-4 py-3">
                    <b className="text-sm font-semibold text-slate-950">Xử lý Media - {title}</b>
                    <div className="inline-flex overflow-hidden rounded-md border border-violet-200 bg-white text-xs font-medium text-violet-700">
                        {["All", "Inline", "Highlight", "Bulk"].map((item) => (
                            <span key={item} className="border-l border-violet-100 px-3 py-2 first:border-l-0">{item}</span>
                        ))}
                    </div>
                </div>
                <div className="grid gap-3 p-4 md:grid-cols-[120px_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={title} className="aspect-square w-full object-cover" />
                        ) : (
                            <div className="grid aspect-square place-items-center text-xs text-slate-400">No image</div>
                        )}
                    </div>
                    <textarea
                        readOnly
                        className="min-h-[110px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                        value={`@Media WP: ${title}\nXử lý toàn bộ hình ảnh: nền trong suốt, cân bằng ánh sáng, crop chuẩn, giữ chi tiết đồng hồ.\nWatch vintage nên giữ màu tự nhiên, không làm quá.`}
                    />
                </div>
                <div className="flex justify-end gap-2 border-t border-violet-100 bg-violet-50/60 px-4 py-3">
                    <button className={operationButtonClass({ variant: "secondary", size: "sm", className: "text-xs" })}>Đóng</button>
                    <button className={operationButtonClass({ variant: "secondary", size: "sm", className: "text-xs" })}>Lưu mô tả</button>
                    <button
                        type="button"
                        onClick={onOpenMediaWorkspace}
                        disabled={openingMediaWorkspace}
                        className={operationButtonClass({ variant: "primary", size: "sm", className: "text-xs disabled:opacity-60" })}
                    >
                        {openingMediaWorkspace ? "Đang mở..." : "Mở Media Workspace"}
                    </button>
                </div>
            </div>
        </section>
    );
}
