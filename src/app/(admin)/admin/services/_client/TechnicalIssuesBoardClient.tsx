"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    PointerSensor,
    closestCorners,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Search, X } from "lucide-react";
import { useNotify } from "@/components/feedback/AppToastProvider";

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
    serviceRequestReadyToClose?: boolean;
    serviceRequestClosed?: boolean;
    isLastDoneIssueOfServiceRequest?: boolean;
    serviceRequest?: {
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
        priority?: string | null;
    } | null;
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

function scopeLabel(scope?: string | null) {
    const raw = String(scope || "").toUpperCase();
    if (raw === "WITH_PURCHASE") return "Kèm mua hàng";
    if (raw === "CUSTOMER_OWNED") return "Khách gửi";
    if (raw === "INTERNAL") return "Nội bộ";
    return scope || "-";
}

function priorityLabel(priority?: string | null) {
    const raw = String(priority || "").toUpperCase();
    if (raw === "URGENT") return "Ưu tiên gấp";
    if (raw === "HIGH") return "Ưu tiên cao";
    return "";
}

function priorityTone(priority?: string | null) {
    const raw = String(priority || "").toUpperCase();
    if (raw === "URGENT") return "border-rose-200 bg-rose-50 text-rose-700";
    if (raw === "HIGH") return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-stone-200 bg-stone-50 text-stone-600";
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
            wrap: "border-[#E7C873] bg-[#FFF9EA]",
            head: "text-[#8A6116]",
            badge: "border-[#E7C873] bg-white text-[#A56B00]",
            ring: "ring-[#E7C873]",
        };
    }
    if (key === "READY") {
        return {
            wrap: "border-[#BCD8F4] bg-[#F5FAFF]",
            head: "text-[#225B8F]",
            badge: "border-[#BCD8F4] bg-white text-[#2F75B5]",
            ring: "ring-[#9EC6EF]",
        };
    }
    if (key === "IN_PROGRESS") {
        return {
            wrap: "border-[#C9C4F5] bg-[#F8F6FF]",
            head: "text-[#5642A6]",
            badge: "border-[#C9C4F5] bg-white text-[#6A56C9]",
            ring: "ring-[#B4ACEF]",
        };
    }
    return {
        wrap: "border-[#BFE6C8] bg-[#F3FCF5]",
        head: "text-[#2E7D4A]",
        badge: "border-[#BFE6C8] bg-white text-[#329A59]",
        ring: "ring-[#9FD7AE]",
    };
}

