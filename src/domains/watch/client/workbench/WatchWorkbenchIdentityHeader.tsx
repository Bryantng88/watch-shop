"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  ChevronRight,
  Loader2,
  Pencil,
  Save,
  Wrench,
  X,
} from "lucide-react";

import type { WatchWorkbenchValues } from "./types";
import { titleForWatch } from "./workbench-utils";

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function string(value: unknown) {
  return typeof value === "string" ? value : "";
}

function imageUrl(detail: Record<string, unknown>, values: WatchWorkbenchValues) {
  const images = Array.isArray(detail.images) ? detail.images : [];
  return (
    values.media.inlineImage?.url ||
    values.media.galleryImages[0]?.url ||
    string(detail.primaryImageUrl) ||
    string(record(images[0]).url) ||
    null
  );
}

function statusLabel(value: string) {
  return ({
    IN_STOCK: "Còn hàng",
    OUT_OF_STOCK: "Hết hàng",
    RESERVED: "Đã giữ",
    DRAFT: "Bản nháp",
    PROCESSING: "Đang xử lý",
    READY: "Sẵn sàng bán",
    HOLD: "Giữ hàng",
    SOLD: "Đã bán",
    IN_SERVICE: "Đang service",
  } as Record<string, string>)[value.toUpperCase()] ?? value;
}

export default function WatchWorkbenchIdentityHeader({
  detail,
  values,
  onOpenMediaWorkspace,
  onSaveTitle,
  openingMediaWorkspace = false,
}: {
  detail: Record<string, unknown>;
  values: WatchWorkbenchValues;
  onOpenMediaWorkspace: () => void;
  onSaveTitle: (title: string) => Promise<string>;
  openingMediaWorkspace?: boolean;
}) {
  const title = titleForWatch(detail, values);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) setDraft(title);
  }, [editing, title]);

  const saveTitle = async () => {
    const next = draft.trim().replace(/\s+/g, " ");
    if (!next) {
      setError("Tên Watch không được để trống.");
      return;
    }
    if (next === title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSaveTitle(next);
      setEditing(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể lưu tên Watch.");
    } finally {
      setSaving(false);
    }
  };

  const brand = record(detail.brand);
  const vendor = record(detail.vendor);
  const src = imageUrl(detail, values);
  const imageCount = Math.max(
    values.media.imageCount,
    values.media.galleryImages.length,
    src ? 1 : 0,
  );
  const metadata = [
    ["Brand", string(brand.name) || values.spec.specBrand || "—"],
    ["Model", values.spec.model || "—"],
    ["Reference", values.spec.referenceNumber || "—"],
    ["Vendor", string(vendor.name) || "—"],
    ["Năm sản xuất", values.basic.yearText || "—"],
    ["Bộ máy", values.spec.calibre || values.basic.movementCalibre || "—"],
  ];

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <nav className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
          <Link href="/admin/watches" className="hover:text-violet-700">Danh sách Watch</Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="truncate font-semibold text-slate-800">{title}</span>
        </nav>
        <Link href="/admin/services/operation" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
          <Wrench className="h-4 w-4" /> Mở Service Board
        </Link>
      </div>

      <section className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="relative min-h-[250px] bg-slate-100">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="grid h-full min-h-[250px] place-items-center text-sm font-medium text-slate-400">Chưa có ảnh</div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <button type="button" onClick={onOpenMediaWorkspace} disabled={openingMediaWorkspace} className="inline-flex h-8 items-center gap-2 rounded-lg bg-slate-950/90 px-3 text-[11px] font-bold text-white backdrop-blur disabled:opacity-70">
              {openingMediaWorkspace ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              {openingMediaWorkspace ? "Đang mở..." : "Xem gallery"}
            </button>
            <span className="rounded-lg bg-slate-950/75 px-2.5 py-2 text-[10px] font-bold text-white backdrop-blur">{imageCount} ảnh</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">
                  {values.header.sku || values.productId}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">{statusLabel(values.basic.stockState)}</span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">{statusLabel(values.basic.saleState)}</span>
              </div>

              {editing ? (
                <div className="mt-4">
                  <div className="flex max-w-2xl items-center gap-2">
                    <input autoFocus value={draft} disabled={saving} onChange={(event) => { setDraft(event.target.value); setError(null); }} onKeyDown={(event) => { if (event.key === "Enter") void saveTitle(); if (event.key === "Escape") setEditing(false); }} className="h-11 min-w-0 flex-1 rounded-lg border border-violet-300 px-3 text-lg font-bold outline-none ring-4 ring-violet-50" />
                    <button type="button" onClick={() => void saveTitle()} disabled={saving} className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white disabled:opacity-50">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 text-slate-500"><X className="h-4 w-4" /></button>
                  </div>
                  {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}
                </div>
              ) : (
                <button type="button" onClick={() => setEditing(true)} className="group mt-4 flex max-w-full items-center gap-2 text-left">
                  <h1 className="truncate text-3xl font-bold tracking-[-0.04em] text-slate-950">{title}</h1>
                  <Pencil className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-violet-600" />
                </button>
              )}

              {values.content.hookText ? <p className="mt-2 line-clamp-2 text-sm text-slate-500">{values.content.hookText}</p> : null}
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-5 sm:grid-cols-3 xl:grid-cols-6">
            {metadata.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
                <div className="mt-1 truncate text-xs font-bold text-slate-800">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </header>
  );
}
