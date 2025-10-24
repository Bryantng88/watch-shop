// src/app/(admin)/products/new/_components/ImagePicker.tsx
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

    return (
        <div className="space-y-3">
            {/* nút mở modal */}
            <button type="button" className="px-3 py-2 rounded bg-blue-600 text-white"
                onClick={() => setOpen(true)}>
                Chọn ảnh từ NAS ({value.length} đã chọn)
            </button>

            {/* preview ảnh đã chọn */}
            {value.length > 0 && (
                <div className="grid grid-cols-6 gap-2">
                    {value.map((v) => (
                        <img key={v.key} src={v.url} className="h-20 w-20 object-cover rounded" />
                    ))}
                </div>
            )}

            {/* modal rất đơn giản */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 w-[900px] max-h-[80vh] overflow-auto space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">/{prefix}</div>
                            <button className="text-gray-600" onClick={() => setOpen(false)}>Đóng</button>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {folders.map((f) => (
                                <button key={f.prefix} className="px-2 py-1 border rounded"
                                    onClick={() => load(f.prefix)}>
                                    {f.prefix.split("/").slice(-2, -1)[0] || "/"}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-6 gap-2">
                            {files.map((f) => {
                                const picked = value.some((x) => x.key === f.key);
                                return (
                                    <button key={f.key} type="button" onClick={() => toggle(f)}
                                        className={`relative rounded overflow-hidden border 
                                      ${picked ? "ring-2 ring-blue-500" : ""}`}>
                                        <img src={f.url} className="h-28 w-28 object-cover" />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end">
                            <button className="px-3 py-2 rounded bg-blue-600 text-white"
                                onClick={() => setOpen(false)}>
                                Dùng các ảnh đã chọn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
