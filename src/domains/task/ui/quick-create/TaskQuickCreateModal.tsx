"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { TaskKind, TaskPriority } from "@prisma/client";
import { createTaskAction, updateTaskAction } from "../../actions/task.actions";
import type { TaskWithRelations } from "../../server/core/task.repo";
import type { CreateTaskInput, TaskDomainLinksInput } from "../../server/task.types";
import { TASK_KIND_LABEL, TASK_PRIORITY_LABEL } from "../../utils/task-labels";

export type TaskUserOption = { id: string; name?: string | null; email?: string | null };
export type TaskQuickCreateContext = TaskDomainLinksInput & {
  kind?: TaskKind;
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

function hasBusinessContext(context?: TaskQuickCreateContext | null) {
  return Boolean(
    context?.watchId ||
    context?.orderId ||
    context?.shipmentId ||
    context?.acquisitionId ||
    context?.serviceRequestId ||
    context?.technicalIssueId ||
    context?.paymentId ||
    context?.workCaseId,
  );
}

export default function TaskQuickCreateModal({
  open,
  users,
  currentUserId,
  context,
  editTask,
  onClose,
  onSaved,
}: {
  open: boolean;
  users: TaskUserOption[];
  currentUserId: string;
  context?: TaskQuickCreateContext | null;
  editTask?: TaskWithRelations | null;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<TaskKind>(TaskKind.BUSINESS);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assignedToUserId, setAssignedToUserId] = useState(currentUserId);
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(editTask);
  const lockedBusiness = hasBusinessContext(context);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setTitle(editTask?.title ?? context?.titlePreset ?? "");
    setDescription(editTask?.description ?? context?.descriptionPreset ?? "");
    setKind((editTask as any)?.kind ?? context?.kind ?? (hasBusinessContext(context) ? TaskKind.BUSINESS : TaskKind.PERSONAL));
    setPriority(editTask?.priority ?? TaskPriority.MEDIUM);
    setAssignedToUserId(editTask?.assignedToUserId ?? currentUserId);
    setDueAt(toDateInput(editTask?.dueAt));
  }, [open, editTask, context, currentUserId]);

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
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Vui lòng nhập tiêu đề task");
      return;
    }

    const finalKind = lockedBusiness ? TaskKind.BUSINESS : kind;

    const payload: CreateTaskInput = {
      title: cleanTitle,
      description,
      kind: finalKind,
      priority,
      assignedToUserId: finalKind === TaskKind.PERSONAL ? currentUserId : assignedToUserId,
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
      <div className="w-full max-w-xl rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{isEdit ? "Sửa task" : "Tạo task"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Task chỉ là việc được giao. Nghiệp vụ sẽ phát sinh ở từng dòng checklist khi cần.
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              placeholder="Ví dụ: Báo giá cho khách"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Loại task</span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as TaskKind)}
                disabled={lockedBusiness}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              >
                {Object.values(TaskKind).map((item) => (
                  <option key={item} value={item}>{TASK_KIND_LABEL[item]}</option>
                ))}
              </select>
              {lockedBusiness ? (
                <p className="mt-1 text-xs text-slate-400">Task gắn phiếu/nghiệp vụ luôn là Business.</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Ưu tiên</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm">
                {Object.values(TaskPriority).map((item) => <option key={item} value={item}>{TASK_PRIORITY_LABEL[item]}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Giao cho</span>
              <select
                value={assignedToUserId}
                onChange={(e) => setAssignedToUserId(e.target.value)}
                disabled={kind === TaskKind.PERSONAL && !lockedBusiness}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              >
                {users.map((user) => <option key={user.id} value={user.id}>{userLabel(user)}</option>)}
              </select>
              {kind === TaskKind.PERSONAL && !lockedBusiness ? (
                <p className="mt-1 text-xs text-slate-400">Personal task chỉ dành cho chính bạn.</p>
              ) : null}
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
