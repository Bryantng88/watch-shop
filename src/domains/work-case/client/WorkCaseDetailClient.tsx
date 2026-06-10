"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    ImageIcon,
    ListChecks,
    Plus,
    Wrench,
} from "lucide-react";
import { TaskStatusBadge } from "@/domains/task/ui/shared/TaskBadges";
import { TaskDomain, TaskMode, WorkCaseStatus } from "@prisma/client";

import TaskQuickCreateModal, {
    type TaskQuickCreateContext,
    type TaskUserOption,
} from "@/domains/task/ui/quick-create/TaskQuickCreateModal";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import { updateWorkCaseAction } from "../actions/work-case.actions";
import {
    WorkCasePriorityBadge,
    WorkCaseScopeBadge,
    WorkCaseStatusBadge,
} from "../ui/WorkCaseBadges";
import { WORK_CASE_STATUS_LABEL } from "../utils/work-case-labels";

function userLabel(user: { name?: string | null; email?: string | null; id?: string | null } | null | undefined) {
    return user?.name || user?.email || user?.id || "-";
}

function imageSrc(item: WorkCaseWithRelations) {
    const inline =
        (item.watch?.product as any)?.productImage?.[0] ??
        (item.watch?.product as any)?.productImages?.[0];

    return inline?.imageUrl || inline?.fileKey || item.watch?.product?.primaryImageUrl || null;
}

function defaultTaskDomain(item: WorkCaseWithRelations) {
    if (item.scope === "SERVICE") return TaskDomain.SERVICE;
    if (item.scope === "PAYMENT") return TaskDomain.PAYMENT;
    if (item.scope === "LOGISTIC") return TaskDomain.SHIPMENT;
    return TaskDomain.WATCH;
}

function formatDate(value: Date | string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("vi-VN");
}

function isClosed(status: WorkCaseStatus) {
    return status === WorkCaseStatus.RESOLVED || status === WorkCaseStatus.CANCELLED;
}

