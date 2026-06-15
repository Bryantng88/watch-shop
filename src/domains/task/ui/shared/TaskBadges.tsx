import { TaskPriority, TaskSource, TaskStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TASK_SOURCE_LABEL } from "../../utils/task-labels";
import {
  PrioritySignal,
  TaskStatusSignal,
} from "@/domains/shared/ui/signals/StatePrioritySignal";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <TaskStatusSignal status={status} />;
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <PrioritySignal priority={priority} />;
}

export function TaskSourceBadge({ source }: { source: TaskSource }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        source === "SYSTEM"
          ? "bg-violet-50 text-violet-700"
          : "bg-slate-50 text-slate-600",
      )}
    >
      {TASK_SOURCE_LABEL[source]}
    </span>
  );
}

export function TaskBadges({ task }: { task: any }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {task.status ? <TaskStatusBadge status={task.status} /> : null}
      {task.priority ? <TaskPriorityBadge priority={task.priority} /> : null}
      {task.source ? <TaskSourceBadge source={task.source} /> : null}
      {task.taskAction?.name ? (
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {task.taskAction.name}
        </span>
      ) : null}
    </div>
  );
}