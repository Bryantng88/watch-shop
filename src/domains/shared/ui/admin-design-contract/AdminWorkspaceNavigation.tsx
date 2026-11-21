"use client";

import { ADMIN_UI_FOUNDATION as f } from "./admin-ui.foundation";
import { useRef, type ReactNode, type CSSProperties } from "react";
import { AdminWorkspaceHeading } from "./AdminWorkspaceHeading";
import Link from "next/link";
import { ADMIN_SPLIT_WORKSPACE as s } from "./AdminSplitWorkspace";

export const ADMIN_WORKSPACE_NAVIGATION_STYLE = { "--admin-nav-size": `${f.typography.navigation.size}px` } as CSSProperties;

/** Route links are shared by desktop and native narrow selection, including dirty guards. */
export function AdminWorkspaceNavigation({ label, entries, selected, compact = false, selectedNavigation, nestedWide = true }: { selectedNavigation?: ReactNode; nestedWide?: boolean; compact?: boolean; label: string; entries: { href: string; label: string; icon?: ReactNode; count?: number }[]; selected: string }) {
  const ref = useRef<HTMLElement>(null);
  return <nav ref={ref} aria-label={label} className={compact ? s.filterNavigation : undefined} style={ADMIN_WORKSPACE_NAVIGATION_STYLE}>
    <div className={s.navigationLinks}><AdminWorkspaceHeading navigation compact={compact}>{label}</AdminWorkspaceHeading>{entries.map(entry => <div key={entry.href}><Link href={entry.href} className={s.navigationLink} data-has-navigation={selected === entry.href && Boolean(selectedNavigation) || undefined} aria-current={selected === entry.href ? "page" : undefined}>{entry.icon && <span className={s.navigationIcon} aria-hidden="true">{entry.icon}</span>}<span>{entry.label}</span>{entry.count !== undefined && <span className={s.navigationCount}>{entry.count.toLocaleString("vi-VN")}</span>}</Link>{nestedWide && selected === entry.href && selectedNavigation ? <div className={s.nestedNavigation}>{selectedNavigation}</div> : null}</div>)}</div>
    <label className={s.navigationSelect}>{label}<select value={selected} onChange={event => {
      const link = Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []).find(item => item.getAttribute("href") === event.target.value);
      link?.click();
    }}>{entries.map(entry => <option value={entry.href} key={entry.href}>{entry.label}{entry.count !== undefined ? ` (${entry.count.toLocaleString("vi-VN")})` : ""}</option>)}</select></label>
    {!nestedWide && selectedNavigation ? <div className={s.nestedMobile}>{selectedNavigation}</div> : null}
  </nav>;
}
