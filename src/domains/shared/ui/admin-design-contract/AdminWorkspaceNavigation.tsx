"use client";

import { useRef } from "react";
import Link from "next/link";
import { ADMIN_SPLIT_WORKSPACE as s } from "./AdminSplitWorkspace";

/** Route links are shared by desktop and native narrow selection, including dirty guards. */
export function AdminWorkspaceNavigation({ label, entries, selected }: { label: string; entries: { href: string; label: string }[]; selected: string }) {
  const ref = useRef<HTMLElement>(null);
  return <nav ref={ref} aria-label={label}>
    <div className={s.navigationLinks}><h2 className={s.navigationTitle}>{label}</h2>{entries.map(entry => <Link key={entry.href} href={entry.href} className={s.navigationLink} aria-current={selected === entry.href ? "page" : undefined}>{entry.label}</Link>)}</div>
    <label className={s.navigationSelect}>{label}<select value={selected} onChange={event => {
      const link = Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []).find(item => item.getAttribute("href") === event.target.value);
      link?.click();
    }}>{entries.map(entry => <option value={entry.href} key={entry.href}>{entry.label}</option>)}</select></label>
  </nav>;
}
