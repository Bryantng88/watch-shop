"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { TaskStatus } from "@prisma/client";
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

function userLabel(
  user?: { name?: string | null; email?: string | null } | null,
) {
  return user?.name || user?.email || "-";
}

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
}

function workCaseLabel(workCase: any) {
  return workCase?.refNo || workCase?.title || "Phiếu xử lý";
}

function taskKindLabel(task: any) {
  const kind = String(task.kind ?? "BUSINESS").toUpperCase();
  return kind === "PERSONAL" ? "Personal" : "Business";
}

function isSubtaskDone(item: any) {
  const status = String(item.status ?? "").toUpperCase();
  if (["DONE", "COMPLETED"].includes(status)) return true;
  return Boolean(item.isDone);
}

function checklistStats(task: any) {
  const items = task.taskItems ?? [];
  const done = items.filter(isSubtaskDone).length;
  const business = items.filter(
    (x: any) => (x.executions?.length ?? 0) > 0,
  ).length;
  return { total: items.length, done, business };
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
  const stats = checklistStats(task);

  async function changeStatus(status: TaskStatus) {
    try {
      setPending(true);
      await changeTaskStatusAction(task.id, status);
      notify.success("Đã cập nhật task");
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không cập nhật được task");
    } finally {
      setPending(false);
    }
  }

  async function addTaskItem(input: {
    taskId: string;
    title: string;
    assignedToUserId?: string | null;
    priority?: string | null;
    dueAt?: string | null;
  }) {
    try {
      await createTaskItemAction(input);
      notify.success("Đã thêm subtask");
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không thêm được subtask");
    }
  }

  async function toggleTaskItem(itemId: string, isDone: boolean) {
    try {
      await changeTaskItemDoneAction(itemId, isDone);
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không cập nhật được subtask");
    }
  }

  async function deleteTaskItem(itemId: string) {
    if (!window.confirm("Xóa subtask này?")) return;

    try {
      await deleteTaskItemAction(itemId);
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không xóa được subtask");
    }
  }

  async function addTaskItemChecklist(taskItemId: string, title: string) {
    try {
      await createTaskItemChecklistAction({ taskItemId, title });
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không thể thêm checklist");
    }
  }

  async function toggleTaskItemChecklist(checklistId: string, isDone: boolean) {
    try {
      await changeTaskItemChecklistDoneAction(checklistId, isDone);
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không thể cập nhật checklist");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 lg:px-6 xl:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <AdminBreadcrumbs
          items={[
            { label: "Tasks", href: "/admin/tasks" },
            { label: task.title || "Chi tiết task" },
          ]}
        />

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                {taskKindLabel(task)}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                {task.status}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                {task.priority}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {task.title}
            </h1>

            {task.description ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {task.description}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/admin/tasks"
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Link>

              {task.status !== TaskStatus.IN_PROGRESS && !closed ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => changeStatus(TaskStatus.IN_PROGRESS)}
                  className="inline-flex h-10 items-center rounded-2xl bg-blue-50 px-4 text-sm font-semibold text-blue-700 ring-1 ring-blue-100 hover:bg-blue-100 disabled:opacity-50"
                >
                  Bắt đầu
                </button>
              ) : null}

              {task.status !== TaskStatus.DONE ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => changeStatus(TaskStatus.DONE)}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Hoàn tất task
                </button>
              ) : null}

              {task.status === TaskStatus.DONE ||
                task.status === TaskStatus.CANCELLED ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => changeStatus(TaskStatus.TODO)}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
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
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Hủy task
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-100">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                <div className="text-xs text-slate-400">Subtask</div>
                <div className="mt-1 text-xl font-bold text-slate-950">
                  {stats.done}/{stats.total}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                <div className="text-xs text-slate-400">Nghiệp vụ</div>
                <div className="mt-1 text-xl font-bold text-slate-950">
                  {stats.business}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                <div className="text-xs text-slate-400">Due</div>
                <div className="mt-1 text-sm font-bold text-slate-950">
                  {formatDate(task.dueAt)}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {task.workCase ? (
                <div>
                  <span className="text-slate-400">Phiếu xử lý:</span>{" "}
                  <Link
                    href={`/admin/work-cases/${task.workCase.id}`}
                    className="font-semibold text-blue-700 hover:text-blue-900"
                  >
                    {workCaseLabel(task.workCase)}{" "}
                    <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}

              {task.watch?.product ? (
                <div>
                  <span className="text-slate-400">Watch:</span>{" "}
                  <Link
                    href={`/admin/watches/${task.watch.productId}`}
                    className="font-semibold text-blue-700 hover:text-blue-900"
                  >
                    {task.watch.product.title}{" "}
                    <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}

              <div>
                <span className="text-slate-400">Người nhận:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {userLabel(task.assignedToUser)}
                </span>
              </div>

              <div>
                <span className="text-slate-400">Người tạo:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {userLabel(task.createdByUser)}
                </span>
              </div>

              <div>
                <span className="text-slate-400">Tạo lúc:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Task item
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">
            Người nhận task chia nhỏ việc, assign người xử lý và link nghiệp vụ
            nếu cần
          </h2>
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
    </div>
  );
}
