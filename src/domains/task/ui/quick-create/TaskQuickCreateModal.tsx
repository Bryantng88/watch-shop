"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { TaskDomain, TaskMode, TaskPriority } from "@prisma/client";
import { createTaskAction, updateTaskAction } from "../../actions/task.actions";
import type { TaskWithRelations } from "../../server/task.repo";
import type { CreateTaskInput, TaskDomainLinksInput } from "../../server/task.types";
import type { TaskTypeOption } from "../../server/task-type.types";
import { TASK_DOMAIN_LABEL, TASK_MODE_LABEL, TASK_PRIORITY_LABEL } from "../../utils/task-labels";

export type TaskUserOption = { id: string; name?: string | null; email?: string | null };
export type TaskQuickCreateContext = TaskDomainLinksInput & {
  domain?: TaskDomain;
  taskTypeId?: string | null;
  taskActionId?: string | null;
  mode?: TaskMode;
  titlePreset?: string;
  descriptionPreset?: string;
};

function userLabel(user: TaskUserOption) {
  return user.name || user.email || user.id;
}

function toDateInput(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}


function renderTemplate(template: string, context?: TaskQuickCreateContext | null) {
  const map: Record<string, string> = {
    title: context?.titlePreset ?? "",
    description: context?.descriptionPreset ?? "",
  };
  return template.replace(/\{\{\s*(title|description)\s*\}\}/g, (_m, key) => map[key] ?? "");
}

function inferDomain(context?: TaskQuickCreateContext | null) {
  if (context?.domain) return context.domain;
  if (context?.watchId) return TaskDomain.WATCH;
  if (context?.orderId) return TaskDomain.ORDER;
  if (context?.shipmentId) return TaskDomain.SHIPMENT;
  if (context?.serviceRequestId) return TaskDomain.SERVICE;
  if (context?.technicalIssueId) return TaskDomain.TECHNICAL_ISSUE;
  if (context?.paymentId) return TaskDomain.PAYMENT;
  if (context?.acquisitionId) return TaskDomain.ACQUISITION;
  if (context?.workCaseId) return TaskDomain.WORK_CASE;
  return TaskDomain.GENERAL;
}

