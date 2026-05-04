"use client";

import * as React from "react";
import MediaBrowserDialog from "./MediaBrowserDialog";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

export type PickedMediaItem = {
    key: string;
    url?: string | null;
    name?: string | null;
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
};

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

async function moveMedia(params: {
    fromKey: string;
    toPrefix: string;
    deleteSource: boolean;
    overwrite?: boolean;
}): Promise<PickedMediaItem> {
    const cleanKey = String(params.fromKey || "").trim();

    const res = await fetch("/api/media/move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fromKey: cleanKey,
            toPrefix: params.toPrefix,
            deleteSource: params.deleteSource,
            overwrite: params.overwrite ?? false,
        }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(json?.error || `Không thể chuyển ảnh: ${cleanKey}`);
    }

    const movedKey = String(json?.key ?? cleanKey);

    return {
        key: movedKey,
        url: json?.url ?? resolveMediaPreviewSrc(movedKey) ?? null,
        name: movedKey.split("/").pop() ?? movedKey,
    };
}

async function moveToChosen(key: string): Promise<PickedMediaItem> {
    const cleanKey = String(key || "").trim();

    if (cleanKey.startsWith("products/edit/chosen/")) {
        return toPickedItem(cleanKey);
    }

    return moveMedia({
        fromKey: cleanKey,
        toPrefix: "products/edit/chosen",
        deleteSource: true,
        overwrite: false,
    });
}
async function moveBackToActive(key: string): Promise<PickedMediaItem> {
    const cleanKey = String(key || "").trim();

    if (!cleanKey.startsWith("products/edit/chosen/")) {
        return toPickedItem(cleanKey);
    }

    return moveMedia({
        fromKey: cleanKey,
        toPrefix: "products/edit/active",
        deleteSource: true,
        overwrite: false,
    });
}

