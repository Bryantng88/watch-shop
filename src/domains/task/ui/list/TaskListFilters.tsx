"use client";

import { TaskKind, TaskPriority, TaskStatus } from "@prisma/client";
import { TASK_KIND_LABEL, TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from "../../utils/task-labels";

export type TaskListFiltersValue = {
  q: string;
  status: TaskStatus | "OPEN" | "ALL";
  priority: TaskPriority | "ALL";
  kind: TaskKind | "ALL";
  pageSize: string;
};
const TASK_KIND_OPTIONS = ["PERSONAL", "BUSINESS"] as const;
export default function TaskListFilters({
  filters,
  onChange,
  onApply,
  onClear,
}: {
  filters: TaskListFiltersValue;
  onChange: (patch: Partial<TaskListFiltersValue>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_170px_150px_150px_120px]">
      <input
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter") onApply();
        }}
        placeholder="Tìm task, mã đơn, watch..."
        className="h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />

      <select value={filters.status} onChange={(e) => onChange({ status: e.target.value as any })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="OPEN">Đang mở</option>
        <option value="ALL">Tất cả trạng thái</option>
        {Object.values(TaskStatus).map((item) => <option key={item} value={item}>{TASK_STATUS_LABEL[item]}</option>)}
      </select>

      <select value={filters.priority} onChange={(e) => onChange({ priority: e.target.value as any })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="ALL">Mọi ưu tiên</option>
        {Object.values(TaskPriority).map((item) => <option key={item} value={item}>{TASK_PRIORITY_LABEL[item]}</option>)}
      </select>

      <select value={filters.kind} onChange={(e) => onChange({ kind: e.target.value as any })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="ALL">Mọi loại</option>
        {TASK_KIND_OPTIONS.map((item) => (
          <option key={item} value={item}>
            {TASK_KIND_LABEL[item]}
          </option>
        ))}      </select>

      <div className="flex gap-2">
        <button type="button" onClick={onApply} className="rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Lọc</button>
        <button type="button" onClick={onClear} className="rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600">Xóa</button>
      </div>
    </div>
  );
}
