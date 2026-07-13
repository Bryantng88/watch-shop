"use client";
/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import MediaBrowserDialog, {
    type SharedMediaProfile,
} from "./MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";



export type PickedMediaItem = {
    key: string;
    fileKey?: string | null;
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
    profile?: SharedMediaProfile;
    maxFinalSelection?: number;
    title?: string;
    description?: string;
    contextImage?: ContextImage | null;
};

type PreviewState = {
    src: string;
    label?: string | null;
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
function getItemKey(item: PickedMediaItem) {
    return String(item.key ?? item.fileKey ?? "").trim();
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

function ImagePreviewDialog({
    preview,
    onClose,
}: {
    preview: PreviewState;
    onClose: () => void;
}) {
    if (!preview?.src) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4">
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close image preview"
                onClick={onClose}
            />
            <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white p-3 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white"
                >
                    Close
                </button>
                <img
                    src={preview.src}
                    alt={preview.label ?? "Preview"}
                    className="max-h-[82vh] w-full rounded-2xl object-contain"
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
    onPreviewClose,
}: {
    items: PickedMediaItem[];
    selectedItems: PickedMediaItem[];
    onToggleSelect: (item: PickedMediaItem) => void;
    onRemoveChosen: (key: string) => void;
    maxFinalSelection?: number;
    onPreview: (item: PickedMediaItem) => void;
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
                                >
                                    <button
                                        type="button"
                                        onClick={() => onPreview(item)}
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
                                                className="h-full w-full object-cover"
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
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    onPreviewClose();
                                                    onRemoveChosen(getItemKey(item));
                                                }}
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
    onPreviewClose,
}: {
    items: PickedMediaItem[];
    onRemove: (key: string) => void;
    onPreview: (item: PickedMediaItem) => void;
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
                                className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-2xl border border-blue-200 bg-white"
                                role="button"
                                tabIndex={0}
                                onClick={() => onPreview(item)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        onPreview(item);
                                    }
                                }}
                            >
                                <div className="h-full w-full overflow-hidden rounded-2xl">
                                    <img
                                        src={src}
                                        alt={label}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onPreviewClose();
                                        onRemove(getItemKey(item));
                                    }}
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

    const handlePreview = React.useCallback((item: PickedMediaItem) => {
        const src = getImageSrc(item);
        if (!src) return;

        setPreview({
            src,
            label: getLabel(item),
        });
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
            setPreview(null);

            const normalizedKey = String(key ?? "").trim();

            const isSelected = selectedItems.some(
                (item) => getItemKey(item) === normalizedKey,
            );

            const nextChosen = chosenItems.filter(
                (item) => getItemKey(item) !== normalizedKey,
            );

            const nextSelected = selectedItems.filter(
                (item) => getItemKey(item) !== normalizedKey,
            );

            if (isSelected) {
                onSelectedChange(nextSelected);
            }

            onChosenChange(nextChosen);
        },
        [chosenItems, selectedItems, onChosenChange, onSelectedChange],
    );
    const handleRemoveSelected = React.useCallback(
        (key: string) => {
            setPreview(null);

            const normalizedKey = String(key ?? "").trim();

            onSelectedChange(
                selectedItems.filter(
                    (item) => getItemKey(item) !== normalizedKey,
                ),
            );
        },
        [onSelectedChange, selectedItems],
    );
    return (
        <div className="space-y-4">
            <ImagePreviewDialog
                preview={preview}
                onClose={handlePreviewClose}
            />

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
                onPreviewClose={handlePreviewClose}
            />

            <SelectedStrip
                items={selectedItems}
                onRemove={handleRemoveSelected}
                onPreview={handlePreview}
                onPreviewClose={handlePreviewClose}
            />

            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                selectionMode="multiple"
                selectedKeys={chosenItems.map((item) => item.key)}
                disabledKeys={[
                    ...chosenItems.map((item) => item.key),
                    ...selectedItems.map((item) => item.key),
                ]}
                onSubmit={handleDialogSubmit}
                submitLabel="Xác nhận ảnh đã chọn"
                contextImage={contextImage}
            />
        </div>
    );
}
