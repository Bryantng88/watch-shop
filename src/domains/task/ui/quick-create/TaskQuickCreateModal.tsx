"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { TaskKind } from "@prisma/client";
import { createTaskAction, updateTaskAction } from "../../actions/task.actions";
import type { TaskWithRelations } from "../../server/core/task.repo";
import type {
  CreateTaskInput,
  TaskDomainLinksInput,
  UpdateTaskInput,
} from "../../server/task.types";
import { TASK_KIND_LABEL } from "../../utils/task-labels";

export type TaskUserOption = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export type TaskQuickCreateContext = TaskDomainLinksInput & {
  kind?: TaskKind;
  titlePreset?: string;
  descriptionPreset?: string;
};

function defaultKindFromContext(context?: TaskQuickCreateContext | null): TaskKind {
  if (context?.serviceRequestId || context?.technicalIssueId) return TaskKind.SERVICE;
  if (context?.shipmentId || context?.paymentId || context?.acquisitionId) return TaskKind.OPERATION;
  if (context?.watchId || context?.orderId || context?.workCaseId) return TaskKind.BUSINESS;
  return TaskKind.BUSINESS;
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
  const [error, setError] = useState<string | null>(null);
  const [existingTask, setExistingTask] = useState<TaskWithRelations | null>(null);

  const isEdit = Boolean(editTask);
  const lockedBusiness = hasBusinessContext(context);
  const lockedKind = lockedBusiness ? defaultKindFromContext(context) : null;
  const finalKind = lockedKind ?? kind;
  const isFree = finalKind === TaskKind.FREE;

  useEffect(() => {
    if (!open) return;

    setError(null);
    setExistingTask(null);
    setTitle(editTask?.title ?? context?.titlePreset ?? "");
    setDescription(editTask?.description ?? context?.descriptionPreset ?? "");
    setKind((editTask as any)?.kind ?? context?.kind ?? defaultKindFromContext(context));
  }, [open, editTask, context]);

  const links = useMemo<TaskDomainLinksInput>(
    () => ({
      watchId: editTask?.watchId ?? context?.watchId ?? null,
      orderId: editTask?.orderId ?? context?.orderId ?? null,
      shipmentId: editTask?.shipmentId ?? context?.shipmentId ?? null,
      acquisitionId: editTask?.acquisitionId ?? context?.acquisitionId ?? null,
      serviceRequestId: editTask?.serviceRequestId ?? context?.serviceRequestId ?? null,
      technicalIssueId: editTask?.technicalIssueId ?? context?.technicalIssueId ?? null,
      paymentId: editTask?.paymentId ?? context?.paymentId ?? null,
      workCaseId: editTask?.workCaseId ?? context?.workCaseId ?? null,
    }),
    [editTask, context],
  );

  function submit() {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (isFree && !cleanTitle) {
      setError("Vui lòng nhập tiêu đề task tự do");
      return;
    }

    startTransition(async () => {
      try {
        if (editTask) {
          const payload: UpdateTaskInput = {
            kind: finalKind,
            ...(isFree ? { title: cleanTitle } : {}),
            description: cleanDescription || null,
            ...links,
          };

          await updateTaskAction(editTask.id, payload);
          onSaved?.();
          onClose();
          return;
        }

        const payload: CreateTaskInput = {
          kind: finalKind,
          ...(isFree ? { title: cleanTitle } : {}),
          description: cleanDescription || null,
          ...links,
        };

        const result = await createTaskAction(payload);

        if ((result as any)?.wasExistingPeriodTask) {
          setExistingTask((result as any).task as TaskWithRelations);
          setError("Task cho nhóm và tuần này đã tồn tại. Hãy mở task đó để tạo Task Item.");
          return;
        }

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
          <h2 className="text-lg font-semibold text-slate-950">
            {isEdit ? "Sửa task" : "Tạo task"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Task theo nhóm sẽ tự gom theo tuần. Việc cụ thể thêm ở Task Item sau khi mở task.
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error ? (
            <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {existingTask ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
              <div className="font-semibold">Task đã tồn tại</div>
              <div className="mt-1">{existingTask.title}</div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `/admin/tasks?openTaskId=${existingTask.id}`;
                }}
                className="mt-3 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white"
              >
                Mở task để tạo Task Item
              </button>
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Loại task</span>

            <select
              value={finalKind}
              onChange={(e) => setKind(e.target.value as TaskKind)}
              disabled={lockedBusiness || isEdit}
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400"
            >
              {Object.values(TaskKind).map((item) => (
                <option key={item} value={item}>
                  {TASK_KIND_LABEL[item]}
                </option>
              ))}
            </select>

            {lockedBusiness ? (
              <p className="mt-1 text-xs text-slate-400">
                Task gắn nghiệp vụ sẽ tự nhận nhóm phù hợp.
              </p>
            ) : null}
          </label>

          {isFree ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tiêu đề</span>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                placeholder="Ví dụ: Báo giá cho khách"
              />
            </label>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
              Tên task sẽ được tạo tự động theo tuần, ví dụ:{" "}
              <span className="font-semibold text-slate-900">
                Task Vận hành tuần 26 (22/06/2026 - 28/06/2026)
              </span>
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Ghi chú thêm cho task tuần này, nếu cần..."
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Đang lưu..." : "Lưu task"}
          </button>
        </div>
      </div>
    </div>
  );
}