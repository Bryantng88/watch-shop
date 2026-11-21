"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import { ADMIN_OPERATION_LIST_STYLE } from "./AdminOperationList";
import styles from "./AdminOperationList.module.css";

export type AdminRowMenuAction = { key: string; label: string; disabled?: boolean; onSelect: () => void };

/** One status/action trigger; editors stay mounted in their domain outside this popup. */
export function AdminRowActionMenu({ label, status, actions, disabled = false, triggerClassName, iconOnly = false }: { label: string; status: ReactNode; actions: AdminRowMenuAction[]; disabled?: boolean; triggerClassName?: string; iconOnly?: boolean }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const focusItems = () => Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => {
    if (!open) return;
    const rect = trigger.current?.getBoundingClientRect();
    const panel = menu.current;
    if (rect && panel) {
      const gutter = F.floating.viewportGutter;
      setPosition({ left: Math.max(gutter, Math.min(rect.right - panel.offsetWidth, innerWidth - panel.offsetWidth - gutter)), top: Math.max(gutter, Math.min(rect.bottom + F.floating.popoverGap, innerHeight - panel.offsetHeight - gutter)) });
    }
    menu.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    const outside = (event: PointerEvent | FocusEvent) => {
      if (event.target instanceof Node && !trigger.current?.contains(event.target) && !menu.current?.contains(event.target)) setOpen(false);
    };
    const scroll = (event: Event) => { if (!(event.target instanceof Node) || !menu.current?.contains(event.target)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", scroll);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", scroll);
    };
  }, [open]);
  return <>
    <AdminButton variant={"quiet"} iconOnly={iconOnly} density="compact" title={iconOnly ? label : undefined} ref={trigger} type="button" className={triggerClassName ?? styles.rowAction} disabled={disabled} aria-label={label} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(value => !value)} onKeyDown={event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
    }}>{!iconOnly && status}<ChevronDown size={F.icon.inline} aria-hidden="true" /></AdminButton>
    {open && createPortal(<div ref={menu} id={id} role="menu" aria-label={label} className={styles.actionMenu} style={{ ...ADMIN_OPERATION_LIST_STYLE, ...position, zIndex: F.layers.popover }} onKeyDown={event => {
      const items = focusItems();
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index - 1 + items.length) % items.length : -1;
      if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
    }}>{actions.map(action => <AdminButton variant="contextual" key={action.key} role="menuitem" type="button" disabled={action.disabled || disabled} onClick={() => { setOpen(false); trigger.current?.focus(); action.onSelect(); }}>{action.label}</AdminButton>)}</div>, document.body)}
  </>;
}
