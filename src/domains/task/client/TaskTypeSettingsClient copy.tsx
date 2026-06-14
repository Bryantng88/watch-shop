"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Settings2, Zap } from "lucide-react";
import { TaskDomain } from "@prisma/client";
import type { TaskTypeOption } from "../server/task-type.types";
import type { TaskActionOption } from "../server/task-action.types";
import { getTaskCompletionRuleLabel } from "../server/task-rule-keys";
import {
  TASK_COMPLETION_MODE_LABEL,
  TASK_DOMAIN_LABEL,
  TASK_PRIORITY_LABEL,
} from "../utils/task-labels";
import TaskTypeFormModal from "../ui/settings/TaskTypeFormModal";
import TaskActionFormModal from "../ui/settings/TaskActionFormModal";

type Props = { items: TaskTypeOption[] };

function statusBadge(isActive: boolean) {
  return isActive ? (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Inactive</span>
  );
}

export default function TaskTypeSettingsClient({ items }: Props) {
  const router = useRouter();
  const [domain, setDomain] = useState<TaskDomain | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<TaskTypeOption | null>(null);
  const [editingAction, setEditingAction] = useState<TaskActionOption | null>(null);
  const [defaultTaskTypeId, setDefaultTaskTypeId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return items.filter((item) => {
      if (domain !== "ALL" && item.domain !== domain) return false;
      if (!keyword) return true;
      return [
        item.code,
        item.name,
        item.description ?? "",
        item.completionRuleKey ?? "",
        ...(item.taskAction ?? []).flatMap((action) => [action.code, action.name, action.description ?? "", action.completionRuleKey ?? ""]),
      ].some((value) => value.toLowerCase().includes(keyword));
    });
  }, [items, domain, q]);

  function openCreateType() {
    setEditingType(null);
    setTypeModalOpen(true);
  }

  function openEditType(item: TaskTypeOption) {
    setEditingType(item);
    setTypeModalOpen(true);
  }

  function openCreateAction(taskTypeId?: string) {
    setEditingAction(null);
    setDefaultTaskTypeId(taskTypeId ?? null);
    setActionModalOpen(true);
  }

  function openEditAction(action: TaskActionOption) {
    setEditingAction(action);
    setDefaultTaskTypeId(action.taskTypeId);
    setActionModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Settings2 className="h-3.5 w-3.5" /> Task Settings
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Task Types & Actions</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Task Type là nhóm công việc. Action là việc cụ thể bên trong nhóm đó, quyết định nghiệp vụ tạo ra và rule hoàn tất.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openCreateAction()} className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            <Zap className="h-4 w-4" /> Thêm action
          </button>
          <button type="button" onClick={openCreateType} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Thêm loại task
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm type/action/rule..." className="h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
          <select value={domain} onChange={(e) => setDomain(e.target.value as TaskDomain | "ALL")} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="ALL">Tất cả domain</option>
            {Object.values(TaskDomain).map((value) => <option key={value} value={value}>{TASK_DOMAIN_LABEL[value]}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[160px_1.1fr_130px_220px_120px_90px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div>Code</div><div>Tên</div><div>Domain</div><div>Completion mặc định</div><div>Priority</div><div>Status</div>
        </div>

        {filtered.length ? filtered.map((item) => (
          <div key={item.id} className="border-b border-slate-100 last:border-b-0">
            <button type="button" onClick={() => openEditType(item)} className="grid w-full grid-cols-[160px_1.1fr_130px_220px_120px_90px] gap-3 px-4 py-3 text-left text-sm transition hover:bg-slate-50">
              <div className="font-mono text-xs font-semibold text-slate-700">{item.code}</div>
              <div className="min-w-0"><div className="truncate font-semibold text-slate-950">{item.name}</div>{item.description ? <div className="mt-0.5 truncate text-xs text-slate-500">{item.description}</div> : null}</div>
              <div className="text-slate-600">{TASK_DOMAIN_LABEL[item.domain]}</div>
              <div><div className="text-slate-700">{TASK_COMPLETION_MODE_LABEL[item.completionMode]}</div>{item.completionRuleKey ? <div className="mt-0.5 font-mono text-[11px] text-slate-400">{getTaskCompletionRuleLabel(item.completionRuleKey)}</div> : null}</div>
              <div className="text-slate-600">{TASK_PRIORITY_LABEL[item.defaultPriority]}</div>
              <div>{statusBadge(item.isActive)}</div>
            </button>

            <div className="bg-slate-50/60 px-4 pb-4">
              <div className="mb-2 flex items-center justify-between gap-2 pl-[160px]">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Actions ({item.taskAction?.length ?? 0})</div>
                <button type="button" onClick={() => openCreateAction(item.id)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">+ Action</button>
              </div>
              {item.taskAction?.length ? (
                <div className="ml-[160px] grid gap-2">
                  {item.taskAction.map((action) => (
                    <button key={action.id} type="button" onClick={() => openEditAction(action)} className="grid grid-cols-[160px_1fr_220px_90px] gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs hover:border-slate-300 hover:shadow-sm">
                      <div className="font-mono font-semibold text-slate-700">{action.code}</div>
                      <div><div className="font-semibold text-slate-900">{action.name}</div>{action.description ? <div className="mt-0.5 text-slate-500">{action.description}</div> : null}</div>
                      <div className="text-slate-500">{action.completionRuleKey ? getTaskCompletionRuleLabel(action.completionRuleKey) : TASK_COMPLETION_MODE_LABEL[action.completionMode]}</div>
                      <div>{statusBadge(action.isActive)}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="ml-[160px] rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-3 text-xs text-slate-400">Chưa có action cụ thể cho loại task này.</div>
              )}
            </div>
          </div>
        )) : <div className="px-4 py-10 text-center text-sm text-slate-500">Chưa có loại task phù hợp bộ lọc.</div>}
      </div>

      <TaskTypeFormModal open={typeModalOpen} item={editingType} onClose={() => setTypeModalOpen(false)} onSaved={() => router.refresh()} />
      <TaskActionFormModal open={actionModalOpen} item={editingAction} taskTypes={items} defaultTaskTypeId={defaultTaskTypeId} onClose={() => setActionModalOpen(false)} onSaved={() => router.refresh()} />
    </div>
  );
}
