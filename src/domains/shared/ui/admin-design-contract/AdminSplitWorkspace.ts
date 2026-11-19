"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ADMIN_UI_FOUNDATION as F } from "./admin-ui.foundation";
import styles from "./AdminSplitWorkspace.module.css";

export const ADMIN_SPLIT_WORKSPACE = styles;
export const ADMIN_SPLIT_WORKSPACE_STYLE = {
  "--admin-split-width": `${F.splitWorkspace.sidebarWidth}px`,
  "--admin-split-gap": `${F.page.splitGap}px`,
  "--admin-split-inset": `${F.splitWorkspace.sidebarInset}px`,
  "--admin-split-divider": F.colors.divider,
} as CSSProperties;

/** Available-width adaptation without containment that would trap fixed dialogs. */
export function useAdminSplitWorkspace<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    const update = () => {
      node.dataset.wide = String(node.clientWidth >= F.splitWorkspace.collapseWidth);
      node.dataset.narrow = String(node.clientWidth < 440);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);
  return ref;
}