export default function TaskQuickCreateModal({ open, users, taskTypes = [], currentUserId, context, editTask, onClose, onSaved }: { open: boolean; users: TaskUserOption[]; taskTypes?: TaskTypeOption[]; currentUserId: string; context?: TaskQuickCreateContext | null; editTask?: TaskWithRelations | null; onClose: () => void; onSaved?: () => void }) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<TaskDomain>(TaskDomain.GENERAL);
  const [taskTypeId, setTaskTypeId] = useState("");
  const [taskActionId, setTaskActionId] = useState("");
  const [mode, setMode] = useState<TaskMode>(TaskMode.NORMAL);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assignedToUserId, setAssignedToUserId] = useState(currentUserId);
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  type ServiceExecutionMode = "SR_ONLY" | "SR_WITH_TECHNICAL_ISSUE";

  const [serviceMode, setServiceMode] =
    useState<ServiceExecutionMode>("SR_ONLY");
  const isEdit = Boolean(editTask);
  const filteredTaskTypes = useMemo(() => taskTypes.filter((item) => item.isActive && item.domain === domain), [taskTypes, domain]);
  const filteredTaskActions = useMemo(() => {
    const selected = taskTypes.find((item) => item.id === taskTypeId);
    return (selected?.taskAction ?? []).filter((item: any) => item.isActive);
  }, [taskTypes, taskTypeId]);

  useEffect(() => {
    if (!open) return;
    const nextDomain = editTask?.domain ?? inferDomain(context);
    setError(null);
    setTitle(editTask?.title ?? context?.titlePreset ?? "");
    setDescription(editTask?.description ?? context?.descriptionPreset ?? "");
    setDomain(nextDomain);
    setTaskTypeId(editTask?.taskTypeId ?? context?.taskTypeId ?? "");
    setTaskActionId((editTask as any)?.taskActionId ?? context?.taskActionId ?? "");
    setMode(editTask?.mode ?? context?.mode ?? TaskMode.NORMAL);
    setPriority(editTask?.priority ?? TaskPriority.MEDIUM);
    setAssignedToUserId(editTask?.assignedToUserId ?? currentUserId);
    setDueAt(toDateInput(editTask?.dueAt));
  }, [open, editTask, context, currentUserId]);

  useEffect(() => {
    if (!taskTypeId) return;
    const selected = taskTypes.find((item) => item.id === taskTypeId);
    if (selected && selected.domain !== domain) {
      setTaskTypeId("");
      setTaskActionId("");
    }
  }, [domain, taskTypeId, taskTypes]);

  useEffect(() => {
    if (!taskActionId) return;
    if (!filteredTaskActions.some((item: any) => item.id === taskActionId)) setTaskActionId("");
  }, [taskActionId, filteredTaskActions]);

  useEffect(() => {
    const action: any = filteredTaskActions.find((item: any) => item.id === taskActionId);
    if (!action || editTask) return;
    if (action.defaultTitleTemplate && !title.trim()) setTitle(renderTemplate(action.defaultTitleTemplate, context));
    if (action.defaultDescriptionTemplate && !description.trim()) setDescription(renderTemplate(action.defaultDescriptionTemplate, context));
  }, [taskActionId]);

  const links = useMemo<TaskDomainLinksInput>(() => ({
    watchId: editTask?.watchId ?? context?.watchId ?? null,
    orderId: editTask?.orderId ?? context?.orderId ?? null,
    shipmentId: editTask?.shipmentId ?? context?.shipmentId ?? null,
    acquisitionId: editTask?.acquisitionId ?? context?.acquisitionId ?? null,
    serviceRequestId: editTask?.serviceRequestId ?? context?.serviceRequestId ?? null,
    technicalIssueId: editTask?.technicalIssueId ?? context?.technicalIssueId ?? null,
    paymentId: editTask?.paymentId ?? context?.paymentId ?? null,
    workCaseId: editTask?.workCaseId ?? context?.workCaseId ?? null,
  }), [editTask, context]);

  function submit() {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề task");
      return;
    }

    const payload: CreateTaskInput = {
      title,
      description,
      domain,
      taskTypeId: taskTypeId || null,
      taskActionId: taskActionId || null,
      mode,
      priority,
      assignedToUserId,
      dueAt: dueAt || null,
      ...links,
    };

    startTransition(async () => {
      try {
        if (editTask) await updateTaskAction(editTask.id, payload);
        else await createTaskAction(payload);
        onSaved?.();
        onClose();
      } catch (err: any) {
        setError(err?.message || "Không thể lưu task");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{isEdit ? "Sửa task" : "Tạo task"}</h2>
          <p className="mt-1 text-sm text-slate-500">Task là hướng xử lý được giao. Người nhận task sẽ thực thi nghiệp vụ liên quan ở bước sau.</p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Ví dụ: Xử lý yêu cầu giao thử không cọc" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Domain</span>
              <select value={domain} onChange={(e) => setDomain(e.target.value as TaskDomain)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskDomain).map((item) => <option key={item} value={item}>{TASK_DOMAIN_LABEL[item]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Loại task</span>
              <select value={taskTypeId} onChange={(e) => setTaskTypeId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                <option value="">Chưa chọn loại cụ thể</option>
                {filteredTaskTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Action</span>
              <select value={taskActionId} onChange={(e) => setTaskActionId(e.target.value)} disabled={!taskTypeId || !filteredTaskActions.length} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400">
                <option value="">{taskTypeId ? "Chưa chọn action cụ thể" : "Chọn loại task trước"}</option>
                {filteredTaskActions.map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Kiểu xử lý</span>
              <select value={mode} onChange={(e) => setMode(e.target.value as TaskMode)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskMode).map((item) => <option key={item} value={item}>{TASK_MODE_LABEL[item]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Ưu tiên</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskPriority).map((item) => <option key={item} value={item}>{TASK_PRIORITY_LABEL[item]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Giao cho</span>
              <select value={assignedToUserId} onChange={(e) => setAssignedToUserId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {users.map((user) => <option key={user.id} value={user.id}>{userLabel(user)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Due date</span>
              <input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm" />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={pending} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>
          <button type="button" onClick={submit} disabled={pending} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu task"}</button>
        </div>
      </div>
    </div>
  );
}
