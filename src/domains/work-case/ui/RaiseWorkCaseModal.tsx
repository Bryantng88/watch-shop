"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AlertCircle, ChevronDown, ImageIcon } from "lucide-react";
import {
  TaskPriority,
  WorkCaseScope,
  type WorkCaseCategory,
} from "@prisma/client";
import { createWorkCaseAction } from "../actions/work-case.actions";
import { WORK_CASE_PRIORITY_LABEL } from "../utils/work-case-labels";
import EntityLinkPicker, {
  type EntityLinkType,
} from "@/domains/shared/ui/pickers/EntityLinkPicker";
import { searchWorkCaseLinkTargetsAction } from "../actions/work-case.actions";
export type RaiseWorkCaseSourceType = EntityLinkType;
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
  source?: RaiseWorkCaseSourceContext | null;
  categories?: WorkCaseCategory[];
  defaultScope?: WorkCaseScope;
  onClose: () => void;
  onSaved?: () => void;
};

function sourceLabel(type?: RaiseWorkCaseSourceType | null) {
  if (type === "ORDER") return "Đơn hàng";
  if (type === "SHIPMENT") return "Vận đơn";
  if (type === "SERVICE") return "Phiếu service";
  if (type === "WATCH") return "Watch";
  return "nghiệp vụ";
}

function buildDefaultTitle(source?: RaiseWorkCaseSourceContext | null) {
  if (!source) return "Vấn đề cần xử lý";

  if (source.type === "ORDER") {
    return `Vấn đề cần xử lý từ đơn hàng ${source.refNo || source.id}`;
  }

  if (source.type === "SHIPMENT") {
    return `Vấn đề cần xử lý từ vận đơn ${source.refNo || source.id}`;
  }

  if (source.type === "SERVICE") {
    return `Vấn đề cần xử lý từ phiếu service ${source.refNo || source.id}`;
  }

  return source.title ? `Vấn đề cần xử lý: ${source.title}` : "Vấn đề cần xử lý";
}

export default function RaiseWorkCaseModal({
  open,
  source = null,
  defaultScope = WorkCaseScope.BUSINESS,
  onClose,
  onSaved,
}: Props) {
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<WorkCaseScope>(defaultScope);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [error, setError] = useState<string | null>(null);

  const [watchId, setWatchId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [serviceRequestId, setServiceRequestId] = useState("");
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [enabledLinks, setEnabledLinks] = useState<
    Record<RaiseWorkCaseSourceType, boolean>
  >({
    WATCH: false,
    ORDER: false,
    SHIPMENT: false,
    SERVICE: false,
  });

  const linkItems = useMemo(
    () => [
      {
        type: "WATCH" as const,
        label: "Watch",
        value: watchId,
        setValue: setWatchId,
      },
      {
        type: "ORDER" as const,
        label: "Đơn hàng",
        value: orderId,
        setValue: setOrderId,
      },
      {
        type: "SHIPMENT" as const,
        label: "Vận đơn",
        value: shipmentId,
        setValue: setShipmentId,
      },
      {
        type: "SERVICE" as const,
        label: "Phiếu service",
        value: serviceRequestId,
        setValue: setServiceRequestId,
      },
    ],
    [watchId, orderId, shipmentId, serviceRequestId],
  );
  useEffect(() => {
    if (!open) return;

    setError(null);
    setScope(defaultScope);
    setPriority(TaskPriority.MEDIUM);
    setDescription("");
    setTitle(buildDefaultTitle(source));

    setWatchId(source?.type === "WATCH" ? source.id : "");
    setOrderId(source?.type === "ORDER" ? source.id : "");
    setShipmentId(source?.type === "SHIPMENT" ? source.id : "");
    setServiceRequestId(source?.type === "SERVICE" ? source.id : "");

    setEnabledLinks({
      WATCH: source?.type === "WATCH",
      ORDER: source?.type === "ORDER",
      SHIPMENT: source?.type === "SHIPMENT",
      SERVICE: source?.type === "SERVICE",
    });

    setLinkOpen(Boolean(source));
  }, [open, defaultScope, source]);

  function toggleLink(type: RaiseWorkCaseSourceType) {
    setEnabledLinks((current) => {
      const nextActive = !current[type];

      if (!nextActive) {
        if (type === "WATCH") setWatchId("");
        if (type === "ORDER") setOrderId("");
        if (type === "SHIPMENT") setShipmentId("");
        if (type === "SERVICE") setServiceRequestId("");
      }

      return {
        ...current,
        [type]: nextActive,
      };
    });
  }
  function priorityDot(priority: TaskPriority) {
    switch (priority) {
      case TaskPriority.URGENT:
        return "bg-red-400";

      case TaskPriority.HIGH:
        return "bg-orange-400";

      case TaskPriority.MEDIUM:
        return "bg-blue-400";

      default:
        return "bg-slate-400";
    }
  }
  function submit() {
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
          title: title.trim(),
          description: description.trim(),
          scope,
          priority,
          categoryId: null,
          watchId: enabledLinks.WATCH ? watchId.trim() || null : null,
          orderId: enabledLinks.ORDER ? orderId.trim() || null : null,
          shipmentId: enabledLinks.SHIPMENT ? shipmentId.trim() || null : null,
          serviceRequestId: enabledLinks.SERVICE
            ? serviceRequestId.trim() || null
            : null,
        });

        onSaved?.();
        onClose();
      } catch (err: any) {
        setError(err?.message || "Không thể tạo phiếu xử lý.");
      }
    });
  }

  if (!open) return null;

  const label = sourceLabel(source?.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950">
              Tạo phiếu xử lý
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ghi nhận vấn đề mở. Có thể gắn với {label} nếu cần, hoặc để trống
              để xử lý tự do.
            </p>
          </div>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
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
                    {source.extraCount
                      ? ` · +${source.extraCount} watch khác`
                      : ""}
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
          <div className="block">
            <span className="text-sm font-medium text-slate-700">
              Priority
            </span>

            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setPriorityOpen((v) => !v)}
                className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${priorityDot(priority)}`}
                  />

                  <span>
                    {WORK_CASE_PRIORITY_LABEL[priority]}
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition ${priorityOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {priorityOpen ? (
                <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {Object.values(TaskPriority).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setPriority(item);
                        setPriorityOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                    >
                      <span
                        className={`h-3 w-3 rounded-full ${priorityDot(item)}`}
                      />

                      <span>
                        {WORK_CASE_PRIORITY_LABEL[item]}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/70">
            <button
              type="button"
              onClick={() => setLinkOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Liên kết nghiệp vụ nếu có
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Không bắt buộc. Chỉ chọn nghiệp vụ cần gắn với phiếu này.
                </p>
              </div>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition ${linkOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {linkOpen ? (
              <div className="space-y-2 border-t border-slate-200 p-3">
                {linkItems.map((item) => {
                  const active = enabledLinks[item.type];

                  return (
                    <div
                      key={item.type}
                      className={`rounded-2xl border bg-white p-3 transition ${active ? "border-slate-300" : "border-slate-100"
                        }`}
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleLink(item.type)}
                          className="h-4 w-4 rounded border-slate-300"
                        />

                        <span className="text-sm font-semibold text-slate-700">
                          {item.label}
                        </span>
                      </label>

                      {active ? (
                        <EntityLinkPicker
                          type={item.type}
                          label={item.label}
                          value={item.value}
                          onChange={(id) => item.setValue(id ?? "")}
                          search={searchWorkCaseLinkTargetsAction}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
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