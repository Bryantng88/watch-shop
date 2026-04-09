"use client";

import { useEffect, useState } from "react";
import { fmtMoney } from "./helpers";

export default function InlineMoneyEditor({
  productId,
  field,
  value,
  label,
  onSaved,
}: {
  productId: string;
  field: "minPrice" | "salePrice";
  value: number | null | undefined;
  label: string;
  onSaved: (v: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value == null ? "" : String(value));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value == null ? "" : String(value));
  }, [value]);

  async function save() {
    const trimmed = draft.trim();
    const nextValue = trimmed === "" ? null : Number(trimmed);

    if (nextValue != null && (!Number.isFinite(nextValue) || nextValue < 0)) {
      alert(`${label} không hợp lệ`);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: nextValue }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Cập nhật ${label.toLowerCase()} thất bại`);
      onSaved(nextValue);
      setEditing(false);
    } catch (e: any) {
      alert(e?.message || `Cập nhật ${label.toLowerCase()} thất bại`);
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center justify-end gap-2">
        <input type="number" min={0} value={draft} onChange={(e) => setDraft(e.target.value)} className="h-9 w-28 rounded-lg border border-slate-200 px-2 text-right text-sm" />
        <button type="button" onClick={save} disabled={saving} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs hover:bg-slate-50">{saving ? "..." : "Lưu"}</button>
        <button type="button" onClick={() => { setEditing(false); setDraft(value == null ? "" : String(value)); }} disabled={saving} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs hover:bg-slate-50">Hủy</button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setEditing(true)} className="group inline-flex items-center justify-end gap-2 rounded-lg px-2 py-1 hover:bg-slate-50" title={`Chỉnh nhanh ${label.toLowerCase()}`}>
      <span className={field === "salePrice" ? "font-medium text-emerald-700" : "font-semibold text-slate-900"}>{fmtMoney(value)}</span>
      <span className="text-xs text-slate-400 opacity-0 transition group-hover:opacity-100">sửa</span>
    </button>
  );
}