export default function WorkCaseDetailClient({
    item,
    users,
    currentUserId,
    canManage,
}: {
    item: WorkCaseWithRelations;
    users: TaskUserOption[];
    currentUserId: string;
    canManage?: boolean;
}) {
    const router = useRouter();
    const [localItem, setLocalItem] = useState<WorkCaseWithRelations>(item);
    const [pending, startTransition] = useTransition();
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [taskContext, setTaskContext] = useState<TaskQuickCreateContext | null>(null);
    const [error, setError] = useState<string | null>(null);

    const title = localItem.watch?.product?.title || "Untitled watch";
    const sku = localItem.watch?.product?.sku || "-";
    const img = imageSrc(localItem);

    const tasks = localItem.tasks ?? [];
    const serviceRequests = localItem.serviceRequests ?? [];
    const activities = localItem.activities ?? [];
    const canClose = canManage && !isClosed(localItem.status);
    useEffect(() => {
        setLocalItem(item);
    }, [item]);
    function mutateCase(input: Parameters<typeof updateWorkCaseAction>[1]) {
        setError(null);

        startTransition(async () => {
            try {
                const res = await updateWorkCaseAction(localItem.id, input);
                if (res?.item) setLocalItem(res.item as WorkCaseWithRelations);
                router.refresh();
            } catch (err: any) {
                setError(err?.message || "Không thể cập nhật phiếu xử lý.");
            }
        });
    }

    function openCreateTask() {
        setTaskContext({
            workCaseId: localItem.id,
            watchId: localItem.watchId,
            domain: defaultTaskDomain(localItem),
            mode: TaskMode.NORMAL,
            titlePreset: localItem.refNo
                ? `Xử lý ${localItem.refNo}: ${localItem.title}`
                : `Xử lý phiếu: ${localItem.title}`,
            descriptionPreset: localItem.description || "",
        });

        setTaskModalOpen(true);
    }

    function handleTaskSaved() {
        setTaskModalOpen(false);

        if (localItem.status === WorkCaseStatus.NEW) {
            mutateCase({ status: WorkCaseStatus.TRIAGED });
        } else {
            router.refresh();
        }
    }

    return (
        <div className="mx-auto w-full max-w-[1180px] space-y-4 px-4 py-5 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/admin/work-cases"
                    className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại danh sách
                </Link>

                {canManage ? (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={pending || isClosed(localItem.status)}
                            onClick={openCreateTask}
                            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo task
                        </button>

                        <button
                            type="button"
                            disabled
                            title="Luồng tạo service request từ phiếu sẽ nối ở bước sau."
                            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400"
                        >
                            <Wrench className="h-4 w-4" />
                            Tạo service
                        </button>

                        <button
                            type="button"
                            disabled={!canClose || pending}
                            onClick={() => mutateCase({ status: WorkCaseStatus.RESOLVED })}
                            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Đóng phiếu
                        </button>
                    </div>
                ) : null}
            </div>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Phiếu xử lý
                        </div>

                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                            {localItem.title}
                        </h1>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <WorkCaseStatusBadge status={localItem.status} />
                            <WorkCasePriorityBadge priority={localItem.priority} />
                            <WorkCaseScopeBadge scope={localItem.scope} />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <div>
                            Ref:{" "}
                            <span className="font-mono font-semibold text-slate-950">
                                {localItem.refNo || localItem.id}
                            </span>
                        </div>
                        <div className="mt-1">Tạo lúc: {formatDate(localItem.createdAt)}</div>
                    </div>
                </div>
            </section>

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Vấn đề
                    </div>

                    <div className="mt-4 flex gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {img ? (
                                <img src={img} alt={title} className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon className="h-6 w-6 text-slate-400" />
                            )}
                        </div>

                        <div className="min-w-0 py-1">
                            <div className="line-clamp-2 text-lg font-semibold text-slate-950">
                                {title}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">SKU: {sku}</div>

                            <Link
                                href={`/admin/watches/${localItem.watch.productId}`}
                                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
                            >
                                Mở watch <ExternalLink className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-4 rounded-3xl bg-slate-50 px-4 py-3">
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            Mô tả
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {localItem.description || "Không có mô tả."}
                        </p>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Thông tin
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600">
                        <div>
                            Người tạo:{" "}
                            <span className="font-medium text-slate-900">
                                {userLabel(localItem.raisedByUser)}
                            </span>
                        </div>
                        <div>
                            Nhóm:{" "}
                            <span className="font-medium text-slate-900">
                                {localItem.category?.name || "-"}
                            </span>
                        </div>
                        <div>
                            Trạng thái:{" "}
                            <span className="font-medium text-slate-900">
                                {WORK_CASE_STATUS_LABEL[localItem.status]}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            Hướng xử lý
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Task/SR được tạo từ phiếu này. Người nhận xử lý ở task hoặc service.
                        </p>
                    </div>

                    {canManage && !isClosed(localItem.status) ? (
                        <button
                            type="button"
                            disabled={pending}
                            onClick={openCreateTask}
                            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            <ListChecks className="h-4 w-4" />
                            Tạo task
                        </button>
                    ) : null}
                </div>

                <div className="mt-4 space-y-5">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Tasks</div>

                        {tasks.length ? (
                            <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                                {tasks.map((task) => (
                                    <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                                        <div className="min-w-0">
                                            <div className="font-medium text-slate-950">{task.title}</div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                Người nhận: {userLabel(task.assignedToUser)} ·<TaskStatusBadge status={task.status} />
                                            </div>
                                        </div>
                                        <Link
                                            href={`/admin/tasks?taskId=${task.id}`}
                                            className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                                        >
                                            Mở task
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                Chưa có task nào được tạo từ phiếu.
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-slate-900">Service Requests</div>

                        {serviceRequests.length ? (
                            <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                                {serviceRequests.map((sr) => (
                                    <div key={sr.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                                        <div>
                                            <div className="font-medium text-slate-950">
                                                {sr.refNo || sr.id}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                Status: {sr.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                Chưa có service request nào được tạo từ phiếu.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Activity
                </div>

                <div className="mt-4 space-y-2">
                    {activities.length ? (
                        activities.map((activity) => (
                            <div key={activity.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                                <div className="text-xs font-bold text-slate-700">
                                    {activity.action}
                                </div>
                                <div className="mt-1 text-sm text-slate-600">
                                    {activity.note || "-"}
                                </div>
                                <div className="mt-1 text-xs text-slate-400">
                                    {formatDate(activity.createdAt)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                            Chưa có activity.
                        </div>
                    )}
                </div>
            </section>

            <TaskQuickCreateModal
                open={taskModalOpen}
                users={users}
                currentUserId={currentUserId}
                context={taskContext}
                onClose={() => setTaskModalOpen(false)}
                onSaved={handleTaskSaved}
            />
        </div>
    );
}