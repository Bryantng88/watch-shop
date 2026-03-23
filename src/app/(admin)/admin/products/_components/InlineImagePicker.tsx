"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    imageUrl: string | null; // fileKey
    onPick: (fileKey: string) => void;
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

export default function InlineImagePicker({ imageUrl, onPick }: Props) {
    const [open, setOpen] = useState(false);

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
                    <img
                        src={previewSrc}
                        alt="Product"
                        className="block h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-sm text-gray-400">+</span>
                )}
            </button>
            <PickerModal
                open={open}
                onClose={() => setOpen(false)}
                onPick={onPick}
            />
        </>
    );
}