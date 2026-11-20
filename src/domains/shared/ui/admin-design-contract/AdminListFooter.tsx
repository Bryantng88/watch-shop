"use client";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminButton } from "./AdminButton";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import s from "./AdminListFooter.module.css";

/** Presentation only: consumers retain query construction, paging and load-more semantics. */
export function AdminListFooter({ total, unit, totalLabel = "Tổng", page, totalPages, pending = false, previousHref, nextHref, onPrevious, onNext, previousLabel = "Trang trước", nextLabel = "Trang sau", detail, actions }: {
  total: number; unit: string; totalLabel?: string; page?: number; totalPages?: number; pending?: boolean;
  previousHref?: string; nextHref?: string; onPrevious?: () => void; onNext?: () => void;
  previousLabel?: string; nextLabel?: string; detail?: ReactNode; actions?: ReactNode;
}) {
  const paged = page !== undefined && totalPages !== undefined;
  const control = (previous: boolean) => {
    const disabled = pending || (previous ? page! <= 1 : page! >= totalPages!);
    const href = previous ? previousHref : nextHref;
    const label = previous ? previousLabel : nextLabel;
    const icon = previous ? <ChevronLeft size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />;
    return href ? <Link href={href} aria-label={label} aria-disabled={disabled} tabIndex={disabled ? -1 : undefined} className={s.arrow} onClick={event => { if (disabled) event.preventDefault(); }}>{icon}</Link>
      : <AdminButton type="button" variant="quiet" iconOnly density="compact" className={s.arrow} aria-label={label} disabled={disabled} onClick={previous ? onPrevious : onNext}>{icon}</AdminButton>;
  };
  const style = { "--footer-font": F.fontFamily, "--footer-muted": F.colors.muted, "--footer-text": F.colors.text, "--footer-soft": F.colors.softSurface, "--footer-ring": F.colors.focusRing, "--footer-touch": `${F.controls.touchMinHeight}px` } as CSSProperties;
  return <div className={s.footer} style={style} aria-busy={pending}>
    <div className={s.summary}><p>{totalLabel}: <strong>{total.toLocaleString("vi-VN")}</strong> {unit}{paged && <> · <span>Trang {page.toLocaleString("vi-VN")}/{Math.max(1, totalPages).toLocaleString("vi-VN")}</span></>}</p>{detail && <div className={s.detail}>{detail}</div>}</div>
    {(paged || actions) && <div className={s.actions}>{paged && <nav aria-label="Phân trang" className={s.pager}>{control(true)}{control(false)}</nav>}{actions}</div>}
  </div>;
}
