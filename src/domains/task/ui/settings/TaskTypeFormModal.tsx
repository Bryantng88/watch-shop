"use client";

import { useEffect, useState, useTransition } from "react";
import { TaskCompletionMode, TaskDomain, TaskKind, TaskPriority } from "@prisma/client";
import { createTaskTypeAction, updateTaskTypeAction } from "../../actions/task-type.actions";
import type { TaskTypeOption, UpsertTaskTypeInput } from "../../server/task-type.types";
import { TASK_COMPLETION_MODE_LABEL, TASK_DOMAIN_LABEL, TASK_KIND_LABEL, TASK_PRIORITY_LABEL } from "../../utils/task-labels";

function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

export default function TaskTypeFormModal({ open, item, onClose, onSaved }: { open: boolean; item?: TaskTypeOption | null; onClose: () => void; onSaved?: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<TaskDomain>(TaskDomain.WATCH);
  const [legacyKind, setLegacyKind] = useState<TaskKind>(TaskKind.OTHER);
  const [defaultPriority, setDefaultPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [completionMode, setCompletionMode] = useState<TaskCompletionMode>(TaskCompletionMode.MANUAL_CONFIRM);
  const [completionRuleKey, setCompletionRuleKey] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCode(item?.code ?? "");
    setName(item?.name ?? "");
    setDescription(item?.description ?? "");
    setDomain(item?.domain ?? TaskDomain.WATCH);
    setLegacyKind(item?.legacyKind ?? TaskKind.OTHER);
    setDefaultPriority(item?.defaultPriority ?? TaskPriority.MEDIUM);
    setCompletionMode(item?.completionMode ?? TaskCompletionMode.MANUAL_CONFIRM);
    setCompletionRuleKey(item?.completionRuleKey ?? "");
    setSortOrder(String(item?.sortOrder ?? 0));
    setIsActive(item?.isActive ?? true);
  }, [open, item]);

  if (!open) return null;

  const isEdit = Boolean(item?.id);
  const businessRuleDisabled = completionMode === TaskCompletionMode.BUSINESS_RULE;

  function submit() {
    const payload: UpsertTaskTypeInput = {
      code: normalizeCode(code),
      name,
      description,
      domain,
      legacyKind,
      defaultPriority,
      completionMode,
      completionRuleKey: completionMode === TaskCompletionMode.BUSINESS_RULE ? completionRuleKey : null,
      sortOrder: Number(sortOrder || 0),
      isActive,
    };

    if (!payload.code) return setError("Vui lòng nhập mã loại task");
    if (!payload.name.trim()) return setError("Vui lòng nhập tên loại task");
    if (payload.completionMode === TaskCompletionMode.BUSINESS_RULE && !payload.completionRuleKey?.trim()) {
      return setError("Business rule sẽ làm ở phase sau. Hiện tại nên dùng Manual Confirm.");
    }

    startTransition(async () => {
      try {
        if (item?.id) await updateTaskTypeAction(item.id, payload);
        else await createTaskTypeAction(payload);
        onSaved?.();
        onClose();
      } catch (err: any) {
        setError(err?.message || "Không thể lưu loại task");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{isEdit ? "Sửa loại task" : "Thêm loại task"}</h2>
          <p className="mt-1 text-sm text-slate-500">Loại task là danh mục để user tạo task thực tế như WATCH_IMAGE, WATCH_CLEAN, WATCH_PRICE.</p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Code</span>
              <input value={code} onChange={(e) => setCode(normalizeCode(e.target.value))} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 font-mono text-sm outline-none focus:border-slate-400" placeholder="WATCH_IMAGE" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tên hiển thị</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Hình ảnh đồng hồ" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" placeholder="Dùng cho các việc liên quan tới bổ sung/chỉnh hình ảnh watch." />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Domain</span>
              <select value={domain} onChange={(e) => setDomain(e.target.value as TaskDomain)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskDomain).map((value) => <option key={value} value={value}>{TASK_DOMAIN_LABEL[value]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Legacy kind</span>
              <select value={legacyKind} onChange={(e) => setLegacyKind(e.target.value as TaskKind)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskKind).map((value) => <option key={value} value={value}>{TASK_KIND_LABEL[value]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Ưu tiên mặc định</span>
              <select value={defaultPriority} onChange={(e) => setDefaultPriority(e.target.value as TaskPriority)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskPriority).map((value) => <option key={value} value={value}>{TASK_PRIORITY_LABEL[value]}</option>)}
              </select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px]">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Cách hoàn thành</span>
              <select value={completionMode} onChange={(e) => setCompletionMode(e.target.value as TaskCompletionMode)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskCompletionMode).map((value) => <option key={value} value={value}>{TASK_COMPLETION_MODE_LABEL[value]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Business rule key</span>
              <input disabled={completionMode !== TaskCompletionMode.BUSINESS_RULE} value={completionRuleKey} onChange={(e) => setCompletionRuleKey(e.target.value.toUpperCase())} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 font-mono text-sm outline-none disabled:bg-slate-50 disabled:text-slate-400" placeholder="Phase sau" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Sort</span>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
            </label>
          </div>

          {businessRuleDisabled ? <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800">Business Rule chỉ nên bật khi rule engine đã triển khai. Phase hiện tại ưu tiên Manual Confirm.</div> : null}

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Đang sử dụng
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={pending} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>
          <button type="button" onClick={submit} disabled={pending} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu"}</button>
        </div>
      </div>
    </div>
  );
}
