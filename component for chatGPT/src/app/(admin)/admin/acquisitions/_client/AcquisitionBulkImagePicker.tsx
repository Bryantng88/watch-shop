"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Folder, Image as ImageIcon, Loader2, RefreshCw, X } from "lucide-react";

type PreparedImage = {
    key: string;
    url: string;
    fromKey?: string;
};

type FailedImage = {
    fileKey: string;
    error: string;
};

type BrowseFolder = { prefix: string };
type BrowseFile = { key: string; url: string };

type BrowseResponse = {
    profile: string;
    root: string;
    prefix: string;
    folders: BrowseFolder[];
    files: BrowseFile[];
};

type Props = {
    onImport: (images: PreparedImage[]) => void;
    disabled?: boolean;
};

function nameFromKey(key: string) {
    return key.split("/").filter(Boolean).pop() || key;
}

function parentPrefix(prefix: string, root: string) {
    if (!prefix || prefix === root) return root;
    const parts = prefix.split("/").filter(Boolean);
    parts.pop();
    const next = parts.join("/");
    return next || root;
}

export default function AcquisitionBulkImagePicker({ onImport, disabled }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<BrowseResponse | null>(null);
    const [prefix, setPrefix] = useState<string>("products/inline/active");
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);

    const load = async (nextPrefix?: string) => {
        const target = nextPrefix ?? prefix;
        setLoading(true);

        try {
            const res = await fetch(
                `/api/media/browse?profile=inline&prefix=${encodeURIComponent(target)}`,
                { cache: "no-store" }
            );

            const json = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(json?.error || "Không thể duyệt thư mục ảnh.");
            }

            setData(json);
            setPrefix(json.prefix || target);
        } catch (error: any) {
            alert(error?.message || "Không thể duyệt thư mục ảnh.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open || data) return;
        void load(prefix);
    }, [open, data, prefix]);

    const toggleKey = (key: string) => {
        setSelectedKeys((prev) =>
            prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
        );
    };

    const clearSelection = () => setSelectedKeys([]);

    const submit = async () => {
        if (!selectedKeys.length) {
            alert("Bạn chưa chọn ảnh nào.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/admin/acquisitions/prepare-inline-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileKeys: selectedKeys }),
            });

            const json = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(json?.error || "Không thể nhập nhiều ảnh.");
            }

            const items: PreparedImage[] = Array.isArray(json?.items) ? json.items : [];
            const failed: FailedImage[] = Array.isArray(json?.failed) ? json.failed : [];

            if (items.length) {
                onImport(items);
            }

            if (failed.length) {
                alert(
                    `Đã nhập ${items.length} ảnh, nhưng có ${failed.length} ảnh lỗi:\n` +
                    failed
                        .slice(0, 8)
                        .map((item) => `- ${nameFromKey(item.fileKey)}: ${item.error}`)
                        .join("\n")
                );
            }

            if (!items.length && !failed.length) {
                alert("Không có ảnh nào được xử lý.");
                return;
            }

            setSelectedKeys([]);
            setOpen(false);
            setData(null);
            setPrefix("products/inline/active");
        } catch (error: any) {
            alert(error?.message || "Không thể nhập nhiều ảnh.");
        } finally {
            setSubmitting(false);
        }
    };

    const root = data?.root || "products/inline/active";
    const currentPrefix = data?.prefix || prefix;
    const folders = data?.folders || [];
    const files = data?.files || [];

    return (
        <>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <ImageIcon className="h-4 w-4" />
                Chọn nhiều ảnh từ NAS
            </button>

            {open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                            <div>
                                <div className="text-lg font-semibold text-slate-900">
                                    Chọn nhiều ảnh cho phiếu nhập
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Mỗi ảnh được chọn sẽ tạo ra một dòng đồng hồ mới trong phiếu nhập.
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]">
                            <aside className="border-b border-slate-200 p-4 xl:border-b-0 xl:border-r">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Thư mục</div>
                                        <div className="text-xs text-slate-500">{currentPrefix}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void load(currentPrefix)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => void load(root)}
                                        className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Folder className="h-4 w-4" />
                                        {root}
                                    </button>

                                    {currentPrefix !== root ? (
                                        <button
                                            type="button"
                                            onClick={() => void load(parentPrefix(currentPrefix, root))}
                                            className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Folder className="h-4 w-4" />
                                            ..
                                        </button>
                                    ) : null}

                                    {folders.map((folder) => (
                                        <button
                                            key={folder.prefix}
                                            type="button"
                                            onClick={() => void load(folder.prefix)}
                                            className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Folder className="h-4 w-4 text-amber-500" />
                                            <span className="truncate">{nameFromKey(folder.prefix)}</span>
                                        </button>
                                    ))}
                                </div>
                            </aside>

                            <section className="min-h-0 p-4">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div className="text-sm text-slate-600">
                                        Đã chọn{" "}
                                        <span className="font-semibold text-slate-900">
                                            {selectedKeys.length}
                                        </span>{" "}
                                        ảnh
                                    </div>

                                    <button
                                        type="button"
                                        onClick={clearSelection}
                                        disabled={!selectedKeys.length}
                                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Bỏ chọn hết
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tải ảnh...
                                    </div>
                                ) : files.length ? (
                                    <div className="grid max-h-[520px] grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3 xl:grid-cols-4">
                                        {files.map((file) => {
                                            const selected = selectedSet.has(file.key);

                                            return (
                                                <button
                                                    key={file.key}
                                                    type="button"
                                                    onClick={() => toggleKey(file.key)}
                                                    className={`group overflow-hidden rounded-2xl border text-left transition ${selected
                                                            ? "border-slate-900 ring-2 ring-slate-900/10"
                                                            : "border-slate-200 hover:border-slate-300"
                                                        }`}
                                                >
                                                    <div className="relative aspect-square bg-slate-100">
                                                        <img
                                                            src={file.url}
                                                            alt={nameFromKey(file.key)}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-sm">
                                                            {selected ? (
                                                                <Check className="h-4 w-4 text-slate-900" />
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="p-3">
                                                        <div className="truncate text-sm font-medium text-slate-900">
                                                            {nameFromKey(file.key)}
                                                        </div>
                                                        <div className="mt-1 truncate text-xs text-slate-500">
                                                            {file.key}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500">
                                        Thư mục này chưa có ảnh phù hợp để chọn.
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                            <div className="text-sm text-slate-500">
                                Ảnh sau khi chọn sẽ được chuyển sang vùng chosen để gắn tạm cho phiếu nhập.
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Đóng
                                </button>

                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={!selectedKeys.length || submitting}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    Tạo {selectedKeys.length} dòng sản phẩm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}