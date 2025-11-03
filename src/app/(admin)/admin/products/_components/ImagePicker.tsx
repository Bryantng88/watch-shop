"use client";

import { useEffect, useState } from "react";

type Picked = { key: string; url: string };

export default function ImagePicker({
    value,
    onChange,
}: {
    value: Picked[];
    onChange: (v: Picked[]) => void;
}) {
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
    useEffect(() => {
        if (open) load(prefix);
    }, [open]);

    const toggle = (it: Picked) =>
        onChange(
            value.find((x) => x.key === it.key)
                ? value.filter((x) => x.key !== it.key)
                : [...value, it]
        );

    /** ---------- UI ---------- */
    return (
        <div className="space-y-4">
            {/* Dropzone (theo giao diện mẫu) */}
            <div
                onClick={() => setOpen(true)}
                className="
          flex flex-col items-center justify-center
          border-2 border-dashed border-gray-300
          bg-[#f9fbff] hover:bg-[#f2f6ff]
          rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-200 shadow-sm
        "
            >
                {/* icon */}
                <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-tr from-blue-400 to-blue-500 text-white p-3 rounded-xl shadow">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.6}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 10.5l4.5-4.5m0 0l4.5 4.5m-4.5-4.5V15"
                            />
                        </svg>
                    </div>
                </div>

                <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Drop your image here,</span>{" "}
                    or{" "}
                    <span className="text-blue-600 hover:underline font-medium">
                        browse
                    </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Supports: JPG, JPEG2000, PNG
                </p>

                {value.length > 0 && (
                    <p className="mt-3 text-xs text-blue-600 font-medium">
                        {value.length} image{value.length > 1 ? "s" : ""} selected
                    </p>
                )}
            </div>

            {/* Preview grid (nếu có ảnh đã chọn) */}
            {value.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                    {value.map((v) => (
                        <div
                            key={v.key}
                            className="relative rounded-xl border overflow-hidden bg-gray-100 group"
                            title={v.key}
                        >
                            <img
                                src={v.url}
                                alt=""
                                className="h-24 w-full object-cover group-hover:opacity-90"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(value.filter((x) => x.key !== v.key));
                                }}
                                className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-md text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL duyệt NAS */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-[900px] max-h-[80vh] overflow-auto p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-mono truncate">
                                /{prefix}
                            </div>
                            <button
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                                onClick={() => setOpen(false)}
                            >
                                Close
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
                                        className={`relative overflow-hidden rounded-lg border transition ${picked
                                                ? "ring-2 ring-blue-500 border-blue-400"
                                                : "hover:shadow-sm"
                                            }`}
                                    >
                                        <img src={f.url} className="h-28 w-full object-cover" />
                                        {picked && (
                                            <div className="absolute inset-0 bg-blue-500/20" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-end">
                            <button
                                className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                                onClick={() => setOpen(false)}
                            >
                                Use selected images
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
