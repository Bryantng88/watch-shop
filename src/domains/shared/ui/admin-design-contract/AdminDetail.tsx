"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ADMIN_UI_FOUNDATION as f } from "./admin-ui.foundation";
import { AdminWorkspaceHeading, AdminWorkspaceHeadingRow } from "./AdminWorkspaceHeading";
import styles from "./AdminDetail.module.css";
export { styles as ADMIN_DETAIL };
const detailStyle = {
  "--detail-font": f.fontFamily, "--detail-width": `${f.page.detailMaxWidth}px`,
  "--detail-gutter": `${f.page.desktopPaddingX}px`, "--detail-mobile-gutter": `${f.page.mobilePaddingX}px`,
  "--detail-gap": `${f.page.splitGap}px`, "--detail-sidebar": `${f.page.detailSidebarWidth}px`,
  "--detail-text": f.colors.text, "--detail-body": f.colors.body, "--detail-muted": f.colors.muted,
  "--detail-line": f.colors.divider, "--detail-focus": f.colors.focusSurface, "--detail-link": f.colors.link,
  "--detail-success": f.colors.success, "--detail-success-soft": f.colors.successSurface, "--detail-danger": f.colors.danger, "--detail-border": f.colors.controlBorder, "--detail-soft": f.colors.softSurface, "--detail-canvas": f.colors.canvas, "--detail-ring": f.colors.focusRing,
} as CSSProperties;
/** Record pages own one centered frame. Dialogs/portals are never contained. */
export function AdminDetailPage({ children, surface = "plain", emphasis = false }: { children: ReactNode; surface?: "plain" | "record"; emphasis?: boolean }) {
  const pageRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const page = pageRef.current;
    const frame = page?.firstElementChild;
    if (!page || !frame) return;
    const measure = () => { page.dataset.detailWide = String(frame.clientWidth >= 1200); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);
  return <main ref={pageRef} data-admin-detail="page" data-detail-surface={surface} data-detail-emphasis={emphasis} className={styles.page} style={detailStyle}><div data-detail-frame className={styles.frame}>{surface === "record" ? <div data-detail-record className={styles.recordSurface}>{children}</div> : children}</div></main>;
}
export function AdminDetailSectionHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <AdminWorkspaceHeadingRow className={styles.sectionHeader}><div><AdminWorkspaceHeading>{title}</AdminWorkspaceHeading>{description && <p className={styles.metadata}>{description}</p>}</div>{actions && <div className={styles.actions}>{actions}</div>}</AdminWorkspaceHeadingRow>;
}
export function AdminDetailSection({ id, title, description, actions, children }: { id?: string; title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return <section data-detail-section id={id} className={styles.section}><AdminDetailSectionHeader title={title} description={description} actions={actions}/><div className={styles.sectionBody}>{children}</div></section>;
}
export function AdminDetailNavigation({ entries }: { entries: { href: string; label: string }[] }) {
  return <nav className={styles.tabs} aria-label="Các phần chi tiết">{entries.map(entry => <a className={styles.tabLink} key={entry.href} href={entry.href}>{entry.label}</a>)}</nav>;
}
