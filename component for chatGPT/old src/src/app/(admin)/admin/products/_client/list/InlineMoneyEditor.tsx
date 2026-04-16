"use client";

import * as React from "react";
import { Loader2, PencilLine } from "lucide-react";

type Props = {
  value: number | null | undefined;
  label: string;
  onSubmit: (nextValue: number | null) => Promise<void>;
  compact?: boolean;
  iconOnly?: boolean;
};

export default function InlineMoneyEditor({
  value,
  label,
  onSubmit,
  compact = false,
  iconOnly = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value == null ? "" : String(value));
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setDraft(value == null ? "" : String(value));
  }, [value]);

  async function handleSave() {
    const trimmed = draft.trim();
    const nextValue = trimmed === "" ? null : Number(trimmed);

    if (nextValue != null && (!Number.isFinite(nextValue) || nextValue < 0)) {
      window.alert("Giá không hợp lệ");
      return;
    }

    try {
      setSaving(true);
      await onSubmit(nextValue);
      setOpen(false);
    } catch (e: any) {
      window.alert(e?.message || "Cập nhật giá thất bại");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    if (iconOnly) {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title={`Sửa ${label}`}
        >
          <PencilLine className="h-3.5 w-3.5" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800",
          compact ? "h-7" : "",
        ].join(" ")}
      >
        <PencilLine className="h-3.5 w-3.5" />
        {!compact ? <span>sửa</span> : null}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="h-8 w-24 rounded-lg border border-slate-200 bg-white px-2 text-right text-sm outline-none focus:border-slate-400"
        placeholder={label}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setOpen(false);
        }}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-2.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Lưu"}
      </button>
    </div>
  );
}