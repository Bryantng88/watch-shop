"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Kept outside the scrolling list so the last row's details remain reachable. */
export function PersonalWorkFloatingPanel({ anchor, children, onClose, role = "group", label, id, className, focusOnOpen = true }: {
  anchor: HTMLElement | null; children: ReactNode; onClose: () => void;
  role?: "group" | "tooltip"; label?: string; id?: string; className?: string; focusOnOpen?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null), focused = useRef(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    if (!anchor || !panel.current) return;
    const bounds = anchor.getBoundingClientRect(), box = panel.current.getBoundingClientRect();
    const left = Math.max(12, Math.min(bounds.right - box.width, window.innerWidth - box.width - 12));
    const top = bounds.bottom + box.height + 8 <= window.innerHeight ? bounds.bottom + 4 : Math.max(12, bounds.top - box.height - 4);
    setPosition({ left, top });
    const outside = (e: PointerEvent) => { if (!panel.current?.contains(e.target as Node) && !anchor.contains(e.target as Node)) onClose(); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { onClose(); if (role !== "tooltip" && focusOnOpen) anchor.focus(); } };
    const scroll = (e: Event) => { if (!panel.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape); window.addEventListener("resize", onClose); window.addEventListener("scroll", scroll, true);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); window.removeEventListener("resize", onClose); window.removeEventListener("scroll", scroll, true); };
  }, [anchor, onClose, role, focusOnOpen]);
  useLayoutEffect(() => {
    if (!position || role !== "group" || !focusOnOpen || focused.current) return;
    focused.current = true;
    const first = panel.current?.querySelector<HTMLElement>("button:not(:disabled),select:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href]");
    (first || panel.current)?.focus({ preventScroll: true });
  }, [position, role, focusOnOpen]);
  return createPortal(<div ref={panel} tabIndex={role === "group" ? -1 : undefined} id={id} role={role} aria-label={label} className={className} onClick={e => e.stopPropagation()}
    style={{ position: "fixed", zIndex: 80, left: position?.left ?? 12, top: position?.top ?? 12, width: role === "tooltip" ? 224 : 272, maxWidth: "calc(100vw - 24px)", visibility: position ? "visible" : "hidden" }}>{children}</div>, document.body);
}
