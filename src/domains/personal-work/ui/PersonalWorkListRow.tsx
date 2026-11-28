"use client";
import { isContinuousWork } from "../shared/continuous-work";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { WorkObjectThumbnail } from "@/domains/shared/ui/work-object/WorkObjectThumbnail";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Ban, Clock3, ExternalLink, Info } from "lucide-react";
import { AdminUserAvatar } from "@/domains/shared/ui/admin-design-contract";
import { personalCategoryStyle, type PersonalWorkItem } from "../shared/personal-work.types";
import { isPersonalEvent, personalEventTiming } from "../shared/personal-event";
import { personalWorkCode } from "../shared/personal-work-code";
import { scheduleDate, scheduleTime } from "../shared/personal-work-schedule";
import { personalWorkUpdateLabel } from "../shared/personal-work-update-label";
import { PersonalWorkUpdateHint } from "./PersonalWorkUpdateHint";
import styles from "./PersonalWorkList.module.css";
import { PersonalWorkFloatingPanel } from "./PersonalWorkFloatingPanel";

export function PersonalWorkListRow({ item, now, showDate, late, scheduleLabel, justCompleted = false, onOpen }: {
  item: PersonalWorkItem; now: Date; showDate: boolean; late: boolean; scheduleLabel: string; pending: boolean;
  completionPending?: boolean; justCompleted?: boolean;
  onOpen: () => void; onComplete: () => void;
}) {
  const continuous=isContinuousWork(item.workType);
  const event = isPersonalEvent(item.workType), timed = personalEventTiming(item).timed;
  const update = personalWorkUpdateLabel(item, now);
  const code = personalWorkCode(item.id, item.personalWorkNumber, item.workType);
  const [popup, setPopup] = useState<"schedule" | "context" | null>(null);
  const root = useRef<HTMLDivElement>(null), scheduleTrigger = useRef<HTMLButtonElement>(null), contextTrigger = useRef<HTMLButtonElement>(null);
  const closePopup = useCallback(() => setPopup(null), []);
  const accessLabel = item.status==="CANCELLED"?"Đã hủy · Chỉ xem":item.checklistOnly ? (item.checklist.some(entry => entry.access === "EDITOR") ? "Sửa đầu việc" : "Xem đầu việc") : item.access === "EDITOR" ? "Có thể sửa" : "Chỉ xem";
  const showSharing = item.sharedWith.length > 0 || item.access !== "OWNER";
  const hasContext = item.tags.length > 0 || item.targets.length > 0 || item.sharedWith.length > 0 || item.access !== "OWNER" || Boolean(item.assignee && item.assignee.id !== item.owner.id);
  const dayStamp = item.dueAt ? scheduleDate(item.dueAt) : "";
  const compactDate = dayStamp ? `${dayStamp.slice(8,10)}/${dayStamp.slice(5,7)}` : "";
  const rowObject=item.targets.find(target=>target.imageUrl)||item.targets[0];
  const fullSchedule = `${late ? "Quá hạn · " : ""}${scheduleLabel}${item.estimatedDays > 1 ? ` · ${item.estimatedDays} ngày` : ""}`;
  return <div ref={root} role="listitem" data-work-row={item.id} className={`${styles.row} ${justCompleted ? "rounded-lg bg-emerald-50/70 transition-colors motion-reduce:transition-none" : ""}`} onClick={e => { if (!(e.target as HTMLElement).closest("button,a,input,select,textarea")) onOpen(); }}>
    {item.status==="CANCELLED" ? <span aria-label="Đã hủy" className="grid h-8 w-8 shrink-0 place-items-center text-slate-400"><Ban className="h-4 w-4"/></span> : null}
    {rowObject&&<WorkObjectThumbnail object={rowObject}/>}
    <div className={styles.body}>
      <div data-work-headline className={styles.headline}>
        {!item.checklistOnly && <span className={styles.tag} title={event ? "Sự kiện" : item.category.label} style={event ? { backgroundColor: "#f1f5f9", color: "#475569" } : personalCategoryStyle(item.category.color)}>{event ? "Sự kiện" : item.category.label}</span>}
        {showSharing && <AdminButton variant="contextual" density="compact" ref={contextTrigger} type="button" aria-label={`Chia sẻ ${code}: ${item.owner.name || item.owner.email}`} aria-expanded={popup === "context"}
          onClick={() => setPopup(popup === "context" ? null : "context")}
          className="inline-flex h-8 shrink-0 items-center rounded px-1 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-300">
          <AdminUserAvatar user={item.owner} size="sm" className="ring-1 ring-slate-200" />
        </AdminButton>}
        <AdminButton variant="contextual" type="button" aria-label={`Mở ${code}: ${item.title}`} title={item.title} onClick={onOpen} className={`${styles.title} focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${item.status === "DONE" ? "text-slate-400 line-through" : "text-slate-950"}`}><span className={styles.titleText}>{item.title}</span>{!event&&!continuous&&item.status!=="CANCELLED"&&<span role="img" aria-label={item.status==="DONE"?"Đã hoàn thành":late?"Quá hạn":"Đang mở"} title={item.status==="DONE"?"Đã hoàn thành":late?"Quá hạn":"Đang mở"} className={`${styles.statusDot} ${item.status==="DONE"?styles.statusDone:late?styles.statusLate:styles.statusOpen}`}/>}</AdminButton>

        {hasContext && !showSharing && <AdminButton iconOnly variant="contextual" density="compact" ref={contextTrigger} type="button" aria-label={`Thông tin thêm ${code}`} aria-expanded={popup === "context"} onClick={() => setPopup(popup === "context" ? null : "context")} className="grid h-8 w-8 shrink-0 place-items-center rounded text-slate-400 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-300"><Info className="h-3.5 w-3.5" /></AdminButton>}
      </div>
      <div data-work-meta className={styles.meta}>
        {item.status==="CANCELLED"?<span className="text-xs text-slate-500" title={item.cancellationReason||undefined}>Đã hủy{item.cancelledAt?" · "+new Date(item.cancelledAt).toLocaleDateString("vi-VN"):""}{item.cancelledBy?" · "+(item.cancelledBy.name||item.cancelledBy.email):""}</span>:continuous?<span className="text-xs text-slate-500">Duy trì liên tục</span>:(<AdminButton variant="contextual" ref={scheduleTrigger} type="button" aria-label={`Lịch ${code}: ${fullSchedule}`} title={fullSchedule} aria-expanded={popup === "schedule"} onClick={() => setPopup(popup === "schedule" ? null : "schedule")} className={`${styles.schedule} focus-visible:ring-2 focus-visible:ring-blue-300`}><Clock3 className="h-3 w-3" />{timed && item.dueAt ? scheduleTime(item.dueAt) : item.dueAt ? "Cả ngày" : "Chưa có lịch"}{showDate && item.dueAt && <span> · {compactDate}</span>}</AdminButton>)}
        {update && <PersonalWorkUpdateHint labelClassName={styles.updateLabel} text={item.checklistOnly ? "Đầu việc được chia sẻ vừa cập nhật" : item.activities[0]?.body || update.detail} time={update.label.replace(/^Cập nhật /, "")} />}
        <span data-work-code title={code} className={styles.code}>{code}</span>
      </div>
    </div>
        {!continuous&&!event && item.progressMode === "CHECKLIST" && item.checklist.length > 0 && <span role="progressbar" aria-label={`Tiến độ ${item.title}`} aria-valuenow={item.progressPercent} aria-valuemin={0} aria-valuemax={100} className={styles.progress} title={`${item.checklist.filter(e => e.isDone).length}/${item.checklist.length} đầu việc · ${item.progressPercent}%`}><span className={styles.track}><span style={{ width: `${item.progressPercent}%` }} /></span><span>{item.checklist.filter(e => e.isDone).length}/{item.checklist.length}<span className={styles.percent}> · {item.progressPercent}%</span></span></span>}
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
      {item.targets.map(target => <Link key={`${target.type}:${target.id}`} href={target.href} className="mt-2 flex items-center gap-2 text-blue-700 hover:underline"><WorkObjectThumbnail object={target}/>{target.label}{target.secondary ? ` · ${target.secondary}` : ""}<ExternalLink className="h-3 w-3 shrink-0" /></Link>)}
    </PersonalWorkFloatingPanel>}
  </div>;
}
