import { TaskPriority, TaskSource, TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TASK_PRIORITY_LABEL, TASK_SOURCE_LABEL, TASK_STATUS_LABEL } from "../../utils/task-labels";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status === "DONE" ? "bg-emerald-50 text-emerald-700" : status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700" : status === "CANCELLED" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-700")}>{TASK_STATUS_LABEL[status]}</span>;
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", priority === "URGENT" ? "bg-rose-50 text-rose-700" : priority === "HIGH" ? "bg-orange-50 text-orange-700" : priority === "LOW" ? "bg-slate-50 text-slate-500" : "bg-sky-50 text-sky-700")}>{TASK_PRIORITY_LABEL[priority]}</span>;
}

export function TaskSourceBadge({ source }: { source: TaskSource }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", source === "SYSTEM" ? "bg-violet-50 text-violet-700" : "bg-slate-50 text-slate-600")}>{TASK_SOURCE_LABEL[source]}</span>;
}
export function TaskBadges({ task }: { task: any }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {task.status ? <TaskStatusBadge status={task.status} /> : null}
      {task.priority ? <TaskPriorityBadge priority={task.priority} /> : null}
      {task.source ? <TaskSourceBadge source={task.source} /> : null}
    </div>
  );
}