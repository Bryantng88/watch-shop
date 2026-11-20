"use client";

import { useRef, type ReactNode } from "react";
import { AdminWorkspaceHeading } from "./AdminWorkspaceHeading";
import Link from "next/link";
import { ADMIN_SPLIT_WORKSPACE as s } from "./AdminSplitWorkspace";

/** Route links are shared by desktop and native narrow selection, including dirty guards. */
export function AdminWorkspaceNavigation({ label, entries, selected }: { label: string; entries: { href: string; label: string; icon?: ReactNode }[]; selected: string }) {
  const ref = useRef<HTMLElement>(null);
  return <nav ref={ref} aria-label={label}>
    <div className={s.navigationLinks}><AdminWorkspaceHeading navigation>{label}</AdminWorkspaceHeading>{entries.map(entry => <Link key={entry.href} href={entry.href} className={s.navigationLink} aria-current={selected === entry.href ? "page" : undefined}>{entry.icon && <span className={s.navigationIcon} aria-hidden="true">{entry.icon}</span>}<span>{entry.label}</span></Link>)}</div>
    <label className={s.navigationSelect}>{label}<select value={selected} onChange={event => {
      const link = Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []).find(item => item.getAttribute("href") === event.target.value);
      link?.click();
    }}>{entries.map(entry => <option value={entry.href} key={entry.href}>{entry.label}</option>)}</select></label>
  </nav>;
}
