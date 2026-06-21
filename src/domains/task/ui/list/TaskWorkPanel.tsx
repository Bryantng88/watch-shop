"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Check,
    ChevronDown,
    ExternalLink,
    PackageCheck,
    Trash2,
    Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TaskDomainActions from "../detail/TaskDomainActions";
import EntityLinkPicker from "@/domains/shared/ui/pickers/EntityLinkPicker";
import { searchWorkCaseLinkTargetsAction } from "@/domains/work-case/actions/work-case.actions";

type TaskLinkTargetType = "WATCH" | "ORDER" | "SHIPMENT" | "SERVICE";

const TASK_LINK_TARGET_MAP = {
    WATCH: "WATCH",
    ORDER: "ORDER",
    SHIPMENT: "SHIPMENT",
    SERVICE: "SERVICE_REQUEST",
} as const;

function taskLinkTargetLabel(type: TaskLinkTargetType) {
    if (type === "WATCH") return "Watch";
    if (type === "ORDER") return "Đơn hàng";
    if (type === "SHIPMENT") return "Vận đơn";
    return "Phiếu service";
}

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

function getTechnicalIssueTitle(item: any) {
    return (
        item.technicalIssue?.summary ||
        item.targetTitle ||
        item.targetRefNo ||
        item.targetCode ||
        item.targetId
    );
}

