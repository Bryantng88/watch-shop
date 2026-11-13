"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarDays, Check, Clock3, ExternalLink, Info, Share2 } from "lucide-react";
import { AdminUserAvatar } from "@/domains/shared/ui/admin-design-contract";
import { personalCategoryStyle, type PersonalWorkItem } from "../shared/personal-work.types";
import { isPersonalEvent, personalEventTiming } from "../shared/personal-event";
import { personalWorkCode } from "../shared/personal-work-code";
import { scheduleDate, scheduleTime } from "../shared/personal-work-schedule";
import { personalWorkUpdateLabel } from "../shared/personal-work-update-label";
import { PersonalWorkUpdateHint } from "./PersonalWorkUpdateHint";
import styles from "./PersonalWorkList.module.css";
import { PersonalWorkFloatingPanel } from "./PersonalWorkFloatingPanel";

export function PersonalWorkListRow({ item, now, showDate, late, scheduleLabel, pending, onOpen, onComplete }: {
  item: PersonalWorkItem; now: Date; showDate: boolean; late: boolean; scheduleLabel: string; pending: boolean;
  onOpen: () => void; onComplete: () => void;
}) {
  const event = isPersonalEvent(item.workType), timed = personalEventTiming(item).timed;
  const update = personalWorkUpdateLabel(item, now);
  const code = personalWorkCode(item.id, item.personalWorkNumber, item.workType);
  const [popup, setPopup] = useState<"schedule" | "context" | null>(null);
  const root = useRef<HTMLDivElement>(null), scheduleTrigger = useRef<HTMLButtonElement>(null), contextTrigger = useRef<HTMLButtonElement>(null);
  const closePopup = useCallback(() => setPopup(null), []);
  const accessLabel = item.checklistOnly ? (item.checklist.some(entry => entry.access === "EDITOR") ? "Sửa đầu việc" : "Xem đầu việc") : item.access === "EDITOR" ? "Có thể sửa" : "Chỉ xem";
  const sharedEditable = item.checklistOnly ? item.checklist.some(entry => entry.access === "EDITOR") : item.access === "EDITOR";
  const showSharing = item.sharedWith.length > 0 || item.access !== "OWNER";
  const hasContext = item.tags.length > 0 || item.targets.length > 0 || item.sharedWith.length > 0 || item.access !== "OWNER" || Boolean(item.assignee && item.assignee.id !== item.owner.id);
  const dayStamp = item.dueAt ? scheduleDate(item.dueAt) : "";
  const compactDate = dayStamp ? `${dayStamp.slice(8,10)}/${dayStamp.slice(5,7)}` : "";
  const fullSchedule = `${late ? "Quá hạn · " : ""}${scheduleLabel}${item.estimatedDays > 1 ? ` · ${item.estimatedDays} ngày` : ""}`;
  return <div ref={root} role="listitem" data-work-row={item.id} className={styles.row} onClick={e => { if (!(e.target as HTMLElement).closest("button,a,input,select,textarea")) onOpen(); }}>
    {event ? <span title="Sự kiện không cần hoàn thành" aria-label="Sự kiện không cần hoàn thành" className="grid h-8 w-8 shrink-0 place-items-center text-slate-400"><CalendarDays className="h-4 w-4" /></span> : <button type="button" aria-label={`Đánh dấu hoàn thành ${code}`} disabled={pending || item.access === "VIEWER"} onClick={onComplete} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition focus-visible:ring-2 focus-visible:ring-blue-300 ${item.status === "DONE" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-transparent hover:border-emerald-400 hover:text-emerald-500"}`}><Check className="h-3.5 w-3.5" /></button>}
    <div className={styles.body}>
      <div data-work-headline className={styles.headline}>
        {!item.checklistOnly && <span className={styles.tag} title={event ? "Sự kiện" : item.category.label} style={event ? { backgroundColor: "#f1f5f9", color: "#475569" } : personalCategoryStyle(item.category.color)}>{event ? "Sự kiện" : item.category.label}</span>}
        {showSharing && <button ref={contextTrigger} type="button" aria-label={`Chia sẻ ${code}: ${item.owner.name || item.owner.email}`} aria-expanded={popup === "context"}
          onClick={() => setPopup(popup === "context" ? null : "context")}
          className="inline-flex h-8 shrink-0 items-center rounded px-1 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-300">
          <AdminUserAvatar user={item.owner} size="xs" />
        </button>}
        <button type="button" aria-label={`Mở ${code}: ${item.title}`} title={item.title} onClick={onOpen} className={`${styles.title} focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${item.status === "DONE" ? "text-slate-400 line-through" : "text-slate-950"}`}>{item.title}</button>
        {item.access !== "OWNER" && <span title={accessLabel} aria-label={accessLabel} className="inline-flex shrink-0 items-center gap-1 rounded bg-violet-50 px-1 py-0.5 text-[10px] text-violet-700"><Share2 className="h-3 w-3" />{sharedEditable ? "Sửa" : "Xem"}</span>}
        {hasContext && !showSharing && <button ref={contextTrigger} type="button" aria-label={`Thông tin thêm ${code}`} aria-expanded={popup === "context"} onClick={() => setPopup(popup === "context" ? null : "context")} className="grid h-8 w-8 shrink-0 place-items-center rounded text-slate-400 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-300"><Info className="h-3.5 w-3.5" /></button>}
      </div>
      <div data-work-meta className={styles.meta}>
        {late && <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600" aria-label="Quá hạn" />}
        <button ref={scheduleTrigger} type="button" aria-label={`Lịch ${code}: ${fullSchedule}`} title={fullSchedule} aria-expanded={popup === "schedule"} onClick={() => setPopup(popup === "schedule" ? null : "schedule")} className={`${styles.schedule} focus-visible:ring-2 focus-visible:ring-blue-300`}><Clock3 className="h-3 w-3" />{timed && item.dueAt ? scheduleTime(item.dueAt) : item.dueAt ? "Cả ngày" : "Chưa có lịch"}{showDate && item.dueAt && <span> · {compactDate}</span>}</button>
        {!event && item.progressMode === "CHECKLIST" && item.checklist.length > 0 && <span role="progressbar" aria-label={`Tiến độ ${item.title}`} aria-valuenow={item.progressPercent} aria-valuemin={0} aria-valuemax={100} className={styles.progress} title={`${item.checklist.filter(e => e.isDone).length}/${item.checklist.length} đầu việc · ${item.progressPercent}%`}><span className={styles.track}><span style={{ width: `${item.progressPercent}%` }} /></span><span>{item.checklist.filter(e => e.isDone).length}/{item.checklist.length}<span className={styles.percent}> · {item.progressPercent}%</span></span></span>}
        {update && <PersonalWorkUpdateHint labelClassName={styles.updateLabel} text={item.checklistOnly ? "Đầu việc được chia sẻ vừa cập nhật" : item.activities[0]?.body || update.detail} time={update.label.replace(/^Cập nhật /, "")} />}
        <span data-work-code title={code} className={styles.code}>{code}</span>
      </div>
    </div>
    {popup === "schedule" && <PersonalWorkFloatingPanel anchor={scheduleTrigger.current} onClose={closePopup} label={`Lịch ${code}`} className={styles.popup}><p className="font-medium text-slate-800">{late ? "Quá hạn" : event ? "Lịch sự kiện" : "Lịch công việc"}</p><p>{scheduleLabel}</p>{item.scheduledEndAt && <p>Kết thúc: {new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok" }).format(new Date(item.scheduledEndAt))}</p>}{item.estimatedDays > 1 && <p>Thời lượng: {item.estimatedDays} ngày</p>}</PersonalWorkFloatingPanel>}
    {popup === "context" && <PersonalWorkFloatingPanel anchor={contextTrigger.current} onClose={closePopup} label={`Thông tin thêm ${code}`} className={styles.popup}>
      {item.assignee && item.assignee.id !== item.owner.id && <p>Người thực hiện: {item.assignee.name || "Người thực hiện"}</p>}
      {showSharing && <div>
        <p className="mb-2 text-xs text-slate-500">Người chia sẻ</p>
        <div className="mb-3 flex min-h-8 items-center gap-2"><AdminUserAvatar user={item.owner} size="xs" /><span className="min-w-0 flex-1 truncate" title={item.owner.name || item.owner.email}>{item.owner.name || item.owner.email}</span></div>
        <p className="mb-2 text-xs text-slate-500">Chia sẻ cho</p>
        {item.checklistOnly ? <p>Bạn · {accessLabel}</p> : item.sharedWith.map(share => <div key={share.user.id} className="flex min-h-8 items-center gap-2">
          <AdminUserAvatar user={share.user} size="xs" /><span title={share.user.name || share.user.email} className="min-w-0 flex-1 truncate">{share.user.name || share.user.email}</span><span className="shrink-0 text-xs text-slate-500">{share.accessLevel === "EDITOR" ? "Có thể sửa" : "Chỉ xem"}</span>
        </div>)}
      </div>}
      {item.tags.length > 0 && <p>Tag: {item.tags.join(", ")}</p>}
      {item.targets.map(target => <Link key={`${target.type}:${target.id}`} href={target.href} className="mt-2 flex items-center gap-1 text-blue-700 hover:underline">{target.label}{target.secondary ? ` · ${target.secondary}` : ""}<ExternalLink className="h-3 w-3 shrink-0" /></Link>)}
    </PersonalWorkFloatingPanel>}
  </div>;
}
