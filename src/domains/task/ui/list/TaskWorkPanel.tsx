"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Check,
    ExternalLink,
    PackageCheck,
    Trash2,
    Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

function targetLabel(type: string) {
    if (type === "SERVICE_REQUEST") return "Service Request";
    if (type === "TECHNICAL_ISSUE") return "Technical Issue";
    if (type === "ORDER") return "Order";
    if (type === "SHIPMENT") return "Shipment";
    if (type === "PAYMENT") return "Payment";
    if (type === "WATCH") return "Watch";
    if (type === "WORK_CASE") return "Phiếu xử lý";
    return type || "Nghiệp vụ";
}

function targetHref(type: string, id: string) {
    if (type === "SERVICE_REQUEST") return `/admin/services/${id}`;
    if (type === "ORDER") return `/admin/orders/${id}`;
    if (type === "SHIPMENT") return `/admin/shipments/${id}`;
    if (type === "PAYMENT") return `/admin/payments`;
    if (type === "WATCH") return `/admin/watches/${id}`;
    if (type === "WORK_CASE") return `/admin/work-cases/${id}`;
    return null;
}

function getExecutionTitle(item: any) {
    return (
        item.targetRefNo ||
        item.targetCode ||
        item.targetTitle ||
        item.refNo ||
        item.targetId
    );
}

function getExecutionStatus(item: any) {
    return item.targetStatus || item.status || item.actionType || "-";
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
        }
    }

    return Array.from(map.values()).sort(
        (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
    );
}

function WorkItemBadge({
    children,
    tone = "default",
}: {
    children: React.ReactNode;
    tone?: "default" | "blue";
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                tone === "blue"
                    ? "bg-blue-50 text-blue-700 ring-blue-100"
                    : "bg-white text-slate-700 ring-slate-200",
            )}
        >
            {children}
        </span>
    );
}

function ChecklistRow({
    item,
    onToggle,
    onDelete,
}: {
    item: any;
    onToggle: (item: any) => Promise<void>;
    onDelete: (item: any) => Promise<void>;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await onToggle(item);
                    }}
                    className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1",
                        item.isDone
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-white text-slate-300 ring-slate-300",
                    )}
                >
                    {item.isDone ? <Check className="h-3.5 w-3.5" /> : null}
                </button>

                <div className="min-w-0">
                    <div
                        className={cn(
                            "line-clamp-1 font-semibold",
                            item.isDone ? "text-slate-400 line-through" : "text-slate-950",
                        )}
                    >
                        {item.title}
                    </div>

                    <div className="mt-1 text-xs text-slate-400">
                        Dòng xử lý · {item.isDone ? "Đã xong" : "Chưa xong"}
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await onDelete(item);
                }}
                className="shrink-0 rounded-full p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

function ExecutionRow({
    item,
    children,
}: {
    item: any;
    children?: React.ReactNode;
}) {
    const href = targetHref(item.targetType, item.targetId);
    const status = getExecutionStatus(item);

    return (
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                        {item.targetType === "SERVICE_REQUEST" ? (
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
                                    statusTone(status),
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
                        onClick={(e) => e.stopPropagation()}
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
                const status = getExecutionStatus(ti);

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
                                Technical Issue
                            </div>
                        </div>

                        <span
                            className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                                statusTone(status),
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

export default function TaskWorkPanel({
    task,
    checklistItems = [],
    executions = [],
    onAddChecklistItem,
    onToggleChecklistItem,
    onDeleteChecklistItem,
}: {
    task: any;
    checklistItems?: any[];
    executions?: any[];
    onAddChecklistItem?: (task: any, title: string) => Promise<void> | void;
    onToggleChecklistItem?: (itemId: string, isDone: boolean) => Promise<void> | void;
    onDeleteChecklistItem?: (itemId: string) => Promise<void> | void;
}) {
    const [title, setTitle] = useState("");
    const [pending, setPending] = useState(false);
    const [localItems, setLocalItems] = useState(checklistItems);

    useEffect(() => {
        setLocalItems(checklistItems);
    }, [checklistItems]);

    const orphanExecutions = useMemo(
        () => groupByTarget(executions.filter((x) => !x.checklistItemId)),
        [executions],
    );

    const serviceRequests = orphanExecutions.filter(
        (x) => x.targetType === "SERVICE_REQUEST",
    );

    const technicalIssues = orphanExecutions.filter(
        (x) => x.targetType === "TECHNICAL_ISSUE",
    );

    const otherExecutions = orphanExecutions.filter(
        (x) => x.targetType !== "SERVICE_REQUEST" && x.targetType !== "TECHNICAL_ISSUE",
    );

    async function submit() {
        const clean = title.trim();
        if (!clean || pending) return;

        try {
            setPending(true);
            await onAddChecklistItem?.(task, clean);
            setTitle("");
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
        await onDeleteChecklistItem?.(item.id);
    }

    return (
        <section
            className="border-y border-slate-100 bg-slate-50 px-3 py-4"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-3 flex items-center gap-2">
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
                    placeholder="Thêm dòng xử lý..."
                    className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
                />

                <button
                    type="button"
                    disabled={pending || !title.trim()}
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await submit();
                    }}
                    className="h-10 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Thêm
                </button>
            </div>

            <div className="space-y-2">
                {localItems.map((item) => (
                    <ChecklistRow
                        key={item.id}
                        item={item}
                        onToggle={toggleItem}
                        onDelete={deleteItem}
                    />
                ))}

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

                {!localItems.length &&
                    !serviceRequests.length &&
                    !technicalIssues.length &&
                    !otherExecutions.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">
                        Chưa có dòng xử lý hoặc nghiệp vụ nào.
                    </div>
                ) : null}
            </div>
        </section>
    );
}