function businessStageTone(tone?: string | null) {
    if (tone === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (tone === "progress") return "bg-blue-50 text-blue-700 ring-blue-100";
    if (tone === "cancelled") return "bg-slate-100 text-slate-500 ring-slate-200";
    return "bg-amber-50 text-amber-700 ring-amber-100";
}

function getTechnicalIssueArea(item: any) {
    return item.technicalIssue?.area || "-";
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

function ChecklistRow({
    item,
    active,
    task,
    onToggleActive,
    onToggle,
    onDelete,
}: {
    item: any;
    active: boolean;
    task: any;
    onToggleActive: (item: any) => void;
    onToggle: (item: any) => Promise<void>;
    onDelete: (item: any) => Promise<void>;
}) {
    const [linkTargetType, setLinkTargetType] = useState<TaskLinkTargetType>("ORDER");
    const [linkTargetId, setLinkTargetId] = useState("");

    const itemExecutions = splitExecutions(item.executions ?? []);
    const hasExecutions = itemExecutions.grouped.length > 0;
    const canManualToggle = !hasExecutions;
    const done = hasExecutions
        ? itemExecutions.grouped.every(isBusinessDone)
        : Boolean(item.isDone);

    return (
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <button
                        type="button"
                        onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (!canManualToggle) return;
                            await onToggle(item);
                        }}
                        className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1",
                            done
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : hasExecutions
                                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                                    : "bg-white text-slate-300 ring-slate-300",
                            !canManualToggle ? "cursor-not-allowed" : "",
                        )}
                        title={
                            hasExecutions
                                ? "Dòng nghiệp vụ tự hoàn tất theo trạng thái nghiệp vụ"
                                : "Tick hoàn tất dòng xử lý"
                        }
                    >
                        {done ? <Check className="h-3.5 w-3.5" /> : null}
                    </button>

                    <div className="min-w-0 flex-1">
                        <div
                            className={cn(
                                "line-clamp-1 text-sm font-semibold",
                                done ? "text-slate-400 line-through" : "text-slate-950",
                            )}
                        >
                            {item.title}
                        </div>

                        <div className="mt-0.5 text-[11px] text-slate-400">
                            {hasExecutions
                                ? `${itemExecutions.grouped.length} link nghiệp vụ · ${done ? "Đã xong" : "Đang theo dõi"
                                }`
                                : item.assignedToUser
                                    ? `Giao cho ${item.assignedToUser.name || item.assignedToUser.email}`
                                    : "Dòng xử lý"}
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            if (hasExecutions) {
                                await onDelete(item);
                                return;
                            }

                            onToggleActive(item);
                        }}
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold",
                            active ? "bg-slate-950 text-white" : "text-blue-600 hover:bg-blue-50",
                        )}
                    >
                        {hasExecutions ? "Hủy link" : "Link nghiệp vụ"}
                        <ChevronDown
                            className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                active ? "rotate-180" : "",
                            )}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            await onDelete(item);
                        }}
                        className="rounded-full p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {active && !hasExecutions ? (
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <div className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)]">
                        <select
                            value={linkTargetType}
                            onChange={(event) => {
                                setLinkTargetType(event.target.value as TaskLinkTargetType);
                                setLinkTargetId("");
                            }}
                            className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                        >
                            <option value="WATCH">Watch</option>
                            <option value="ORDER">Đơn hàng</option>
                            <option value="SHIPMENT">Vận đơn</option>
                            <option value="SERVICE">Phiếu service</option>
                        </select>

                        <EntityLinkPicker
                            type={linkTargetType}
                            label={taskLinkTargetLabel(linkTargetType)}
                            value={linkTargetId}
                            onChange={(id) => setLinkTargetId(id ?? "")}
                            search={searchWorkCaseLinkTargetsAction}
                        />
                    </div>

                    {linkTargetId ? (
                        <div className="mt-3">
                            <TaskDomainActions
                                task={task}
                                checklistItemId={item.id}
                                mode="LINK_ONLY"
                                defaultTargetType={TASK_LINK_TARGET_MAP[linkTargetType]}
                                defaultTargetId={linkTargetId}
                                onDone={() => {
                                    setLinkTargetId("");
                                    onToggleActive(item);
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}

            {hasExecutions ? (
                <div className="mt-3 space-y-2">
                    <ExecutionGroup
                        serviceRequests={itemExecutions.serviceRequests}
                        technicalIssues={itemExecutions.technicalIssues}
                        otherExecutions={itemExecutions.otherExecutions}
                    />
                </div>
            ) : null}
        </div>
    );
}

function ExecutionRow({ item, children }: { item: any; children?: React.ReactNode }) {
    const href = targetHref(item.targetType, item.targetId);
    const status = getBusinessStatus(item);

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
                            Nghiệp vụ · {targetLabel(item.targetType)}
                        </div>
                    </div>
                </div>

                {href ? (
                    <Link
                        href={href}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                        Mở
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                ) : null}
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
                                {getTechnicalIssueTitle(ti)}
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
}: {
    serviceRequests: any[];
    technicalIssues: any[];
    otherExecutions: any[];
}) {
    return (
        <>
            {serviceRequests.map((sr) => (
                <ExecutionRow key={`${sr.targetType}:${sr.targetId}`} item={sr}>
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
                    }}
                >
                    <TechnicalIssueChildList items={technicalIssues} />
                </ExecutionRow>
            ) : null}

            {otherExecutions.map((item) => (
                <ExecutionRow key={`${item.targetType}:${item.targetId}`} item={item} />
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
    users = [],
}: {
    task: any;
    checklistItems?: any[];
    executions?: any[];
    users?: Array<{ id: string; name?: string | null; email?: string | null }>;
    onAddChecklistItem?: (input: {
        taskId: string;
        title: string;
        assignedToUserId?: string | null;
        priority?: string | null;
        dueAt?: string | null;
    }) => Promise<void> | void;
    onToggleChecklistItem?: (itemId: string, isDone: boolean) => Promise<void> | void;
    onDeleteChecklistItem?: (itemId: string) => Promise<void> | void;
}) {
    const [title, setTitle] = useState("");
    const [pending, setPending] = useState(false);
    const [localItems, setLocalItems] = useState(checklistItems);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueAt, setDueAt] = useState("");
    const [activeChecklistItemId, setActiveChecklistItemId] = useState<string | null>(null);

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
                assignedToUserId: selectedUserId || null,
                priority,
                dueAt: dueAt || null,
            });

            setTitle("");
            setSelectedUserId("");
            setPriority("MEDIUM");
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

        if (activeChecklistItemId === item.id) {
            setActiveChecklistItemId(null);
        }

        await onDeleteChecklistItem?.(item.id);
    }

    function toggleActiveChecklist(item: any) {
        setActiveChecklistItemId((current) => (current === item.id ? null : item.id));
    }

    return (
        <section
            className="border-y border-slate-100 bg-slate-50 px-3 py-4"
            onClick={(event) => event.stopPropagation()}
        >
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
                    className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
                />

                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                >
                    <option value="">Chưa giao</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name || user.email}
                        </option>
                    ))}
                </select>

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Vừa</option>
                    <option value="HIGH">Cao</option>
                    <option value="URGENT">Gấp</option>
                </select>

                <input
                    type="date"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
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

            <div className="space-y-2">
                {localItems.map((item) => (
                    <ChecklistRow
                        key={item.id}
                        item={item}
                        task={task}
                        active={activeChecklistItemId === item.id}
                        onToggleActive={toggleActiveChecklist}
                        onToggle={toggleItem}
                        onDelete={deleteItem}
                    />
                ))}

                <ExecutionGroup
                    serviceRequests={orphanExecutions.serviceRequests}
                    technicalIssues={orphanExecutions.technicalIssues}
                    otherExecutions={orphanExecutions.otherExecutions}
                />

                {!localItems.length &&
                    !orphanExecutions.serviceRequests.length &&
                    !orphanExecutions.technicalIssues.length &&
                    !orphanExecutions.otherExecutions.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">
                        Chưa có dòng xử lý hoặc nghiệp vụ nào.
                    </div>
                ) : null}
            </div>
        </section>
    );
}