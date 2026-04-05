"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import HoverPreviewPortal from "../../__components/HoverPreviewPortal";

type Props = {
    imageUrl: string | null;
    onPick: (fileKey: string) => void;
    pending?: boolean;
    disabled?: boolean;
};

type BrowseFile = { key: string; url: string };

type BrowseResponse = {
    prefix?: string;
    root?: string;
    files?: BrowseFile[];
    error?: string;
};

function MediaGrid({
    open,
    onPick,
}: {
    open: boolean;
    onPick: (key: string) => void;
}) {
    const [files, setFiles] = useState<BrowseFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState<BrowseFile | null>(null);
    const [prefix, setPrefix] = useState("");

    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setLoading(true);

        fetch("/api/media/browse?profile=inline", { cache: "no-store" })
            .then(async (r) => {
                const j: BrowseResponse = await r.json();
                if (!r.ok) throw new Error(j.error || "Không thể tải ảnh inline");
                return j;
            })
            .then((j) => {
                if (cancelled) return;
                setPrefix(j.prefix || "");
                setFiles(Array.isArray(j.files) ? j.files : []);
            })
            .catch((err) => {
                if (!cancelled) console.error("browse inline media failed", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open]);

    useEffect(() => {
        if (!open) setHovered(null);
    }, [open]);

    if (loading) {
        return <div className="py-10 text-center text-sm text-gray-500">Đang tải ảnh...</div>;
    }

    if (!files.length) {
        return <div className="py-10 text-center text-sm text-gray-500">Không có ảnh nào</div>;
    }

    return (
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="space-y-2">
                <div className="text-xs text-gray-500">/{prefix}</div>

                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                    {files.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => onPick(f.key)}
                            onMouseEnter={() => setHovered(f)}
                            className="overflow-hidden rounded-md border bg-white hover:ring-2 hover:ring-blue-500"
                            title={f.key}
                        >
                            <img
                                src={f.url}
                                alt={f.key}
                                className="block h-24 w-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="sticky top-0 rounded-xl border bg-white p-3 shadow-sm">
                    {hovered ? (
                        <>
                            <div className="overflow-hidden rounded-lg border bg-gray-50">
                                <img
                                    src={hovered.url}
                                    alt={hovered.key}
                                    className="h-[260px] w-full object-contain bg-white"
                                />
                            </div>
                            <div className="mt-2 break-all text-xs text-gray-500" title={hovered.key}>
                                {hovered.key}
                            </div>
                        </>
                    ) : (
                        <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
                            Hover ảnh để xem lớn hơn
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PickerModal({
    open,
    onClose,
    onPick,
}: {
    open: boolean;
    onClose: () => void;
    onPick: (fileKey: string) => void;
}) {
    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[85vh] w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-2xl">
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

export default function InlineImagePicker({
    imageUrl,
    onPick,
    pending = false,
    disabled = false,
}: Props) {
    const [open, setOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    const previewSrc = useMemo(() => {
        if (!imageUrl) return null;
        return `/api/media/sign?key=${encodeURIComponent(imageUrl)}`;
    }, [imageUrl]);

    return (
        <>
            <div
                ref={triggerRef}
                className="relative inline-flex"
                onMouseEnter={() => setShowPreview(true)}
                onMouseLeave={() => setShowPreview(false)}
            >
                <button
                    type="button"
                    onClick={() => !disabled && setOpen(true)}
                    disabled={disabled}
                    className={[
                        "relative flex h-14 w-14 min-h-[56px] min-w-[56px] max-h-[56px] max-w-[56px]",
                        "shrink-0 items-center justify-center overflow-hidden rounded-md border",
                        "transition-colors",
                        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
                        previewSrc ? "bg-transparent" : "bg-gray-100 hover:bg-gray-200",
                    ].join(" ")}
                    title={imageUrl ?? "Chọn ảnh"}
                >
                    {previewSrc ? (
                        <img
                            src={previewSrc}
                            alt="Product"
                            className="block h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <span className="text-sm text-gray-400">+</span>
                    )}

                    {pending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                    )}
                </button>
            </div>

            <HoverPreviewPortal
                anchorRef={triggerRef}
                open={Boolean(previewSrc && showPreview && !open)}
                width={224}
                height={244}
            >
                <div className="rounded-xl border bg-white p-2 shadow-2xl">
                    <div className="overflow-hidden rounded-lg border bg-gray-50">
                        <img
                            src={previewSrc ?? ""}
                            alt="Preview"
                            className="h-56 w-full object-contain bg-white"
                        />
                    </div>
                    <div className="mt-2 text-[11px] text-gray-500">Ảnh đại diện hiện tại</div>
                </div>
            </HoverPreviewPortal>

            <PickerModal open={open} onClose={() => setOpen(false)} onPick={onPick} />
        </>
    );
}