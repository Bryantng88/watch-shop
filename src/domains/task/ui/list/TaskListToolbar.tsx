"use client";

import { Plus } from "lucide-react";

export default function TaskListToolbar({ total, onCreate }: { total: number; onCreate: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">Quản lý việc cá nhân, việc được giao và việc liên quan tới watch/order/service.</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{total} task</span>
        <button type="button" onClick={onCreate} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Tạo task
        </button>
      </div>
    </div>
  );
}
