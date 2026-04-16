"use client";

import * as React from "react";
import { Check, ImagePlus, Loader2, Plus, RotateCcw, X } from "lucide-react";
import MediaBrowserDialog, { type SharedMediaProfile } from "./MediaBrowserDialog";

export type PickedMediaItem = {
    key: string;
    url?: string | null;
};

type Props = {
    chosenValue: PickedMediaItem[];
    selectedValue: PickedMediaItem[];
    onChosenChange: (items: PickedMediaItem[]) => void;
    onSelectedChange: (items: PickedMediaItem[]) => void;
    pending?: boolean;
    disabled?: boolean;
    profile?: SharedMediaProfile;
    maxFinalSelection?: number;
    className?: string;
    title?: string;
    description?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isRenderableUrl(value: string) {
    return (
        /^(https?:)?\/\//i.test(value) ||
        value.startsWith("/") ||
        value.startsWith("data:") ||
        value.startsWith("blob:")
    );
}

function resolvePreviewSrc(value?: string | null) {
    const trimmed = String(value ?? "").trim();
    if (!trimmed) return null;
    if (isRenderableUrl(trimmed)) return trimmed;
    return `/api/media/sign?key=${encodeURIComponent(trimmed)}`;
}

function uniqueByKey(items: PickedMediaItem[]) {
    const seen = new Set<string>();
    const out: PickedMediaItem[] = [];
    for (const item of items) {
        const key = String(item?.key ?? "").trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push({
            key,
            url: item?.url ?? null,
        });
    }
    return out;
}

async function moveMediaKey(params: {
    fromKey: string;
    toPrefix: string;
}) {
    const fromKey = String(params.fromKey ?? "").trim();
    const toPrefix = String(params.toPrefix ?? "").trim();

    if (!fromKey) throw new Error("Thiếu fromKey.");
    if (!toPrefix) throw new Error("Thiếu toPrefix.");

    if (fromKey.startsWith(`${toPrefix}/`)) {
        return {
            key: fromKey,
            url: `/api/media/sign?key=${encodeURIComponent(fromKey)}`,
        };
    }

    const res = await fetch("/api/media/move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fromKey,
            toPrefix,
            deleteSource: true,
            overwrite: false,
        }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(json?.error || "Không thể chuyển ảnh.");
    }

    const nextKey = String(json?.key ?? "").trim();
    if (!nextKey) {
        throw new Error("API move không trả về key hợp lệ.");
    }

    return {
        key: nextKey,
        url:
            String(json?.url ?? "").trim() ||
            `/api/media/sign?key=${encodeURIComponent(nextKey)}`,
    };
}

function getProfilePrefixes(profile: SharedMediaProfile) {
    if (profile === "edit") {
        return {
            activePrefix: "products/edit/active",
            chosenPrefix: "products/edit/chosen",
        };
    }

    if (profile === "storefront-active") {
        return {
            activePrefix: "product/storefront/active",
            chosenPrefix: "product/storefront/chosen",
        };
    }

    throw new Error("Profile hiện tại không hỗ trợ move ảnh.");
}

