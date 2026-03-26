"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    imageUrl: string | null; // fileKey
    onPick: (fileKey: string) => void;
};

type BrowseItem = { key: string; url: string };

type BrowseResponse = {
    prefix: string;
    rootPrefix?: string | null;
    folders?: { prefix: string }[];
    files?: BrowseItem[];
    error?: string;
};

function extractParentPrefix(fileKey: string | null | undefined) {
    const value = String(fileKey ?? "").trim().replace(/^\/+/, "");
    if (!value || !value.includes("/")) return "";
    return value.split("/").slice(0, -1).join("/");
}

function MediaGrid({
    open,
    initialPrefix,
    onPick,
}: {
    open: boolean;
    initialPrefix: string;
    onPick: (key: string) => void;
}) {
    const [files, setFiles] = useState<BrowseItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prefix, setPrefix] = useState("");
    const [folders, setFolders] = useState<{ prefix: string }[]>([]);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams();
        qs.set("profile", "inline");
        if (initialPrefix) qs.set("prefix", initialPrefix);

        fetch(`/api/media/browse?${qs.toString()}`, { cache: "no-store" })
            .then(async (r) => {
                const j: BrowseResponse = await r.json();
                if (!r.ok) throw new Error(j?.error || "Không thể tải ảnh");
                return j;
            })
            .then((j) => {
                if (cancelled) return;
                setPrefix(j.prefix || "");
                setFolders(j.folders || []);
                setFiles((j.files || []).filter((f) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f.key)));
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("browse media failed", err);
                setError(err?.message || "Không thể tải ảnh");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, initialPrefix]);

    async function openFolder(nextPrefix: string) {
        setLoading(true);
        setError(null);
        try {
            const qs = new URLSearchParams();
            qs.set("profile", "inline");
            if (nextPrefix) qs.set("prefix", nextPrefix);
            const res = await fetch(`/api/media/browse?${qs.toString()}`, { cache: "no-store" });
            const j: BrowseResponse = await res.json();
            if (!res.ok) throw new Error(j?.error || "Không thể tải ảnh");
            setPrefix(j.prefix || "");
            setFolders(j.folders || []);
            setFiles((j.files || []).filter((f) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f.key)));
        } catch (err: any) {
            console.error("browse media failed", err);
            setError(err?.message || "Không thể tải ảnh");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="py-10 text-center text-sm text-gray-500">Đang tải ảnh...</div>;
    }

    if (error) {
        return <div className="py-10 text-center text-sm text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600 font-mono truncate">/{prefix}</div>

            {!!folders.length && (
                <div className="flex flex-wrap gap-2">
                    {folders.map((folder) => (
                        <button
                            key={folder.prefix}
                            type="button"
                            className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                            onClick={() => openFolder(folder.prefix)}
                        >
                            {folder.prefix.split("/").filter(Boolean).slice(-1)[0] || "/"}
                        </button>
                    ))}
                </div>
            )}

            {!files.length ? (
                <div className="py-10 text-center text-sm text-gray-500">Không có ảnh nào</div>
            ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                    {files.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => onPick(f.key)}
                            className="overflow-hidden rounded-md border bg-white hover:ring-2 hover:ring-blue-500"
                            title={f.key}
                        >
                            <img src={f.url} alt={f.key} className="block h-24 w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function PickerModal({
    open,
    onClose,
    onPick,
    initialPrefix,
}: {
    open: boolean;
    onClose: () => void;
    onPick: (fileKey: string) => void;
    initialPrefix: string;
}) {
    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-medium">Chọn ảnh cho inline picker</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                </div>

                <div className="max-h-[calc(85vh-60px)] overflow-auto p-4">
                    <MediaGrid
                        open={open}
                        initialPrefix={initialPrefix}
                        onPick={(fileKey) => {
                            onPick(fileKey);
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function InlineImagePicker({ imageUrl, onPick }: Props) {
    const [open, setOpen] = useState(false);

    const initialPrefix = useMemo(() => extractParentPrefix(imageUrl), [imageUrl]);

    const previewSrc = useMemo(() => {
        if (!imageUrl) return null;
        return `/api/media/sign?key=${encodeURIComponent(imageUrl)}`;
    }, [imageUrl]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={[
                    "relative flex h-14 w-14 min-h-[56px] min-w-[56px] max-h-[56px] max-w-[56px]",
                    "shrink-0 items-center justify-center overflow-hidden rounded-md",
                    previewSrc ? "bg-transparent" : "bg-gray-100 hover:bg-gray-200",
                ].join(" ")}
            >
                {previewSrc ? (
                    <img src={previewSrc} alt="Product" className="block h-full w-full object-cover" />
                ) : (
                    <span className="text-sm text-gray-400">+</span>
                )}
            </button>
            <PickerModal
                open={open}
                onClose={() => setOpen(false)}
                onPick={onPick}
                initialPrefix={initialPrefix}
            />
        </>
    );
}
