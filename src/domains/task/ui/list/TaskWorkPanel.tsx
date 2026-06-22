"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Ban,
    Check,
    PackageCheck,
    Settings2,
    Wrench,
} from "lucide-react";
import { TaskPriority } from "@prisma/client";
import { cn } from "@/lib/utils";
import SubtaskManageModal from "./SubtaskManageModal";
import {
    BusinessEntityPreviewModal,
    useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";

function targetLabel(type: string) {
    if (type === "SERVICE_REQUEST") return "Service Request";
    if (type === "TECHNICAL_ISSUE") return "Technical Issue";
    if (type === "ORDER") return "Order";
    if (type === "SHIPMENT") return "Shipment";
    if (type === "PAYMENT") return "Payment";
    if (type === "WATCH") return "Watch";
    if (type === "WORK_CASE") return "Phiếu xử lý";
    if (type === "ACQUISITION") return "Acquisition";
    return type || "Nghiệp vụ";
}

function targetHref(type: string, id: string) {
    if (type === "SERVICE_REQUEST") return `/admin/service/${id}`;
    if (type === "TECHNICAL_ISSUE") return `/admin/service/issues?issueId=${id}`;
    if (type === "ORDER") return `/admin/orders/${id}`;
    if (type === "SHIPMENT") return `/admin/shipments/${id}`;
    if (type === "PAYMENT") return `/admin/payments`;
    if (type === "WATCH") return `/admin/watches/${id}`;
    if (type === "WORK_CASE") return `/admin/work-cases/${id}`;
    if (type === "ACQUISITION") return `/admin/acquisitions/${id}`;
    return null;
}

function getExecutionTitle(item: any) {
    if (item.targetType === "TECHNICAL_ISSUE") {
        return (
            item.technicalIssue?.summary ||
            item.targetTitle ||
            item.targetRefNo ||
            item.targetCode ||
            item.targetId
        );
    }

    if (item.targetType === "SERVICE_REQUEST") {
        return (
            item.serviceRequest?.refNo ||
            item.targetRefNo ||
            item.targetCode ||
            item.targetTitle ||
            item.targetId
        );
    }

    return (
        item.targetRefNo ||
        item.targetCode ||
        item.targetTitle ||
        item.refNo ||
        item.targetId
    );
}

function businessStageTone(tone?: string | null) {
    if (tone === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (tone === "progress") return "bg-blue-50 text-blue-700 ring-blue-100";
    if (tone === "cancelled") return "bg-slate-100 text-slate-500 ring-slate-200";
    return "bg-amber-50 text-amber-700 ring-amber-100";
}

function getBusinessStatus(item: any) {
    return (
        item.businessStageLabel ||
        item.targetStatus ||
        item.status ||
        item.actionType ||
        "-"
    );
}

function isBusinessDone(item: any) {
    return Boolean(item.isBusinessDone);
}

function statusTone(status: string) {
    const value = String(status || "").toUpperCase();

    if (["DONE", "COMPLETED", "DELIVERED", "PAID", "CREATED"].includes(value)) {
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    }

    if (["IN_PROGRESS", "PROCESSING", "LINKED", "UPDATED"].includes(value)) {
        return "bg-blue-50 text-blue-700 ring-blue-100";
    }

    if (["CONFIRMED", "READY", "OPEN"].includes(value)) {
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }

    if (["CANCELLED", "CANCELED"].includes(value)) {
        return "bg-slate-100 text-slate-500 ring-slate-200";
    }

    return "bg-slate-50 text-slate-600 ring-slate-200";
}

function groupByTarget(items: any[]) {
    const map = new Map<string, any>();

    for (const item of items) {
        const key = `${item.targetType}:${item.targetId}`;

        if (!map.has(key)) {
            map.set(key, {
                ...item,
                events: [item],
                latestAt: item.createdAt,
            });
            continue;
        }

        const group = map.get(key);
        group.events.push(item);

        if (new Date(item.createdAt).getTime() > new Date(group.latestAt).getTime()) {
            group.latestAt = item.createdAt;
            group.actionType = item.actionType;
            group.note = item.note;
            group.targetStatus = item.targetStatus;
            group.status = item.status;
            group.serviceRequest = item.serviceRequest ?? group.serviceRequest;
            group.technicalIssue = item.technicalIssue ?? group.technicalIssue;
            group.metadataJson = item.metadataJson ?? group.metadataJson;
        }
    }

    return Array.from(map.values()).sort(
        (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
    );
}

function splitExecutions(executions: any[]) {
    const grouped = groupByTarget(executions);

    return {
        grouped,
        serviceRequests: grouped.filter((x) => x.targetType === "SERVICE_REQUEST"),
        technicalIssues: grouped.filter((x) => x.targetType === "TECHNICAL_ISSUE"),
        otherExecutions: grouped.filter(
            (x) => x.targetType !== "SERVICE_REQUEST" && x.targetType !== "TECHNICAL_ISSUE",
        ),
    };
}

function isTrackingExecution(execution: any) {
    return execution?.metadataJson?.linkMode === "TRACKING";
}

function executionModeLabel(execution: any) {
    return isTrackingExecution(execution) ? "Theo dõi" : "Thông tin";
}

function executionPreviewType(targetType: string): BusinessEntityPreview["type"] {
    if (targetType === "SERVICE_REQUEST") return "SERVICE";
    return targetType as BusinessEntityPreview["type"];
}

function executionToPreview(item: any): BusinessEntityPreview {
    return {
        type: executionPreviewType(item.targetType),
        id: item.targetId,
        refNo: item.targetRefNo || null,
        title: getExecutionTitle(item),
        subtitle: `${executionModeLabel(item)} · ${targetLabel(item.targetType)}`,
        status: item.targetStatus || item.businessStage || null,
        href: targetHref(item.targetType, item.targetId),
    } as BusinessEntityPreview;
}

function ExecutionMiniInline({
    item,
    onPreview,
}: {
    item: any;
    onPreview: (preview: BusinessEntityPreview) => void;
}) {
    const status = getBusinessStatus(item);

    return (
        <div className="flex h-11 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-3">
            <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    {item.targetType === "SERVICE_REQUEST" || item.targetType === "TECHNICAL_ISSUE" ? (
                        <Wrench className="h-3.5 w-3.5" />
                    ) : (
                        <PackageCheck className="h-3.5 w-3.5" />
                    )}
                </span>

                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <div className="line-clamp-1 text-xs font-semibold text-slate-800">
                            {getExecutionTitle(item)}
                        </div>


                    </div>

                    <div className="text-[11px] text-slate-400">
                        {targetLabel(item.targetType)}
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <span
                    className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                        item.businessStageTone
                            ? businessStageTone(item.businessStageTone)
                            : statusTone(status),
                    )}
                >
                    {status}
                </span>

                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onPreview(executionToPreview(item));
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                >
                    Mở
                </button>
            </div>
        </div>
    );
}

function ChecklistRow({
    item,
    task,
    canCancel = true,
    onManage,
    onToggle,
    onDelete,
    onPreview,
}: {
    item: any;
    task: any;
    canCancel?: boolean;
    onManage: (item: any) => void;
    onToggle: (item: any) => Promise<void>;
    onDelete: (item: any) => Promise<void>;
    onPreview: (preview: BusinessEntityPreview) => void;
}) {
    const itemExecutions = splitExecutions(item.executions ?? []);
    const hasExecutions = itemExecutions.grouped.length > 0;
    const trackingExecutions = itemExecutions.grouped.filter(isTrackingExecution);

    const done = trackingExecutions.length
        ? trackingExecutions.every(isBusinessDone)
        : Boolean(item.isDone);

    return (
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <button
                        type="button"
                        onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            if (trackingExecutions.length) return;
                            await onToggle(item);
                        }}
                        className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1",
                            done
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : trackingExecutions.length
                                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                                    : "bg-white text-slate-300 ring-slate-300",
                            trackingExecutions.length ? "cursor-not-allowed" : "",
                        )}
                        title={
                            trackingExecutions.length
                                ? "Dòng này tự hoàn tất theo nghiệp vụ đang theo dõi"
                                : done
                                    ? "Bỏ hoàn thành"
                                    : "Tick hoàn tất dòng xử lý"
                        }
                    >
                        {done ? <Check className="h-3.5 w-3.5" /> : null}
                    </button>

                    <div className="min-w-0 w-[280px] shrink-0">
                        <div
                            className={cn(
                                "line-clamp-1 text-sm font-semibold",
                                done ? "text-slate-400 line-through" : "text-slate-950",
                            )}
                        >
                            {item.title}
                        </div>

                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                            <span>
                                {hasExecutions
                                    ? `${itemExecutions.grouped.length} link nghiệp vụ`
                                    : item.assignedToUser
                                        ? `Giao cho ${item.assignedToUser.name || item.assignedToUser.email}`
                                        : "Dòng xử lý"}
                            </span>

                            {hasExecutions ? (
                                <>
                                    <span>·</span>
                                    <span
                                        className={cn(
                                            "font-semibold",
                                            trackingExecutions.length ? "text-blue-500" : "text-slate-500",
                                        )}
                                    >
                                        {trackingExecutions.length ? "Theo dõi" : "Thông tin"}
                                    </span>
                                </>
                            ) : null}

                            {item.dueAt ? (
                                <>
                                    <span>·</span>
                                    <span>Due {new Date(item.dueAt).toLocaleDateString("vi-VN")}</span>
                                </>
                            ) : null}
                        </div>
                    </div>

                    {hasExecutions ? (
                        <div className="min-w-0 flex-1 border-l border-slate-200 pl-3">
                            <ExecutionMiniInline
                                item={itemExecutions.grouped[0]}
                                onPreview={onPreview}
                            />
                        </div>
                    ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        title="Quản lý subtask"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onManage(item);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50"
                    >
                        <Settings2 className="h-4 w-4" />
                    </button>

                    {canCancel ? (
                        <button
                            type="button"
                            title="Hủy subtask"
                            onClick={async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                await onDelete(item);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-rose-600 hover:bg-rose-50"
                        >
                            <Ban className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function ExecutionRow({
    item,
    children,
    onPreview,
}: {
    item: any;
    children?: React.ReactNode;
    onPreview: (preview: BusinessEntityPreview) => void;
}) {
    const status = getBusinessStatus(item);
    const tracking = isTrackingExecution(item);

    return (
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                        {item.targetType === "SERVICE_REQUEST" || item.targetType === "TECHNICAL_ISSUE" ? (
                            <Wrench className="h-3.5 w-3.5" />
                        ) : (
                            <PackageCheck className="h-3.5 w-3.5" />
                        )}
                    </span>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-950">
                                {getExecutionTitle(item)}
                            </span>

                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                                    tracking
                                        ? "bg-blue-50 text-blue-700 ring-blue-100"
                                        : "bg-slate-50 text-slate-500 ring-slate-200",
                                )}
                            >
                                {tracking ? "Theo dõi" : "Thông tin"}
                            </span>

                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                                    item.businessStageTone
                                        ? businessStageTone(item.businessStageTone)
                                        : statusTone(status),
                                )}
                            >
                                {status}
                            </span>
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                            {targetLabel(item.targetType)}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onPreview(executionToPreview(item));
                    }}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                    Mở
                </button>
            </div>

            {children ? <div className="mt-3">{children}</div> : null}
        </div>
    );
}