function getAreaAccent(area?: string | null) {
    const raw = String(area || "").toUpperCase();

    if (raw === "MOVEMENT") {
        return {
            topBar: "bg-[#1F9D8B]",
            headerBg: "bg-[#F2FBF8]",
            chip: "border-[#BDE7DF] bg-[#E8F8F4] text-[#177A6C]",
        };
    }
    if (raw === "CASE") {
        return {
            topBar: "bg-[#C9862A]",
            headerBg: "bg-[#FFF8EF]",
            chip: "border-[#F0D1A5] bg-[#FFF0DA] text-[#9A6117]",
        };
    }
    if (raw === "CRYSTAL") {
        return {
            topBar: "bg-[#8A6FD1]",
            headerBg: "bg-[#F8F5FF]",
            chip: "border-[#D8CCF5] bg-[#F2ECFF] text-[#6850A9]",
        };
    }
    if (raw === "DIAL") {
        return {
            topBar: "bg-[#4DAA73]",
            headerBg: "bg-[#F3FBF6]",
            chip: "border-[#C7E7D1] bg-[#ECF9F0] text-[#347651]",
        };
    }
    if (raw === "CROWN") {
        return {
            topBar: "bg-[#D07C90]",
            headerBg: "bg-[#FFF6F8]",
            chip: "border-[#F1CCD7] bg-[#FDEEF2] text-[#A9576C]",
        };
    }

    return {
        topBar: "bg-[#8F8A83]",
        headerBg: "bg-[#FAF9F7]",
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

function normalizeText(v: unknown) {
    return String(v ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();
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

function FilterChip({
    active,
    children,
    onClick,
}: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full border px-3 py-1 text-xs transition ${active
                ? "border-stone-300 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
        >
            {children}
        </button>
    );
}

function ServiceRequestStateBadge({
    closed,
}: {
    closed?: boolean;
}) {
    return closed ? (
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
            SR đã đóng
        </span>
    ) : (
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
            SR sẵn sàng đóng
        </span>
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
    const sr = item?.serviceRequest ?? null;
    const srClosed = ["COMPLETED", "DELIVERED"].includes(String(sr?.status || "").toUpperCase());
    const accent = getAreaAccent(item.area);

    const imageSrc = sr?.primaryImageUrl
        ? `/api/media/sign?key=${encodeURIComponent(sr.primaryImageUrl)}`
        : null;

    return (
        <div
            className={`overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition ${dragging ? "rotate-[1.5deg] shadow-xl" : "hover:shadow-md"
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
                                if (sr?.id) onOpenServiceRequest?.();
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
                        <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${accent.chip}`}
                        >
                            {areaLabel(item.area)}
                        </span>
                        <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
                            {actionModeLabel(item.actionMode)}
                        </span>
                        <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
                            {statusLabel(item.executionStatus)}
                        </span>
                        {sr?.scope ? (
                            <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-700">
                                {scopeLabel(sr.scope)}
                            </span>
                        ) : null}
                        {sr?.priority ? (
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${priorityTone(sr.priority)}`}>
                                {priorityLabel(sr.priority)}
                            </span>
                        ) : null}
                        {srClosed ? <ServiceRequestStateBadge closed /> : item.serviceRequestReadyToClose ? <ServiceRequestStateBadge /> : null}
                    </div>

                    <div className="rounded-xl bg-stone-50 px-3 py-3">
                        <div className="text-[11px] uppercase tracking-wide text-stone-400">
                            Sản phẩm
                        </div>

                        <div className="mt-2 grid grid-cols-[1fr_72px] gap-3">
                            <div className="min-w-0">
                                <div className="line-clamp-2 text-sm font-semibold text-stone-900">
                                    {sr?.productTitle || "-"}
                                </div>
                                <div className="mt-1 text-xs text-stone-500">
                                    {sr?.refNo || "-"}
                                </div>
                            </div>

                            <div className="h-[72px] w-[72px] overflow-hidden rounded-xl border border-stone-200 bg-white">
                                {imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        alt={sr?.productTitle || "product"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                                        No image
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-slate-600">
                                SR đã đóng
                            </div>
                            <div className="mt-1 text-xl font-semibold text-slate-900">
                                {filteredCounts.closedSrCount}
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

function DraggableIssueCard({
    item,
    activeId,
    onOpen,
    onOpenServiceRequest,
}: {
    item: IssueItem;
    activeId: string | null;
    onOpen?: () => void;
    onOpenServiceRequest?: () => void;
}) {
    const { setNodeRef, transform, isDragging, attributes, listeners } =
        useDraggable({
            id: item.id,
            data: {
                type: "issue",
                issue: item,
                column: item.boardColumn,
            },
        });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: activeId === item.id ? 0 : 1,
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
    totalCount,
}: {
    column: { key: BoardColumnKey; title: string; subtitle: string };
    items: IssueItem[];
    isOver?: boolean;
    children: React.ReactNode;
    canLoadMore?: boolean;
    onLoadMore?: () => void;
    loadingMore?: boolean;
    totalCount?: number;
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
                    {totalCount ?? items.length}
                </span>
            </div>

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
        readyToCloseSrCount?: number;
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
    const notify = useNotify();
    const [cancelingIssueId, setCancelingIssueId] = React.useState<string | null>(null);
    const [query, setQuery] = React.useState("");
    const [areaFilter, setAreaFilter] = React.useState<string>("ALL");
    const [actionModeFilter, setActionModeFilter] = React.useState<string>("ALL");

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
            activationConstraint: { distance: 8 },
        })
    );

    const filteredItems = React.useMemo(() => {
        const q = normalizeText(query);

        return (boardItems ?? []).filter((item) => {
            const sr = item?.serviceRequest ?? null;

            const matchesQuery =
                !q ||
                [
                    item.summary,
                    item.note,
                    sr?.productTitle,
                    sr?.refNo,
                    item.vendorNameSnap,
                    sr?.technicianNameSnap,
                    areaLabel(item.area),
                    actionModeLabel(item.actionMode),
                ]
                    .map(normalizeText)
                    .some((x) => x.includes(q));

            const matchesArea =
                areaFilter === "ALL" ||
                String(item.area || "").toUpperCase() === areaFilter;

            const matchesActionMode =
                actionModeFilter === "ALL" ||
                String(item.actionMode || "").toUpperCase() === actionModeFilter;

            return matchesQuery && matchesArea && matchesActionMode;
        });
    }, [boardItems, query, areaFilter, actionModeFilter]);

    const grouped = React.useMemo(() => {
        const base: Record<BoardColumnKey, IssueItem[]> = {
            PENDING_CONFIRM: [],
            READY: [],
            IN_PROGRESS: [],
            DONE: [],
        };

        for (const item of filteredItems) {
            const key = (item.boardColumn || "PENDING_CONFIRM") as BoardColumnKey;
            base[key].push(item);
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
    }, [filteredItems, visibleCountByColumn]);

    const filteredCounts = React.useMemo(() => {
        const readyToCloseSrIds = Array.from(
            new Set(
                filteredItems
                    .filter((x) => x?.serviceRequestReadyToClose && x?.serviceRequest?.id)
                    .map((x) => x.serviceRequest!.id)
            )
        );
        const closedSrIds = Array.from(
            new Set(
                filteredItems
                    .filter((x) => ["COMPLETED", "DELIVERED"].includes(String(x?.serviceRequest?.status || "").toUpperCase()) && x?.serviceRequest?.id)
                    .map((x) => x.serviceRequest!.id)
            )
        );

        return {
            pendingConfirm: grouped.raw.PENDING_CONFIRM.length,
            ready: grouped.raw.READY.length,
            inProgress: grouped.raw.IN_PROGRESS.length,
            done: grouped.raw.DONE.length,
            readyToCloseSrCount: readyToCloseSrIds.length,
            closedSrCount: closedSrIds.length,
        };
    }, [grouped, filteredItems]);

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
        setActiveId(String(event.active.id));
    }

    function handleDragOver(event: DragOverEvent) {
        const overId = event.over?.id ? String(event.over.id) : null;

        if (
            overId === "PENDING_CONFIRM" ||
            overId === "READY" ||
            overId === "IN_PROGRESS" ||
            overId === "DONE"
        ) {
            setOverColumn(overId);
            return;
        }

        setOverColumn(null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const active = event.active;
        const over = event.over;

        if (!active || !over) {
            setActiveId(null);
            setOverColumn(null);
            return;
        }

        const issueId = String(active.id);
        const issue = boardItems.find((x) => x.id === issueId);

        if (!issue) {
            setActiveId(null);
            setOverColumn(null);
            return;
        }

        const targetColumn = String(over.id) as BoardColumnKey;

        if (
            targetColumn !== "PENDING_CONFIRM" &&
            targetColumn !== "READY" &&
            targetColumn !== "IN_PROGRESS" &&
            targetColumn !== "DONE"
        ) {
            setActiveId(null);
            setOverColumn(null);
            return;
        }

        const from = issue.boardColumn;
        const snapshot = [...boardItems];

        if (!canMove(from, targetColumn)) {
            setActiveId(null);
            setOverColumn(null);
            return;
        }

        optimisticMove(issueId, targetColumn);
        setActiveId(null);
        setOverColumn(null);

        if (from === "PENDING_CONFIRM" && targetColumn === "READY") {
            void callAction(issueId, "confirm", snapshot);
            return;
        }
        if (from === "READY" && targetColumn === "IN_PROGRESS") {
            void callAction(issueId, "start", snapshot);
            return;
        }
        if (from === "IN_PROGRESS" && targetColumn === "DONE") {
            void callAction(issueId, "complete", snapshot);
        }
    }
    async function handleCancelIssue(issueId: string) {
        try {
            setCancelingIssueId(issueId);

            const res = await fetch(`/api/admin/technical-issues/${issueId}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "Hủy issue từ Issue Board" }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.error || "Không thể hủy issue");
            }

            notify.success({
                title: "Đã hủy issue",
                message: "Issue đã được chuyển sang trạng thái hủy.",
            });

            router.refresh();
        } catch (error: any) {
            notify.error({
                title: "Hủy issue thất bại",
                message: error?.message || "Đã có lỗi xảy ra.",
            });
        } finally {
            setCancelingIssueId(null);
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

    function clearFilters() {
        setQuery("");
        setAreaFilter("ALL");
        setActionModeFilter("ALL");
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

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-amber-700">
                                Chờ xác nhận
                            </div>
                            <div className="mt-1 text-xl font-semibold text-amber-900">
                                {filteredCounts.pendingConfirm}
                            </div>
                        </div>
                        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-sky-700">
                                Đã xác nhận
                            </div>
                            <div className="mt-1 text-xl font-semibold text-sky-900">
                                {filteredCounts.ready}
                            </div>
                        </div>
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-indigo-700">
                                Đang xử lý
                            </div>
                            <div className="mt-1 text-xl font-semibold text-indigo-900">
                                {filteredCounts.inProgress}
                            </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-emerald-700">
                                Hoàn tất
                            </div>
                            <div className="mt-1 text-xl font-semibold text-emerald-900">
                                {filteredCounts.done}
                            </div>
                        </div>
                        <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-wide text-teal-700">
                                SR sẵn sàng đóng
                            </div>
                            <div className="mt-1 text-xl font-semibold text-teal-900">
                                {filteredCounts.readyToCloseSrCount}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="relative w-full max-w-xl">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Tìm theo sản phẩm, SR, issue, kỹ thuật viên, vendor..."
                                className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-10 text-sm outline-none focus:border-stone-400"
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <FilterChip active={areaFilter === "ALL"} onClick={() => setAreaFilter("ALL")}>
                                Tất cả khu vực
                            </FilterChip>
                            <FilterChip active={areaFilter === "MOVEMENT"} onClick={() => setAreaFilter("MOVEMENT")}>
                                Máy
                            </FilterChip>
                            <FilterChip active={areaFilter === "CASE"} onClick={() => setAreaFilter("CASE")}>
                                Vỏ
                            </FilterChip>
                            <FilterChip active={areaFilter === "CRYSTAL"} onClick={() => setAreaFilter("CRYSTAL")}>
                                Kính
                            </FilterChip>
                            <FilterChip active={areaFilter === "DIAL"} onClick={() => setAreaFilter("DIAL")}>
                                Mặt số
                            </FilterChip>
                            <FilterChip active={areaFilter === "CROWN"} onClick={() => setAreaFilter("CROWN")}>
                                Núm
                            </FilterChip>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <FilterChip
                            active={actionModeFilter === "ALL"}
                            onClick={() => setActionModeFilter("ALL")}
                        >
                            Tất cả thực hiện
                        </FilterChip>
                        <FilterChip
                            active={actionModeFilter === "INTERNAL"}
                            onClick={() => setActionModeFilter("INTERNAL")}
                        >
                            Nội bộ
                        </FilterChip>
                        <FilterChip
                            active={actionModeFilter === "VENDOR"}
                            onClick={() => setActionModeFilter("VENDOR")}
                        >
                            Vendor
                        </FilterChip>

                        {(query || areaFilter !== "ALL" || actionModeFilter !== "ALL") && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="ml-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600 hover:bg-stone-100"
                            >
                                Xóa filter
                            </button>
                        )}
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
                                    totalCount={rawCount}
                                >
                                    {columnItems.map((item) => (
                                        <DraggableIssueCard
                                            key={item.id}
                                            item={item}
                                            activeId={activeId}
                                            onOpen={() => setSelectedIssue(item)}
                                            onOpenServiceRequest={() => {
                                                if (item?.serviceRequest?.id) {
                                                    router.push(`/admin/services/${item.serviceRequest.id}`);
                                                }
                                            }}
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
                <IssueDrawer
                    issue={selectedIssue}
                    busyId={busyId}
                    actualCost={drawerState.actualCost}
                    resolutionNote={drawerState.resolutionNote}
                    onChangeActualCost={(value) =>
                        setDrawerState((prev) => ({ ...prev, actualCost: value }))
                    }
                    onChangeResolutionNote={(value) =>
                        setDrawerState((prev) => ({ ...prev, resolutionNote: value }))
                    }
                    onClose={() => setSelectedIssue(null)}
                    onAction={callAction}
                    onOpenServiceRequest={() => {
                        if (selectedIssue?.serviceRequest?.id) {
                            router.push(`/admin/services/${selectedIssue.serviceRequest.id}`);
                        }
                    }}
                    onCancelIssue={handleCancelIssue}
                    cancelingIssueId={cancelingIssueId}
                />
            )}
        </>
    );
}

function IssueDrawer({
    issue,
    busyId,
    actualCost,
    resolutionNote,
    onChangeActualCost,
    onChangeResolutionNote,
    onClose,
    onAction,
    onOpenServiceRequest,
    onCancelIssue,
    cancelingIssueId,
}: {
    issue: IssueItem;
    busyId: string | null;
    actualCost: string;
    resolutionNote: string;
    onChangeActualCost: (value: string) => void;
    onChangeResolutionNote: (value: string) => void;
    onClose: () => void;
    onAction: (
        issueId: string,
        action: "confirm" | "start" | "complete" | "cancel",
        rollback?: IssueItem[]
    ) => Promise<void>;
    onOpenServiceRequest: () => void;
    onCancelIssue: (issueId: string) => Promise<void>;
    cancelingIssueId: string | null;

}) {
    const sr = issue?.serviceRequest ?? null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-stone-950/35" onClick={onClose} />
            <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-stone-200 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 border-b border-stone-200 bg-white px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold text-stone-950">
                                {issue.summary || "Technical issue"}
                            </div>
                            <div className="mt-1 text-sm text-stone-500">
                                {sr?.productTitle || "-"} • {sr?.refNo || "-"}
                            </div>
                            {(["COMPLETED", "DELIVERED"].includes(String(issue.serviceRequest?.status || "").toUpperCase()) || issue.serviceRequestReadyToClose) ? (
                                <div className="mt-2">
                                    <ServiceRequestStateBadge closed={["COMPLETED", "DELIVERED"].includes(String(issue.serviceRequest?.status || "").toUpperCase())} />
                                </div>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            className="rounded-xl border border-stone-200 px-3 py-2 text-sm hover:bg-stone-50"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>

                <div className="space-y-5 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <DrawerField label="Khu vực" value={areaLabel(issue.area)} />
                        <DrawerField label="Thực hiện" value={actionModeLabel(issue.actionMode)} />
                        <DrawerField label="Trạng thái" value={statusLabel(issue.executionStatus)} />
                        <DrawerField
                            label="Xác nhận"
                            value={issue.isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                        />
                        <DrawerField label="Vendor" value={issue.vendorNameSnap || "-"} />
                        <DrawerField
                            label="Kỹ thuật viên"
                            value={sr?.technicianNameSnap || "-"}
                        />
                        <DrawerField
                            label="Chi phí dự kiến"
                            value={fmtMoney(issue.estimatedCost)}
                        />
                        <DrawerField
                            label="Chi phí thực tế"
                            value={fmtMoney(issue.actualCost)}
                        />
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="text-sm font-semibold text-stone-900">
                            Ghi chú kỹ thuật
                        </div>
                        <div className="mt-2 text-sm text-stone-600">
                            {issue.note || "Chưa có ghi chú."}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="text-sm font-semibold text-stone-900">Timeline</div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <Step label="Mở issue" value={fmtDT(issue.openedAt)} active />
                            <Step
                                label="Xác nhận"
                                value={fmtDT(issue.confirmedAt)}
                                active={Boolean(issue.confirmedAt)}
                            />
                            <Step
                                label="Bắt đầu"
                                value={fmtDT(issue.startedAt)}
                                active={Boolean(issue.startedAt)}
                            />
                            <Step
                                label="Hoàn tất"
                                value={fmtDT(issue.completedAt)}
                                active={Boolean(issue.completedAt)}
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
                                    value={actualCost}
                                    onChange={(e) => onChangeActualCost(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-400">
                                    Ghi chú hoàn tất / hủy
                                </label>
                                <textarea
                                    value={resolutionNote}
                                    onChange={(e) => onChangeResolutionNote(e.target.value)}
                                    className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                                    placeholder="Nhập kết quả xử lý, linh kiện đã thay, lưu ý sau xử lý..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-4">
                        <div className="flex flex-wrap gap-3">
                            {issue.boardColumn === "PENDING_CONFIRM" && (
                                <button
                                    type="button"
                                    disabled={busyId === issue.id}
                                    onClick={() => onAction(issue.id, "confirm")}
                                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                                >
                                    Xác nhận
                                </button>
                            )}

                            {issue.boardColumn === "READY" && (
                                <button
                                    type="button"
                                    disabled={busyId === issue.id}
                                    onClick={() => onAction(issue.id, "start")}
                                    className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:opacity-50"
                                >
                                    Bắt đầu
                                </button>
                            )}

                            {issue.boardColumn === "IN_PROGRESS" && (
                                <button
                                    type="button"
                                    disabled={busyId === issue.id}
                                    onClick={() => onAction(issue.id, "complete")}
                                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                    Hoàn tất
                                </button>
                            )}

                            {issue.boardColumn !== "DONE" && (
                                <button
                                    type="button"
                                    onClick={() => onCancelIssue(issue.id)}
                                    disabled={cancelingIssueId === issue.id}
                                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                >
                                    {cancelingIssueId === issue.id ? "Đang hủy..." : "Hủy issue"}
                                </button>
                            )}

                            <button
                                type="button"
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm hover:bg-stone-50"
                                onClick={onOpenServiceRequest}
                            >
                                Mở Service Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}