function ChosenGrid({
    items,
    selectedItems,
    onToggleSelect,
    onRemoveChosen,
    maxFinalSelection,
    movingBackKey,
}: {
    items: PickedMediaItem[];
    selectedItems: PickedMediaItem[];
    onToggleSelect: (item: PickedMediaItem) => void;
    onRemoveChosen: (key: string) => void | Promise<void>;
    maxFinalSelection: number;
    movingBackKey?: string | null;
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
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-5">
                    {items.map((item) => {
                        const src =
                            item.url || resolveMediaPreviewSrc(item.key) || "";
                        const active = selectedKeySet.has(item.key);
                        const isMovingBack = movingBackKey === item.key;

                        return (
                            <div
                                key={item.key}
                                className={`group relative overflow-hidden rounded-2xl border bg-white ${active
                                    ? "border-blue-500 ring-2 ring-blue-100"
                                    : "border-slate-200"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onToggleSelect(item)}
                                    disabled={isMovingBack}
                                    className="block w-full disabled:cursor-not-allowed disabled:opacity-60"
                                    title={
                                        active
                                            ? "Bỏ khỏi danh sách sẽ lưu"
                                            : `Đưa vào danh sách sẽ lưu (tối đa ${maxFinalSelection})`
                                    }
                                >
                                    <div className="aspect-square w-full overflow-hidden bg-slate-100">
                                        <img
                                            src={src}
                                            alt={item.name ?? item.key}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                </button>

                                <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-2 py-2">
                                    <div className="min-w-0 flex-1 truncate text-[11px] text-slate-500">
                                        {item.name ??
                                            item.key.split("/").pop() ??
                                            item.key}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            disabled={isMovingBack}
                                            onClick={() => onToggleSelect(item)}
                                            className={`rounded-full px-2 py-1 text-[11px] font-medium disabled:cursor-not-allowed disabled:opacity-60 ${active
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-700"
                                                }`}
                                        >
                                            {active ? "Đã chọn" : "Chọn"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={isMovingBack}
                                            onClick={() =>
                                                onRemoveChosen(item.key)
                                            }
                                            className="rounded-full bg-black px-2 py-1 text-[11px] text-white disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isMovingBack ? "..." : "X"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SelectedStrip({
    items,
    onRemove,
}: {
    items: PickedMediaItem[];
    onRemove: (key: string) => void;
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
                        const src =
                            item.url || resolveMediaPreviewSrc(item.key) || "";

                        return (
                            <div
                                key={item.key}
                                className="relative h-24 w-24 overflow-hidden rounded-2xl border border-blue-200 bg-white"
                            >
                                <img
                                    src={src}
                                    alt={item.name ?? item.key}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />

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
    maxFinalSelection = 8,
    title,
    description,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [movingBackKey, setMovingBackKey] = React.useState<string | null>(
        null
    );

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

    const handleDialogSubmit = React.useCallback(
        async (keys: string[]) => {
            try {
                setSubmitting(true);

                const movedItems = await Promise.all(
                    keys.map(async (key) => moveToChosen(key))
                );

                const nextChosen = dedupeItems([
                    ...chosenItems,
                    ...movedItems,
                ]);

                const nextSelected = dedupeItems([
                    ...selectedItems,
                    ...movedItems,
                ]).slice(0, maxFinalSelection);

                onChosenChange(nextChosen);
                onSelectedChange(nextSelected);
                setOpen(false);
            } catch (error) {
                console.error("media move error", error);
                alert(
                    error instanceof Error
                        ? error.message
                        : "Không thể chuyển ảnh sang chosen"
                );
            } finally {
                setSubmitting(false);
            }
        },
        [
            chosenItems,
            selectedItems,
            maxFinalSelection,
            onChosenChange,
            onSelectedChange,
        ]
    );

    const handleToggleSelect = React.useCallback(
        (item: PickedMediaItem) => {
            const exists = selectedKeySet.has(item.key);

            if (exists) {
                onSelectedChange(
                    selectedItems.filter(
                        (selected) => selected.key !== item.key
                    )
                );
                return;
            }

            if (selectedItems.length >= maxFinalSelection) return;

            onSelectedChange(dedupeItems([...selectedItems, item]));
        },
        [maxFinalSelection, onSelectedChange, selectedItems, selectedKeySet]
    );

    const handleRemoveChosen = React.useCallback(
        async (key: string) => {
            try {
                setMovingBackKey(key);

                await moveBackToActive(key);

                const nextChosen = chosenItems.filter(
                    (item) => item.key !== key
                );

                const nextSelected = selectedItems.filter(
                    (item) => item.key !== key
                );

                onChosenChange(nextChosen);
                onSelectedChange(nextSelected);
            } catch (error) {
                console.error("media move back error", error);
                alert(
                    error instanceof Error
                        ? error.message
                        : "Không thể chuyển ảnh về active"
                );
            } finally {
                setMovingBackKey(null);
            }
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
            {(title || description) && (
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
            )}

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    disabled={submitting || Boolean(movingBackKey)}
                    className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? "Đang chuyển ảnh..." : "+ Chọn ảnh từ kho"}
                </button>

                <div className="inline-flex items-center rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                    Chosen: {chosenItems.length}
                </div>

                <div className="inline-flex items-center rounded-2xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    Sẽ lưu: {selectedItems.length}/{maxFinalSelection}
                </div>
            </div>

            <ChosenGrid
                items={chosenItems}
                selectedItems={selectedItems}
                onToggleSelect={handleToggleSelect}
                onRemoveChosen={handleRemoveChosen}
                maxFinalSelection={maxFinalSelection}
                movingBackKey={movingBackKey}
            />

            <SelectedStrip
                items={selectedItems}
                onRemove={handleRemoveSelected}
            />

            <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                selectionMode="multiple"
                selectedKeys={chosenItems.map((item) => item.key)}
                onSubmit={handleDialogSubmit}
                submitLabel="Xác nhận ảnh đã chọn"
            />
        </div>
    );
}