"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  TaskCompletionMode,
  TaskExecutionTargetType,
  TechnicalActionMode,
} from "@prisma/client";
import { createTaskActionSettingAction, updateTaskActionSettingAction } from "../../actions/task-action.actions";
import type { TaskActionOption, UpsertTaskActionInput } from "../../server/task-action.types";
import type { TaskTypeOption } from "../../server/task-type.types";
import { listTaskCompletionRuleOptions } from "../../server/task-rule-keys";
import { TASK_COMPLETION_MODE_LABEL } from "../../utils/task-labels";

function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
}

function safeJson(value: string) {
  const clean = value.trim();
  if (!clean) return null;
  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("Metadata JSON không hợp lệ");
  }
}

export default function TaskActionFormModal({
  open,
  item,
  taskTypes,
  defaultTaskTypeId,
  onClose,
  onSaved,
}: {
  open: boolean;
  item?: (TaskActionOption & { taskType?: { domain?: any } }) | null;
  taskTypes: TaskTypeOption[];
  defaultTaskTypeId?: string | null;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [taskTypeId, setTaskTypeId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [completionMode, setCompletionMode] = useState<TaskCompletionMode>(TaskCompletionMode.MANUAL_CONFIRM);
  const [completionRuleKey, setCompletionRuleKey] = useState("");
  const [targetType, setTargetType] = useState("");
  const [serviceCatalogId, setServiceCatalogId] = useState("");
  const [technicalDetailCatalogId, setTechnicalDetailCatalogId] = useState("");
  const [supplyCatalogId, setSupplyCatalogId] = useState("");
  const [mechanicalPartCatalogId, setMechanicalPartCatalogId] = useState("");
  const [technicalActionMode, setTechnicalActionMode] = useState("");
  const [defaultTitleTemplate, setDefaultTitleTemplate] = useState("");
  const [defaultDescriptionTemplate, setDefaultDescriptionTemplate] = useState("");
  const [metadataJson, setMetadataJson] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const selectedTaskType = useMemo(() => taskTypes.find((type) => type.id === taskTypeId) ?? null, [taskTypes, taskTypeId]);
  const ruleOptions = useMemo(() => listTaskCompletionRuleOptions(selectedTaskType?.domain ?? null), [selectedTaskType?.domain]);
  const isBusinessRule = completionMode === TaskCompletionMode.BUSINESS_RULE;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTaskTypeId(item?.taskTypeId ?? defaultTaskTypeId ?? taskTypes[0]?.id ?? "");
    setCode(item?.code ?? "");
    setName(item?.name ?? "");
    setDescription(item?.description ?? "");
    setCompletionMode(item?.completionMode ?? TaskCompletionMode.MANUAL_CONFIRM);
    setCompletionRuleKey(item?.completionRuleKey ?? "");
    setTargetType(item?.targetType ?? "");
    setServiceCatalogId(item?.serviceCatalogId ?? "");
    setTechnicalDetailCatalogId(item?.technicalDetailCatalogId ?? "");
    setSupplyCatalogId(item?.supplyCatalogId ?? "");
    setMechanicalPartCatalogId(item?.mechanicalPartCatalogId ?? "");
    setTechnicalActionMode(item?.technicalActionMode ?? "");
    setDefaultTitleTemplate(item?.defaultTitleTemplate ?? "");
    setDefaultDescriptionTemplate(item?.defaultDescriptionTemplate ?? "");
    setMetadataJson(item?.metadataJson ? JSON.stringify(item.metadataJson, null, 2) : "");
    setSortOrder(String(item?.sortOrder ?? 0));
    setIsActive(item?.isActive ?? true);
  }, [open, item, defaultTaskTypeId, taskTypes]);

  useEffect(() => {
    if (!isBusinessRule) setCompletionRuleKey("");
    else if (completionRuleKey && !ruleOptions.some((rule) => rule.key === completionRuleKey)) setCompletionRuleKey("");
  }, [isBusinessRule, completionRuleKey, ruleOptions]);

  if (!open) return null;

  function submit() {
    try {
      const payload: UpsertTaskActionInput = {
        taskTypeId,
        code: normalizeCode(code),
        name,
        description,
        completionMode,
        completionRuleKey: isBusinessRule ? completionRuleKey : null,
        targetType: targetType ? (targetType as TaskExecutionTargetType) : null,
        serviceCatalogId: serviceCatalogId || null,
        technicalDetailCatalogId: technicalDetailCatalogId || null,
        supplyCatalogId: supplyCatalogId || null,
        mechanicalPartCatalogId: mechanicalPartCatalogId || null,
        technicalActionMode: technicalActionMode ? (technicalActionMode as TechnicalActionMode) : null,
        defaultTitleTemplate,
        defaultDescriptionTemplate,
        metadataJson: safeJson(metadataJson),
        sortOrder: Number(sortOrder || 0),
        isActive,
      };

      if (!payload.taskTypeId) return setError("Vui lòng chọn loại task");
      if (!payload.code) return setError("Vui lòng nhập code action");
      if (!payload.name.trim()) return setError("Vui lòng nhập tên action");
      if (payload.completionMode === TaskCompletionMode.BUSINESS_RULE && !payload.completionRuleKey) return setError("Vui lòng chọn rule hoàn tất");

      startTransition(async () => {
        try {
          if (item?.id) await updateTaskActionSettingAction(item.id, payload);
          else await createTaskActionSettingAction(payload);
          onSaved?.();
          onClose();
        } catch (err: any) {
          setError(err?.message || "Không thể lưu action");
        }
      });
    } catch (err: any) {
      setError(err?.message || "Không thể lưu action");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{item?.id ? "Sửa action" : "Thêm action"}</h2>
          <p className="mt-1 text-sm text-slate-500">Action là việc cụ thể bên trong Task Type, quyết định nghiệp vụ tạo ra và rule hoàn tất.</p>
        </div>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_1fr]">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Task Type</span>
              <select value={taskTypeId} onChange={(e) => setTaskTypeId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {taskTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Code</span>
              <input value={code} onChange={(e) => setCode(normalizeCode(e.target.value))} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 font-mono text-sm" placeholder="STRAP_REPLACE" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tên action</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" placeholder="Thay dây" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" />
          </label>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Nghiệp vụ sinh ra</div>
            <p className="mt-1 text-xs text-slate-500">Các ID catalog có thể để trống trước, sau này nối dropdown từ service catalogs nếu cần.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block"><span className="text-sm font-medium text-slate-700">Target type</span><select value={targetType} onChange={(e) => setTargetType(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"><option value="">Không bắt buộc</option>{Object.values(TaskExecutionTargetType).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Technical action mode</span><select value={technicalActionMode} onChange={(e) => setTechnicalActionMode(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"><option value="">Không bắt buộc</option>{Object.values(TechnicalActionMode).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Service catalog ID</span><input value={serviceCatalogId} onChange={(e) => setServiceCatalogId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm" /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Technical detail catalog ID</span><input value={technicalDetailCatalogId} onChange={(e) => setTechnicalDetailCatalogId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm" /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Supply catalog ID</span><input value={supplyCatalogId} onChange={(e) => setSupplyCatalogId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm" /></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Mechanical part catalog ID</span><input value={mechanicalPartCatalogId} onChange={(e) => setMechanicalPartCatalogId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm" /></label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Rule hoàn tất cho action</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block"><span className="text-sm font-medium text-slate-700">Cách hoàn thành</span><select value={completionMode} onChange={(e) => setCompletionMode(e.target.value as TaskCompletionMode)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm">{Object.values(TaskCompletionMode).map((value) => <option key={value} value={value}>{TASK_COMPLETION_MODE_LABEL[value]}</option>)}</select></label>
              <label className="block"><span className="text-sm font-medium text-slate-700">Business rule</span><select disabled={!isBusinessRule} value={completionRuleKey} onChange={(e) => setCompletionRuleKey(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"><option value="">Chọn rule</option>{ruleOptions.map((rule) => <option key={rule.key} value={rule.key}>{rule.label}</option>)}</select></label>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block"><span className="text-sm font-medium text-slate-700">Title template</span><input value={defaultTitleTemplate} onChange={(e) => setDefaultTitleTemplate(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" placeholder="{{title}} - Thay dây" /></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">Sort</span><input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" /></label>
          </div>

          <label className="block"><span className="text-sm font-medium text-slate-700">Description template</span><textarea value={defaultDescriptionTemplate} onChange={(e) => setDefaultDescriptionTemplate(e.target.value)} rows={2} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="block"><span className="text-sm font-medium text-slate-700">Metadata JSON</span><textarea value={metadataJson} onChange={(e) => setMetadataJson(e.target.value)} rows={4} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 font-mono text-xs" placeholder='{ "issueTitle": "Thay dây" }' /></label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />Đang sử dụng</label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={pending} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>
          <button type="button" onClick={submit} disabled={pending} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu action"}</button>
        </div>
      </div>
    </div>
  );
}
