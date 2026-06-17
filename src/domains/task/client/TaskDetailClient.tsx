"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { TaskStatus } from "@prisma/client";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import { changeTaskStatusAction } from "../actions/task.actions";
import TaskDomainActions from "../ui/detail/TaskDomainActions";
import TaskExecutionPanel from "../ui/detail/TaskExecutionPanel";
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
  const [actionOpen, setActionOpen] = useState(false);

  const closed =
    task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED;

  async function markDone() {
    try {
      await changeTaskStatusAction(task.id, TaskStatus.DONE);
      notify.success("Đã hoàn tất task");
      setActionOpen(false);
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không hoàn tất được task");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 lg:px-6 xl:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <AdminBreadcrumbs
              items={[
                { label: "Tasks", href: "/admin/tasks" },
                { label: task.title || "Chi tiết task" },
              ]}
            />

            <div className="mt-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {task.title}
              </h1>

              {task.description ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {task.description}
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
                <div className="absolute left-0 z-30 mt-2 w-[260px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link
                    href="/admin/tasks"
                    className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setActionOpen(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                  </Link>

                  <div className="my-2 h-px bg-slate-100" />

                  <div className="[&>*]:w-full [&_button]:w-full [&_a]:w-full">
                    <TaskDomainActions
                      task={task}
                      onDone={() => {
                        setActionOpen(false);
                        router.refresh();
                      }}
                    />
                  </div>

                  <div className="my-2 h-px bg-slate-100" />

                  <button
                    type="button"
                    onClick={markDone}
                    disabled={closed}
                    className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Hoàn tất task
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex h-full flex-col justify-center rounded-2xl bg-slate-50 px-4 py-4 text-xs text-slate-500">
            <div className="flex justify-between gap-3">
              <span>Loại</span>
              <span className="font-semibold text-slate-900">
                {task.taskType?.name || task.domain}
              </span>
            </div>

            {task.taskAction ? (
              <div className="mt-2 flex justify-between gap-3">
                <span>Action</span>
                <span className="font-semibold text-slate-900">
                  {task.taskAction.name}
                </span>
              </div>
            ) : null}

            <div className="mt-2 flex justify-between gap-3">
              <span>Kiểu</span>
              <span className="font-semibold text-slate-900">{task.mode}</span>
            </div>

            <div className="mt-2 flex justify-between gap-3">
              <span>Ưu tiên</span>
              <span className="font-semibold text-slate-900">
                {task.priority || "-"}
              </span>
            </div>

            <div className="mt-2 flex justify-between gap-3">
              <span>Tạo lúc</span>
              <span className="font-semibold text-slate-900">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <TaskExecutionPanel task={task} executions={task.executions ?? []} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Context
            </p>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
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

                  <div className="mt-1 text-xs text-slate-400">
                    SKU: {task.watch.product.sku || "-"}
                  </div>
                </div>
              ) : null}

              {task.assignedToUser ? (
                <div>
                  <span className="text-slate-400">Người nhận:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    {userLabel(task.assignedToUser)}
                  </span>
                </div>
              ) : null}

              {task.createdByUser ? (
                <div>
                  <span className="text-slate-400">Người tạo:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    {userLabel(task.createdByUser)}
                  </span>
                </div>
              ) : null}

              <div>
                <span className="text-slate-400">Due:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {formatDate(task.dueAt)}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}