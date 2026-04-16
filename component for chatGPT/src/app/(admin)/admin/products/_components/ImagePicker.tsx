"use client";

import { useEffect, useMemo, useState } from "react";

type Picked = { key: string; url?: string };

type BrowseResponse = {
    profile?: string;
    rootPrefix?: string | null;
    prefix: string;
    folders: { prefix: string }[];
    files: { key: string; url: string }[];
    error?: string;
};

const imageSrc = (item: Picked) =>
    item.url?.trim() ? item.url : `/api/media/sign?key=${encodeURIComponent(item.key)}`;

function extractParentPrefix(items: Picked[]) {
    const firstKey = String(items?.[0]?.key ?? "").trim().replace(/^\/+/, "");
    if (!firstKey || !firstKey.includes("/")) return "";
    return firstKey.split("/").slice(0, -1).join("/");
}

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const initialPrefix = useMemo(() => extractParentPrefix(value), [value]);

    async function load(p = "") {
        setLoading(true);
        setError(null);
        try {
            const qs = new URLSearchParams();
            qs.set("profile", "edit");
            if (p) qs.set("prefix", p);
            const res = await fetch(`/api/media/browse?${qs.toString()}`, { cache: "no-store" });
            const json: BrowseResponse = await res.json();
            if (!res.ok) throw new Error(json?.error || "Không thể tải ảnh");
            setPrefix(json.prefix || "");
            setFolders(json.folders || []);
            setFiles(
                (json.files || [])
                    .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f.key))
                    .map((f) => ({ key: f.key, url: f.url }))
            );
        } catch (err: any) {
            console.error("browse media failed", err);
            setError(err?.message || "Không thể tải ảnh");
            setFolders([]);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) load(initialPrefix);
    }, [open, initialPrefix]);

    const toggle = (it: Picked) => {
        const existed = value.find((x) => x.key === it.key);
        if (existed) {
            onChange(value.filter((x) => x.key !== it.key));
            return;
        }
        if (value.length >= 4) return;
        onChange([...value, it]);
    };

    return (
        <div className="space-y-4">
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
                    or <span className="text-blue-600 hover:underline font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Chọn tối đa 4 ảnh từ thư mục products/edit/... Ảnh đầu tiên sẽ là ảnh đại diện trên web.</p>

                {value.length > 0 && (
                    <div className="mt-4 w-full space-y-3">
                        <div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
                            <img src={imageSrc(value[0])} alt="Selected product" className="h-36 w-full object-cover" />
                        </div>
                        <p className="text-xs text-blue-600 font-medium">
                            {value.length}/4 ảnh đã chọn
                        </p>
                    </div>
                )}
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                    {value.map((v) => (
                        <div
                            key={v.key}
                            className="relative rounded-xl border overflow-hidden bg-gray-100 group"
                            title={v.key}
                        >
                            <img src={imageSrc(v)} alt="" className="h-24 w-full object-cover group-hover:opacity-90" />
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

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-[900px] max-h-[80vh] overflow-auto p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-mono truncate">/{prefix || "products/edit/active"}</div>
                            <button
                                type="button"
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </button>
                        </div>

                        {loading ? (
                            <div className="py-10 text-center text-sm text-gray-500">Đang tải ảnh...</div>
                        ) : error ? (
                            <div className="py-10 text-center text-sm text-red-500">{error}</div>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    {folders.map((f) => (
                                        <button
                                            key={f.prefix}
                                            type="button"
                                            className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                                            onClick={() => load(f.prefix)}
                                        >
                                            {f.prefix.split("/").filter(Boolean).slice(-1)[0] || "/"}
                                        </button>
                                    ))}
                                </div>

                                <div className="text-xs text-gray-500">Chọn tối đa 4 ảnh. Ảnh được chọn đầu tiên sẽ là ảnh đại diện trên web.</div>

                                <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-3">
                                    {files.map((f) => {
                                        const picked = value.some((x) => x.key === f.key);
                                        return (
                                            <button
                                                key={f.key}
                                                type="button"
                                                onClick={() => toggle(f)}
                                                className={`relative overflow-hidden rounded-lg border transition ${picked ? "ring-2 ring-blue-500 border-blue-400" : "hover:shadow-sm"
                                                    }`}
                                            >
                                                <img src={imageSrc(f)} alt="" className="h-28 w-full object-cover" />
                                                {picked && <div className="absolute inset-0 bg-blue-500/20" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {!files.length && !folders.length && (
                                    <div className="py-10 text-center text-sm text-gray-500">Không có ảnh nào</div>
                                )}
                            </>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="button"
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
