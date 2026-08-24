"use client";

import * as React from "react";
import { mediaSourceRoot } from "@/domains/media/core/media-source-path";
import {
    Check,
    ChevronLeft,
    Folder,
    ImagePlus,
    Loader2,
    RefreshCw,
    RotateCcw,
    Trash2,
} from "lucide-react";

export type SharedMediaProfile =
    | "inline"
    | "edit"
    | "cover"
    | "sold"
    | "technical-inline"
    | "storefront-active"
    | "storefront-chosen"
    | "media-post";

export type SharedMediaItem = {
    key: string;
    signedUrl?: string | null;
};

type FolderItem = {
    prefix: string;
};
type BrowseFolderPayload = {
    prefix?: unknown;
};
type ContextImage = {
    src?: string | null;
    title?: string | null;
    subtitle?: string | null;
};
type BrowseFilePayload = {
    key?: unknown;
    url?: unknown;
};
type Props = {
    open: boolean;
    onClose: () => void;
    onSelect?: (fileKey: string) => void;
    onSubmit?: (fileKeys: string[]) => void;
    profile?: SharedMediaProfile;
    audienceSegment?: "MEN" | "WOMEN" | "UNISEX";
    selectedKey?: string | null;
    selectedKeys?: string[];
    disabledKeys?: string[];
    selectionMode?: "single" | "multiple";
    maxSelection?: number;
    title?: string;
    description?: string;
    submitLabel?: string;
    contextImage?: ContextImage | null;
    enableRecycle?: boolean;
    footerLeadingAction?: React.ReactNode;
    footerHint?: string;
    initialLocation?: "library" | "recycle";
    presentation?: "dialog" | "page" | "inline";
};

const EMPTY_KEYS: string[] = [];

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function getRootPrefix(
    profile: SharedMediaProfile,
    audienceSegment?: "MEN" | "WOMEN" | "UNISEX",
) {
    if (audienceSegment && (profile === "inline" || profile === "edit" || profile === "cover")) {
        return mediaSourceRoot(audienceSegment, profile);
    }
    switch (profile) {
        case "edit":
            return "products/edit/active";
        case "cover":
            return "products/cover/active";
        case "sold":
            return "products/sold";
        case "storefront-active":
            return "products/storefront/active";
        case "storefront-chosen":
            return "products/storefront/chosen";
        case "technical-inline":
            return "inline/product/technical/active";
        case "media-post":
            return "media/posts";
        case "inline":
        default:
            return "products/inline/active";
    }
}

