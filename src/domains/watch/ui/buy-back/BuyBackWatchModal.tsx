"use client";

import * as React from "react";
import { X } from "lucide-react";

import { WatchRow } from "../list";
import { formatMoney } from "../list/helpers";
function parseMoneyInput(value: string) {
  const normalized = String(value ?? "").replace(/[^0-9.-]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export default function BuyBackWatchModal({
  open,
  row,
  submitting,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  row: WatchRow | null;
  submitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: { productId: string; unitCost: number; notes?: string | null }) => void;
}) {
  const [unitCostText, setUnitCostText] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setUnitCostText("");
    setNotes("");
  }, [open, row?.productId]);

  React.useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, submitting]);

  if (!open || !row) return null;

  const unitCost = parseMoneyInput(unitCostText);
  const canSubmit = Boolean(row.productId) && unitCost > 0 && !submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-lg font-semibold text-slate-950">Tạo phiếu mua lại</div>
            <div className="mt-1 text-sm text-slate-500">
              Tạo acquisition BUY_BACK dạng DRAFT. Watch vẫn giữ SOLD cho tới khi phiếu được POST.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="text-sm font-semibold text-slate-950">{row.title}</div>
            <div className="mt-1 font-mono text-xs text-slate-500">SKU: {row.sku || "-"}</div>
            <div className="mt-2 text-xs text-slate-500">
              Giá bán hiện tại: <span className="font-semibold text-slate-700">{formatMoney(row.salePrice)}</span>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Giá mua lại *</span>
            <input
              value={unitCostText}
              onChange={(event) => setUnitCostText(event.target.value)}
              inputMode="numeric"
              placeholder="Ví dụ: 7500000"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
            {unitCost > 0 ? (
              <div className="mt-1 text-xs text-slate-500">= {formatMoney(unitCost)}</div>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Lý do mua lại, tình trạng lúc nhận, thỏa thuận với khách..."
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              if (!row.productId || unitCost <= 0) return;
              onSubmit({
                productId: row.productId,
                unitCost,
                notes: notes.trim() || null,
              });
            }}
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Đang tạo..." : "Tạo phiếu mua lại"}
          </button>
        </div>
      </div>
    </div>
  );
}
