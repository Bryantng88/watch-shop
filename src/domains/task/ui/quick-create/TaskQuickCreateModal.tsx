"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { TaskKind, TaskPriority } from "@prisma/client";
import { createTaskAction, updateTaskAction } from "../../actions/task.actions";
import type { TaskWithRelations } from "../../server/task.repo";
import type { TaskTypeOption } from "../../server/task-type.types";
import type { CreateTaskInput, TaskDomainLinksInput } from "../../server/task.types";
import { TASK_KIND_LABEL, TASK_PRIORITY_LABEL } from "../../utils/task-labels";

export type TaskUserOption = { id: string; name?: string | null; email?: string | null };
export type TaskQuickCreateContext = TaskDomainLinksInput & {
  kind?: TaskKind;
  taskTypeId?: string | null;
  taskTypeCode?: string | null;
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

function normalizeCode(value?: string | null) {
  return String(value ?? "").trim().toUpperCase();
}

export default function TaskQuickCreateModal({
  open,
  users,
  taskTypes = [],
  currentUserId,
  context,
  editTask,
  onClose,
  onSaved,
}: {
  open: boolean;
  users: TaskUserOption[];
  taskTypes?: TaskTypeOption[];
  currentUserId: string;
  context?: TaskQuickCreateContext | null;
  editTask?: TaskWithRelations | null;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskTypeId, setTaskTypeId] = useState<string>("");
  const [kind, setKind] = useState<TaskKind>(TaskKind.PERSONAL);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assignedToUserId, setAssignedToUserId] = useState(currentUserId);
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(editTask);

  const contextTaskTypeId = useMemo(() => {
    if (context?.taskTypeId) return context.taskTypeId;

    const code = normalizeCode(context?.taskTypeCode);
    if (!code) return "";

    return taskTypes.find((item) => normalizeCode(item.code) === code)?.id ?? "";
  }, [context?.taskTypeCode, context?.taskTypeId, taskTypes]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTitle(editTask?.title ?? context?.titlePreset ?? "");
    setDescription(editTask?.description ?? context?.descriptionPreset ?? "");
    setTaskTypeId(editTask?.taskTypeId ?? contextTaskTypeId ?? "");
    setKind(editTask?.kind ?? context?.kind ?? TaskKind.PERSONAL);
    setPriority(editTask?.priority ?? TaskPriority.MEDIUM);
    setAssignedToUserId(editTask?.assignedToUserId ?? currentUserId);
    setDueAt(toDateInput(editTask?.dueAt));
  }, [open, editTask, context, contextTaskTypeId, currentUserId]);

  const selectedTaskType = useMemo(
    () => taskTypes.find((item) => item.id === taskTypeId) ?? null,
    [taskTypes, taskTypeId],
  );

  useEffect(() => {
    if (!selectedTaskType || editTask) return;
    setKind(selectedTaskType.legacyKind);
    setPriority(selectedTaskType.defaultPriority);
  }, [selectedTaskType, editTask]);

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
      taskTypeId: taskTypeId || null,
      kind,
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
          <p className="mt-1 text-sm text-slate-500">Task được gắn với đối tượng nghiệp vụ để người xử lý mở đúng màn hình cần thao tác.</p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Ví dụ: Chụp gallery cho Seiko 7430" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Loại task</span>
              <select value={taskTypeId} onChange={(e) => setTaskTypeId(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                <option value="">Loại thủ công / Legacy</option>
                {taskTypes.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name}</option>)}
              </select>
              {selectedTaskType ? <p className="mt-1 text-xs text-slate-500">Legacy kind: {TASK_KIND_LABEL[selectedTaskType.legacyKind]}</p> : null}
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
