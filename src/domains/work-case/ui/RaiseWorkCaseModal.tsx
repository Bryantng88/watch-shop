"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AlertCircle, ImageIcon } from "lucide-react";
import {
  TaskPriority,
  WorkCaseScope,
  type WorkCaseCategory,
} from "@prisma/client";
import { createWorkCaseAction } from "../actions/work-case.actions";
import {
  WORK_CASE_PRIORITY_LABEL,
  WORK_CASE_SCOPE_LABEL,
} from "../utils/work-case-labels";

export type RaiseWorkCaseSourceType = "WATCH" | "ORDER" | "SHIPMENT";

export type RaiseWorkCaseSourceContext = {
  type: RaiseWorkCaseSourceType;
  id: string;

  title?: string | null;
  refNo?: string | null;
  subtitle?: string | null;
  sku?: string | null;
  imageUrl?: string | null;

  itemsCount?: number | null;
  extraCount?: number | null;
};

type Props = {
  open: boolean;
  source: RaiseWorkCaseSourceContext | null;
  categories?: WorkCaseCategory[];
  defaultScope?: WorkCaseScope;
  onClose: () => void;
  onSaved?: () => void;
};

function getCategoryOptions(categories: WorkCaseCategory[], scope: WorkCaseScope) {
  return categories.filter((item) => item.isActive && item.scope === scope);
}

function sourceLabel(type: RaiseWorkCaseSourceType) {
  if (type === "ORDER") return "Đơn hàng";
  if (type === "SHIPMENT") return "Vận đơn";
  return "Watch";
}

function buildDefaultTitle(source: RaiseWorkCaseSourceContext | null) {
  if (!source) return "Vấn đề cần xử lý";

  if (source.type === "ORDER") {
    return `Vấn đề cần xử lý từ đơn hàng ${source.refNo || source.id}`;
  }

  if (source.type === "SHIPMENT") {
    return `Vấn đề cần xử lý từ vận đơn ${source.refNo || source.id}`;
  }

  return source.title ? `Vấn đề cần xử lý: ${source.title}` : "Vấn đề cần xử lý";
}

export default function RaiseWorkCaseModal({
  open,
  source,
  categories = [],
  defaultScope = WorkCaseScope.BUSINESS,
  onClose,
  onSaved,
}: Props) {
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<WorkCaseScope>(defaultScope);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = useMemo(
    () => getCategoryOptions(categories, scope),
    [categories, scope],
  );

  useEffect(() => {
    if (!open) return;

    setError(null);
    setScope(defaultScope);
    setPriority(TaskPriority.MEDIUM);
    setCategoryId("");
    setDescription("");
    setTitle(buildDefaultTitle(source));
  }, [open, defaultScope, source]);

  useEffect(() => {
    if (!categoryId) return;

    const valid = categoryOptions.some((item) => item.id === categoryId);
    if (!valid) setCategoryId("");
  }, [categoryId, categoryOptions]);

  function submit() {
    if (!source?.id || !source?.type) {
      setError("Thiếu đối tượng gốc để tạo phiếu xử lý.");
      return;
    }

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề phiếu xử lý.");
      return;
    }

    if (!description.trim()) {
      setError("Vui lòng nhập mô tả vấn đề.");
      return;
    }

    startTransition(async () => {
      try {
        await createWorkCaseAction({
          title,
          description,
          scope,
          priority,
          categoryId: categoryId || null,
          watchId: source.type === "WATCH" ? source.id : null,
          orderId: source.type === "ORDER" ? source.id : null,
          shipmentId: source.type === "SHIPMENT" ? source.id : null,
        });

        onSaved?.();
        onClose();
      } catch (err: any) {
        setError(err?.message || "Không thể tạo phiếu xử lý.");
      }
    });
  }

  if (!open) return null;

  const label = source?.type ? sourceLabel(source.type) : "Đối tượng";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950">
              Tạo phiếu xử lý
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ghi nhận vấn đề gắn với {label.toLowerCase()}. Manager sẽ điều phối thành task/service khi cần.
            </p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          {source ? (
            <div className="flex gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {source.imageUrl ? (
                  <img
                    src={source.imageUrl}
                    alt={source.title || source.refNo || label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-slate-400" />
                )}
              </div>

              <div className="min-w-0 py-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {source.type}
                </div>

                <div className="mt-1 line-clamp-2 text-sm font-semibold text-slate-950">
                  {source.title || source.refNo || source.id}
                </div>

                {source.subtitle ? (
                  <div className="mt-1 text-xs text-slate-500">
                    {source.subtitle}
                  </div>
                ) : null}

                {source.sku ? (
                  <div className="mt-1 text-xs text-slate-500">
                    SKU: {source.sku}
                  </div>
                ) : null}

                {source.itemsCount ? (
                  <div className="mt-1 text-xs text-slate-500">
                    {source.itemsCount} sản phẩm
                    {source.extraCount ? ` · +${source.extraCount} watch khác` : ""}
                  </div>
                ) : null}

                <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                  ID: {source.id}
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tiêu đề</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Mô tả vấn đề
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Ví dụ: Khách cần đổi phương thức thanh toán, phát sinh phí giao hàng, cần xử lý service..."
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Scope</span>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as WorkCaseScope)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
              >
                {Object.values(WorkCaseScope).map((item) => (
                  <option key={item} value={item}>
                    {WORK_CASE_SCOPE_LABEL[item]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nhóm</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
              >
                <option value="">Không chọn</option>
                {categoryOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Priority
              </span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
              >
                {Object.values(TaskPriority).map((item) => (
                  <option key={item} value={item}>
                    {WORK_CASE_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
            {pending ? "Đang tạo..." : "Tạo phiếu"}
          </button>
        </div>
      </div>
    </div>
  );
}