"use client";

import { useRouter } from "next/navigation";
import { TaskStatus } from "@prisma/client";
import { changeTaskStatusAction } from "../actions/task.actions";
import TaskDomainActions from "../ui/detail/TaskDomainActions";
import TaskExecutionPanel from "../ui/detail/TaskExecutionPanel";
import { TaskBadges } from "../ui/shared/TaskBadges";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

export default function TaskDetailClient({ task }: { task: any }) {
  const router = useRouter();
  const notify = useNotify();

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
    <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <TaskBadges task={task} />
            <h1 className="mt-3 text-2xl font-bold text-slate-950">{task.title}</h1>
            {task.description ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{task.description}</p> : null}
          </div>
          <button
            type="button"
            onClick={markDone}
            disabled={task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Hoàn tất task
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <TaskDomainActions task={task} onDone={() => router.refresh()} />
          <TaskExecutionPanel executions={task.executions ?? []} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Context</p>
            <div className="mt-4 space-y-3 text-sm">
              {task.workCase ? <div><span className="text-slate-400">Phiếu xử lý:</span> <span className="font-semibold text-slate-800">{task.workCase.refNo ?? task.workCase.title}</span></div> : null}
              {task.watch?.product ? <div><span className="text-slate-400">Watch:</span> <span className="font-semibold text-slate-800">{task.watch.product.title}</span></div> : null}
              {task.assignedToUser ? <div><span className="text-slate-400">Người nhận:</span> <span className="font-semibold text-slate-800">{task.assignedToUser.name ?? task.assignedToUser.email}</span></div> : null}
              {task.dueAt ? <div><span className="text-slate-400">Due:</span> <span className="font-semibold text-slate-800">{new Date(task.dueAt).toLocaleDateString("vi-VN")}</span></div> : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
