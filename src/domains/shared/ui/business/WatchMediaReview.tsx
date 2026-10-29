"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, ChevronDown, Loader2 } from "lucide-react";
import type { WatchPreviewMediaReview } from "@/domains/shared/business/business-entity.types";
import { listPersonalPhotoshootPlansAction, schedulePersonalWatchPhotoshootAction } from "@/domains/personal-work/actions/personal-work.actions";
import type { PersonalPhotoshootInput, PersonalPhotoshootPlan, PersonalPhotoshootResult } from "@/domains/personal-work/shared/personal-photoshoot";
import { scheduleDate, scheduleTime } from "@/domains/personal-work/shared/personal-work-schedule";
import { WatchPreviewGallery } from "./WatchPreviewGallery";

export function WatchMediaReview({ watchId, title, media, onSelect, listPlans = listPersonalPhotoshootPlansAction, schedule = schedulePersonalWatchPhotoshootAction }: {
  watchId: string; title: string; media: WatchPreviewMediaReview; onSelect: () => void;
  listPlans?: (date: string) => Promise<PersonalPhotoshootPlan[]>;
  schedule?: (input: PersonalPhotoshootInput) => Promise<PersonalPhotoshootResult>;
}) {
  const [tab, setTab] = useState<"POOL" | "SELECTED">(media.unselectedCount ? "POOL" : "SELECTED");
  const [planning, setPlanning] = useState(false);
  const [date, setDate] = useState(() => scheduleDate(new Date()));
  const [note, setNote] = useState("");
  const [plans, setPlans] = useState<PersonalPhotoshootPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PersonalPhotoshootResult | null>(null);
  const request = useRef(0);
  const busy = useRef(false);
  useEffect(() => {
    const version = ++request.current;
    let cancelled = false;
    if (!planning || !date || !media.canSchedule) return;
    setLoading(true); setError(""); setSelectedPlan(""); setPlans([]);
    void listPlans(date).then(rows => { if (!cancelled && request.current === version) setPlans(rows); })
      .catch(failure => { if (!cancelled && request.current === version) setError(failure instanceof Error ? failure.message : "Không thể tải việc chụp"); })
      .finally(() => { if (!cancelled && request.current === version) setLoading(false); });
    return () => { cancelled = true; };
  }, [date, planning, listPlans, media.canSchedule]);
  const images = tab === "POOL" ? media.pool : media.selected;
  const inputClass = "h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs disabled:bg-slate-50";
  return <section aria-label="Đánh giá ảnh và lên lịch chụp" className="space-y-2.5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div role="tablist" aria-label="Nguồn ảnh" className="inline-flex gap-1 rounded-lg bg-slate-100 p-1">{([['POOL', 'Pool', media.pool.length], ['SELECTED', 'Đã chọn', media.selected.length]] as const).map(([key, label, count]) => <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`rounded-md px-2.5 py-1 text-xs ${tab === key ? "bg-white font-semibold text-slate-900 shadow-sm" : "text-slate-500"}`}>{label} <span className="ml-1 text-slate-400">{count}</span></button>)}</div>
      {media.canSelect && <Link href={media.selectionHref} onClick={onSelect} className="text-xs font-semibold text-violet-600">Chọn ảnh →</Link>}
    </div>
    <p className="text-[11px] text-slate-500">{tab === "POOL" ? `${media.unselectedCount} ảnh chưa chọn · Dấu ✓ là ảnh đã vào gallery` : "Ảnh gallery và cover đang được chọn"}</p>
    <WatchPreviewGallery key={`${tab}:${images.map(image => image.id).join("|")}`} images={images} title={title} label={tab === "POOL" ? "Ảnh trong pool" : "Ảnh đã chọn"} showHeader={false} />
    {media.canSchedule && <div className="border-t border-slate-100 pt-2">
      <button type="button" aria-expanded={planning} aria-controls="watch-photoshoot-plan" onClick={() => { if (!busy.current) setPlanning(open => !open); }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700"><Camera className="h-3.5 w-3.5" />Tạo task media · Chụp ảnh<ChevronDown className={`h-3 w-3 transition ${planning ? "rotate-180" : ""}`} /></button>
      {planning && <form id="watch-photoshoot-plan" className="mt-2 space-y-2" onSubmit={async event => {
        event.preventDefault(); if (busy.current || loading) return;
        busy.current = true; setSaving(true); setError("");
        try {
          const saved = await schedule({ watchId, date, note, taskItemId: selectedPlan || (plans.length === 1 ? plans[0].id : undefined) });
          setResult(saved); setPlanning(false); setNote("");
        } catch (failure) { setError(failure instanceof Error ? failure.message : "Không thể lên lịch chụp"); }
        finally { busy.current = false; setSaving(false); }
      }}>
        <div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-2 text-xs text-slate-600">Ngày chụp<input required type="date" value={date} disabled={saving} onChange={e => setDate(e.target.value)} className={inputClass} /></label>
          <button type="submit" disabled={saving || loading || !date || (plans.length > 1 && !selectedPlan)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white disabled:opacity-50">{saving && <Loader2 className="h-3 w-3 animate-spin" />}{saving ? "Đang lưu…" : plans.length ? "Thêm vào việc chụp" : "Tạo việc chụp"}</button>
        </div>
        {loading ? <p className="text-[11px] text-slate-400">Đang tìm việc chụp trong ngày…</p> : plans.length > 1 ? <select required aria-label="Việc chụp trong ngày" value={selectedPlan} disabled={saving} onChange={e => setSelectedPlan(e.target.value)} className={`${inputClass} w-full`}><option value="">Chọn việc chụp trong ngày</option>{plans.map(plan => <option key={plan.id} value={plan.id}>{plan.title}{plan.scheduledEndAt ? ` · ${scheduleTime(plan.dueAt)}` : ""} · {plan.watchCount} watch</option>)}</select> : <p className="text-[11px] text-slate-500">{plans.length === 1 ? `Sẽ thêm vào “${plans[0].title}” · ${plans[0].watchCount} watch` : "Chưa có việc chụp trong ngày; sẽ tạo trong Công việc của tôi."}</p>}
        <textarea aria-label="Yêu cầu chụp" rows={2} maxLength={2000} value={note} disabled={saving} onChange={e => setNote(e.target.value)} placeholder="Yêu cầu chụp: thiếu góc mặt sau, ảnh bị phản sáng…" className="w-full resize-none rounded-lg border border-slate-200 p-2 text-xs" />
        {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      </form>}
      {result && <div role="status" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs"><span className="text-emerald-700">{result.outcome === "ALREADY_LINKED" ? "Watch đã có trong" : result.outcome === "UPDATED" ? "Đã cập nhật yêu cầu trong" : "Đã lưu vào"} {result.title} · {result.watchCount} watch</span><Link href={`/admin/personal-work?work=${encodeURIComponent(result.id)}`} onClick={onSelect} className="font-semibold text-violet-600">Mở việc →</Link></div>}
    </div>}
  </section>;
}
