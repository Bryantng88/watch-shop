"use client";

import { cloneElement, useEffect, useId, useRef, useState, type CSSProperties, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { PERSONAL_WORK_TYPES, type PersonalCalendarEvent, type PersonalWorkItem } from "../shared/personal-work.types";
import { scheduleDate, scheduleTime } from "../shared/personal-work-schedule";
import styles from "./PersonalCalendarPreview.module.css";

const statusLabels = { TODO: "Chưa bắt đầu", IN_PROGRESS: "Đang làm", DONE: "Hoàn thành", CANCELLED: "Đã hủy" };

function eventTime(event: PersonalCalendarEvent) {
  const date = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Bangkok", day: "2-digit", month: "2-digit", year: "numeric" });
  if (event.allDay) {
    const start = date.format(new Date(`${event.startAt.slice(0, 10)}T00:00:00+07:00`));
    const last = event.endAt ? new Date(Date.parse(`${event.endAt.slice(0, 10)}T00:00:00+07:00`) - 86400000) : null;
    return last && scheduleDate(last) !== event.startAt.slice(0, 10) ? `${start} – ${date.format(last)} · Cả ngày` : `${start} · Cả ngày`;
  }
  const start = `${date.format(new Date(event.startAt))} · ${scheduleTime(event.startAt)}`;
  if (!event.endAt) return start;
  return `${start} – ${scheduleDate(event.startAt) === scheduleDate(event.endAt) ? "" : `${date.format(new Date(event.endAt))} · `}${scheduleTime(event.endAt)}`;
}

export function PersonalCalendarPreview({ event, item, children }: {
  event: PersonalCalendarEvent;
  item?: PersonalWorkItem | null;
  children: ReactElement<{ "aria-describedby"?: string; title?: string }>;
}) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const preview = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const close = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!anchor.current?.contains(document.activeElement)) setPosition(null);
    }, 120);
  };
  const open = () => {
    cancelClose();
    const rect = anchor.current?.getBoundingClientRect();
    if (!rect) return;
    const above = rect.bottom + 160 > window.innerHeight && rect.top > 160;
    setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - 292)),
      ...(above ? { bottom: window.innerHeight - rect.top + 8, maxHeight: rect.top - 20 } : { top: rect.bottom + 8, maxHeight: Math.max(110, window.innerHeight - rect.bottom - 20) }),
    });
  };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    if (!position) return;
    const dismiss = () => setPosition(null);
    const scroll = (event: Event) => { if (!(event.target instanceof Node) || !preview.current?.contains(event.target)) dismiss(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { dismiss(); event.stopPropagation(); } };
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("keydown", escape, true);
    return () => { window.removeEventListener("resize", dismiss); window.removeEventListener("scroll", scroll, true); window.removeEventListener("keydown", escape, true); };
  }, [position]);

  const typeLabel = item?.workType
    ? PERSONAL_WORK_TYPES[item.domain].find(type => type.key === item.workType)?.label || item.workType
    : item ? "Chưa chọn loại việc" : "Sự kiện Google";
  const fallbackTitle = `${event.title}\nNhóm: ${item?.category.label || "Google Calendar"}\nLoại việc: ${typeLabel}\n${eventTime(event)}`;
  return <span ref={anchor} className={styles.anchor} onMouseEnter={open} onMouseLeave={close}
    onClickCapture={click => { if (anchor.current?.contains(click.target as Node)) { cancelClose(); setPosition(null); } }}
    onFocusCapture={open} onBlurCapture={() => { cancelClose(); setPosition(null); }}
    onKeyDown={key => { if (key.key === "Escape" && position) { setPosition(null); key.stopPropagation(); } }}>
    {cloneElement(children, { "aria-describedby": position ? id : undefined, title: position ? undefined : fallbackTitle })}
    {position && createPortal(<aside ref={preview} id={id} role="tooltip" className={styles.preview} style={position} onMouseEnter={cancelClose} onMouseLeave={close} onClick={click => click.stopPropagation()} onMouseDown={click => click.stopPropagation()}>
      <p className={styles.title}>{event.title}</p>
      <p className={styles.subline}>
        {item?.category.label || "Google Calendar"}{item?.workType && <> · {typeLabel}</>}
      </p>
      <p className={styles.time}>{eventTime(event)}</p>
      {item && <div className={styles.footer}>
        <span>{statusLabels[item.status]}</span>
        {item.checklist.length > 0 && <span>· {item.checklist.filter(entry => entry.isDone).length}/{item.checklist.length} đầu việc</span>}
        {item.priority === "URGENT" && <span className="text-rose-600">· Khẩn</span>}
        {item.priority === "HIGH" && <span className="text-amber-700">· Ưu tiên cao</span>}
        {item.access === "VIEWER" && <span>· Chỉ xem</span>}
      </div>}
      {event.location && <p className={styles.note} title={event.location}>{event.location}</p>}
      {event.description && <p className={styles.note}>{event.description.slice(0, 100)}</p>}
    </aside>, document.body)}
  </span>;
}
