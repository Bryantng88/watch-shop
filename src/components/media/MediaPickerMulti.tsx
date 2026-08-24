"use client";
/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
    audienceSegment?: "MEN" | "WOMEN" | "UNISEX";
    maxFinalSelection?: number;
    title?: string;
    description?: string;
    selectedTitle?: string;
    selectedDescription?: string;
    contextImage?: ContextImage | null;
    browserPresentation?: "dialog" | "inline";
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

function SortableGalleryCard({
    item,
    index,
    itemCount,
    onRemove,
    onMove,
    onPreview,
    onPreviewClose,
}: {
    item: PickedMediaItem;
    index: number;
    itemCount: number;
    onRemove: (key: string) => void;
    onMove: (fromIndex: number, toIndex: number) => void;
    onPreview: (item: PickedMediaItem) => void;
    onPreviewClose: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id: item.key });
    const src = getImageSrc(item);
    const label = getLabel(item);

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`relative h-28 w-24 overflow-hidden rounded-2xl border bg-white shadow-sm transition-[border-color,box-shadow,opacity] duration-200 ${isDragging ? "z-10 border-blue-400 opacity-25" : isOver ? "border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.18)]" : "border-blue-200 hover:border-blue-400"}`}
        >
            <button
                type="button"
                className="block h-24 w-full cursor-grab touch-none overflow-hidden rounded-2xl active:cursor-grabbing"
                onClick={() => onPreview(item)}
                aria-label={`Kéo để sắp xếp hoặc xem ${label}`}
                {...attributes}
                {...listeners}
            >
                <img src={src} alt={label} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-between border-t border-slate-100 bg-white px-2">
                <button type="button" disabled={index === 0} onClick={() => onMove(index, index - 1)} className="text-xs text-slate-500 disabled:opacity-20" aria-label={`Đưa ${label} sang trái`}>←</button>
                <span className="text-[10px] font-semibold text-slate-600">{index + 1}</span>
                <button type="button" disabled={index === itemCount - 1} onClick={() => onMove(index, index + 1)} className="text-xs text-slate-500 disabled:opacity-20" aria-label={`Đưa ${label} sang phải`}>→</button>
            </div>
            <button
                type="button"
                onClick={() => { onPreviewClose(); onRemove(getItemKey(item)); }}
                className="absolute right-1 top-1 rounded-full bg-black/80 px-2 py-0.5 text-[11px] text-white"
                aria-label={`Xóa ${label}`}
            >
                X
            </button>
        </div>
    );
}

function SelectedStrip({
    items,
    onRemove,
    onReorder,
    onPreview,
    onPreviewClose,
    title = "Ảnh sẽ lưu cho watch",
    description = "Kéo thả để sắp xếp. Ảnh số 1 sẽ xuất hiện khi khách rê chuột lên card storefront.",
}: {
    items: PickedMediaItem[];
    onRemove: (key: string) => void;
    onReorder: (items: PickedMediaItem[]) => void;
    onPreview: (item: PickedMediaItem) => void;
    onPreviewClose: () => void;
    title?: string;
    description?: string;
}) {
    const [draggedKey, setDraggedKey] = React.useState<string | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    const moveItem = React.useCallback((fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= items.length) return;
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        if (!moved) return;
        next.splice(toIndex, 0, moved);
        onReorder(next);
    }, [items, onReorder]);

    const handleDragStart = React.useCallback((event: DragStartEvent) => {
        setDraggedKey(String(event.active.id));
    }, []);

    const handleDragEnd = React.useCallback((event: DragEndEvent) => {
        setDraggedKey(null);
        if (!event.over || event.active.id === event.over.id) return;
        const fromIndex = items.findIndex((item) => item.key === event.active.id);
        const toIndex = items.findIndex((item) => item.key === event.over?.id);
        if (fromIndex < 0 || toIndex < 0) return;
        onReorder(arrayMove(items, fromIndex, toIndex));
    }, [items, onReorder]);

    const draggedItem = items.find((item) => item.key === draggedKey) ?? null;

    return (
        <div className="space-y-3">
            <div>
                <div className="text-sm font-medium text-slate-700">{title}</div>
                <div className="mt-1 text-xs text-slate-500">{description}</div>
            </div>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    Chưa có ảnh nào được chọn để lưu.
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragCancel={() => setDraggedKey(null)} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((item) => item.key)} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-3">
                            {items.map((item, index) => (
                                <SortableGalleryCard key={item.key} item={item} index={index} itemCount={items.length} onRemove={onRemove} onMove={moveItem} onPreview={onPreview} onPreviewClose={onPreviewClose} />
                            ))}
                        </div>
                    </SortableContext>
                    <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
                        {draggedItem ? (
                            <div className="h-28 w-24 rotate-2 overflow-hidden rounded-2xl border-2 border-blue-500 bg-white shadow-2xl">
                                <img src={getImageSrc(draggedItem)} alt="" className="h-full w-full object-cover" />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
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
    audienceSegment,
    maxFinalSelection,
    title,
    description,
    selectedTitle,
    selectedDescription,
    contextImage,
    browserPresentation = "dialog",
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

            {browserPresentation === "inline" ? (
                <MediaBrowserDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    profile={profile}
                    audienceSegment={audienceSegment}
                    selectionMode="multiple"
                    selectedKeys={chosenItems.map((item) => item.key)}
                    disabledKeys={[
                        ...chosenItems.map((item) => item.key),
                        ...selectedItems.map((item) => item.key),
                    ]}
                    onSubmit={handleDialogSubmit}
                    submitLabel="Xác nhận ảnh đã chọn"
                    contextImage={contextImage}
                    enableRecycle={false}
                    presentation="inline"
                />
            ) : null}

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
                onReorder={onSelectedChange}
                onPreview={handlePreview}
                onPreviewClose={handlePreviewClose}
                title={selectedTitle}
                description={selectedDescription}
            />

            {browserPresentation === "dialog" ? <MediaBrowserDialog
                open={open}
                onClose={() => setOpen(false)}
                profile={profile}
                audienceSegment={audienceSegment}
                selectionMode="multiple"
                selectedKeys={chosenItems.map((item) => item.key)}
                disabledKeys={[
                    ...chosenItems.map((item) => item.key),
                    ...selectedItems.map((item) => item.key),
                ]}
                onSubmit={handleDialogSubmit}
                submitLabel="Xác nhận ảnh đã chọn"
                contextImage={contextImage}
                enableRecycle={false}
                presentation={browserPresentation}
            /> : null}
        </div>
    );
}
