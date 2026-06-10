"use client";

import { TaskDomain, TaskMode, TaskPriority, TaskStatus } from "@prisma/client";
import type { TaskTypeOption } from "../../server/task-type.types";
import { TASK_DOMAIN_LABEL, TASK_MODE_LABEL, TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from "../../utils/task-labels";

export type TaskListFiltersValue = {
  q: string;
  status: TaskStatus | "OPEN" | "ALL";
  priority: TaskPriority | "ALL";
  domain: TaskDomain | "ALL";
  taskTypeId: string | "ALL";
  mode: TaskMode | "ALL";
  pageSize: string;
};

export default function TaskListFilters({ filters, taskTypes = [], onChange, onApply, onClear }: { filters: TaskListFiltersValue; taskTypes?: TaskTypeOption[]; onChange: (patch: Partial<TaskListFiltersValue>) => void; onApply: () => void; onClear: () => void }) {
  const filteredTaskTypes = taskTypes.filter((item) => filters.domain === "ALL" || item.domain === filters.domain);

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_170px_150px_170px_190px_150px_120px]">
      <input value={filters.q} onChange={(e) => onChange({ q: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") onApply(); }} placeholder="Tìm task, mã đơn, watch..." className="h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
      <select value={filters.status} onChange={(e) => onChange({ status: e.target.value as any })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="OPEN">Đang mở</option>
        <option value="ALL">Tất cả trạng thái</option>
        {Object.values(TaskStatus).map((item) => <option key={item} value={item}>{TASK_STATUS_LABEL[item]}</option>)}
      </select>
      <select value={filters.priority} onChange={(e) => onChange({ priority: e.target.value as any })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="ALL">Mọi ưu tiên</option>
        {Object.values(TaskPriority).map((item) => <option key={item} value={item}>{TASK_PRIORITY_LABEL[item]}</option>)}
      </select>
      <select value={filters.domain} onChange={(e) => onChange({ domain: e.target.value as any, taskTypeId: "ALL" })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="ALL">Mọi domain</option>
        {Object.values(TaskDomain).map((item) => <option key={item} value={item}>{TASK_DOMAIN_LABEL[item]}</option>)}
      </select>
      <select value={filters.taskTypeId} onChange={(e) => onChange({ taskTypeId: e.target.value })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="ALL">Mọi loại task</option>
        {filteredTaskTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <select value={filters.mode} onChange={(e) => onChange({ mode: e.target.value as any })} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
        <option value="ALL">Mọi kiểu</option>
        {Object.values(TaskMode).map((item) => <option key={item} value={item}>{TASK_MODE_LABEL[item]}</option>)}
      </select>
      <div className="flex gap-2">
        <button type="button" onClick={onApply} className="rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Lọc</button>
        <button type="button" onClick={onClear} className="rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600">Xóa</button>
      </div>
    </div>
  );
}