export default function MediaPickerMulti({
    chosenValue,
    selectedValue,
    onChosenChange,
    onSelectedChange,
    pending = false,
    disabled = false,
    profile = "edit",
    maxFinalSelection = 8,
    className,
    title = "Ảnh sản phẩm",
    description = "Chọn ảnh từ S3 để đưa vào chosen. Sau đó lọc lại ảnh nào sẽ thực sự lưu vào sản phẩm.",
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [processingKey, setProcessingKey] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const normalizedChosen = React.useMemo(
        () => uniqueByKey(Array.isArray(chosenValue) ? chosenValue : []),
        [chosenValue]
    );

    const normalizedSelected = React.useMemo(
        () =>
            uniqueByKey(Array.isArray(selectedValue) ? selectedValue : []).slice(
                0,
                maxFinalSelection
            ),
        [selectedValue, maxFinalSelection]
    );

    const selectedKeySet = React.useMemo(
        () => new Set(normalizedSelected.map((item) => item.key)),
        [normalizedSelected]
    );

    const selectedIndexMap = React.useMemo(() => {
        const map = new Map<string, number>();
        normalizedSelected.forEach((item, index) => {
            map.set(item.key, index);
        });
        return map;
    }, [normalizedSelected]);

    const dialogSelectedKeys = React.useMemo(
        () => normalizedChosen.map((item) => item.key),
        [normalizedChosen]
    );
    const [hoverPreview, setHoverPreview] = React.useState<{
        key: string;
        src: string;
        x: number;
        y: number;
    } | null>(null);
    async function handleAddFromBrowser(fileKeys: string[]) {
        try {
            setSubmitting(true);
            setError(null);

            const { chosenPrefix } = getProfilePrefixes(profile);

            const movedItems: PickedMediaItem[] = [];
            for (const fileKey of fileKeys) {
                const moved = await moveMediaKey({
                    fromKey: fileKey,
                    toPrefix: chosenPrefix,
                });
                movedItems.push(moved);
            }

            const mergedChosen = uniqueByKey([...normalizedChosen, ...movedItems]);
            onChosenChange(mergedChosen);
            setOpen(false);
        } catch (e: any) {
            console.error("[MediaPickerMulti][handleAddFromBrowser]", e);
            setError(e?.message || "Không thể chuyển ảnh sang chosen.");
        } finally {
            setSubmitting(false);
        }
    }

    function handleToggleSelected(item: PickedMediaItem) {
        const exists = selectedKeySet.has(item.key);

        if (exists) {
            onSelectedChange(
                normalizedSelected.filter((selected) => selected.key !== item.key)
            );
            return;
        }

        if (normalizedSelected.length >= maxFinalSelection) {
            setError(`Chỉ có thể lưu tối đa ${maxFinalSelection} ảnh.`);
            return;
        }

        setError(null);
        onSelectedChange([...normalizedSelected, item]);
    }
    function openHoverPreview(
        e: React.MouseEvent<HTMLElement>,
        item: PickedMediaItem
    ) {
        const src = resolvePreviewSrc(item.url || item.key);
        if (!src) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const previewWidth = 320;
        const gap = 16;

        const showLeft =
            rect.right + gap + previewWidth > window.innerWidth - 24;

        const x = showLeft
            ? Math.max(16, rect.left - previewWidth - gap)
            : Math.min(window.innerWidth - previewWidth - 16, rect.right + gap);

        const y = Math.min(
            Math.max(16, rect.top),
            window.innerHeight - 420
        );

        setHoverPreview({
            key: item.key,
            src,
            x,
            y,
        });
    }

    function closeHoverPreview() {
        setHoverPreview(null);
    }
    async function handleReturnToActive(item: PickedMediaItem) {
        try {
            setProcessingKey(item.key);
            setError(null);

            const { activePrefix } = getProfilePrefixes(profile);

            await moveMediaKey({
                fromKey: item.key,
                toPrefix: activePrefix,
            });

            onChosenChange(normalizedChosen.filter((img) => img.key !== item.key));
            onSelectedChange(
                normalizedSelected.filter((img) => img.key !== item.key)
            );
        } catch (e: any) {
            console.error("[MediaPickerMulti][handleReturnToActive]", e);
            setError(e?.message || "Không thể trả ảnh về active.");
        } finally {
            setProcessingKey(null);
        }
    }

    function handleRemoveFromSelected(item: PickedMediaItem) {
        onSelectedChange(
            normalizedSelected.filter((selected) => selected.key !== item.key)
        );
    }

    function handleReorderSelected(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return;
        if (toIndex < 0 || toIndex >= normalizedSelected.length) return;

        const next = [...normalizedSelected];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onSelectedChange(next);
    }

    return (
        <>
            <div className={cx("space-y-4", className)}>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900">{title}</div>
                            <div className="mt-1 text-sm text-slate-500">{description}</div>
                        </div>

                        <button
                            type="button"
                            disabled={disabled || pending || submitting}
                            onClick={() => setOpen(true)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            Chọn ảnh
                        </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                            Trong chosen: {normalizedChosen.length}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                            Sẽ lưu: {normalizedSelected.length}/{maxFinalSelection}
                        </span>
                    </div>

                    {error ? (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">
                                Ảnh sẽ lưu vào sản phẩm
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                Chỉ phần này sẽ được lưu khi bấm Save.
                            </div>
                        </div>
                    </div>

                    {normalizedSelected.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {normalizedSelected.map((item, index) => {
                                const src = resolvePreviewSrc(item.url || item.key);

                                return (
                                    <div
                                        key={`${item.key}-${index}`}
                                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                                    >
                                        {src ? (
                                            <img
                                                src={src}
                                                alt=""
                                                className="aspect-square w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex aspect-square w-full items-center justify-center text-slate-400">
                                                <ImagePlus className="h-5 w-5" />
                                            </div>
                                        )}

                                        <div className="absolute left-1.5 top-1.5 rounded-md bg-slate-900 px-1.5 py-0.5 text-[11px] font-medium text-white">
                                            {index + 1}
                                        </div>

                                        <div className="absolute right-1.5 top-1.5 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => handleReorderSelected(index, index - 1)}
                                                className="rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white"
                                                title="Đưa lên trước"
                                            >
                                                ←
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleReorderSelected(index, index + 1)}
                                                className="rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white"
                                                title="Đưa ra sau"
                                            >
                                                →
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFromSelected(item)}
                                                className="rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white"
                                                title="Bỏ khỏi danh sách lưu"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            Chưa chọn ảnh nào để lưu.
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3">
                        <div className="text-sm font-semibold text-slate-900">
                            Kho ảnh đã chọn
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            Ảnh trong khu này đang nằm ở thư mục chosen. Bấm vào ảnh để chọn/bỏ chọn lưu, hoặc trả ảnh về active nếu chọn nhầm.
                        </div>
                    </div>

                    {normalizedChosen.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                            {normalizedChosen.map((item) => {
                                const src = resolvePreviewSrc(item.url || item.key);
                                const selected = selectedKeySet.has(item.key);
                                const selectedIndex = selectedIndexMap.get(item.key);

                                return (
                                    <button

                                        key={item.key}
                                        type="button"
                                        onClick={() => handleToggleSelected(item)}
                                        onMouseEnter={(e) => openHoverPreview(e, item)}
                                        onMouseLeave={closeHoverPreview}
                                        className={cx(
                                            "group relative overflow-hidden rounded-xl border bg-slate-100 text-left transition",
                                            selected
                                                ? "border-blue-500 ring-1 ring-blue-500"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                        title={item.key}

                                    >
                                        {src ? (
                                            <img
                                                src={src}
                                                alt=""
                                                className="aspect-square w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex aspect-square w-full items-center justify-center text-slate-400">
                                                <ImagePlus className="h-5 w-5" />
                                            </div>
                                        )}

                                        {selected ? (
                                            <div className="absolute left-1.5 top-1.5 rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
                                                #{(selectedIndex ?? 0) + 1}
                                            </div>
                                        ) : null}

                                        <div className="absolute right-1.5 top-1.5 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReturnToActive(item);
                                                }}
                                                disabled={processingKey === item.key}
                                                className="rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white disabled:opacity-50"
                                                title="Trả về active"
                                            >
                                                {processingKey === item.key ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                                            <div className="truncate text-[11px] text-white">
                                                {selected ? "Đã chọn để lưu" : "Bấm để chọn lưu"}
                                            </div>
                                        </div>

                                        {selected ? (
                                            <div className="absolute inset-0 bg-blue-500/10" />
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            Chưa có ảnh nào trong chosen.
                        </div>
                    )}
                </div>
            </div>
            {hoverPreview ? (
                <div
                    className="pointer-events-none fixed z-[120] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    style={{
                        left: hoverPreview.x,
                        top: hoverPreview.y,
                        width: 320,
                    }}
                >
                    <div className="bg-slate-100">
                        <img
                            src={hoverPreview.src}
                            alt={hoverPreview.key}
                            className="max-h-[380px] w-full object-contain"
                        />
                    </div>
                    <div className="border-t border-slate-100 px-3 py-2">
                        <div className="truncate text-xs text-slate-500">
                            {hoverPreview.key}
                        </div>
                    </div>
                </div>
            ) : null}
            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                selectionMode="multiple"
                selectedKeys={dialogSelectedKeys}
                onSubmit={handleAddFromBrowser}
                title="Chọn ảnh chi tiết sản phẩm"
                description="Có thể chọn không giới hạn ảnh từ products/edit/active. Khi xác nhận, ảnh sẽ được chuyển sang products/edit/chosen."
                submitLabel={submitting ? "Đang xử lý..." : "Đưa vào chosen"}
            />
        </>
    );
}