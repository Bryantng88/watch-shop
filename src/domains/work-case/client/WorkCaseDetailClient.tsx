"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
    ImageIcon,
    MoreHorizontal,
    Plus,
} from "lucide-react";
import { TaskDomain, TaskMode, WorkCaseStatus } from "@prisma/client";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import { TaskStatusBadge } from "@/domains/task/ui/shared/TaskBadges";
import TaskQuickCreateModal, {
    type TaskQuickCreateContext,
    type TaskUserOption,
} from "@/domains/task/ui/quick-create/TaskQuickCreateModal";
import type { TaskTypeOption } from "@/domains/task/server/task-type.types";
import { ADMIN_DETAIL_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import { updateWorkCaseAction } from "../actions/work-case.actions";
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
    taskTypes,
    currentUserId,
    canManage,
}: {
    item: WorkCaseWithRelations;
    users: TaskUserOption[];
    taskTypes: TaskTypeOption[];
    currentUserId: string;
    canManage?: boolean;
}) {
    const router = useRouter();
    const [localItem, setLocalItem] = useState<WorkCaseWithRelations>(item);
    const [pending, startTransition] = useTransition();
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [taskContext, setTaskContext] = useState<TaskQuickCreateContext | null>(null);
    const [actionOpen, setActionOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLocalItem(item);
    }, [item]);

    const title = localItem.watch?.product?.title || localItem.title || "Phiếu xử lý";
    const sku = localItem.watch?.product?.sku || "-";
    const img = imageSrc(localItem);
    const tasks = localItem.tasks ?? [];
    const serviceRequests = localItem.serviceRequests ?? [];
    const canClose = canManage && !isClosed(localItem.status);

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
        setActionOpen(false);
        setTaskContext({
            workCaseId: localItem.id,
            watchId: localItem.watchId,
            domain: TaskDomain.WORK_CASE,
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
        <div className={ADMIN_DETAIL_CONTENT_CLASS}>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="min-w-0">
                        <AdminBreadcrumbs
                            items={[
                                { label: "Phiếu xử lý", href: "/admin/work-cases" },
                                { label: localItem.refNo || localItem.title || "Chi tiết" },
                            ]}
                        />

                        <div className="mt-4">
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                                {localItem.title}
                            </h1>

                            {localItem.description ? (
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                    {localItem.description}
                                </p>
                            ) : null}
                        </div>

                        <div className="relative mt-4 inline-block">
                            <button
                                type="button"
                                onClick={() => setActionOpen((v) => !v)}
                                className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                Thao tác
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {actionOpen ? (
                                <div className="absolute left-0 z-30 mt-2 w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                    <Link
                                        href="/admin/work-cases"
                                        className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        onClick={() => setActionOpen(false)}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Quay lại danh sách
                                    </Link>

                                    {canManage && !isClosed(localItem.status) ? (
                                        <>
                                            <div className="my-2 h-px bg-slate-100" />

                                            <button
                                                type="button"
                                                onClick={() => openCreateTask()}
                                                disabled={pending}
                                                className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Tạo task
                                            </button>

                                            <div className="my-2 h-px bg-slate-100" />

                                            <button
                                                type="button"
                                                disabled={!canClose || pending}
                                                onClick={() => {
                                                    setActionOpen(false);
                                                    mutateCase({ status: WorkCaseStatus.RESOLVED });
                                                }}
                                                className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Đóng phiếu
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex h-full flex-col justify-center rounded-2xl bg-slate-50 px-4 py-4 text-xs text-slate-500">
                        <div className="flex justify-between gap-3">
                            <span>Ref</span>
                            <span className="font-semibold text-slate-900">
                                {localItem.refNo || localItem.id}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between gap-3">
                            <span>Trạng thái</span>
                            <span className="font-semibold text-slate-900">
                                {WORK_CASE_STATUS_LABEL[localItem.status]}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between gap-3">
                            <span>Nhóm</span>
                            <span className="font-semibold text-slate-900">
                                {localItem.category?.name || "-"}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between gap-3">
                            <span>Người tạo</span>
                            <span className="font-semibold text-slate-900">
                                {userLabel(localItem.raisedByUser)}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between gap-3">
                            <span>Tạo lúc</span>
                            <span className="font-semibold text-slate-900">
                                {formatDate(localItem.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-5">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Vấn đề
                        </p>

                        <div className="mt-4 flex gap-4 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
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

                                {localItem.watch?.productId ? (
                                    <Link
                                        href={`/admin/watches/${localItem.watch.productId}`}
                                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
                                    >
                                        Mở watch <ExternalLink className="h-4 w-4" />
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Điều phối xử lý
                                </p>
                                <h2 className="mt-1 text-base font-semibold text-slate-950">
                                    Tasks
                                </h2>
                            </div>

                            {canManage && !isClosed(localItem.status) ? (
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() => openCreateTask()}
                                    className="inline-flex h-9 items-center gap-2 rounded-2xl bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tạo task
                                </button>
                            ) : null}
                        </div>

                        <div className="mt-4 space-y-3">
                            {tasks.length ? (
                                tasks.map((task: any) => (
                                    <div
                                        key={task.id}
                                        className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                                        Task
                                                    </span>

                                                    <TaskStatusBadge status={task.status} />
                                                </div>

                                                <div className="mt-3 line-clamp-2 font-semibold text-slate-950">
                                                    {task.title}
                                                </div>

                                                <div className="mt-2 text-xs text-slate-400">
                                                    Người nhận:{" "}
                                                    <span className="font-semibold text-slate-700">
                                                        {userLabel(task.assignedToUser)}
                                                    </span>
                                                </div>

                                                <div className="mt-1 text-[11px] text-slate-300">
                                                    ID: {task.id}
                                                </div>
                                            </div>

                                            <Link
                                                href={`/admin/tasks/${task.id}`}
                                                className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                                            >
                                                Mở
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-100">
                                    Chưa có task nào được tạo từ phiếu.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-5">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Thông tin
                        </p>

                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <div>
                                <span className="text-slate-400">Người tạo:</span>{" "}
                                <span className="font-semibold text-slate-800">
                                    {userLabel(localItem.raisedByUser)}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400">Người phụ trách:</span>{" "}
                                <span className="font-semibold text-slate-800">
                                    {userLabel(localItem.assignedToUser)}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400">Nhóm:</span>{" "}
                                <span className="font-semibold text-slate-800">
                                    {localItem.category?.name || "-"}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400">Trạng thái:</span>{" "}
                                <span className="font-semibold text-slate-800">
                                    {WORK_CASE_STATUS_LABEL[localItem.status]}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Feedback / Activity
                        </p>

                        <div className="mt-4 space-y-2">
                            {(localItem.activities ?? []).length ? (
                                (localItem.activities ?? []).map((activity: any) => (
                                    <div
                                        key={activity.id}
                                        className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-semibold text-slate-900">
                                                {activity.action === "TASK_REQUEST" ? "Yêu cầu tạo task" : activity.action === "TASK_FEEDBACK" ? "Feedback từ task" : activity.action}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {formatDate(activity.createdAt)}
                                            </span>
                                        </div>

                                        {activity.note ? (
                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                {activity.note}
                                            </p>
                                        ) : null}

                                        {activity.actor ? (
                                            <div className="mt-2 text-xs text-slate-400">
                                                Bởi: <span className="font-semibold text-slate-700">{userLabel(activity.actor)}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    Chưa có feedback mới.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Service Requests
                        </p>

                        <div className="mt-4 space-y-2">
                            {serviceRequests.length ? (
                                serviceRequests.map((sr: any) => (
                                    <Link
                                        key={sr.id}
                                        href={`/admin/services/${sr.id}`}
                                        className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100 hover:bg-slate-100"
                                    >
                                        <div className="font-semibold text-slate-950">
                                            {sr.refNo || sr.id}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {sr.status || "-"}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    Chưa có service request nào được tạo từ phiếu.
                                </div>
                            )}
                        </div>
                    </section>
                </aside>
            </div>

            <TaskQuickCreateModal
                open={taskModalOpen}
                users={users}
                taskTypes={taskTypes}
                currentUserId={currentUserId}
                context={taskContext}
                onClose={() => setTaskModalOpen(false)}
                onSaved={handleTaskSaved}
            />
        </div>
    );
}
