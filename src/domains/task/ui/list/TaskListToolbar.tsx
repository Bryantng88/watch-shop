"use client";

import { Plus } from "lucide-react";
import type { TaskDueKey } from "../../server/task.types";
import { TASK_DUE_LABEL } from "../../utils/task-labels";

export default function TaskListToolbar({ total, due, dueCounts, onDueChange, onCreate }: { total: number; due: TaskDueKey; dueCounts?: Record<string, number>; onDueChange: (due: TaskDueKey) => void; onCreate: () => void }) {
  const items: { key: TaskDueKey; count?: number }[] = [
    { key: "OVERDUE", count: dueCounts?.overdue },
    { key: "TODAY", count: dueCounts?.today },
    { key: "THIS_WEEK", count: dueCounts?.thisWeek },
    { key: "NO_DUE", count: dueCounts?.noDue },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">My Queue</h1>
          <p className="mt-1 text-sm text-slate-500">Trung tâm công việc: ưu tiên việc quá hạn, hôm nay, payment, shipment và service issue.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{total} task</span>
          <button type="button" onClick={onCreate} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Tạo task
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onDueChange("ALL")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${due === "ALL" ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{TASK_DUE_LABEL.ALL}</button>
        {items.map((item) => (
          <button key={item.key} type="button" onClick={() => onDueChange(item.key)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${due === item.key ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{TASK_DUE_LABEL[item.key]} {typeof item.count === "number" ? <span className="ml-1 opacity-70">{item.count}</span> : null}</button>
        ))}
      </div>
    </div>
  );
}
