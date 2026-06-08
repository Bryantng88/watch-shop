"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { completeTasksByIdsAction } from "../../actions/task.actions";
import type { RelatedTaskSuggestion } from "../../server/task.types";

function userLabel(user?: RelatedTaskSuggestion["assignedToUser"]) {
  if (!user) return "-";
  return user.name || user.email || user.id;
}

export default function RelatedTaskCompleteModal({
  open,
  title = "Có task liên quan đang mở",
  message = "Bạn vừa cập nhật đối tượng này. Chọn task đã xử lý xong để đánh dấu hoàn thành.",
  items,
  onClose,
  onCompleted,
}: {
  open: boolean;
  title?: string;
  message?: string;
  items: RelatedTaskSuggestion[];
  onClose: () => void;
  onCompleted?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => items.map((item) => item.id));
  const [error, setError] = useState<string | null>(null);

  const selectedCount = useMemo(() => selectedIds.length, [selectedIds]);

  if (!open || !items.length) return null;

  function toggle(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  function completeSelected() {
    if (!selectedIds.length) {
      setError("Vui lòng chọn ít nhất một task để hoàn thành.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await completeTasksByIdsAction(selectedIds);
        onCompleted?.();
        onClose();
      } catch (err: any) {
        setError(err?.message || "Không thể hoàn thành task.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl bg-emerald-50 p-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{message}</p>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-auto px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          {items.map((item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <label key={item.id} className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-950">{item.title}</span>
                    {item.taskType ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        {item.taskType.code}
                      </span>
                    ) : null}
                  </div>

                  {item.description ? <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p> : null}

                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span>Người xử lý: {userLabel(item.assignedToUser)}</span>
                    {item.dueAt ? <span>Due: {new Date(item.dueAt).toLocaleDateString("vi-VN")}</span> : null}
                    <span>Priority: {item.priority}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={pending} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
            Để sau
          </button>
          <button type="button" onClick={completeSelected} disabled={pending || selectedCount === 0} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? "Đang hoàn thành..." : `Hoàn thành đã chọn (${selectedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
