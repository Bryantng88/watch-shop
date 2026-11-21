"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type RefObject } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminSplitResize.module.css";

const spec = F.splitWorkspace.resize;
export const ADMIN_SPLIT_RESIZE = styles;
export const ADMIN_SPLIT_RESIZE_STYLE = {
  "--admin-resize-hit": `${spec.hitArea}px`, "--admin-resize-touch-hit": `${spec.touchHitArea}px`,
  "--admin-resize-line": F.colors.divider, "--admin-resize-grip": F.colors.neutralDot, "--admin-resize-focus": F.colors.focusRing,
} as CSSProperties;

/** Opt-in layout state only: never remount content or alter domain selections. */
export function useAdminSplitResize(layout: RefObject<HTMLElement | null>, storageKey: string, enabled = true) {
  const [width, setWidth] = useState<number>(F.splitWorkspace.sidebarWidth);
  const [maximum, setMaximum] = useState<number>(spec.maxSidebarWidth);
  const [resizing, setResizing] = useState(false);
  const [wide, setWide] = useState(false);
  const expanded = useRef<number>(F.splitWorkspace.sidebarWidth);
  const latest = useRef<number>(F.splitWorkspace.sidebarWidth);
  const drag = useRef<{ id: number; x: number; width: number; previous: number } | null>(null);
  const limit = () => Math.min(spec.maxSidebarWidth, Math.max(spec.minSidebarWidth, (layout.current?.clientWidth ?? F.splitWorkspace.collapseWidth) - spec.minContentWidth - F.page.splitGap));
  const apply = (value: number) => { latest.current = value; if (value > 0) expanded.current = value; setWidth(value); };
  const normalize = (value: number) => value < spec.collapseAt ? 0 : Math.min(limit(), Math.max(spec.minSidebarWidth, value));
  const persist = (value: number) => { try { localStorage.setItem(storageKey, String(value)); localStorage.setItem(`${storageKey}:expanded`, String(value > 0 ? value : expanded.current)); } catch { /* Storage is optional; resizing still works. */ } };
  // Measure/restore during commit so a remounted workspace never paints its narrow defaults.
  useLayoutEffect(() => {
    if (!enabled) return;
    try {
      const restored = Number(localStorage.getItem(`${storageKey}:expanded`));
      if (restored >= spec.minSidebarWidth && restored <= spec.maxSidebarWidth) expanded.current = restored;
      const raw = localStorage.getItem(storageKey);
      const saved = raw === null ? NaN : Number(raw);
      if (Number.isFinite(saved) && (saved === 0 || saved >= spec.minSidebarWidth && saved <= spec.maxSidebarWidth)) { latest.current = saved; if (saved > 0) expanded.current = saved; setWidth(saved); }
    } catch { /* Restricted browser storage uses the default width. */ }
  }, [enabled, storageKey]);
  useLayoutEffect(() => {
    const node = layout.current;
    if (!enabled || !node) return;
    const update = () => { setWide(node.clientWidth >= F.splitWorkspace.collapseWidth); setMaximum(Math.min(spec.maxSidebarWidth, Math.max(spec.minSidebarWidth, node.clientWidth - spec.minContentWidth - F.page.splitGap))); };
    update(); const observer = new ResizeObserver(update); observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, layout]);
  const effectiveWidth = Math.min(width, maximum);
  const toggle = () => { const next = effectiveWidth === 0 ? normalize(expanded.current) : 0; apply(next); persist(next); };
  const props: HTMLAttributes<HTMLDivElement> = {
    role: "separator", tabIndex: 0, "aria-orientation": "vertical", "aria-label": "Điều chỉnh độ rộng menu khu vực",
    "aria-valuemin": 0, "aria-valuemax": maximum, "aria-valuenow": effectiveWidth,
    "aria-valuetext": effectiveWidth === 0 ? "Menu đã thu gọn" : `Menu rộng ${effectiveWidth} pixel`,
    title: "Nhấp tay nắm phía trên để thu/mở menu; kéo để đổi độ rộng. Nhấp đúp để đặt lại. Enter/Space để thu/mở, phím mũi tên để điều chỉnh.",
    onPointerDown: event => {
      if (!enabled || event.button !== 0 || layout.current?.dataset.wide !== "true") return;
      event.preventDefault(); event.currentTarget.focus();
      drag.current = { id: event.pointerId, x: event.clientX, width: effectiveWidth, previous: latest.current };
      event.currentTarget.setPointerCapture(event.pointerId); setResizing(true);
    },
    onPointerMove: event => { if (drag.current?.id === event.pointerId) apply(normalize(drag.current.width + event.clientX - drag.current.x)); },
    onPointerUp: event => {
      if (drag.current?.id !== event.pointerId) return;
      const gripY = event.clientY - event.currentTarget.getBoundingClientRect().top;
      const clicked = Math.abs(event.clientX - drag.current.x) <= 3 && gripY >= 8 && gripY <= 48;
      drag.current = null; setResizing(false);
      if (clicked) toggle(); else persist(latest.current);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel: event => { if (drag.current?.id === event.pointerId) { apply(drag.current.previous); drag.current = null; setResizing(false); } },
    onLostPointerCapture: () => { if (drag.current) { apply(drag.current.previous); drag.current = null; setResizing(false); } },
    onDoubleClick: () => { const value = normalize(F.splitWorkspace.sidebarWidth); apply(value); persist(value); },
    onKeyDown: event => {
      if (event.key === "Escape" && drag.current) {
        const id = drag.current.id; apply(drag.current.previous); drag.current = null; setResizing(false);
        if (event.currentTarget.hasPointerCapture(id)) event.currentTarget.releasePointerCapture(id);
        event.preventDefault(); return;
      }
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); return; }
      const next = event.key === "Home" ? 0 : event.key === "End" ? F.splitWorkspace.sidebarWidth
        : event.key === "ArrowLeft" ? effectiveWidth <= spec.minSidebarWidth ? 0 : effectiveWidth - spec.step
        : event.key === "ArrowRight" ? effectiveWidth === 0 ? spec.minSidebarWidth : effectiveWidth + spec.step : null;
      if (next !== null) { event.preventDefault(); const value = normalize(next); apply(value); persist(value); }
    },
  };
  return { width: effectiveWidth, wide, toggle, resizing, separatorProps: props, style: { ...ADMIN_SPLIT_RESIZE_STYLE, "--admin-split-width": `${effectiveWidth}px` } as CSSProperties };
}
