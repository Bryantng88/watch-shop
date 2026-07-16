"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { Header } from "./TradeHistoryCard";

export default function MediaWorkspaceModalDemo({
    productId,
    title,
    imageUrl,
}: {
    productId: string;
    title: string;
    imageUrl?: string | null;
}) {
    return (
        <section id="media-modal" className="scroll-mt-24 overflow-hidden rounded-lg border border-dashed border-violet-300 bg-violet-50/40 p-3">
            <Header icon={<Layers className="h-4 w-4" />} title="WP Media Workspace modal mode" subtitle="Cùng cấp context cho Media Workspace, Watch page không phá modal xử lý hình ảnh." />
            <div className="mt-3 overflow-hidden rounded-lg border border-violet-200 bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-violet-100 bg-violet-50/60 px-4 py-3">
                    <b className="text-sm text-slate-950">Xử lý Media - {title}</b>
                    <div className="inline-flex overflow-hidden rounded-md border border-violet-200 bg-white text-xs font-bold text-violet-700">
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
                    <button className="h-9 rounded-md border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700">Đóng</button>
                    <button className="h-9 rounded-md border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700">Lưu mô tả</button>
                    <Link href={`/admin/watches/${productId}/edit?embedded=1&mode=media`} className="inline-flex h-9 items-center rounded-md bg-violet-600 px-4 text-xs font-bold text-white">
                        Mở Media Workspace
                    </Link>
                </div>
            </div>
        </section>
    );
}