function getLabel(profile: SharedMediaProfile) {
    switch (profile) {
        case "technical-inline":
            return "Thư mục: inline/product/technical/active";
        case "media-post":
            return "Thư mục: media/posts";
        case "edit":
            return "Thư mục: products/edit/active";
        case "cover":
            return "Thư mục ảnh Cover";
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
    contextImage,
    enableRecycle = false,
    footerLeadingAction,
    footerHint,
    profile = "inline",
    audienceSegment,
    selectedKey,
    selectedKeys = EMPTY_KEYS,
    disabledKeys = EMPTY_KEYS,
    selectionMode = "single",
    maxSelection = 9999,
    title = "Chọn ảnh từ thư viện",
    description,
    submitLabel = "Xác nhận ảnh đã chọn",
    initialLocation = "library",
    presentation = "dialog",
}: Props) {
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<SharedMediaItem[]>([]);
    const [folders, setFolders] = React.useState<FolderItem[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<
        string[]
    >([]);
    const [prefix, setPrefix] = React.useState<string>(
        getRootPrefix(profile, audienceSegment),
    );
    const [nextCursor, setNextCursor] = React.useState<string | null>(null);
    const [hasMore, setHasMore] = React.useState(false);
    const [recyclePending, setRecyclePending] = React.useState(false);
    const rootPrefix = React.useMemo(
        () => getRootPrefix(profile, audienceSegment),
        [audienceSegment, profile],
    );
    const profileLabel = getLabel(profile);
    const recyclePrefix = `${rootPrefix}/recycle`;
    const browsingRecycle =
        prefix === recyclePrefix || prefix.startsWith(`${recyclePrefix}/`);
    const disabledKeySet = React.useMemo(
        () => new Set(disabledKeys.map((key) => String(key).trim()).filter(Boolean)),
        [disabledKeys],
    );

    const resetPagination = React.useCallback(() => {
        setNextCursor(null);
        setHasMore(false);
    }, []);

    React.useEffect(() => {
        if (!open) return;
        setInternalSelectedKeys(Array.isArray(selectedKeys) ? selectedKeys : []);
    }, [open, selectedKeys]);

    React.useEffect(() => {
        const root = getRootPrefix(profile, audienceSegment);
        setPrefix(initialLocation === "recycle" ? `${root}/recycle` : root);
        setItems([]);
        setFolders([]);
        setError(null);
        resetPagination();
    }, [audienceSegment, initialLocation, profile, resetPagination]);

    React.useEffect(() => {
        if (!open) return;

        let cancelled = false;

        async function resolveInitialPrefix() {
            const fallbackRoot = getRootPrefix(profile, audienceSegment);

            if (initialLocation === "recycle") {
                setPrefix(`${fallbackRoot}/recycle`);
                resetPagination();
                return;
            }

            if (profile !== "edit" || audienceSegment) {
                setPrefix(fallbackRoot);
                resetPagination();
                return;
            }

            try {
                const res = await fetch(`/api/media/batches/latest?_t=${Date.now()}`, {
                    cache: "no-store",
                });
                const json = await res.json().catch(() => ({}));

                if (!cancelled) {
                    setPrefix(String(json?.prefix || fallbackRoot));
                    resetPagination();
                }
            } catch {
                if (!cancelled) {
                    setPrefix(fallbackRoot);
                    resetPagination();
                }
            }
        }

        resolveInitialPrefix();

        return () => {
            cancelled = true;
        };
    }, [audienceSegment, initialLocation, open, profile, resetPagination]);

    const helpText =
        description ??
        (selectionMode === "multiple"
            ? "Chọn nhiều ảnh từ thư viện."
            : "Chọn 1 ảnh từ thư viện.");

    const loadItems = React.useCallback(
        async (mode: "reset" | "more" = "reset", cursor?: string | null) => {
            try {
                setLoading(true);
                setError(null);

                const qs = new URLSearchParams({
                    profile,
                    prefix,
                    maxKeys: "1000",
                    _t: String(Date.now()),
                });
                if (audienceSegment) qs.set("segment", audienceSegment);

                if (mode === "more" && cursor) {
                    qs.set("cursor", cursor);
                }

                const res = await fetch(`/api/media/browse?${qs.toString()}`, {
                    cache: "no-store",
                });

                const json = await res.json().catch(() => ({}));

                if (!res.ok) {
                    throw new Error(
                        json?.error || "Không tải được thư viện ảnh"
                    );
                }

                const nextFolders: FolderItem[] = Array.isArray(json?.folders)
                    ? json.folders.map((item: BrowseFolderPayload) => ({
                        prefix: String(item?.prefix ?? ""),
                    }))
                    : [];

                const nextFiles: SharedMediaItem[] = Array.isArray(json?.files)
                    ? json.files.map((item: BrowseFilePayload) => ({
                        key: String(item?.key ?? ""),
                        signedUrl: typeof item?.url === "string" ? item.url : null,
                    }))
                    : [];
                if (mode === "more") {
                    setFolders((prev) => {
                        const map = new Map(
                            prev.map((item) => [item.prefix, item])
                        );
                        nextFolders.forEach((item: FolderItem) =>
                            map.set(item.prefix, item)
                        );
                        return Array.from(map.values());
                    });

                    setItems((prev) => {
                        const map = new Map(
                            prev.map((item) => [item.key, item])
                        );
                        nextFiles.forEach((item: SharedMediaItem) =>
                            map.set(item.key, item)
                        ); return Array.from(map.values());
                    });
                } else {
                    setFolders(nextFolders);
                    setItems(nextFiles);
                }

                setNextCursor(json?.nextCursor ?? null);
                setHasMore(Boolean(json?.hasMore));
            } catch (e: unknown) {
                setError(
                    e instanceof Error ? e.message : "Không tải được thư viện ảnh"
                );
            } finally {
                setLoading(false);
            }
        },
        [audienceSegment, profile, prefix]
    );

    React.useEffect(() => {
        if (!open) return;
        loadItems("reset");
    }, [open, prefix, profile, loadItems]);

    function toggleKey(fileKey: string) {
        if (disabledKeySet.has(fileKey)) return;

        setInternalSelectedKeys((prev) => {
            const exists = prev.includes(fileKey);
            if (exists) return prev.filter((key) => key !== fileKey);
            if (prev.length >= maxSelection) return prev;
            return [...prev, fileKey];
        });
    }

    function handleItemClick(fileKey: string) {
        if (disabledKeySet.has(fileKey)) return;

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
        resetPagination();
        setItems([]);
        setFolders([]);
        setPrefix(nextPrefix);
    }

    function handleGoUp() {
        resetPagination();
        setItems([]);
        setFolders([]);
        setPrefix((prev) => getParentPrefix(prev, rootPrefix));
    }

    function handleGoRoot() {
        resetPagination();
        setItems([]);
        setFolders([]);
        setPrefix(rootPrefix);
    }

    async function handleRecycleAction(action: "RECYCLE" | "RESTORE") {
        if (!enableRecycle || internalSelectedKeys.length === 0 || recyclePending) return;
        const restoring = action === "RESTORE";
        if (!window.confirm(
            restoring
                ? `Khôi phục ${internalSelectedKeys.length} ảnh về thư viện?`
                : `Đưa ${internalSelectedKeys.length} ảnh vào Recycle? Các ảnh sẽ không còn xuất hiện trong thư viện hiện tại.`,
        )) return;

        setRecyclePending(true);
        setError(null);
        try {
            const response = await fetch("/api/media/recycle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    profile,
                    segment: audienceSegment ?? null,
                    keys: internalSelectedKeys,
                    commandId: crypto.randomUUID(),
                }),
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(result?.error ?? "Không thể xử lý Recycle.");
            }
            const succeededKeys = new Set<string>(
                (Array.isArray(result?.results) ? result.results : [])
                    .filter((item: { ok?: unknown }) => item?.ok === true)
                    .map((item: { key?: unknown }) => String(item.key ?? "")),
            );
            setItems((current) =>
                current.filter((item) => !succeededKeys.has(item.key))
            );
            setInternalSelectedKeys((current) =>
                current.filter((key) => !succeededKeys.has(key))
            );
            const failures = (Array.isArray(result?.results) ? result.results : [])
                .filter((item: { ok?: unknown }) => item?.ok !== true);
            if (failures.length) {
                setError(
                    failures.map((item: { key?: unknown; error?: unknown }) =>
                        `${basename(String(item.key ?? ""))}: ${String(item.error ?? "Không thể xử lý")}`
                    ).join(" · "),
                );
            }
        } catch (actionError) {
            setError(
                actionError instanceof Error
                    ? actionError.message
                    : "Không thể xử lý Recycle.",
            );
        } finally {
            setRecyclePending(false);
        }
    }

    if (!open) return null;

    const canGoUp = prefix !== rootPrefix;
    const initialLoading = loading && items.length === 0 && folders.length === 0;

    return (
        <div className={presentation === "page" || presentation === "inline" ? "min-h-0 w-full" : "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"}>
            <div className={presentation === "page" ? "flex min-h-[calc(100vh-8rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" : presentation === "inline" ? "flex max-h-[72vh] w-full flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm" : "flex max-h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"}>
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <div className="text-base font-semibold text-slate-900">
                            {title}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                            {profileLabel}
                        </div>
                        {contextImage?.title ? (
                            <div className="mt-0.5 truncate text-sm font-medium text-slate-700">
                                {contextImage.title}
                            </div>
                        ) : null}

                        <div className="mt-1 text-sm text-slate-500">
                            {contextImage?.subtitle ?? profileLabel}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setItems([]);
                                setFolders([]);
                                resetPagination();
                                loadItems("reset");
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Tải lại
                        </button>

                        {presentation !== "page" ? <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            Đóng
                        </button> : null}
                    </div>
                </div>

                <div className="border-b border-slate-100 px-5 py-3 text-sm text-slate-500">
                    <div>{helpText}</div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>Đang duyệt: {prefix}</span>
                        <span>•</span>
                        <span>
                            Đã tải:{" "}
                            <strong className="font-semibold text-slate-600">
                                {items.length}
                            </strong>
                            {hasMore ? " · còn ảnh khác" : ""}
                        </span>
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
                            onClick={handleGoRoot}
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Về root
                        </button>
                        {enableRecycle ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInternalSelectedKeys([]);
                                        handleOpenFolder(
                                            browsingRecycle ? rootPrefix : recyclePrefix
                                        );
                                    }}
                                    className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
                                >
                                    {browsingRecycle ? (
                                        <RefreshCw className="mr-1 h-4 w-4" />
                                    ) : (
                                        <Trash2 className="mr-1 h-4 w-4" />
                                    )}
                                    {browsingRecycle ? "Về thư viện" : "Xem Recycle"}
                                </button>
                                {presentation === "page" ? (
                                    <button
                                        type="button"
                                        onClick={() => handleRecycleAction(browsingRecycle ? "RESTORE" : "RECYCLE")}
                                        disabled={internalSelectedKeys.length === 0 || recyclePending}
                                        className={cx(
                                            "inline-flex items-center rounded-xl border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                                            browsingRecycle
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                                        )}
                                    >
                                        {recyclePending ? (
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                        ) : browsingRecycle ? (
                                            <RotateCcw className="mr-1 h-4 w-4" />
                                        ) : (
                                            <Trash2 className="mr-1 h-4 w-4" />
                                        )}
                                        {browsingRecycle ? "Khôi phục ảnh đã chọn" : "Đưa vào Recycle"}
                                    </button>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="min-h-[320px] flex-1 overflow-auto p-5">
                    {initialLoading ? (
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
                                                    handleOpenFolder(
                                                        folder.prefix
                                                    )
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
                                            const disabled = disabledKeySet.has(item.key);
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
                                                    disabled={disabled}
                                                    onClick={() =>
                                                        handleItemClick(
                                                            item.key
                                                        )
                                                    }
                                                    className={cx(
                                                        "relative overflow-hidden rounded-2xl border text-left transition",
                                                        disabled && "cursor-not-allowed opacity-45",
                                                        selected
                                                            ? "border-slate-900 ring-1 ring-slate-900"
                                                            : "border-slate-200 hover:border-slate-300"
                                                    )}
                                                >
                                                    <div className="aspect-square bg-slate-100">
                                                        {item.signedUrl ? (
                                                            <img
                                                                src={
                                                                    item.signedUrl
                                                                }
                                                                alt={item.key}
                                                                loading="lazy"
                                                                decoding="async"
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

                                                    {disabled && !selected ? (
                                                        <div className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                                                            Đã chọn
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

                                    {hasMore ? (
                                        <div className="flex justify-center pt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    loadItems(
                                                        "more",
                                                        nextCursor
                                                    )
                                                }
                                                disabled={loading || !nextCursor}
                                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Đang tải...
                                                    </>
                                                ) : (
                                                    "Tải thêm ảnh"
                                                )}
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {selectionMode === "multiple" ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                        <div className="flex items-center gap-3">
                            {footerLeadingAction}
                            <div className="text-sm text-slate-500">
                                {footerHint ?? (browsingRecycle
                                    ? "Ảnh trong Recycle chỉ được đưa trở lại thư viện khi người dùng chọn khôi phục."
                                    : "Có thể chọn nhiều ảnh. Ảnh đã chọn có thể được xác nhận sử dụng hoặc đưa thủ công vào Recycle.")}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {enableRecycle ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRecycleAction(
                                            browsingRecycle ? "RESTORE" : "RECYCLE"
                                        )
                                    }
                                    disabled={
                                        internalSelectedKeys.length === 0 ||
                                        recyclePending
                                    }
                                    className={cx(
                                        "inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
                                        browsingRecycle
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
                                    )}
                                >
                                    {recyclePending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : browsingRecycle ? (
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    {browsingRecycle
                                        ? "Khôi phục ảnh đã chọn"
                                        : "Đưa vào Recycle"}
                                </button>
                            ) : null}
                            {!browsingRecycle ? (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={
                                        internalSelectedKeys.length === 0 ||
                                        recyclePending
                                    }
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitLabel}
                                </button>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
