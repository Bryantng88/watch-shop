"use client";

import { useEffect, useState } from "react";
import { Download, ImageIcon, Loader2, X } from "lucide-react";
import type { WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { OperationShell, operationButtonClass, Pill } from "../shared/OperationShell";

type UsageDetail = {
    review?: {
        isContentDownloaded?: boolean | null;
        isImageDownloaded?: boolean | null;
        isPosted?: boolean | null;
    } | null;
    watch?: {
        isContentDownloaded?: boolean | null;
        isImageDownloaded?: boolean | null;
        isPosted?: boolean | null;
    } | null;
};

function filenameFromDisposition(value: string | null) {
    if (!value) return "watch-gallery.zip";

    const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);

    const normalMatch = value.match(/filename="?([^"]+)"?/i);
    return normalMatch?.[1] || "watch-gallery.zip";
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

export default function ImageBlock({
    values,
    detail,
    onSave,
    saving = false,
    onOpenMediaWorkspace,
    openingMediaWorkspace = false,
}: {
    values: WatchWorkbenchValues;
    detail?: UsageDetail;
    onSave: () => void;
    saving?: boolean;
    onOpenMediaWorkspace: () => void;
    openingMediaWorkspace?: boolean;
}) {
    const progress = useAppProgress();
    const notify = useNotify();
    const [downloading, setDownloading] = useState(false);
    const [usage, setUsage] = useState({
        isContentDownloaded: Boolean(
            detail?.review?.isContentDownloaded ?? detail?.watch?.isContentDownloaded,
        ),
        isImageDownloaded: Boolean(
            detail?.review?.isImageDownloaded ?? detail?.watch?.isImageDownloaded,
        ),
        isPosted: Boolean(detail?.review?.isPosted ?? detail?.watch?.isPosted),
    });
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const gallery = values.media.galleryImages ?? [];
    const previewImage = previewIndex == null ? null : gallery[previewIndex] ?? null;
    const imageStatus = String(values.imageReviewStatus ?? "DRAFT").toUpperCase();
    const canDownload = imageStatus === "APPROVED";
    const rows = [
        ["Inline", values.media.inlineImage?.key ?? "-"],
        ["Thumbnail", values.media.inlineImage?.key ?? "-"],
        ["Service board", "-"],
        ["Gallery", gallery.length ? `${gallery.length} images` : "-"],
    ];

    useEffect(() => {
        if (previewIndex == null) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setPreviewIndex(null);
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [previewIndex]);

    async function handleDownloadGallery() {
        if (!values.productId || downloading || !canDownload) return;

        setDownloading(true);
        progress.show({
            title: "Dang tai gallery",
            message: "He thong dang dong goi anh gallery thanh file zip.",
        });

        try {
            const res = await fetch(`/api/admin/watches/${values.productId}/download-gallery`, {
                method: "GET",
                cache: "no-store",
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.error || "Khong the tai gallery.");
            }

            const blob = await res.blob();
            downloadBlob(blob, filenameFromDisposition(res.headers.get("content-disposition")));

            const nextUsage = {
                isImageDownloaded: res.headers.get("x-watch-is-image-downloaded") === "true",
                isContentDownloaded: res.headers.get("x-watch-is-content-downloaded") === "true",
                isPosted: res.headers.get("x-watch-is-posted") === "true",
            };
            setUsage(nextUsage);

            notify.success({
                title: "Da tai gallery",
                message: nextUsage.isPosted
                    ? "Gallery va content da duoc ghi nhan cho luong Dang bai."
                    : "Gallery da duoc tai va emit event publish assets downloaded.",
            });
        } catch (error) {
            notify.error({
                title: "Khong the tai gallery",
                message: error instanceof Error ? error.message : "Co loi khi tai gallery.",
            });
        } finally {
            progress.hide();
            setDownloading(false);
        }
    }

    return (
        <OperationShell
            id="images"
            number="4"
            title="Hinh anh"
            icon={<ImageIcon className="h-4 w-4" />}
            description="Gallery, thumbnail va trang thai download phuc vu Workspace Dang bai."
            actions={
                <>
                    <Pill tone={canDownload ? "green" : "slate"}>{imageStatus}</Pill>
                    <button
                        type="button"
                        onClick={handleDownloadGallery}
                        disabled={!canDownload || downloading || !gallery.length}
                        className={operationButtonClass({
                            variant: canDownload ? "softViolet" : "secondary",
                            size: "sm",
                            className: "disabled:opacity-60",
                        })}
                    >
                        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {downloading ? "Dang tai..." : usage.isImageDownloaded ? "Tai lai gallery" : "Tai gallery"}
                    </button>
                    <button type="button" onClick={onSave} disabled={saving} className={operationButtonClass({ variant: "primary", size: "sm", className: "disabled:opacity-70" })}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {saving ? "Dang luu..." : "Luu thay doi"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                    <div className="overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/40 shadow-sm">
                        <div className="flex items-center justify-between gap-3 border-b border-violet-100/80 px-4 py-3">
                            <div>
                                <div className="text-sm font-semibold text-slate-950">Gallery hien tai</div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {usage.isContentDownloaded ? "Content da copy" : "Content chua copy"} - {usage.isImageDownloaded ? "Anh da tai" : "Anh chua tai"}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onOpenMediaWorkspace}
                                disabled={openingMediaWorkspace}
                                className={operationButtonClass({ variant: "softEmerald", size: "xs", className: "disabled:opacity-60" })}
                            >
                                {openingMediaWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {openingMediaWorkspace ? "Dang mo..." : "Mo Media WP"}
                            </button>
                        </div>
                        {gallery.length ? (
                            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
                                {gallery.map((image, index) => (
                                    <div key={`${image.key}:${index}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (image.url) setPreviewIndex(index);
                                            }}
                                            disabled={!image.url}
                                            title={image.url ? "Phong to hinh anh" : undefined}
                                            className="block aspect-square w-full overflow-hidden bg-slate-100 text-left disabled:cursor-default"
                                        >
                                            {image.url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={image.url} alt={image.name ?? `Gallery ${index + 1}`} className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]" />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center">
                                                    <ImageIcon className="h-5 w-5 text-slate-400" />
                                                </div>
                                            )}
                                        </button>
                                        <div className="truncate px-2.5 py-2 text-[11px] font-medium text-slate-500">
                                            {image.name ?? image.key}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-slate-500">Chua co anh gallery de xem.</div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200/80">
                        <div className="grid grid-cols-[150px_minmax(0,1fr)_100px] gap-3 bg-slate-50/80 px-3 py-2.5 text-[11px] font-semibold uppercase text-slate-400">
                            <div>Loai</div>
                            <div>Duong dan media</div>
                            <div>Action</div>
                        </div>
                        {rows.map(([label, key]) => (
                            <div key={label} className="grid min-h-[44px] grid-cols-[150px_minmax(0,1fr)_100px] items-center gap-3 border-t border-slate-100 px-3 py-2 text-sm">
                                <div className="font-medium text-slate-700">{label}</div>
                                <div className="truncate text-xs text-slate-500">{key}</div>
                                <button
                                    type="button"
                                    onClick={onOpenMediaWorkspace}
                                    disabled={openingMediaWorkspace}
                                    className={operationButtonClass({ variant: "subtle", size: "xs", className: "disabled:opacity-60" })}
                                >
                                    {openingMediaWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    {openingMediaWorkspace ? "Dang mo" : "Mo WP"}
                                </button>
                            </div>
                        ))}
                    </div>
                    {previewImage?.url ? (
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                            <button
                                type="button"
                                aria-label="Dong preview hinh anh"
                                className="absolute inset-0 bg-slate-950/75"
                                onClick={() => setPreviewIndex(null)}
                            />
                            <div className="relative z-[1] flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                                <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                                    <div className="min-w-0 truncate text-sm font-semibold text-slate-900">
                                        {previewImage.name ?? previewImage.key ?? "Gallery image"}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewIndex(null)}
                                        className={operationButtonClass({ variant: "ghost", size: "xs", className: "w-8 px-0" })}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-950 p-3">
                                    {
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={previewImage.url}
                                            alt={previewImage.name ?? previewImage.key ?? "Gallery image"}
                                            className="max-h-[78vh] w-auto max-w-full object-contain"
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    ) : null}
            </div>
        </OperationShell>
    );
}
