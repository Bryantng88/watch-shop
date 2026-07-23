"use client";

import { useEffect, useState } from "react";
import { Folder, Image as ImageIcon, RefreshCw, X } from "lucide-react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import type { AcquisitionPreparedImage } from "../../client/form/acquisition-form.types";
import { mediaSourceRoot } from "@/domains/media/core/media-source-path";

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
    onImport: (images: AcquisitionPreparedImage[]) => void;
    disabled?: boolean;
    audienceSegment?: "MEN" | "WOMEN";
};

function nameFromKey(key: string) {
    return key.split("/").filter(Boolean).pop() || key;
}

function parentPrefix(prefix: string, root: string) {
    if (!prefix || prefix === root) return root;
    const parts = prefix.split("/").filter(Boolean);
    parts.pop();
    return parts.join("/") || root;
}

export default function AcquisitionBulkImagePicker({
    onImport,
    disabled,
    audienceSegment = "MEN",
}: Props) {
    const notify = useNotify();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BrowseResponse | null>(null);
    const [prefix, setPrefix] = useState(() => mediaSourceRoot(audienceSegment, "inline"));
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    async function load(nextPrefix?: string) {
        const target = nextPrefix ?? prefix;
        setLoading(true);

        try {
            const res = await fetch(
                `/api/media/browse?profile=inline&segment=${audienceSegment}&prefix=${encodeURIComponent(target)}`,
                { cache: "no-store" },
            );

            const json = await res.json().catch(() => null);
            if (!res.ok) throw new Error(json?.error || "Không thể duyệt thư mục ảnh.");

            setData(json);
            setPrefix(json.prefix || target);
        } catch (error) {
            notify.error({
                title: "Không thể duyệt thư mục ảnh",
                message:
                    error instanceof Error ? error.message : "Không thể duyệt thư mục ảnh.",
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open || data) return;
        void load(prefix);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        setData(null);
        setSelectedKeys([]);
        setPrefix(mediaSourceRoot(audienceSegment, "inline"));
    }, [audienceSegment]);

    function toggleKey(key: string) {
        setSelectedKeys((prev) =>
            prev.includes(key)
                ? prev.filter((item) => item !== key)
                : [...prev, key],
        );
    }

    function submit() {
        if (!selectedKeys.length) {
            notify.warning({
                title: "Chưa chọn ảnh",
                message: "Bạn cần chọn ít nhất một ảnh để đưa vào phiếu nhập.",
            });
            return;
        }

        const items: AcquisitionPreparedImage[] = selectedKeys.map((key) => ({
            key,
            fromKey: key,
            url: `/api/media/sign?key=${encodeURIComponent(key)}`,
        }));

        onImport(items);

        notify.success({
            title: "Đã chọn ảnh",
            message: `Đã đưa ${items.length} ảnh vào các dòng watch.`,
        });

        setSelectedKeys([]);
        setOpen(false);
        setData(null);
        setPrefix(mediaSourceRoot(audienceSegment, "inline"));
    }

    const currentPrefix = data?.prefix || prefix;
    const root = data?.root || mediaSourceRoot(audienceSegment, "inline");
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
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/40 p-6">
                    <div className="flex h-full max-h-[calc(100dvh-48px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                        <div className="shrink-0 border-b border-slate-200 px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">
                                        Chọn nhiều ảnh cho phiếu nhập
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        Ảnh được chọn sẽ đổ vào các dòng watch đang trống, từ trên xuống dưới.
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                    aria-label="Đóng trình chọn ảnh"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)] overflow-hidden">
                            <aside className="min-h-0 overflow-y-auto border-r border-slate-200 p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-slate-900">
                                            Thư mục
                                        </div>
                                        <div className="truncate text-xs text-slate-500">
                                            {currentPrefix}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void load(currentPrefix)}
                                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                        aria-label="Tải lại thư mục"
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
                                        <Folder className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{root}</span>
                                    </button>

                                    {currentPrefix !== root ? (
                                        <button
                                            type="button"
                                            onClick={() => void load(parentPrefix(currentPrefix, root))}
                                            className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Folder className="h-4 w-4 shrink-0" />
                                            <span>..</span>
                                        </button>
                                    ) : null}

                                    {folders.map((folder) => (
                                        <button
                                            key={folder.prefix}
                                            type="button"
                                            onClick={() => void load(folder.prefix)}
                                            className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Folder className="h-4 w-4 shrink-0 text-amber-500" />
                                            <span className="truncate">
                                                {nameFromKey(folder.prefix)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </aside>

                            <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">
                                <div className="shrink-0 border-b border-slate-100 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm text-slate-500">
                                            Đã chọn {selectedKeys.length} ảnh
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedKeys([])}
                                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                Bỏ chọn
                                            </button>

                                            <button
                                                type="button"
                                                disabled={!selectedKeys.length}
                                                onClick={submit}
                                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Xác nhận ảnh đã chọn
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                                    {loading ? (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                                            Đang tải ảnh...
                                        </div>
                                    ) : files.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                                            Không có ảnh trong thư mục này.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 pb-8 md:grid-cols-4 xl:grid-cols-5">
                                            {files.map((file) => {
                                                const active = selectedKeys.includes(file.key);

                                                return (
                                                    <button
                                                        key={file.key}
                                                        type="button"
                                                        onClick={() => toggleKey(file.key)}
                                                        className={[
                                                            "relative overflow-hidden rounded-2xl border text-left transition",
                                                            active
                                                                ? "border-blue-500 ring-2 ring-blue-100"
                                                                : "border-slate-200 hover:border-slate-300",
                                                        ].join(" ")}
                                                    >
                                                        <div className="aspect-square w-full overflow-hidden bg-slate-100">
                                                            <img
                                                                src={file.url}
                                                                alt={nameFromKey(file.key)}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="border-t border-slate-100 px-2 py-2">
                                                            <div className="truncate text-xs text-slate-600">
                                                                {nameFromKey(file.key)}
                                                            </div>
                                                        </div>

                                                        {active ? (
                                                            <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[11px] font-bold text-white shadow">
                                                                Đã chọn
                                                            </div>
                                                        ) : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
