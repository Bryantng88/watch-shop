"use client";

import * as React from "react";
import MediaBrowserDialog from "./MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";



export type PickedMediaItem = {
    key: string;
    url?: string | null;
    name?: string | null;
};
type ContextImage = {
    src?: string | null;
    title?: string | null;
    subtitle?: string | null;
};
type Props = {
    chosenValue?: PickedMediaItem[];
    selectedValue?: PickedMediaItem[];
    onChosenChange: (items: PickedMediaItem[]) => void;
    onSelectedChange: (items: PickedMediaItem[]) => void;
    profile?: any;
    maxFinalSelection?: number;
    title?: string;
    description?: string;
    contextImage?: ContextImage | null;
};

type PreviewState = {
    src: string;
    label?: string | null;
    x: number;
    y: number;
    size: number;
} | null;

function dedupeItems(items: PickedMediaItem[]) {
    const map = new Map<string, PickedMediaItem>();

    for (const item of items) {
        const key = String(item?.key ?? "").trim();
        if (!key) continue;

        map.set(key, {
            key,
            url: item?.url ?? null,
            name: item?.name ?? key.split("/").pop() ?? key,
        });
    }

    return Array.from(map.values());
}

function normalizeItems(items?: PickedMediaItem[]) {
    if (!Array.isArray(items)) return [];

    return dedupeItems(
        items
            .map((item) => ({
                key: String(item?.key ?? "").trim(),
                url: item?.url ?? null,
                name: item?.name ?? null,
            }))
            .filter((item) => item.key)
    );
}

function toPickedItem(input: string | PickedMediaItem): PickedMediaItem {
    if (typeof input === "string") {
        const key = input.trim();

        return {
            key,
            url: resolveMediaPreviewSrc(key) || null,
            name: key.split("/").pop() ?? key,
        };
    }

    const key = String(input?.key ?? "").trim();

    return {
        key,
        url: input?.url ?? resolveMediaPreviewSrc(key) ?? null,
        name: input?.name ?? key.split("/").pop() ?? key,
    };
}

function getImageSrc(item: PickedMediaItem) {
    return item.url || resolveMediaPreviewSrc(item.key) || "";
}

function getLabel(item: PickedMediaItem) {
    return item.name ?? item.key.split("/").pop() ?? item.key;
}

function computePreviewPosition(input: {
    x: number;
    y: number;
    size: number;
}) {
    const padding = 18;
    const labelHeight = 40;
    const width = input.size;
    const height = input.size + labelHeight;

    let left = input.x + 24;
    let top = input.y - height / 2;

    if (typeof window !== "undefined") {
        if (left + width + padding > window.innerWidth) {
            left = input.x - width - 24;
        }

        if (left < padding) left = padding;
        if (top < padding) top = padding;

        if (top + height + padding > window.innerHeight) {
            top = window.innerHeight - height - padding;
        }
    }

    return { left, top };
}

