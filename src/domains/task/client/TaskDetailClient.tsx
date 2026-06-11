"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import { changeTaskStatusAction } from "../actions/task.actions";
import TaskDomainActions from "../ui/detail/TaskDomainActions";
import TaskExecutionPanel from "../ui/detail/TaskExecutionPanel";
import { TaskBadges } from "../ui/shared/TaskBadges";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
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

export default function TaskDetailClient({ task }: { task: any }) {
  const router = useRouter();
  const notify = useNotify();
  const closed = task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED;

  async function markDone() {
    try {
      await changeTaskStatusAction(task.id, TaskStatus.DONE);
      notify.success("Đã hoàn tất task");
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không hoàn tất được task");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 px-4 py-5 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/tasks"
          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách task
        </Link>

        <button
          type="button"
          onClick={markDone}
          disabled={closed}
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <CheckCircle2 className="h-4 w-4" />
          Hoàn tất task
        </button>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <TaskBadges task={task} />
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{task.title}</h1>
            {task.description ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{task.description}</p>
            ) : null}
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div>
              Loại: <span className="font-semibold text-slate-950">{task.taskType?.name || task.domain}</span>
            </div>
            <div className="mt-1">
              Kiểu xử lý: <span className="font-semibold text-slate-950">{task.mode}</span>
            </div>
            <div className="mt-1">Tạo lúc: {formatDate(task.createdAt)}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <TaskDomainActions task={task} onDone={() => router.refresh()} />
          <TaskExecutionPanel executions={task.executions ?? []} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Context</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {task.workCase ? (
                <div>
                  <span className="text-slate-400">Phiếu xử lý:</span>{" "}
                  <Link href={`/admin/work-cases/${task.workCase.id}`} className="font-semibold text-blue-700 hover:text-blue-900">
                    {workCaseLabel(task.workCase)} <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}

              {task.watch?.product ? (
                <div>
                  <span className="text-slate-400">Watch:</span>{" "}
                  <Link href={`/admin/watches/${task.watch.productId}`} className="font-semibold text-blue-700 hover:text-blue-900">
                    {task.watch.product.title} <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                  <div className="mt-1 text-xs text-slate-400">SKU: {task.watch.product.sku || "-"}</div>
                </div>
              ) : null}

              {task.assignedToUser ? (
                <div>
                  <span className="text-slate-400">Người nhận:</span>{" "}
                  <span className="font-semibold text-slate-800">{userLabel(task.assignedToUser)}</span>
                </div>
              ) : null}

              {task.createdByUser ? (
                <div>
                  <span className="text-slate-400">Người tạo:</span>{" "}
                  <span className="font-semibold text-slate-800">{userLabel(task.createdByUser)}</span>
                </div>
              ) : null}

              <div>
                <span className="text-slate-400">Due:</span>{" "}
                <span className="font-semibold text-slate-800">{formatDate(task.dueAt)}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
