"use client";

import { ImageIcon } from "lucide-react";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { OperationShell, Pill } from "../shared/OperationShell";

function imageSrc(values: WatchWorkbenchValues) {
    return values.media.inlineImage?.url || values.media.galleryImages?.[0]?.url || null;
}

export default function ImageBlock({
    values,
    onSave,
}: {
    values: WatchWorkbenchValues;
    onSave: () => void;
}) {
    const src = imageSrc(values);
    const rows = [
        ["Inline", values.media.inlineImage?.key ?? "-"],
        ["Thumbnail", values.media.inlineImage?.key ?? "-"],
        ["Service board", "-"],
        ["Gallery", values.media.galleryImages?.[0]?.key ?? "-"],
    ];

    return (
        <OperationShell
            id="images"
            number="4"
            title="Hình ảnh"
            icon={<ImageIcon className="h-4 w-4" />}
            description="Hình gallery, thumbnail và sản phẩm media quan bảo sẵn."
            actions={
                <>
                    <Pill tone="blue">Ảnh/tập gallery</Pill>
                    <button type="button" onClick={onSave} className="h-9 rounded-md bg-slate-950 px-3 text-xs font-bold text-white">
                        Làm gọn
                    </button>
                </>
            }
        >
            <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
                <div>
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt="Watch" className="aspect-square w-full object-cover" />
                        ) : (
                            <div className="grid aspect-square place-items-center text-sm font-semibold text-slate-400">Chưa có ảnh</div>
                        )}
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {[1, 2, 3, "+8"].map((item) => (
                            <button key={item} className="h-10 rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-600">{item}</button>
                        ))}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-[150px_minmax(0,1fr)_100px] gap-3 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase text-slate-400">
                        <div>Loại</div>
                        <div>Đường dẫn media</div>
                        <div>Action</div>
                    </div>
                    {rows.map(([label, key]) => (
                        <div key={label} className="grid min-h-[44px] grid-cols-[150px_minmax(0,1fr)_100px] items-center gap-3 border-t border-slate-100 px-3 py-2 text-sm">
                            <div className="font-semibold text-slate-700">{label}</div>
                            <div className="truncate text-xs text-slate-500">{key}</div>
                            <button className="h-8 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700">Đổi</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 md:flex-row md:items-center md:justify-between">
                <span>Workbench lưu ảnh trực tiếp và emit media event. Review ảnh vẫn thuộc Media Workspace modal.</span>
                <button type="button" className="h-8 rounded-md border border-emerald-200 bg-white px-3 font-bold text-emerald-700">Mở Media WP</button>
            </div>
        </OperationShell>
    );
}
