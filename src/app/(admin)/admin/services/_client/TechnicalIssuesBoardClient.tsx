"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    closestCorners,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type BoardColumnKey = "PENDING_CONFIRM" | "READY" | "IN_PROGRESS" | "DONE";

type IssueItem = {
    id: string;
    summary?: string | null;
    note?: string | null;
    area?: string | null;
    issueType?: string | null;
    actionMode?: string | null;
    executionStatus?: string | null;
    isConfirmed?: boolean | null;
    confirmedAt?: string | null;
    openedAt?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    canceledAt?: string | null;
    estimatedCost?: number | null;
    actualCost?: number | null;
    resolutionNote?: string | null;
    vendorId?: string | null;
    vendorNameSnap?: string | null;
    boardColumn: BoardColumnKey;
    serviceRequest: {
        id: string;
        refNo?: string | null;
        status?: string | null;
        scope?: string | null;
        technicianNameSnap?: string | null;
        vendorNameSnap?: string | null;
        productTitle?: string | null;
        primaryImageUrl?: string | null;
        movement?: string | null;
        model?: string | null;
        ref?: string | null;
    };
    assessment?: {
        id: string;
        status?: string | null;
    } | null;
    serviceCatalog?: { id: string; code?: string | null; name?: string | null } | null;
    supplyCatalog?: { id: string; code?: string | null; name?: string | null } | null;
    mechanicalPartCatalog?: { id: string; code?: string | null; name?: string | null } | null;
};

const COLUMNS: Array<{
    key: BoardColumnKey;
    title: string;
    subtitle: string;
}> = [
        {
            key: "PENDING_CONFIRM",
            title: "Chờ xác nhận",
            subtitle: "Issue mới mở từ phiếu kỹ thuật",
        },
        {
            key: "READY",
            title: "Đã xác nhận",
            subtitle: "Sẵn sàng đưa vào xử lý",
        },
        {
            key: "IN_PROGRESS",
            title: "Đang xử lý",
            subtitle: "Issue đang được thực hiện",
        },
        {
            key: "DONE",
            title: "Hoàn tất",
            subtitle: "Issue đã xử lý xong",
        },
    ];

