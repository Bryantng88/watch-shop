/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  ExternalLink,
  Flag,
  Link2,
  PlayCircle,
  RotateCcw,
  UserRound,
  XCircle,
} from "lucide-react";
import { TaskPriority, TaskStatus } from "@prisma/client";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  changeTaskItemDoneAction,
  changeTaskStatusAction,
  createTaskItemAction,
  createTaskItemChecklistAction,
  changeTaskItemChecklistDoneAction,
  deleteTaskItemAction,
} from "../actions/task.actions";
import TaskWorkPanel from "../ui/task-work/TaskWorkPanel";

type UserOption = {
  id: string;
  name: string | null;
  email: string | null;
};

type BusinessLink = {
  label: string;
  title: string;
  href: string;
};

function userLabel(
  user?: { name?: string | null; email?: string | null } | null,
) {
  return user?.name || user?.email || "-";
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
}

function formatShortDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function workCaseLabel(workCase: any) {
  return workCase?.refNo || workCase?.title || "Phiếu xử lý";
}

function taskKindLabel(task: any) {
  const kind = String(task.kind ?? "BUSINESS").toUpperCase();
  if (kind === "OPERATION") return "Vận hành";
  if (kind === "SERVICE") return "Kỹ thuật";
  if (kind === "PERSONAL") return "Cá nhân";
  if (kind === "FREE") return "Tự do";
  return "Kinh doanh";
}

function statusLabel(status?: string | null) {
  if (status === "IN_PROGRESS") return "Đang làm";
  if (status === "DONE") return "Hoàn tất";
  if (status === "CANCELLED") return "Đã hủy";
  return "Cần làm";
}

function priorityLabel(priority?: string | null) {
  if (priority === "URGENT") return "Gấp";
  if (priority === "HIGH") return "Cao";
  if (priority === "LOW") return "Thấp";
  return "Vừa";
}

