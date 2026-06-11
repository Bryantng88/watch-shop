"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { TaskCompletionMode, TaskDomain, TaskPriority } from "@prisma/client";
import { createTaskTypeAction, updateTaskTypeAction } from "../../actions/task-type.actions";
import type { TaskTypeOption, UpsertTaskTypeInput } from "../../server/task-type.types";
import { listTaskCompletionRuleOptions } from "../../server/task-rule-keys";
import {
  TASK_COMPLETION_MODE_LABEL,
  TASK_DOMAIN_LABEL,
  TASK_PRIORITY_LABEL,
} from "../../utils/task-labels";

function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

export default function TaskTypeFormModal({
  open,
  item,
  onClose,
  onSaved,
}: {
  open: boolean;
  item?: TaskTypeOption | null;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<TaskDomain>(TaskDomain.WATCH);
  const [defaultPriority, setDefaultPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [completionMode, setCompletionMode] = useState<TaskCompletionMode>(TaskCompletionMode.MANUAL_CONFIRM);
  const [completionRuleKey, setCompletionRuleKey] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const ruleOptions = useMemo(() => listTaskCompletionRuleOptions(domain), [domain]);
  const selectedRule = ruleOptions.find((rule) => rule.key === completionRuleKey) ?? null;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCode(item?.code ?? "");
    setName(item?.name ?? "");
    setDescription(item?.description ?? "");
    setDomain(item?.domain ?? TaskDomain.WATCH);
    setDefaultPriority(item?.defaultPriority ?? TaskPriority.MEDIUM);
    setCompletionMode(item?.completionMode ?? TaskCompletionMode.MANUAL_CONFIRM);
    setCompletionRuleKey(item?.completionRuleKey ?? "");
    setSortOrder(String(item?.sortOrder ?? 0));
    setIsActive(item?.isActive ?? true);
  }, [open, item]);

  useEffect(() => {
    if (completionMode !== TaskCompletionMode.BUSINESS_RULE) return;
    if (!completionRuleKey) return;
    if (!ruleOptions.some((rule) => rule.key === completionRuleKey)) {
      setCompletionRuleKey("");
    }
  }, [completionMode, completionRuleKey, ruleOptions]);

  if (!open) return null;

  const isEdit = Boolean(item?.id);
  const isBusinessRule = completionMode === TaskCompletionMode.BUSINESS_RULE;

  function submit() {
    const payload: UpsertTaskTypeInput = {
      code: normalizeCode(code),
      name,
      description,
      domain,
      defaultPriority,
      completionMode,
      completionRuleKey: isBusinessRule ? completionRuleKey : null,
      sortOrder: Number(sortOrder || 0),
      isActive,
    };

    if (!payload.code) return setError("Vui lòng nhập mã loại task");
    if (!payload.name.trim()) return setError("Vui lòng nhập tên loại task");
    if (payload.completionMode === TaskCompletionMode.BUSINESS_RULE && !payload.completionRuleKey?.trim()) {
      return setError("Vui lòng chọn business rule cho loại task");
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
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{isEdit ? "Sửa loại task" : "Thêm loại task"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Loại task định nghĩa cách user tạo task và cách system task được hoàn tất tự động theo business event.
          </p>
        </div>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Code</span>
              <input
                value={code}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 font-mono text-sm outline-none focus:border-slate-400"
                placeholder="WATCH_PRICE"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tên loại task</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                placeholder="Watch / Giá bán"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Dùng cho các việc liên quan tới giá bán, deal giá, ngoại lệ giá."
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Domain</span>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as TaskDomain)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
              >
                {Object.values(TaskDomain).map((value) => (
                  <option key={value} value={value}>{TASK_DOMAIN_LABEL[value]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Ưu tiên mặc định</span>
              <select
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value as TaskPriority)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
              >
                {Object.values(TaskPriority).map((value) => (
                  <option key={value} value={value}>{TASK_PRIORITY_LABEL[value]}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Quy tắc hoàn tất task</div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manual task luôn do người xử lý bấm hoàn tất. Business rule chỉ tự hoàn tất cho task có source SYSTEM, không tự đóng manual task.
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Cách hoàn thành</span>
                <select
                  value={completionMode}
                  onChange={(e) => setCompletionMode(e.target.value as TaskCompletionMode)}
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                >
                  {Object.values(TaskCompletionMode).map((value) => (
                    <option key={value} value={value}>{TASK_COMPLETION_MODE_LABEL[value]}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Business rule</span>
                <select
                  disabled={!isBusinessRule}
                  value={completionRuleKey}
                  onChange={(e) => setCompletionRuleKey(e.target.value)}
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">Chọn rule</option>
                  {ruleOptions.map((rule) => (
                    <option key={rule.key} value={rule.key}>{rule.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {isBusinessRule ? (
              <div className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-slate-600 ring-1 ring-slate-200">
                {selectedRule ? (
                  <>
                    <div className="font-semibold text-slate-900">{selectedRule.label}</div>
                    <div>{selectedRule.description}</div>
                    <div className="mt-1 font-mono text-[11px] text-slate-400">
                      Required events: {selectedRule.requiredEvents.join(" → ")}
                    </div>
                  </>
                ) : (
                  "Chọn rule để system task có thể tự hoàn tất khi nghiệp vụ liên quan phát sinh event tương ứng."
                )}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Sort</span>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <label className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Đang sử dụng
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={pending} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>
          <button type="button" onClick={submit} disabled={pending} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu"}</button>
        </div>
      </div>
    </div>
  );
}