function fmtDT(s?: string | null) {
    if (!s) return "-";
    const d = new Date(s);
    if (!Number.isFinite(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}

function fmtMoney(v?: number | null) {
    if (v == null || !Number.isFinite(Number(v))) return "0đ";
    return `${Number(v).toLocaleString("vi-VN")}đ`;
}

function areaLabel(area?: string | null) {
    const raw = String(area || "").toUpperCase();
    if (raw === "MOVEMENT") return "Máy";
    if (raw === "CASE") return "Vỏ";
    if (raw === "CRYSTAL") return "Kính";
    if (raw === "DIAL") return "Mặt số";
    if (raw === "CROWN") return "Núm";
    return raw || "-";
}

function actionModeLabel(mode?: string | null) {
    const raw = String(mode || "").toUpperCase();
    if (raw === "INTERNAL" || raw === "INHOUSE") return "Nội bộ";
    if (raw === "VENDOR") return "Vendor";
    return raw || "-";
}

function statusLabel(status?: string | null) {
    const raw = String(status || "").toUpperCase();
    if (raw === "OPEN") return "Đang mở";
    if (raw === "IN_PROGRESS") return "Đang xử lý";
    if (raw === "DONE" || raw === "COMPLETED") return "Hoàn tất";
    if (raw === "CANCELED" || raw === "CANCELLED") return "Đã hủy";
    return raw || "-";
}

function getColumnStyle(key: BoardColumnKey) {
    if (key === "PENDING_CONFIRM") {
        return {
            wrap: "border-amber-200 bg-[#fffaf0]",
            head: "text-amber-900",
            badge: "border-amber-200 bg-white text-amber-700",
            ring: "ring-amber-300",
        };
    }
    if (key === "READY") {
        return {
            wrap: "border-sky-200 bg-[#f4fbff]",
            head: "text-sky-900",
            badge: "border-sky-200 bg-white text-sky-700",
            ring: "ring-sky-300",
        };
    }
    if (key === "IN_PROGRESS") {
        return {
            wrap: "border-indigo-200 bg-[#f7f7ff]",
            head: "text-indigo-900",
            badge: "border-indigo-200 bg-white text-indigo-700",
            ring: "ring-indigo-300",
        };
    }
    return {
        wrap: "border-emerald-200 bg-[#f3fcf7]",
        head: "text-emerald-900",
        badge: "border-emerald-200 bg-white text-emerald-700",
        ring: "ring-emerald-300",
    };
}

function getAreaAccent(area?: string | null) {
    const raw = String(area || "").toUpperCase();

    if (raw === "MOVEMENT") {
        return {
            topBar: "bg-teal-500",
            headerBg: "bg-teal-50",
            chip: "border-teal-200 bg-teal-100 text-teal-700",
        };
    }
    if (raw === "CASE") {
        return {
            topBar: "bg-amber-500",
            headerBg: "bg-amber-50",
            chip: "border-amber-200 bg-amber-100 text-amber-700",
        };
    }
    if (raw === "CRYSTAL") {
        return {
            topBar: "bg-violet-500",
            headerBg: "bg-violet-50",
            chip: "border-violet-200 bg-violet-100 text-violet-700",
        };
    }
    if (raw === "DIAL") {
        return {
            topBar: "bg-emerald-500",
            headerBg: "bg-emerald-50",
            chip: "border-emerald-200 bg-emerald-100 text-emerald-700",
        };
    }
    if (raw === "CROWN") {
        return {
            topBar: "bg-rose-500",
            headerBg: "bg-rose-50",
            chip: "border-rose-200 bg-rose-100 text-rose-700",
        };
    }

    return {
        topBar: "bg-stone-400",
        headerBg: "bg-stone-50",
        chip: "border-stone-200 bg-stone-100 text-stone-700",
    };
}

function canMove(from: BoardColumnKey, to: BoardColumnKey) {
    if (from === to) return false;
    if (from === "PENDING_CONFIRM" && to === "READY") return true;
    if (from === "READY" && to === "IN_PROGRESS") return true;
    if (from === "IN_PROGRESS" && to === "DONE") return true;
    return false;
}

function DrawerField({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-stone-400">{label}</div>
            <div className="mt-1 text-sm font-medium text-stone-900">{value}</div>
        </div>
    );
}

function Step({
    label,
    value,
    active,
}: {
    label: string;
    value?: string | null;
    active?: boolean;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex flex-col items-center">
                <div
                    className={`h-3 w-3 rounded-full border ${active
                            ? "border-stone-900 bg-stone-900"
                            : "border-stone-300 bg-white"
                        }`}
                />
                <div className="mt-1 h-8 w-px bg-stone-200" />
            </div>
            <div>
                <div className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    {label}
                </div>
                <div className="mt-1 text-sm text-stone-700">{value || "-"}</div>
            </div>
        </div>
    );
}

function IssueCard({
    item,
    dragging,
    onOpen,
    onOpenServiceRequest,
    dragHandleProps,
}: {
    item: IssueItem;
    dragging?: boolean;
    onOpen?: () => void;
    onOpenServiceRequest?: () => void;
    dragHandleProps?: Record<string, any>;
}) {
    const accent = getAreaAccent(item.area);
    const imageSrc = item.serviceRequest.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(item.serviceRequest.primaryImageUrl)}`
        : null;

    return (
        <div
            className={`overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition ${dragging ? "opacity-80 shadow-xl" : "hover:shadow-md"
                }`}
        >
            <div className={`h-1.5 ${accent.topBar}`} />

            <div className={`border-b border-stone-200 ${accent.headerBg} px-4 py-3`}>
                <div className="flex items-start justify-between gap-3">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="min-w-0 flex-1 text-left"
                    >
                        <div className="line-clamp-1 text-sm font-semibold text-stone-900">
                            {item.summary || "Technical issue"}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-stone-600">
                            {item.note || "Chưa có ghi chú kỹ thuật."}
                        </div>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenServiceRequest?.();
                            }}
                            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
                        >
                            Mở phiếu
                        </button>

                        <button
                            type="button"
                            {...dragHandleProps}
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-grab rounded-lg border border-stone-200 bg-white px-2 py-1 text-stone-500 hover:bg-stone-50 active:cursor-grabbing"
                            aria-label="Kéo thả issue"
                            title="Kéo thả issue"
                        >
                            <GripVertical className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onOpen}
                className="block w-full text-left"
            >
                <div className="space-y-3 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${accent.chip}`}>
                            {areaLabel(item.area)}
                        </span>
                        <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
                            {actionModeLabel(item.actionMode)}
                        </span>
                        <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
                            {statusLabel(item.executionStatus)}
                        </span>
                    </div>

                    <div className="rounded-xl bg-stone-50 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-wide text-stone-400">
                            Sản phẩm
                        </div>

                        <div className="mt-2 grid grid-cols-[1fr_72px] gap-3">
                            <div className="min-w-0">
                                <div className="line-clamp-2 text-sm font-semibold text-stone-900">
                                    {item.serviceRequest.productTitle || "-"}
                                </div>
                                <div className="mt-1 text-xs text-stone-500">
                                    {item.serviceRequest.refNo}
                                </div>
                            </div>

                            <div className="h-[72px] w-[72px] overflow-hidden rounded-xl border border-stone-200 bg-white">
                                {imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        alt={item.serviceRequest.productTitle || "product"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                                        No image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl border border-stone-200 px-3 py-2">
                            <div className="text-stone-400">Mở lúc</div>
                            <div className="mt-1 font-medium text-stone-800">
                                {fmtDT(item.openedAt)}
                            </div>
                        </div>
                        <div className="rounded-xl border border-stone-200 px-3 py-2">
                            <div className="text-stone-400">Chi phí dự kiến</div>
                            <div className="mt-1 font-medium text-stone-800">
                                {fmtMoney(item.estimatedCost)}
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
}

function SortableIssueCard({
    item,
    onOpen,
    onOpenServiceRequest,
}: {
    item: IssueItem;
    onOpen?: () => void;
    onOpenServiceRequest?: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        data: {
            type: "issue",
            issue: item,
            column: item.boardColumn,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <IssueCard
                item={item}
                dragging={isDragging}
                onOpen={onOpen}
                onOpenServiceRequest={onOpenServiceRequest}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

function BoardColumn({
    column,
    items,
    isOver,
    children,
    canLoadMore,
    onLoadMore,
    loadingMore,
}: {
    column: { key: BoardColumnKey; title: string; subtitle: string };
    items: IssueItem[];
    isOver?: boolean;
    children: React.ReactNode;
    canLoadMore?: boolean;
    onLoadMore?: () => void;
    loadingMore?: boolean;
}) {
    const style = getColumnStyle(column.key);
    const { setNodeRef } = useDroppable({
        id: column.key,
        data: {
            type: "column",
            column: column.key,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`rounded-2xl border p-3 transition ${style.wrap} ${isOver ? `ring-2 ${style.ring}` : ""
                }`}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <div className={`text-sm font-semibold ${style.head}`}>
                        {column.title}
                    </div>
                    <div className="mt-1 text-xs text-stone-500">
                        {column.subtitle}
                    </div>
                </div>

                <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}
                >
                    {items.length}
                </span>
            </div>

            <SortableContext
                items={items.map((x) => x.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {items.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-stone-300 bg-white px-3 py-8 text-center text-sm text-stone-400">
                            Kéo thả issue vào đây
                        </div>
                    ) : (
                        <>
                            {children}

                            {canLoadMore ? (
                                <button
                                    type="button"
                                    onClick={onLoadMore}
                                    disabled={loadingMore}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                                >
                                    {loadingMore ? "Đang tải..." : "Tải thêm"}
                                </button>
                            ) : null}
                        </>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

export default function TechnicalIssueBoardClient({
    items,
    counts,
}: {
    items: IssueItem[];
    counts: {
        pendingConfirm: number;
        ready: number;
        inProgress: number;
        done: number;
    };
}) {
    const router = useRouter();
    const [boardItems, setBoardItems] = React.useState<IssueItem[]>(items ?? []);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [overColumn, setOverColumn] = React.useState<BoardColumnKey | null>(null);
    const [busyId, setBusyId] = React.useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = React.useState<IssueItem | null>(null);
    const [drawerState, setDrawerState] = React.useState({
        actualCost: "",
        resolutionNote: "",
    });

    const [visibleCountByColumn, setVisibleCountByColumn] = React.useState<
        Record<BoardColumnKey, number>
    >({
        PENDING_CONFIRM: 12,
        READY: 12,
        IN_PROGRESS: 12,
        DONE: 12,
    });

    const [loadingMoreColumn, setLoadingMoreColumn] =
        React.useState<BoardColumnKey | null>(null);

    React.useEffect(() => {
        setBoardItems(items ?? []);
    }, [items]);

    React.useEffect(() => {
        if (!selectedIssue) return;
        setDrawerState({
            actualCost:
                selectedIssue.actualCost != null &&
                    Number.isFinite(Number(selectedIssue.actualCost))
                    ? String(selectedIssue.actualCost)
                    : "",
            resolutionNote: selectedIssue.resolutionNote ?? "",
        });
    }, [selectedIssue]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const grouped = React.useMemo(() => {
        const base: Record<BoardColumnKey, IssueItem[]> = {
            PENDING_CONFIRM: [],
            READY: [],
            IN_PROGRESS: [],
            DONE: [],
        };

        for (const item of boardItems ?? []) {
            const key = (item.boardColumn || "PENDING_CONFIRM") as BoardColumnKey;
            if (base[key]) base[key].push(item);
        }

        return {
            PENDING_CONFIRM: base.PENDING_CONFIRM.slice(
                0,
                visibleCountByColumn.PENDING_CONFIRM
            ),
            READY: base.READY.slice(0, visibleCountByColumn.READY),
            IN_PROGRESS: base.IN_PROGRESS.slice(0, visibleCountByColumn.IN_PROGRESS),
            DONE: base.DONE.slice(0, visibleCountByColumn.DONE),
            raw: base,
        };
    }, [boardItems, visibleCountByColumn]);

    const activeItem = React.useMemo(
        () => boardItems.find((x) => x.id === activeId) ?? null,
        [boardItems, activeId]
    );

    async function callAction(
        issueId: string,
        action: "confirm" | "start" | "complete" | "cancel",
        rollback?: IssueItem[]
    ) {
        try {
            setBusyId(issueId);

            const endpoint =
                action === "confirm"
                    ? `/api/admin/technical-issues/${issueId}/confirm`
                    : action === "start"
                        ? `/api/admin/technical-issues/${issueId}/start`
                        : action === "complete"
                            ? `/api/admin/technical-issues/${issueId}/complete`
                            : `/api/admin/technical-issues/${issueId}/cancel`;

            const body =
                action === "complete"
                    ? {
                        actualCost:
                            drawerState.actualCost.trim() === ""
                                ? null
                                : Number(drawerState.actualCost),
                        resolutionNote: drawerState.resolutionNote.trim() || null,
                    }
                    : action === "cancel"
                        ? {
                            reason: drawerState.resolutionNote.trim() || null,
                        }
                        : {};

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (rollback) setBoardItems(rollback);
                alert(json?.error || "Không thể cập nhật issue");
                return;
            }

            router.refresh();
            setSelectedIssue(null);
        } finally {
            setBusyId(null);
            setActiveId(null);
            setOverColumn(null);
        }
    }

    function optimisticMove(issueId: string, targetColumn: BoardColumnKey) {
        setBoardItems((prev) =>
            prev.map((item) => {
                if (item.id !== issueId) return item;

                if (targetColumn === "READY") {
                    return {
                        ...item,
                        boardColumn: "READY",
                        isConfirmed: true,
                        confirmedAt: new Date().toISOString(),
                    };
                }
                if (targetColumn === "IN_PROGRESS") {
                    return {
                        ...item,
                        boardColumn: "IN_PROGRESS",
                        executionStatus: "IN_PROGRESS",
                        startedAt: new Date().toISOString(),
                    };
                }
                if (targetColumn === "DONE") {
                    return {
                        ...item,
                        boardColumn: "DONE",
                        executionStatus: "DONE",
                        completedAt: new Date().toISOString(),
                        actualCost:
                            drawerState.actualCost.trim() === ""
                                ? item.actualCost ?? null
                                : Number(drawerState.actualCost),
                        resolutionNote:
                            drawerState.resolutionNote.trim() || item.resolutionNote,
                    };
                }

                return item;
            })
        );
    }

    function handleDragStart(event: DragStartEvent) {
        const id = String(event.active.id);
        setActiveId(id);
    }

    function handleDragOver(event: any) {
        const overId = event.over?.id;
        if (!overId) {
            setOverColumn(null);
            return;
        }

        if (
            overId === "PENDING_CONFIRM" ||
            overId === "READY" ||
            overId === "IN_PROGRESS" ||
            overId === "DONE"
        ) {
            setOverColumn(overId);
            return;
        }

        const overIssue = boardItems.find((x) => x.id === String(overId));
        setOverColumn(overIssue?.boardColumn ?? null);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const active = event.active;
        const over = event.over;

        setActiveId(null);

        if (!active || !over) {
            setOverColumn(null);
            return;
        }

        const issueId = String(active.id);
        const issue = boardItems.find((x) => x.id === issueId);

        if (!issue) {
            setOverColumn(null);
            return;
        }

        let targetColumn: BoardColumnKey | null = null;
        const overId = String(over.id);

        if (
            overId === "PENDING_CONFIRM" ||
            overId === "READY" ||
            overId === "IN_PROGRESS" ||
            overId === "DONE"
        ) {
            targetColumn = overId;
        } else {
            const overIssue = boardItems.find((x) => x.id === overId);
            targetColumn = (overIssue?.boardColumn as BoardColumnKey) ?? null;
        }

        if (!targetColumn) {
            setOverColumn(null);
            return;
        }

        const from = issue.boardColumn;
        const snapshot = boardItems;

        if (!canMove(from, targetColumn)) {
            setOverColumn(null);
            return;
        }

        optimisticMove(issueId, targetColumn);
        setOverColumn(null);

        if (from === "PENDING_CONFIRM" && targetColumn === "READY") {
            await callAction(issueId, "confirm", snapshot);
            return;
        }
        if (from === "READY" && targetColumn === "IN_PROGRESS") {
            await callAction(issueId, "start", snapshot);
            return;
        }
        if (from === "IN_PROGRESS" && targetColumn === "DONE") {
            const moved = boardItems.find((x) => x.id === issueId);
            if (moved) {
                setSelectedIssue(moved);
            }
            await callAction(issueId, "complete", snapshot);
            return;
        }
    }

    function loadMore(column: BoardColumnKey) {
        setLoadingMoreColumn(column);

        setTimeout(() => {
            setVisibleCountByColumn((prev) => ({
                ...prev,
                [column]: prev[column] + 12,
            }));
            setLoadingMoreColumn(null);
        }, 250);
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-stone-950">
                            Technical Issue Board
                        </h1>
                        <p className="mt-1 text-sm text-stone-500">
                            Điều phối toàn bộ technical issue theo trạng thái vận hành.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-amber-700">
                                Chờ xác nhận
                            </div>
                            <div className="mt-1 text-xl font-semibold text-amber-900">
                                {counts.pendingConfirm ?? 0}
                            </div>
                        </div>
                        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-sky-700">
                                Đã xác nhận
                            </div>
                            <div className="mt-1 text-xl font-semibold text-sky-900">
                                {counts.ready ?? 0}
                            </div>
                        </div>
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-indigo-700">
                                Đang xử lý
                            </div>
                            <div className="mt-1 text-xl font-semibold text-indigo-900">
                                {counts.inProgress ?? 0}
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-emerald-700">
                                Hoàn tất
                            </div>
                            <div className="mt-1 text-xl font-semibold text-emerald-900">
                                {counts.done ?? 0}
                            </div>
                        </div>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid gap-4 xl:grid-cols-4">
                        {COLUMNS.map((column) => {
                            const columnItems = grouped[column.key] ?? [];
                            const rawCount = grouped.raw[column.key]?.length ?? 0;

                            return (
                                <BoardColumn
                                    key={column.key}
                                    column={column}
                                    items={columnItems}
                                    isOver={overColumn === column.key}
                                    canLoadMore={rawCount > columnItems.length}
                                    onLoadMore={() => loadMore(column.key)}
                                    loadingMore={loadingMoreColumn === column.key}
                                >
                                    {columnItems.map((item) => (
                                        <SortableIssueCard
                                            key={item.id}
                                            item={item}
                                            onOpen={() => setSelectedIssue(item)}
                                            onOpenServiceRequest={() =>
                                                router.push(`/admin/services/${item.serviceRequest.id}`)
                                            }
                                        />
                                    ))}
                                </BoardColumn>
                            );
                        })}
                    </div>

                    <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
                        {activeItem ? (
                            <div className="w-[360px] max-w-[90vw]">
                                <IssueCard
                                    item={activeItem}
                                    dragging
                                    onOpen={() => { }}
                                    onOpenServiceRequest={() => { }}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {selectedIssue && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-stone-950/35"
                        onClick={() => setSelectedIssue(null)}
                    />
                    <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-stone-200 bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 border-b border-stone-200 bg-white px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-lg font-semibold text-stone-950">
                                        {selectedIssue.summary || "Technical issue"}
                                    </div>
                                    <div className="mt-1 text-sm text-stone-500">
                                        {selectedIssue.serviceRequest.productTitle || "-"} •{" "}
                                        {selectedIssue.serviceRequest.refNo}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm hover:bg-stone-50"
                                    onClick={() => setSelectedIssue(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5 p-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <DrawerField
                                    label="Khu vực"
                                    value={areaLabel(selectedIssue.area)}
                                />
                                <DrawerField
                                    label="Thực hiện"
                                    value={actionModeLabel(selectedIssue.actionMode)}
                                />
                                <DrawerField
                                    label="Trạng thái"
                                    value={statusLabel(selectedIssue.executionStatus)}
                                />
                                <DrawerField
                                    label="Xác nhận"
                                    value={selectedIssue.isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                                />
                                <DrawerField
                                    label="Vendor"
                                    value={selectedIssue.vendorNameSnap || "-"}
                                />
                                <DrawerField
                                    label="Kỹ thuật viên"
                                    value={selectedIssue.serviceRequest.technicianNameSnap || "-"}
                                />
                                <DrawerField
                                    label="Chi phí dự kiến"
                                    value={fmtMoney(selectedIssue.estimatedCost)}
                                />
                                <DrawerField
                                    label="Chi phí thực tế"
                                    value={fmtMoney(selectedIssue.actualCost)}
                                />
                            </div>

                            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                <div className="text-sm font-semibold text-stone-900">
                                    Ghi chú kỹ thuật
                                </div>
                                <div className="mt-2 text-sm text-stone-600">
                                    {selectedIssue.note || "Chưa có ghi chú."}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                <div className="text-sm font-semibold text-stone-900">
                                    Timeline
                                </div>
                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    <Step
                                        label="Mở issue"
                                        value={fmtDT(selectedIssue.openedAt)}
                                        active
                                    />
                                    <Step
                                        label="Xác nhận"
                                        value={fmtDT(selectedIssue.confirmedAt)}
                                        active={Boolean(selectedIssue.confirmedAt)}
                                    />
                                    <Step
                                        label="Bắt đầu"
                                        value={fmtDT(selectedIssue.startedAt)}
                                        active={Boolean(selectedIssue.startedAt)}
                                    />
                                    <Step
                                        label="Hoàn tất"
                                        value={fmtDT(selectedIssue.completedAt)}
                                        active={Boolean(selectedIssue.completedAt)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                <div className="text-sm font-semibold text-stone-900">
                                    Cập nhật xử lý
                                </div>

                                <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                                            Chi phí thực tế
                                        </label>
                                        <input
                                            value={drawerState.actualCost}
                                            onChange={(e) =>
                                                setDrawerState((prev) => ({
                                                    ...prev,
                                                    actualCost: e.target.value,
                                                }))
                                            }
                                            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                                            Ghi chú hoàn tất / hủy
                                        </label>
                                        <textarea
                                            value={drawerState.resolutionNote}
                                            onChange={(e) =>
                                                setDrawerState((prev) => ({
                                                    ...prev,
                                                    resolutionNote: e.target.value,
                                                }))
                                            }
                                            className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                                            placeholder="Nhập kết quả xử lý, linh kiện đã thay, lưu ý sau xử lý..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-stone-200 bg-white p-4">
                                <div className="flex flex-wrap gap-3">
                                    {selectedIssue.boardColumn === "PENDING_CONFIRM" && (
                                        <button
                                            type="button"
                                            disabled={busyId === selectedIssue.id}
                                            onClick={() =>
                                                callAction(selectedIssue.id, "confirm")
                                            }
                                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                                        >
                                            Xác nhận
                                        </button>
                                    )}

                                    {selectedIssue.boardColumn === "READY" && (
                                        <button
                                            type="button"
                                            disabled={busyId === selectedIssue.id}
                                            onClick={() =>
                                                callAction(selectedIssue.id, "start")
                                            }
                                            className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:opacity-50"
                                        >
                                            Bắt đầu
                                        </button>
                                    )}

                                    {selectedIssue.boardColumn === "IN_PROGRESS" && (
                                        <button
                                            type="button"
                                            disabled={busyId === selectedIssue.id}
                                            onClick={() =>
                                                callAction(selectedIssue.id, "complete")
                                            }
                                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                        >
                                            Hoàn tất
                                        </button>
                                    )}

                                    {selectedIssue.boardColumn !== "DONE" && (
                                        <button
                                            type="button"
                                            disabled={busyId === selectedIssue.id}
                                            onClick={() =>
                                                callAction(selectedIssue.id, "cancel")
                                            }
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                                        >
                                            Hủy issue
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm hover:bg-stone-50"
                                        onClick={() =>
                                            router.push(
                                                `/admin/services/${selectedIssue.serviceRequest.id}`
                                            )
                                        }
                                    >
                                        Mở Service Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}