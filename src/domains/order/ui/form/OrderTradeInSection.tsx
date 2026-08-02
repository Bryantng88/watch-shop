"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Pencil, Plus, X } from "lucide-react";

import { Button, Input, Select, Textarea } from "@/domains/shared/ui/form/fields";
import type { OrderTradeInDraft } from "./types";

type Props = {
  value: OrderTradeInDraft | null;
  customerId?: string | null;
  customerName?: string;
  customerPhone?: string;
  disabled?: boolean;
  onChange: (value: OrderTradeInDraft | null) => void;
};

const EMPTY: OrderTradeInDraft = {
  title: "",
  amount: 0,
  notes: "",
  audienceSegment: "MEN",
};

function money(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

type SoldWatchOption = {
  productId: string;
  title: string;
  sku?: string | null;
  soldOrderRefNo?: string | null;
};

export default function OrderTradeInSection({ value, customerId, customerName, customerPhone, disabled, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<OrderTradeInDraft>(value ?? EMPTY);
  const [error, setError] = useState("");
  const [soldWatches, setSoldWatches] = useState<SoldWatchOption[]>([]);
  const [loadingSoldWatches, setLoadingSoldWatches] = useState(false);

  useEffect(() => {
    if (open) setDraft(value ?? EMPTY);
  }, [open, value]);

  useEffect(() => {
    if (!open || (!customerId && !customerPhone?.trim())) return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (customerId) params.set("customerId", customerId);
    if (customerPhone?.trim()) params.set("phone", customerPhone.trim());
    setLoadingSoldWatches(true);
    fetch(`/api/admin/orders/catalog/trade-in-watches?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setSoldWatches(Array.isArray(json?.items) ? json.items : []);
      })
      .finally(() => {
        if (!cancelled) setLoadingSoldWatches(false);
      });
    return () => { cancelled = true; };
  }, [customerId, customerPhone, open]);

  function save() {
    if (Number(draft.amount) <= 0) {
      setError("Giá thu vào phải lớn hơn 0.");
      return;
    }
    onChange({ ...draft, title: draft.title.trim() || "Đồng hồ trade-in" });
    setError("");
    setOpen(false);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Trade-in</h2>
            <p className="mt-0.5 text-xs text-slate-500">Thu đồng hồ của khách trong cùng giao dịch bán.</p>
          </div>
        </div>

        <Button type="button" variant="outline" disabled={disabled} onClick={() => setOpen(true)}>
          {value ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {value ? "Chỉnh sửa" : "Thêm trade-in"}
        </Button>
      </div>

      {value ? (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{value.title}</div>
            <div className="mt-1 text-xs text-slate-500">Phiếu nhập TRADE_IN · Chờ duyệt</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Giá thu vào</div>
            <div className="mt-1 text-base font-semibold text-violet-700">{money(value.amount)} VND</div>
          </div>
          {!disabled ? (
            <button type="button" onClick={() => onChange(null)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Bỏ trade-in">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : (
        <div className="px-5 py-4 text-sm text-slate-500">Không có đồng hồ thu vào trong Order này.</div>
      )}

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="text-lg font-semibold text-slate-950">Phiếu nhập trade-in</div>
                <div className="mt-1 text-sm text-slate-500">Khách hàng lấy từ Order; ảnh và thông tin chi tiết sẽ bổ sung tại phiếu nhập nháp.</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Khách trade-in</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{customerName?.trim() || "Chưa chọn khách hàng"}</div>
                <div className="mt-0.5 text-xs text-slate-500">{customerPhone?.trim() || "Chưa có số điện thoại"}</div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium text-slate-600">Đồng hồ khách từng mua</div>
                <div className="rounded-2xl border border-slate-200 p-2">
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, productId: null, sku: null }))}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm ${!draft.productId ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    Đồng hồ ngoài hệ thống — tạo Watch mới khi duyệt phiếu
                  </button>
                  {loadingSoldWatches ? <div className="px-3 py-2 text-xs text-slate-400">Đang tìm lịch sử mua...</div> : null}
                  {soldWatches.map((watch) => (
                    <button
                      key={watch.productId}
                      type="button"
                      onClick={() => setDraft((prev) => ({
                        ...prev,
                        productId: watch.productId,
                        sku: watch.sku ?? null,
                        title: watch.title,
                      }))}
                      className={`mt-1 w-full rounded-xl px-3 py-2 text-left ${draft.productId === watch.productId ? "bg-emerald-50 ring-1 ring-emerald-200" : "hover:bg-slate-50"}`}
                    >
                      <div className="text-sm font-semibold text-slate-900">{watch.title}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{watch.sku || "Chưa có SKU"} · Đã bán từ {watch.soldOrderRefNo || "đơn cũ"}</div>
                    </button>
                  ))}
                </div>
                {draft.productId ? <div className="mt-2 text-xs text-emerald-700">Khi duyệt phiếu, hệ thống tái nhập đúng Watch này và ghi event buy-back.</div> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">Tên tạm</span>
                  <Input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} placeholder="VD: Đồng hồ trade-in của khách" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">Phân luồng</span>
                  <Select value={draft.audienceSegment} onChange={(e) => setDraft((prev) => ({ ...prev, audienceSegment: e.target.value as "MEN" | "WOMEN" }))} options={[{ value: "MEN", label: "Nam" }, { value: "WOMEN", label: "Nữ" }]} />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-600">Giá thu vào</span>
                <Input type="number" min={0} value={draft.amount || ""} onChange={(e) => setDraft((prev) => ({ ...prev, amount: Number(e.target.value || 0) }))} placeholder="0" />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-600">Ghi chú</span>
                <Textarea value={draft.notes} onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Ghi chú nhanh nếu cần" className="mt-2 min-h-20" />
              </label>
              {error ? <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="button" onClick={save}>Gắn vào Order</Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