function TechnicalIssueChildList({ items }: { items: any[] }) {
    if (!items.length) return null;

    return (
        <div className="space-y-2 border-l border-slate-200 pl-4">
            {items.map((ti) => {
                const status = getBusinessStatus(ti);

                return (
                    <div
                        key={`${ti.targetType}:${ti.targetId}`}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"
                    >
                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-800">
                                {getExecutionTitle(ti)}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-400">
                                Khu vực: {ti.technicalIssue?.area || "-"}
                            </div>
                        </div>

                        <span
                            className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                                ti.businessStageTone
                                    ? businessStageTone(ti.businessStageTone)
                                    : statusTone(status),
                            )}
                        >
                            {status}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function ExecutionGroup({
    serviceRequests,
    technicalIssues,
    otherExecutions,
    onPreview,
}: {
    serviceRequests: any[];
    technicalIssues: any[];
    otherExecutions: any[];
    onPreview: (preview: BusinessEntityPreview) => void;
}) {
    return (
        <>
            {serviceRequests.map((sr) => (
                <ExecutionRow
                    key={`${sr.targetType}:${sr.targetId}`}
                    item={sr}
                    onPreview={onPreview}
                >
                    <TechnicalIssueChildList items={technicalIssues} />
                </ExecutionRow>
            ))}

            {!serviceRequests.length && technicalIssues.length ? (
                <ExecutionRow
                    item={{
                        targetType: "SERVICE_REQUEST",
                        targetId: "technical-issues",
                        targetTitle: "Technical Issues",
                        targetStatus: "UPDATED",
                        metadataJson: { linkMode: "TRACKING" },
                    }}
                    onPreview={onPreview}
                >
                    <TechnicalIssueChildList items={technicalIssues} />
                </ExecutionRow>
            ) : null}

            {otherExecutions.map((item) => (
                <ExecutionRow
                    key={`${item.targetType}:${item.targetId}`}
                    item={item}
                    onPreview={onPreview}
                />
            ))}
        </>
    );
}

export default function TaskWorkPanel({
    task,
    checklistItems = [],
    executions = [],
    onAddChecklistItem,
    onToggleChecklistItem,
    onDeleteChecklistItem,
    onUpdateChecklistItem,
    users = [],
    canAddChecklistItem = true,
    canCancelChecklistItem = true,
}: {
    task: any;
    checklistItems?: any[];
    executions?: any[];
    users?: Array<{ id: string; name?: string | null; email?: string | null }>;
    canAddChecklistItem?: boolean;
    canCancelChecklistItem?: boolean;
    onAddChecklistItem?: (input: {
        taskId: string;
        title: string;
        assignedToUserId?: string | null;
        priority?: TaskPriority | null;
        dueAt?: string | null;
    }) => Promise<void> | void;
    onUpdateChecklistItem?: (input: {
        itemId: string;
        title: string;
        assignedToUserId?: string | null;
        priority?: TaskPriority | null;
        dueAt?: string | null;
    }) => Promise<void> | void;
    onToggleChecklistItem?: (itemId: string, isDone: boolean) => Promise<void> | void;
    onDeleteChecklistItem?: (itemId: string) => Promise<void> | void;
}) {
    const previewState = useBusinessEntityPreview();

    const [title, setTitle] = useState("");
    const [pending, setPending] = useState(false);
    const [localItems, setLocalItems] = useState(checklistItems);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [dueAt, setDueAt] = useState("");
    const [managingItem, setManagingItem] = useState<any | null>(null);

    useEffect(() => {
        setLocalItems(checklistItems);
    }, [checklistItems]);

    const orphanExecutions = useMemo(
        () => splitExecutions(executions.filter((x) => !x.checklistItemId)),
        [executions],
    );

    async function submit() {
        const clean = title.trim();
        if (!clean || pending) return;

        try {
            setPending(true);

            await onAddChecklistItem?.({
                taskId: task.id,
                title: clean,
                assignedToUserId:
                    selectedUserId || task.assignedToUserId || task.createdByUserId || null,
                priority,
                dueAt: dueAt || null,
            });

            setTitle("");
            setSelectedUserId("");
            setPriority(TaskPriority.MEDIUM);
            setDueAt("");
        } finally {
            setPending(false);
        }
    }

    async function toggleItem(item: any) {
        const nextDone = !item.isDone;

        setLocalItems((prev) =>
            prev.map((x) => (x.id === item.id ? { ...x, isDone: nextDone } : x)),
        );

        await onToggleChecklistItem?.(item.id, nextDone);
    }

    async function deleteItem(item: any) {
        setLocalItems((prev) => prev.filter((x) => x.id !== item.id));

        if (managingItem?.id === item.id) {
            setManagingItem(null);
        }

        await onDeleteChecklistItem?.(item.id);
    }

    async function updateItem(input: {
        itemId: string;
        title: string;
        assignedToUserId?: string | null;
        priority?: TaskPriority | null;
        dueAt?: string | null;
    }) {
        setLocalItems((prev) =>
            prev.map((item) =>
                item.id === input.itemId
                    ? {
                        ...item,
                        title: input.title,
                        assignedToUserId: input.assignedToUserId ?? null,
                        priority: input.priority ?? item.priority,
                        dueAt: input.dueAt ?? null,
                    }
                    : item,
            ),
        );

        await onUpdateChecklistItem?.(input);
    }

    return (
        <section
            className="border-y border-l-4 border-slate-200 border-l-slate-400 bg-slate-100 px-4 py-4"
            onClick={(event) => event.stopPropagation()}
        >
            {canAddChecklistItem ? (
                <div className="mb-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_180px_140px_150px_80px]">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                submit();
                            }
                        }}
                        placeholder="Thêm subtask..."
                        className="h-10 rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-slate-400"
                    />

                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="h-10 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    >
                        <option value="">Tự giao</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.email}
                            </option>
                        ))}
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        className="h-10 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    >
                        <option value={TaskPriority.LOW}>Thấp</option>
                        <option value={TaskPriority.MEDIUM}>Vừa</option>
                        <option value={TaskPriority.HIGH}>Cao</option>
                        <option value={TaskPriority.URGENT}>Gấp</option>
                    </select>

                    <input
                        type="date"
                        value={dueAt}
                        onChange={(e) => setDueAt(e.target.value)}
                        className="h-10 rounded-2xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    />

                    <button
                        type="button"
                        disabled={pending || !title.trim()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            submit();
                        }}
                        className="h-10 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                    >
                        Thêm
                    </button>
                </div>
            ) : null}

            <div className="space-y-2">
                {localItems.map((item) => (
                    <ChecklistRow
                        key={item.id}
                        item={item}
                        task={task}
                        canCancel={canCancelChecklistItem}
                        onManage={setManagingItem}
                        onToggle={toggleItem}
                        onDelete={deleteItem}
                        onPreview={previewState.openPreview}
                    />
                ))}

                <ExecutionGroup
                    serviceRequests={orphanExecutions.serviceRequests}
                    technicalIssues={orphanExecutions.technicalIssues}
                    otherExecutions={orphanExecutions.otherExecutions}
                    onPreview={previewState.openPreview}
                />

                {!localItems.length &&
                    !orphanExecutions.serviceRequests.length &&
                    !orphanExecutions.technicalIssues.length &&
                    !orphanExecutions.otherExecutions.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-400">
                        Chưa có dòng xử lý hoặc nghiệp vụ nào.
                    </div>
                ) : null}
            </div>

            <SubtaskManageModal
                open={Boolean(managingItem)}
                task={task}
                item={managingItem}
                users={users}
                canEdit={canAddChecklistItem}
                onClose={() => setManagingItem(null)}
                onSave={updateItem}
                onLinked={() => setManagingItem(null)}
            />

            <BusinessEntityPreviewModal
                open={previewState.open}
                preview={previewState.preview}
                loading={previewState.loading}
                error={previewState.error}
                onClose={previewState.closePreview}
            />
        </section>
    );
}