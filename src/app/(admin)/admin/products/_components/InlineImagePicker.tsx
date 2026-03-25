"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    imageUrl: string | null; // fileKey
    onPick: (fileKey: string) => void;
};

type PreviewPosition = {
    top: number;
    left: number;
};

function MediaGrid({
    open,
    onPick,
}: {
    open: boolean;
    onPick: (key: string) => void;
}) {
    const [files, setFiles] = useState<{ key: string; url: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!open || loaded) return;

        let cancelled = false;
        setLoading(true);

        fetch("/api/media/browse")
            .then((r) => r.json())
            .then((j) => {
                if (cancelled) return;
                const imgs = (j.files || [])
                    .filter((f: any) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f.key))
                    .map((f: any) => ({ key: f.key, url: f.url }));
                setFiles(imgs);
                setLoaded(true);
            })
            .catch((err) => {
                console.error("browse media failed", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, loaded]);

    if (loading) {
        return <div className="py-10 text-center text-sm text-gray-500">Đang tải ảnh...</div>;
    }

    if (!files.length) {
        return <div className="py-10 text-center text-sm text-gray-500">Không có ảnh nào</div>;
    }

    return (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
            {files.map((f) => (
                <button
                    key={f.key}
                    type="button"
                    onClick={() => onPick(f.key)}
                    className="overflow-hidden rounded-md border bg-white hover:ring-2 hover:ring-blue-500"
                >
                    <img
                        src={f.url}
                        alt={f.key}
                        className="block h-24 w-full object-cover"
                    />
                </button>
            ))}
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
            <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-medium">Chọn ảnh sản phẩm</h3>
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

function HoverPreview({
    open,
    src,
    position,
}: {
    open: boolean;
    src: string;
    position: PreviewPosition | null;
}) {
    if (!open || !position || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="pointer-events-none fixed z-[90] overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-2xl"
            style={{
                top: position.top,
                left: position.left,
                width: 280,
            }}
        >
            <img src={src} alt="Preview" className="h-72 w-full rounded-lg object-cover" />
            <div className="px-1 pt-2 text-[11px] text-gray-500">
                Hover để xem nhanh • Click để mở lớn • Đổi ảnh trong trang edit sản phẩm
            </div>
        </div>,
        document.body
    );
}

function ImageViewerModal({
    open,
    src,
    onClose,
}: {
    open: boolean;
    src: string;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 rounded-md bg-black/55 px-3 py-1.5 text-sm text-white transition hover:bg-black/70"
                >
                    Đóng
                </button>
                <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-2xl">
                    <img
                        src={src}
                        alt="Product preview"
                        className="max-h-[85vh] w-full rounded-xl object-contain bg-gray-50"
                    />
                    <div className="px-1 pt-3 text-sm text-gray-500">
                        Ảnh hiện tại của sản phẩm. Muốn thay ảnh thì vào trang edit sản phẩm.
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function InlineImagePicker({ imageUrl, onPick }: Props) {
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [previewPosition, setPreviewPosition] = useState<PreviewPosition | null>(null);
    const thumbRef = useRef<HTMLButtonElement | null>(null);

    const previewSrc = useMemo(() => {
        if (!imageUrl) return null;
        return `/api/media/sign?key=${encodeURIComponent(imageUrl)}`;
    }, [imageUrl]);

    const updatePreviewPosition = () => {
        const el = thumbRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const panelWidth = 280;
        const gap = 14;
        const prefersRight = rect.right + gap + panelWidth <= window.innerWidth - 16;
        const left = prefersRight
            ? rect.right + gap
            : Math.max(16, rect.left - panelWidth - gap);
        const top = Math.min(
            Math.max(16, rect.top - 16),
            Math.max(16, window.innerHeight - 320)
        );

        setPreviewPosition({ top, left });
    };

    useEffect(() => {
        if (!isHovered || !previewSrc) return;

        const syncPosition = () => updatePreviewPosition();
        syncPosition();

        window.addEventListener("scroll", syncPosition, true);
        window.addEventListener("resize", syncPosition);
        return () => {
            window.removeEventListener("scroll", syncPosition, true);
            window.removeEventListener("resize", syncPosition);
        };
    }, [isHovered, previewSrc]);

    if (previewSrc) {
        return (
            <>
                <button
                    ref={thumbRef}
                    type="button"
                    className="relative flex h-14 w-14 min-h-[56px] min-w-[56px] max-h-[56px] max-w-[56px] shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white"
                    onMouseEnter={() => {
                        updatePreviewPosition();
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setIsViewerOpen(true)}
                    title="Click để xem ảnh lớn. Muốn thay ảnh thì vào trang edit."
                >
                    <img
                        src={previewSrc}
                        alt="Product"
                        className="block h-full w-full object-cover transition-transform duration-200 hover:scale-110"
                    />
                </button>

                <HoverPreview open={isHovered} src={previewSrc} position={previewPosition} />
                <ImageViewerModal
                    open={isViewerOpen}
                    src={previewSrc}
                    onClose={() => setIsViewerOpen(false)}
                />
            </>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative flex h-14 w-14 min-h-[56px] min-w-[56px] max-h-[56px] max-w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 hover:bg-gray-200"
            >
                <span className="text-sm text-gray-400">+</span>
            </button>
            <PickerModal
                open={open}
                onClose={() => setOpen(false)}
                onPick={onPick}
            />
        </>
    );
}
