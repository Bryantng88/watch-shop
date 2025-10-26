"use client";

import { useEffect, useState } from "react";

type Picked = { key: string; url: string };

export default function ImagePicker({
    value,
    onChange,
}: { value: Picked[]; onChange: (v: Picked[]) => void }) {
    const [prefix, setPrefix] = useState("");
    const [folders, setFolders] = useState<{ prefix: string }[]>([]);
    const [files, setFiles] = useState<Picked[]>([]);
    const [open, setOpen] = useState(false);

    async function load(p = "") {
        const res = await fetch(`/api/media/browse?prefix=${encodeURIComponent(p)}`);
        const json = await res.json();
        setPrefix(json.prefix);
        setFolders(json.folders);
        setFiles(
            (json.files as any[])
                .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.key))
                .map((f) => ({ key: f.key, url: f.url }))
        );
    }
    useEffect(() => { if (open) load(prefix); }, [open]);

    const toggle = (it: Picked) =>
        onChange(
            value.find((x) => x.key === it.key)
                ? value.filter((x) => x.key !== it.key)
                : [...value, it]
        );

    /** ---------- UI ---------- */
    return (
        <div className="space-y-3">
            {/* GRID ảnh đã chọn + ô “Thêm ảnh” kiểu dropzone */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                {/* Card “Thêm ảnh” (mở NAS) */}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="
    group relative flex h-36 w-full flex-col items-center justify-center
    rounded-xl border-2 border-dashed border-blue-300/70 bg-blue-50/40
    hover:bg-blue-50 transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-400
          "
                >
                    {/* badge số ảnh đã chọn */}
                    <span className="
            absolute left-3 top-3 rounded-full bg-blue-600 px-2 py-0.5
            text-xs font-medium text-white
          ">
                        {value.length} đã chọn
                    </span>

                    {/* icon upload */}
                    <svg
                        className="h-9 w-9 text-blue-500 transition-transform duration-150 group-hover:scale-105"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                    >
                        <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 16.5v1.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V16.5" strokeLinecap="round" />
                    </svg>


                    <span className="text-blue-600 underline">Tải hình từ NAS</span>

                </button>

                {/* Preview ảnh đã chọn */}
                {value.map((v) => (
                    <div
                        key={v.key}
                        className="relative h-36 w-full overflow-hidden rounded-xl border bg-gray-100"

                        title={v.key}
                    >
                        <img src={v.url} alt="" className="h-full w-full object-cover" />
                        {/* nút bỏ chọn nhanh */}
                        <button
                            type="button"
                            onClick={() => onChange(value.filter((x) => x.key !== v.key))}
                            className="absolute right-2 top-2 rounded-md bg-black/55 px-2 py-1 text-xs text-white hover:bg-black/70"
                        >
                            Bỏ
                        </button>
                    </div>
                ))}
            </div>

            {/* MODAL duyệt NAS */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-[900px] max-h-[80vh] overflow-auto p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">/{prefix}</div>
                            <button
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                                onClick={() => setOpen(false)}
                            >
                                Đóng
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {folders.map((f) => (
                                <button
                                    key={f.prefix}
                                    className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                                    onClick={() => load(f.prefix)}
                                >
                                    {f.prefix.split("/").slice(-2, -1)[0] || "/"}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-3">
                            {files.map((f) => {
                                const picked = value.some((x) => x.key === f.key);
                                return (
                                    <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => toggle(f)}
                                        className={`
                      relative overflow-hidden rounded-lg border
                      ${picked ? "ring-2 ring-blue-500" : ""}
                    `}
                                    >
                                        <img src={f.url} className="h-28 w-full object-cover" />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end">
                            <button
                                className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                                onClick={() => setOpen(false)}
                            >
                                Dùng các ảnh đã chọn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
