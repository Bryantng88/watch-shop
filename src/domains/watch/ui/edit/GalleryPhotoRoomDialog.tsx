"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, RotateCcw, Sparkles, X } from "lucide-react";

import type { PickedMediaItem } from "@/components/media/MediaPickerMulti";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

type Preset = {
  backgroundBlur: number;
  metalEnhance: number;
  shadowOpacity: number;
  highlight: number;
  brightness: number;
  saturation: number;
};
type Result = { storageKey: string; sourceStorageKey: string; cached?: boolean };
type ItemState = { status: "idle" | "processing" | "done" | "error"; result?: Result; error?: string };

export default function GalleryPhotoRoomDialog({
  open,
  productId,
  images,
  onClose,
  onApply,
}: {
  open: boolean;
  productId: string;
  images: PickedMediaItem[];
  onClose: () => void;
  onApply: (replacements: Map<string, PickedMediaItem>) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [states, setStates] = useState<Record<string, ItemState>>({});
  const [preset, setPreset] = useState<Preset>({ backgroundBlur: 6, metalEnhance: 6, shadowOpacity: 6, highlight: 4, brightness: 0, saturation: 100 });
  const [running, setRunning] = useState(false);
  const keys = useMemo(() => images.map((item) => item.key).filter(Boolean), [images]);

  useEffect(() => {
    if (!open) return;
    setSelected(new Set(keys));
    setUnavailable(new Set());
    setStates({});
    setRunning(false);
  }, [open, keys]);

  if (!open) return null;
  const completed = Object.values(states).filter((state) => state.status === "done").length;

  const processOne = async (key: string) => {
    setStates((current) => ({ ...current, [key]: { status: "processing" } }));
    try {
      const response = await fetch(`/api/admin/watches/${productId}/gallery/photoroom`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ storageKey: key, preset }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json?.data?.storageKey) throw new Error(json?.error || "PhotoRoom không trả về ảnh Gallery.");
      setStates((current) => ({ ...current, [key]: { status: "done", result: json.data } }));
    } catch (error) {
      setStates((current) => ({
        ...current,
        [key]: { status: "error", error: error instanceof Error ? error.message : "Xử lý thất bại." },
      }));
    }
  };

  const run = async () => {
    const queue = Array.from(selected).filter((key) => states[key]?.status !== "done");
    if (!queue.length) return;
    setRunning(true);
    let cursor = 0;
    const worker = async () => {
      while (cursor < queue.length) {
        const key = queue[cursor++];
        await processOne(key);
      }
    };
    // PhotoRoom + Sharp can use a large amount of memory for high-resolution
    // gallery files. Run one item at a time so the local/dev server cannot be
    // killed by two simultaneous image pipelines.
    await worker();
    setRunning(false);
  };

  const apply = () => {
    const replacements = new Map<string, PickedMediaItem>();
    for (const [sourceKey, state] of Object.entries(states)) {
      if (state.status !== "done" || !state.result) continue;
      replacements.set(sourceKey, {
        key: state.result.storageKey,
        url: resolveMediaPreviewSrc(state.result.storageKey) || null,
        name: `PhotoRoom - ${sourceKey.split("/").pop() || "gallery.png"}`,
      });
    }
    onApply(replacements);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Xử lý PhotoRoom cho Gallery</h2>
            <p className="mt-1 text-sm text-slate-500">Ảnh gốc được giữ trong Media Core. Kết quả chỉ thay vào Gallery sau khi bạn bấm Áp dụng.</p>
          </div>
          <button type="button" onClick={onClose} disabled={running} className="rounded-full bg-slate-100 p-2 text-slate-500 disabled:opacity-40"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid min-h-0 flex-1 gap-5 overflow-hidden p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {([
              { key: "backgroundBlur", label: "Làm mờ nền", min: 0, max: 24, suffix: "px" },
              { key: "metalEnhance", label: "Bóng kim loại", min: 0, max: 20, suffix: "%" },
              { key: "shadowOpacity", label: "Shadow", min: 0, max: 20, suffix: "%" },
              { key: "highlight", label: "Highlight", min: -10, max: 20, suffix: "%" },
              { key: "brightness", label: "Độ sáng toàn ảnh", min: -20, max: 40, suffix: "%" },
              { key: "saturation", label: "Saturation", min: 70, max: 130, suffix: "%" },
            ] as Array<{ key: keyof Preset; label: string; min: number; max: number; suffix: string }>).map((control) => (
              <label key={control.key} className="block rounded-xl border border-slate-200 bg-white px-3 py-3">
                <span className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {control.label}
                  <span className="rounded-md bg-violet-50 px-2 py-1 text-violet-700">{preset[control.key]}{control.suffix}</span>
                </span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step="1"
                  value={preset[control.key]}
                  onChange={(event) => setPreset((current) => ({ ...current, [control.key]: Number(event.target.value) }))}
                  disabled={running}
                  className="mt-3 w-full accent-violet-600"
                />
              </label>
            ))}
            <div className="rounded-xl bg-violet-50 px-3 py-3 text-xs leading-5 text-violet-700">Xử lý lần lượt từng ảnh để ổn định bộ nhớ, quota và dễ retry.</div>
          </aside>

          <div className="min-h-0 overflow-y-auto pr-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Đã chọn {selected.size}/{images.length} ảnh</span>
              <button type="button" disabled={running} onClick={() => setSelected(selected.size === images.length - unavailable.size ? new Set() : new Set(keys.filter((key) => !unavailable.has(key))))} className="text-xs font-semibold text-violet-700">{selected.size === images.length - unavailable.size ? "Bỏ chọn tất cả" : "Chọn tất cả"}</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {images.map((item) => {
                const state = states[item.key] ?? { status: "idle" as const };
                const resultKey = state.result?.storageKey;
                const src = resolveMediaPreviewSrc(resultKey || item.key) || undefined;
                const active = selected.has(item.key);
                return (
                  <div key={item.key} className={`overflow-hidden rounded-2xl border bg-white ${active ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}`}>
                    <button type="button" disabled={running} onClick={() => setSelected((current) => { const next = new Set(current); if (next.has(item.key)) next.delete(item.key); else next.add(item.key); return next; })} className="relative block aspect-square w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={item.name || "Gallery"}
                        onError={() => {
                          setUnavailable((current) => new Set(current).add(item.key));
                          setSelected((current) => { const next = new Set(current); next.delete(item.key); return next; });
                        }}
                        className="h-full w-full object-cover"
                      />
                      <span className={`absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full ${active ? "bg-violet-600 text-white" : "bg-white/90 text-slate-400"}`}>{active ? <Check className="h-4 w-4" /> : null}</span>
                      {state.status === "processing" ? <span className="absolute inset-0 grid place-items-center bg-slate-950/45 text-white"><Loader2 className="h-7 w-7 animate-spin" /></span> : null}
                    </button>
                    <div className="min-h-14 px-3 py-2 text-xs">
                      {state.status === "done" ? <span className="font-semibold text-emerald-700">Đã có preview{state.result?.cached ? " · dùng cache" : ""}</span> : null}
                      {state.status === "error" ? <div><div className="line-clamp-2 text-red-600">{state.error}</div><button type="button" onClick={() => void processOne(item.key)} disabled={running} className="mt-1 inline-flex items-center gap-1 font-semibold text-violet-700"><RotateCcw className="h-3 w-3" /> Thử lại</button></div> : null}
                      {unavailable.has(item.key) ? <span className="font-medium text-red-600">Ảnh nguồn không tồn tại</span> : state.status === "idle" ? <span className="text-slate-500">Chờ xử lý</span> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
          <span className="text-sm text-slate-500">{running ? "Đang xử lý…" : completed ? `${completed} ảnh sẵn sàng áp dụng` : "Chưa tạo preview"}</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={running} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">Đóng</button>
            <button type="button" onClick={() => void run()} disabled={running || selected.size === 0} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"><Sparkles className="h-4 w-4" />{running ? "Đang xử lý" : "Tạo preview PhotoRoom"}</button>
            <button type="button" onClick={apply} disabled={running || completed === 0} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Áp dụng vào Gallery</button>
          </div>
        </div>
      </div>
    </div>
  );
}
