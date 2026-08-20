"use client";

import * as React from "react";
import { CheckCircle2, ClipboardCheck, Eye, Loader2, Undo2 } from "lucide-react";

type Action = "stay" | "open" | "approve";

export default function AcquisitionCreatedDialog({
  open,
  canApprove,
  title = "Đã tạo phiếu nhập",
  message = "Phiếu đang ở trạng thái DRAFT. Chọn bước tiếp theo.",
  stayLabel = "Tiếp tục ở đây",
  onStay,
  onOpen,
  onApprove,
}: {
  open: boolean;
  canApprove: boolean;
  title?: string;
  message?: string;
  stayLabel?: string;
  onStay: () => void | Promise<void>;
  onOpen: () => void | Promise<void>;
  onApprove: () => void | Promise<void>;
}) {
  const [pending, setPending] = React.useState<Action | null>(null);

  if (!open) return null;

  async function run(action: Action, callback: () => void | Promise<void>) {
    if (pending) return;
    setPending(action);
    try {
      await callback();
    } catch {
      // The caller owns the business-specific error notification. Keep the
      // dialog open so the user can retry or open the DRAFT for correction.
    } finally {
      setPending(null);
    }
  }

  const disabled = pending !== null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[1px]">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button type="button" disabled={disabled} onClick={() => void run("stay", onStay)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {pending === "stay" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />}
            {stayLabel}
          </button>
          <button type="button" disabled={disabled} onClick={() => void run("open", onOpen)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {pending === "open" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Mở phiếu nhập
          </button>
          {canApprove ? (
            <button type="button" disabled={disabled} onClick={() => void run("approve", onApprove)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
              {pending === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
              Duyệt ngay
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
