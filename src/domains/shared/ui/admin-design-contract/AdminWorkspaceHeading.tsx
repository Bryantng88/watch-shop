import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { ADMIN_UI_FOUNDATION as f } from "./admin-ui.foundation";
import s from "./AdminWorkspaceHeading.module.css";

const headingStyle = {
  "--workspace-heading-height": `${f.controls.height}px`,
  "--workspace-heading-touch-height": `${f.controls.touchMinHeight}px`,
  fontFamily: f.fontFamily,
  fontSize: f.typography.sectionTitle.size,
  fontWeight: f.typography.sectionTitle.weight,
  lineHeight: `${f.typography.sectionTitle.lineHeight}px`,
  color: f.colors.text,
} as CSSProperties;

/** Reserve the same title lane with or without actions, including wrapped actions. */
export function AdminWorkspaceHeadingRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(s.row, className)} style={headingStyle}>{children}</div>;
}

export function AdminWorkspaceHeading({ children, navigation = false, compact = false }: { children: ReactNode; navigation?: boolean; compact?: boolean }) {
  return <h2 className={clsx(s.heading, navigation && s.navigation)} style={compact ? { ...headingStyle, fontSize: f.typography.metadata.size, lineHeight: `${f.typography.metadata.lineHeight}px`, fontWeight: 600, minHeight: 24 } : headingStyle}>{children}</h2>;
}
