"use client";

import * as React from "react";
import {
    Check,
    ChevronLeft,
    Folder,
    ImagePlus,
    Loader2,
    RefreshCw,
} from "lucide-react";

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

type FolderItem = {
    prefix: string;
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

function getRootPrefix(profile: SharedMediaProfile) {
    switch (profile) {
        case "edit":
            return "products/edit/active";
        case "sold":
            return "products/sold";
        case "storefront-active":
            return "products/storefront/active";
        case "storefront-chosen":
            return "products/storefront/chosen";
        case "technical-inline":
            return "inline/product/technical/active";
        case "inline":
        default:
            return "inline";
    }
}

function getLabel(profile: SharedMediaProfile) {
    switch (profile) {
        case "technical-inline":
            return "Thư mục: inline/product/technical/active";
        case "edit":
            return "Thư mục: products/edit/active";
        case "sold":
            return "Thư mục: products/sold";
        case "storefront-active":
            return "Thư mục: products/storefront/active";
        case "storefront-chosen":
            return "Thư mục: products/storefront/chosen";
        case "inline":
        default:
            return "Thư mục ảnh inline";
    }
}

function basename(path: string) {
    const clean = String(path || "").replace(/^\/+|\/+$/g, "");
    const parts = clean.split("/");
    return parts[parts.length - 1] || clean;
}

function getParentPrefix(currentPrefix: string, rootPrefix: string) {
    const current = String(currentPrefix || "").replace(/^\/+|\/+$/g, "");
    const root = String(rootPrefix || "").replace(/^\/+|\/+$/g, "");

    if (!current || current === root) return root;

    const parts = current.split("/");
    parts.pop();

    const next = parts.join("/");
    if (!next) return root;
    if (!next.startsWith(root)) return root;

    return next;
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
    submitLabel = "Xác nhận ảnh đã chọn",
}: Props) {
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<SharedMediaItem[]>([]);
    const [folders, setFolders] = React.useState<FolderItem[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<
        string[]
    >([]);
    const [prefix, setPrefix] = React.useState<string>(getRootPrefix(profile));

    const rootPrefix = React.useMemo(() => getRootPrefix(profile), [profile]);
    const profileLabel = getLabel(profile);

    React.useEffect(() => {
        if (!open) return;
        setInternalSelectedKeys(Array.isArray(selectedKeys) ? selectedKeys : []);
    }, [open, selectedKeys]);

    React.useEffect(() => {
        setPrefix(getRootPrefix(profile));
        setItems([]);
        setFolders([]);
        setError(null);
    }, [profile]);

    React.useEffect(() => {
        if (!open) return;
        setPrefix(getRootPrefix(profile));
    }, [open, profile]);

    const helpText =
        description ??
        (selectionMode === "multiple"
            ? "Chọn nhiều ảnh từ thư viện."
            : "Chọn 1 ảnh từ thư viện.");

    const loadItems = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const qs = new URLSearchParams({
                profile,
                prefix,
            });

            const res = await fetch(`/api/media/browse?${qs.toString()}`, {
                cache: "no-store",
            });
            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không tải được thư viện ảnh");
            }

            setFolders(
                Array.isArray(json?.folders)
                    ? json.folders.map((item: any) => ({
                        prefix: String(item?.prefix ?? ""),
                    }))
                    : []
            );

            setItems(
                Array.isArray(json?.files)
                    ? json.files.map((item: any) => ({
                        key: String(item?.key ?? ""),
                        signedUrl: item?.url ?? null,
                    }))
                    : []
            );
        } catch (e: any) {
            setError(e?.message || "Không tải được thư viện ảnh");
        } finally {
            setLoading(false);
        }
    }, [profile, prefix]);

    React.useEffect(() => {
        if (!open) return;
        loadItems();
    }, [open, loadItems]);

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

    function handleOpenFolder(nextPrefix: string) {
        setPrefix(nextPrefix);
    }

    function handleGoUp() {
        setPrefix((prev) => getParentPrefix(prev, rootPrefix));
    }

    if (!open) return null;

    const canGoUp = prefix !== rootPrefix;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <div className="text-base font-semibold text-slate-900">
                            {title}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                            {profileLabel}
                        </div>
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
                    <div>{helpText}</div>
                    <div className="mt-1 text-xs text-slate-400">
                        Đang duyệt: {prefix}
                    </div>
                    {selectionMode === "multiple" ? (
                        <span className="mt-1 inline-block font-medium text-slate-700">
                            Đã chọn {internalSelectedKeys.length} ảnh.
                        </span>
                    ) : null}
                </div>

                <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleGoUp}
                            disabled={!canGoUp}
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Lên thư mục cha
                        </button>

                        <button
                            type="button"
                            onClick={() => setPrefix(rootPrefix)}
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Về root
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
                    ) : (
                        <div className="space-y-6">
                            {folders.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-slate-700">
                                        Thư mục con
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {folders.map((folder) => (
                                            <button
                                                key={folder.prefix}
                                                type="button"
                                                onClick={() =>
                                                    handleOpenFolder(folder.prefix)
                                                }
                                                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left hover:border-slate-300 hover:bg-slate-50"
                                            >
                                                <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                                                    <Folder className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium text-slate-800">
                                                        {basename(folder.prefix)}
                                                    </div>
                                                    <div className="truncate text-xs text-slate-400">
                                                        {folder.prefix}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {items.length === 0 ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                    {folders.length > 0
                                        ? "Thư mục hiện tại chưa có file ảnh trực tiếp. Hãy mở một thư mục con để xem ảnh."
                                        : "Chưa có ảnh trong thư mục này."}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-slate-700">
                                        Ảnh
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                        {items.map((item) => {
                                            const selected =
                                                selectionMode === "multiple"
                                                    ? internalSelectedKeys.includes(
                                                        item.key
                                                    )
                                                    : selectedKey === item.key;

                                            const selectedIndex =
                                                selectionMode === "multiple"
                                                    ? internalSelectedKeys.indexOf(
                                                        item.key
                                                    )
                                                    : -1;

                                            return (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    onClick={() =>
                                                        handleItemClick(item.key)
                                                    }
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
                                                            {selectionMode ===
                                                                "multiple" &&
                                                                selectedIndex >= 0 ? (
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
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {selectionMode === "multiple" ? (
                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                        <div className="text-sm text-slate-500">
                            Có thể chọn nhiều ảnh. Ảnh sẽ được chuyển sang thư
                            mục chosen sau khi xác nhận.
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