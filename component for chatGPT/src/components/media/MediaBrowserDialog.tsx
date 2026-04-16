"use client";

import * as React from "react";
import { Check, ImagePlus, Loader2 } from "lucide-react";

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
    onSelect?: (fileKey: string) => void;
    onSubmit?: (fileKeys: string[]) => void;
    profile?: SharedMediaProfile;
    selectedKey?: string | null;
    selectedKeys?: string[];
    selectionMode?: "single" | "multiple";
    maxSelection?: number;
    title?: string;
    description?: string;
    submitLabel?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function MediaBrowserDialog({
    open,
    onClose,
    onSelect,
    onSubmit,
    profile = "inline",
    selectedKey,
    selectedKeys = [],
    selectionMode = "single",
    maxSelection = 9999,
    title = "Chọn ảnh từ thư viện",
    description,
    submitLabel = "Dùng các ảnh đã chọn",
}: Props) {
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<SharedMediaItem[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<string[]>([]);

    const hasLoadedRef = React.useRef(false);

    React.useEffect(() => {
        if (!open) return;
        setInternalSelectedKeys(Array.isArray(selectedKeys) ? selectedKeys : []);
    }, [open, selectedKeys]);

    const profileLabel =
        profile === "technical-inline"
            ? "Thư mục: inline/product/technical/active"
            : profile === "edit"
                ? "Thư mục: products/edit/active"
                : profile === "sold"
                    ? "Thư mục: product/sold"
                    : profile === "storefront-active"
                        ? "Thư mục: product/storefront/active"
                        : profile === "storefront-chosen"
                            ? "Thư mục: product/storefront/chosen"
                            : "Thư mục ảnh inline";

    const helpText =
        description ??
        (selectionMode === "multiple"
            ? "Chọn nhiều ảnh từ thư viện."
            : "Chọn 1 ảnh từ thư viện.");

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

    function toggleKey(fileKey: string) {
        setInternalSelectedKeys((prev) => {
            const exists = prev.includes(fileKey);
            if (exists) return prev.filter((key) => key !== fileKey);
            if (prev.length >= maxSelection) return prev;
            return [...prev, fileKey];
        });
    }

    function handleItemClick(fileKey: string) {
        if (selectionMode === "single") {
            onSelect?.(fileKey);
            onClose();
            return;
        }

        toggleKey(fileKey);
    }

    function handleSubmit() {
        if (selectionMode !== "multiple") return;
        onSubmit?.(internalSelectedKeys);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <div className="text-base font-semibold text-slate-900">{title}</div>
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

                <div className="border-b border-slate-100 px-5 py-3 text-sm text-slate-500">
                    {helpText}
                    {selectionMode === "multiple" ? (
                        <span className="ml-2 font-medium text-slate-700">
                            Đã chọn {internalSelectedKeys.length} ảnh.
                        </span>
                    ) : null}
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
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {items.map((item) => {
                                const selected =
                                    selectionMode === "multiple"
                                        ? internalSelectedKeys.includes(item.key)
                                        : selectedKey === item.key;

                                const selectedIndex =
                                    selectionMode === "multiple"
                                        ? internalSelectedKeys.indexOf(item.key)
                                        : -1;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => handleItemClick(item.key)}
                                        className={cx(
                                            "relative overflow-hidden rounded-2xl border text-left transition",
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

                                        {selected ? (
                                            <div className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-semibold text-white shadow">
                                                {selectionMode === "multiple" && selectedIndex >= 0 ? (
                                                    selectedIndex + 1
                                                ) : (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </div>
                                        ) : null}

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

                {selectionMode === "multiple" ? (
                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                        <div className="text-sm text-slate-500">
                            Có thể chọn không giới hạn. Ảnh sẽ được chuyển sang thư mục chosen sau khi xác nhận.
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={internalSelectedKeys.length === 0}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitLabel}
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}