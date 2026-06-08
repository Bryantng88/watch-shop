"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Settings2 } from "lucide-react";
import { TaskDomain } from "@prisma/client";
import type { TaskTypeOption } from "../server/task-type.types";
import { TASK_COMPLETION_MODE_LABEL, TASK_DOMAIN_LABEL, TASK_KIND_LABEL, TASK_PRIORITY_LABEL } from "../utils/task-labels";
import TaskTypeFormModal from "../ui/settings/TaskTypeFormModal";

type Props = {
  items: TaskTypeOption[];
};

function statusBadge(isActive: boolean) {
  return isActive
    ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
    : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Inactive</span>;
}

export default function TaskTypeSettingsClient({ items }: Props) {
  const router = useRouter();
  const [domain, setDomain] = useState<TaskDomain | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskTypeOption | null>(null);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return items.filter((item) => {
      if (domain !== "ALL" && item.domain !== domain) return false;
      if (!keyword) return true;
      return [item.code, item.name, item.description ?? ""].some((value) => value.toLowerCase().includes(keyword));
    });
  }, [items, domain, q]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: TaskTypeOption) {
    setEditing(item);
    setModalOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Settings2 className="h-3.5 w-3.5" /> Task Settings
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Task Types</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Quản lý danh mục loại task để user có thể tạo công việc thực tế như WATCH_IMAGE, WATCH_CLEAN, WATCH_PRICE mà không cần sửa code.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Thêm loại task
        </button>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm code, tên, mô tả..." className="h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
          <select value={domain} onChange={(e) => setDomain(e.target.value as TaskDomain | "ALL")} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="ALL">Tất cả domain</option>
            {Object.values(TaskDomain).map((value) => <option key={value} value={value}>{TASK_DOMAIN_LABEL[value]}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[160px_1.2fr_120px_150px_170px_100px_90px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div>Code</div>
          <div>Tên</div>
          <div>Domain</div>
          <div>Legacy kind</div>
          <div>Completion</div>
          <div>Priority</div>
          <div>Status</div>
        </div>

        {filtered.length ? filtered.map((item) => (
          <button key={item.id} type="button" onClick={() => openEdit(item)} className="grid w-full grid-cols-[160px_1.2fr_120px_150px_170px_100px_90px] gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm transition hover:bg-slate-50 last:border-b-0">
            <div className="font-mono text-xs font-semibold text-slate-700">{item.code}</div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-950">{item.name}</div>
              {item.description ? <div className="mt-0.5 truncate text-xs text-slate-500">{item.description}</div> : null}
            </div>
            <div className="text-slate-600">{TASK_DOMAIN_LABEL[item.domain]}</div>
            <div className="truncate text-slate-600">{TASK_KIND_LABEL[item.legacyKind]}</div>
            <div>
              <div className="text-slate-700">{TASK_COMPLETION_MODE_LABEL[item.completionMode]}</div>
              {item.completionRuleKey ? <div className="mt-0.5 font-mono text-[11px] text-slate-400">{item.completionRuleKey}</div> : null}
            </div>
            <div className="text-slate-600">{TASK_PRIORITY_LABEL[item.defaultPriority]}</div>
            <div>{statusBadge(item.isActive)}</div>
          </button>
        )) : (
          <div className="px-4 py-10 text-center text-sm text-slate-500">Chưa có loại task phù hợp bộ lọc.</div>
        )}
      </div>

      <TaskTypeFormModal open={modalOpen} item={editing} onClose={() => setModalOpen(false)} onSaved={() => router.refresh()} />
    </div>
  );
}
