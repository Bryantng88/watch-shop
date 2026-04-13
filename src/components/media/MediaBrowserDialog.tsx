"use client";

import * as React from "react";
import { ImagePlus, Loader2 } from "lucide-react";

export type SharedMediaProfile =
    | "inline"
    | "edit"
    | "sold"
    | "technical-inline"
    | "storefront-active"
    | "storefront-chosen";

export type SharedMediaItem = {
    key: string;
    signedUrl?: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (fileKey: string) => void;
    profile?: SharedMediaProfile;
    selectedKey?: string | null;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function MediaBrowserDialog({
    open,
    onClose,
    onSelect,
    profile = "inline",
    selectedKey,
}: Props) {
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<SharedMediaItem[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    const hasLoadedRef = React.useRef(false);

    const profileLabel =
        profile === "technical-inline"
            ? "Thư mục: inline/product/technical/active"
            : profile === "edit"
                ? "Thư mục ảnh edit"
                : profile === "sold"
                    ? "Thư mục ảnh sold"
                    : profile === "storefront-active"
                        ? "Thư mục: product/storefront/active"
                        : profile === "storefront-chosen"
                            ? "Thư mục: product/storefront/chosen"
                            : "Thư mục ảnh inline";

    const loadItems = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`/api/media/browse?profile=${profile}`, {
                cache: "no-store",
            });
            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không tải được thư viện ảnh");
            }

            setItems(
                Array.isArray(json?.files)
                    ? json.files.map((item: any) => ({
                        key: item.key,
                        signedUrl: item.url ?? null,
                    }))
                    : []
            );

            hasLoadedRef.current = true;
        } catch (e: any) {
            setError(e?.message || "Không tải được thư viện ảnh");
        } finally {
            setLoading(false);
        }
    }, [profile]);

    React.useEffect(() => {
        if (!open) return;
        if (hasLoadedRef.current) return;
        loadItems();
    }, [open, loadItems]);

    React.useEffect(() => {
        hasLoadedRef.current = false;
        setItems([]);
        setError(null);
    }, [profile]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <div className="text-base font-semibold text-slate-900">
                            Chọn ảnh từ thư viện
                        </div>
                        <div className="mt-1 text-sm text-slate-500">{profileLabel}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={loadItems}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Tải lại
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>

                <div className="min-h-[320px] flex-1 overflow-auto p-5">
                    {loading ? (
                        <div className="flex h-[240px] items-center justify-center text-slate-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tải ảnh...
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                            Chưa có ảnh trong thư mục này.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {items.map((item) => {
                                const selected = selectedKey === item.key;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => {
                                            onSelect(item.key);
                                            onClose();
                                        }}
                                        className={cx(
                                            "overflow-hidden rounded-2xl border text-left transition",
                                            selected
                                                ? "border-slate-900 ring-1 ring-slate-900"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <div className="aspect-square bg-slate-100">
                                            {item.signedUrl ? (
                                                <img
                                                    src={item.signedUrl}
                                                    alt={item.key}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                    <ImagePlus className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-slate-100 px-3 py-2">
                                            <div className="truncate text-xs text-slate-500">
                                                {item.key}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}