function statusTone(status?: string | null) {
  if (status === "DONE") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "IN_PROGRESS") return "bg-blue-50 text-blue-700 ring-blue-100";
  if (status === "CANCELLED") return "bg-rose-50 text-rose-700 ring-rose-100";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function priorityTone(priority?: string | null) {
  if (priority === "URGENT") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (priority === "HIGH") return "bg-orange-50 text-orange-700 ring-orange-100";
  if (priority === "LOW") return "bg-slate-50 text-slate-600 ring-slate-200";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function isTaskItemDone(item: any) {
  const status = String(item.status ?? "").toUpperCase();
  if (["DONE", "COMPLETED"].includes(status)) return true;
  return Boolean(item.isDone);
}

function taskStats(task: any) {
  const items = task.taskItems ?? [];
  const done = items.filter(isTaskItemDone).length;
  const open = Math.max(0, items.length - done);
  const business = items.filter(
    (item: any) => (item.executions?.length ?? 0) > 0,
  ).length;
  const checklistTotal = items.reduce(
    (sum: number, item: any) => sum + (item.checklists?.length ?? 0),
    0,
  );
  const feedback = items.reduce(
    (sum: number, item: any) =>
      sum +
      (item.timeline ?? []).filter(
        (entry: any) =>
          entry.sourceType === "BUSINESS_FEEDBACK" || entry.icon === "feedback",
      ).length,
    0,
  );
  const overdue = items.filter((item: any) => {
    if (isTaskItemDone(item) || !item.dueAt) return false;
    const due = new Date(item.dueAt);
    if (Number.isNaN(due.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;
  const progress = items.length ? Math.round((done / items.length) * 100) : 0;

  return {
    total: items.length,
    done,
    open,
    business,
    checklistTotal,
    feedback,
    overdue,
    progress,
  };
}

function buildBusinessLinks(task: any): BusinessLink[] {
  return [
    task.workCase
      ? {
        label: "Phiếu xử lý",
        title: workCaseLabel(task.workCase),
        href: `/admin/work-cases/${task.workCase.id}`,
      }
      : null,
    task.watch?.product
      ? {
        label: "Watch",
        title: task.watch.product.title,
        href: `/admin/watches/${task.watch.productId}`,
      }
      : null,
    task.order
      ? {
        label: "Đơn hàng",
        title: task.order.refNo || task.order.customerName || task.order.id,
        href: `/admin/orders/${task.order.id}`,
      }
      : null,
    task.serviceRequest
      ? {
        label: "Service",
        title: task.serviceRequest.refNo || task.serviceRequest.id,
        href: `/admin/services/${task.serviceRequest.id}`,
      }
      : null,
    task.shipment
      ? {
        label: "Shipment",
        title: task.shipment.refNo || task.shipment.trackingCode || task.shipment.id,
        href: `/admin/shipments/${task.shipment.id}`,
      }
      : null,
    task.acquisition
      ? {
        label: "Phiếu nhập",
        title: task.acquisition.refNo || task.acquisition.id,
        href: `/admin/acquisitions/${task.acquisition.id}`,
      }
      : null,
  ].filter(Boolean) as BusinessLink[];
}

export default function TaskDetailClient({
  task,
  users = [],
}: {
  task: any;
  users?: UserOption[];
}) {
  const router = useRouter();
  const notify = useNotify();
  const [pending, setPending] = useState(false);

  const closed =
    task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED;
  const stats = taskStats(task);
  const businessLinks = buildBusinessLinks(task);

  async function changeStatus(status: TaskStatus) {
    try {
      setPending(true);
      await changeTaskStatusAction(task.id, status);
      notify.success("Đã cập nhật task");
      router.refresh();
    } catch (error) {
      notify.error(errorMessage(error, "Không cập nhật được task"));
    } finally {
      setPending(false);
    }
  }

  async function addTaskItem(input: {
    taskId: string;
    title: string;
    assignedToUserId?: string | null;
    priority?: TaskPriority | null;
    dueAt?: string | null;
  }) {
    try {
      await createTaskItemAction(input);
      notify.success("Đã thêm task item");
      router.refresh();
    } catch (error) {
      notify.error(errorMessage(error, "Không thêm được task item"));
    }
  }

  async function toggleTaskItem(itemId: string, isDone: boolean) {
    try {
      await changeTaskItemDoneAction(itemId, isDone);
      router.refresh();
    } catch (error) {
      notify.error(errorMessage(error, "Không cập nhật được task item"));
    }
  }

  async function deleteTaskItem(itemId: string) {
    if (!window.confirm("Xóa task item này?")) return;

    try {
      await deleteTaskItemAction(itemId);
      router.refresh();
    } catch (error) {
      notify.error(errorMessage(error, "Không xóa được task item"));
    }
  }

  async function addTaskItemChecklist(taskItemId: string, title: string) {
    try {
      await createTaskItemChecklistAction({ taskItemId, title });
      router.refresh();
    } catch (error) {
      notify.error(errorMessage(error, "Không thể thêm checklist"));
    }
  }

  async function toggleTaskItemChecklist(checklistId: string, isDone: boolean) {
    try {
      await changeTaskItemChecklistDoneAction(checklistId, isDone);
      router.refresh();
    } catch (error) {
      notify.error(errorMessage(error, "Không thể cập nhật checklist"));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-[1640px] px-4 py-5 lg:px-6 xl:px-8">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <AdminBreadcrumbs
              items={[
                { label: "Tasks", href: "/admin/tasks" },
                { label: task.title || "Chi tiết task" },
              ]}
            />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {taskKindLabel(task)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(
                  task.status,
                )}`}
              >
                {statusLabel(task.status)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${priorityTone(
                  task.priority,
                )}`}
              >
                {priorityLabel(task.priority)}
              </span>
            </div>

            <h1 className="mt-3 max-w-5xl truncate text-2xl font-semibold text-slate-950 lg:text-3xl">
              {task.title}
            </h1>

            {task.description ? (
              <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {task.description}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/admin/tasks"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>

            {task.status !== TaskStatus.IN_PROGRESS && !closed ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus(TaskStatus.IN_PROGRESS)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <PlayCircle className="h-4 w-4" />
                Bắt đầu
              </button>
            ) : null}

            {task.status !== TaskStatus.DONE ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus(TaskStatus.DONE)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Hoàn tất
              </button>
            ) : null}

            {closed ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus(TaskStatus.TODO)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Mở lại
              </button>
            ) : null}

            {task.status !== TaskStatus.CANCELLED ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => changeStatus(TaskStatus.CANCELLED)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Hủy
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-4">
            <section className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <ClipboardList className="h-4 w-4" />
                  Work items
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats.done}/{stats.total}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <CircleDot className="h-4 w-4" />
                  Đang mở
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats.open}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <Link2 className="h-4 w-4" />
                  Liên kết
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats.business}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <Activity className="h-4 w-4" />
                  Phản hồi
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats.feedback}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Task items
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Chia nhỏ việc, assign người xử lý, gắn checklist và nghiệp vụ.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{stats.checklistTotal} checklist</span>
                  {stats.overdue ? (
                    <span className="font-semibold text-rose-600">
                      {stats.overdue} quá hạn
                    </span>
                  ) : null}
                </div>
              </div>

              <TaskWorkPanel
                task={task}
                users={users}
                taskItems={task.taskItems ?? []}
                executions={task.executions ?? []}
                onAddTaskItem={addTaskItem}
                onToggleTaskItem={toggleTaskItem}
                onDeleteTaskItem={deleteTaskItem}
                onAddTaskItemChecklist={addTaskItemChecklist}
                onToggleTaskItemChecklist={toggleTaskItemChecklist}
              />
            </section>
          </main>

          <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase text-slate-500">
                  Progress
                </h2>
                <span className="text-sm font-semibold text-slate-950">
                  {stats.progress}%
                </span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-semibold text-slate-950">{stats.done}</div>
                  <div className="text-xs text-slate-500">xong</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-950">{stats.open}</div>
                  <div className="text-xs text-slate-500">mở</div>
                </div>
                <div>
                  <div className="font-semibold text-rose-600">{stats.overdue}</div>
                  <div className="text-xs text-slate-500">quá hạn</div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase text-slate-500">
                Details
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-slate-500">Người nhận</div>
                    <div className="font-semibold text-slate-900">
                      {userLabel(task.assignedToUser)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-slate-500">Due</div>
                    <div className="font-semibold text-slate-900">
                      {formatShortDate(task.dueAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Flag className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-slate-500">Priority</div>
                    <div className="font-semibold text-slate-900">
                      {priorityLabel(task.priority)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="text-slate-500">Người tạo</div>
                  <div className="font-semibold text-slate-900">
                    {userLabel(task.createdByUser)}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase text-slate-500">
                Linked business
              </h2>

              <div className="mt-3 space-y-2">
                {businessLinks.length ? (
                  businessLinks.map((link) => (
                    <Link
                      key={`${link.label}:${link.href}`}
                      href={link.href}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase text-slate-400">
                          {link.label}
                        </span>
                        <span className="block truncate font-semibold text-slate-900">
                          {link.title}
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 px-3 py-3 text-sm text-slate-500">
                    Chưa gắn nghiệp vụ trực tiếp.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
