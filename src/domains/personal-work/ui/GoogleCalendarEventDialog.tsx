"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { AsyncActionButton } from "@/domains/shared/ui/mutation";
import type { PersonalCalendarEvent } from "../shared/personal-work.types";
import { shiftGoogleEventDate, validateGoogleEventEdit, type GoogleEventEditInput } from "../shared/google-event-edit";
import { scheduleDate, scheduleTime } from "../shared/personal-work-schedule";

export function GoogleCalendarEventDialog({ event, onClose, onSaved, saveEvent }: {
  event: PersonalCalendarEvent; onClose: () => void; onSaved: (event: PersonalCalendarEvent) => void;
  saveEvent: (input: GoogleEventEditInput) => Promise<PersonalCalendarEvent>;
}) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [location, setLocation] = useState(event.location || "");
  const [allDay, setAllDay] = useState(event.allDay);
  const [startDate, setStartDate] = useState(event.allDay ? event.startAt.slice(0, 10) : scheduleDate(event.startAt));
  const [endDate, setEndDate] = useState(event.allDay ? shiftGoogleEventDate(event.endAt || shiftGoogleEventDate(event.startAt, 1), -1) : scheduleDate(event.endAt || event.startAt));
  const [startTime, setStartTime] = useState(event.allDay ? "09:00" : scheduleTime(event.startAt));
  const [endTime, setEndTime] = useState(event.allDay ? "10:00" : scheduleTime(event.endAt || event.startAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const close = useRef(onClose);
  close.current = onClose;
  const dialog = useRef<HTMLFormElement>(null);
  const editable = event.canEdit === true && Boolean(event.etag);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>(editable ? "input" : "button")?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); if (!busy.current) close.current(); }
      if (e.key !== "Tab") return;
      const nodes = Array.from(dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href]") || []);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); previous?.focus(); };
  }, [editable]);
  const field = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50 disabled:text-slate-500";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[1px]" onMouseDown={() => { if (!busy.current) onClose(); }}>
    <form ref={dialog} role="dialog" aria-modal="true" aria-labelledby="google-event-title" className="max-h-[calc(100dvh-32px)] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onMouseDown={e => e.stopPropagation()} onSubmit={async e => {
      e.preventDefault(); if (!editable || busy.current) return;
      setError("");
      try {
        const input = { id: event.id, etag: event.etag!, title, description, location, allDay,
          startAt: allDay ? startDate : `${startDate}T${startTime}:00+07:00`,
          endAt: allDay ? shiftGoogleEventDate(endDate, 1) : `${endDate}T${endTime}:00+07:00` };
        validateGoogleEventEdit(input);
        busy.current = true; setSaving(true);
        const updated = await saveEvent(input);
        onSaved(updated);
      } catch (failure) { setError(failure instanceof Error ? failure.message : "Không thể lưu sự kiện"); }
      finally { busy.current = false; setSaving(false); }
    }}>
      <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600">Google Calendar</p><h2 id="google-event-title" className="mt-1 text-lg font-bold">{editable ? "Chỉnh sửa sự kiện" : event.title}</h2></div><button type="button" aria-label="Đóng" disabled={saving} onClick={onClose} className="p-1 text-slate-400"><X className="h-5 w-5" /></button></div>
      {!editable && <p className="text-xs text-slate-500">Sự kiện này chỉ có quyền xem tại đây.</p>}
      {event.recurring && editable && <p className="text-xs text-slate-500">Thay đổi chỉ áp dụng cho lần diễn ra này.</p>}
      <fieldset disabled={!editable || saving} className="space-y-3">
        <label className="block space-y-1 text-xs text-slate-600">Tên sự kiện<input required maxLength={240} value={title} onChange={e => setTitle(e.target.value)} className={field} /></label>
        <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} />Cả ngày</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1 text-xs text-slate-600">Bắt đầu<input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={field} />{!allDay && <input required aria-label="Giờ bắt đầu" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={field} />}</label>
          <label className="space-y-1 text-xs text-slate-600">Kết thúc<input required type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className={field} />{!allDay && <input required aria-label="Giờ kết thúc" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={field} />}</label>
        </div>
        <label className="block space-y-1 text-xs text-slate-600">Địa điểm<input maxLength={500} value={location} onChange={e => setLocation(e.target.value)} className={field} /></label>
        <label className="block space-y-1 text-xs text-slate-600">Ghi chú<textarea rows={3} maxLength={10000} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 text-sm disabled:bg-slate-50" /></label>
      </fieldset>
      {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        {event.htmlLink ? <a href={event.htmlLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-500">Mở Google<ExternalLink className="h-3 w-3" /></a> : <span />}
        <div className="flex gap-2"><button type="button" disabled={saving} onClick={onClose} className="px-3 text-sm text-slate-600">{editable ? "Hủy" : "Đóng"}</button>{editable && <AsyncActionButton type="submit" pending={saving} pendingLabel="Đang lưu…" className="h-9 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white">Lưu thay đổi</AsyncActionButton>}</div>
      </div>
    </form>
  </div>;
}
