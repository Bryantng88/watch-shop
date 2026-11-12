"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, X, Loader2 } from "lucide-react";
import type { PersonalWorkShare, PersonalWorkUser } from "../shared/personal-work.types";

export function PersonalChecklistShare({ users, shares, onSave }: {
  users: PersonalWorkUser[];
  shares: PersonalWorkShare[];
  onSave: (shares: PersonalWorkShare[]) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(shares);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pending = useRef(false);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node) && !pending.current) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending.current) {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  async function save(next: PersonalWorkShare[]) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    const previous = draft;
    setDraft(next);
    try { await onSave(next); }
    catch (cause) {
      setDraft(previous);
      setError(cause instanceof Error ? cause.message : "Chưa lưu được chia sẻ. Thử lại nhé.");
    } finally { pending.current = false; setBusy(false); }
  }

  return <span ref={root} className="relative shrink-0">
    <button ref={trigger} type="button" aria-label="Chia sẻ đầu việc" aria-expanded={open} aria-haspopup="dialog"
      title={shares.length ? shares.map(s => s.user.name || s.user.email).join(", ") : "Chia sẻ đầu việc"}
      onClick={() => { if (!busy) { setDraft(shares); setError(""); setOpen(!open); } }}
      className={`inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md hover:bg-slate-100 ${shares.length ? "text-violet-600" : "text-slate-400"}`}>
      <Share2 className="h-3.5 w-3.5" />{shares.length > 0 && <span className="text-xs">{shares.length}</span>}
    </button>
    {open && <span role="dialog" aria-label="Chia sẻ đầu việc" aria-busy={busy}
      className="absolute right-0 top-full z-40 mt-1 block w-64 max-w-[80vw] rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
      <span className="flex items-center gap-1">
        <select autoFocus aria-label="Thêm người xem đầu việc" value="" disabled={busy} onChange={event => {
          const user = users.find(u => u.id === event.target.value);
          if (user && !draft.some(s => s.user.id === user.id)) void save([...draft, { user, accessLevel: "VIEWER" }]);
        }} className="h-8 min-w-0 flex-1 rounded-md bg-slate-50 px-2 text-xs outline-none focus:ring-2 focus:ring-slate-200">
          <option value="">+ Chia sẻ đầu việc</option>
          {users.filter(u => !draft.some(s => s.user.id === u.id)).map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
        </select>
        <button type="button" disabled={busy} aria-label="Đóng chia sẻ đầu việc" onClick={() => { setOpen(false); trigger.current?.focus(); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-50">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
        </button>
      </span>
      {draft.length > 0 && <span className="mt-1 block max-h-48 overflow-y-auto">{draft.map(share => {
        const name = share.user.name || share.user.email;
        return <span key={share.user.id} className="flex h-9 items-center gap-1">
          <span title={name} className="min-w-0 flex-1 truncate pl-2 text-xs text-slate-700">{name}</span>
          <select aria-label={`Quyền đầu việc của ${name}`} disabled={busy} value={share.accessLevel}
            onChange={event => void save(draft.map(s => s.user.id === share.user.id ? { ...s, accessLevel: event.target.value as "VIEWER" | "EDITOR" } : s))}
            className="h-8 max-w-28 rounded-md bg-transparent text-xs text-slate-500 outline-none focus:ring-2 focus:ring-slate-200">
            <option value="VIEWER">Chỉ xem</option><option value="EDITOR">Cập nhật</option>
          </select>
          <button type="button" disabled={busy} aria-label={`Bỏ chia sẻ đầu việc với ${name}`} onClick={() => void save(draft.filter(s => s.user.id !== share.user.id))}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600"><X className="h-3 w-3" /></button>
        </span>;
      })}</span>}
      {error && <span role="alert" className="mt-1 block px-2 text-xs text-rose-700">{error}</span>}
      <span role="status" className="sr-only">{busy ? "Đang lưu chia sẻ" : "Thay đổi chia sẻ được lưu tự động"}</span>
    </span>}
  </span>;
}