function FloatingPreview({ preview }: { preview: PreviewState }) {
    if (!preview?.src) return null;

    const { left, top } = computePreviewPosition({
        x: preview.x,
        y: preview.y,
        size: preview.size,
    });

    return (
        <div
            className="pointer-events-none fixed z-[99999]"
            style={{ left, top }}
        >
            <div
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl"
                style={{ width: preview.size }}
            >
                <img
                    src={preview.src}
                    alt={preview.label ?? "Preview"}
                    className="w-full rounded-2xl object-cover"
                    style={{ height: preview.size }}
                />

                {preview.label ? (
                    <div className="truncate px-2 py-2 text-xs font-medium text-slate-600">
                        {preview.label}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function ChosenGrid({
    items,
    selectedItems,
    onToggleSelect,
    onRemoveChosen,
    maxFinalSelection,
    onPreview,
    onPreviewMove,
    onPreviewClose,
}: {
    items: PickedMediaItem[];
    selectedItems: PickedMediaItem[];
    onToggleSelect: (item: PickedMediaItem) => void;
    onRemoveChosen: (key: string) => void;
    maxFinalSelection?: number;
    onPreview: (payload: {
        item: PickedMediaItem;
        event: React.MouseEvent;
        size: number;
    }) => void;
    onPreviewMove: (event: React.MouseEvent) => void;
    onPreviewClose: () => void;
}) {
    const selectedKeySet = new Set(selectedItems.map((item) => item.key));

    return (
        <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700">
                Kho ảnh đã chọn tạm
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    Chưa có ảnh nào trong chosen.
                </div>
            ) : (
                <div className="max-h-[560px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-5">
                        {items.map((item) => {
                            const src = getImageSrc(item);
                            const active = selectedKeySet.has(item.key);
                            const label = getLabel(item);

                            return (
                                <div
                                    key={item.key}
                                    className={[
                                        "relative overflow-hidden rounded-2xl border bg-white",
                                        active
                                            ? "border-blue-500 ring-2 ring-blue-100"
                                            : "border-slate-200",
                                    ].join(" ")}
                                    onMouseEnter={(event) =>
                                        onPreview({ item, event, size: 420 })
                                    }
                                    onMouseMove={onPreviewMove}
                                    onMouseLeave={onPreviewClose}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onToggleSelect(item)}
                                        className="block w-full"
                                        title={
                                            active
                                                ? "Bỏ khỏi danh sách sẽ lưu"
                                                : typeof maxFinalSelection === "number" && maxFinalSelection > 0
                                                    ? `Đưa vào danh sách sẽ lưu (tối đa ${maxFinalSelection})`
                                                    : "Đưa vào danh sách sẽ lưu"
                                        }
                                    >
                                        <div className="aspect-square w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={src}
                                                alt={label}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.04]"
                                            />
                                        </div>
                                    </button>

                                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-2 py-2">
                                        <div className="min-w-0 flex-1 truncate text-[11px] text-slate-500">
                                            {label}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onToggleSelect(item)
                                                }
                                                className={[
                                                    "rounded-full px-2 py-1 text-[11px] font-medium",
                                                    active
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-700",
                                                ].join(" ")}
                                            >
                                                {active ? "Đã chọn" : "Chọn"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemoveChosen(item.key)
                                                }
                                                className="rounded-full bg-black px-2 py-1 text-[11px] text-white"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function SelectedStrip({
    items,
    onRemove,
    onPreview,
    onPreviewMove,
    onPreviewClose,
}: {
    items: PickedMediaItem[];
    onRemove: (key: string) => void;
    onPreview: (payload: {
        item: PickedMediaItem;
        event: React.MouseEvent;
        size: number;
    }) => void;
    onPreviewMove: (event: React.MouseEvent) => void;
    onPreviewClose: () => void;
}) {
    return (
        <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700">
                Ảnh sẽ lưu cho watch
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    Chưa có ảnh nào được chọn để lưu.
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {items.map((item) => {
                        const src = getImageSrc(item);
                        const label = getLabel(item);

                        return (
                            <div
                                key={item.key}
                                className="relative h-24 w-24 overflow-hidden rounded-2xl border border-blue-200 bg-white"
                                onMouseEnter={(event) =>
                                    onPreview({ item, event, size: 360 })
                                }
                                onMouseMove={onPreviewMove}
                                onMouseLeave={onPreviewClose}
                            >
                                <div className="h-full w-full overflow-hidden rounded-2xl">
                                    <img
                                        src={src}
                                        alt={label}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.05]"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onRemove(item.key)}
                                    className="absolute right-1 top-1 rounded-full bg-black/80 px-2 py-0.5 text-[11px] text-white"
                                >
                                    X
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function MediaPickerMulti({
    chosenValue = [],
    selectedValue = [],
    onChosenChange,
    onSelectedChange,
    profile = "inline",
    maxFinalSelection,
    title,
    description,
    contextImage,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [preview, setPreview] = React.useState<PreviewState>(null);
    const notify = useNotify();
    const chosenItems = React.useMemo(
        () => normalizeItems(chosenValue),
        [chosenValue]
    );

    const selectedItems = React.useMemo(
        () => normalizeItems(selectedValue),
        [selectedValue]
    );

    const selectedKeySet = React.useMemo(
        () => new Set(selectedItems.map((item) => item.key)),
        [selectedItems]
    );

    const handlePreview = React.useCallback(
        ({
            item,
            event,
            size,
        }: {
            item: PickedMediaItem;
            event: React.MouseEvent;
            size: number;
        }) => {
            const src = getImageSrc(item);
            if (!src) return;

            setPreview({
                src,
                label: getLabel(item),
                x: event.clientX,
                y: event.clientY,
                size,
            });
        },
        []
    );

    const handlePreviewMove = React.useCallback((event: React.MouseEvent) => {
        setPreview((prev) =>
            prev
                ? {
                    ...prev,
                    x: event.clientX,
                    y: event.clientY,
                }
                : null
        );
    }, []);

    const handlePreviewClose = React.useCallback(() => {
        setPreview(null);
    }, []);

    const handleDialogSubmit = React.useCallback(
        (keys: string[]) => {
            const pickedItems = keys.map((key) => toPickedItem(key));

            const nextChosen = dedupeItems([
                ...chosenItems,
                ...pickedItems,
            ]);

            onChosenChange(nextChosen);
            setOpen(false);
        },
        [chosenItems, onChosenChange]
    );

    const handleToggleSelect = React.useCallback(
        (item: PickedMediaItem) => {
            const exists = selectedKeySet.has(item.key);

            if (exists) {
                onSelectedChange(
                    selectedItems.filter((x) => x.key !== item.key)
                );

                return;
            }

            const next = dedupeItems([...selectedItems, item]);

            if (
                typeof maxFinalSelection === "number" &&
                next.length > maxFinalSelection
            ) {
                window.alert(
                    `Chỉ được lưu tối đa ${maxFinalSelection} ảnh gallery.`
                );

                return;
            }

            onSelectedChange(next);
        },
        [
            maxFinalSelection,
            onSelectedChange,
            selectedItems,
            selectedKeySet,
        ]
    );
    const handleRemoveChosen = React.useCallback(
        (key: string) => {
            const nextChosen = chosenItems.filter((item) => item.key !== key);
            const nextSelected = selectedItems.filter(
                (item) => item.key !== key
            );

            onChosenChange(nextChosen);
            onSelectedChange(nextSelected);
        },
        [chosenItems, selectedItems, onChosenChange, onSelectedChange]
    );

    const handleRemoveSelected = React.useCallback(
        (key: string) => {
            onSelectedChange(selectedItems.filter((item) => item.key !== key));
        },
        [onSelectedChange, selectedItems]
    );

    return (
        <div className="space-y-4">
            <FloatingPreview preview={preview} />

            {(title || description) ? (
                <div className="space-y-1">
                    {title ? (
                        <div className="text-sm font-semibold text-slate-900">
                            {title}
                        </div>
                    ) : null}

                    {description ? (
                        <div className="text-sm text-slate-500">
                            {description}
                        </div>
                    ) : null}
                </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    + Chọn ảnh từ kho
                </button>

                <div className="inline-flex items-center rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                    Chosen: {chosenItems.length}
                </div>

                <div className="inline-flex items-center rounded-2xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    Sẽ lưu:{" "}
                    {typeof maxFinalSelection === "number" && maxFinalSelection > 0
                        ? `${selectedItems.length}/${maxFinalSelection}`
                        : selectedItems.length}
                </div>
            </div>

            <ChosenGrid
                items={chosenItems}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onRemoveChosen={handleRemoveChosen}
                maxFinalSelection={maxFinalSelection}
                onPreview={handlePreview}
                onPreviewMove={handlePreviewMove}
                onPreviewClose={handlePreviewClose}
            />

            <SelectedStrip
                items={selectedItems}
                onRemove={handleRemoveSelected}
                onPreview={handlePreview}
                onPreviewMove={handlePreviewMove}
                onPreviewClose={handlePreviewClose}
            />

            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                selectionMode="multiple"
                selectedKeys={chosenItems.map((item) => item.key)}
                onSubmit={handleDialogSubmit}
                submitLabel="Xác nhận ảnh đã chọn"
                contextImage={contextImage}
            />
        </div>
    );
}