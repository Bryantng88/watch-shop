"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import {
  useAppProgress,
  type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type ServiceIntakeResult = {
  createdInitialIssue?: boolean;
  refNo?: string | null;
  workspaceHref?: string | null;
};

type Props = {
  open: boolean;
  productId: string | null | undefined;
  watchLabel: string;
  onClose: () => void;
  onCompleted?: (result: ServiceIntakeResult) => void;
};

const secondaryButton = "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60";
const primaryButton = "inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60";

export default function WatchServiceIntakeModal({
  open,
  productId,
  watchLabel,
  onClose,
  onCompleted,
}: Props) {
  const router = useRouter();
  const progress = useAppProgress();
  const notify = useNotify();
  const [mounted, setMounted] = useState(false);
  const [suspicion, setSuspicion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cleanProductId = String(productId ?? "").trim();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuspicion("");
  }, [open, productId]);

  function close() {
    if (!submitting) onClose();
  }

  async function submit() {
    const trimmedSuspicion = suspicion.trim();
    if (!cleanProductId) {
      setError("Watch này chưa có productId.");
      return;
    }
    if (!trimmedSuspicion) {
      setError("Vui lòng nhập nghi ngờ kỹ thuật đầu tiên.");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    let steps: AppProgressStep[] = [
      { id: "validate", label: "Kiểm tra thông tin watch", detail: `${watchLabel} đã sẵn sàng tạo phiếu kỹ thuật.`, status: "done" },
      { id: "create", label: "Tạo Service Request và Technical Issue", detail: "Đang ghi nhận phiếu kỹ thuật trong Service Operation.", status: "running" },
      { id: "background", label: "Đồng bộ workspace và timeline", detail: "technical_issue.created sẽ được consumer xử lý nền.", status: "pending" },
      { id: "projection", label: "Làm mới dữ liệu Watch", detail: "Quick Review sẽ đọc lại trạng thái Service vừa tạo.", status: "pending" },
    ];

    progress.show({
      title: "Đang tạo phiếu kỹ thuật",
      message: "Hệ thống đang tạo Service Request và nghi ngờ kỹ thuật đầu tiên.",
      steps,
    });

    try {
      const response = await fetch("/api/admin/service-operation", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          action: "watch_intake_with_suspicion",
          productId: cleanProductId,
          suspicion: trimmedSuspicion,
          openExisting: false,
        }),
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Không thể tạo phiếu kỹ thuật.");
      }

      const result = (json.data ?? {}) as ServiceIntakeResult;
      steps = steps.map((step) => ({
        ...step,
        status: step.id === "projection" ? "running" : "done",
      }));
      progress.update({
        title: result.createdInitialIssue ? "Đã tạo phiếu kỹ thuật" : "Đã mở phiếu kỹ thuật",
        message: result.workspaceHref ? "Đang chuyển sang workspace xử lý." : "Đang làm mới trạng thái Service.",
        steps,
      });
      notify.success({
        title: result.createdInitialIssue ? "Đã tạo service" : "Watch đã có service",
        message: result.refNo ? `SR ${result.refNo} đã được ghi nhận.` : "Service Operation đã nhận phiếu kỹ thuật.",
      });
      onCompleted?.(result);
      onClose();

      if (result.workspaceHref) router.push(result.workspaceHref);
      else router.refresh();

      window.setTimeout(() => {
        progress.update({
          title: "Đã đồng bộ Service",
          message: "Trạng thái Service của watch đã được làm mới.",
          steps: steps.map((step) => ({ ...step, status: "done" as const })),
        });
        window.setTimeout(() => progress.hide(), 700);
      }, 650);
    } catch (caught) {
      progress.hide();
      const message = caught instanceof Error ? caught.message : "Không thể tạo phiếu kỹ thuật.";
      setError(message);
      notify.error({ title: "Không thể tạo service", message });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/35" aria-label="Đóng modal tạo service" onClick={close} />
      <div className="relative z-[1] w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-950">Tạo service</div>
            <div className="mt-1 text-sm leading-6 text-slate-500">Nhập nghi ngờ kỹ thuật đầu tiên cho {watchLabel}.</div>
          </div>
          <button type="button" onClick={close} disabled={submitting} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-60">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase text-slate-500">Nghi ngờ kỹ thuật</span>
          <textarea
            value={suspicion}
            onChange={(event) => setSuspicion(event.target.value)}
            disabled={submitting}
            rows={4}
            autoFocus
            placeholder="VD: Kiểm tra máy chạy chậm, lau dầu, vệ sinh tổng thể..."
            className="w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400"
          />
        </label>

        {error ? <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={close} disabled={submitting} className={secondaryButton}>Hủy</button>
          <button type="button" onClick={() => void submit()} disabled={submitting || !suspicion.trim()} className={primaryButton}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Đang tạo..." : "Tạo service"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
