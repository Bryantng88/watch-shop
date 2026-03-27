"use client";

import { useEffect, useState } from "react";

type Picked = { key: string; url?: string };

type BrowseResponse = {
    prefix: string;
    root?: string;
    folders?: { prefix: string }[];
    files?: { key: string; url: string }[];
    error?: string;
};

const imageSrc = (item: Picked) =>
    item.url?.trim() ? item.url : `/api/media/sign?key=${encodeURIComponent(item.key)}`;

function parentPrefix(prefix: string) {
    const cleaned = String(prefix || "").replace(/\/+$/, "");
    if (!cleaned.includes("/")) return "";
    return cleaned.split("/").slice(0, -1).join("/");
}

export default function ImagePicker({
    value,
    onChange,
}: {
    value: Picked[];
    onChange: (v: Picked[]) => void;
}) {
    const [prefix, setPrefix] = useState("");
    const [root, setRoot] = useState("");
    const [folders, setFolders] = useState<{ prefix: string }[]>([]);
    const [files, setFiles] = useState<Picked[]>([]);
    const [open, setOpen] = useState(false);

    async function load(nextPrefix = "") {
        const qs = new URLSearchParams({ profile: "edit" });
        if (nextPrefix) qs.set("prefix", nextPrefix);
        const res = await fetch(`/api/media/browse?${qs.toString()}`, { cache: "no-store" });
        const json: BrowseResponse = await res.json();
        if (!res.ok) throw new Error(json.error || "Không thể tải thư mục ảnh edit");
        setPrefix(json.prefix || "");
        setRoot(json.root || "");
        setFolders(json.folders || []);
        setFiles(
            (json.files || [])
                .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f.key))
                .map((f) => ({ key: f.key, url: f.url }))
        );
    }

    useEffect(() => {
        if (!open) return;
        load().catch((err) => console.error(err));
    }, [open]);

    const toggle = (it: Picked) =>
        onChange(
            value.find((x) => x.key === it.key)
                ? value.filter((x) => x.key !== it.key)
                : [...value, it]
        );

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
                <p className="text-xs text-gray-400 mt-1">Supports: JPG, JPEG2000, PNG</p>

                {value.length > 0 && (
                    <div className="mt-4 w-full space-y-3">
                        <div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
                            <img
                                src={imageSrc(value[0])}
                                alt="Selected product"
                                className="h-36 w-full object-cover"
                            />
                        </div>
                        <p className="text-xs text-blue-600 font-medium">
                            {value.length} image{value.length > 1 ? "s" : ""} selected
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
                            <img
                                src={imageSrc(v)}
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

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-[900px] max-h-[80vh] overflow-auto p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 font-mono truncate">/{prefix || root}</div>
                            <button
                                type="button"
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                                disabled={!prefix || prefix === root}
                                onClick={() => load(prefix && prefix !== root ? parentPrefix(prefix) : root).catch((err) => console.error(err))}
                            >
                                Up
                            </button>
                            <div className="text-xs text-gray-500 truncate">/{prefix || root}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {folders.map((f) => (
                                <button
                                    key={f.prefix}
                                    type="button"
                                    className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                                    onClick={() => load(f.prefix).catch((err) => console.error(err))}
                                >
                                    {f.prefix.replace(/\/+$/, "").split("/").pop() || "/"}
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
                                        className={`relative overflow-hidden rounded-lg border transition ${picked ? "ring-2 ring-blue-500 border-blue-400" : "hover:shadow-sm"
                                            }`}
                                    >
                                        <img src={imageSrc(f)} alt="" className="h-28 w-full object-cover" />
                                        {picked && <div className="absolute inset-0 bg-blue-500/20" />}
                                    </button>
                                );
                            })}
                        </div>

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
