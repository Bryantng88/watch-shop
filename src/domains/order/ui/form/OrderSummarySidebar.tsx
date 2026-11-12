"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ADMIN_UI } from "@/domains/shared/ui/admin-design-contract";
import { fmtMoney } from "@/domains/order/ui/order-ui.helpers";

type Props = {
  itemsCount: number;
  subtotal: number;
  tradeInAmount?: number;
  isEdit?: boolean;
  canEdit?: boolean;
  submitting?: boolean;
  backHref: string;
  onCancel?: () => void;
  submitLabel?: string;
  onSubmit: () => void;
  onSaveDraft?: () => void;
};

/** Kept at the form boundary for existing callers; rendered as one compact action bar. */
export default function OrderSummarySidebar({ itemsCount, subtotal, tradeInAmount = 0, isEdit, canEdit = true, submitting, backHref, onCancel, submitLabel, onSubmit, onSaveDraft }: Props) {
  return <footer className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 py-3 backdrop-blur">
    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums">
      <span className="text-xs text-slate-500">{itemsCount} dòng</span>
      <span className="text-slate-500">Tổng <strong className="text-slate-950">{fmtMoney(subtotal)}</strong></span>
      {tradeInAmount > 0 && <><span className="text-xs text-slate-500">Trade-in −{fmtMoney(tradeInAmount)}</span><span className="text-slate-500">Chênh lệch <strong className="text-slate-950">{fmtMoney(Math.max(0, subtotal - tradeInAmount))}</strong></span></>}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {onCancel ? <button type="button" onClick={onCancel} className={`${ADMIN_UI.secondaryAction} h-10 px-3 text-sm`}>Hủy</button> : <Link href={backHref} className={`${ADMIN_UI.secondaryAction} inline-flex h-10 items-center px-3 text-sm`}>Hủy</Link>}
      {onSaveDraft && <button type="button" onClick={onSaveDraft} disabled={submitting || !canEdit} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Lưu nháp</button>}
      <button type="button" onClick={onSubmit} disabled={submitting || !canEdit} className={`${ADMIN_UI.primaryAction} inline-flex h-10 items-center gap-2 px-4 text-sm`}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}{submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : submitLabel ?? "Tạo & duyệt đơn"}
      </button>
    </div>
  </footer>;
}
